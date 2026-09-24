"""
Mock of the Remotion text layer for the Unseen style frame — for judging the look only.
In production every word and line is drawn by Remotion from the same anchors JSON.

    python3 overlay_mock.py <raw.png> <raw.anchors.json> <out.png>
"""
import json
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

raw, anchors_file, out = sys.argv[1:4]
img = Image.open(raw).convert("RGBA")
W, H = img.size
A = json.load(open(anchors_file))["anchors"]

INK = (16, 21, 27)
PAPER = (244, 240, 232)
ACCENT = (255, 200, 61)       # the one accent: the thing that is hidden
MUTED = (178, 187, 198)
F = "/usr/share/fonts/truetype/dejavu/"
bold = lambda s: ImageFont.truetype(F + "DejaVuSans-Bold.ttf", s)
reg = lambda s: ImageFont.truetype(F + "DejaVuSans.ttf", s)
mono = lambda s: ImageFont.truetype(F + "DejaVuSansMono-Bold.ttf", s)

layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
shadow = Image.new("RGBA", img.size, (0, 0, 0, 0))
d = ImageDraw.Draw(layer)
ds = ImageDraw.Draw(shadow)


def card(x, y, kicker, title, sub, anchor, side="right"):
    """A label: kicker in accent, title, one line of consequence, a leader to the anchor."""
    pad = 22
    fk, ft, fs = bold(20), bold(34), reg(24)
    w = max(d.textlength(kicker, fk) * 1.12, d.textlength(title, ft), d.textlength(sub, fs)) + pad * 2
    h = 128
    if x < 0:  # negative x = right-aligned, that far from the right edge
        x = W + x - w
    ds.rounded_rectangle((x + 4, y + 8, x + w + 4, y + h + 8), 10, fill=(0, 0, 0, 120))
    d.rounded_rectangle((x, y, x + w, y + h), 10, fill=(*INK, 228))
    d.rectangle((x, y + 14, x + 5, y + h - 14), fill=ACCENT)
    cx = x + pad
    for ch in kicker:  # letter-spaced kicker
        d.text((cx, y + 16), ch, font=fk, fill=ACCENT)
        cx += d.textlength(ch, fk) + 2.2
    d.text((x + pad, y + 42), title, font=ft, fill=PAPER)
    d.text((x + pad, y + 86), sub, font=fs, fill=MUTED)
    # leader: from the card edge nearest the anchor, with one elbow
    ax, ay = anchor
    sx = x + w if side == "right" else x
    sy = y + h / 2
    ex = ax - 70 if side == "right" else ax + 70
    ex = max(min(ex, max(sx, ax)), min(sx, ax))
    d.line([(sx, sy), (ex, sy), (ax, ay)], fill=(*PAPER, 235), width=3, joint="curve")
    d.ellipse((ax - 9, ay - 9, ax + 9, ay + 9), outline=ACCENT, width=3)
    d.ellipse((ax - 3, ay - 3, ax + 3, ay + 3), fill=ACCENT)


card(90, 200, "THE HEAD", "Potassium chlorate + sulfur", "It carries its own oxygen.", A["head_cut"])
card(90, 820, "THE STICK", "Soaked in paraffin wax", "The bridge from flame to wood.", A["wax_cut"])
card(-90, 846, "THE STRIKER", "Red phosphorus + ground glass", "On the box. Never on the match.", A["striker"], side="left")

# wordmark
x = 90
for ch in "UNSEEN":
    d.text((x, 92), ch, font=bold(26), fill=PAPER)
    x += d.textlength(ch, bold(26)) + 7
d.rectangle((90, 130, 90 + 34, 134), fill=ACCENT)

# the time ruler — the channel's constant, like SAP's progress rule
y0, xl, xr = H - 64, 90, W - 90
d.line([(xl, y0), (xr, y0)], fill=(*PAPER, 150), width=2)
for i in range(0, 31):
    tx = xl + (xr - xl) * i / 30
    big = i % 10 == 0
    d.line([(tx, y0 - (14 if big else 7)), (tx, y0)], fill=(*PAPER, 200 if big else 110), width=2)
    if big:
        d.text((tx - 12, y0 + 8), f"{i // 10} s", font=reg(20), fill=MUTED)
t = 0.02
px = xl + (xr - xl) * t / 3
d.line([(xl, y0), (px, y0)], fill=ACCENT, width=5)
d.polygon([(px - 9, y0 - 26), (px + 9, y0 - 26), (px, y0 - 12)], fill=ACCENT)
d.text((px + 18, y0 - 58), f"{t:.2f} s", font=mono(34), fill=ACCENT)

shadow = shadow.filter(ImageFilter.GaussianBlur(10))
out_img = Image.alpha_composite(Image.alpha_composite(img, shadow), layer)
out_img.convert("RGB").save(out, quality=92)
print("wrote", out)
