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

# per-beat ProRes HQ clips → out/beats-nif004/NIF004-B##.mov  (for the conform)
node scripts/render-beats-nif004.mjs

# OR the whole episode in one file → out/beats-nif004/NIF004-EPISODE.mov
node scripts/render-beats-nif004.mjs --episode

# fast H.264 review copies instead
node scripts/render-beats-nif004.mjs --h264
```

Composition ids: `NIF004-B00v4` … `NIF004-B33v4` (per beat), `NIF004-V4`
(whole episode), `NIF004-SFX` (SFX-only stem — render to a .wav for a separate
Fairlight track if wanted).

## Resolve conform

1. Import the 34 `NIF004-B##.mov` clips (or the single `NIF004-EPISODE.mov`).
2. If using per-beat clips: lay them end-to-end in id order, hard cuts, at
   30fps 1920×1080. Boundaries are in `NIF004-markers.csv` (import as timeline
   markers).
3. Select all clips → **Add Cross Dissolve** (default length is fine).
4. **Subtitles:** auto-transcribe → correct against `01_script/script.md` PLAIN.
5. **Music:** one bed, ducked under VO. Swell into the B30 reversal
   (15:48.2), lift on the B33 CTA
   (17:15.3), fade the last ~2s.
6. **SFX:** already baked per beat. To ride the level separately, mute the beat
   audio's SFX and drop the `NIF004-SFX` stem on its own track.
7. Grade: warm, gentle corner vignette (removed from the Remotion picture since
   Ep3 — it's a hand grade now).

## FAST-flagged beats (VO came in above the 134 wpm calibration)

- **B13** — 155.4 wpm (+16%). Accepted per the one-take rule (§22.11). No re-record.
- **B16** — 169.6 wpm (+26.6%). Accepted per the one-take rule (§22.11). No re-record.
- **B19** — 155.5 wpm (+16.1%). Accepted per the one-take rule (§22.11). No re-record.
- **B24** — 158.3 wpm (+18.1%). Accepted per the one-take rule (§22.11). No re-record.
- **B29** — 164.5 wpm (+22.7%). Accepted per the one-take rule (§22.11). No re-record.
- **B33** — 156.9 wpm (+17.1%). Accepted per the one-take rule (§22.11). No re-record.
