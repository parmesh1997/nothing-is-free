# EP02 · aligning to FULL PRODUCTION RUNBOOK v2.0

Read of v2.0 against where EP02 actually is (Steps 0–5 done, opening minute B00–B02 built through 6 iterations, 28 narration files, all occupancy passing). What carries over, what changes, what needs your call.

---

## TL;DR

- **Script + narration + reconcile stay.** v2.0 doesn't touch anything we've done through Step 5.
- **Four real changes for EP02:** (1) word-level timing from local whisper.cpp instead of my hand-estimated event frames, (2) install the Remotion packages v2.0 assumes (skia, paths, shapes, motion-blur, captions, layout-utils…), (3) build the two new primitives v2.0 adds — `Bloom` and `UIReveal` — which are *exactly* what EP02's screen/fee/auction beats want, (4) bake the grain (v2.0 flags our per-frame `feTurbulence` as "the single biggest render-cost mistake").
- **Asset policy barely moves for us.** NIF is now "code-first" (generated stills legal at background/mid plane), but EP02 is auctions, screens, diagrams and Lucky — 100% code either way. Confirm you don't want a generated backdrop anywhere.
- **One genuine conflict:** v2.0 §Step 6 says *keep elements alive across beats in one continuous world*; your WhatsApp direction said *every beat clears to empty*. These disagree. Need your call.
- **Recommend: adapt in place.** Don't migrate to the `video-os/engine/ + episodes/` tree yet — do that when Mass & Method actually starts. Add `channels/nif/identity.json` + a `project.json` manifest inside `EP02/` now.

---

## 1 · Workflow — 5 steps → 22 steps

| v2.0 step | EP02 status | Change |
| --- | --- | --- |
| 0 Research / intake | ✅ done (RTB auction, Pillar B) | none |
| 1 Script | ✅ `EP02_01_SCRIPT.md` | none |
| 2 Beats | ✅ `EP02_02_BEATS.md` | reformat to `beats.json` (schema) — mechanical |
| 3 Narration | ✅ 28 `B##.mp3` | none |
| **4 Transcription** | ❌ not done | **NEW — run local whisper.cpp, get word-level timestamps** |
| 5 Reconcile / timing lock | ✅ `reconcile.json` (durations only) | extend with whisper word timings → `timing.json` |
| 6 Visual planning | ~ `EP02_04_SCENES.md` (prose) | reformat to `visual_plan.json` + `shots.json` (schema) |
| 7 Shot planning | partial | formal `shots.json`, one per visual state |
| 8 Asset planning | `EP02_03_ASSETS.md` | `assets.json` — for EP02 this is near-empty (code-only) |
| 9–10 Image gen / validate | n/a for EP02 | skipped unless you want a backdrop |
| 11 Remotion scaffold | ✅ Phase 0 + `src/ep02/` B00–B02 | keep; add the v2.0 primitives |
| 12–17 build / preview / render | in progress (B00–B02 at iteration 6) | continue on the new primitives |
| 18 Audio mix (FFmpeg 2-pass loudnorm) | ❌ | **NEW — was going to be Resolve, now FFmpeg** |
| 19 Assemble (FFmpeg concat) → **shippable master** | ❌ | **NEW — FFmpeg is the exit, Resolve optional** |
| 20 Resolve conform | optional | skip (Resolve is on the other laptop) |
| 21 QC / 22 Package | ❌ | as specced |

**The manifest.** v2.0 makes `project.json` the single source of truth, with JSON-Schema-validated `beats.json / timing.json / shots.json / assets.json`. Our `EP02_*.md` docs become the human-readable companions to those. This is worth doing — it's what lets the build be resumable and lets the QC suite actually run.

**Whisper is the meaningful one.** Right now B00–B02's event frames (`F.phone = 128`, `F.reqRow = [222, 258, …]`) are my estimates of where the VO says each thing. v2.0 Step 4 gets the *actual* word start/end times from `@remotion/install-whisper-cpp` with `tokenLevelTimestamps: true`. Then a graphic lands on the exact frame the word is spoken. This directly serves your note "sync to the VO, especially the peak." Local, free, offline.
⚠️ Risk: whisper.cpp builds from source; on Windows it needs a C toolchain (CMake + a compiler). If that's not present it's ~20 min of setup or we fall back to my estimates + manual nudging.

---

## 2 · Skills / packages — what v2.0 assumes we have

Currently installed: `remotion`, `@remotion/cli`, `@remotion/google-fonts` only. v2.0 §5.5 leans on a dozen more. All exist at our exact version (4.0.519, checked):

| Package | Use for EP02 | Priority |
| --- | --- | --- |
| `@remotion/install-whisper-cpp` | word-level VO timing (Step 4) | **now** |
| `@remotion/captions` | `Caption[]` from whisper; `.srt` for upload; optional on-screen captions | **now** |
| `@remotion/layout-utils` + `getBoundingBox()` | **predict occupancy at build time** instead of after a render | **now** (saves hours) |
| `@remotion/skia` | GPU drawing — required for `Bloom`; also the `AuctionFan` radial field (150 tiles) | **now** |
| `@remotion/shapes` | stop hand-writing circle/pie/triangle path data | now |
| `@remotion/paths` | `evolvePath()` for draw-on lines (cleaner than our `strokeDashoffset`); `interpolatePath()` for "one thing becomes another" | now |
| `@remotion/motion-blur` | velocity blur without reimplementing it per component | now |
| `@remotion/noise` | deterministic noise; used to **bake the grain tile** | now |
| `@remotion/transitions` | `TransitionSeries` for beat-to-beat | later |
| `@remotion/media-utils` | `getAudioDurationInSeconds()` for reconcile | now (replaces the ffprobe shell) |
| `@remotion/fonts` | prevents missing-font render failures | now |
| `@remotion/rive` | *if* we rebuild Lucky as a state-machine rig ("game-like characters") | **decision** |
| `@remotion/lottie` | import real motion-design work | not needed |

**Grain bake.** `src/field/Grain.tsx` runs `feTurbulence` across the full 1920×1080 every frame. v2.0: *"Bake the grain once to a PNG tile at build time and tile it. Same look, a fraction of the cost."* One build script, one static asset, big render-time win across 28 beats.

**Remotion licence** — free tier: individuals and orgs ≤ 3 people, commercial use included. A solo channel is fine.

---

## 3 · UI / components — the two primitives v2.0 adds

v2.0 §5.6 (dated 2 Sept 2026) introduces exactly the things you called out — "the skills or the UI or the animation."

### `Bloom` — accent glow pulse
- A **time-boxed** glow-halo pulse on an accent element. Pulses and settles — never an ambient halo.
- Built in `@remotion/skia` (GPU), **not** an SVG blur filter (which re-rasterises every frame — same cost mistake as unbaked grain).
- **Accent colour only.** Reserved uses: the progress rule, a counted value landing, a connection line finishing its draw-on.
- Occupancy safeguard: **does not count toward the ink floor** — so I have to exclude bloom pixels from `occupancy_check.py`.
- EP02 wants this on: the "1¢" coin landing (B01), "$390B" / "$44.3M" count-ups, the auction winner flare, the reversal.

### `UIReveal` — the interface as the performer
```
skeleton blocks fade in → content populates (typewriter / count-up)
  → cursor enters, moves to target → interaction pulse (click/hover)
    → value lands, held
```
- v2.0: **"NIF — the natural home. A checkout, a subscription screen, a fee page constructing itself in front of the viewer."**
- **This is half of EP02.** The bid request building on the phone (B01/B04), the toll stack (B12), the permission prompt (B22), the open-vs-walled comparison (B21), the "97% free" grid — I built all of these ad-hoc in `src/ep02/`. v2.0 wants them as instances of one `UIReveal` primitive with the standard grammar, usable inside the `Flow` and `Hierarchy` archetypes.
- Refactoring the B00–B02 ad-hoc bits onto `UIReveal` also makes B04, B12, B21, B22 much faster to build.

### Archetypes still missing from Phase 0
Have: `Reveal Hierarchy Flow Stack`. v2.0 also wants `Compare Timeline MapMove Mechanism UIReveal`. EP02 needs `Compare` (B21), `UIReveal` (many), and `Timeline` (B13 the 2020→2023 studies). `MapMove` for B20, `Mechanism` is Mass & Method's — skip.

---

## 4 · Motion doctrine — one conflict

Mostly unchanged (Wide-End Law, event every ≤3.5 s, max 2 arrivals / 6 frames, stagger 4 f, nothing linear). But:

> **v2.0 §Step 6:** "Do not destroy previous elements when moving to the next beat. Keeping them present in the same spatial world is what produces documentary continuity rather than a slideshow."
>
> **Your WhatsApp direction (2 Sept):** every beat starts empty, builds bit by bit, then everything disperses left/right back to empty, so the seam between two separately-rendered beats is invisible.

These disagree. v2.0 solves the seam problem a different way — the **locked field** (grid drift, vignette, progress rule) is globally-driven and continuous, and beat-specific elements can persist into the next beat's composition at a matching position.

**Three options:**

| | Model | Pro | Con |
| --- | --- | --- | --- |
| **A** | Your model — every beat clears to empty | dead-simple seams; every beat gets a clean breath | 28 beats of "everything whooshes off" can feel repetitive; the auction ring rebuilds from scratch 5 times |
| **B** | v2.0 model — continuous spatial world | the auction ring *transforms* across B01→B07→B11→B19→B26 instead of rebuilding; feels like one film | more coordination; a beat that ends mid-scene needs the next beat to pick up exactly there |
| **C** | Hybrid (recommend) | beat-specific elements clear; throughline elements (the auction ring, Lucky, the progress state) persist and transform; still a ~0.4 s settled moment at each cut | slightly more bookkeeping per beat |

I built B00–B02 on your model (A). Switching to B or C means retiming the disperse logic in `stage.ts` — a contained change.

---

## 5 · Asset policy — small move, confirm anyway

| | v1.0 | v2.0 (NIF pack) |
| --- | --- | --- |
| Mode | code-only | **code-first** |
| Generated stills | never | legal at **background / mid** plane |
| Subject + informational layers | code | **still code** (this is the originality defence) |
| Cap | — | ≤ 40% of shots may use a generated asset |

**EP02 is auctions, phone screens, diagrams, the toll chain, Lucky.** All subject/informational → all code. I don't see a single shot that needs a generated environment. So this changes nothing for us *unless* you want, say, a generated cinema-lobby or office backdrop behind the Lucky scenes (B02, B18) for depth.

**ON AI block:** if EP02 stays 100% code, keep the strict wording ("Every visual is built in code…"). The moment one generated image goes in, switch to the v2.0 wording (which discloses AI environment imagery). Same change, same commit.

---

## 6 · Repo structure — adapt, don't migrate (yet)

v2.0 wants:
```
video-os/
  engine/remotion/         ← shared, channel-agnostic
  channels/nif/ + mass-and-method/
  library/                 ← cross-channel sfx/music/icons
  episodes/NIF002/
```
We have `nothing-is-free-remotion/` (flat, Phase 0 + `src/ep02/` working).

**Recommend:** adapt in place now, do the full split when Mass & Method's first episode starts.
- Add `nothing-is-free-remotion/channels/nif/identity.json` — the machine-readable channel pack (palette, plane rule, occupancy, motion, voice). `tokens.ts` reads from it.
- Add `EP02/project.json` + `EP02/beats.json` + `EP02/timing.json` + `EP02/shots.json` (the v2.0 manifests) alongside the existing `.md` docs.
- Keep `src/` as the de-facto engine. New primitives (`Bloom`, `UIReveal`, `Compare`, `Timeline`) go in `src/parts/` and `src/archetypes/` as before.
- Naming: any *new* asset uses `NIF002_S###_SH###_ROLE##`. There are no assets yet, so this is cheap.

A full `video-os/` migration now risks the working Phase 0 for no benefit while there's one channel and one episode in flight.

---

## 7 · Resolve / FFmpeg / audio — already aligned

v2.0's D1/D2/D3 (Resolve optional, FFmpeg is the shippable exit, audio mixed in FFmpeg two-pass `loudnorm`, alpha produced upstream) — this is already how I've been working (FFmpeg for reconcile and the master track, no Resolve). No change. When we get to Step 18–19 it's `mix_audio.sh` + `assemble.sh` as specced.

---

## Decisions I need from you

1. **Episode identity** — keep the `EP02/` folder and add v2.0 manifests inside it (recommend), or rename to `episodes/NIF002/` and do the `video-os/` tree now?
2. **Motion model** — A (every beat clears to empty, what I built), B (v2.0 continuous world), or C (hybrid — throughline elements persist, recommend)?
3. **B00–B02** — keep them and retrofit (whisper timing + Bloom + UIReveal), or rebuild fresh through the v2.0 pipeline? (Recommend keep + retrofit.)
4. **On-screen captions** — Infographics-Show-style word-by-word burned in, or `.srt` upload only (v1.0 default)?
5. **Lucky** — refine the current SVG rig (fix the spindly proportions), or rebuild her as a `@remotion/rive` state-machine rig ("game-like characters" per v2.0)?
6. **Generated backdrops** — any, or 100% code for EP02?

On your answers I'll: install the packages, run whisper, bake the grain, build `Bloom` + `UIReveal` + `Compare` + `Timeline`, write `identity.json` + `project.json`, retime B00–B02, then keep building.
