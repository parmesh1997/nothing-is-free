---
name: nif-house-style
description: This skill should be used when building, editing, or reviewing any Nothing Is Free (NIF) episode visual in the video-os Remotion engine — beats, the shared v4 kit, characters, locations/set-dressing, kinetic text, data panels, the field. It carries the LOCKED look: palette, the two fonts, the motion language, the medium-scale OverSimplified characters, sparse-prop staging on cream, the one-at-a-time caption lane, the anti-fatigue rules, and the 100%-code pipeline. Invoke it before writing a beat or changing the kit so the channel stays consistent and never drifts to a generic AI look.
version: 1.4.0
---

# Nothing Is Free — house style

A hidden-economics explainer channel. The look is **warm, editorial, hand-made** — a
cream paper field with flat OverSimplified figures acting out the script while the
narrator tells it. Never a stock-explainer template, never "AI slop." Consistency is
the point: same easing, same two fonts, same staging language every beat.

Engine: `video-os/engine/remotion/`. Kit: `src/nif002/v4/`. Tokens: `src/tokens.ts`.

## The one rule

**The narrator is the storyteller; the characters are in the story.** The VO narrates.
Characters act it out — they walk, tap, sit, look — and they **never look at or address
the camera** (heads are drawn 3/4 toward where they're going). No speech bubbles for
narration.

## Palette (`tokens.ts`)

- **Base field:** `COLOR.paper` `#F6F2E7` cream — ~70–80% of every frame, never cuts, never changes (except the one Dark-Law reversal, B25).
- **The accent:** `COLOR.orange` `#E24D28` — one bright element per frame. Lucky's tee, the peak number, the progress rule.
- **Saturated support** (`SUPPORT`): `teal #2F6E6A`, `forest #4C7A3E`, `mustard #D2992F`, `clay #B65C3A`, `plum #7A4660`, `sky #6FA6C4`. Props, furniture, buildings, bystander tees, fills pull from these so a frame has real colour. Rotate `PROP_COLORS`.
- **Ink:** `COLOR.ink` `#111` — every outline, type, dark props.
- **Depth = light + shadow, never 3D.** Top-left key light (`KeyHaze`), warm grounded shadows under everything (`softShadow(k, opacity)` / `groundShadow`). No perspective tunnels, no vanishing-point rooms.
- Do **not** ship a pale, flat, colourless frame. If it looks washed out, the support colours and the shadows aren't doing their job.

## Typography — exactly two families

- **Hanken Grotesk** (`SANS`, weights 400–800) — all narration, labels. **Sentence
  case**, not all-caps shouting.
- **Bebas Neue** (`PUNCH`) in **`COLOR.orange`** — the emphasis hits only, one at a
  time, delivered through `<Lane>` (see The text lane). `<PunchBlock>` now caps its
  own size to the lane height (a kicker and/or sub each buy a smaller punch) so it
  can never ride up into the scene — do NOT pass `size` values > ~140. The
  Playfair-italic + copper-metal treatment is **retired** — emphasis text is orange.
- **IBM Plex Mono** — the (brief) source tag + in-world typed text only.
- Never add a third display face.

## Motion language (`src/nif002/v4/language.ts`)

- `OUT = bezier(0.22,1,0.36,1)`, `IN = bezier(0.4,0,1,1)`, `MOVE = bezier(0.65,0,0.35,1)`. Nothing linear except grid drift.
- `DUR = {micro:6, enter:12, big:24, hero:20, countUp:30}`, `STAGGER = 2`.
- **`MAX_SCALE_POP = 1.02`** — no toy-bounce overshoot, ever, on financial content.
- Entrances: settle-in (words) / typewriter (typed things) / `rise` (slide up) / `slideIn` (from an edge). **Never a plain fade.** Clear to a settled state by the cut.
- **Every beat is a layered BUILD** (creator 2026-09-03): the ground/dressing settles first (~0.6s), then the figure enters, then props, then data — each with a real entrance, each *doing* something while present (`breathe` idle scale, `driftIdle` card wander, `tick`/`spin` for a visible mechanism, `<Stopwatch>` sweeps, counts tick). Not "a bar and a number for 8 seconds."
- Camera: locked by default. One slow `push` per beat max. **Reaction zoom** on the emotional peak: `V4Beat zooms={[{at,hold,x,y,scale}]}` pushes the whole scene toward a point (a face / a body 3/4), holds, comes back — "we go into it and we come back." Also drives the phone tap. Keep face zoom ≤ ~1.7, most beats ~1.3.

## Expressions (`Figure.tsx` `expr` + `EXPR`)

Mr-Bean-minimal: `expr={{ eyes: open|wide|squint, brow: none|raise|furrow, mouth: none|flat|open|frown|smile }}` or a preset `EXPR.think / surprise / worry / wry / neutral`. Lucky gets one on a reaction beat — paired with a `zooms` push toward her. `LuckyAt` takes `expr` + `exprAt` (only from that frame on). Not every beat; the ones with a felt moment.

## Characters (`src/nif002/v4/Figure.tsx`)

- **ONE medium scale band — `FIG`** (creator 2026-09-04: "the character is so
  big … everything needs to be medium, not too high, not too long"). Never
  hard-code an `h`. `FIG.hero ≈ 0.30H` (Lucky / the person the beat is about),
  `FIG.adult ≈ 0.28H` (any other standing adult — a dev is the SAME size as the
  user watching), `FIG.seated ≈ 0.26H`, `FIG.far ≈ 0.235H` (a set-back
  bystander — smaller for depth, never tiny). The old "make everything tiny
  (0.20H)" rule is dead — it read as broken and mismatched.
- OverSimplified build: **chunky/geometric**, Infographics-Show read (creator
  2026-09-04: "the character is consistent"). THICK ink limbs (`legT h*0.076`,
  `armT h*0.05` — roughly matched), SHORT legs (`hipY 0.37`), a wide rounded tee
  torso (`X(±0.17)`), a FULL 3/4 oval head (`hr h*0.132`), minimal face. Not a
  lollipop on stilts — that was the bug through 2026-09-04; if a figure reads
  spindly, thicken the limbs and shorten the legs before anything else. Idle
  motion is tiny — the head must not bob.
- Poses map to the script verb: `stand walk sit tap read look point reach carry`.
  `tap`/`read` = head down, both hands on the phone. `sit` = phone in the lap.
  `gazeUp` lifts the head without standing.
- **Lucky** = `COLOR.orange` tee + `hair="ponytail"`. Generic figures = a `SUPPORT`
  tee, no hair.
- **Every figure does something.** `<Walker>` walks; `LuckyAt` takes
  `pose/pose2/poseAt/gazeUpAt/stepTo` so she changes what she's doing mid-beat;
  `<DeskWorker>` (`beats.tsx`) cycles point→reach→carry every ~2.3s so an office
  never looks like two frozen mannequins. A figure just standing idle is a bug.

## Staging — props define the location (no built scenes)

Creator 2026-09-03: "we don't need the exact location. Trees = it's the road.
Bedroom [furniture] + a window = the bedroom. A TV = a hall. Wine glasses = a
party. The props make sure this is that location."

- A location is 2–4 defining props on the cream + the `Interior`/`Street` sparse
  set-dressing (`locations.tsx`) — grounded with warm shadows, filled from
  `SUPPORT`. `Street` = two building-edge slabs + lamp + bin + a car passing low
  on the road (behind the figures). `Interior decor="living|bedroom|dining|office"`
  = a warm window + ONE furniture piece + a floor wash. All take `reveal` (they
  build in over the first ~0.6s).
- **Put the figures WHERE the furniture is** — office desk sits ~x=0.34, so devs
  stand there; living sofa ~x=0.26, so `sit` Lucky there; bed spans 0.2–0.48.
  A figure across the room from its own workspace reads as broken.
- **NIF002 locations:** B00/B10 street, B02/B24 office (studio), B16/B18 living
  (couch), B26 bedroom. Every other beat `bareRoom` + `dots` (the dotted
  systems-map grid) for the data/flowchart beats.
- No generated stills — NIF002 is 100% code (creator: "I don't need the image
  option"). The heavy corner "net" vignette is a DaVinci Resolve finish step.

## Flowchart / systems-map vocabulary (`nodegraph.tsx`)

The data beats use it (creator: "merge this style"): `<NodeCard variant=white|black
eyebrow title tag body from>`, `<Connector a b label token bow>` (orange curved
draw-on + a numbered travelling token), `<StageBadge>`, `<DecisionDiamond>`,
`<DotField>` (via `V4Beat dots`). Cards get `driftIdle`. Plus the older
`Fan / Ledger / Chain / Bar / HeroNumber / Chips / PinPath` from `panels.tsx`
(`Chips` is now a clean scatter, not a scribble ball).

## Functionality — act like a storyteller (`PhoneTap.tsx`)

Creator: "if you are going with the phone, straight going to that, tap on it and
come back — one second. We are going into that and we are coming back." When a
beat says Lucky taps / opens an app / hits Allow, **show it**: `<PhoneTap at tapAt
screen x y>` floats a readable phone beside her, pushes in, a thumb presses the
button, the button reacts, the screen turns over to what happens (an ad loads),
then pulls back. A tap is never just a tiny phone in a stick hand. Same for card
UIs, dialogs, toggles, notifications — all coded.

## The text lane — `<Lane>` (creator 2026-09-03 / -09-04)

**The bottom ~20% of the frame is reserved for text and nothing else.** Every
visual (figures, props, panels, `PhoneTap`) stays in the top 80%.

**A beat's captions + punches all go through ONE `<Lane items={[…]} />`** at the
end of the beat (`KineticText.tsx`). You give each item only its `at` (the word
frame); Lane does the rest:

- shows **exactly one item at a time** — each runs until the next item's `at`,
  so a wrong word-time shifts an item early/late but can **never stack two lines**
  (creator screenshots: two/three captions rendered on top of each other);
- clears the **last item ~1s (`tail`, default 30f) before the cut** — every beat
  ends on clean space (creator: "at the end … we have the white space also");
- crossfades ≤ ~8f at each handoff so items don't hard-pop.

```tsx
<Lane items={[
  { text: "First, the honest part …", at: vo.at("first", 4), size: 38 },
  { text: "97% of the apps …",        at: ninetySeven,        size: 34 },
  { punch: "NOT THE VILLAIN", kicker: "The developer is", at: villain, size: 112 },
  { text: "They picked the only model …", at: model, size: 36 },
]} />
```

- `text` = a caption (bottom-left); `punch` = an orange Bebas hit (+ `kicker`,
  `sub`). `color` overrides ink (B25 dark law → light). `tail` / `endAt` per-beat
  overrides; `tail={4}` for a very short beat, `endAt` when a bespoke visual takes
  the frame before the cut.
- Do **not** re-introduce scattered `<Cap>` / `<PunchBlock>` calls — that's the
  overlap bug.

## Timing (`src/nif002/timing.json` + `timing.ts`)

- Every `at` frame is a whisper word `.start`. `vo.at(word, fallback, nth)` =
  the **nth (default first)** occurrence; the fallback only fires if the word is
  absent. Repeated words → wrong occurrence: **use `vo.atLast(word, fallback)`
  for a closing-punch word** (its emphasis utterance is nearly always the last
  one; falls back if the last hit is > 400f from the fallback).
- Captions lead their first word by ~2f; Lane handles the clear.
- **Source tag flashes, then goes** — `SourceTag` ~0.3→4s then fades.

## Data vocabulary (`panels.tsx` + `nodegraph.tsx`)

`HeroNumber Bar Ledger Chain Chips PinPath` + `NodeCard Connector StageBadge
DecisionDiamond DotField`. Build in stages synced to VO words, not one 50f fill.

- **No giant dead grids.** A grid/scatter that mostly never changes is "animation
  doing nothing" (creator 2026-09-04). Keep counts low (≈24, not 96) and make
  **each cell do a job** — land with a glyph, flip state, get a padlock, peel out.
  A 100-dot "% square" fills as the number counts; dark = the whole, orange = the
  slice. Lit cells are `COLOR.ink` (readable on cream), never `cardWhite`.

## Density — fill the frame (creator 2026-09-04, the recurring note)

The failure mode across every early data beat: **small elements in the top
third, an empty band from y ≈ 0.4 to the text lane, and "hero replaces
context" — the payoff appears and the build-up is deleted, leaving cream.**

- **Vertical centre.** Content blocks sit at `top ≈ HEIGHT * 0.24–0.36`, not
  `0.1–0.16`. Aim the visual mass at the middle of the usable band (0.06–0.76).
- **Size for the frame, not for a phone.** A hero number is 180–220px. A
  NodeCard title is `w * 0.09`. Cards are ≥ 340px wide, ≥ 190px tall. A key
  glyph ("?", "× 12", a big ¢ figure) is 120–220px. If it looks like a UI
  mock-up at 1:1, it's too small.
- **PARK, don't delete.** When the payoff lands, the build-up **shrinks and
  moves to an edge** (see B08's price cards → up top at 0.4× ) — it stays as
  reference. Deleting it is the "hero replaces context" bug.
- **Every long hold gets a mechanic** — a `HoldScan` sweep, a `LivePip`, a
  staggered line-by-line reveal, a value re-tallying, a dot retracing a path.
- **`FIG` figures anchor the bottom third** on scene beats; the data sits above
  them, sized so the two zones both feel full.

## Anti-fatigue — the cadence rule (creator 2026-09-04: "not 5 seconds apart")

**A real motion event every ≤ 3 s, hard cap ~5 s** — every beat, including rest
beats. A *motion event* = an element enters / moves / changes state / resolves /
sweeps, OR a `<Spark>` fires, OR a mechanism visibly steps. Micro-idle
(`breathe`, 3 px `driftIdle`) does **not** count.

- Run `node -e` gap-scan over the beats before a render: list every `vo.at`/gate
  frame per beat, flag any window > ~95f with nothing. Inject into every flagged
  hold.
- **`spark.tsx`** — the injection kit: `<Spark at x y>` (one-shot orange glow
  where a thing lands), `<HoldScan x y w h from to>` (a light bar sweeps a held
  card every few seconds — "being read"), `<LivePip x y at>` (a pulsing dot +
  label for a held mechanism). Use liberally (creator: "add a light on and a
  glow on it when you're doing something").
- A held card that must sit for > 5 s: split its content into a staggered reveal
  (line by line, each with a check/spark), + a `HoldScan`, + a `LivePip`.
- Held numbers / bars get their idle float (built into `Panel` / `HeroNumber`).
- Silent VO gaps: keep the previous shot drifting, never a frozen frame.
- **If the element IS a process, the process must keep running** (creator
  2026-09-04, the B14–B27 pass). A `HoldScan` is for a *static* card the VO talks
  over. But money moving through a chain, files being re-read, ads re-serving, a
  route being retraced, spend pouring behind a wall — those must *loop visibly*
  the whole hold: a stream of units on a path, a live counter climbing
  (`$${n.toLocaleString()}`), a re-sweep wave, a pin retracing a bezier. Pattern:
  `const p = (((frame - start) / period - k / N) % 1 + 1) % 1` for N phase-offset
  particles. Every data beat B14–B27 now carries one; copy the nearest.
- **Motion cadence: ≤3s between events, the whole beat** (tightened 2026-09-05
  from ≤3.5s). Micro-motion (grid drift, idle float) doesn't count as an event.
- **Beat-to-beat cut = a black push, ~1.4s total** (`V4Beat.tsx`,
  `TRANSITION_HOLD`/`TRANSITION_RAMP`), not the old ~8-frame dissolve-through-
  cream. Every beat already inherits this from the shared wrapper — nothing
  to add per-beat, just don't fight it with your own edge-fade.

## Audio (see `episodes/<ep>/08_conform/audio-plan.md`)

Sourcing reconciled with the M&M research doc (2026-09-04):
- **Music → Pixabay Music** (commercial, no attribution). One low ambient bed,
  ducked −6 dB under VO, swells at the reversal + CTA.
- **SFX → Freesound CC0 + Kenney CC0** — ~15 one-shots (tap/whoosh/thunk/plip/
  coin/stamp/drone/chime/boom) reused ~90×. Quiet — this is documentary.
- **Loudness → FFmpeg `loudnorm=I=-14:TP=-1.5:LRA=11`** (YouTube target).
- **Subtitles → PLAIN script + WhisperX forced alignment**, never transcribe the
  render. The on-screen kinetic captions are condensed for readability; the SRT
  is verbatim PLAIN.
- The creator pulls the actual files (YouTube login + downloads); Claude prepares
  the cue sheet + wiring.

## Beat-to-beat & the render

- **Every beat ends clean.** Lane clears text ~1s before the cut; beat visuals
  settle or exit in the last ~20f (via their `out`). The frame the cut lands on
  is settled cream (or, B25, settled black).
- **Soft transitions without xfade.** The bundled Remotion ffmpeg is
  `--disable-filters` — no `xfade`/`blend`/`fade`. So `V4Beat` bakes an ~8f
  **edge-fade to/from the field colour** (`#F6F2E7`, or `#111` when the dark law
  is on) at each end of every beat. A plain hard concat then reads as a
  dissolve-through-cream. `scripts/concat-v4.mjs` = concat demuxer, stream copy,
  instant. `node scripts/render-v4.mjs [B##…]` renders beats → `out/review/`.
  True cross-dissolves, if wanted, are trivial in the DaVinci finish pass.
- **B25 = the reversal.** Dark from the cut (`darkLawAt = globalStartFrame − 30`),
  stays black; runs **+180f past its VO** so "NOTHING IS FREE." types out fully
  (`cps 15`) and HOLDS ~4.5s on black with a slow breath. Its extension shifts
  B26/B27 `globalStartFrame` and the episode total (`Root.tsx` + `EpisodeV4.tsx`).

## Pipeline

- **100% code.** No generated stills, no stock — informational content,
  characters, captions, data, device screens, all SVG motion stay code (creator
  2026-09-03: "I don't need the image option anymore"). Every value from
  `tokens.ts`, every beat a reusable template.
- The image-generation path (Nano Banana / `public/plates/` / `BgPlate` /
  `PropPlate` / `gen-assets.mjs`) is **dormant** — kept for a future episode that
  opts in, not used for NIF002. If revived: flat 2D editorial only, disclose per
  `channels/nif/ON_AI.md` (SynthID), never set up billing on the creator's behalf.
- The heavy corner "net" vignette + warm grade + grain is a DaVinci Resolve
  finish step, after the full cut.

## Reference

The Infographics Show (storytelling, characters acting) · insiderforce "clone in
Remotion" (bit-by-bit reveals) · Danny Why (line-art depth) · **Mr. Bean: The
Animated Series** (creator 2026-09-03 — flat simple shapes carrying big
character/story through action, minimal dialogue).

## Never

Scattered `<Cap>`/`<PunchBlock>` instead of one `<Lane>` · two text items in the
lane at once · text or a visual crossing the 80/20 line · a hard-coded figure `h`
(use `FIG`) · a dev tiny next to a full-size Lucky · a figure standing idle doing
nothing · a 50-cell grid that never changes · lit grid cells in `cardWhite` ·
`PunchBlock size` > ~140 (it rides out of the lane) · a location on > ~3 beats ·
perspective-tunnel rooms · camera roll / per-beat zooms · characters facing camera ·
a third font · Playfair / copper metal on punch words · all-caps narration · a
persistent source tag · a pale colourless frame · a static hold > 3s · a plain
fade entrance · a tap with no phone / button / reaction · a beat that doesn't end
on clean settled space.
