# NIF004 — render + Resolve finish guide

**Episode:** Google Maps — the hidden economics of the "free" map.
**Runtime:** 17:35.1 · 31654 frames @ 30fps · 34 beats (B00–B33).
Generated 2026-09-08 from `03_transcript/reconcile.json`.

## What Remotion renders (the picture)

Every NIF004 beat renders **picture + VO + baked per-beat SFX**. Nothing else is
baked (runbook §22.7 / creator 2026-09-09):

- **NO music** — added in DaVinci Resolve.
- **NO subtitles** — auto-transcribe in Resolve Studio, match wording to
  `01_script/script.md` PLAIN.
- **NO beat-to-beat transitions** — each clip starts and ends on its full
  picture. Add a **cross-dissolve** in Resolve (select all → Add Cross Dissolve;
  the creator picked a Resolve cross-dissolve, no baked fade).
- **Stamps ARE baked** — the short boxed punch labels (e.g. "THE SAME MACHINE",
  "+1,000% OVERNIGHT") are part of the Remotion picture, one per beat max. They
  are editorial accents, not subtitles. See `NIF004-text-timing.md` for the
  inventory so the subtitle pass doesn't double them.

## Render commands (from `video-os/engine/remotion/`)

```
# rebuild the per-beat SFX mixes (safe to re-run)
node scripts/build-sfx-mix-nif004.mjs

# --- the recommended path: per-beat clips, then concat ---
# 34 H.264 clips → out/review-nif004/NIF004-B##.mp4
node scripts/render-beats-nif004.mjs --h264
# stitch them into one file (hard cuts) → out/review-nif004/NIF004-EPISODE.mp4
node scripts/concat-nif004.mjs

# ProRes HQ instead (for archival / a lossless conform):
node scripts/render-beats-nif004.mjs        # → out/beats-nif004/NIF004-B##.mov
node scripts/concat-nif004.mjs --prores     # → out/beats-nif004/NIF004-EPISODE.mov

# OR the whole episode as one render (slower, all-or-nothing):
node scripts/render-beats-nif004.mjs --episode --h264
```

Per-beat clips are what the Resolve conform wants (one per timeline clip, so the
cross-dissolves go between them). The concat is a stream-copy — near instant.
Composition ids: `NIF004-B00v4` … `NIF004-B33v4` (per beat), `NIF004-V4`
(whole episode), `NIF004-SFX` (SFX-only stem — render to a .wav for a separate
Fairlight track if wanted).

## Resolve conform

**A built timeline already exists** — project `NIF004`, timeline `NIF004 assembly`
(assembled by MCP, 2026-09-09). It has:

- **V1** — 34 beat clips in order, with a **tiered dip-to-black gap** between each
  (0.27s inside tight argument runs, 0.5s default, 1.0s at the 5 act breaks +
  the B29→B30 reversal). Total 17:53.
- **A1** — the beat audio (VO + baked SFX), gaps matching V1.
- **A2** — the **music bed**, continuous, rotating per act, pre-lowered −15 dB
  (`07_audio/music/bed/`):
  | act | beats | track |
  |---|---|---|
  | 1 | B00–B03 | Lifting Dreams — Aakash Gandhi |
  | 2 | B04–B11 | Meridian — National Sweetheart (loops once) |
  | 3 | B12–B19 | September Pass — Asher Fulero |
  | 4 | B20–B25 | Simmering — Asher Fulero |
  | 5 | B26–B33 | Sleeplessness — The Brothers Records (loops once) |
- A flat 17:53 H.264 render sits at `out/review-nif004/NIF004-RESOLVE-CUT.mp4`.

**Still to do by hand in Resolve** (the API can't do these):

1. **Cross-dissolves / fades** — the gaps are hard-cut to black. For a soft dip,
   select all V1 clips → drag the fade handles (6f in / 6f out) or add Dip to
   Color. The API cannot add transitions.
2. **Music level / ducking** — the bed is a fixed −15 dB. Add a track compressor
   on A2 keyed off the VO bus for real ducking; ride the A2 fader to taste.
   Swell A2 +4 dB into the B30 reversal (15:48), warm lift on the B33 CTA
   (17:15), full fade over the last ~4 s.
3. **Subtitles** — auto-transcribe → correct against `01_script/script.md` PLAIN.
   (`NIF004-text-timing.md` lists the baked Stamps so the SRT doesn't double them.)
4. **Grade** — warm, gentle corner vignette (a hand grade since Ep3).

If rebuilding the timeline from scratch: import the 34 `NIF004-B##.mp4` from
`out/review-nif004/`, lay them at the record-frames in `NIF004-markers.csv`,
music from `07_audio/music/bed/`.

- **SFX stem:** to ride SFX separately, render `NIF004-SFX` to a `.wav` and drop
  it on its own Fairlight track (mute the A1 SFX).

## FAST-flagged beats (VO came in above the 134 wpm calibration)

- **B13** — 155.4 wpm (+16%). Accepted per the one-take rule (§22.11). No re-record.
- **B16** — 169.6 wpm (+26.6%). Accepted per the one-take rule (§22.11). No re-record.
- **B19** — 155.5 wpm (+16.1%). Accepted per the one-take rule (§22.11). No re-record.
- **B24** — 158.3 wpm (+18.1%). Accepted per the one-take rule (§22.11). No re-record.
- **B29** — 164.5 wpm (+22.7%). Accepted per the one-take rule (§22.11). No re-record.
- **B33** — 156.9 wpm (+17.1%). Accepted per the one-take rule (§22.11). No re-record.
