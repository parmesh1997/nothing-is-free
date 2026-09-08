# Nothing Is Free — Master Runbook

Version 1.0 · 31 August 2026 · Supersedes Runbook A, the 2.5D motion spec and the master orchestrator

**Channel:** Nothing Is Free — *Someone always pays.*
**Niche:** Hidden economics. How systems, platforms and products actually work, and who ends up paying.
**Build:** every visible frame composed in code. No generated images, no photographs, no stock.
**Voice:** ElevenLabs v3, the creator's own Instant Voice Clone.
**Runtime:** 12 minutes minimum, 60 minutes maximum.

## 0 · What this document is

Three documents governed this channel and they contradicted each other in three places that mattered. This runbook is the single reconciled source of truth. It absorbs:

- **Runbook A** — the code\-native Vox visual system, the occupancy law, the voice layer, the gates.
- **The selective 2.5D motion system** — spatial scenes, camera choreography, parallax, groups.
- **The master episode orchestrator** — runtime rules, cold\-open doctrine, characters, Resolve MCP, packaging.

Where a source is silent, its rules carry over unchanged. Where two sources conflicted, §0.1 records the decision and the reason. **No conflict was resolved silently.**

### 0\.1 · The three resolved conflicts

| \# | Conflict | Resolution | Why |
| --- | --- | --- | --- |
| **C1** | Runbook A builds Remotion against **real recorded audio**. The orchestrator says **audio is last** and builds against beat estimates. | **Hybrid.** Script and beats → creator records → durations reconciled → Remotion built to real `durationInFrames` → Resolve assembles and finishes. | Building frame ranges against estimates is what made Episode 1 land 7:52 against a 10–11 min plan. Audio still arrives *after* the visual design, but *before* implementation. |
| **C2** | Runbook A: Remotion renders one master with audio embedded, Resolve grades only. Orchestrator: **Resolve MCP assembles the timeline.** | **Resolve assembles.** Remotion renders one composition per beat; Resolve places, mixes, grades, exports. | Keeps the automation layer and makes late edits cheap. Consequence in §11.3 — per\-beat pieces must be told their global position or the locked background and progress rule break. |
| **C3** | Runbook A: **100% code, no generated images.** Orchestrator §21: external images for characters, props, backgrounds, textures. | **Code\-only stands.** Lucky and Maya are built as SVG halftone figures, once, as reusable rigs. | Bespoke code visuals are now the channel's load\-bearing originality defence (§14), and the ON AI disclosure stays true as written. |

### 0\.2 · Minor reconciliations

| Rule | Runbook A | Orchestrator | Standing rule |
| --- | --- | --- | --- |
| Runtime ceiling | 35 min | 60 min | **60 min.** Floor stays 12 min |
| Intake questions | Asks topic, CTA, duration | Never asks duration | **Ask topic \+ CTA only.** Runtime is derived from what the research supports |
| Motion cadence | Event every ≤3.5s, numeric class floors | "Evaluate after 2–3s" | **Runbook A's numeric floors.** Stricter, and measurable |
| Visual density | Beat\-driven | \~1 Remotion piece per minute | **One composition per beat.** Beat count emerges from the script, typically 1–2 per minute |
| Bundle filenames | `EP##_SCRIPT.md` etc. | `EP##_01_SCRIPT.md` etc. | **Orchestrator's numbering**, delivered gated per §7 |

### 0\.3 · Priority order

1. This runbook.
2. Episode\-specific instructions from the creator.
3. Anything not covered here, from the original three documents, where it does not conflict.

A change that would alter the visual identity, the pipeline order, the character rules, the asset policy or the runtime rules is **Type C** — stop and present it per §16 before implementing.

## 1 · Why the visual laws exist

Episode 1 was built and the visuals failed. Measured against the Vox reference:

| Metric | Vox reference | Episode 1 | Verdict |
| --- | --- | --- | --- |
| Ink coverage of the frame | 26\.9% | 4\.1% | 6\.5× too empty |
| Bottom 30% of frame occupied | 48\.1% | 2\.2% | The lower half is abandoned |
| Background colour | `#DADAD2` | `#DADAD2` | Already correct |
| Subject height | 45–70% of frame | \~7% | Objects were thumbnail\-sized |
| Baseline | Everything sits on a ground rule | Nothing sits on anything | Elements float |

The palette was never the problem. **Scale, anchoring and depth were.** The instruction to "use the cheapest tag that works" produced exactly that: correct, cheap, tiny icons in a large empty field.

The laws in §2 and §3 are not style preferences. They are the fix.

### 1\.1 · The honest limit of code\-only

The Vox reference uses photographic cutouts — a real person, a real tanker, a real newspaper — desaturated and halftoned with a red offset stroke. **Code cannot produce a photographic cutout.** This runbook produces the code\-native cousin: halftone\-dot and engraved\-line figures drawn as SVG paths, carrying the same offset stroke, on the same paper grid, under the same typography.

| The Vox look | This runbook |
| --- | --- |
| Photographic halftone cutout | SVG figure filled with a real halftone pattern, same tonal weight |
| Red offset print stroke | Identical — duplicated path, offset, in red, behind |
| Newspaper prop | Typeset in code. Better than generated: real headlines, real columns, no garbled lettering |
| Ocean plate with alpha | Procedural SVG wave bands with parallax |
| Data card | Identical, and code does this better than any generator |
| A recognisable real person | **Not available.** Use the object, the flag, the building, the chair |

If an episode's argument depends on showing a specific real thing photographically, **the topic fails Code Fit at intake** (§8). Reframe it or choose another. Do not discover this at build.

## 2 · The visual system

### 2\.1 · The three planes

Every frame has at least three planes. **A frame with fewer than three is a gate failure.** This is the single structural thing Episode 1 lacked.

| Plane | Contains | Never |
| --- | --- | --- |
| **Background** | Paper field, grid, ground rule, horizon, vignette | Empty. It is always drawn |
| **Midground** | The setting — buildings, water bands, terrain, crowd rows, structures. Halftone, lower contrast | Absent. Every scene has a setting |
| **Foreground** | The subject, figures, data card, type, the accent | More than one accent |

**The background is locked across the entire episode.** It never changes and never cuts. That continuity is what makes the piece read as one continuous shot rather than a slideshow, and it is why midground and foreground can change freely without the episode feeling chopped.

### 2\.2 · The occupancy law

The most important section in this runbook.

| Rule | Floor | Measured how |
| --- | --- | --- |
| **Ink coverage** | **≥22% of frame**, target 25–30% | % of pixels differing from paper by \>60 in summed RGB |
| **Bottom\-third occupancy** | **≥35%**, target 45% | Same measure, lower 30% of frame |
| **Primary subject height** | **45–70% of frame height** | Bounding box |
| **Baseline contact** | Every solid object touches the ground rule or a surface | Nothing floats |
| **Frames below floor** | **Zero.** Under 22% for \>12 consecutive frames fails | Sampled every 0.5s |

Run the check on every rendered piece before it reaches the timeline (§11.5). It is a number, not a judgement call.

**Why the bottom third matters most.** In the reference it carries the ground, the subject's mass, the progress rule and the caption. In Episode 1 it carried 2.2%. A frame empty below the midline reads as a slide; a frame with mass at the bottom reads as a scene.

**The size correction, plainly:** if you built it in Episode 1 and it looked right, it is roughly six times too small. An object occupying 90px of a 1080px frame should occupy 490–750px.

### 2\.3 · The paper field

```
Base          #DADAD2   flat, unbroken, full-bleed, every frame
Grid          #CFCFC6   1px lines, 48px spacing, 22% opacity
Grid drift    +2px x, +1px y over 20s, sinusoidal — imperceptible, kills the frozen read
Vignette      radial, #C6C6BD at 8% opacity, outer 30%
Ground rule   #B8B8AE   2px, at 78% frame height, full width
Paper grain   SVG feTurbulence, baseFrequency 0.9, 4% opacity, over everything
```

The grid and the ground rule are drawn in every single frame, including the reversal. They are the continuity.

### 2\.4 · The palette

| Role | Hex | Use |
| --- | --- | --- |
| Paper | `#DADAD2` | The locked field |
| Grid | `#CFCFC6` | Structure |
| Ground | `#B8B8AE` | The baseline everything sits on |
| Ink | `#1A1A18` | Type, line, halftone dots, the Dark Law field |
| Graphite | `#4A4A46` | Midground fills, secondary figures |
| **Orange** | **`#F26B21`** | The accent. The progress rule. One highlighted value per frame |
| Offset red | `#E03C31` | The print\-offset stroke behind figures only. Never a fill |
| Card white | `#F7F4EB` | Data cards, newspaper, document props |
| Highlight | `#F5D547` | Marker highlight on a headline. Sparingly |

**One orange element per frame.** The progress rule does not count — it is always there.

### 2\.5 · The offset stroke

The signature move of the reference, and cheap in code.

```
For every foreground figure or cutout:
  1. Duplicate its path.
  2. Offset by +14px x, +10px y  (scale with subject: ~2.5% of subject height)
  3. Fill offset red #E03C31, no stroke.
  4. Render BEHIND the original.
  5. On entry, animate the offset 0 → full over 6 frames, spring. It "prints" into place.
```

**Never on:** type, data cards, charts, the newspaper, midground elements. Foreground figures only.

### 2\.6 · Halftone fill

What makes a code figure read as a printed cutout rather than a flat icon.

```svg
<pattern id="ht" width="6" height="6" patternUnits="userSpaceOnUse">
  <circle cx="3" cy="3" r="{1.0 – 2.6 by tonal value}" fill="#1A1A18"/>
</pattern>
```

| Tone | Dot radius | Use |
| --- | --- | --- |
| Shadow | 2\.6 | Under\-planes, the mass of a figure |
| Mid | 1\.8 | Body fills |
| Light | 1\.0 | Highlights, distant midground |
| Flat | — | Type, cards, charts. Never halftoned |

**Three tonal steps per figure minimum.** A single\-tone shape is an icon, not a cutout.

### 2\.7 · Typography

| Role | Spec |
| --- | --- |
| **Hero figure** | Condensed bold sans, 180–320px, ink, tight tracking |
| Unit / label | 28px, uppercase, letterspaced 0.12em, graphite, directly under the figure |
| Caption line | 42–56px, sentence case, ink, lower third, inside the safe area |
| The typed line | Mono uppercase, 46px, letterspaced 0.06em, typed character by character with a block cursor. The reversal uses this |
| Card labels | 18–22px, mono, graphite |
| Source tag | 16px, mono, graphite at 60%, bottom\-left, persistent, every frame |

**Hero figures are never smaller than 180px.** Episode 1 rendered them at roughly 60px, which alone cost several points of ink coverage.

### 2\.8 · The progress rule

A 10px orange bar along the bottom of the frame, growing left to right across the **whole episode**, 0% at 0:00 to 100% at the end. Cheapest continuity device available, anchors the bottom of every frame, gives the viewer a reason to stay.

**Always present. Never resets. Never segmented per beat.** Because pieces render separately (§11.3), it is driven by `globalStartFrame / episodeTotalFrames`, never by local frame.

### 2\.9 · The Dark Law

Once per episode, at the reversal. The paper field crossfades to ink `#1A1A18` over 20 frames. The grid stays at 8% white. The progress rule stays orange. Music stops. The reversal line types on in mono. The signature words return here — typeset, silent.

## 3 · Selective 2.5D

### 3\.1 · The most important rule

**Do not make everything 2.5D.** It is a tool, not the visual identity. Most frames stay flat because flat is clearer.

| Use 2.5D when depth carries | Keep it flat for |
| --- | --- |
| Parent → child relationships | Captions and ordinary text |
| Cause → effect, money flows, supply chains | Simple icons that only need to fade in |
| Progression and hierarchy | Small UI elements |
| Revealing context by pulling back | Any beat where flat reads better |
| Moving between related information clusters | Decorative movement with no purpose |
| Continuity between adjacent beats | Every scene, by default |

The test: *would this beat be clearer in ordinary 2D?* If yes, it is 2D.

### 3\.2 · The Z model

The three planes of §2.1 **are** the spatial model. 2.5D adds a camera to them and two intermediate depths.

| Layer | Z | Parallax rate | Contains |
| --- | --- | --- | --- |
| Background | −3.0 | 0\.02× | Paper, grid, ground rule, vignette |
| Deep mid | −2.0 | 0\.04× | Horizon, distant structures, wave bands |
| Midground | −1.0 | 0\.06× | The setting — buildings, terrain, crowd rows |
| Subject | −0.5 | 0\.10× | Primary figure or object, plus its offset stroke |
| Foreground | 0\.0 | 0\.14× | Data card, type, accent, connection lines |

Elements stay fundamentally 2D artwork. The added dimensions are x, y, z, scale, rotation, opacity, and camera position/target. Distant elements move less; near elements move more. **The viewer should feel depth, not notice a gimmick.**

### 3\.3 · The Wide\-End Law

A camera pull\-back reduces subject height and can drop ink coverage below the §2.2 floor. The occupancy check runs on rendered frames, so it will catch this — after the work is done.

**Compose at the wide end first, then animate toward the tight end.** Every camera move must satisfy occupancy at its widest framing. If the wide end is empty, the composition is wrong, not the camera.

### 3\.4 · Camera vocabulary

| Move | Use |
| --- | --- |
| **Push** | Introducing an important object or concept |
| **Pull** | Revealing context — the related objects around the one on screen |
| **Pan** | Moving across an information space; turns several beats into one continuous world |
| **Reframe** | A new object becomes important; move the camera rather than moving the object at the viewer |
| **Reveal** | Start tight, open out to the larger system |
| **Track** | Follow an object crossing the scene |
| **Drift** | Very subtle, for visual life only |
| **Orbit** | Extremely sparingly. Small rotations only. Never a 360° spin because 3D is available |

**Every camera move answers one question:** what does the viewer need to look at now, what context is being revealed, what relationship should become visible, or where does the explanation go next. If it answers none, cut the move.

Stillness is allowed. A strong sequence is often: still → small push → hold → reveal → pull back → hold → pan → hard cut. Camera motion is slower and smoother than object entrances; large contextual reveals need room to breathe.

### 3\.5 · The scene abstraction

```ts
SpatialScene {
  background,          // always the locked field
  layers:  Layer[],    // z, parallaxRate
  objects: SpatialObject[],
  groups:  Group[],    // move, scale, enter, exit, be targeted as one unit
  connections: Connection[],
  camera:  { position, target, zoom, fov },
  transitions
}

SpatialObject {
  id, asset, position: {x, y, z}, rotation, scale, opacity, animation
}
```

Camera targeting is semantic, never hand\-calculated:

```ts
focusOn("parent")
focusOnGroup("revenueCluster")
reveal(["parent", "childA", "childB"])
moveTo("nextCluster")
pullToFit("fullHierarchy")
```

Groups are essential for explanatory chains: a group moves, scales, enters, exits and is camera\-targetable as one unit, so an entire branch of a diagram can be repositioned without touching its children.

### 3\.6 · The hierarchy reveal archetype

The house pattern for relationships — ownership, fee stacks, platform ecosystems, cause and effect.

```
1  Reveal the parent, framed tight
2  Camera pulls back slightly
3  Children enter from their own directions, staggered
4  Connection lines draw between parent and children
5  Camera reframes to hold the complete hierarchy
6  Camera travels toward the next relevant branch
```

Do not destroy the previous elements when moving to the next beat. Keeping them present in the same spatial world is what produces documentary continuity.

### 3\.7 · Connection graphics

Lines and arrows are information design, not decoration. They support draw\-on, arrowhead reveal, opacity, tracking a moving object, and camera\-aware positioning. Place them at their own depth (typically Z \= −0.1 behind the parent) so camera movement separates them naturally.

### 3\.8 · Debug mode

A development\-only overlay, off in every render, that draws camera position, object x/y/z, group bounds, object IDs, connection paths and the current focus target. Spatial compositions are impractical to tune without it.

## 4 · Motion

### 4\.1 · Two functions

Everything is `spring()` or `interpolate()` with easing. **Nothing moves linearly.**

| Movement | Function |
| --- | --- |
| Anything arriving | `spring({ damping: 12, mass: 0.8, stiffness: 100 })` |
| Anything leaving | `interpolate` \+ `Easing.in(Easing.cubic)` |
| A number counting | `interpolate` \+ `Easing.out(Easing.cubic)` |
| Camera push / pull | `interpolate` \+ `Easing.inOut(Easing.cubic)` |
| Line drawing | `strokeDashoffset` \+ `Easing.inOut(Easing.cubic)` |
| Grid drift, wave bands | Linear. **Only here** |

### 4\.2 · The 3.5\-second rule

**A motion event lands at least every 3.5 seconds, including rest beats.** An event is an element entering or leaving, a value landing, a state changing, a camera move beginning, a card flipping, a stroke completing, a bar crossing a threshold.

| Beat class | Events per 10s |
| --- | --- |
| Opening (0:00–0:20) | 7 |
| High | 5 |
| Medium | 4 |
| Rest | 3 — still one every 3.3s |

Micro\-motion does not count. Breathing scale and grid drift are the anti\-static floor, not density. A camera move counts once, at its start, not continuously.

### 4\.3 · Stagger, never stack

Never more than 2 elements arriving in the same 6 frames. A group of five enters as five events at 4\-frame offsets.

```
Structure       frame 0     spring
Figure A        frame 8     spring
Figure B        frame 14    spring
Offset strokes  frame 18    print-on
Caption         frame 26    rise + fade
```

Five events in roughly one second, at hero density, nothing colliding.

### 4\.4 · Motion blur

```ts
const blur = Math.min(Math.abs(velocityPxPerFrame) * 0.45, 24);
```

Per element, derived from velocity, falling to zero at rest. **A blurred object at rest is a bug.** Never on stationary type, small UI elements or slow movement.

### 4\.5 · Transitions

| Transition | When |
| --- | --- |
| **Hard cut** | The idea changes sharply — new concept, new time, new place |
| **Continuous camera move** | The next idea lives in the same spatial world |
| **Matched motion** | An object or movement naturally carries the viewer across |
| **Crossfade** | Only when two visual states genuinely blend. Sparingly |

Never pick a transition because it exists.

## 5 · Characters

Characters are part of the storytelling system, not mandatory decoration. They are built in code as SVG rigs (§0.1, C3) — halftone fills, three tonal steps, offset stroke, same as any foreground figure.

### 5\.1 · Lucky

Recurring and recognisable across every episode. Built once as a rig with a fixed proportion sheet, a set of poses and a small expression set, so consistency comes from the component and not from redrawing.

**Scale is a hard rule.** When Lucky appears as an ordinary human\-scale character she reads as a person, not a sticker: medium shot, medium\-wide, full\-body, or close\-up when it is emotionally useful. She is never shrunk because the scene is busy. She is a foreground subject and inherits the 45–70% subject\-height floor whenever she is the subject of the frame.

She may enter from left, right, foreground, background or an off\-screen edge, and may interact with objects. She appears when the narration benefits — never to fill a quota.

### 5\.2 · Maya

The second voice in the cold\-open contradiction pattern. **Her rig does not exist yet** — see §17. Until it is specified, cold opens use Lucky plus an object, or a single\-voice device.

### 5\.3 · The cold open

The first ten seconds are a production priority in their own right. **Never open with** generic narration, exposition, a logo, a title card, a generic chart, a definition, or "In today's video".

The shape, when the topic supports it:

```
Character enters
Character interacts with an apparently normal object
Character believes something is free / safe / cheap / harmless
The contradiction is noticed
A surprising number, cost or consequence appears
CUT
Narration begins
```

The viewer should think *wait, what does that mean* → *what is the number* → *I need to know.*

Every episode gets an original hook. Do not reuse the joke and do not reuse the dialogue structure. The hook must be topic\-specific, short, visually clear, advertiser\-safe and curiosity\-driven, and it must pose the question the episode answers.

## 6 · The voice layer

### 6\.1 · The 150 wpm failure

The old estimate of 150 words per minute was wrong by roughly 40%. Episode 1: a script estimated at 10–11 minutes produced 7:52.

```
Actual runtime        472s
Less pause time       ~24s
Speaking time         ~448s
Words in script       ~1,575
ACTUAL RATE           ~210 words per minute
```

The clone delivers at roughly **195–215 wpm**, varying beat to beat between about 130 and 200 with tagging and sentence length.

| Target runtime | At 150 wpm (wrong) | At 205 wpm (right) |
| --- | --- | --- |
| 12 min | 1,800 | **\~2,350** |
| 15 min | 2,250 | **\~2,950** |
| 25 min | 3,750 | **\~4,900** |
| 40 min | 6,000 | **\~7,900** |

**Calibration, done once, and again whenever voice, stability or model changes:**

```
1. Take 400 words of a real script, tagged as you would actually tag it.
2. Generate in ElevenLabs v3 with your clone at your normal stability setting.
3. ffprobe -v error -show_entries format=duration -of csv=p=0 sample.mp3
4. Rate = 400 ÷ (seconds ÷ 60)

CALIBRATED WPM = __________     ← unfilled. See §17
```

**Resolved 2026\-09\-05, from Episode 2's full 28\-beat production record**
(`video-os/channels/nif/identity.json`, `episodes/NIF002/01_script/script.md`):

```
CALIBRATED WPM = 134     ← this clone, this house style, stability: natural.
                            2,254 words / 1,010.7s, full 28-beat NIF002
                            record, 2026-09-01. Confirmed independently in
                            two files, not a single 400-word sample.
```

The 195–215 wpm / "~205 is right" conclusion above was itself the wrong
interim number — NIF002's own script file says so directly: *"the EST lines
... were built on the wrong interim 205 — ignore them."* **134 wpm governs
every word budget from Episode 3 onward.** Recomputed at the real rate:

| Target runtime | At 150 wpm (wrong) | At 205 wpm (also wrong) | At 134 wpm (right) |
| --- | --- | --- | --- |
| 12 min | 1,800 | ~2,350 | **~1,610** |
| 15 min | 2,250 | ~2,950 | **~2,010** |
| 20 min | 3,000 | ~4,100 | **~2,680** |
| 25 min | 3,750 | ~4,900 | **~3,350** |

**Pause budget**, added to `words ÷ calibrated_wpm × 60`\:

| Mark | Adds |
| --- | --- |
| `[PAUSE]` / `...` | 0\.6s |
| `[DROP]` at the reversal | 1\.2s |
| Beat boundary | 0\.4s |

### 6\.2 · ElevenLabs v3 tagging

v3 does not support SSML. It takes inline audio tags in square brackets that direct delivery of the text following them. Punctuation and capitalisation carry pacing and emphasis.

| Emotion tag | Where |
| --- | --- |
| `[curious]` | Opening a loop, posing the question |
| `[thoughtful]` | The counter\-argument beat |
| `[matter-of-fact]` | Every sourced figure. **The default** |
| `[serious]` | The reversal, the Dark Law |
| `[warm]` | Save\-the\-cat, first\-person disclosure, direct address |
| `[dry]` | The one place per episode humour is allowed |

| Pacing tag | Where |
| --- | --- |
| `[pause]` | A genuine stop. Sparingly — punctuation does most of this |
| `[slowly]` | Ahead of a figure that needs to land |
| `[rushed]` | A list of intermediaries, a stack of fees. Once or twice |
| `[drawn out]` | The final clause of the reversal |
| `[whispers]` | Once per episode maximum, or never |

**Banned:** `[laughs]`, `[giggles]`, `[sarcastic]`, `[shouting]`, `[excited]`, `[angry]`, and every non\-verbal reaction tag. An excited finance voice is exactly the register the persona exists to prevent.

| Rule | Why |
| --- | --- |
| One tag per sentence maximum | Stacked tags fight each other |
| Roughly one tag per 3–4 sentences | Tagged everywhere, they mean nothing |
| Tag goes immediately before the words it governs | It affects what follows |
| Match the tag to the voice's character | Forcing a playful tag on a calm clone degrades the whole take |
| Emphasis by CAPITALISING one word, not by tagging | More reliable |
| Ellipsis for hesitation, full stop for a beat | Punctuation is v3's most reliable pacing tool |
| **Never rely on a tag to carry meaning** | v3 will occasionally read a tag aloud. If the sentence only works when the tag performs, rewrite it |

**Stability:** Natural is recommended — balanced, tags still land. Creative is most tag\-responsive but drifts from the clone. Robust is most faithful, least responsive. v3 is non\-deterministic: generate two or three takes of anything that matters — the opening minute, the reversal — and keep the best.

### 6\.3 · Delivered script format

```
━━━ B07 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WORDS 118    EST 34.5s @ 205 wpm + 0.6s pause

PLAIN
  Concessions brought in two hundred ten million dollars.
  Concession supplies cost forty-four million. Roughly a fifth.

v3 TAGGED
  [matter-of-fact] Concessions brought in two hundred ten million
  dollars. Concession supplies cost forty-four million...
  [slowly] Roughly a FIFTH.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Generate from the tagged version. The plain version is the read\-aloud reference and the subtitle source.

### 6\.4 · The signature

Fixed words `"Nothing is free."` at 0:00, then the variable clause carrying the counter\-intuitive claim, landing by 0:03. Audio stamp on the accent completion. Returns once at the reversal, typeset and silent.

```
B00 v3 TAGGED
  [matter-of-fact] Nothing is free. [slowly] And the ticket was the
  cheapest thing you bought.
```

**The fixed words are never tagged with an emotion.** Flat, every episode, forever. That is what makes them a signature.

## 7 · The pipeline

Five gated steps. Each stops and waits. Nothing runs ahead.

```
STEP 0   INTAKE            → options presented, creator chooses
STEP 1   SCRIPT + BEATS    → and nothing else. Full stop.
   ↓     creator records in ElevenLabs, returns B00.mp3 … B##.mp3
STEP 2   RECONCILE         → real durations replace every estimate
STEP 3   BUILD + RENDER    → Remotion, cut to real durations, occupancy-checked
STEP 4   RESOLVE + AUDIO   → MCP assembly, mix, grade, export
STEP 5   PACKAGE + SHIP    → title, thumbnail, description, real chapters
```

**Step 1 outputs the script and the beat sheet only** — no assets, no prompts, no scenes, no briefs. Those are produced at Step 3 against real durations, because every duration in them would otherwise be wrong.

**Nothing is built against estimated durations.** This is the C1 resolution and it is the whole reason the pipeline is shaped this way.

## 8 · Step 0 · Intake

**Trigger:** `Run the master runbook. Episode N.`

The creator supplies episode number, topic direction and CTA target. Everything else is derived. **Do not ask** how long the video should be, how many beats or pieces, what visual treatment to use, what metaphors to use, or how much research is needed. Those are the runbook's responsibility.

### 8\.1 · Topic proposal

Four topics, each with a recommendation:

```
[Topic] — Pillar [A/B/C]
  The mechanism:  [one line]
  The number:     [the figure that carries it, and whether it is sourceable]
  The reversal:   [the flip, in one sentence]
  Idea gate:      novelty ✅ · timing ✅ · supply ⚠️ · demand ✅
  Code fit:       [buildable without photographic assets? if not, say so]
  Runtime:        [what the material honestly supports, and why]
  ⭐ RECOMMENDED — [why this one over the other three]
```

**Code fit is a hard test.** A topic needing a recognisable person, a real product photograph or a real place fails here (§1.1). Say so at intake.

### 8\.2 · CTA placement

| Option | Shape |
| --- | --- |
| End only | One line in the final 8 seconds |
| Mid \+ end | A soft mid\-roll ask at \~50%, plus the end line |
| End \+ comment prompt | End line plus a specific question tied to the viewer's own transaction |

### 8\.3 · Runtime

**Floor 12 minutes. Ceiling 60 minutes.** Derived, never asked. The runtime must be a consequence of the topic's actual narrative capacity — supported by credible research, mechanisms, examples, evidence, consequences, reversals, named actors, sourced figures and historical context.

Never pad to reach 12. Never truncate a strong topic at 12. **If the topic cannot honestly support 12 minutes it fails the idea gate** — propose a reframe or a different topic. Padding is a worse failure than swapping the topic.

### 8\.4 · Intake output

```
TOPIC             [chosen]
PILLAR            [A/B/C] — [reasoning]
EPISODE           ##
TARGET RUNTIME    [n] min   ← derived from research capacity
WORD BUDGET       [n] words ← from calibrated WPM, never 150
CTA               [placement]
FORMAT            F# — not the previous episode's
COLD-OPEN DEVICE  D# — not used in the last 3
CODE FIT          ✅ buildable without photographic assets
```

## 9 · Step 1 · Script and beats

Two artefacts, and nothing else.

| Artefact | Contains |
| --- | --- |
| `EP##_01_SCRIPT.md` | Plain narration and the v3\-tagged version, beat by beat |
| `EP##_02_BEATS.md` | Beat sheet with estimated durations, density class, motion intent |

### 9\.1 · Beat IDs

```
B00   the signature and the claim
B01   the promise
B02   save-the-cat
B03 … the body
B##   the reversal
B##   implication · bridge · CTA
```

Audio comes back named `B00.mp3`, `B01.mp3` and so on. **That naming is what makes reconcile automatic.**

### 9\.2 · Script rules

Sentences under 20 words. One idea each. Contractions always. No em\-dashes, no parentheticals. Numbers written as spoken words. The object written into the line. The read\-aloud test.

| Additional rule | Why |
| --- | --- |
| **Every beat names a drawable thing** | Code has to build it. "Market inefficiency" is not drawable; "four companies touching the card" is |
| **No line requires a recognisable real person** | Code cannot draw one. Name them; show the chair, the podium, the flag |
| A sourced number every 45–60s | Density floor |
| Write the pause as a sentence break | v3 reads punctuation as pacing |

The narration should feel intelligent, conversational, controlled, documentary and confident, occasionally funny, never salesy, never overdramatic.

### 9\.3 · Beat sheet format

```
B07   "The counter keeps four fifths"        EST 42s        HIGH
      Narration:      [the line]
      Words:          118
      Visual mode:    2.5D
      Motion intent:  cost stack builds bottom-up, upper portion detaches and
                      exits right with blur, remainder settles, figure counts
      Planes:         BG paper+grid · MID counter structure · FG stack, figure, card
      Camera:         pull, medium → wide, reason: reveal who else is paid
      Peak:           on "four fifths"
      Entry side:     R
      Transition:     hard cut
      Loop:           L2 closes here
```

**Every duration at this step is marked `EST` and is wrong.** It exists only so beat count and shape can be reviewed.

## 10 · Step 2 · Reconcile

The creator returns one audio file per beat, `B00.mp3` … `B##.mp3`.

```bash
for f in B*.mp3; do
  printf "%s  " "$f"
  ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"
done
```

Then: replace every `EST` with the measured duration; compute real total runtime; compute delivered WPM per beat and flag anything outside ±15% of calibration; concatenate to a master track with beat boundaries logged; report the delta.

```
TARGET        12:00
ACTUAL        11:34
DELTA         −26s

PER-BEAT WPM  B00 188 · B01 201 · B02 214 · B03 232 ⚠️ · …
              B03 is 13% fast. Likely cause: no tag, long flat sentences.

OPTIONS
  A  Accept 11:34.
  B  Add one body beat of ~110 words. ⭐ RECOMMENDED — B09 can carry
     the supply-chain figure that was cut.
  C  Re-record B03 with [slowly] and an added pause.
```

**Never pad an existing beat with filler to close a delta.** Add a beat carrying a real sourced item, or accept the runtime. And nothing downstream is built until this step completes — every frame range depends on it.

## 11 · Step 3 · Build and render

Only now do scenes, components and figure specs exist, and they are generated against real durations.

| Artefact | Contains |
| --- | --- |
| `EP##_03_ASSETS.md` | Every figure, prop and structure to be drawn, with its halftone tone map |
| `EP##_04_SCENES.md` | Per\-beat composition, plane by plane, state by state, to the frame |
| `EP##_06_PROMPTS_REMOTION.md` | One Remotion brief per beat with real `durationInFrames` |

### 11\.1 · Phase 0 · Project bootstrap

**No Remotion project exists yet.** Before Episode 1 of this runbook, build it once:

| Tier | Build | Note |
| --- | --- | --- |
| 0 | Remotion project, 1920×1080 @ 30fps, fonts, `tokens.ts` (palette, spacing, timing), `Root.tsx` registry, render script, occupancy script | Once, ever |
| 1 | `Paper`, `Grid`, `GroundRule`, `Vignette`, `Grain`, `ProgressRule` — the locked field | Global\-frame driven |
| 2 | `Halftone`, `OffsetStroke`, `FigureBlock`, `DataCard` — the print language |  |
| 3 | `SpringIn`, `ExitOut`, `StaggerGroup`, `CountUp`, `DrawLine`, `DrawArrow`, `Breathe`, `MotionBlur` — the parts bin |  |
| 4 | `SpatialScene`, `Layer`, `Group`, `Camera`, `useCamera`, parallax, `DebugOverlay` — the 2.5D layer | §3.5 |
| 5 | `Lucky` rig | §5.1 |
| 6 | Archetypes: `RevealArchetype`, `HierarchyArchetype`, `FlowArchetype`, `StackArchetype` | §3.6 |
| 7 | `Signature`, `SignatureReturn`, `DarkLaw` | Channel\-level. Once, ever |

Per\-episode build order after that: **the opening minute first** (30–40% of build time, kill\-switch applies), then the reversal, then everything else.

### 11\.2 · The scene block

```
━━━ B07 ━━━ 34.5s ━━━ 1035 frames @ 30fps ━━━ HIGH ━━━
AUDIO         B07.mp3, starts at 04:12.330
GLOBAL        startFrame 7570 of 21600

PLANES
  BG          paper #DADAD2, grid, ground rule at 78%, progress rule at 35%
  MID         counter structure, halftone mid, spans x 0–60%,
              height 38% of frame, sits on the ground rule
  FG          the tub (subject, 58% frame height, offset stroke),
              cost stack (right third), figure block, caption, source tag

CAMERA        f180 pull, z −0.5 → −1.4, easeInOut, 90f
              reason: reveal the three parties the counter pays
              wide-end occupancy 24% ✅ (Wide-End Law §3.3)

OCCUPANCY     projected 27% · bottom third 44%   ✅

STATES        f0–f24     tub drives in from R, spring, blur 18→0
              f24–f36    offset stroke prints on
              f36–f180   stack builds bottom-up, 5 segments, 8f stagger
              f180–f420  upper portion detaches, accelerates R, exits with blur
              f420–f720  remainder settles, figure counts to $44.3M, cubic out
              f720–f900  baseline draws, caption rises into lower third
              f900–f1035 hold with breathing, grid drift only

EVENTS        15 across 34.5s = 4.3 per 10s ✅ (HIGH floor is 5 per 10s → add 2)

PEAK          f690, on "four fifths"
TEXT          f120 "$210.4M" upper right · f480 "$44.3M" replaces
              f900 "one keeps four fifths" lower third
              f0 "Cinemark, Q1 2025" bottom-left, persistent
```

### 11\.3 · The props contract

Because Resolve assembles separately\-rendered pieces (§0.1, C2), the locked background and the progress rule would break at every cut unless each composition knows where it sits in the episode. **Every beat composition takes:**

```ts
{
  beatId:            string,
  durationInFrames:  number,   // from Step 2, never estimated
  fps:               30,
  globalStartFrame:  number,   // position in the assembled episode
  episodeTotalFrames: number,
  audioSrc:          string,
  audioOffsetMs:     number
}
```

Grid drift, vignette phase and the progress rule are all functions of `globalStartFrame + frame`, never of local frame. Get this wrong and the background visibly jumps at every beat boundary — the exact slideshow read the locked field exists to prevent.

### 11\.4 · Remotion owns everything visible

**If the viewer sees it, Remotion made it.** Text, typography, charts, icons, objects, characters, arrows, lines, diagrams, transitions, animation, camera movement, effects, composition.

Anything procedurally drawable is drawn in code — SVG, CSS, Canvas, React components. Do not rasterise what can be drawn. Resolve creates nothing visible (§12).

### 11\.5 · The occupancy check

Run on every rendered piece. **A piece that fails does not go to the timeline.**

```bash
ffmpeg -v error -i out/B07.mov -vf "fps=2,scale=320:180" -q:v 4 /tmp/occ_%03d.jpg
python3 - <<'EOF'
from PIL import Image; import numpy as np, glob
bg=np.array([218,218,210]); fails=[]
for f in sorted(glob.glob('/tmp/occ_*.jpg')):
    a=np.asarray(Image.open(f).convert('RGB')).astype(int)
    if a.mean()<120: continue          # Dark Law frames are exempt
    m=np.abs(a-bg).sum(2)>60
    ink=m.mean()*100; bot=m[126:,:].mean()*100
    if ink<22 or bot<35: fails.append((f,round(ink,1),round(bot,1)))
print("FAIL" if fails else "PASS", fails[:10])
EOF
```

### 11\.6 · Render validation

Before any piece reaches Resolve, verify: correct frame rate, dimensions and duration; correct pixel format; no missing assets; no render errors; no frozen final frame; no accidental black frame; no unintended clipping; no broken SVG; no failed asset paths.

```bash
npx remotion render B07 out/B07.mov --codec=prores --prores-profile=4444
ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt -of csv=p=0 out/B07.mov
```

V1 pieces render opaque — they carry the locked field themselves. V2 overlap pieces render with alpha and require `yuva444p10le`; anything else means the composition still has a background.

## 12 · Step 4 · Resolve and audio

DaVinci Resolve is the finishing and delivery layer, driven through the Resolve MCP.

| Resolve does | Resolve never does |
| --- | --- |
| Create/open the project, configure the timeline | Titles or visible text |
| Import and place Remotion renders, maintain timing | Graphics, diagrams, charts |
| Import voiceover, music, SFX | Character animation |
| Audio mix and finishing | Motion graphics of any kind |
| Grade, grain, export | Anything the viewer sees |

**If a visual is wrong, fix it in Remotion.** Never patch it in Resolve.

### 12\.1 · Timeline structure

```
V1 — Remotion primary renders
V2 — Remotion overlap / compositing where required

A1 — Voiceover
A2 — Music
A3 — SFX / sound design
```

Expand only where technically necessary. Grain across the whole timeline at 0.40–0.55 — it is what makes the episode read as one object.

### 12\.2 · Audio style

Restrained documentary. Voice stays dominant; music supports rather than competes. Silence is used deliberately. At a reversal:

```
music → duck → brief silence → the reveal → music returns
```

Sound effects mark meaningful events. Not every animation gets a sound.

### 12\.3 · Requesting audio assets

Never silently invent or download audio. Research legally usable sources, then state exactly what is needed:

```
ASSET NEEDED:  Whoosh-down
SOURCE TYPE:   Free / usable SFX library
DOWNLOAD:      [exact source]
SAVE TO:       assets/ep##_audio/sfx/whoosh-down.wav
USED IN:       B12, B24, B37
```

For music, state mood, energy, structure, vocals, duration, whether looping is acceptable, and the destination path.

Mark anything outstanding as `MISSING EXTERNAL ASSET` and continue with everything that does not depend on it. **Never stall the whole production on an optional SFX.**

## 13 · Step 5 · Package and ship

`EP##_08_PACKAGE_AND_SHIP.md`, built on Promise / Contradiction / Revelation.

```
TITLE      = the promise, the mystery
THUMBNAIL  = the contradiction, a visual question
VIDEO      = the revelation
```

### 13\.1 · Title

Generate multiple candidates. Prioritise curiosity, contradiction, information gap, consequence, relatability, natural language, click potential and search relevance. **The title is not the academic topic restated**, and it does not give away the answer.

### 13\.2 · Thumbnail

3840×2160. Title and thumbnail ask **two different questions about the same mystery** — connected, never repetitive.

```
TITLE:      Why This "Free" App Costs You ₹2,000
THUMBNAIL:  FREE?
```

Readable at small size. The wording comes from the episode's strongest actual contradiction.

### 13\.3 · VidIQ validation

Where VidIQ is available, score candidates and iterate. Target 90\+. Do not stop at the first acceptable candidate. **Never state a score VidIQ did not return** — a fabricated "97/100" is worse than no score.

### 13\.4 · Chapters

Every beat's true start is known from Step 2, so chapters are exact. No estimating. **Phrased as answers, never labels:** "What the counter actually keeps", never "Concessions breakdown".

### 13\.5 · Description

The WHAT THIS EPISODE ANSWERS block, sources with years, the ON AI block, chapters, and the transcript uploaded.

```
— ON AI —
Narration uses an AI voice model trained on my own recorded voice. Every
visual is built in code from the sources listed above — there are no
generated images or stock footage in this video. Research, script, data
and edit are my own.
```

This block is accurate **only while the code\-only policy (§0.1, C3) holds.** If external image assets are ever approved, this block must be rewritten in the same change.

## 14 · Monetization and disclosure

### 14\.1 · The defence stack

A cloned voice removes the single strongest defence — a real recorded human voice. That is not fatal, but it must be replaced, not ignored. YouTube's line is whether a human adds genuine creativity and value, and synthetic narration over templated visuals is the exact profile of the first inauthentic\-content category.

| Defence | Status |
| --- | --- |
| Real recorded human voice | **Gone.** Replaced by a clone |
| Original primary research, Tier 1 sources | ✅ Load\-bearing |
| Authored judgement, the counter\-argument | ✅ Load\-bearing |
| Every visual built bespoke in code | ✅ **Load\-bearing.** The C3 decision is what keeps this true |
| A correction per episode | ✅ |
| A reversal, not a summary | ✅ |
| Structural narrative arc | ✅ |
| No AI persona · zero advice | ✅ |
| Accurate disclosure | ⭐ §14.3 |

### 14\.2 · The code template trap

The component library that makes episode 5 faster is the library that makes episode 5 look like episode 4.

| Rule | Threshold |
| --- | --- |
| New primitives | At least **two new components or shells per episode** |
| Composition shell reuse | No shell in more than 50% of an episode's beats |
| Choreography | Entry order, stagger offsets and camera moves differ from the previous episode |

**The noun\-swap test:** take this script and the previous one, replace every proper noun with `X`, read both. If they read the same, the episode fails.

### 14\.3 · Disclosure

A cloned voice is a synthetic element and YouTube's disclosure requirement covers it specifically. **Toggle "altered or synthetic content" ON, and state it in the description.** The cost of disclosing is close to zero; being wrong the other way risks the channel. Re\-verify against the live policy page at every publish — it has moved twice in fourteen months.

### 14\.4 · Advertiser safety

Avoid graphic violence, graphic sexual material, gore, extremist imagery, dangerous instruction, shock imagery, profanity\-heavy narration and sensationalised criminal content. This does not mean boring. The tone can be sharp, witty, uncomfortable, surprising, cynical, funny, tense and provocative without being advertiser\-hostile. The objective is **high curiosity, strong retention, monetization safety.**

## 15 · Gates

### 15\.1 · Intake

| Check | Requirement |
| --- | --- |
| Four topics proposed with a recommendation | Required |
| Code fit assessed | A photographic dependency fails the topic |
| CTA placement chosen | Required |
| Runtime | 12–60 min, derived from research capacity |
| Word budget | From calibrated WPM, never 150 |
| Format and cold\-open device | Not the previous episode's |

### 15\.2 · Script

| Check | Requirement |
| --- | --- |
| Word count | Within 5% of budget at calibrated WPM |
| Every beat names a drawable thing | Required |
| No recognisable real person required | Required |
| Cold open | Character \+ action \+ contradiction \+ curiosity inside 10s |
| v3 tags | ≤1 per sentence · \~1 per 3–4 sentences · banned set absent |
| Signature | Untagged, verbatim, inside 3s |
| Meaning independent of tags | Every sentence works if the tag is ignored |
| Density floor | ≥1 sourced item per 60s |
| Beat IDs | B00 onward, contiguous |
| Reversal | Exists, and is a reversal rather than a summary |

### 15\.3 · Reconcile

| Check | Requirement |
| --- | --- |
| Every beat has an audio file | B00…B\#\# complete |
| Durations measured, not estimated | Required |
| Per\-beat WPM flagged | Anything outside ±15% of calibration |
| Delta reported with options | Required |

### 15\.4 · Visual

| Check | Requirement |
| --- | --- |
| **Ink coverage** | ≥22%, target 25–30% |
| **Bottom\-third occupancy** | ≥35%, target 45% |
| **Subject height** | 45–70% of frame |
| Three planes present | Every frame |
| Baseline contact | Nothing floats |
| Motion event interval | ≤3.5s everywhere |
| Density | At or above the class floor |
| Camera moves | Every one has a stated narrative reason |
| Wide\-End Law | Occupancy holds at the widest framing of every move |
| 2\.5D used selectively | Flat where flat is clearer |
| Offset stroke | Every foreground figure, nowhere else |
| Halftone | ≥3 tonal steps per figure |
| Hero figures | ≥180px |
| Progress rule | Every frame, monotonic, globally driven |
| One accent per frame | Progress rule excepted |
| Grid and ground rule | Every frame |
| Background continuity | No jump at any beat boundary |
| Alpha | `yuva444p10le` on V2 pieces |
| Static runs | \<3.0s, \<1.5s in the opening minute |
| Lucky | Readable at human scale wherever she appears |

### 15\.5 · Ship

| Check | Requirement |
| --- | --- |
| Runtime | ≥12:00, ≤60:00 |
| Opening minute | Passed its gate, or do not publish |
| Resolve | No visible graphics created there; VO, music, SFX aligned; levels checked; export verified |
| Chapters | From real audio, phrased as answers |
| Two new components built | §14.2 |
| Noun\-swap test | Run against the previous episode |
| Disclosure | Synthetic content toggle ON |
| ON AI block | Present and accurate |
| VidIQ score | Real, or absent. Never fabricated |
| Transcript | Uploaded |
| Live policy page | Checked |

## 16 · Change management

| Type | Scope | Action |
| --- | --- | --- |
| **A — Local** | This episode only | Implement. No approval needed |
| **B — Reusable** | Useful across episodes | Propose promoting it into the motion library or this runbook |
| **C — Architectural** | Production order, visual system, Remotion or Resolve architecture, character rules, asset policy, runtime rules | **Stop and ask** |

A Type C proposal states: current, new, why, affected systems, risk, recommendation. Ordinary implementation details never need approval.

**Self\-improvement:** when a technique proves useful, ask whether it is reusable. If yes, promote it. If uncertain, use it on another episode first. Do not let this runbook bloat with episode\-specific tricks.

## 17 · Open items

Originally five things were unresolved. As of 2026\-09\-05, three are closed
by Episode 2's actual production record; one was never a real blocker; one
remains open.

| \# | Item | Blocks | Status |
| --- | --- | --- | --- |
| 1 | ~~`CALIBRATED WPM` is blank~~ (§6.1) | Every word budget, every estimate at Step 1 | **Resolved — 134.** See §6.1 |
| 2 | ~~No Remotion project exists~~ | All of Step 3 | **Resolved.** Lives at `video-os/engine/remotion/`; Episode 2 shipped 28 beats through it |
| 3 | ~~Resolve MCP not reachable from this session~~ | Step 4 automation | **Resolved / moot.** MCP is reachable (a known launch quirk needs `Start-Process`, not a blocker); `video-os/PIPELINE.md` also made Resolve optional — FFmpeg produces the shippable master, Resolve only grades/mixes when used |
| 4 | **ElevenLabs is a manual step** | Step 2 | Fine as\-is — the creator records and returns `B##.mp3`. Flagged so nobody expects automation |
| 5 | **Maya has no rig or spec** (§5.2) | Two\-voice cold opens | **Still open.** `identity.json` has `"Maya": { "rig": null, "status": "unspecified" }`. Not needed unless Episode 3's cold open takes a two\-voice shape |

One further question worth settling before Episode 1: the channel owner and the recurring character share the name **Lucky**. If they are meant to be the same person, the ON AI and disclosure language should say so; if not, the character should probably be renamed.

## 18 · Tooling & compliance addendum — from Episode 3 (2026-09-05)

Filed under §16's **Type C — architectural** rule (production order / Remotion
architecture / asset policy). Current → new → why → affected systems → risk →
recommendation, as that rule requires.

**Current.** The visual stack is 2D only — Remotion + SVG/CSS transforms +
the selective-2.5D spatial system (§3). Tool adoption has been ad hoc,
decided per-session; the "free and properly licensed only" practice has been
followed (§ Production Stack Audit, 2026-09-03) but was never written into
this runbook, so it doesn't survive a fresh session with no chat history.

**New, effective Episode 3 onward:**

1. **Claude Skills are the standing playbook layer.** Run **humanizer** on
   every script pass (already the practice, now the rule). The adopted skill
   set — `blader/humanizer`, `iart-ai/motion-design-skills`,
   `iart-ai/explainer-video-skills`, `iart-ai/kinetic-typography-skills`,
   `iart-ai/data-animation-skills`, and the official `remotion-dev/skills` —
   is the default toolkit; adding another skill or MCP connector goes through
   the same licence check as any other dependency (below), not a separate
   process.
2. **Three.js joins the kit for true 3D**, via the official `@remotion/three`
   package — for a shot 2D SVG genuinely can't sell (real depth, an
   isometric/exploded view, a camera move through a scene), not as a
   default. It is an addition to the kit (alongside `SpatialScene`), never a
   replacement for the 2D system. Animate it the same disciplined way as
   everything else in §4 — `spring()` / `interpolate()`, nothing hand-rolled
   frame-by-frame — so 3D doesn't get a looser motion standard than 2D.
   Install `@remotion/three` (+ `three`, `@react-three/fiber` as peers) when
   the first 3D beat is actually built, not speculatively now (§16's own
   "don't bloat the runbook with unused tricks").
3. **Standing rule:** any tool that touches content creation — image, video,
   audio, 3D, model weights, a skill, an MCP connector — must be (a) free to
   use at this channel's current scale, commercial use included, and (b)
   carry a licence you can name. This was already the creator's rule for the
   2026-09-03 audit ("if you are not sure about the licence, remove that")
   and is now canon here, not a session-only decision. Applies with extra
   weight to **video generation** specifically, since that's the one
   category most likely to carry a paid or ambiguous licence — Wan 2.2
   (Apache 2.0, weights included) is the cleanest fully-open option already
   vetted; Google Veo/Imagen are commercial-safe only on a paid tier, so they
   are a **paid exception requiring a separate call**, not a default.

**Why.** The channel's 100%-code position is the load-bearing defence against
YouTube's inauthentic-content policy given the cloned voice (§14.1). Every
new tool either has to keep that position intact or become a logged,
disclosed exception (§13.5's note on rewriting the ON AI block). Writing the
licence rule into the runbook — not just memory — means the next session
inherits it without being told twice.

**Affected systems:** `engine/remotion/CLAUDE.md`'s skills/package list, any
future `package.json` dependency, the ON AI block (only if a generated-asset
exception is ever actually taken).

**Risk:** `@remotion/three` hasn't been benchmarked in this pipeline —
a 3D scene is heavier per-frame than the current flat-vector beats. First use
should time a render and compare it against current per-beat render cost
before it goes anywhere near a real episode.

**Recommendation:** adopt all three points above from Episode 3. No package
installs yet — do that when the first beat that needs it is actually built.

### Licence table (the "check every certificate" pass, 2026-09-05)

| Tool | Licence | Verdict |
| --- | --- | --- |
| three.js | MIT | ✅ free, commercial-safe, no runtime attribution required |
| `@remotion/three` | MIT (own code); requires Remotion core to run | ✅ — the licence that actually gates it is Remotion core's, below |
| Remotion (core / CLI / renderer / Player) | **Remotion Licence** — free for individuals and for-profit teams **up to 3 people**, commercial use included; a paid company licence is required at 4+ | ✅ currently free at this channel's size — **the one line item to re-check if the team ever grows** |
| `blader/humanizer` | MIT | ✅ already adopted |
| `iart-ai/*` skill packs (motion-design, explainer-video, kinetic-typography, data-animation) | MIT | ✅ already adopted |
| `remotion-dev/skills` (official) | MIT | ✅ already adopted |
| Wan 2.2 (video-gen, if ever used) | Apache 2.0, incl. model weights | ✅ cleanest open video model, but still governed by the Plane Rule (§ Production Stack Audit) — background/mid plane only, disclosed |
| Google Veo / Imagen (video/image-gen, if ever used) | Commercial use requires a **paid** tier | ⚠️ paid exception, not a default — needs an explicit call before use |

Sources: [Remotion License FAQ](https://www.remotion.dev/docs/license/faq) ·
[Remotion company licensing](https://www.remotion.pro/license) ·
[three.js LICENSE](https://github.com/mrdoob/three.js/blob/dev/LICENSE) ·
[@remotion/three on npm](https://www.npmjs.com/package/@remotion/three).

## 19 · Motion cadence & beat-to-beat transition addendum (2026-09-05)

Type B — reusable (§16). Two tightenings to §4's motion rules, from creator
review of the delivered NIF002 master.

**1. Motion cadence tightened to ≤3s** (was ≤3.5s). Every beat needs a real
motion event at least that often — a build, a draw-on, a state change — not
counting ambient micro-motion (grid drift, breathing).

**2. Any element representing an ongoing process must loop for as long as
it's on screen.** A counter, a scan, a traveling packet, a loading state —
if the thing it represents doesn't stop, the animation doesn't stop either.
Landing once and freezing reads as static even if the initial build was
lively. (This is the rule the 2026-09-04 "13-beat dead-stretch pass" already
applied to B14–B27 without it being written down anywhere — now it is.)

**3. Beat-to-beat cuts get a black push, ~1.4s total, replacing the
dissolve-through-cream.** Creator review of the master: cuts read as too
fast — "after this beat, it's doing that, after this beat, it's doing that"
— no room to breathe between ideas. Each beat now holds solid black for its
last/first ~12 frames with a ~9-frame fade on either side; the hard cut
lands while both sides are already full black. No change to total episode
runtime — it reuses the head/tail settle time every beat already budgets,
it doesn't add frames. Implemented once in the shared `V4Beat.tsx` wrapper
(`TRANSITION_HOLD` / `TRANSITION_RAMP`), so it applies to every beat, current
and future, from one place.

**Why not faster / why not shorter than 1–1.5s:** explicitly asked for and
confirmed — a faster internal mechanism is fine, but the creator wants the
viewer to keep at least a full second of dark between ideas, not a flicker.

**Open call:** this changes the *feel* of every cut in **NIF002**, which is
already mastered and delivered (`09_master/NIF002_master.mov`). Applying it
there means re-rendering all 28 beats + re-mixing + re-mastering — the
Runbook rule is written for Episode 3 onward regardless; whether NIF002 gets
the same retrofit is the creator's call, asked separately.

**Decided (creator, 2026-09-05): NIF002 is NOT retrofitted.** It ships
exactly as already mastered. §19's cadence, black push and (§18's) Three.js
all apply from Episode 3 onward only.

## 20 · Technique research from reference channels + SFX workflow (2026-09-05)

Type B — reusable. Creator: study The Infographics Show / OverSimplified-type
explainer channels for craft techniques worth adopting, **keep the current
visual identity** (cream field, flat OverSimplified-scale figures — already
the house style), just raise execution quality. Findings below are from
public sourcing (interviews, breakdowns), not access to either channel's
actual project files — treat as documented industry technique, not an
insider account.

**What they actually run on:** The Infographics Show — Adobe Illustrator
(vectors) → After Effects (animation) → Envato Elements for premade
backgrounds/assets ([Friends of Animation](https://www.friendsofanimation.com/what-animation-software-does-the-infographics-show-use/)).
OverSimplified — Photoshop (assets) → After Effects (animation), hand-drawn
character/background style, humour-forward pacing over technical complexity
([Creator Handbook](https://www.creatorhandbook.net/oversimplified-a-youtube-empire/)).
**Takeaway: the quality is craft discipline (rigging, timing, asset variety)
executed in mainstream tools, not exotic technology.** Nothing here requires
matching their toolchain — the craft transfers to code.

**Two distinct "map" techniques — don't conflate them:**
1. **Real geography** (an actual place matters — a city, a route, "this
   happened here"). Use **MapLibre GL JS + Turf** — both free, BSD-3-Clause /
   MIT, no API key ([MapLibre LICENSE](https://github.com/maplibre/maplibre-gl-js/blob/main/LICENSE.txt),
   [Turf license](https://github.com/Turfjs/turf-www/blob/master/LICENSE)).
   Already documented as a Remotion skill (`remotion-maps` → `maplibre`
   technique) — deterministic per-frame camera via `calculateCameraOptionsFromTo`,
   Turf for route slicing/great-circles. **Do not use `demotiles.maplibre.org`
   for a real render** — it's MapLibre's own demo/test endpoint, not a
   production dependency. Use **OpenFreeMap** instead (free, no key, explicitly
   production-ready, OSM data, needs attribution — automatic if using
   MapLibre's own attribution control) ([OpenFreeMap](https://openfreemap.org/)).
   This is the tool for NIF002's B27-style "next episode: Google Maps" beats
   or any "here's the real place" establishing shot.
2. **Stylized territory / flag maps** (the OverSimplified "who controls what"
   look — a flat illustrated world/region map with animated colour-fills and
   flag markers). This is NOT a MapLibre job — their maps are hand-illustrated
   flat art, not real basemap tiles, and a photoreal MapLibre render would
   clash with NIF's cream-and-line-art world. Build this the way every other
   NIF diagram is built: one free/PD flat SVG base map (Wikimedia Commons has
   several — **verify the exact file's licence on its own page before use**,
   same discipline as everything else; the "BlankMap" series is commonly PD)
   + code-driven fills/highlights/flag icons in the house palette, animated
   with `spring()`/`interpolate()` like every other beat. No new dependency.

**Character gesture range — ties to the existing Rive rig plan, doesn't
replace it.** Both reference channels lean on expressive arm/hand gesture
animation (raised arms, pointing, shrugging) tied to narration emphasis —
this is exactly what the already-planned `@remotion/rive` state-machine
upgrade for Lucky (§Lucky, `channels/nif/rigs/LUCKY_RIV_BRIEF.md`) is meant
to deliver once the `.riv` file exists. Not a new initiative — a reason to
prioritise finishing that brief before Episode 3's character-heavy beats.

**SFX planning moves earlier in the build, not after.** NIF002's cue sheet
(`episodes/NIF002/08_conform/NIF002-audio-edit-list.md`) was built as a
separate pass once the picture was locked — workable, but late. **From
Episode 3: mark each beat's SFX cue points (timestamp + sound type) as part
of building that beat**, the same turn the visual lands, not a follow-up
pass across all 28 at the end. Whether the cue then gets sourced
automatically or handed to the creator as a timestamped list ("at 0:47, need
a whoosh") is a per-cue call — either is fine, but the *cue itself* is
identified at build time, every time.

## 21 · Tooling additions — the 2026-09-06 evaluation

Type C (§16) — touches tooling policy (§18) and the §15 gates. A batch of 24
candidate repositories + the open image/video-model landscape was evaluated
against §18's rule (*free at this channel's scale, commercial use included,
licence you can name*). Full write-up with per-repo verdicts, install commands
and "use it when": **`TOOLKIT.md`** in the repo root.

### 21.1 · Added to the standing toolkit

All MIT / Apache-2.0 / BSD-3-Clause, all free at solo scale, commercial use
included. Installed as skills/plugins alongside the §18 set.

| Tool | Licence | Pipeline slot |
| --- | --- | --- |
| `mvanhorn/last30days-skill` | MIT | Step 0 — test a topic against the live conversation (Reddit / HN / YouTube / arXiv) before a runtime is committed; grounds the §8.1 novelty/timing/demand gate |
| `jordanrendric/claude-video-vision` | MIT | Step 3 visual gate + Step 5 watch-through — Claude sees the render frames + a local-whisper transcript. **Local whisper only** (whisper.cpp already present); no paid vision API |
| `greensock/gsap-skills` + GSAP | MIT / no-charge | Step 3 — GSAP is now 100% free incl. every plugin. `SplitText`, `MorphSVG`, `DrawSVG` used inside Remotion via `useGSAP`, animated to the same §4 discipline |
| `coreyhaines31/marketingskills` | MIT | Step 5 — title / thumbnail-text / description drafting, community + cross-post copy, audience research. Pairs with vidiq scoring (§13.3) |
| `D4Vinci/Scrapling` | BSD-3-Clause | Step 1 — primary-source scraping (filings, archives, JS-heavy pages) when WebFetch/WebSearch fall short. Respect robots.txt and site ToS — the legitimacy of sourcing is load-bearing (§14) |
| `cathrynlavery/diagram-design` | MIT | Step 3 — 39 named editorial diagram layouts as a reference + fast static HTML/SVG mockup before coding the animated Remotion version of a data beat |
| `upstash/context7` | MIT | Dev — pulls current, version-correct library docs into context (Remotion / three / maplibre); anti-hallucination |
| `addyosmani/agent-skills` (review / simplify / debug / security pieces) | MIT | Dev — `video-os` codebase quality |
| `obra/superpowers` (`brainstorming` / `writing-plans` / `systematic-debugging`) | MIT | Step 1 planning + render-bug debugging |
| `fcakyon/claude-codex-settings` (humanize write-hook + git-confirm hooks only) | Apache-2.0 | Step 1 gate (§21.3) + Dev safety (`block_force_push`, `git_commit_confirm`) |

Adding any of these still goes through the §18 licence check — done, recorded
above. Cherry-picked, not bulk-installed: the large skill catalogues
(`alirezarezvani/claude-skills` 388, `K-Dense-AI/scientific-agent-skills` 163,
`wshobson/agents` 202) overlap the ~20 skills already installed — take a named
skill from them only when a specific need appears.

### 21.2 · Image / video generation — additions to the §18 licence table

Still fully bound by the Plane Rule (`identity.json.assetPolicy`): BG/MID plane
only, `subj` + `fg` stay code, ≤40% of shots, disclosed, never as evidence.

| Tool | Licence | Verdict |
| --- | --- | --- |
| FLUX.1 [schnell] (local) | Apache-2.0, incl. weights | ✅ the default free image model — cleanest licence in open image gen |
| Cloudflare Workers AI (hosts FLUX schnell / SDXL) | model Apache-2.0; free recurring daily tier, no card | ✅ the free *cloud* image path — resolves the "Nano Banana API needs GCP billing" blocker from the 2026-09-03 audit |
| Z-Image-Turbo (local) | Apache-2.0 | ✅ alternative free image model |
| Stable Diffusion 3.5 | Stability Community Licence | ⚠️ free **only under $1M/yr revenue** — revenue-gated, re-check if the channel scales |
| LTX-2 / LTX-Video | Apache-2.0 (free under $10M ARR), licensed training data | ✅ Apache video option; only open model with native synced audio; cleanest training-data provenance |
| HunyuanVideo 1.5 | Apache-2.0 | ✅ Apache video option, strong motion |
| Mochi 1 / CogVideoX-2B | Apache-2.0 | ✅ lighter local video options |
| Connected "Creative" MCP output (`creative_generate_*`) | unverified | ⚠️ **not vetted** — internal mockups only until output licence + metering are confirmed in writing. §18 rule applies to it like any other tool |

Wan 2.2 (§18) stays the default open video model. Veo/Imagen stay a paid
exception requiring a separate call.

### 21.3 · Two automated checks added to the §15 gates

**§15.2 (Script) — AI-tell detection.** Each beat's PLAIN narration is run
through a **local, self-hosted AI-text detector** (Binoculars, ICML 2024 —
`ahans30/Binoculars` / the `binoculars-detector` Docker wrapper; free, CPU, no
API) and must sit below its threshold. This is a **smoke alarm, not an
override** — a flag means "read this beat aloud and check it sounds like a
person" (§9.2), it does not auto-fail. Detectors are noisy and biased against
plain / technical / non-native English; the read-aloud test stays the final
authority. Written rule, now explicit: **the human writes the messy draft
first, AI polishes second — a script is never one-shot from a prompt.**

**§15.4 (Visual) — watch-through.** Before the picture is called locked, a
`claude-video-vision` pass over the assembled cut checks: every caption is
on-screen while its line is spoken, no element collisions / overlaps, no
clipped or off-safe-area text, no frozen stretches past the §4.2 limits. This
formalises the previously ad-hoc manual watch-through into a repeatable command
against `out/review/NIF0XX-FULL.mp4`.

### 21.4 · Rejected

| Candidate | Reason |
| --- | --- |
| `Imbad0202/academic-research-skills` | **CC BY-NC 4.0 — non-commercial.** Fails §18 (channel is monetized). Research need is met by `last30days-skill` + `Scrapling` + Claude WebSearch |
| claude-mem / hivemind / mem0 / other memory layers | The native file memory is a working, hand-curated system — a second store means drift. `ReflexioAI/claude-smart` (corrections→rules, local) is the only one doing a distinct job — conditional, only if repeated corrections aren't being caught |
| HeyGen HyperFrames as a video **engine** | One-engine rule (§11.4, production-stack audit). The Remotion `video-os` engine stands. Mine HyperFrames for ideas only |
| `microsoft/power-platform-skills` | Real use needs paid Power Platform / Dataverse / premium-connector licences. Ops layer (Claude + scheduled-tasks + Node scripts + vidiq/Resolve MCPs) is already more capable here at $0 |
| Generic front-end component libraries in beat visuals | §14.2 code-template trap — bespoke-by-design house style. They are fine for thumbnails / a channel site (see `TOOLKIT.md` §6), not for beats |
| A second token-compressor | `caveman` MCP already connected — `rtk` is an either/or, not an also |

## 22 · Propose-then-approve for significant visual/architectural changes (2026-09-06)

Type C (§16). Triggered by the creator reviewing a finished NIF003 beat and
pushing back on the visual language itself, not a bug: too much of the
episode read as one repeated template (a bordered card on a flat floor band),
and the fix needed to be decided, not just built and shown after the fact.

### 22.1 · The standing rule — every episode, from now on

**Before implementing a significant visual or architectural change — anything
that touches the shared visual language, a shared component used by many
beats, or the channel's look as a whole (not a routine per-beat bug fix) —
stop and:**

1. **List** what's actually being proposed, in concrete terms.
2. **Recommend** one direction, and name at least one real alternative — not
   a false-choice strawman.
3. **Get an explicit decision from the creator** before writing the code.

This generalizes the existing §16 shared-component gate (which already
required a stop-and-ask for shared-component changes) to the broader class of
*significant visual* changes even when only one beat is touched first as a
pilot — because a pilot beat is, by design, about to become the template for
several more. Routine fixes (an overlap, a wrong frame, a mistimed cue) do
not need this — only changes that would reshape how the show looks or is
built.

**A mid-implementation correction from the creator supersedes an
already-approved plan for the specific piece it corrects.** If real-time
feedback rejects a direction that was part of an approved plan (this
session: an approved "curated 8 beats, keep the grey floor as fallback
elsewhere" plan got overtaken beat-by-beat by three successive "no, remove
this too" corrections until the standing decision became "no floor treatment
of any kind, anywhere"), the corrected instruction governs going forward, not
the original plan text — but the change in scope gets named back to the
creator rather than silently assumed, per the same list-then-confirm rule.

### 22.2 · This session's standing decisions (apply to every future episode, not just NIF003)

1. **Real 3D (Three.js via `@remotion/three`) is the premium treatment for
   props/icons that need to feel "documentary-premium"** — pushed further
   than the original §18 "only for a shot 2D can't sell" framing; a curated
   subset of beats (not a blanket retrofit) is the intended scope per pass.
2. **Flat/gradient/dot occupancy-floor treatments (`GreyFloor` and anything
   shaped like it) are deprecated project-wide, not just for NIF003's curated
   8.** Three successive treatments were shown and rejected in this session
   (flat grey fill → warm gradient fill → idle accent-dot row) — the
   creator's objection was to the *visual result* (a colour band across the
   bottom third), not the implementation technique. **Open finding, not yet
   resolved (see §22.3): a lit 3D ground plane is the same visual result by
   a different technique, and needs a different fix, not a fourth floor
   colour.**
3. **Character variety is encouraged**: a generic/faceless bystander
   `Figure` reacting (an `EXPR` preset) at a handful of the biggest-number
   beats, so the protagonist isn't the only character carrying every peak
   moment.
4. Record every such decision in **both** this Runbook and the live
   `nif-house-style` skill (the skill is what's actually consulted at
   beat-build time — a decision recorded only here would be invisible day to
   day).

### 22.3 · Stage3D technical findings (`src/nif003/v4/Stage3D.tsx`) — for whoever extends this next

Two real, non-obvious bugs found and fixed while building the first
retrofitted beat (B06), worth recording so they aren't re-discovered the hard
way:

- **A flat/thin prop needs a base yaw toward the camera, not just "spin it."**
  `Stage3D`'s camera sits at `position:[9,7,9]` looking at the origin — in
  the ground plane that's exactly 45° off the Z axis. A flat prop modeled
  facing +Z (rotation 0) is already ~45-54° oblique to the camera before any
  idle motion is added. An idle rock/spin range that looks safe assuming 0°
  is face-on (e.g. ±29°) is actually swinging between ~16° and ~74° off-
  camera — and near the steep end, a thin box's face foreshortens to almost
  nothing. **Fix**: give flat-kind props (`receipt`, `cardBlock`,
  `scaleBeam`) a fixed base yaw (`Math.PI/4` for this camera) so 0° really is
  face-on, then apply a small bounded oscillation on top — never a full 360°
  spin for anything with one thin axis (that class of prop should rock, not
  spin; only rotationally-forgiving props like `coinStack`/`lockBody`/`box`
  are safe to spin through 360°).
- **A prop's world-space height has a real, silent clipping budget.** The
  `Stage3D` wrapper div is `overflow:hidden` at the bottom-third's pixel
  height, and the `ThreeCanvas`'s own camera `zoom` sets how many world units
  fit in that height. A prop modeled taller than that budget doesn't error or
  warn — it just gets its top silently clipped, leaving only a thin sliver of
  its base visible (this, not the rotation bug above, was the primary cause
  of B06's "pale, oddly-shaped, nearly-invisible" receipt). At this file's
  `zoom:100`/`STAGE_H` pairing, keep a standing prop's total modeled height
  at or below ~1.0-1.1 world units (matches `coinStack`'s proven ~0.83-1.0
  range) — verify any taller prop with an actual `remotion still` render at
  a few different frames across its rock/spin cycle, not by reading the
  numbers alone.
- **Resolved 2026-09-06, same day**: `Stage3D`'s ground plane is now hidden
  by default (`noGround`, defaults `true`) — no beat renders a filled/tinted
  plane of any kind. Occupancy mass instead comes from real hero-scale props
  (bigger, more of them, positioned to spread across the zone) plus a small
  localized "contact shadow" mesh under each (a dark, semi-transparent flat
  disc sized to that prop's own footprint — the same job a 2D `groundShadow`
  does, just in 3D; explicitly NOT a full-width plane, so it doesn't
  reintroduce the rejected floor band). **Verdict, confirmed empirically
  across all 8 retrofitted beats (B04/B06/B14/B17/B19/B25/B27/B28), not
  guessed**: even hero-scale props (up to ~2.6x base scale, 2-3 per beat,
  spread across the width) do **not** clear the occupancy law's 22%/35%
  thresholds — worst-frame readings landed at 4-8% ink / 10-21% bottom-third,
  well under half the required floor. This confirms, at real production
  scale rather than a small test, the standing lesson this project keeps
  re-deriving: small-to-medium discrete content (icons, props, marks) cannot
  geometrically reach the bottom-third floor no matter how numerous or how
  large individually, short of either a filled plane (rejected) or props
  large enough to dominate/clash with the 2D content above.
  **2026-09-06, later same day — corrected: "ship it as a disclosed trade-off"
  was the wrong call, made without actually trying the fix first.** The
  creator's real instruction, restated plainly: audit means finding the
  problem AND resolving it, not reporting the number and stopping. Went back
  and built the fix: a new `shelf` `Prop3DKind` — a wide (6 world units),
  BOUNDED 3D counter/ledge, sunk so its top sits exactly at ground level so
  other props simply rest on it — reusing the already-proven "one wide
  bounded prop carries real occupancy mass" lesson (B32's 2D ticker) in 3D.
  Rolled out to **all 29 previously-failing beats** (not just the original
  curated 8), each restaged with a shelf + 1-3 real props chosen for that
  beat's own content (coins for money, a receipt for a bill, a padlock for
  "locked in," stacked blocks for "the bundle," etc.) — see the full
  per-beat table in [[ep03-status]]. Also fixed two bugs this rollout
  surfaced: props timed to pop in only at a late climax word left the first
  half of a beat looking empty (occupancy is measured across the WHOLE beat,
  not just the payoff moment) — moved every prop's entrance early (~frame
  10-30), keeping only the emphasis GLOW tied to the climax word; and a
  `shelf` fed a `tint()`-derived colour into `Stage3D`'s own local
  `shadeHex()` helper, which turned out to have the **exact same silent-
  black bug** as §22.4 below, just never triggered before — fixed by
  deleting the duplicate helper and routing through the one, now-correct,
  shared `shade()`.
  **Real, measured result across all 29 retrofitted beats**: bottom-third
  now regularly clears 25-37% (several beats — B04, B08, B13, B14, B15,
  B18, B19, B29 — clear the 35% law outright); overall frame ink moved from
  3-8% to a consistent 10-17%. **Still short of the 22% overall-ink law**,
  and this time with a real, load-bearing reason rather than a guess: the
  bottom third is geometrically capped at 33.3% of total frame area, so
  even a bottom third at 100% fill caps out around 33% overall — reaching
  22% from the bottom third alone requires it near ~66% full, which was
  tested directly (see the "huge" shelf trial) and reads as a wide grey
  wedge touching both frame edges — i.e. the rejected flat floor again, just
  arrived at through scale instead of colour. **Standing call: this is the
  real ceiling for "real 3D props, zero floor, still looks like this show"**
  — the remaining gap to 22% would need genuine upper-two-thirds content
  too (bigger 2D cards/data, not just bottom-third props), which is a
  further, separate pass, not a parameter tweak. Documented honestly with
  exact per-beat numbers, not silently rounded up.

### 22.4 · `tint()`/`shade()` couldn't parse their own output — a real, silent, project-wide bug (2026-09-06)

Found while investigating a creator-flagged screenshot ("orange color on
black text") on `DimCard`'s "SPORTS, ALONE" (B16) and ESPN (B14) cards, both
rendering a harsh black gradient across most of the card instead of the
intended subtle top-light/bottom-shade edges. Root cause, in `tokens.ts`:
`shade()`/`tint()` parsed their input as a hex string
(`parseInt(hex.replace("#",""), 16)`) — but `DimCard` calls
`tint(fill, 0.35)` / `shade(fill, 0.08)` **on its own `fill` prop**, and any
beat that built that `fill` from `tint(...)`/`shade(...)` itself (e.g.
`fill={tint(COLOR.orange, 0.3)}`) was handing DimCard an already-`rgb(r, g, b)`
string, not hex. `parseInt("rgb(...)", 16)` returns `NaN`; `NaN` bit-shifted
and masked (`(NaN>>16)&255`) coerces to `0` in JS for every channel — so the
"lightened"/"darkened" result silently became `rgb(0,0,0)`, pure black,
instead of erroring. No exception, no visual glitch that reads as "broken,"
just a card whose bottom (or top, or both) reads as an unintended chrome/
gunmetal gradient. **Confirmed affecting every `DimCard`/inline-SVG call
site whose `fill` was itself a `tint()`/`shade()` result** — B04's RETRANS
CONSENT card, B14's ESPN card, B16's SPORTS ALONE card, and (via a
`shade(tint(...))` compound call directly in an SVG `fill=`) two shapes in
B31 — five confirmed sites, likely more never individually screenshotted.
**Fixed at the root**: both functions now route through a shared
`parseColor()` that accepts either `#rrggbb` or `rgb(r, g, b)`/`rgba(...)`,
repairing every affected call site in one change rather than patching each
one. **Lesson for every future helper in this family**: if a colour utility
can take another colour utility's own output as input (a very natural thing
to write — `shade(tint(base, x), y)` reads perfectly reasonably), it must
accept its own output format, or every such composition is a silent,
undetectable-by-typecheck black hole. Worth a quick grep
(`tint(tint(`/`shade(tint(`/`tint(shade(`/`shade(shade(`) after touching
either function again.

### 22.5 · Self-audit content-fill DURING the build — every episode from NIF004 onward

Type C. The creator's standing instruction, given after reviewing this
session's occupancy work: **"audit" means finding a problem and resolving
it, not measuring it and reporting the number** — and that check should
happen *while building each beat*, not as a separate pass discovered after
the fact by the creator scrubbing through the finished episode. NIF003
itself keeps its retroactive fix (§22.3); this rule governs everything
built from here on.

**The rule**: after building each beat (before moving to the next one),
self-assess how much of the frame is real content versus empty field —
by eye against a rendered still, not by trusting the code. The creator's
own bar, in their words: **~70% content is the target; below 60%, add more
— real, connected assets/icons/props tied to that beat's actual content,
never generic filler dropped in just to fill space.** This is the same
occupancy law already in force (§13.5 / `npm run occupancy`), stated as a
build-time habit instead of an end-of-episode gate: run the check and look
at a still **per beat, as it's built**, not in one batch at the end.

**Two concrete failure modes to check for specifically, both found by the
creator's own eye this session, not by the occupancy script (the script
missed both — it measures ink area, not composition)**:
- **Empty space that "reads" empty despite passing ink numbers** — e.g. a
  beat where all the real content sits in one screen third and the rest is
  bare cream. Look at the WHOLE frame, not just whether the number cleared
  the floor.
- **Partially-clipped or off-screen elements** — an SVG or 3D prop cut off
  at a container edge, rotated to an unreadable angle, or otherwise only
  half-visible. This is a rendering correctness bug, not an occupancy
  question, and the ink-area script cannot catch it at all — only looking
  at the actual frame does.

**Practically**: render a still at a representative frame (or a few — start
mid, and the frame where the beat's biggest element is on screen) for every
beat before calling it done, the same discipline as the 2026-09-06
bug-audit pass (§ep03-status memory) already established — just moved
earlier, into the build loop itself, instead of a separate end-of-episode
sweep.

### 22.6 · Render → DaVinci Resolve handoff

The creator's explicit next step after the Remotion-side content pass:
render the full episode and move it into DaVinci Resolve for the grade/
finish pass (per the pipeline's own long-standing division — Remotion owns
every visible pixel, Resolve owns the grade/vignette/audio-mix finish,
CLAUDE.md's own non-negotiable). `NIF003-V4` (the single 37,230-frame
composition, SFX/music baked in) was kicked off rendering to
`out/review/NIF003-FULL.mp4` the same session this section was written;
check that file's existence/duration before assuming it's done — a 20-
minute episode with real Three.js content in ~29 beats is a genuinely heavy
render, not a quick one. Once it exists: hand off via the `davinci-resolve`
MCP (import as a timeline item, per its own tool docs) rather than a manual
drag-and-drop, so the import is scripted/repeatable for future episodes too.

### 22.7 · The beat-by-beat visual rebuild loop (creator, 2026-09-06, after reviewing the NIF003 full render)

Type C. The creator watched `out/review/NIF003-FULL.mp4` and rejected the
visual state: **"half baked graphics", "AI slop"**. The `Stage3D` retrofit
(§22.3) — a grey `shelf` + 1-3 primitive props under a caption — is not a
finished look; it is ~15% frame fill and reads as a template. This section
replaces §22.3's "standing call" (that ~15% ink was the real ceiling) and
tightens §22.5 (which had applied only from NIF004). **It applies to NIF003
now.**

**Reference for the bar:** OverSimplified / "Professor Stein"-class density —
every frame carries a character *and* a map/diagram *and* icons *and* labels
*and* connecting arrows. Not one prop on a shelf.

#### 22.7.1 · The loop — every beat, NIF003 onward

1. **Render a still** (`remotion still NIF003-B##v4 … --frame=N`) at a few
   representative frames — mid-beat, and the frame the beat's biggest element
   is on. Look at the frame. Do not trust the code or the occupancy number.
2. **Audit** against four questions:
   - Does the visual say what the *script line* says? (not "is there a visual")
   - Is anything half-baked, off-screen, clipped, or rotated to an unreadable
     angle? (§22.5's two failure modes)
   - Does every motion directive earn its place? A `glow`, a `spin`, a
     `rotate-in-loop` has to *mean* something on screen — "it moves so it's
     not slop" is not the same as "the movement shows the mechanism."
   - **Will a YouTube viewer actually see it?** (creator, 2026-09-06) Check the
     still *shrunk to phone size* (~360px wide) and imagine YouTube's
     compression. A label under ~22px, a thin hairline, a pale-on-cream tint,
     a number that's on screen for under ~0.6s, a key element smaller than
     ~8% of frame height — **the viewer misses it.** The one thing the beat
     exists to land must be unmissable at that scale: big, high-contrast,
     held long enough. If it only reads at 100% zoom, it fails.
3. **Verdict**: `production-ready` or `rebuild`. Record it in the per-beat
   table in the `ep03-status` memory *and* here. A `rebuild` beat is redone
   **before** moving to the next beat — no batching the fixes for later.
4. Re-render the still, confirm by eye, then advance.

#### 22.7.2 · The fill target — ~70%, with real connected content

- **~70% of the frame reads as real content**; below 60%, add more. Measured
  by eye against a still, not by the ink script.
- Per ~30s beat, roughly: **3-5 props + 4-6 icons/assets + ~1 character**, all
  tied to *that beat's* content. Never generic filler dropped in to fill space.
- **Locations are props, not builds.** Grass underfoot + a tree left and right
  = a park. A lamp + a window near the top edge = a bedroom. Don't model the
  room — place the 2-4 defining props. Props enter from the left and right.
- **Connect the parts.** Labels on the elements, and **arrows / lines between
  them** so the frame reads as one wired-together idea, not scattered pieces.
  A payment goes *from* here *to* there — draw that arrow, send a token down
  it.
- **Everything is alive.** Rotate, glow, drift, travel, re-tally — the whole
  hold, per the anti-fatigue rule. A still, dead prop is what reads as AI slop;
  the same prop with a continuous mechanic does not.
- Kill the grey `shelf` / any angled grey slab — it is the rejected floor band
  by another route (§22.2). Ground props with a per-prop contact shadow only.

#### 22.7.3 · Division of labour changes (from here)

- **Claude does not run full-episode renders.** Claude provides the exact
  render command, the settings, and the output path; the creator runs it.
  Iteration is beat-by-beat stills only.
- **Text moves to Resolve.** Claude no longer bakes captions, subtitles, or
  kinetic "deep text" (the orange punch hits) into Remotion. Claude delivers a
  **timing sheet** per beat — `mm:ss–mm:ss  subtitle: "…"` and
  `mm:ss  punch: "…"` — and the creator adds all of it in DaVinci Resolve,
  along with fades in/out. Text that is *part of a prop* (a card label, a
  chart axis, a bill line item, a flag) stays in Remotion — it is artwork, not
  a caption.
- **SFX are specified per beat**, from NIF003 on — a per-beat cue list, not
  only the global-frame stem.
- **Resolve is a manual creator step**, not MCP-driven — a light grade +
  vignette + the text pass. Remotion still does all the heavy lifting.
- Code-review the beat kit with the `superpowers` skill (install via `/plugin`
  if absent) before locking a rebuilt beat.

#### 22.7.4 · Dynamic, not templated (creator, 2026-09-06)

The §14.2 code-template trap, restated for this rebuild: **do not give every
beat the same composition.** B00/B01's "shared living room + Lucky + TV + a row
of marks + connector lines" is right *for those beats* (the "you, at home"
beats) — it is **not** a template to stamp onto all 33.

- **Composition follows the beat's content.** A data beat is big animated
  numbers/bars, no room. A blackout case study is a two-sided negotiation + a
  day-counter + a household map. A history beat is a document + a gavel + two
  paths. The reversal is the Dark Law. Read the script line and the beat
  sheet's `Visual mode` / `Motion intent`, then design *that* — don't reach
  for the last beat's layout.
- **The character is optional.** Lucky (the one colour figure) anchors the
  domestic beats and the reversal. Most middle beats don't need her. When a
  beat needs *people* but not *her* — "77 million households", "cord cutters",
  "political campaigns", "a household that never turns on a game" — use the
  **faceless everyperson** figures (`Figure ghost` / small outline figures):
  they show up, act out the point (walk out, line up, get counted, get
  locked out), and leave. A few, doing something — never a static crowd.
- **Vary the motion.** Not every beat is "elements pop in on their word + a
  connector draws". Rotate through the vocabulary: a counter spinning up, a
  bar overtaking another, a map filling, a stamp coming down, a signal
  rippling out, a token travelling a chain, a wall of spend pouring, a
  calendar tearing off days, a shape morphing. The beat sheet's `Motion
  intent` line is the starting point.
- The **shared bits that SHOULD recur** (so it still reads as one episode):
  the palette, the two fonts, the progressive build cadence, the cream field,
  Lucky's design when she does appear, the one-orange-accent rule, the
  `LivingRoom` set *for the domestic beats only*.
- The noun-swap test (§14.2) applies to the visuals too: if B08 and B14 would
  read the same with the labels swapped, one of them is templated — rebuild it.

Every beat's chosen approach is logged in the `ep03-status` memory's per-beat
table (a one-line "what this beat's composition is") so the set stays varied
on purpose, not by accident.

### 22.8 · The per-episode uniqueness quota + locations are props (creator, 2026-09-07)

Type C. After reviewing NIF003's `engine/remotion/src/nif003/v4/beats.tsx` the
creator called it the standard — *"every beat is good, has its own unique thing,
takes time, takes space"* — and gave the standing instruction for **every
episode from NIF004 on**: avoiding templates (§14.2, §22.7.4) is not enough.
Each episode must *add* a set amount of new bespoke visual work, and it must not
be rushed to hit a beat count.

**The quota, per episode:**

1. **Two to three genuinely new *visible* assets or mechanisms.** A bespoke prop
   or rig, a new treatment, an episode-specific icon set, or a new motion
   mechanic. The test is the viewer's, not the compiler's: someone watching two
   episodes back to back can point at 2–3 things this one does that the other
   never did. This is §14.2's "two new components per episode" restated as a
   thing you can *see*, not a diff stat. NIF003's set, for reference:
   `TV.tsx` + `PaymentGlyphs` (the cold-open television + firing coins),
   `DimCard.tsx` (CSS-3D card depth — cards / icons / data only, never a figure
   or a location), `icons.tsx` (~20 one-accent glyphs, one per concrete noun the
   script names).

2. **About three distinct "location types."** A location = the locked cream
   field + a distinct set of **2–4 props** that say a place, entering from the
   left and right. A location is **never** a background change and never a built
   room — the field is locked (§2.1). Props make the place: a strip of asphalt +
   lane dashes + a walking figure = a road; a dashboard curve + a windscreen
   frame + two hands = a car interior. Rotate the ~3 types across the episode; no
   one location on more than ~3 beats (house-style rule). Most beats still use no
   location at all — the bare field + the dotted systems grid is the ground for
   every data / diagram beat.

**Everything else recurs on purpose** — palette, the two fonts, the progressive
build cadence, the cream field, Lucky's design, one-orange-accent, the
throughline strip, text → Resolve, SFX-per-beat. That recurrence is what keeps
it one channel; the quota above is what keeps each episode its own.

**Pace.** Take the time. A beat is finished when it is production-ready by eye
(§22.5), not when it compiles or when the count is hit. Do not trade quality or
completeness for speed or volume — "minimal / mass-templated / mass-repetitive"
fails the same way "AI slop" does. The creator would rather wait.

**The reference bar is NIF003** — `engine/remotion/src/nif003/v4/beats.tsx`,
creator-endorsed 2026-09-07: every beat is its own composition built from its own
script line and beat-sheet Motion intent (the noun-swap test applies to the
visuals); every element enters progressively on its VO word (`vo.at(...)`),
nothing at frame 0; one concept object at a time (`ConceptObj` / `showHold`),
and finished build-up parks to an edge rather than being deleted; every hold
carries a mechanic (breathe, wobble, a live counter, `Spark` / `Bloom`,
phase-loop rings, `HoldScan`) so a motion event lands ≤3s; the payoff is
oversized (hero numbers 110–300px), vertical-centre, held, and legible shrunk to
~360px; the episode kit is bespoke; locations are props. Text, transitions and
the kinetic "deep text" are added in Resolve from `NIF00X-text-timing.md` /
`NIF00X-sfx-cues.md` — only text that is *part of a prop* (a chip label, a bill
line-item, a chart axis, a stamp on a card) stays in code.

### 22.9 · No forward "next episode" bridge — NIF005 onward (creator, 2026-09-07)

Type C (§16). Amends §9.1's beat list, §13's packaging shape and §15.2's Bridge
gate. The creator's instruction after reviewing NIF004's Step 1: **stop
pre-announcing the next episode.** From Episode 5 on, an episode's closing beats
reference **exactly one other episode, and it is a previous or a sibling
episode, never a future one.**

**Why.** A forward bridge locks a topic in before it has been through intake and
research. NIF003 pre-committed to "Google Maps" on screen, and that constrained
NIF004's whole shape; NIF004's own bridge would have done the same to NIF005.
The binge pull the bridge was for is delivered just as well by pointing *back*
("the last episode was the same trick with your television") or *sideways* to a
related episode — with no scheduling risk and no topic lock-in.

**What changes:**

- **The `bridge` beat is dropped.** §9.1's "B## implication · bridge · CTA"
  becomes "B## implication · CTA". The implication beat carries the single
  backward / related reference, or the CTA beat does.
- **One episode, backward or sideways.** The reference names or clearly evokes
  **one** prior or related episode (a callback motif, "the same shape as the
  [subject] episode"). Not two, not a list, not the whole arc as a montage.
- **§15.2 Bridge gate** is replaced by: *"Closing beats reference exactly one
  previous or related episode; no forward / next-episode tease."*
- **The next episode is still planned** — it lives in `project.json`
  (`plannedNextEpisode`) and the episode-status memory so intake has a starting
  point. It just never appears on screen or in the script.
- **Packaging (§13.5):** the description keeps a "Previous episode: [title]"
  line; it carries no "Next: …" line.

**NIF004 is the last episode with a forward bridge** — B32, teasing Episode 5
(the free-to-play games economy: *"you never pay a rupee for the game, so
somebody else does"*). It was already drafted at Step 1 and the creator supplied
the topic for it. Every episode from NIF005 follows the rule above.

### 22.10 · Motion registers — a named set, picked per beat (creator, 2026-09-09)

Type C. From two AI-explainer reference videos (`demo.mp4` — different looks, one
motion grammar) the creator's direction: **expand the engine's motion
vocabulary — more smoothness, more transition types, more animation — while the
visual identity stays locked per channel.** The workflow is shared across
channels; only the look changes per episode.

The engine now carries **motion registers** — each a reusable wrapper, chosen
per beat, all rendering whatever the channel's locked visual identity is:

| Register | What it is | Lives in | Use |
| --- | --- | --- | --- |
| **Punch** | spring pop-ins on the VO word, draw-on connectors, `Bloom`, hard cuts | the v4 kit (`nif002/v4/`) | **the default** — most NIF beats (data, diagrams, case studies) |
| **Glide** | one continuous camera move + parallax layers + soft focus-pull enter/exit + held float + depth atmosphere | `src/motion/glide.tsx` (`GlideScene` / `GlideIn` / `GlideOut` / `GlideCard` / `Atmosphere`, on top of `src/spatial/`) | **1–2 beats per episode, maximum** — the cold open, the reversal, a "pull back to see the whole system" beat |
| **Doodle** | draw-on / `Boil` quiver / typewriter | `channel2-prototype/src/doodle/` | channel-2, or a NIF "here's the napkin sketch" beat |

Rules:

- **Glide is not the identity** — §3.1 restated for motion. Using it on every
  beat is the §14.2 code-template trap in motion form. Punch stays the workhorse.
- A register is a *motion* choice, never a *look* choice. Glide on a NIF beat is
  still cream + line-art + one orange accent + the two fonts. `GlideScene
  tone="paper"|"ink"` is the only palette hook.
- `SpatialScene`'s new `drift` prop (ambient camera wobble) is the "never a
  frozen frame" floor for Glide — opt-in, a literal no-op everywhere else.
- Before a **new** register touches a real episode, build a standalone motion
  study (`MotionStudyGlide`, `DoodleDemo`) and get the creator's sign-off on
  the feel.
- Monetization: every register is pure code motion, no generated assets — a
  richer motion kit makes the channel *more* defensible (§14.1), not less.

## 23 · Channel programming — pillars, packaging discipline, publish cadence (2026-09-08)

Filed under §16 **Type C** (topic/asset policy, packaging shape, production
cadence). Current → new → why → affected systems → risk → recommendation.

**Current.** This runbook governs how an episode is *built* but is silent on how
the *channel* is programmed. It references "Pillar [A/B/C]" (§8.1, §8.4) and
never defines them — the definitions have been living only in the superseded
`Nothing_Is_Free_Runbook_v3.1.md` (Appendix D) and in each episode's
`project.json`. It has no cadence or publish-slot rule. Its packaging section
(§13) predates any distribution data. Episodes 1–3 shipped to **359 / 69 / 86
impressions** — a cold-start signal problem (CTR + 30-second retention never
cleared the test-pool bar), not a topic problem.

**New, effective immediately.** Adopted from the 90-day content plan
(`NIF_CONTENT_PLAN_Sept-Dec_2026.md`, 2026-09-08), with the creator's cadence
decision applied. That doc is the channel-programming source of truth (slate,
weekly check); this section is the part the build pipeline needs to know.

### 23.1 · The three pillars — canonical definitions

Folded in from v3.1 Appendix D, unchanged in meaning. These are the definitions
§8.1 and §8.4 refer to.

| # | Pillar | The question it asks | Core mechanism |
| --- | --- | --- | --- |
| **A** | **The Price You Actually Paid** | You paid more than you thought — where did it go? | The cost was real and yours, hidden inside a price you *did* pay — a sticker price, a rent, a tax, a menu |
| **B** | **The Free-to-Money Machine** ⭐ | It's free to you. Who's paying? | Genuinely free at point of use; an advertiser or data buyer pays; you are the inventory. **Channel core DNA** |
| **C** | **The Invisible Middleman** | Someone took a cut you never saw. Who? | A transaction you *did* make was silently intermediated; a metered party took a slice |

Shipped so far: **NIF001 = A · NIF002 = B · NIF003 = C** (flagship) **· NIF004 = C.**

**Rotation rule (new):**

- **Never two of the same pillar back to back.** Formalises v3.1's "no pillar
  more than 3 ahead of the thinnest" for a 2/week cadence.
- **Every third episode is a flagship** — bigger topic, brand-name hook, more
  production effort — and a flagship is a **merge of two pillars** (e.g. A×B
  "free hotel breakfast + the loyalty economy"). The merge is where the fresh
  angle lives.
- Pillar tags on the forward slate are **provisional**; each episode's pillar is
  confirmed at Step 0 intake (§8.4) once research is done.

### 23.2 · Packaging discipline — the impressions fix

The lever for episodes 1–3 is packaging, not topic novelty. These sharpen
§13.1, §13.2 and §5.3 — they do not replace them.

| Rule | Requirement | Sharpens |
| --- | --- | --- |
| **Title — the answer stays hidden** | Poses a question the thumbnail cannot answer; not the topic restated. *"Free Apps Don't Sell Your Data. The Truth Is Worse."* not *"Why Free Apps Make Money From Your Data."* | §13.1 |
| **Thumbnail — one object, one contradiction** | One recognisable object + one word or number that contradicts it. Fails if not readable at **120px wide** (phone size). | §13.2 |
| **First 20 seconds** | Open on the concrete contradiction. No channel intro, no "in today's video," no definition. Retention at **0:30** is what gates impressions. | §5.3 — extends "first ten seconds" to the first twenty and ties it to distribution |
| **Chapters + end screen** | Real chapters (§13.4); end screen points to **one previous or sibling** episode, never a forward tease (§22.9). Session time compounds into watch hours faster than new views. | §13.4 |

**Do not change the format on 3 data points. Re-evaluate at 12 uploads.** The
niche typically needs 15–25 uploads before distribution opens up.

**Voice note.** Non-native English narration is not the blocker; flat pacing is.
Fix it in the ElevenLabs delivery — pauses before reveals, faster through setup
(§6.2 tagging) — not by worrying about accent.

### 23.3 · Publish cadence and slots

| Item | Decision |
| --- | --- |
| **Cadence** | **2 uploads per week**, fixed days. Supersedes v3.1 Appendix I's "1/week until episode 8". |
| **Days** | **Monday and Friday.** Creator's decision, 2026-09-08. |
| **Time** | Provisional — late-afternoon US Eastern (≈4:00 PM ET), schedule-and-sleep via YouTube's Scheduler. Creator to confirm the exact slot. |
| **Stability** | Hold the two days unchanged for **at least 8 weeks**. Irregular timing is what stopped returning viewers forming a habit across episodes 1–5. |

The 90-day plan recommended Tuesday + Saturday on upload-volume grounds; the
creator chose Monday + Friday. The Tue/Sat reasoning is preserved in
`NIF_CONTENT_PLAN_Sept-Dec_2026.md` §3 if the slot is ever revisited.

### 23.4 · The back-catalogue retitle pass — open action

Episodes 1–3 sit with near-zero impressions and cost nothing to retry; YouTube
re-tests a video after a packaging change. **Creator action (not automated):**
retitle + re-thumbnail Ep 1–3 against §23.2, once, this week. Open until done.

### 23.5 · The forward slate and the weekly check

`NIF_CONTENT_PLAN_Sept-Dec_2026.md` carries the full **Ep 6–28** slate
(flagships at 6, 9, 12, 15, 18, 21, 24, 27), the reserve bench, and a **weekly
topic + performance check** (Mondays) that appends to `nif-weekly-log.md`.
Episode selection still enters this runbook one at a time at §8 (Step 0 intake)
— the slate is the queue, not a commitment. **Ep 6 = Free Public WiFi** (B×C
flagship); WhatsApp is held to ~Ep 30.

**Affected systems.** §8.1 / §8.4 (pillar now defined), §13.1 / §13.2 / §13.4
(packaging sharpened), §5.3 (cold open), §15.5 (ship gate now also checks the
120px thumbnail test and the hidden-answer title test). v3.1 Appendices D and I
are now fully absorbed here.

**Risk.** Low. No change to the visual system, the pipeline order, or the build
doctrine (§22.8). The cadence is the creator's call; the pillar definitions are
already in use across four episodes.

**Recommendation.** Adopt as written. Close the two provisional items — exact
publish time, and a light pillar re-tag of the slate at the first weekly check.
