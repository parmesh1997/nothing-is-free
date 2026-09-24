"""
Unseen — style frame 01: "the first moment of a safety match".

    blender -b --python styleframe_match.py -- <out.png> [--res 1920x1080] [--samples 64] [--engine CYCLES|EEVEE]
    python3 styleframe_match.py <out.png> ...          (with the `bpy` pip module)

Builds the whole shot from code, the way every Unseen location will be built:
  · a seamless slate cyclorama (the channel's constant "studio")
  · one hero object, cut in half along a plane facing the camera — the cut is the signature
  · matte "clay" materials, no photoreal textures, 5–7 hues per object
  · one warm story light (the sparks) against a cool studio
  · real camera depth of field

Writes <out.png> and <out>.anchors.json (screen positions of the label anchors) — the same
contract Someone Always Pays uses between Blender and Remotion: Blender draws the object,
Remotion draws every word and line.
"""
import json
import math
import os
import sys

import bpy  # first: bmesh and mathutils come with it
import bmesh
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Matrix, Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
out = os.path.abspath(argv[0] if argv else "styleframe_match.png")
opt = {argv[i]: argv[i + 1] for i in range(1, len(argv) - 1, 2)}
W, H = map(int, opt.get("--res", "1920x1080").split("x"))
SAMPLES = int(opt.get("--samples", "64"))
ENGINE = opt.get("--engine", "CYCLES")

# ── reset ────────────────────────────────────────────────────────────────────
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def hexrgb(h, a=1.0):
    h = h.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


# ── materials: matte clay, one idea each ─────────────────────────────────────
def clay(name, color, rough=0.6, bump=0.0, bump_scale=40.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = hexrgb(color)
    p.inputs["Roughness"].default_value = rough
    if bump:
        n = nt.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value = bump_scale
        b = nt.nodes.new("ShaderNodeBump")
        b.inputs["Strength"].default_value = bump
        nt.links.new(n.outputs["Fac"], b.inputs["Height"])
        nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    return m


def speckled(name, base, specks, rough=0.7, scale=90.0, size=0.16):
    """Cut faces show what the thing is made of: a base with grains of each ingredient."""
    m = clay(name, base, rough)
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    col = p.inputs["Base Color"]
    prev = None
    for i, (c, s) in enumerate(specks):
        v = nt.nodes.new("ShaderNodeTexVoronoi")
        v.voronoi_dimensions = "4D"
        v.inputs["Scale"].default_value = scale * s
        v.inputs["W"].default_value = 3.7 * (i + 1)
        nt.links.new(coord.outputs["Object"], v.inputs["Vector"])
        r = nt.nodes.new("ShaderNodeValToRGB")
        r.color_ramp.interpolation = "CONSTANT"
        r.color_ramp.elements[0].color = (1, 1, 1, 1)
        r.color_ramp.elements[1].position = size
        r.color_ramp.elements[1].color = (0, 0, 0, 1)
        nt.links.new(v.outputs["Distance"], r.inputs["Fac"])
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.inputs[6].default_value = prev and (0, 0, 0, 1) or hexrgb(base)
        if prev:
            nt.links.new(prev.outputs[2], mix.inputs[6])
        mix.inputs[7].default_value = hexrgb(c)
        nt.links.new(r.outputs["Color"], mix.inputs["Factor"])
        prev = mix
    nt.links.new(prev.outputs[2], col)
    return m


def glow(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = hexrgb(color)
    e.inputs["Strength"].default_value = strength
    nt.links.new(e.outputs[0], nt.nodes["Material Output"].inputs["Surface"])
    return m


PAL = {
    "studio": "#27313C",      # the channel constant: slate cyclorama
    "wood": "#D2A66C",
    "wood_cut": "#E2BD86",
    "wax_cut": "#B07A40",     # paraffin-soaked wood, seen in section
    "head": "#7C2418",
    "head_cut": "#B9533B",
    "sleeve": "#E6DCC8",
    "panel": "#2F6D8A",
    "drawer": "#CFC3AD",
    "striker": "#4A2B1F",
}
M = {
    "studio": clay("studio", PAL["studio"], 0.85),
    "wood": clay("wood", PAL["wood"], 0.55, 0.15, 25),
    "wood_cut": speckled("wood_cut", PAL["wood_cut"], [("#C89A5E", 0.35)], 0.7, 60, 0.22),
    "wax_cut": clay("wax_cut", PAL["wax_cut"], 0.3),
    "head": clay("head", PAL["head"], 0.55, 0.35, 70),
    "head_cut": speckled("head_cut", PAL["head_cut"], [("#F4F1EA", 1.0), ("#E8C53A", 0.8)], 0.75, 38, 0.2),
    "sleeve": clay("sleeve", PAL["sleeve"], 0.8, 0.05, 30),
    "panel": clay("panel", PAL["panel"], 0.7),
    "drawer": clay("drawer", PAL["drawer"], 0.85),
    "striker": speckled("striker", PAL["striker"], [("#8C7A6A", 0.9)], 0.95, 45, 0.18),
    "spark": glow("spark", "#FF9A3C", 9.0),
    "spark_hot": glow("spark_hot", "#FFD27A", 22.0),
}


# ── geometry helpers ─────────────────────────────────────────────────────────
def obj_from_bm(name, bm, mats):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    for m in mats:
        me.materials.append(m)
    for p in me.polygons:
        p.use_smooth = True
    return ob


def box(name, lo, hi, mat, cut_mat=None, cut_axis=None, parent=None, matrix=None):
    """Axis-aligned box lo..hi. The face at +cut_axis gets cut_mat (a section face)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector([lo[i] + (v.co[i] + 0.5) * (hi[i] - lo[i]) for i in range(3)])
    mats = [mat]
    if cut_mat is not None:
        mats.append(cut_mat)
        ax = "xyz".index(cut_axis)
        for f in bm.faces:
            if f.normal[ax] > 0.9:
                f.material_index = 1
    ob = obj_from_bm(name, bm, mats)
    for p in ob.data.polygons:
        p.use_smooth = False
    ob.modifiers.new("bevel", "BEVEL").width = min(hi[i] - lo[i] for i in range(3)) * 0.025
    if matrix is not None:
        ob.matrix_world = matrix
    if parent is not None:
        ob.parent = parent
    return ob


def half_ellipsoid(name, center, radii, mat, cut_mat, matrix):
    """Ellipsoid cut by the local plane y = 0, keeping y <= 0; the cut is filled with cut_mat."""
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=64, v_segments=40, radius=1.0)
    for v in bm.verts:
        v.co = Vector((center[0] + v.co.x * radii[0], center[1] + v.co.y * radii[1], center[2] + v.co.z * radii[2]))
    geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
    res = bmesh.ops.bisect_plane(bm, geom=geom, plane_co=(0, 0, 0), plane_no=(0, 1, 0), clear_outer=True)
    edges = [e for e in res["geom_cut"] if isinstance(e, bmesh.types.BMEdge)]
    fill = bmesh.ops.edgeloop_fill(bm, edges=edges)
    for f in fill["faces"]:
        f.material_index = 1
    ob = obj_from_bm(name, bm, [mat, cut_mat])
    for f in ob.data.polygons:
        if f.material_index == 1:
            f.use_smooth = False
    ob.matrix_world = matrix
    return ob


# ── the studio: a seamless cyclorama ─────────────────────────────────────────
def cyclorama(width=80, depth=40, radius=10, height=40):
    bm = bmesh.new()
    prof = [(y, 0.0) for y in (-depth, 0.0)]
    for i in range(1, 17):
        a = i / 16 * math.pi / 2
        prof.append((radius * math.sin(a), radius * (1 - math.cos(a))))
    prof.append((radius, height))
    rows = []
    for x in (-width / 2, width / 2):
        rows.append([bm.verts.new((x, y + 6, z)) for y, z in prof])
    for i in range(len(prof) - 1):
        bm.faces.new((rows[0][i], rows[1][i], rows[1][i + 1], rows[0][i + 1]))
    ob = obj_from_bm("cyclorama", bm, [M["studio"]])
    return ob


cyclorama()

# ── the matchbox (long axis along Y, striker on the face x = 0) ──────────────
before_box = set(bpy.data.objects)
BX, BY, BZ = 3.6, 5.3, 1.6
box("sleeve", (0, -BY / 2, 0), (BX, BY / 2, BZ), M["sleeve"])
box("panel", (0.35, -BY / 2 + 0.35, BZ - 0.01), (BX - 0.35, BY / 2 - 0.35, BZ + 0.012), M["panel"])
box("striker", (-0.03, -BY / 2 + 0.3, 0.22), (0.0, BY / 2 - 0.3, BZ - 0.22), M["striker"])
# drawer pushed out of the far end, with more matches in it
box("drawer", (0.12, BY / 2 - 0.2, 0.08), (BX - 0.12, BY / 2 + 1.9, BZ - 0.12), M["drawer"])
for i in range(7):
    x = 0.45 + i * 0.4
    box(f"stick{i}", (x - 0.1, BY / 2 - 0.2, BZ - 0.36), (x + 0.1, BY / 2 + 1.55, BZ - 0.16), M["wood"])
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=16, radius=1.0)
    for v in bm.verts:
        v.co = Vector((x + v.co.x * 0.16, BY / 2 + 1.62 + v.co.y * 0.26, BZ - 0.26 + v.co.z * 0.16))
    obj_from_bm(f"head{i}", bm, [M["head"]])

# turn the whole box 40° about the strike point, so the striker faces the lens
tip = Vector((-0.02, -0.55, 0.86))          # the head touches the striker here
BOX_ROT = Matrix.Translation(tip) @ Matrix.Rotation(math.radians(40), 4, "Z") @ Matrix.Translation(-tip)
for o in set(bpy.data.objects) - before_box:
    o.matrix_world = BOX_ROT @ o.matrix_world

# ── the hero: one match, mid-strike, cut in half facing the camera ───────────
target = Vector((0.15, -0.5, 0.85))
cam_loc = target + Vector((-1.2, -13.2, 5.2)) * 0.84

face_n = (BOX_ROT.to_3x3() @ Vector((-1, 0, 0))).normalized()
along = (BOX_ROT.to_3x3() @ Vector((0, 1, 0))).normalized()
tail = tip + (face_n + 0.5 * along).normalized() * 4.35 + Vector((0, 0, -0.55))
d = (tip - tail).normalized()
view = (target - cam_loc).normalized()
n = -(view - view.dot(d) * d).normalized()   # cut-plane normal, pointing at the camera
z = d.cross(n)
L = (tip - tail).length
basis = Matrix((d, n, z)).transposed().to_4x4()
MW = Matrix.Translation(tail) @ basis        # local x = along the match, local y = toward camera

S = 0.11  # half the splint's square section
box("splint", (0, -S, -S), (L - 1.25, 0.0, S), M["wood"], M["wood_cut"], "y", matrix=MW)
box("splint_wax", (L - 1.25, -S, -S), (L - 0.48, 0.004, S), M["wood"], M["wax_cut"], "y", matrix=MW)
half_ellipsoid("head", (L - 0.3, 0, 0), (0.33, 0.2, 0.21), M["head"], M["head_cut"], MW)

# sparks where the head meets the striker
import random

random.seed(7)
contact = tip + Vector((-0.04, 0.02, 0.0))
for i in range(26):
    a = random.uniform(-0.15, 0.85) * math.pi
    e = random.uniform(0.1, 0.9)
    dist = random.uniform(0.12, 0.95) ** 1.3
    dirv = Vector((-abs(math.cos(a)) * 0.9, math.sin(a) * 0.5 - 0.15, e * 0.7)).normalized()
    p = contact + dirv * dist
    length = 0.05 + 0.14 * dist
    r = random.uniform(0.006, 0.011)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=r, radius2=r * 0.35, depth=length)
    rot = dirv.to_track_quat("Z", "Y").to_matrix().to_4x4()
    bmesh.ops.transform(bm, matrix=Matrix.Translation(p) @ rot, verts=bm.verts)
    obj_from_bm(f"spark{i}", bm, [M["spark_hot"] if dist < 0.2 else M["spark"]])
flash = bpy.data.lights.new("contact", "POINT")
flash.color = hexrgb("#FFB25A")[:3]
flash.energy = 6
flash.shadow_soft_size = 0.15
fo = bpy.data.objects.new("contact", flash)
fo.location = contact + Vector((-0.12, -0.12, 0.12))
scene.collection.objects.link(fo)

# ── light: cool studio, one warm story light ─────────────────────────────────
def area(name, loc, size, energy, color, aim=target):
    l = bpy.data.lights.new(name, "AREA")
    l.size = size
    l.energy = energy
    l.color = hexrgb(color)[:3]
    o = bpy.data.objects.new(name, l)
    o.location = loc
    o.rotation_euler = (aim - Vector(loc)).to_track_quat("-Z", "Z").to_euler()
    scene.collection.objects.link(o)


area("key", (-6.0, -5.5, 7.5), 5.0, 900, "#EEF2FF")
area("rim", (4.5, 5.5, 4.0), 3.0, 700, "#FFD7A1")
area("fill", (-1.0, -10.0, 1.2), 8.0, 90, "#9FB6D6")

world = bpy.data.worlds.new("world")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = hexrgb("#10151B")
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.6
scene.world = world

# ── camera: long lens, shallow focus on the cut ──────────────────────────────
cd = bpy.data.cameras.new("cam")
cd.lens = 70
cd.sensor_width = 36
cd.dof.use_dof = True
cd.dof.aperture_fstop = float(opt.get("--fstop", "1.4"))
cam = bpy.data.objects.new("cam", cd)
cam.location = cam_loc
cam.rotation_euler = (target - cam_loc).to_track_quat("-Z", "Y").to_euler()
scene.collection.objects.link(cam)
scene.camera = cam
focus = bpy.data.objects.new("focus", None)
focus.location = tail + d * (L - 0.45)
scene.collection.objects.link(focus)
cd.dof.focus_object = focus

# ── render ───────────────────────────────────────────────────────────────────
r = scene.render
r.resolution_x, r.resolution_y = W, H
r.resolution_percentage = 100
r.image_settings.file_format = "PNG"
r.filepath = out
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
if ENGINE == "CYCLES":
    r.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = SAMPLES
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 6
else:
    r.engine = "BLENDER_EEVEE_NEXT" if hasattr(bpy.types, "EEVEE_NEXT") else "BLENDER_EEVEE"

bpy.context.view_layer.update()

# label anchors, projected to pixels — the Blender → Remotion contract
def px(p):
    c = world_to_camera_view(scene, cam, p)
    return [round(c.x * W, 1), round((1 - c.y) * H, 1)]


anchors = {
    "head_cut": px(MW @ Vector((L - 0.33, 0.0, 0.03))),
    "wax_cut": px(MW @ Vector((L - 0.85, 0.004, 0.0))),
    "wood_cut": px(MW @ Vector((L - 2.4, 0.0, 0.0))),
    "striker": px(BOX_ROT @ Vector((-0.03, -1.7, 0.5))),
    "sparks": px(contact + Vector((-0.25, -0.05, 0.25))),
}
with open(out.rsplit(".", 1)[0] + ".anchors.json", "w") as f:
    json.dump({"width": W, "height": H, "anchors": anchors}, f, indent=1)

bpy.ops.render.render(write_still=True)
print("wrote", out)
