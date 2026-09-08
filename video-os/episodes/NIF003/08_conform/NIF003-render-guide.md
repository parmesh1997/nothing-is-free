# NIF003 — render guide (beat-by-beat, for the Resolve conform)

From 2026-09-06 (§22.7): NIF003 renders **one clip per beat**, picture-only
(no baked captions, no black-push transition — `noTransition` is set on every
beat). The creator assembles the 33 clips in DaVinci Resolve and adds
transitions, subtitles, and the kinetic "deep text" there.

## What Claude hands you per beat

1. **"good to go"** verdict (or "rebuilding") in `ep03-status` + a still to eyeball.
2. The render command (below) — the composition id is `NIF003-B##v4`.
3. The **text timing** cues → `NIF003-text-timing.md`.
4. The **SFX cues** → `NIF003-sfx-cues.md`.

## Render one beat

```bash
cd "D:\YT\Nothing Is Free\video-os\engine\remotion"
npx remotion render src/index.ts NIF003-B01v4 out/beats/NIF003-B01.mov ^
  --codec=prores --prores-profile=hq --audio-codec=aac --enforce-audio-track
```

- **Codec: ProRes 422 HQ** (`--prores-profile=hq`) — the edit master. Big files
  (~1–2 GB/beat) but clean for grading/scaling in Resolve. Use
  `--prores-profile=4444` only if a beat ever needs an alpha channel (none do —
  every beat is opaque).
- Audio = the beat's own VO (`B##.mp3`) **+ that beat's SFX** (`sfx-mix/B##.mp3`),
  both baked into the clip's stereo track. See the SFX note below.
- 1920×1080 @ 30 fps is fixed in the composition; don't override.
- `out/beats/` — make it once: `mkdir out\beats`

## Render all approved beats at once

```bash
node scripts/render-beats-nif003.mjs            # ProRes HQ, all 33 → out/beats/
node scripts/render-beats-nif003.mjs B01,B02    # just these
node scripts/render-beats-nif003.mjs --h264     # fast H.264 review copies instead
```

(script added 2026-09-06 — see `scripts/render-beats-nif003.mjs`)

## Quick review copy (small, fast, for eyeballing before the ProRes run)

```bash
npx remotion render src/index.ts NIF003-B01v4 out/review/NIF003-B01.mp4 ^
  --codec=h264 --crf=18 --audio-codec=aac
```

## A single still (what Claude checks during the audit)

```bash
npx remotion still src/index.ts NIF003-B01v4 out/audit/B01_f640.png --frame=640
```

## SFX — DONE (baked into the beat renders)

As of 2026-09-06 the SFX are wired into every beat comp in code and **verified
present in the rendered clips** (VO + SFX are two tracks `amix`'d into the clip's
audio — confirmed by an A/B render diff, not just by the code reading right).

The chain:

1. `src/nif003/v4/audio.tsx` → **`NIF003_SFX`** — the per-beat cue table
   (`{ at: <local frame>, s: "<slug>", g: <dB> }`). One source of truth.
2. `scripts/build-sfx-mix.mjs` — bakes each beat's cues (delay each one-shot to
   its frame, apply its `g`, sum) into **`public/audio/nif003/sfx-mix/B##.mp3`**.
   `render-beats-nif003.mjs` runs this first automatically (skip with `--no-sfx`).
3. **`<BeatSfx beat="B##" />`** in every beat's `V4Beat` wrapper plays that one
   mixed file as an `<Audio>` alongside the VO. (One pre-mixed file, not ~20
   `<Audio>` tags — that many tags crashes Chrome on a full render.)

To tweak a cue: edit `NIF003_SFX`, then re-render that beat (the mix rebuilds
itself). **Whole-bed level vs VO:** `SFX_BUS` in `audio.tsx` (linear gain, 1.0 =
as baked). Left at unity — ride the final SFX level in Resolve, or use the stem:

- `NIF003-SFX` composition → **standalone SFX-only stem** (render to `.wav`) for
  its own Fairlight track.
- `NIF003-sfx-cues.md` = the human-readable mirror of the code.

> 2026-09-06/07 note: in the first full `render-beats-nif003.mjs` pass B03 and
> B04 failed (a ~30 s edit-race where `audio.tsx` referenced `SFX_BUS` before it
> was declared). Fixed and **re-rendered clean 2026-09-07 01:12 — all 33
> `out/beats/NIF003-B##.mov` are present and verified** (ProRes HQ, 1920×1080@30,
> exact frame counts, VO+SFX on every clip).

## Music — REMOVED from the render

Creator 2026-09-06: the baked music bed was too loud. `MUSIC = false` in
`audio.tsx`; `MusicBed` is a no-op. **Add the music bed in DaVinci Resolve**
(the reference file is still at `public/audio/nif003/music/bed.mp3`).

## In DaVinci Resolve (after the 33 clips are in)

1. Lay the 33 beat clips on V1 in order, no gaps (each starts on its own VO).
2. Transitions between beats — your call (the old look was a ~1.4s black push).
3. **Subtitles + kinetic "deep text"** — from `NIF003-text-timing.md`. Every
   cue has an absolute in-point and a duration.
4. **Music bed** — add it here, ducked under the VO. B29's Dark-Law moment
   (~18:53) is where the bed should drop out / swell per the runbook §2.9.
5. Grade + the corner "net" vignette (the custom `NIF_look.dctl` from NIF002).
6. Master: `hevc-master.mjs`-style — QuickTime / HEVC Main10 / ~30 Mbps.
