# video-os / engine / remotion — the shared visual engine

The channel-agnostic Remotion engine for **FULL PRODUCTION RUNBOOK v2.0** (supersedes
Master Runbook v1.0). Serves two channels: **NIF** (Nothing Is Free) and **MM**
(Mass & Method, not started). Every visible pixel of every episode is composed here.

> The runbook is the source of truth. This file summarises the parts that touch
> code. A change to pipeline order, the Remotion/Resolve division, asset policy,
> the plane rule, manifest schema, character rules or runtime rules is **Type C —
> stop and ask** (v2.0 §17).

## Where things live (v2.0 §2)

```
video-os/
  engine/remotion/          ← YOU ARE HERE. shared primitives + per-episode beats.
    src/
      tokens.ts             palette/timing/occupancy/Z/BeatProps  (see channel packs)
      Root.tsx              composition registry: dev/ + NIF###/MM### folders + bake-*
      BeatFrame.tsx         §11.3 wrapper: LockedField at global phase + VO audio
      field/               Paper Grid GroundRule Vignette Grain(BAKED) ProgressRule SourceTag LockedField
      parts/               motion.ts · SpringIn ExitOut StaggerGroup CountUp DrawLine
                           DrawArrow Breathe MotionBlur WipeOn ScaleUp · Bloom (v2.0 §5.6)
      spatial/             SpatialScene Layer Group Connection Camera DebugOverlay
      media/               (v2.0 §5.3) ImagePlane PlateStack KenBurns CutoutFigure CutoutProp — TODO
      print/               FlatFigure PaperEdge FigureBlock DataCard Callout Tag Icon
                           diagrams props locations shapes textures ...
      characters/          Lucky (SVG rig — being replaced by a Rive rig, §Lucky below)
      archetypes/          Reveal Hierarchy Flow Stack · UIReveal (v2.0 §5.6, NIF's workhorse)
                           TODO: Compare Timeline MapMove Mechanism
      channel/             TypedLine Signature SignatureReturn DarkLaw
      nif002/              THIS EPISODE. shapes.tsx AuctionFan.tsx stage.ts beats/B00–B27
      dev/                 verification comps only — never episode output
    scripts/
      _remotion.mjs        resolves the bundled Remotion CLI (ffmpeg/ffprobe live here)
      render-all.mjs       render every NIF###/MM### beat → ProRes 4444 + validate + occupancy
      occupancy-check.mjs + occupancy_check.py   the occupancy law
      transcribe.mjs       v2.0 Step 4 — local whisper.cpp, word-level VO timing
      reconcile-ep02.mjs   (done; superseded by transcript.json)
  engine/scripts/          pipeline-level scripts that operate on episodes/ (TODO: mix_audio, assemble, qc)
  engine/schemas/          JSON Schema for the manifests (TODO)
  channels/nif/            identity.json (machine) · ON_AI.md · IDENTITY.md (TODO) · rigs/lucky.riv (AWAITING)
  channels/mass-and-method/ identity.json (stub)
  library/                 cross-channel sfx/music/icons/textures (empty)
  episodes/NIF002/         project.json + 01_script … 09_master  (the current episode)
```

## Non-negotiables

- **1920×1080 @ 30fps.** Every `<Composition>`.
- **If the viewer sees it, Remotion made it.** Nothing visible is ever created in
  Resolve (v2.0 D5). Resolve is optional; FFmpeg produces the shippable master.
- **Asset policy is per-channel via the Plane Rule** (v2.0 §5.2). NIF is
  `code-first`: generated stills legal at BG/MID plane, **subject + informational
  layers stay code**. NIF002 is 100% code. Read `channels/<ch>/identity.json`.
- **Never hard-code a colour, size or duration** — everything from `tokens.ts`
  (which mirrors the active channel pack).
- **Nothing built against estimated audio durations.** Beat `durationInFrames`
  comes from `episodes/<ep>/03_transcript/reconcile.json`; word timings from
  `transcript.json` (whisper).
- **Grain is BAKED** (`public/grain-tile.png`), never per-frame `feTurbulence`
  (v2.0 §5.5). Re-bake: `npx remotion still bake-grain-tile public/grain-tile.png`.

## The per-beat props contract (§11.3)

Every beat renders inside `<BeatFrame props={props} source="…">`. Grid drift,
vignette phase and the progress rule are functions of `globalStartFrame + frame`,
never local frame. Register in `Root.tsx` under a `NIF###` / `MM###` folder with
inlined `durationInFrames` + `globalStartFrame` (Studio-editable). Composition
ids: `NIF002-B07` (hyphen — Remotion rejects `_`).

## Motion — v2.0 §5.4 + creator direction 2026-09-02, tightened 2026-09-05

- `spring()` / `interpolate()` with easing. Nothing linear except grid drift.
- **Motion event every ≤3s**, the whole beat (tightened from ≤3.5s, 2026-09-05
  — "every two or three seconds, a little bit of animation, so the user
  understands something is happening"). Micro-motion doesn't count.
- **If the element IS a process, the process must keep running.** A counter,
  a scanning beam, a traveling packet, a loading state — anything that
  represents something ongoing loops for as long as it's on screen, it never
  plays once and freezes. (nif-house-style skill v1.3.1; this is why the
  13-beat dead-stretch pass on B14–B27 gave every hero element a continuing
  mechanic instead of a one-shot landing.)
- **Beat-to-beat transition: a black push, ~1.4s total** (`V4Beat.tsx`,
  `TRANSITION_HOLD`/`TRANSITION_RAMP`) — replaces the old ~8-frame
  dissolve-through-cream, which read as too fast. Each beat holds solid black
  for its last/first `TRANSITION_HOLD` frames with a `TRANSITION_RAMP`-frame
  fade on either side; the hard cut lands while both sides are already full
  black, so it reads as one continuous push. Tune both constants in one
  place — every v4 beat inherits it automatically.
- Max 2 arrivals per 6 frames; 4-frame stagger.
- **Compose at the wide end first** (Wide-End Law). Every camera move states its reason.
- **Beat rhythm = hybrid (option C).** Beat-specific elements build in synced to the
  VO and clear to a settled/empty state by the cut; **throughline elements
  (the auction ring, Lucky, progress state) persist and transform across beats.**
  `src/nif002/stage.ts` (`useStage`, `pulse`, `loop`) is the contract.
- **`Bloom`** — accent-colour glow pulse, time-boxed, reserved for landings /
  the progress rule / draw-on completion / the reversal. Never ambient. Never
  counts toward the occupancy floor.

## Occupancy (v2.0 §13.5) — a number

`npm run occupancy -- <CompositionId>`. Body checked strictly (ink ≥ 0.22,
bottom-third ≥ 0.35); the first `--head-grace 4s` / last `--tail-grace 2s` are the
build-in / disperse-out and are skipped. Paper constant = `#F6F2E7` (kept synced
with `COLOR.paper`). Flat cream + line-art is pale — the grey `Desk`/floor slab is
the standing bottom-third anchor.

## Tooling & licence policy (runbook §18, from Episode 3)

- **Skills are the standard playbook layer.** Run `humanizer` on every script
  pass. The installed set (`.claude/skills/`) covers motion/kinetic/chart/
  isometric/explainer work — check it before hand-rolling something a skill
  already covers.
- **Three.js joins the kit for true 3D**, via `@remotion/three` — for a shot
  2D SVG can't sell (real depth, isometric/exploded views, a camera move
  through a scene), never a default. Start from the `isometric-animation`
  skill (it already scopes `Three.js OrthographicCamera` for iso work with no
  build step). Animate it with `spring()`/`interpolate()` like everything
  else in Motion above — no separate, looser standard for 3D. Install
  `@remotion/three` (+ `three`, `@react-three/fiber`) only when a real beat
  needs it, not speculatively.
- **Any new tool — image/video/audio/3D/model weights/skill/connector —
  must be free at this channel's scale (commercial use included) and carry a
  nameable licence.** "Not sure about the licence → don't use it." Video
  generation specifically defaults to Wan 2.2 (Apache 2.0) if ever needed;
  Veo/Imagen are a paid exception requiring a separate call, not a default.
  Full licence table: runbook §18.

## Maps (runbook §20, 2026-09-05)

Two different tools for two different jobs — don't reach for the wrong one:
- **A real place matters** (a route, "this happened in this city") →
  **MapLibre GL JS + Turf** (BSD-3-Clause / MIT, no API key). Tile source:
  **OpenFreeMap**, not `demotiles.maplibre.org` (that's MapLibre's own
  demo/test endpoint — don't render production output against it). See the
  `remotion-maps` skill → `maplibre` technique for the deterministic
  per-frame camera pattern.
- **A stylized "who controls what" map** (the OverSimplified territory-fill
  look) → NOT MapLibre — build it like every other diagram: one free/PD flat
  SVG base map (verify the exact file's licence before use) + code fills/
  flags/highlights, `spring()`/`interpolate()`, house palette. No new dep.

## Lucky

Being rebuilt as a **`@remotion/rive` state-machine rig** (creator, 2026-09-02).
`channels/nif/rigs/lucky.riv` must be authored in the Rive editor — brief at
`channels/nif/rigs/LUCKY_RIV_BRIEF.md`. Until it lands, `src/characters/Lucky.tsx`
(SVG rig) is the fallback — poses `showPhone`/`typing` draw the phone in-hand,
`idle` weight-shift on by default. Reference: the Infographics Show (chunky,
geometric, gestures).

## Commands

```bash
npm run dev                              # Studio
npm run typecheck                        # tsc --noEmit
npm run render:all NIF002                # all beats, validated + occupancy-gated
npm run occupancy -- NIF002-B07
node scripts/transcribe.mjs ../../episodes/NIF002   # whisper word timings
```

## Current state (2026-09-02)

Migrated from `nothing-is-free-remotion/` to `video-os/engine/remotion/`.
Packages added: paths shapes noise motion-blur transitions captions media-utils
layout-utils fonts rive install-whisper-cpp. (`@remotion/skia` removed — native
dep broken under rspack; `Bloom` uses a radial-gradient instead.)

NIF002 opening minute B00–B02 built (iteration 6), all occupancy PASS. Now being
**retrofitted to v2.0**: whisper word timing, `UIReveal` for the screen/request
bits, `Bloom` on landings, hybrid motion model. Then B03–B27.
