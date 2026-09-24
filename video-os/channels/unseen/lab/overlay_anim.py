"""
Mock of the Remotion text layer, animated — for judging the Unseen look in motion.
In production this is a Remotion composition reading the same per-frame anchors and
landing each label on the word that names it (timing.json).

    python3 overlay_anim.py <frames_dir/> <out.mp4> [--ffmpeg <path>]

Reads <frames_dir>/####.png and <frames_dir>/anchors.json (written by
styleframe_match.py --anim N), draws the labels, the time ruler and the wordmark,
and encodes an H.264 preview.
"""
import json
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

src, out = sys.argv[1], sys.argv[2]
ffmpeg = sys.argv[sys.argv.index("--ffmpeg") + 1] if "--ffmpeg" in sys.argv else "ffmpeg"
meta = json.load(open(os.path.join(src, "anchors.json")))
W, H, FPS = meta["width"], meta["height"], meta.get("fps", 24)
FR = {int(k): v for k, v in meta["frames"].items()}
N = max(FR)
k = W / 1920  # every layout number below is a 1080p number

INK, PAPER, ACCENT, MUTED = (16, 21, 27), (244, 240, 232), (255, 200, 61), (178, 187, 198)
FD = "/usr/share/fonts/truetype/dejavu/"
font = lambda name, s: ImageFont.truetype(FD + name, max(8, round(s * k)))
BOLD, REG, MONO = "DejaVuSans-Bold.ttf", "DejaVuSans.ttf", "DejaVuSansMono-Bold.ttf"

ease = lambda t: 1 - (1 - max(0.0, min(1.0, t))) ** 3

# label timeline: (kicker, title, sub, anchor, card x, card y, side, first frame)
LABELS = [
    ("THE HEAD", "Potassium chlorate + sulfur", "It carries its own oxygen.", "head_cut", 90, 200, "right", 30),
    ("THE STICK", "Soaked in paraffin wax", "The bridge from flame to wood.", "wax_cut", 90, 820, "right", 52),
    ("THE STRIKER", "Red phosphorus + ground glass", "On the box. Never on the match.", "striker", -90, 846, "left", 74),
]


def partial(points, frac):
    """The first `frac` of a polyline, by length — a leader line that draws on."""
    segs = list(zip(points, points[1:]))
    lens = [((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2) ** 0.5 for a, b in segs]
    left = sum(lens) * frac
    outp = [points[0]]
    for (a, b), L in zip(segs, lens):
        if left >= L:
            outp.append(b)
            left -= L
        else:
            t = left / L if L else 0
            outp.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
            break
    return outp


def draw_label(d, ds, f, lab, anchors):
    kicker, title, sub, key, x, y, side, f0 = lab
    t_card = ease((f - f0) / 8)
    if t_card <= 0:
        return
    pad = 22 * k
    fk, ft, fs = font(BOLD, 20), font(BOLD, 34), font(REG, 24)
    w = max(d.textlength(kicker, fk) * 1.12, d.textlength(title, ft), d.textlength(sub, fs)) + pad * 2
    h = 128 * k
    x, y = x * k, y * k
    if x < 0:
        x = W + x - w
    slide = (1 - t_card) * 40 * k * (-1 if side == "right" else 1)
    x += slide
    a = int(228 * t_card)
    ds.rounded_rectangle((x + 4 * k, y + 8 * k, x + w + 4 * k, y + h + 8 * k), 10 * k, fill=(0, 0, 0, int(120 * t_card)))
    d.rounded_rectangle((x, y, x + w, y + h), 10 * k, fill=(*INK, a))
    d.rectangle((x, y + 14 * k, x + 5 * k, y + h - 14 * k), fill=(*ACCENT, int(255 * t_card)))
    ta = int(255 * t_card)
    cx = x + pad
    for ch in kicker:
        d.text((cx, y + 16 * k), ch, font=fk, fill=(*ACCENT, ta))
        cx += d.textlength(ch, fk) + 2.2 * k
    d.text((x + pad, y + 42 * k), title, font=ft, fill=(*PAPER, ta))
    d.text((x + pad, y + 86 * k), sub, font=fs, fill=(*MUTED, ta))
    # the leader draws on after the card lands, and follows the anchor every frame
    ax, ay = anchors[key]
    sx = x + w if side == "right" else x
    sy = y + h / 2
    ex = ax - 70 * k if side == "right" else ax + 70 * k
    ex = max(min(ex, max(sx, ax)), min(sx, ax))
    t_line = ease((f - f0 - 5) / 9)
    if t_line > 0:
        d.line(partial([(sx, sy), (ex, sy), (ax, ay)], t_line), fill=(*PAPER, 235), width=max(1, round(3 * k)))
    t_ring = ease((f - f0 - 13) / 5)
    if t_ring > 0:
        r = 9 * k * (0.4 + 0.6 * t_ring)
        d.ellipse((ax - r, ay - r, ax + r, ay + r), outline=ACCENT, width=max(1, round(3 * k)))
        d.ellipse((ax - 3 * k, ay - 3 * k, ax + 3 * k, ay + 3 * k), fill=ACCENT)


def draw_frame(f):
    img = Image.open(os.path.join(src, f"{f:04d}.png")).convert("RGBA")
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    shadow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d, ds = ImageDraw.Draw(layer), ImageDraw.Draw(shadow)
    for lab in LABELS:
        draw_label(d, ds, f, lab, FR[f])
    # wordmark
    x = 90 * k
    for ch in "UNSEEN":
        d.text((x, 92 * k), ch, font=font(BOLD, 26), fill=PAPER)
        x += d.textlength(ch, font(BOLD, 26)) + 7 * k
    d.rectangle((90 * k, 130 * k, 124 * k, 134 * k), fill=ACCENT)
    # the time ruler: 0–3 s of real time; this shot covers its first fraction (placeholder values)
    y0, xl, xr = H - 64 * k, 90 * k, W - 90 * k
    d.line([(xl, y0), (xr, y0)], fill=(*PAPER, 150), width=max(1, round(2 * k)))
    for i in range(31):
        tx = xl + (xr - xl) * i / 30
        big = i % 10 == 0
        d.line([(tx, y0 - (14 if big else 7) * k), (tx, y0)], fill=(*PAPER, 200 if big else 110), width=max(1, round(2 * k)))
        if big:
            d.text((tx - 12 * k, y0 + 8 * k), f"{i // 10} s", font=font(REG, 20), fill=MUTED)
    t = 0.30 * (f - 1) / (N - 1)
    px = xl + (xr - xl) * t / 3
    d.line([(xl, y0), (px, y0)], fill=ACCENT, width=max(2, round(5 * k)))
    d.polygon([(px - 9 * k, y0 - 26 * k), (px + 9 * k, y0 - 26 * k), (px, y0 - 12 * k)], fill=ACCENT)
    d.text((px + 18 * k, y0 - 58 * k), f"{t:.2f} s", font=font(MONO, 34), fill=ACCENT)
    shadow = shadow.filter(ImageFilter.GaussianBlur(10 * k))
    return Image.alpha_composite(Image.alpha_composite(img, shadow), layer).convert("RGB")


tmp = os.path.join(src, "comp")
os.makedirs(tmp, exist_ok=True)
for f in range(1, N + 1):
    draw_frame(f).save(os.path.join(tmp, f"{f:04d}.png"))
# hold the finished frame for a second so the last label can be read
for i in range(1, FPS + 1):
    os.link(os.path.join(tmp, f"{N:04d}.png"), os.path.join(tmp, f"{N + i:04d}.png"))
subprocess.run([ffmpeg, "-v", "error", "-y", "-framerate", str(FPS), "-i", os.path.join(tmp, "%04d.png"),
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart", out], check=True)
print("wrote", out)
