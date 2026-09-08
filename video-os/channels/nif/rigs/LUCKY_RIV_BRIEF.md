# Lucky — Rive rig brief

Author this in the **Rive editor** (rive.app) and export to
`channels/nif/rigs/lucky.riv`, then copy it to
`engine/remotion/public/rigs/lucky.riv` and flip `RIG_READY` in
`src/characters/rive-rig.ts`.

## Runtime constraint — LINEAR ANIMATIONS, NOT A STATE MACHINE

`@remotion/rive` (4.0.519) can only play a **named linear animation**; it exposes
no state-machine input API. So the `.riv` must **export one looping animation
clip per pose**, with the idle weight-shift / breath **baked into every clip**.
Code (`src/characters/rive-rig.ts` → `luckyClip()`) picks the clip by name:

```
stand · walk · point · showPhone · typing · sit · shrug · thumbsUp
stand_worried · sit_worried · showPhone_worried · shrug_worried
```

`facing` is a CSS mirror (`scaleX(-1)`) applied by `LuckyRive.tsx` — don't build
left/right variants. `phoneScreen` recolour is **not** expressible through this
runtime; bake a neutral phone screen (the SVG fallback still recolours it).
A missing clip falls back to the plain pose clip, and a missing/broken `.riv`
falls back to the whole SVG rig via an error boundary — nothing hard-fails.

The state-machine `Main` / inputs table below is the **design intent**; collapse
it to baked clips on export.

Reference: **the Infographics Show** — chunky, geometric, flat-fill, thin dark
outline, lots of gesturing, holds props in-hand and leans toward them. NOT the
spindly stick figure the SVG rig currently produces.

## Artboard

- **Name:** `Lucky`
- **Size:** 550 × 1000 (0.55 aspect — a standing figure). The engine scales it.
- Origin at the **feet centre** (so `baseline` placement works like the SVG rig).

## Proportions (fix these — the SVG rig gets them wrong)

- ~5 heads tall (not 6+). Head is generous.
- **Legs ≈ 45% of height**, torso ≈ 32%. Currently legs are ~52% and read spindly.
- Limbs are **tapered filled shapes** with rounded ends and a thin `#111` outline
  — not thin strokes.
- Torso: a soft rounded rectangle / barrel, NOT a sharp A-line triangle. It must
  read as a person in a **short-sleeve tee**, not a tunic or dress.
- Palette: tee `#E3B183` (tan) · trousers `#111` · skin `#EFC69C` · hair `#171313`
  (dark bob + short low ponytail) · sneakers `#FBF8F0`. Outline `#111` everywhere.

## State machine: `Main`

Inputs (all driven from code):

| Input | Type | Values / range | Notes |
| --- | --- | --- | --- |
| `pose` | number (enum) | 0 stand · 1 walk · 2 point · 3 showPhone · 4 typing · 5 sit · 6 shrug · 7 thumbsUp | blend between adjacent where it makes sense |
| `expression` | number (enum) | 0 neutral · 1 curious · 2 worried · 3 flat · 4 happy · 5 surprised | drives brows + mouth only |
| `facing` | number | −1 or 1 | mirrors the rig horizontally |
| `talk` | number | 0..1 | mouth open amount — for lip-flap when she's the one "speaking" (rare; she never addresses camera) |
| `idlePhase` | number | 0..1 loop | a slow weight-shift / breath. Code feeds a sawtooth. |
| `phoneScreen` | color | — | fill of the phone screen she holds in `showPhone`/`typing` |
| `gesturePhase` | number | 0..1 loop | for `typing` finger taps and `point`/`gesturing` arm bob |

### Poses in detail

- **stand** — weight on one leg, other knee soft. `idlePhase` shifts weight side
  to side + a shallow breath. Arms relaxed at sides with a slight bend.
- **walk** — 1s cycle, arms counter-swing, small vertical bob, forward lean ~3°.
- **point** — near arm extended toward a target at ~15° below horizontal, index
  finger out. Torso rotates ~8° toward the point. `gesturePhase` adds a small
  emphasis bob.
- **showPhone** — **both hands hold a phone** at chest height, angled ~15° toward
  camera. Torso leans **forward ~8°**, head tilts down to look at it. The phone is
  part of the rig; its screen fill = `phoneScreen`. A thumb does a slow scroll on
  `gesturePhase`.
- **typing** — hands lower, over a flat device held in the near hand; fingers of
  the far hand tap on `gesturePhase` (fast). Slight forward lean.
- **sit** — on an implied surface at ~0.3 height. **Knees bend properly** (thighs
  roughly horizontal, shins vertical), torso upright with a slight forward lean,
  hands rest on the thighs or hold the phone. This is the one the SVG rig breaks.
- **shrug** — shoulders up, elbows bent, palms up, brief hold.
- **thumbsUp** — near arm folds up, thumb extended, held.

## Expressions

Dot eyes. Brows + mouth change:
- neutral: flat brows, gentle line mouth
- curious: one brow up, small open mouth
- worried: brows angled in-and-up, slight frown
- flat: flat brows, straight line mouth
- happy: relaxed brows, smile
- surprised: brows up, small O mouth

## Export

- **Runtime:** `.riv`, state machine `Main` exposed.
- Test that all 8 poses and 6 expressions read clearly at ~600px tall on the
  `#F6F2E7` field before exporting.

## Until this exists

`src/characters/Lucky.tsx` (SVG) is the fallback and every NIF002 beat that uses
her (B02, B10, B18, B24, B26) works with it. When `lucky.riv` lands, swap
`<Lucky>` internals to `<LuckyRive>` — same props surface (`pose`, `expression`,
`facing`, `height`, `centerX`, `baseline`, `phoneScreen`, `cycleSeconds`).
