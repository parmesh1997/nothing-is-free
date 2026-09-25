"""
The 2D half of the SAP upgrade demo — a stand-in for the Remotion layer (§9.1), so the
look can be judged before anything is built in the real engine.

    python3 post.py <dir/> --mode before|after [--frame 1] [--out file.png]
    python3 post.py <dir/> --mode after --video out.mp4 [--ffmpeg path]

What it adds on top of scene.py's plate, in the order Remotion would:
  1. the cast, drawn 2D at the floor points Blender exported (§2.5), lit by the room:
     inside a pool → lit tone, shade band away from the lamp, rim toward it; outside →
     the shade tone, like the floor it stands on (§2.1 "same ground"); contact shadow
  2. type riding the set: the menu board and the gate sign through their four corners (§2.8)
  3. after only — A3 bloom from the emission pass (practicals only), A4 depth blur from the
     mist pass (the character blurred by the same amount as the floor under it)
  4. the progress rule
Cast animation is quantised to twos (A2); the camera and the set run on ones.
"""
import json
import math
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

args = sys.argv[1:]
D = args[0]
opt = {args[i]: args[i + 1] for i in range(1, len(args) - 1, 2)}
MODE = opt.get("--mode", "after")
AFTER = MODE == "after"
meta = json.load(open(os.path.join(D, f"{MODE}_anchors.json")))
W, H, FPS = meta["width"], meta["height"], meta.get("fps", 24)
K = W / 1920                     # layout numbers are 1080p numbers
SS = 2                           # cast supersampling

INK = (26, 26, 24)
ACCENT = (226, 77, 40)           # #E24D28 — money, and Lucky
CARD = (253, 251, 245)
FD = "/usr/share/fonts/truetype/dejavu/"
FONT_B = FD + "DejaVuSans-Bold.ttf"
FONT_C = FD + "DejaVuSansCondensed-Bold.ttf" if os.path.exists(FD + "DejaVuSansCondensed-Bold.ttf") else FONT_B


def hx(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def shade_of(c):
    """The shade tone: darker and cooler, the same shift the set's two-tone ramp uses."""
    return tuple(int(v * f) for v, f in zip(c, (0.58, 0.61, 0.70)))


def rim_of(c):
    return tuple(min(255, int(v * 1.12 + 22)) for v in (c[0] + 6, c[1] + 2, c[2] - 8))


def ink_px(mist):
    """The same weight curve as the set's Line Art (scene.py A5), from the cast's distance."""
    if not AFTER:
        return 3.0
    d = 4 + mist * 16
    t = max(0, min(1, (d - 4) / 14))
    return 4.0 + (1.6 - 4.0) * t


# ── the cast: Lucky's rig with parameters (§2.5) ─────────────────────────────
CAST = {
    "lucky": dict(outfit="#E24D28", hair="lucky", hairColor="#1A1A18", cap="#2F5DA8", skin="#F2D2B0", face=1),
    "cashier": dict(outfit="#2E9E6B", hair="bob", hairColor="#5A3A22", skin="#E9C39E", face=1, apron=True),
    "man_blue": dict(outfit="#3B6FD4", hair="none", skin="#D8A882", face=-1),
    "diner": dict(outfit="#7A4FD0", hair="long", hairColor="#1A1A18", strands="#FF6FB5", skin="#F0CFAE", face=1),
    "walker": dict(outfit="#C9922E", hair="none", skin="#C98F6B", face=-1),
}


def draw_character(frame, who, a, f, clip_line=None):
    p = CAST[who]
    fx, fy = a["foot"][0], a["foot"][1]
    tx, ty = a["top"][0], a["top"][1]
    Hs = fy - ty
    if Hs < 8:
        return
    lit = a["lit"]
    side = a["light_side"]
    tw = ink_px(a["mist"]) * K * SS
    R = Hs * 0.2 * SS
    # animation on twos (A2): idle sway and a blink, advanced every second frame
    g = (f // 2) * 2
    seed = sum(map(ord, who))                      # stable across runs (str hash is salted)
    sway = math.sin(g / 24 * 1.7 + seed % 7) * R * 0.05
    blink = f > 1 and ((g + seed * 7) % 72) < 4
    cw, ch = int(R * 6), int(Hs * SS * 1.25)
    ox, oy = fx * SS - cw / 2, fy * SS - ch + R * 0.5     # local canvas origin, in supersampled px
    cv = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    d = ImageDraw.Draw(cv)
    L = lambda x, y: (x - ox, y - oy)                     # frame (ss) → local
    FX, FY = fx * SS, fy * SS
    head_c = (FX + sway, FY - Hs * SS + R)
    body_top, body_bot = head_c[1] + R * 0.78, FY - Hs * SS * 0.16

    def tone(c):
        c = hx(c) if isinstance(c, str) else c
        return c if lit or not AFTER else shade_of(c)

    def part(shape, xy, color, width=None):
        """Fill one part, shade the side away from the lamp, rim the side toward it, then ink."""
        base = tone(color)
        m = Image.new("L", cv.size, 0)
        md = ImageDraw.Draw(m)
        getattr(md, shape)(xy, fill=255, **({"width": int(width)} if width else {}))
        cv.paste(base + (255,), (0, 0), m)
        if AFTER and lit:
            off = ImageChops.offset(m, int(side * R * 0.34), int(-R * 0.08))
            band = ImageChops.subtract(m, off)
            cv.paste(shade_of(base) + (255,), (0, 0), band)
            rim = ImageChops.subtract(m, ImageChops.offset(m, int(-side * R * 0.07), 0))
            cv.paste(rim_of(base) + (255,), (0, 0), rim)
        if shape != "line":
            getattr(d, shape)(xy, outline=INK + (255,), width=int(tw))

    # legs and feet
    for sgn in (-1, 1):
        hip = L(FX + sgn * R * 0.32 + sway * 0.3, body_bot - R * 0.1)
        foot = L(FX + sgn * R * 0.36, FY - R * 0.05)
        d.line([hip, foot], fill=INK + (255,), width=int(tw * 1.6))
        d.ellipse([foot[0] - R * 0.2 + sgn * R * 0.08, foot[1] - R * 0.1, foot[0] + R * 0.2 + sgn * R * 0.08, foot[1] + R * 0.1],
                  fill=INK + (255,))
    # body (a bean) and arms
    bx0, bx1 = FX - R * 0.78 + sway, FX + R * 0.78 + sway
    part("ellipse", [*L(bx0, body_top), *L(bx1, body_bot)], p["outfit"])
    if p.get("apron"):
        part("rounded_rectangle", [*L(FX - R * 0.45 + sway, body_top + R * 0.35), *L(FX + R * 0.45 + sway, body_bot - R * 0.05)], "#FDFBF5")
    for sgn in (-1, 1):
        sh = L(FX + sgn * R * 0.7 + sway, body_top + R * 0.35)
        hand = L(FX + sgn * R * 0.95 + sway * 1.4, body_top + R * 1.25)
        d.line([sh, hand], fill=INK + (255,), width=int(tw * 1.5))
        d.ellipse([hand[0] - R * 0.11, hand[1] - R * 0.11, hand[0] + R * 0.11, hand[1] + R * 0.11], fill=tone(p["skin"]) + (255,), outline=INK + (255,), width=int(tw * 0.7))
    # hair behind the head
    hc = head_c
    if p["hair"] in ("lucky", "bob", "long"):
        drop = {"lucky": 0.95, "bob": 0.75, "long": 1.35}[p["hair"]]
        hb = [*L(hc[0] - R * 1.1, hc[1] - R * 0.75), *L(hc[0] + R * 1.1, hc[1] + R * drop)]
        hm = Image.new("L", cv.size, 0)
        ImageDraw.Draw(hm).rounded_rectangle(hb, radius=int(R * 0.85), fill=255)
        cv.paste(tone(p["hairColor"]) + (255,), (0, 0), hm)
        d.rounded_rectangle(hb, radius=int(R * 0.85), outline=INK + (255,), width=int(tw))
        if p.get("strands"):
            for s_ in (-1.0, 0.86):
                d.line([L(hc[0] + R * s_, hc[1] + R * 0.1), L(hc[0] + R * s_, hc[1] + R * (drop - 0.1))], fill=tone(p["strands"]) + (255,), width=int(R * 0.12))
    # the head
    part("ellipse", [*L(hc[0] - R, hc[1] - R), *L(hc[0] + R, hc[1] + R)], p["skin"])
    if p["hair"] in ("lucky", "bob", "long"):
        d.chord([*L(hc[0] - R * 1.02, hc[1] - R * 1.05), *L(hc[0] + R * 1.02, hc[1] + R * 0.55)], 180, 360, fill=tone(p["hairColor"]) + (255,), outline=INK + (255,), width=int(tw))
    if p.get("cap"):
        d.chord([*L(hc[0] - R * 1.0, hc[1] - R * 1.12), *L(hc[0] + R * 1.0, hc[1] + R * 0.35)], 180, 360, fill=tone(p["cap"]) + (255,), outline=INK + (255,), width=int(tw))
        bx = hc[0] + p["face"] * R * 0.55
        d.ellipse([*L(bx - R * 0.72, hc[1] - R * 0.52), *L(bx + R * 0.72, hc[1] - R * 0.28)], fill=tone(p["cap"]) + (255,), outline=INK + (255,), width=int(tw))
    # the face: dot eyes, brows, a small mouth — Oversimplified's
    fdx = p["face"] * R * 0.16
    for sgn in (-1, 1):
        ex, ey = hc[0] + fdx + sgn * R * 0.34, hc[1] + R * 0.02
        if blink:
            d.line([L(ex - R * 0.1, ey), L(ex + R * 0.1, ey)], fill=INK + (255,), width=int(tw * 0.8))
        else:
            d.ellipse([*L(ex - R * 0.085, ey - R * 0.11), *L(ex + R * 0.085, ey + R * 0.11)], fill=INK + (255,))
        d.line([L(ex - R * 0.14, ey - R * 0.26), L(ex + R * 0.12, ey - R * 0.3 + sgn * R * 0.03)], fill=INK + (255,), width=int(tw * 0.7))
    d.arc([*L(hc[0] + fdx - R * 0.2, hc[1] + R * 0.28), *L(hc[0] + fdx + R * 0.2, hc[1] + R * 0.5)], 20, 160, fill=INK + (255,), width=int(tw * 0.75))

    small = cv.resize((cw // SS, ch // SS), Image.LANCZOS)
    pos = (int(ox / SS), int(oy / SS))
    if clip_line is not None:  # the counter occludes the cashier below its top edge (§9.8 occlusion)
        (x0, y0, _), (x1, y1, _) = clip_line
        cm = Image.new("L", small.size, 255)
        cd = ImageDraw.Draw(cm)
        yl = lambda x: y0 + (y1 - y0) * (x - x0) / (x1 - x0)
        cd.polygon([(0, yl(pos[0]) - pos[1]), (small.size[0], yl(pos[0] + small.size[0]) - pos[1]), small.size, (0, small.size[1])], fill=0)
        small.putalpha(ImageChops.multiply(small.getchannel("A"), cm))
    if AFTER:  # contact shadow (§2.1 grounded)
        sh = Image.new("RGBA", frame.size, (0, 0, 0, 0))
        ImageDraw.Draw(sh).ellipse([fx - Hs * 0.2, fy - Hs * 0.035, fx + Hs * 0.2, fy + Hs * 0.035], fill=INK + (60,))
        if clip_line is None:
            frame.alpha_composite(sh.filter(ImageFilter.GaussianBlur(1.5 * K)))
    frame.alpha_composite(small, pos)
    return (pos, small)


# ── type riding the set (§2.8): render flat, warp onto the surface's four corners ─
def coeffs(dst, src):
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
        B += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()


def ride(frame, quad, card):
    q = [(c[0], c[1]) for c in quad]
    src = [(0, 0), (card.width, 0), (card.width, card.height), (0, card.height)]
    warped = card.transform(frame.size, Image.PERSPECTIVE, coeffs(q, src), Image.BICUBIC)
    frame.alpha_composite(warped)


def menu_card():
    c = Image.new("RGBA", (1500, 450), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    fb, fs = ImageFont.truetype(FONT_B, 70), ImageFont.truetype(FONT_C, 54)
    d.text((60, 30), "GATE B DELI", font=fb, fill=INK)
    rows = [("Turkey club", "8.99"), ("Egg & cress", "7.49"), ("Flat white", "4.25")]
    for i, (a_, b_) in enumerate(rows):
        y = 150 + i * 92
        d.text((70, y), a_, font=fs, fill=(60, 58, 54))
        d.text((1300, y), b_, font=fs, fill=INK)
        d.line([(520, y + 42), (1270, y + 42)], fill=(170, 164, 150), width=4)
    return c


def gate_card():
    c = Image.new("RGBA", (1300, 500), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    d.text((90, 40), "B12", font=ImageFont.truetype(FONT_B, 300), fill=INK)
    d.text((820, 170), "B10–B16", font=ImageFont.truetype(FONT_C, 90), fill=(90, 88, 84))
    d.polygon([(900, 330), (1150, 330), (1150, 290), (1230, 370), (1150, 450), (1150, 410), (900, 410)], fill=INK)
    return c


# ── the frame ────────────────────────────────────────────────────────────────
def load16(path):
    im = Image.open(path)
    a = np.asarray(im).astype(np.float32)
    return a / (65535.0 if a.max() > 255 else 255.0)


def composite(f, beauty, mist_p, emit_p):
    A = meta["frames"][str(f)]
    frame = Image.open(beauty).convert("RGBA")
    ride(frame, A["board"], menu_card())
    ride(frame, A["gate"], gate_card())
    # the price tag at the case — the frame's one accent element (§2.2)
    px_, py_ = A["price"][0], A["price"][1]
    tag = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    td = ImageDraw.Draw(tag)
    tw_, th_ = 118 * K, 50 * K
    td.rounded_rectangle([px_ - tw_ / 2, py_ - th_, px_ + tw_ / 2, py_], 6 * K, fill=ACCENT + (255,), outline=INK + (255,), width=max(1, int(2.5 * K)))
    td.text((px_ - tw_ / 2 + 12 * K, py_ - th_ + 6 * K), "$8.99", font=ImageFont.truetype(FONT_B, int(32 * K)), fill=CARD)
    tag = tag.rotate(-4, center=(px_, py_))
    frame.alpha_composite(tag)

    mist = load16(mist_p) if AFTER else None
    if mist is not None and mist.ndim == 3:
        mist = mist[..., 0]
    order = sorted(A["cast"].items(), key=lambda kv: kv[1]["foot"][1])   # far to near
    for who, a in order:
        placed = draw_character(frame, who, a, f, clip_line=A["counter_edge"] if who == "cashier" else None)
        if placed and mist is not None:   # the character takes its own depth into the blur (§2.1 same focus)
            (x0, y0), sm = placed
            al = np.asarray(sm.getchannel("A")) > 20
            ys, xs = np.nonzero(al)
            ys, xs = ys + y0, xs + x0
            ok = (ys >= 0) & (ys < H) & (xs >= 0) & (xs < W)
            mist[ys[ok], xs[ok]] = a["mist"]

    if AFTER:
        rgb = frame.convert("RGB")
        # A3: bloom from the emission pass — practicals only, never the whole frame
        idx = load16(emit_p.replace("_emit", "_index"))
        idx = idx[..., 0] if idx.ndim == 3 else idx
        lum = np.asarray(rgb).astype(np.float32).mean(axis=2) / 255
        mask = Image.fromarray(((idx > 0.5) * np.clip((lum - 0.55) / 0.45, 0, 1) * 255).astype(np.uint8))
        glow = Image.merge("RGB", [mask, mask, mask])
        g1 = np.asarray(glow.filter(ImageFilter.GaussianBlur(10 * K))).astype(np.float32)
        g2 = np.asarray(glow.filter(ImageFilter.GaussianBlur(34 * K))).astype(np.float32)
        warm = np.array([1.0, 0.86, 0.62], np.float32)
        base = np.asarray(rgb).astype(np.float32)
        bl = (0.45 * g1 + 0.55 * g2) * warm
        base = 255 - (255 - base) * (1 - np.clip(bl, 0, 255) / 255 * 0.55)     # screen
        # A4: depth blur from the mist pass, focused on Lucky — the blur is not Blender's (§9.8)
        focus = A["cast"]["lucky"]["mist"]
        tilt = 5.5 if meta.get("shot") == "orbit" else 3.2      # a stronger falloff sells the miniature
        amt = np.clip((np.abs(mist - focus) - 0.07) * tilt, 0, 1)
        img = Image.fromarray(base.astype(np.uint8))
        levels = [np.asarray(img).astype(np.float32)] + [np.asarray(img.filter(ImageFilter.GaussianBlur(r * K))).astype(np.float32) for r in (1.2, 2.4, 4.0)]
        x = amt * 3
        i0 = np.clip(np.floor(x).astype(int), 0, 2)
        t = (x - i0)[..., None]
        stack = np.stack(levels)
        hh, ww = np.indices(amt.shape)
        out = stack[i0, hh, ww] * (1 - t) + stack[i0 + 1, hh, ww] * t
        frame = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).convert("RGBA")

    # the floating location label (orbit shots): white type over the model, a thin leader down to it
    if meta.get("shot") == "orbit" and "loc_label" in A:
        t_in = max(0.0, min(1.0, (f - 30) / 14))
        if t_in > 0:
            lx, ly = A["loc_label"][0], A["loc_label"][1]
            lab = Image.new("RGBA", frame.size, (0, 0, 0, 0))
            ld = ImageDraw.Draw(lab)
            fnt = ImageFont.truetype(FONT_B, int(40 * K))
            txt = "GATE B DELI"
            tw = ld.textlength(txt, font=fnt)
            top = ly - 150 * K - (1 - t_in) * 20 * K
            a8 = int(255 * t_in)
            ld.line([(lx, ly), (lx, top + 52 * K)], fill=(253, 251, 245, a8), width=max(1, int(2 * K)))
            ld.ellipse([lx - 4 * K, ly - 4 * K, lx + 4 * K, ly + 4 * K], fill=(253, 251, 245, a8))
            ld.text((lx - tw / 2 + 2 * K, top + 2 * K), txt, font=fnt, fill=(0, 0, 0, int(110 * t_in)))
            ld.text((lx - tw / 2, top), txt, font=fnt, fill=(253, 251, 245, a8))
            frame.alpha_composite(lab)

    # the progress rule — accent, 10 px, every frame (§2.2)
    n = len(meta["frames"])
    prog = (f - 1) / max(1, n - 1) * 0.35 + 0.06
    ImageDraw.Draw(frame).rectangle([0, H - 10 * K, W * prog, H], fill=ACCENT + (255,))
    return frame.convert("RGB")


def paths(f):
    tag = "" if len(meta["frames"]) == 1 else f"{f:04d}"
    return (os.path.join(D, f"{MODE}_{f:04d}.png"),
            os.path.join(D, f"{MODE}_mist{tag}.png"),
            os.path.join(D, f"{MODE}_emit{tag}.png"))


if "--video" in opt:
    tmp = os.path.join(D, f"{MODE}_comp")
    os.makedirs(tmp, exist_ok=True)
    frames = sorted(int(k) for k in meta["frames"])
    for f in frames:
        composite(f, *paths(f)).save(os.path.join(tmp, f"{f:04d}.png"))
    subprocess.run([opt.get("--ffmpeg", "ffmpeg"), "-v", "error", "-y", "-framerate", str(FPS), "-i", os.path.join(tmp, "%04d.png"),
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart", opt["--video"]], check=True)
    print("wrote", opt["--video"])
else:
    f = int(opt.get("--frame", "1"))
    out = opt.get("--out", os.path.join(D, f"{MODE}_final.png"))
    composite(f, *paths(f)).save(out)
    print("wrote", out)
