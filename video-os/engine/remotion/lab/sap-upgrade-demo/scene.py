"""
SAP visual-upgrade demo — the deli at gate B12 (runbook §4.1's cold-open example),
built from code in the channel's toon language, rendered BEFORE and AFTER the
Visual_Upgrade_Plan.md items.

    python3 scene.py <outdir/> --mode before|after [--res 1920x1080] [--anim N] [--shot still|glide]

  before : one `day` preset lighting everything, one line weight — the "diagram of a room"
  after  : practicals hung low (§2.2), line weight by depth band (A5), crayon grain in the
           shade band only (B1), mist + emission passes written for the depth blur (A4) and
           practicals-only bloom (A3), Line Art boil on twos (A1, with --anim)

Writes per frame: <mode>_####.png (beauty), <mode>_mist_####.png, <mode>_emit_####.png,
and <mode>_anchors.json (cast floor points, pool membership, sign/board corners, lamps) —
the camera-JSON contract of §9.8, consumed by post.py (standing in for Remotion).
Needs EEVEE; headless without a GPU set LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=surfaceless.
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
OUT = os.path.abspath(argv[0]) + "/"
opt = {argv[i]: argv[i + 1] for i in range(1, len(argv) - 1) if argv[i].startswith("--") and not argv[i + 1].startswith("--")}
MODE = opt.get("--mode", "after")
AFTER = MODE == "after"
W, H = map(int, opt.get("--res", "1920x1080").split("x"))
ANIM = int(opt.get("--anim", "0"))
SHOT = opt.get("--shot", "still")
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


# ── the toon material: Diffuse → ShaderToRGB → constant ramp at 0.12 → two tones (§9.8) ──
BANDS = {"fg": 0, "mid": 1, "bg": 2}   # Line Art material-mask bit per depth band (A5)
_mats = {}


def toon(name, lit, shade, band="mid", emit=None, emit_strength=0.0):
    key = (name, band)
    if key in _mats:
        return _mats[key]
    m = bpy.data.materials.new(f"{name}.{band}")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    outn = nt.nodes.new("ShaderNodeOutputMaterial")
    if emit:
        e = nt.nodes.new("ShaderNodeEmission")
        e.inputs["Color"].default_value = lin(emit)
        e.inputs["Strength"].default_value = emit_strength
        nt.links.new(e.outputs[0], outn.inputs["Surface"])
        aov = nt.nodes.new("ShaderNodeOutputAOV")     # A3: practicals write their own mask
        aov.aov_name = "practical"
        aov.inputs["Value"].default_value = 1.0
    else:
        diff = nt.nodes.new("ShaderNodeBsdfDiffuse")
        s2r = nt.nodes.new("ShaderNodeShaderToRGB")
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.interpolation = "CONSTANT"
        ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
        ramp.color_ramp.elements[1].position = 0.12
        ramp.color_ramp.elements[1].color = (1, 1, 1, 1)
        nt.links.new(diff.outputs[0], s2r.inputs[0])
        nt.links.new(s2r.outputs["Color"], ramp.inputs["Fac"])
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.inputs[7].default_value = lin(lit)
        shade_col = mix.inputs[6]
        if AFTER:
            # B1: crayon grain lives in the shade band only — the lit tone stays flat
            tc = nt.nodes.new("ShaderNodeTexCoord")
            nz = nt.nodes.new("ShaderNodeTexNoise")
            nz.inputs["Scale"].default_value = 90.0
            nz.inputs["Detail"].default_value = 6.0
            nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
            gr = nt.nodes.new("ShaderNodeValToRGB")
            gr.color_ramp.interpolation = "CONSTANT"
            gr.color_ramp.elements[0].color = (1, 1, 1, 1)
            gr.color_ramp.elements[1].position = 0.62
            gr.color_ramp.elements[1].color = (0.8, 0.8, 0.84, 1)
            nt.links.new(nz.outputs["Fac"], gr.inputs["Fac"])
            mul = nt.nodes.new("ShaderNodeMix")
            mul.data_type = "RGBA"
            mul.blend_type = "MULTIPLY"
            mul.inputs["Factor"].default_value = 1.0
            mul.inputs[6].default_value = lin(shade)
            nt.links.new(gr.outputs["Color"], mul.inputs[7])
            nt.links.new(mul.outputs[2], shade_col)
        else:
            shade_col.default_value = lin(shade)
        nt.links.new(ramp.outputs["Color"], mix.inputs["Factor"])
        emi = nt.nodes.new("ShaderNodeEmission")
        nt.links.new(mix.outputs[2], emi.inputs["Color"])
        nt.links.new(emi.outputs[0], outn.inputs["Surface"])
    m.lineart.use_material_mask = True
    m.lineart.use_material_mask_bits[BANDS[band]] = True
    _mats[key] = m
    return m


# The location palette (§2.2): warm, five to seven hues. The accent is not in it.
P = {
    "tileA": ("#CFC6B4", "#8E8A86"), "tileB": ("#BDB3A0", "#817D7A"),
    "wall": ("#DCD2C0", "#8F8C8C"), "slat": ("#8D5B35", "#4E3A2E"),
    "counter": ("#3A4250", "#232833"), "top": ("#ECE6DA", "#9C9A98"),
    "wood": ("#7A5236", "#45342A"), "shade": ("#2F6D5A", "#1D3B35"),
    "frame": ("#3B4047", "#23272C"), "leaf": ("#4F7D4F", "#2C4636"),
    "bread": ("#E0B576", "#8E7358"), "sky": ("#A9BFCB", "#A9BFCB"),
    "jet": ("#E8E6E1", "#9FA3A8"), "sign": ("#FDFBF5", "#A7A6A3"),
}


def mat(key, band="mid"):
    lit, sh = P[key]
    return toon(key, lit, sh, band)


# ── geometry helpers ─────────────────────────────────────────────────────────
def link(ob):
    scene.collection.objects.link(ob)
    return ob


def box(name, center, size, material, rot_z=0.0):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(material)
    ob = link(bpy.data.objects.new(name, me))
    ob.location = center
    ob.rotation_euler.z = rot_z
    return ob


def cyl(name, center, r, h, material, verts=24, r2=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r if r2 is None else r2, depth=h)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(material)
    ob = link(bpy.data.objects.new(name, me))
    ob.location = center
    return ob


def band_of(y):
    return "fg" if y < -1.6 else ("mid" if y < 2.2 else "bg")


# ── the room ─────────────────────────────────────────────────────────────────
T = 0.6
for i in range(-10, 11):
    for j in range(-8, 8):
        x, y = i * T, j * T
        k = "tileA" if (i + j) % 2 else "tileB"
        box(f"tile{i}_{j}", (x, y, -0.02), (T - 0.015, T - 0.015, 0.04), mat(k, band_of(y)))
box("wall_back", (-2.3, 4.6, 2.0), (8.4, 0.2, 4.0), mat("wall", "bg"))
box("wall_back_r", (6.4, 4.6, 2.0), (0.4, 0.2, 4.0), mat("wall", "bg"))
box("wall_under", (4.15, 4.6, 0.4), (4.1, 0.2, 0.8), mat("wall", "bg"))
box("wall_over", (4.15, 4.6, 3.72), (4.1, 0.2, 0.56), mat("wall", "bg"))
box("apron", (4.0, 12.0, -0.05), (30.0, 14.0, 0.1), toon("apron", "#9C9C94", "#6E7075", "bg"))
if SHOT != "glide":   # the high-angle glide looks into the room like a diorama: no roof
    box("ceiling", (0, 0.3, 4.08), (13.2, 9.0, 0.12), toon("ceiling", "#C9C0B0", "#6F6C6E", "bg"))
box("wall_left", (-6.4, 0.3, 2.0), (0.2, 8.6, 4.0), mat("wall", "bg"))
# wood slat feature wall, left of the counter — every slat outlined
for s in range(16):
    box(f"slat{s}", (-6.1 + s * 0.24, 4.42, 1.8), (0.13, 0.12, 3.6), mat("slat", "bg"))
# window band on the right, with mullions and the apron outside
box("sky", (4.0, 19.0, 6.0), (40.0, 0.1, 14.0), toon("skyglow", "#A9BFCB", "#A9BFCB", "bg"))
for s in range(5):
    box(f"mullion{s}", (2.0 + s * 1.05, 4.45, 2.1), (0.09, 0.14, 2.7), mat("frame", "bg"))
box("sill", (4.1, 4.4, 0.78), (4.4, 0.3, 0.1), mat("frame", "bg"))
box("head", (4.1, 4.4, 3.45), (4.4, 0.3, 0.1), mat("frame", "bg"))
# a jet's tail and fuselage beyond the glass (ambient life: it taxis in the video)
jet = box("jet_body", (4.6, 9.0, 1.9), (6.0, 1.1, 1.1), mat("jet", "bg"))
fin = box("jet_fin", (2.1, 9.0, 3.1), (1.4, 0.15, 1.6), mat("jet", "bg"))
fin.rotation_euler.y = math.radians(-18)
fin.parent = jet
fin.location = (-2.5, 0, 1.2)

# the deli counter, its cold case and the sandwiches in it
box("counter", (-1.0, 2.9, 0.55), (4.6, 0.9, 1.1), mat("counter", "bg"))
box("counter_top", (-1.0, 2.85, 1.13), (4.8, 1.05, 0.06), mat("top", "bg"))
for s in range(9):
    box(f"panel{s}", (-3.05 + s * 0.51, 2.43, 0.55), (0.36, 0.04, 0.8), mat("frame", "bg"))
box("case_back", (-2.0, 3.2, 1.45), (1.8, 0.08, 0.6), mat("frame", "bg"))
for s in range(6):
    sw = box(f"sandwich{s}", (-2.7 + s * 0.28, 3.0, 1.22), (0.2, 0.2, 0.12), mat("bread", "bg"))
    sw.rotation_euler.z = math.radians([4, -6, 9, -3, 7, -8][s])   # law 1: nothing aligned
box("till", (0.2, 2.75, 1.3), (0.4, 0.3, 0.28), mat("frame", "bg"))
till_screen = box("till_screen", (0.2, 2.6, 1.52), (0.34, 0.03, 0.2), toon("screen", "#DDE7E3", "#DDE7E3", "bg", emit="#DDE7E3", emit_strength=1.4))

# the menu board: a practical, and a surface type rides on (§2.8)
box("board_frame", (-1.0, 4.45, 2.75), (3.2, 0.1, 1.05), mat("frame", "bg"))
board = box("board", (-1.0, 4.39, 2.75), (3.0, 0.03, 0.9),
            toon("board", "#F3EAD2", "#F3EAD2", "bg", emit="#F3EAD2", emit_strength=1.0 if AFTER else 0.85))
board.rotation_euler.x = math.radians(-1.2)
board.pass_index = till_screen.pass_index = 1   # practicals: the only things allowed to bloom (A3)

# tables and chairs — spindles and knuckles, so the ink has something to draw (§2.4)
def table_set(tag, cx, cy, rot=0.0):
    band = band_of(cy)
    box(f"{tag}_top", (cx, cy, 0.74), (0.9, 0.9, 0.05), mat("wood", band), rot)
    cyl(f"{tag}_leg", (cx, cy, 0.37), 0.05, 0.72, mat("frame", band))
    cyl(f"{tag}_knuckle", (cx, cy, 0.66), 0.09, 0.1, mat("frame", band))
    cyl(f"{tag}_foot", (cx, cy, 0.02), 0.28, 0.04, mat("frame", band))
    for a in (0, math.pi):
        ox, oy = math.cos(a + rot) * 0.75, math.sin(a + rot) * 0.75
        sx, sy = cx + ox, cy + oy
        box(f"{tag}_seat{a:.0f}", (sx, sy, 0.46), (0.42, 0.42, 0.05), mat("wood", band), rot)
        for dx in (-0.17, 0.17):
            for dy in (-0.17, 0.17):
                cyl(f"{tag}_cl{a:.0f}{dx}{dy}", (sx + dx, sy + dy, 0.22), 0.022, 0.46, mat("wood", band), 10)
        bx, by = cx + math.cos(a + rot) * 0.96, cy + math.sin(a + rot) * 0.96
        for s in range(5):
            t = (s - 2) * 0.085
            cyl(f"{tag}_sp{a:.0f}{s}", (bx - math.sin(a + rot) * t, by + math.cos(a + rot) * t, 0.72), 0.014, 0.5, mat("wood", band), 8)
        box(f"{tag}_rail{a:.0f}", (bx, by, 0.98), (0.08 if abs(math.cos(a + rot)) > 0.5 else 0.44,
                                                     0.44 if abs(math.cos(a + rot)) > 0.5 else 0.08, 0.05), mat("wood", band))


table_set("t1", -2.6, 0.2)
table_set("t2", 2.2, -0.6, math.radians(8))
table_set("t3", -0.4, -2.4, math.radians(-5))

# pendants — hung low (~2.75 m) so their pools have edges (§9.8)
PENDANTS = [(-2.2, 2.4), (0.2, 2.4), (-2.6, 0.2), (2.2, -0.6)]
for i, (px, py) in enumerate(PENDANTS):
    band = band_of(py)
    cyl(f"cord{i}", (px, py, 3.6), 0.01, 1.7, mat("frame", band), 6)
    cyl(f"shade{i}", (px, py, 2.72), 0.34, 0.26, mat("shade", band), 28, r2=0.1)
    cyl(f"bulb{i}", (px, py, 2.57), 0.09, 0.08, toon("bulb", "#FFE6B0", "#FFE6B0", band, emit="#FFE6B0", emit_strength=6.0)).pass_index = 1

# the gate sign, hanging crooked (law 1) — the type is set on it by post.py
gate = box("gate_sign", (3.6, 1.2, 3.05), (1.3, 0.06, 0.5), mat("sign", "mid"))
gate.rotation_euler = (0, math.radians(2.5), math.radians(-14))
for dx in (-0.5, 0.5):
    c = cyl(f"gate_cord{dx}", (3.6 + dx * 0.97, 1.2 + dx * 0.25, 3.7), 0.008, 0.8, mat("frame", "mid"), 6)

# the foreground crop: a planter the frame cuts through (§2.4)
box("planter", (-4.4, -3.6, 0.45), (1.2, 1.2, 0.9), mat("slat", "fg"))
for s in range(7):
    a = s / 7 * math.tau
    lf = box(f"leaf{s}", (-4.4 + math.cos(a) * 0.3, -3.6 + math.sin(a) * 0.3, 1.25), (0.14, 0.6, 0.05), mat("leaf", "fg"))
    lf.rotation_euler = (math.radians(35), 0, a + math.pi / 2)
box("bench", (3.0, -3.1, 0.42), (2.4, 0.5, 0.08), mat("wood", "fg"))
for dx in (-1.0, 1.0):
    box(f"bench_leg{dx}", (3.0 + dx, -3.1, 0.2), (0.08, 0.44, 0.4), mat("frame", "fg"))

# ── light ────────────────────────────────────────────────────────────────────
world = bpy.data.worlds.new("world")
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
scene.world = world


def light(name, kind, loc, energy, color, rot=None, size=None, spot=None):
    ld = bpy.data.lights.new(name, kind)
    ld.energy = energy
    ld.color = lin(color)[:3]
    if size is not None:
        ld.shadow_soft_size = size
    ld.use_shadow = False
    if spot is not None:
        ld.spot_size = spot
        ld.spot_blend = 0.05
    o = link(bpy.data.objects.new(name, ld))
    o.location = loc
    if rot is not None:
        o.rotation_euler = rot
    return o


if AFTER:
    # interior: the practicals decide the frame, the sun is off (§2.2)
    bg.inputs["Color"].default_value = lin("#1B2230")
    bg.inputs["Strength"].default_value = 0.35
    for i, (px, py) in enumerate(PENDANTS):
        light(f"pool{i}", "SPOT", (px, py, 2.42), 240, "#FFD9A0", rot=(0, 0, 0), size=0.05, spot=math.radians(78))
    light("window_cold", "AREA", (4.1, 4.2, 2.6), 90, "#9DB7D6", rot=(math.radians(-50), 0, 0), size=4.0)
else:
    # the `day` preset alone: bright and even — every surface crosses the ramp
    bg.inputs["Color"].default_value = lin("#DDE3EA")
    bg.inputs["Strength"].default_value = 1.2
    light("sun", "SUN", (0, 0, 10), 3.0, "#FFF6E6", rot=(math.radians(35), math.radians(10), math.radians(30)))

# ── camera ───────────────────────────────────────────────────────────────────
cd = bpy.data.cameras.new("cam")
cd.lens = 32
cam = link(bpy.data.objects.new("cam", cd))
scene.camera = cam
aim = link(bpy.data.objects.new("aim", None))
tc = cam.constraints.new("TRACK_TO")
tc.target, tc.track_axis, tc.up_axis = aim, "TRACK_NEGATIVE_Z", "UP_Y"

if SHOT == "glide" and ANIM:
    # one continuous high-angle glide that settles at the counter (Imperial's camera grammar)
    keys = [(1, (-7.6, -9.4, 6.4), (-0.6, 1.2, 0.6)),
            (ANIM * 0.55, (-2.4, -8.8, 4.1), (-0.8, 1.6, 0.9)),
            (ANIM, (0.9, -7.2, 2.6), (-0.9, 2.0, 1.15))]
    for f, loc, tgt in keys:
        cam.location, aim.location = loc, tgt
        cam.keyframe_insert("location", frame=f)
        aim.keyframe_insert("location", frame=f)
    jet.keyframe_insert("location", frame=1)
    jet.location.x += 3.5
    jet.keyframe_insert("location", frame=ANIM)
else:
    cam.location, aim.location = (-1.2, -8.3, 2.9), (-0.6, 1.4, 1.0)

# ── ink: Line Art, one modifier per depth band (A5 — weight follows distance) ─
gp = bpy.data.grease_pencils.new("ink")
ink = link(bpy.data.objects.new("ink", gp))
inkm = bpy.data.materials.new("ink")
bpy.data.materials.create_gpencil_data(inkm)
inkm.grease_pencil.color = lin("#1A1A18")
gp.materials.append(inkm)
layer = gp.layers.new("lines")
_dr = layer.frames.new(1).drawing   # Line Art writes only into a drawing that already holds a stroke
_dr.add_strokes([2])
for _p in _dr.strokes[0].points:
    _p.position, _p.radius = (0, 0, -50), 0.0
la = ink.modifiers.new("lineart", "LINEART")
la.source_type = "SCENE"
la.target_layer = "lines"
la.target_material = inkm
la.radius = 0.004
la.use_intersection = True
la.use_crease = True
la.crease_threshold = math.radians(140)

# A5 — the weight on screen follows distance. Grease Pencil radii are world-space, so a
# Geometry Nodes pass sets each point's radius from the pixel weight it should read at:
#   before: 3 px everywhere · after: ~4.4 px at 4 m falling to ~1.7 px at 18 m
PX_NEAR, PX_FAR = (4.0, 1.6) if AFTER else (3.0, 3.0)
WORLD_PER_PX = 0.5 * (18 / 32) * 2 / 1920      # half-width of one 1080p pixel per metre, 32 mm lens
ng_w = bpy.data.node_groups.new("ink_weight", "GeometryNodeTree")
ng_w.interface.new_socket("Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
ng_w.interface.new_socket("Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")
N, LK = ng_w.nodes, ng_w.links
gi, go_ = N.new("NodeGroupInput"), N.new("NodeGroupOutput")
g2c, c2g = N.new("GeometryNodeGreasePencilToCurves"), N.new("GeometryNodeCurvesToGreasePencil")
setr, pos = N.new("GeometryNodeSetCurveRadius"), N.new("GeometryNodeInputPosition")
oi = N.new("GeometryNodeObjectInfo")
oi.inputs["Object"].default_value = cam
dist = N.new("ShaderNodeVectorMath")
dist.operation = "DISTANCE"
mr = N.new("ShaderNodeMapRange")
mr.clamp = True
mr.inputs["From Min"].default_value, mr.inputs["From Max"].default_value = 4.0, 18.0
mr.inputs["To Min"].default_value, mr.inputs["To Max"].default_value = PX_NEAR, PX_FAR
m1, m2 = N.new("ShaderNodeMath"), N.new("ShaderNodeMath")
m1.operation = m2.operation = "MULTIPLY"
m2.inputs[1].default_value = WORLD_PER_PX
LK.new(gi.outputs[0], g2c.inputs[0])
LK.new(g2c.outputs[0], setr.inputs["Curve"])
LK.new(pos.outputs[0], dist.inputs[0])
LK.new(oi.outputs["Location"], dist.inputs[1])
LK.new(dist.outputs["Value"], mr.inputs["Value"])
LK.new(mr.outputs[0], m1.inputs[0])
LK.new(dist.outputs["Value"], m1.inputs[1])
LK.new(m1.outputs[0], m2.inputs[0])
LK.new(m2.outputs[0], setr.inputs["Radius"])
LK.new(setr.outputs[0], c2g.inputs[0])
LK.new(c2g.outputs[0], go_.inputs[0])
ink.modifiers.new("weight", "NODES").node_group = ng_w
if AFTER and ANIM:
    # A1: the line boils on twos — the wobble holds two frames, then changes
    nz = ink.modifiers.new("boil", "GREASE_PENCIL_NOISE")
    nz.factor = 0.35
    nz.factor_thickness = 0.25
    nz.noise_scale = 0.9
    nz.use_random = True
    nz.step = 2
    nz.seed = 11

# ── render settings and passes ───────────────────────────────────────────────
r = scene.render
r.engine = "BLENDER_EEVEE"
r.resolution_x, r.resolution_y, r.resolution_percentage = W, H, 100
r.fps = 24
scene.eevee.taa_render_samples = 16
scene.view_settings.view_transform = "Standard"     # flat colour stays the hex it was given
scene.frame_start, scene.frame_end = 1, max(1, ANIM)
vl = scene.view_layers[0]
vl.use_pass_mist = True
vl.use_pass_emit = True
_aov = vl.aovs.add()
_aov.name, _aov.type = "practical", "VALUE"
world.mist_settings.start = 4.0
world.mist_settings.depth = 16.0
world.mist_settings.falloff = "LINEAR"

ng = bpy.data.node_groups.new("comp", "CompositorNodeTree")
scene.compositing_node_group = ng
rl = ng.nodes.new("CompositorNodeRLayers")
fo = ng.nodes.new("CompositorNodeOutputFile")
fo.directory = OUT
fo.file_name = f"{MODE}_"
fo.save_as_render = False
fo.format.media_type = "IMAGE"
fo.format.file_format = "PNG"
fo.format.color_depth = "16"
for name, sock in (("mist", "Mist"), ("emit", "Emission"), ("index", "practical")):
    fo.file_output_items.new("RGBA" if name == "emit" else "FLOAT", name)
    ng.links.new(rl.outputs[sock], fo.inputs[name])
go = ng.nodes.new("NodeGroupOutput")
ng.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
ng.links.new(rl.outputs["Image"], go.inputs[0])

# ── anchors: the contract with the 2D layer ──────────────────────────────────
CAST = [  # who, floor point, height (m) — the cast stays 2D (§2.5); post.py draws them here
    ("lucky", (-0.9, 1.75), 1.45),
    ("cashier", (-1.3, 3.35), 1.5),
    ("man_blue", (1.3, 0.9), 1.55),
    ("diner", (-2.6, 0.95), 1.5),
    ("walker", (0.9, -1.9), 1.55),
]


def px(p):
    c = world_to_camera_view(scene, cam, Vector(p))
    return [round(c.x * W, 2), round((1 - c.y) * H, 2), round(c.z, 3)]


def in_pool(x, y):
    return AFTER and any(math.hypot(x - a, y - b) < 1.8 for a, b in PENDANTS)


def anchors():
    out = {"cast": {}, "lamps": [], "board": [], "gate": [], "counter_edge": []}
    for who, (x, y), h in CAST:
        foot, top = px((x, y, 0)), px((x, y, h))
        near = min(PENDANTS, key=lambda q: math.hypot(x - q[0], y - q[1]))
        side = px((near[0], near[1], 1.0))[0] - foot[0]
        out["cast"][who] = {"foot": foot, "top": top, "lit": in_pool(x, y), "light_side": 1 if side > 0 else -1,
                            "mist": min(1, max(0, (Vector((x, y, h * 0.6)) - cam.matrix_world.translation).length - 4.0) / 16.0)}
    out["lamps"] = [px((a, b, 2.57)) for a, b in PENDANTS]
    bm = board.matrix_world
    out["board"] = [px(bm @ Vector((sx * 1.5, -0.02, sz * 0.45))) for sx, sz in ((-1, 1), (1, 1), (1, -1), (-1, -1))]
    gm = gate.matrix_world
    out["gate"] = [px(gm @ Vector((sx * 0.65, -0.04, sz * 0.25))) for sx, sz in ((-1, 1), (1, 1), (1, -1), (-1, -1))]
    out["counter_edge"] = [px((-3.4, 2.32, 1.16)), px((1.4, 2.32, 1.16))]
    out["price"] = px((-2.14, 2.88, 1.33))
    return out


A = {}
for f in range(1, max(1, ANIM) + 1):
    scene.frame_set(f)
    A[f] = anchors()
json.dump({"width": W, "height": H, "fps": 24, "mode": MODE, "frames": A}, open(f"{OUT}{MODE}_anchors.json", "w"))

r.filepath = f"{OUT}{MODE}_"
PREVIEW = [int(x) for x in opt["--preview"].split(",")] if "--preview" in opt else None
if ANIM and PREVIEW:   # a few stills along the move, to check the camera path before the full render
    for f in PREVIEW:
        scene.frame_set(f)
        r.filepath = f"{OUT}{MODE}_{f:04d}"
        bpy.ops.render.render(write_still=True)
elif ANIM:
    bpy.ops.render.render(animation=True)
else:
    scene.frame_set(1)
    r.filepath = f"{OUT}{MODE}_0001"
    bpy.ops.render.render(write_still=True)
    if "--marks" in argv:   # Stage & Marks: measure this angle's floor once (§9.8)
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import marks
        marks.export(scene, cam, [o for o in scene.objects if o.name.startswith("tile")],
                     f"{OUT}{MODE}_marks.json", plate_png=f"{OUT}{MODE}_0001.png",
                     bounds=(-6, 6, -4.5, 4.2), spacing=0.5, floor_lit_luma=0.78, floor_shade_luma=0.52,
                     lights=[(a, b, 2.57) for a, b in PENDANTS])
print("done", MODE, OUT)
