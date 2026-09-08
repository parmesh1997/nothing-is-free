# NIF002 · finish + master guide (2026-09-04)

Timeline / delivery lock: **1920×1080 · 30 fps · Rec.709 · QuickTime ·
H.265 (HEVC) Main10 · ~30 Mbps VBR · faststart · 1080p only.**

Resolve Studio 21.0.4.5 is on this machine and driveable via the MCP, but its
scripting API is narrow on this build (§"What the MCP can't do"). So the master
is built **outside Resolve with FFmpeg**, and Resolve is used only for the two
things it genuinely adds that are scriptable: **Super Scale** (AI upscale) and a
**custom DCTL grade**. Everything the user asked for that Resolve *can't* be
scripted to do (dynamic AI mix, keyframes, ResolveFX nodes, transitions) is
either done in code or isn't needed for a single-clip episode.

---

## The one-command path

```bash
cd video-os/engine/remotion
node scripts/finish-v4.mjs            # mix + master, assumes NIF002_full.mov exists
node scripts/finish-v4.mjs --nvenc    # same, GPU HEVC encode (4070 Ti, ~13 min vs ~6 h)
```

`finish-v4.mjs` runs: render `NIF002-SFX` → `NIF002-sfx.wav` · extract VO stem ·
`mix-v4.mjs` (dynamic music envelope → `NIF002-mix.wav`) · `hevc-master.mjs`
(`--audio NIF002-mix.wav`) → `09_master/NIF002_master.mov`.

| # | step | script | output |
|---|---|---|---|
| 1 | picture + VO, whole episode, one clip | `remotion render NIF002-V4` (prores hq) | `out/master/NIF002_full.mov` (~27 GB) |
| 2 | SFX-only stem | `remotion render NIF002-SFX` | `out/master/NIF002-sfx.wav` |
| 3 | **dynamic mix** → −14 LUFS / −1.5 dBTP | `node scripts/mix-v4.mjs --wav` | `out/master/NIF002-mix.wav` |
| 4 | **HEVC master** — QuickTime · HEVC Main10 · ~30 Mbps · faststart | `node scripts/hevc-master.mjs --nvenc` | `09_master/NIF002_master.mov` |

`hevc-master.mjs` input auto-select: `NIF002_graded.mov` (Resolve pass) →
`NIF002_full.mov` + `--audio NIF002-mix.wav` → `NIF002_mixed.mov` → raw. First found wins.

### Encode settings (locked, in `hevc-master.mjs`)

`hevc_nvenc` · `-profile:v main10` · `-rc vbr -b:v 30M -maxrate 38M -bufsize 60M`
· `-multipass fullres` · `-spatial_aq 1` · `-preset p7 -tune hq` ·
`format=yuv420p10le` (Main10 needs 4:2:0 10-bit; ProRes HQ is 4:2:2) ·
`-tag:v hvc1 -movflags +faststart` · audio `aac 320k 48k`.
libx265 2-pass `preset slower` path is also in the script (`node scripts/hevc-master.mjs`
with no `--nvenc`) — visually identical here, ~6 h, not worth it.

> **Bitrate note.** Flat vector animation is cheap to encode: at VBR the average
> settles ~3.5–4 Mbps even with a 30 Mbps ceiling, and it is visually lossless —
> a fixed 30 Mbps CBR would be ~8× the file for an identical picture. The 30 Mbps
> ceiling / 38 Mbps peak is set so motion-dense beats never starve. If a true
> fixed 25–30 Mbps file is required for a delivery spec, switch `-rc vbr` →
> `-rc cbr -b:v 28M -bufsize 28M` in `hevc-master.mjs` (one line).

### The music envelope (`mix-v4.mjs`, knobs at the top)

VO is wall-to-wall (~99% speech — a word-level ducker is moot), so the bed is
shaped by **episode position**, not by sidechain:
- `MUS_OPEN` ≈ −18 dB — B00–B02
- `MUS_MID` ≈ −27 dB — B03–B23, a whisper under the dense explainer
- `MUS_END` ≈ −18 dB — B24 → out
- bed **near-gone** under the B25 black · **+6.5 dB swell** on "YOU ARE THE
  INVENTORY" · **+3.5 dB lift** into SUBSCRIBE · 2.2 s outro fade
- **2-pass *linear* loudnorm** (measure raw → one flat gain) so the envelope
  survives normalisation. Single-pass loudnorm compresses it flat — don't.

Nudge a knob, re-run `mix-v4.mjs --wav` then `hevc-master.mjs --nvenc`.
This is the editorial stand-in for Resolve's AI Audio Assistant (no scripting hook).

---

## The grade — belongs in Remotion, not Resolve

**Project rule (CLAUDE.md D5): "If the viewer sees it, Remotion made it. Nothing
visible is ever created in Resolve."** So the clean FFmpeg master IS the ship
master. A grade, if wanted, is a Remotion `<NifGrade>` overlay in `EpisodeV4`
(the field already has a `Vignette` primitive) → re-render → re-master. That
keeps it in the code-first pipeline and reproducible.

### The Resolve DCTL experiment (2026-09-04 — blocked)

`NIF_look.dctl` (warm gain/lift, mid-weighted warmth, gentle S-curve, sat 1.05,
hard-corner superellipse vignette −20%) is installed and the source is in
`08_conform/NIF_look.dctl`. Project `NIF002_master` was staged: timeline
`NIF002_graded` from the corrected ProRes, DCTL on node 1.

**Then Resolve's render engine wedged** — `set_format_and_codec`, `open_page`,
`project save`, and frame-capture all fail (object/media/grade reads still work).
Classic symptom of a modal dialog open in the Resolve GUI. Recovery = clear the
dialog (or restart Resolve, then rebuild the 3-step timeline: import → timeline →
`graph set_lut`). Not worth chasing — see the project rule above.

**Super Scale note:** on native 1080p vector line-art into a 1080p timeline it is
a **no-op** (nothing smaller-than-timeline to enlarge). Real "AI upscale
delivered 1080p" = 2160 timeline + Super Scale 2× + lanczos downscale
(supersample) — hours of Super Scale render for ~zero visible gain on crisp
vector art. Skip unless a freeze-frame A/B proves otherwise.

### GUI-only polish (not scriptable — do by hand if wanted, ~2 min each)

- **Deeper vignette / bloom** beyond the DCTL — Color ▸ serial node ▸ ResolveFX Vignette.
- **B25 crush** — Power Window on the black reversal, Lift −0.01, Sat 0.85.
- **AI Audio Assistant** instead of `mix-v4` — Fairlight ▸ put `NIF002-vo.wav`
  (A1), `NIF002-sfx.wav` (A2), `bed.mp3` (A3) ▸ AI Audio Assistant ▸ Analyze ▸
  export. Compare against `NIF002-mix.wav`; the code mix is already on-spec.
- Playback frame rate may show 24 in the GUI (API can't write it) — Project
  Settings ▸ Master ▸ Playback frame rate → 30. Cosmetic; render is 30 regardless.

---

## What the MCP CAN'T do on Studio 21.0.4.5 (measured this session)

| Want | Reality |
|---|---|
| Render bitrate / Main10 / 2-pass | `SetRenderSettings` rejects `VideoQuality`, `EncodingProfile`, `MultiPassEncode`; no `GetRenderSettings`; settings inherit the Deliver page silently. → **FFmpeg does the HEVC.** |
| Add a ResolveFX / OFX node (Vignette, Glow, Grain) | no node-add API at all. → **DCTL does the same job, renders, and IS scriptable.** |
| New grade nodes, lift/gamma/gain wheels, curves, qualifiers, power windows, tracker | not exposed. → CDL + DCTL + whole-DRX only. |
| Fairlight clip/track volume, pan, EQ, ducking, automation, FairlightFX | none — audio surface is read-only. → `mix-v4.mjs`, or a saved Fairlight preset. |
| AI Audio Assistant / music leveler / auto-duck | no scripting hook — UI button only. |
| Keyframe any property from a script | `SetKeyframe*` is write-only, no readback — effectively UI. |
| Add / clone a transition | no create API. (A transition *is* a readable, deletable timeline item; and a cross-dissolve can be authored offline into a `.drp` and imported.) → **not needed — one clip, beat dissolves baked in the render.** |
| Fusion comp added via API | renders as a **no-op** unless MediaOut is explicitly wired from MediaIn — fragile. → avoid. |
| Titles / generators on a chosen track | insert methods ignore trackIndex (land on V1). → nested-timeline workaround. |
| `timelineFrameRate` on an existing project | only writes on a **fresh** project (before any timeline). `NIF002_master` was created fresh at 30 — OK. |

### What the MCP CAN do (scripted, render-verified)

Project/timeline/media/settings · build a frame-exact one-clip timeline ·
**Super Scale** clip property · **CDL** (slope/offset/power/sat, write-only) ·
**install + apply a custom `.dctl`** (renders reliably — the real FX route) ·
apply a whole `.drx` grade / `.fuse` plugin / Fairlight preset ·
`timeline_ai create_subtitles` (auto-caption) · `detect_scene_cuts` ·
set render format+codec+resolution+fps+faststart · queue + start render ·
`ExportCurrentFrameAsStill` (grab verification frames).

---

## QC (done 2026-09-04 on `NIF002_master.mov`)

- **Loudness −14.0 LUFS, true peak −1.5 dBTP, LRA 5.1** — on spec. The dynamic
  envelope survived (2-pass linear); the B25 reversal reads quieter than the
  dense middle, as intended.
- HEVC **Main 10**, yuv420p10le, 1920×1080, 30 fps, `hvc1`, faststart, 1019.1 s
  (30573 f) — matches.
- Frame-checked B00 title / B02 / B03 `$390B` / B17 rail+eye / B22 ATT prompt /
  B24 / B25 statement cards / B27 teaser — picture clean, 10-bit smooth on the
  cream gradients, blacks clean, grain intact, figures on-model.
- **Fixed:** B27 closing sub-line "and the next one finds you." was clipping the
  bottom edge (the `push` scale dropped the bottom text lane off-frame).
  `KineticText.tsx` PunchBlock now anchors sub/kicker at title-safe. Re-rendered.

## Before upload

- Scrub every cut — no black flash, no caption clip. B25 title types fully.
- Captions: WhisperX on the **plain script** (or Resolve ▸ transcribe) — never
  from the render. Attach the `.srt` on upload.
- YouTube: **"Altered or synthetic content" = YES** (cloned voice). Description
  carries the `— ON AI —` block (`channels/nif/ON_AI.md`).
