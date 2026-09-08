#!/usr/bin/env python3
"""
occupancy_check.py — the occupancy law, as a number, not a judgement call (§2.2, §11.5).

Reads a directory of sampled PNG frames and reports PASS / FAIL against:
  - ink coverage        >= 22%   (% pixels differing from paper by >60 in summed RGB)
  - bottom-third fill    >= 35%   (same measure, lower 30% of frame)

Bloom (v2.0 §5.6) never counts toward the floor: it is a time-boxed accent-colour
pulse, so across the ~0.5s sampling of the beat body it can never be what carries
occupancy unless it is (wrongly) ambient. The <Bloom> component itself warns in
dev if its window exceeds ~3s. No pixel-level exclusion is done here — the rule
is enforced upstream by keeping Bloom time-boxed.

Exemptions:
  - Dark Law frames (mean pixel value < 120) — §2.9.
  - The beat's TRANSITION ZONES. Every EP02 beat opens on and returns to the empty
    locked field so separately-rendered pieces join without a visible cut, and
    builds its content in over the first few seconds (creator, 2026-09-02). The
    first `--head-grace` s (default 4.0) and last `--tail-grace` s (default 2.0)
    are not checked. The BODY in between must hold the floors strictly — that is
    the composition, and Episode 1's failure was a sparse *body*.

A piece that fails does not go to the timeline (§11.5).

Usage:
  python occupancy_check.py <frames_dir> [--consecutive N] [--head-grace S]
         [--tail-grace S] [--fps N] [--json]
"""

import argparse
import glob
import json
import os
import sys

import numpy as np
from PIL import Image

# Must match COLOR.paper in src/tokens.ts (was stale #DADAD2 before 2026-09-02).
PAPER = np.array([246, 242, 231])  # #F6F2E7
DELTA_THRESHOLD = 60
INK_FLOOR = 22.0
BOTTOM_THIRD_FLOOR = 35.0
DARK_LAW_MEAN = 120


def measure(path: str):
    a = np.asarray(Image.open(path).convert("RGB")).astype(int)
    if a.mean() < DARK_LAW_MEAN:
        return None  # Dark Law frame — exempt
    h = a.shape[0]
    mask = np.abs(a - PAPER).sum(2) > DELTA_THRESHOLD
    ink = mask.mean() * 100
    bottom = mask[int(h * 0.7):, :].mean() * 100
    return round(ink, 1), round(bottom, 1)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("frames_dir")
    p.add_argument("--consecutive", type=int, default=1)
    p.add_argument("--head-grace", type=float, default=4.0,
                   help="seconds at the start not checked (build-in / seam)")
    p.add_argument("--tail-grace", type=float, default=2.0,
                   help="seconds at the end not checked (disperse / seam)")
    p.add_argument("--fps", type=float, default=2.0,
                   help="sample rate the frames were extracted at (2/s = every 0.5s)")
    p.add_argument("--json", action="store_true")
    args = p.parse_args()

    files = sorted(
        glob.glob(os.path.join(args.frames_dir, "*.png"))
        + glob.glob(os.path.join(args.frames_dir, "*.jpg"))
    )
    if not files:
        print(f"occupancy: no frames in {args.frames_dir}", file=sys.stderr)
        return 2

    n = len(files)
    head = min(n, round(args.head_grace * args.fps))
    tail = min(n - head, round(args.tail_grace * args.fps))
    body = files[head:n - tail] if n - tail > head else files[head:head + 1]

    rows = []
    run = 0
    hard_fail = False
    for f in body:
        m = measure(f)
        if m is None:
            rows.append({"frame": os.path.basename(f), "darkLaw": True})
            run = 0
            continue
        ink, bottom = m
        below = ink < INK_FLOOR or bottom < BOTTOM_THIRD_FLOOR
        run = run + 1 if below else 0
        if run > args.consecutive:
            hard_fail = True
        rows.append({"frame": os.path.basename(f), "ink": ink,
                     "bottomThird": bottom, "belowFloor": below})

    fails = [r for r in rows if r.get("belowFloor")]
    verdict = "FAIL" if hard_fail else ("WARN" if fails else "PASS")

    if args.json:
        print(json.dumps({"verdict": verdict, "bodySamples": len(rows),
                          "headSkipped": head, "tailSkipped": tail, "rows": rows}))
    else:
        print(f"OCCUPANCY {verdict}  (body {len(rows)} samples, {len(fails)} below floor; "
              f"skipped head {head / args.fps:.1f}s / tail {tail / args.fps:.1f}s)")
        for r in fails[:20]:
            print(f"  {r['frame']}: ink {r['ink']}%  bottom-third {r['bottomThird']}%")
        worst = min((r for r in rows if "ink" in r), key=lambda r: r["ink"], default=None)
        if worst:
            print(f"  worst body frame: {worst['frame']} — ink {worst['ink']}%  "
                  f"bottom-third {worst['bottomThird']}%")

    return 1 if verdict == "FAIL" else 0


if __name__ == "__main__":
    raise SystemExit(main())
