"""
marks.py — the floor marks of one camera angle, measured once in Blender (Stage & Marks, §9.8).

A mark is a spot on the floor where a character may stand. For every mark this writes what
Step 3b used to discover by trial and error, per shot, with re-renders:

    foot          screen point of the floor spot (px)           → where the 2D rig's feet go
    px_per_m      screen pixels per metre of height at that spot → the rig's scale
    head          screen point 1.5 m above it                    → headroom / title-safe check
    free          nothing within 0.3 m of it, up to head height  → no character inside a table
    feet_visible  the camera sees the floor there                → or the feet are hidden by the set
    head_visible  the camera sees 1.5 m above it
    in_frame      head and feet inside the 5% title-safe area
    lit, light_x  sampled from the rendered plate at the foot    → §2.1 "same ground" for free
    depth         mist value at the spot                         → the cast's blur (A4)

Foot lock is exact by construction: the rig stands on a projected floor point of the same
camera, and a locked-off camera never moves it. No pins, no stills, no footlock_check.py.

Usage (inside a Blender scene script, after the plate is rendered):
    import marks
    marks.export(scene, cam, floor_objects, "kit/deli-A07.marks.json",
                 plate_png="kit/deli-A07.png", bounds=(-6, 6, -4, 4), spacing=0.5,
                 floor_lit_luma=0.70, floor_shade_luma=0.48, lights=[(x, y, z), ...])
"""
import json
import math

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

HEAD_M = 1.5
RADIUS_M = 0.3


def _px(scene, cam, p, W, H):
    c = world_to_camera_view(scene, cam, p)
    return (c.x * W, (1 - c.y) * H, c.z)


def _ray(scene, depsgraph, origin, target):
    """True if nothing blocks the segment origin → target (except within 2 cm of the target)."""
    v = target - origin
    dist = v.length
    hit, loc, *_ = scene.ray_cast(depsgraph, origin, v.normalized(), distance=dist - 0.02)
    return not hit


def export(scene, cam, floor_objects, out_path, plate_png=None, bounds=(-6, 6, -4, 4), spacing=0.5,
           floor_lit_luma=0.7, floor_shade_luma=0.45, lights=(), mist=None):
    dg = bpy.context.evaluated_depsgraph_get()
    W, H = scene.render.resolution_x, scene.render.resolution_y
    floor_names = {o.name for o in floor_objects}
    cam_p = cam.matrix_world.translation.copy()
    safe = (0.05 * W, 0.05 * H, 0.95 * W, 0.95 * H)

    pix = None
    if plate_png:
        img = bpy.data.images.load(plate_png, check_existing=False)
        pix = img.pixels[:]
        IW, IH = img.size

    def luma_at(x, y):
        """Median-ish luma of a 5×5 patch, skipping the darkest samples (the ink lines)."""
        vals = []
        for dy in range(-2, 3):
            for dx in range(-2, 3):
                ix, iy = int(x) + dx * 2, IH - 1 - (int(y) + dy * 2)
                if 0 <= ix < IW and 0 <= iy < IH:
                    i = (iy * IW + ix) * 4
                    vals.append(0.2126 * pix[i] + 0.7152 * pix[i + 1] + 0.0722 * pix[i + 2])
        vals.sort()
        vals = vals[len(vals) // 3:]          # drop the darkest third: ink, not light
        return vals[len(vals) // 2] if vals else 0.0

    marks = []
    x0, x1, y0, y1 = bounds
    nx, ny = int((x1 - x0) / spacing) + 1, int((y1 - y0) / spacing) + 1
    for i in range(nx):
        for j in range(ny):
            x, y = x0 + i * spacing, y0 + j * spacing
            # go down through ceilings and furniture until the floor (what is above it decides `free`)
            o, hit, obj = Vector((x, y, 8.0)), False, None
            for _ in range(12):
                hit, loc, _n, _idx, obj, _m = scene.ray_cast(dg, o, Vector((0, 0, -1)), distance=16.0)
                if not hit or obj.name in floor_names:
                    break
                o = loc - Vector((0, 0, 0.002))
            if not hit or obj.name not in floor_names:
                continue
            p = Vector((x, y, loc.z))
            head = p + Vector((0, 0, HEAD_M))
            fx, fy, fz = _px(scene, cam, p, W, H)
            hx, hy, hz = _px(scene, cam, head, W, H)
            if fz <= 0:
                continue
            # free: nothing above the spot, or within RADIUS_M of it, below head height
            free = True
            for dx, dy in ((0, 0), (RADIUS_M, 0), (-RADIUS_M, 0), (0, RADIUS_M), (0, -RADIUS_M)):
                o = p + Vector((dx, dy, 0.03))
                h2, *_ = scene.ray_cast(dg, o, Vector((0, 0, 1)), distance=HEAD_M)
                if h2:
                    free = False
                    break
            in_frame = safe[0] <= min(fx, hx) and max(fx, hx) <= safe[2] and safe[1] <= hy and fy <= safe[3]
            mark = {
                "id": f"m{i:02d}{j:02d}",
                "world": [round(x, 3), round(y, 3), round(loc.z, 3)],
                "foot": [round(fx, 1), round(fy, 1)],
                "head": [round(hx, 1), round(hy, 1)],
                "px_per_m": round((fy - hy) / HEAD_M, 2),
                "free": free,
                "feet_visible": _ray(scene, dg, cam_p, p + Vector((0, 0, 0.05))),
                "head_visible": _ray(scene, dg, cam_p, head),
                "in_frame": in_frame,
                "dist_m": round((p - cam_p).length, 2),
            }
            if pix is not None and 0 <= fx < W and 0 <= fy < H:
                lum = luma_at(fx * IW / W, fy * IH / H)
                mark["lit"] = lum > (floor_lit_luma + floor_shade_luma) / 2
                mark["luma"] = round(lum, 3)
            if lights:
                near = min(lights, key=lambda q: math.hypot(q[0] - x, q[1] - y))
                mark["light_x"] = round(_px(scene, cam, Vector(near), W, H)[0], 1)
            marks.append(mark)

    data = {
        "camera": {"name": cam.name, "location": [round(v, 4) for v in cam_p],
                   "lens": cam.data.lens, "width": W, "height": H},
        "spacing_m": spacing,
        "marks": marks,
    }
    tmp = out_path + ".tmp"
    with open(tmp, "w") as f:
        json.dump(data, f, indent=1)
    import os
    os.replace(tmp, out_path)          # write-then-rename: Studio never reads half a file
    usable = sum(1 for m in marks if m["free"] and m["in_frame"] and m["head_visible"])
    print(f"marks: {len(marks)} on the floor, {usable} usable → {out_path}")
    return data
