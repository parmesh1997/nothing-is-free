# Someone Always Pays — Runbook

The single source of truth. Steps 0–5 and the laws that govern them.

This file contains no episode status, no dated change log, and no history. Where
an episode stands lives in that episode's own `project.json`. Everything this
document replaced is in `archive/2026-09-19-runbook-reset/`.

**A session reads the sections for its step, not the whole file** (§0.1).

---

## 0 · What this is

Someone Always Pays is a code-native documentary explainer channel. Episodes are
written, built, assembled and delivered through a five-step gated pipeline.

**The creator decides at four points, and only four:** the vidIQ research answer,
the angle and runtime, the review-proxy watch, and publish. Between those, each
step runs to its own gates (§12) and stops only when a gate fails or something
costs money, needs a login, or cannot be undone. Nothing runs past a failed gate.

**The channel's promise:** when something looks free or cheap, this channel shows
you who actually paid, by name.

**The sub-niche, in one word: Whodunit.** *Every episode, someone takes your money,
legally. By the end, you know who.* Each episode is a mystery with a crime, suspects,
clues, a red herring and a reveal, and the culprit is named at the end, never assumed
at the start (§4.2).

**The narrator's stance:** polite disbelief. Not angry, not conspiratorial —
quietly unwilling to leave "it's free" as a complete sentence, and a little
amused, every time, that this needs saying out loud. The reveal is always aimed
at whoever is hiding, never at the viewer for not having known.

**The fixed sign-off, verbatim, every episode:** *"Someone always pays. Now you
know who."*

### 0.1 · Reading this file

This file is about 59,000 tokens. A session that reads all of it before starting
work has used a large share of its context on rules it will never apply. So every
session reads **§0, §3, and then only the sections for its step**, which comes to
between 5,500 tokens (Step 2) and 24,000 (Step 3 build):

| Step | Read | Skip |
| --- | --- | --- |
| 0 · Intake | §1, §4.1–4.5, §5.4, §6, §12 (Step 0 block), §14.3 | §2, §7–§11 |
| 1 · Script | §1.1–1.3, §2.5–2.8, §4, §7, §12 (Step 1 block) | §8–§11 |
| 2 · VO | §8, §12 (Step 2 block) | everything else |
| 3 · Build | §2, §9, §11, §12 (Step 3 block) | §6–§8 |
| 3 · Audit | §2.1, §3, §9.5–9.6, §12 (Step 3 block) | everything else |
| 4 · Resolve | §10, §11, §12 (Step 4 block), §13.3 | §4–§9 |
| 5 · Publish and learn | §1.3, §13.3, §14, §12 (Step 5 block) | §2, §7–§11 |

The `nif-sec-*` skills (§13.6) already paste in only an agent's own sections. A
fresh session that is handed this whole file follows the same table and does not
read it again later in the session. The rest of the token rules are in §5.4.

---

## 1 · The channel

### 1.1 · Positioning

**The Money Whodunit: hidden economics, from the payer's point of view, told as a
mystery.**

The mystery is the engine and the payer's point of view is the lane. An explainer
keeps *why* open, and the viewer guesses it before clicking. A whodunit keeps *who*
open, and that can't be guessed, only revealed. **The popular answer to a topic (what
other channels say) is this channel's first suspect, and it gets cleared on screen.**
That is why a viewer who has already seen the explainers still has a reason to watch
ours (§6.2.1).

**The whodunit is a transfer, not a copy.** A proven format (the mystery) moved into
a market that has never had it (everyday prices). A saturated *topic* is fine: its
crowd supplies the red herring. A saturated *angle* is not: if other channels already
tell a topic as a mystery, we'd be a copy, and the topic is dropped (§6.2.1 row 11).

**One viewer, one format, every upload.** YouTube estimates who a video is for before
showing it, partly from how the channel's earlier viewers responded. So from episode
10, every upload is a case for the same viewer: the person paying. A one-off in another
format blurs that signal for every episode after it.

The distinction is the whole channel. The saturated lane is owner POV — "so you
want to own X, here's every cost that kills your margin." The lane this channel
owns is payer POV: the character is the person who pays, and the question is
always *where did my money actually go*.

Every episode must pass this test: **is the viewer the one paying?** If the
episode is written for someone considering buying the business, it is in the
wrong lane and gets rewritten before Step 1 ends.

### 1.2 · Formats

One format, the case (§4.2), and three kinds of case. **Every one of them runs on
a history spine**: the suspects' alibis are told as stories in time, with real people
making real decisions, the way Oversimplified tells a war. The economics is the clue
the story leaves behind.

| Case type | The crime | Example |
| --- | --- | --- |
| **The bait** | Something is free or cheap, and someone else is paying for it. Who? | Your free game was paid for by one stranger |
| **The fee** | One payment, and a cut of it is gone. Who took it? | Who took $6 from your airport sandwich? |
| **The rule** | A decision everyone lives under, and who it quietly pays | The rule that set the price of cinema popcorn |

"How is a free or cheap thing funded" is not a separate format. It is a bait case.

**An episode earns its history by ending somewhere the viewer's own money is.**
A story that never arrives at the viewer's wallet is a history video, and this is
not a history channel.

The history spine is what gives the cases a bottomless well. Every story
brings its own characters, hook and twist, so it never tires the viewer the way a
list or a countdown does.

**Playlists are separate.** How episodes are grouped on the channel is a
packaging decision the creator makes in YouTube, not a constraint on what gets
made. A format is what the episode *is*; a playlist is where it ends up.

### 1.3 · The two metrics

Subscribers and view counts are not tracked. Two numbers are, measured at seven
days per video:

| Metric | Gate |
| --- | --- |
| **Impressions click-through rate** | **≥ 6%** |
| **Average percentage viewed** | **≥ 45%** |

Everything in this runbook exists to move those two numbers. A packaging or
pacing decision that cannot be argued to move one of them does not go in.

**Diagnostics are tracked but not gated.** They explain *why* one of the two numbers
moved, and Step 5 (§14) records them for every episode:

| Diagnostic | Where it is read | What it points at |
| --- | --- | --- |
| Average view duration | Studio → Engagement | Runtime vs attention (§1.4) |
| % still watching at 0:30 | Studio → Audience retention → key moments | The cold open (§4.1) |
| The top dips and spikes, with timestamps | Same card, mapped to beats by `dip-map.mjs` | Which beat lost people, and which device held them |
| Traffic sources (Browse, Suggested, Search) | Studio → Reach | Packaging vs topic vs keyword |
| vidIQ content score /100 and its Review issues | vidIQ Optimize tab | Metadata the channel keeps getting wrong |

**The test happens in the first 24–48 hours.** Every video is shown to a seed
audience regardless of channel size, and what that audience does decides whether
distribution expands. A video that does not perform in the first day or two
rarely recovers. Small channels get only a few hundred impressions in that
window, so results swing hard between episodes — which means a single weak
episode is noise, and three in a row is a signal.

**Satisfaction outranks watch time.** The platform optimises for whether the
viewer left satisfied, not for how long they stayed. Leaving because the answer
arrived is a good outcome; leaving because the episode stalled is not.

### 1.4 · Standing constraints

- **No paid promotion.** Promoted views do not click the next video, and they
  poison the signal that decides whether YouTube expands a test.
- **Runtime is whatever the material honestly carries.** No target, no floor, no
  ceiling. If a topic genuinely supports thirty or forty minutes, it runs that
  long; if it says everything it has in eleven, it ends at eleven. Never pad to
  reach a number and never cut something that earns its place.

  **Length is earned by the previous episode's retention.** Going longer than the
  last episode requires the last episode to have held ≥45% (§1.3), as recorded
  in its `10_review/review.md` (§14). A
  thirty-minute video at 20% is worth less than a thirteen-minute video at 45%,
  to the viewer and to the algorithm, and the channel's current weak number is
  retention — so length is a reward for holding attention, not a bid for it.

  **The case format starts at about 8 minutes (1,400 words)** and grows only under
  the rule above. It also keeps a solo production finishable: the build cost grows
  with the number of setups (§9.0), and a shorter case needs fewer.
- **Evergreen only.** No news pegs.
- **Everything is 1920×1080, 24fps, end to end.** Remotion and Blender render at
  1080p (§9.4), the Resolve timeline is 1080p (§10.4) and the upload is 1080p
  (§10.10). Nothing is upscaled at any point. Real archival documents enter at
  their native size and are scaled down (§9.9).
- **A fixed slot, never missed.** The public promise is **one case a week, on the same
  day at the same time**. Two a week stays the target: the second slot opens once four
  episodes in a row have shipped on time, with Step 3's agent time (recorded in
  `project.json`, §9.0) inside the production plan's budget. The slot is kept for
  the audience, who learn the day and come back on it. YouTube found no consistent
  penalty for gaps between uploads, but a promise the channel breaks costs more than a
  modest one it keeps.

  **What flexes is scope, never a gate.** Every gate in §12 holds at any cadence —
  the pre-VO lock, the foot lock, the stills audit, the proxy watch, the delivery
  QC. When an episode cannot make the week, the answer is fewer shots, a returning
  location or a shorter runtime, and never a skipped audit or an unwatched proxy.

  The cadence is reached by the library, not by working faster: Step 3 records
  agent minutes per finished second into `project.json`, and per-episode cost is
  expected to fall as locations, shot templates and props accumulate. Measured on
  the pilot: 10–12 agent hours for thirteen minutes, and 6–8 once the library
  carries most of a build.

---

## 2 · The visual system — The Scene

Every episode happens in real places, drawn. The characters walk into the airport,
the deli, the factory or the patent office the episode is about, and the money
is followed there. The animation is limited: long holds where only the head, eyes,
mouth and hands move.

**The world is drawn, not rendered.** Blender builds the places, but what comes out
is a drawing: an ink outline on everything, flat fill plus one shade step, and no
smooth falloff anywhere. The moment a surface gets a gradient across it, the frame
reads as a 3D render and the channel looks like a game. This was tested both ways
(§9.8).

**The four references, and what each one is for:**

| | Taken from them |
| --- | --- |
| **Oversimplified** | The storytelling — history told as a story, with jokes |
| **Crayon Capital** | The light. One practical in frame, a pool with an edge, everything else cold |
| **Marker & Market** | The shot grammar — a wide establishing, then a medium, then a close, each on a new axis |
| The diorama channels | Characters standing in a world that occludes them and lights them, not on top of a picture |

**What none of them has, and what makes an episode ours:**

1. **The payer's point of view.** They narrate *about* people. We stand with the
   person paying (§1.1).
2. **Accent is money, and nothing else is accent** (§2.2). A viewer learns in one
   episode that orange means someone's money moved. No reference channel has a
   colour rule.
3. **The reversal** (§2.6) — the set draining to ink, once an episode.
4. **Real archival documents**, sourced, on screen (§9.9). They draw everything, so
   a real audit sheet is a texture none of them can use.

Copying the first four and skipping the second four produces a fourth-rate version
of a channel that already exists.

### 2.1 · The one-drawing rule

The failure this system exists to prevent is **a character pasted onto a
background**. A viewer reads a scene as one world only when the set and the
character obey the same drawing rules. Every frame passes all of these:

| Rule | Spec |
| --- | --- |
| **Same line** | The set's Line Art and the character's outline share one ink colour and one weight at the same distance. A 3 px character on a 1 px set is two drawings |
| **Same shading** | Both are flat fill plus one cel shadow band. Never gradients on one and flat colour on the other |
| **Same light** | The character takes the shot's light: an ambient tint, a shadow band on the side away from the key light, and a rim on the side toward it. The values come from the shot's camera JSON (§9.8), never by eye |
| **Same ground** | The character is lit by the room, through the **same two-tone chain the set uses** — so a figure inside a pool of light reads lit and a figure outside it drops to the shade tone, exactly like the floor it stands on. A character drawn at one brightness everywhere is the single loudest "pasted on" signal there is (§9.8) |
| **Light is a shape** | Every location lights itself from practicals you can see in frame. What a light reaches **is** the lit shape, and what it does not reach goes cold. A light that covers the whole set is the same as no light at all (§9.8) |
| **Grounded** | A contact shadow under every foot and every object that touches a surface. Planted feet lock to the floor at ≤1 px (§9.8) |
| **Same focus** | When the plate is out of focus, the character is blurred by the same amount. **The blur is not Blender's** — see §9.8 |
| **Same motion** | Camera motion blur applies to the plate and the character together |
| **Occlusion** | Set pieces may pass in front of characters. Blender renders a foreground matte and the character sits between the plate and the matte (§9.8) |
| **Same grade** | One show grade over every layer (§10.9) |

### 2.2 · The palette

Two tiers.

**The channel constants** are the same in every episode:

| Role | Hex | Use |
| --- | --- | --- |
| Ink | `#1A1A18` | Outline on sets and characters, type, the reversal |
| **Accent** | **`#E24D28`** | Money and the one key value per frame, the progress rule, Lucky's accent |
| Card white | `#FDFBF5` | Signs, documents and paper props inside the world |
| Shadow | `#1A1A18` at 14–25% | Contact shadows |
| Progress rule | `#E24D28`, 10 px, along the bottom | 0% at 0:00 to 100% at the end, every frame |

**The location palette** is set per location. It is a warm, full-colour palette of
five to seven hues, written into that location's build file
(`video-os/library/locations/<name>/`). No location uses the accent hue for
anything except money. The cream paper (`#F6F2E7`) is no longer the default field.
It survives only where the story is actually on paper, such as a desk or a document.

**One accent element per frame.** The progress rule does not count.

**The light decides the mood, not a fixed field.** Every shot names its light in
`shots.json`, and the same location looks different at different times:

| `light` | Key | Fill and ambient | Use |
| --- | --- | --- | --- |
| `day` | Bright, neutral-warm sun | Soft sky fill, high overall brightness | The default. Outdoors, sunlit interiors |
| `golden` | Low, warm orange | Long shadows, warm ambient | Endings, nostalgia, the past remembered |
| `night` | Warm practicals only (lamps, screens, signs) | Blue ambient, lifted just enough to read the ink | Late, alone, the moment somebody hides something |
| `interior` | The room's own practicals | Neutral ambient | Offices, shops, factories |
| `archive` | Soft, even | Slightly desaturated, warm paper tint | History scenes set before living memory |

Blender builds each light as a preset in `lib25d.py`. The camera JSON carries it to
the cast (§9.8), and Resolve's location balance matches it (§10.9). A dark scene
is never a black field: the ink line must still read on it.

**The preset is the mood. The practicals are the picture.** A preset alone lights
everything evenly, which is how the pilot's sets ended up looking like diagrams of
rooms. On top of the preset, every shot names the lights that are physically in it —
a pendant, a lamp, a shop fascia, a screen — and the sun comes down or off so those
practicals decide the frame. Because the toon material steps rather than fades
(§9.8), **what a practical reaches is the lit shape and what it does not reach goes
cold**. That edge is the whole look, and it is why the light has to be built shot by
shot rather than set once per location.

### 2.3 · The tiers

| Tier | What it is | Share (§9.7) |
| --- | --- | --- |
| **L2 · Painted plate** | A Blender still from a kit angle (EEVEE toon shading plus Grease Pencil Line Art), in layers, with the cast on measured marks and the camera moved in Remotion (§9.8.1) | ~50% |
| **L1 · Drawn 2D** | A drawn set in Remotion (SVG), with the cast rig in it: history, the case devices | ~35% |
| **In-world insert** | A graphic shown inside the world (§2.8) | ~12% |
| **L3 · Moving 3D** | A Blender camera move, 5–10 s: the cold open's one moving shot, or the diorama orbit (§9.8.3). **At most two per episode.** Characters in it are still the 2D rig, placed per frame from the shot's anchors; there is no 3D Lucky until a modelled rig exists | ≤3% |

**Every frame has three planes**: background (the set), midground (the counter,
the board, the furniture) and foreground (the character, the prop in hand, the
type). A frame with fewer is a gate failure. On a staged shot the foreground plane
is something **cut off by the frame edge**, not merely the nearest object (§2.4).

### 2.4 · Locations

**A location is built once and shot many times.**

- Every location lives in `video-os/library/locations/<name>/`: its build function,
  its palette, the anchors it exports, and a contact sheet of every angle used,
  with the episode that used it.
- The reference implementation is the pilot module in
  `engine/remotion/lab/scene-pilot-25d-b00/blender/`. It has three files: `lib25d.py`
  (the shared layer), `locations.py` (`build_concourse`, `build_deli`) and
  `shots_b00.py` (one camera block per shot). The first episode build promotes it
  into the library.
- **An episode builds at most two new locations.** More than that is a rebuild,
  not an episode.
- **A returning location comes back from a new angle.** No camera angle is reused
  across episodes (§2.7).
- **Every location has ambient life.** Something always moves: a fan, a flap board,
  a jet taxiing, steam, a pendant swaying. No shot holds dead (§3 law 11).
- **A close-up on a small prop inside a location is the most expensive shot**,
  because the geometry has to hold at one metre. Plan it as a 2D insert wherever
  the story allows.
- **Every location declares its own practicals** — the lights that are physically in
  it, and where they hang. Hung at ceiling height their pools merge and the floor
  goes flat; hung low they have edges (§9.8). This is part of the location, not part
  of the shot, and it is checked on the contact sheet like the anchors are.
- **Geometry is built to be outlined.** The ink draws the silhouette, so a box has no
  silhouette: chairs get spindles, tables get knuckles, windows get mullions, shelves
  get individual books. A location made of plain boxes will look cheap no matter how
  it is lit, and no location passes its contact sheet without this.

**Every staged shot carries three things**, and all three are free:

| | |
| --- | --- |
| **A foreground crop** | Something big, near the lens and cut off by the frame edge — a bench, a counter, a doorframe, a shoulder. Nothing buys depth this cheaply |
| **People at more than one depth** | A public place with one person in it reads as a model of a public place. Extras are the same rig with randomised parameters on the location's crowd lanes, and they cost nothing in Blender (§9.8) |
| **One committed colour temperature** | Warm or cold, and the other one only where a second light source justifies it. A neutral frame is an unlit frame |

### 2.5 · The cast

**Lucky is the recurring character**: the viewer's stand-in, the person paying.
She carries the channel accent, and her mouth is driven by Rhubarb from the
measured VO (§9.8).

**Everyone is built from Lucky's rig.** It is one rig with a handful of
parameters, never a second rig. The face and the outfit cut never change. Only
these change:

| Parameter | Values |
| --- | --- |
| `outfit` | Any colour from the location palette. Never the accent, which is Lucky's |
| `hair` | `lucky` (hers only) · `none` (men) · an alternative style (other women) |
| `hairColor` | A natural hair colour |
| `strands` | Coloured streaks, for a Gen Z character (e.g. pink over black) |
| `scale` | 1.0 for adults · about 0.8 for children |
| `prop` | Anything the role or era needs: a bag, a folder, an apron, a top hat, a bonnet, a ledger, a quill. Props are dynamic and built on demand into `library/props/`, as many as the story needs. They signal a role or an era, never a new identity |

```json
{ "outfit": "#3B6FD4", "hair": "none" }
{ "outfit": "#2E9E6B", "hair": "bob", "hairColor": "#5A3A22" }
{ "outfit": "#7A4FD0", "hair": "long", "hairColor": "#1A1A18", "strands": "#FF6FB5" }
```

Historical figures are the same rig. Their era comes from the prop and the set,
never from a new face.

**The look is Crayon Capital and Oversimplified.**
- **The body:** a big round head on a small bean body with simple stick limbs, about
  2.5 heads tall. Crayon Capital's "big finance, drawn small".
- **The face:** Oversimplified's. Dot eyes, simple brows, a small mouth, no nose, a
  heavy ink outline and flat colour.
- **Identity:** it comes from hair, outfit colour and props. Oversimplified tells
  kings, bankers and generals apart with a hat and a moustache, never with a new face.
- **The comedy is in the acting:** holds, the eyes, the brows, and a prop in hand.

**The rig itself is set by the cast pilot**
(stills only) and lives in `video-os/library/cast/`. No episode is built on the
scene system until that pilot is approved.

**The cast is drawn in Remotion and stays there.** That is the architecture, and
the reason is the crowd: a populated location costs nothing in Blender only
because the extras are the same rig with randomised parameters, drawn on top of
the plate. Move the cast into Blender and the crowd has to move with it, and the
cheapest win in the system is gone.

**The exception, per shot.** A character can be put *inside* a Blender shot as a
drawing on a camera-facing plane parented to the walk proxy — the Remotion rig
rendered to a transparent PNG sequence and used as an image texture. It buys three
things nothing else buys: the set occludes the character with no matte pass, the
character casts a real shadow shaped by its own silhouette, and — because the plane
is shaded through the set's own two-tone chain rather than drawn as flat emission —
**the character dims and warms with the room it is standing in** (§2.1, same ground).
It costs the free crowd and it still cannot turn. **One or two shots an episode,
never the default.** Built and measured in `engine/remotion/lab/parented-plane/` and
`lab/look-blend/`, which carry the settings that make it work — they are not
guessable.

**Limited animation is the method.** Holds, blinks, head turns, hand gestures and
the mouth carry the acting. A full walk is used only when a character crosses a
location. It is the most expensive motion and the most error-prone, and a slide
with no steps reads as skating.

**Who talks.** The narrator's voice carries the episode. Lucky speaks to camera,
lip-synced, in the cold open and at the reversal. Other characters mime and react.
There is no second voice.

**Every figure touches things.** A figure standing beside a prop is a diagram. A
figure with a hand on the prop is a scene.

**No photorealism, and no chromatic aberration.** A photoreal element beside a
drawn cast reads as two different films and breaks the one-drawing rule (§2.1).

### 2.6 · The reversal

Once per episode, the location drains to ink `#1A1A18` over 20 frames. The set's
colour goes and its Line Art stays, redrawn in the accent. The characters drop to
silhouette. The progress rule stays and the music stops. The reversal line types
on in mono with a block cursor, and Lucky turns to camera. Then the signature
words return, typeset and silent.

### 2.7 · The anti-repetition law

**No two episodes share a camera angle or a shot arrangement.** The constants
are:
- the cast rig
- the channel palette
- the one-drawing rule
- the progress rule
- the sign-off

A location may return, but its angle, arrangement, props and action are
rebuilt. A reused shot template is re-composed with a new location, a new angle
and a new action. It is never re-placed.

### 2.8 · In-world inserts

Graphics are shown inside the world, never on a blank field. Each episode names
the inserts it uses at Step 1, and the mix changes between episodes (§4.8):

| Insert | Lives in the world as |
| --- | --- |
| **Kinetic type** | A sign, a price board, a menu, a receipt, a phone screen. Or type across the frame on a held shot |
| **Map / route** | A map on a wall, a departures board, a route drawn on a napkin |
| **Isometric** | A model on a table or a diorama the camera pushes into. Or a 3D hero shot |
| **Archival case file** | A real document in a character's hand, pinned to a wall or lying on a desk (§9.9) |
| **Numbers** | A price tag, a till display, a chalkboard, a stamped receipt |

**The case devices.** Each episode uses **three of these seven, never the same three
twice in a row**, and stages each one differently every time (§4.8):

| Device | Lives in the world as |
| --- | --- |
| **The money meter** | A running count of what was taken: a till screen, a scoreboard, a receipt printing. Accent colour, because it is money |
| **The lineup** | The suspects side by side: a police lineup, a dinner table, a courtroom bench, a jury box |
| **Suspect cards** | A freeze frame with a name, a role and a year, on a real document when one exists |
| **The evidence board** | Red string, photos, the receipt pinned in the middle |
| **The reconstruction overlay** | The cold open replayed with the hidden hands, cuts and arrows drawn over it. It reuses the cold open's own compositions plus one overlay layer, and is never re-staged |
| **Cleared / guilty stamps** | A rubber stamp landing on a suspect card, with its sound |
| **The challenge** | Just before the reveal the picture freezes on the lineup and the narrator hands the case over: *"Every suspect, every alibi. You know what we know. Who took it?"* Two seconds of held silence, then the reveal. It is the mystery writer's old challenge to the reader, and it is the question the pinned comment asks (§14.1) |

Type on a 3D surface rides that surface through the camera move, through the
shot's anchors (§9.8). A foreground set piece never crosses typeset text unless
the occlusion matte covers it.

---

## 3 · The anti-slop laws

These are checkable, and they are checked. A frame that breaks one does not ship.

1. **Nothing is perfectly aligned.** Signs hang slightly off level, props sit at
   angles, papers lie crooked on a desk. Perfect grids read as generated.
2. **Shot lengths vary between 2 and 9 seconds.** Metronomic pacing is the
   loudest tell after text.
3. **Real specifics on screen.** Real dates, real figures, real document names,
   real company names. Never a generic placeholder.
4. **Zero generated text. Ever.** Every word on screen is typeset by us or is a
   real scan. This applies to newspapers, documents, signage, labels and
   backgrounds. No exceptions — garbled text is the single most recognisable AI
   artefact there is.
5. **Specific sound design.** The sound of the place and the thing: a till
   drawer, a boarding chime, a stamp thump, a coffee machine. Never a generic
   whoosh library.
6. **Object continuity.** The same object persists across beats and moves. A
   series of unrelated cards is a slideshow; one object being followed is a film.
7. **A visible point of view.** At least one dry aside per episode — a small
   deadpan line, never at the viewer's expense.
8. **The camera behaves like a camera.** It settles, slightly overshoots, carries
   weight. Linear motion is banned.
9. **One grade over everything.** Blender plates, 2D sets, the cast, inserts and
   archival all sit under the same show grade, so the episode is one world
   (§2.1, §10.9).
10. **Deliberate asymmetry.** Centred compositions are the exception, not the
    default.
11. **Nothing holds still, and nothing arrives all at once.** A frame that is
    finished and then simply sits there is a dead frame. Two separate rules,
    both checkable:
    - **No held state.** No composition may sit visually unchanged for more
      than about three seconds. There is always something alive — a line still
      drawing, a counter still ticking, a character blinking, a fan turning, a
      jet taxiing past the window. A 10 or 20 second static hold does not ship.
    - **Progressive arrival.** Elements enter one at a time, in the order the
      narration needs them, from left and right rather than appearing
      pre-assembled. The build is driven by the beat and the script, never
      dumped in on frame one. If the viewer can see the whole answer before the
      line that explains it, the beat has spoiled itself.

---
12. **No AI imagery, and AI never replaces a decision.** No AI-generated video,
    image, still, texture or lettering appears in any episode, at any size.
    Claude writes code and drafts; a person directs every choice. "Replace" is
    the word the platform's policy turns on — a tool that speeds up work a
    person directed is fine, a pipeline where no person made a decision is not.
    Every episode must contain choices only a human would have made, visible on
    screen.
13. **Make the effort visible.** The channels that were deleted had no camera
    moves, no transitions, and the same background every episode. The viewer
    should be able to see that somebody stayed up too late because they cared.
    Effort that cannot be seen does not count.

## 4 · The format doctrine

**One episode = one concrete object carrying one abstract mechanism, structured
as a whodunit: the withheld answer is *who*.**

### 4.1 · The cold open

**The episode opens on a story, not on the channel.** The first 15 to 30 seconds
are a small, funny, true story played out in a location. It follows the
Oversimplified method: before the history starts, a character wants something,
runs into the weird thing, and the moment lands on a laugh. The story's last line
is the specific, weird, verifiable fact, and it opens the loop.

**Nothing comes before the story.** No card, no logo, no title in the first
seconds. The first frame is already inside the location.

**The title echoes within five seconds.** The object in the title is in the first
image, and the title's key words are heard or seen in the world within the first 15
seconds. A viewer who clicked for popcorn and sees a lobby with no popcorn in it
wonders if they are in the wrong video, and leaves.

An example, for an airport food episode:

> Lucky, starving at gate B12, finds the deli. The sandwich is $8.99. She checks
> her phone: the same sandwich in town is $7.99. She looks at the sandwich. She
> looks at us. A man behind her in a blue outfit pays without looking up.
> *"Airports are allowed to charge you more. Just not that much more. There's a
> rule. And that dollar broke it."*

**The story's rules:**

- **It is true.** The situation may be staged (Lucky at a gate), but every fact in
  it is real and sourced. The joke carries the real fact. A fact invented for the
  joke is a lie about the work.
- **The payer is in it.** Lucky, or a cast member, is the one paying (§1.1).
- **At least one laugh lands in the picture**, not only in the narration. It
  passes the sound-off test (§4.6).
- **15–30 seconds, never more.** Anything past 30 seconds is the episode, not
  the hook.
- Never "today we'll learn about X."

**Then the title's question lands.** There is no channel card, no logo and no
channel name at the start of an episode. On a beat of silence at the end of the
story, the narrator asks the title's question: *"So why is airport food so
expensive?"* The same words land in the world — on a sign, a receipt, a tray
liner, a screen in the location — never as floating type on a blank field. That
is the promise. It is **stated** here and **not answered** until the first
payoff. Then the history begins.

How the question lands changes every episode, because the location it lands in
does (§4.8).

### 4.2 · The spine

| Position | Movement | What happens |
| --- | --- | --- |
| 0:00–0:30 | **The Crime** | The story (§4.1): Lucky pays, and something small and wrong is visible in the picture. It ends on the weird fact |
| ~0:15–0:35 | | The title's question, landing in the world. The promise is stated, not answered |
| by ~10% | **The Case** | What was taken, from how many people, every year: one sourced number. The promise restated as *who* |
| ~10–25% | **The Suspects** | Three to five parties who each could have taken it, introduced. **The first is the popular answer** (§6.2.1) |
| by ~15% | | The mechanism starts, as the first alibi. **No stat block before this point** |
| ~25–60% | **The Alibis** | Each suspect's story as history: the first person, the decision, the date. Clues accumulate. Each alibi ends on a question the next answers |
| by ~40% | | **First payoff: the red herring is cleared**, one surprising fact delivered *and closed* |
| ~60–80% | **The Reconstruction** | The crime replayed with what we now know drawn over it. A new question opens: if not them, then who? |
| ~85% | **The Reveal** | The culprit, by name. Often a rule, a structure or another customer. This is the reversal (§2.6), and it recontextualises the first payoff |
| close | **The Close** | Answers the cold open's question in the cold open's own words, one "here's what you'll notice now" line (never advice), then the sign-off |

**The mix is enforced here, not hoped for (§4.6):** the Crime, Case, Suspects,
Reconstruction and Reveal are story. The mechanism lives inside the Alibis.

### 4.3 · The front-loading law

**No more than four beats may pass before the mechanism starts.** Statistics,
context and fairness-holds are earned *after* the viewer is invested, never
before. A run of more than three consecutive stat beats anywhere in the episode
is a gate failure.

This is the single most common failure mode in this channel's history and it is
worth more than any packaging change.

### 4.4 · Beat loops

Every beat is a mini-loop: open question → partial answer → new question. A beat
that resolves cleanly and opens nothing is a dead end and gets rewritten or cut.

### 4.5 · The why test

Curiosity is the product. Every decision in this pipeline answers a **why**
about the person on the other side, and a decision that cannot answer its why
does not ship.

| Asked of | The question | Fails when |
| --- | --- | --- |
| The title and thumbnail | **Why would a stranger click this instead of scrolling?** | The answer is "because it is about printer ink." That is a subject, not a reason |
| The topic | **Why would someone who already watched the other videos on this watch ours?** | The answer is "ours is better made." It has to be *their answer is our red herring* (§6.2.1) |
| The cold open | **Why would they still be here at the title's question?** | The story was funny but opened nothing they need closed |
| Every beat | **Why does the viewer want the next beat?** | The beat answered everything it raised. See §4.4 |
| The payoff | **Why is this surprising?** | It confirms what they already assumed |
| The reversal | **Why does this change the earlier answer?** | It adds a fact instead of re-framing one |
| The close | **Why is their money or behaviour different now?** | The episode was interesting but changed nothing |

The test is written down, not felt. At Step 1 the answer to each row goes in
`beats.md`. A
row answered with a restatement of the topic is a failure, because the topic is
never the reason anybody watches.

### 4.6 · Show it with the object, never define it

**The mix is 30% education, 70% entertainment, and it is measured.** Every beat in
`beats.md` carries a mode: STORY, COMEDY or MECHANISM. MECHANISM stays at or under
35% of runtime, and no run of MECHANISM beats lasts longer than 45 seconds without a
story cut (§12.1). This is a cinematic
documentary, not a lecture. The target is bingeability: somebody finishes this
one and wants the next one. An episode that teaches perfectly and entertains
nobody has failed at the only job that moves §1.3's two numbers.

**The method: the abstraction is acted out by the object, never defined in
words.** The reference is a channel that explains inflation by putting a banana
in a monkey's hand and letting the audience watch its value change. Nobody says
"inflation is a sustained rise in the general price level." Nobody has to.

Applied here:

| Don't | Do |
| --- | --- |
| Define patent exhaustion | Show the cartridge changing hands and the seller's claim on it not travelling with it |
| Say "the razor and blades model" | Show the five dollar handle drop below the one dollar handle when the patent bar runs out |
| Explain price per litre | Walk a shelf of vessels and stop at the one that beat all of them |
| State that a chip authenticates | Show the same part that counts the ink refuse a cartridge |

**Assume the viewer knows nothing and is not stupid.** Those are different
things. Never define a term when the object can demonstrate it, and never
explain a thing twice because the first explanation was abstract.

**Test per beat:** could a viewer with the sound off follow roughly what is
happening? If the beat only works as narration over decoration, the object is
not carrying it and the beat gets rebuilt.

### 4.7 · Section cards

**After each mini-payoff, a card names what comes next.** A loop closes, the card
lands, the next loop opens. It gives the viewer a beat to breathe and a reason to
stay — they can see the video is going somewhere.

- **One to three words**, naming the next thing — never "Step 4", never a number
- It is **the next question, compressed**, not a chapter label
- It lands **after** the payoff, never before
- It lives in the world, on a sign, a stamp, a label or a door. Never floating type

| Don't | Do |
| --- | --- |
| "Step 3: Distribution" | "Who Ships It" |
| "The Chip" | "Why It Says No" |
| "Conclusion" | "What You Paid For" |

**The entrance varies per episode.** The card is a recurring device, and a
recurring device with a fixed animation is how a channel starts looking
mass-produced. Pick its entrance once per episode and keep it consistent within
that episode — then change it next time.

### 4.8 · The uniqueness quota

**Every episode owes two to three net-new visible mechanisms** — a prop, a
diagram, a transition, a way of moving, something the channel has not done
before. They are named at Step 1 and built at Step 3.

This is a gate, not an aspiration. The channel's whole promise is that each
episode is its own world. Reusing the same components in the same arrangement is
the cheapest possible tell that it is a template with the nouns swapped, and it
is the single failure the creator has flagged most often.

The constants are the cast rig, the channel palette, the accent, the progress
rule, the sign-off and the case spine (§4.2). The case devices rotate: three of seven
per episode, never the same three twice in a row (§2.8). A location may return, but only
from a new angle. **Everything else is rebuilt.**

**This is a monetisation rule, not a taste rule.** The platform judges a channel
as a single organism, not video by video — channels with hundreds of thousands
of subscribers have been demonetised across their whole catalogue because the
*pattern* across uploads read as machine-made, not because any one video did.
Sameness between episodes is therefore a risk to the channel, and varying
structure matters as much as varying content.

---

## 5 · The pipeline

```
STEP 0   INTAKE          → 0a postmortem of the last two episodes · 0b evidence
                            and keywords in vidIQ · 0c the case test · 0d topic
                            · 0e shape. Creator decides
STEP 1   SCRIPT + BEATS  → and nothing else. Full stop. Starts from the lessons
   ↓     ── PRE-VO LOCK: script, citations, runtime, cold open all final ──
STEP 2   VO + RECONCILE  → ElevenLabs per beat, whisper timing, real durations,
                            Rhubarb mouth cues, chapters
STEP 3   BUILD           → 3a library · 3b plates · 3c scenes. Audited on stills,
                            proxy machine-checked and watched BEFORE any full render
STEP 4   RESOLVE         → assembly, grade, audio, delivery
STEP 5   PUBLISH + LEARN → pre-publish vidIQ check, upload, 48-hour and 7-day
                            review → the lessons the next Step 0 starts from
   ↺     back to STEP 0

Packaging runs through the steps rather than being one. Claude recommends it
first: the title and a thumbnail concept at Step 0, and the thumbnail built at
Step 3 from the episode's own set and cast. The creator then checks it in vidIQ
and has the final say (§6.6, §9.10, §14.1).
```

**Nothing is built against estimated durations.** Every frame range downstream of
Step 2 depends on measured audio. This is why the pipeline is shaped this way.

### 5.1 · Folder contract

```
video-os/episodes/NIF0NN/
  project.json          ← intake, approvals, and where this episode stands
  00_intake/            ← postmortem.md, evidence.md, vidiq-prompt.md, vidiq-answer.md (§6)
  01_script/            ← script.md, beats.md, shots.json (the shot list, §7.5)
  02_narration/         ← B00.mp3 … B##.mp3
  03_transcript/        ← transcript.json, timing.json, reconcile.json, chapters.md
    mouth/              ← B##.json, Rhubarb mouth cues for Lucky's beats
  04_archival/          ← real documents only, each with its ledger entry (§9.9)
  05_layers/            ← Blender plates and mattes, Remotion scene passes (ProRes 4444, 1080p)
    cams/               ← cam-<shot>.json per 2.5D and 3D shot (§9.8)
  06_audio/             ← stems, mix-final.mjs, audio notes
  07_packaging/         ← thumbnail stills and the title recommendation (§9.10)
  08_conform/           ← stills-audit.json, sfx cues, text timing, resolve notes
  09_master/            ← the upload file
  10_review/            ← review.md at 48 hours and 7 days (§14)
```

Three library files carry what one episode teaches the next. Each is short on
purpose, because every Step 0 and Step 1 reads it:

| File | Holds | Cap |
| --- | --- | --- |
| `video-os/library/shipped.md` | One line per published episode: code, title, date, CTR, APV | — |
| `video-os/library/lessons.md` | The standing "do not repeat" list (§14.3) | 40 lines |
| `video-os/library/INDEX.md` | One line per location, angle used, cast parameter, template and prop, with the episode that used it | — |

### 5.2 · Model routing

Each step runs in its own context, with its model pinned. The route is one of
two, and both work:

- **An agent.** Six agents live in `D:\YT\.claude\agents\`, each with its model
  and effort set in its own file and its own runbook section loaded at start
  (§13.6). A small orchestrator session delegates a step to its agent, so the
  heavy context never lands in the orchestrator.
- **A fresh session**, started with the handoff prompt from §5.3.

**Session length costs more than model tier** — this habit saves more than any
downgrade.

| Step | Agent | Model | Why |
| --- | --- | --- | --- |
| 0a–0b · Collect (browser) | a subagent of `nif-researcher` | Sonnet 5, medium | Reading Studio and vidIQ pages is mechanical, and page text is bulky. It returns the fixed tables of §6.1–6.2 and nothing else |
| 0c–0e · Case test and decide | `nif-researcher` | Opus 5.5, medium | Judgment-heavy, short. It works only from the collected tables; the cold-answer test runs in a separate Haiku call on purpose |
| 1 · Script | `nif-scriptwriter` | **Opus 5.5, high** | Highest leverage in the pipeline. Retention is written here, not edited in later |
| 2 · VO + reconcile | `nif-voice` | Haiku 4.5 (Sonnet 5, low, if it stumbles) | Four fixed commands and a check of their output |
| 3a · Library | `nif-builder` | **Opus 5.5, high** | A new location, a new cast parameter or a new shot template. Built once, reused for every episode after |
| 3a · Angle kits | `nif-builder` | Sonnet 5, high | Twelve angles per new location, by script, plus one contact-sheet check |
| 3b · Kit shots | `nif-builder` | Sonnet 5, medium | Picking angles and marks, running `place-check`. It is data entry against measured numbers. Batches of eight (§9.0) |
| 3b · Hero shots, 3c · Scenes | `nif-builder` | Sonnet 5, high | At most two moving Blender shots (§9.7), and Remotion composition by setups (§9.8.4). Opus only to unpick a structural bug |
| 3 · Stills audit | `nif-auditor` | Sonnet 5, medium | Independent of the builder; measures, never fixes |
| 4 · Resolve | `nif-finisher` | Sonnet 5, medium | Opus 5.5 medium for grade and look decisions, and first-time Fusion authoring |
| 5 · Publish and learn | `nif-researcher` | Sonnet 5, medium | Reading numbers and writing the review. Opus only when a lesson changes the runbook |
| Runbook changes | — | Opus 5.5, high | Rare, high-consequence |

Maximum effort is reserved for one bounded, genuinely hard thing — a bug that has
already resisted two attempts, or restructuring an episode's spine. Never routine
work.

### 5.3 · Never hand over a step name. Hand over a prompt.

**Every step ends by naming the next model AND writing the prompt that runs it.**
Not a summary, not "now do Step 3" — the actual paste-ready text.

This is a hard rule because a fresh session starts with **nothing**. It has not
read this runbook, does not know the episode, does not know what the last step
decided or why. "Do Step 3 Build" is not an instruction it can act on; it will
guess, and guessing is how an episode gets built against the wrong fps, the wrong
folder, or a shelved episode's leftovers.

Every handoff prompt states, explicitly:

| Must contain | Why |
| --- | --- |
| Which runbook sections to read first | The session has no context at all |
| The episode code and its absolute paths | There are shelved siblings with the same number |
| Every command, with every flag | A missing `--fps 24` silently corrupts the build |
| What NOT to touch | Locked artefacts, banned regeneration, spend limits |
| Where to stop and ask | Anything irreversible or costly |
| The gates it must pass | From §12 |
| The next model after it | So the chain continues |

**The creator should never have to explain the project to a new session.** If a
handoff needs them to fill in a blank, the handoff was written wrong.

### 5.4 · Token discipline

Context is the budget that runs out first, and a full context makes every later
answer worse, not only more expensive. These rules apply in every step:

| Rule | Why |
| --- | --- |
| **Hand over paths, not contents.** A handoff names `00_intake/postmortem.md`; it does not paste it | The next session reads it once, when it needs it |
| **Browser: text before pixels.** Read a page with the page-text and find tools first. Take a screenshot only for something that has no text, such as a chart, and crop or zoom to that element | A full-page screenshot costs more than the whole page's text, and it gives the model less to work with |
| **Collectors return a fixed table.** A browsing subagent (§5.2) returns the tables in §6.1–6.2, filled in, and nothing else. No narration of its clicks | The deciding model never sees the raw pages |
| **Scripts print summaries.** `vph.mjs`, `dip-map.mjs`, `motion-check.mjs` and the audit scripts print a short table. Full logs go to a file and are read only on failure. Blender runs with `--quiet`, and renders with Remotion's `--log=error` | A render log can be 50,000 tokens of progress lines |
| **Transcripts are cleaned before reading.** Competitor auto-subs go through `vtt-clean.mjs` | Raw auto-subs repeat every line about three times |
| **Stills are audited as contact sheets.** Composition, three-plane and held-state checks read a grid of 12 stills in one image. Full-size stills only for a frame that fails, or for text | One image instead of twelve |
| **Measured facts come from scripts, not from eyes.** Word counts, VPH, shot lengths, frozen frames, loudness and durations are computed | A model counting words or estimating a timestamp is slower, costlier and wrong more often |
| **Nothing is researched twice.** Step 0 writes what it read to `00_intake/`. Step 5 writes `10_review/`. A later step reads those files and does not browse again | The same page read twice is paid for twice |
| **One step per session** (§5.2) | Session length costs more than model tier |

---

## 6 · Step 0 · Intake

**Trigger:** `Run the runbook. Episode N.`

Step 0 is a conversation, not an autorun. Claude researches, then stops and puts
decisions to the creator. Claude does not ask how many beats, what visual
treatment to use, or how much research is needed — those are this runbook's job.

**What a fresh session does, in order**, with no other instruction:

| # | Does | Writes | Stops for the creator? |
| --- | --- | --- | --- |
| 1 | Reads §0.1's Step 0 sections, `library/shipped.md`, `library/lessons.md`, and the `10_review/` of the two latest published episodes | — | No |
| 2 | **0a** · The postmortem of the last two episodes (§6.1) | `00_intake/postmortem.md` | Only for a login |
| 3 | **0b** · Evidence and keywords in vidIQ Research, then `vph.mjs` on the shortlist (§6.2) | `00_intake/evidence.md` | Only for a login |
| 3½ | **0c** · The case test on every shortlisted topic (§6.2.1): suspects, red herring, cold answer, why ours | `00_intake/case-test.md` | No |
| 4 | Writes the vidIQ prompt, with Claude's own recommendation in it (§6.3) | `00_intake/vidiq-prompt.md` | **Yes.** The creator runs it in vidIQ and pastes the answer back |
| 5 | **0d** · Round 1, topic, with the case test results (§6.5) | — | **Yes** |
| 6 | **0e** · The full research pass, then Round 2, shape and packaging (§6.5) | — | **Yes** |
| 7 | The intake output (§6.6) and the Step 1 handoff prompt (§5.3) | `project.json` | Done |

Rows 2 and 3 run in a browsing subagent on Sonnet (§5.2), which hands back the
filled-in tables of §6.1 and §6.2 and nothing else (§5.4).

**The browser rules.** Claude reads YouTube Studio and vidIQ in Chrome, in the
**Rama** profile (the channel's own account; the other connected Chrome is a
different channel). If the browser tools are not connected, Claude says so and
asks for them. It never fills a number in from memory.

| Allowed: reading | Never: spends credits or changes the channel |
| --- | --- |
| Opening pages and tabs, scrolling, hovering a chart, changing a date range, typing a search, sorting and filtering | Anything labelled Generate, Regenerate, AI, Coach, chat or deep research. Apply, Save, Save Changes, Publish, Upgrade. Anything that shows a credit cost |

Claude never calls a vidIQ tool itself and never states a score vidIQ did not
return. A page that asks for a login or shows a credit cost stops the step and
goes to the creator.

Competitor transcripts come from `yt-dlp --skip-download --write-auto-subs` and
are cleaned with `vtt-clean.mjs` before they are read (§5.4). A competitor video
is watched with the `watch` skill (captions first; its Whisper fallback uploads
audio to Groq or OpenAI only if a key is set, and none is).

### 6.0 · The idea is the job

**The idea decides roughly 80% of the outcome and usually gets 5% of the effort.**
Most of what feels like production work — grading, sound, polish — cannot rescue
a topic nobody wanted. A great idea executed adequately beats an adequate idea
executed beautifully, every time, and the reverse has never once been true.

**The survival test — every topic must pass it:**

> Would a **specific viewer** be **disappointed** that a **specific video**
> doesn't exist?

"Space facts you didn't know" — nobody misses it if it is never made. "Why NASA's
new engine breaks a rule your physics teacher taught you" — a real person clicks
that deliberately. If the topic cannot name the disappointed viewer, it fails
here, before anything else is checked.

**Niches don't die. Ideas die.** Channels have been deleted while working on the
healthiest topics on the platform, because the *idea* was mass-produced. The
pillar is never the problem; the angle is.

**Specific beats broad, and it isn't close.** "Meal prep for night-shift nurses"
beats "healthy eating tips" with worse writing, a worse thumbnail and half the
effort, because the idea did the selling before anyone clicked.

**The classifier has to place the episode in one second.** A broad topic makes it
hesitate and the video gets buried; a narrow one makes it confident and it pushes
harder. Every episode must be obviously, almost rudely, one thing.

**A topic an AI chatbot answers in four seconds is not a video.** If the whole
payoff is a fact that can be looked up, the episode has nothing to sell. The
payoff must be a *mechanism* the viewer could not have assembled alone.

**The title shape that works** — not a topic, a hook: an outlier subject, an
authority being beaten, a curiosity gap, and a promised payoff. "The man who made
everything on the internet free." Test the working title against that shape at
intake, not at the end.

### 6.1 · The postmortem: the last two episodes

**The next episode starts from what the last two got wrong.** Before any new
topic is looked at, Claude reads the two latest published episodes. The numbers
are read at seven days (§1.3). A video younger than that is read as it stands and
marked with its age.

If an episode's `10_review/review.md` already exists at seven days (§14.2), it is
read instead, and nothing is browsed for that episode.

Per episode, from **YouTube Studio → Analytics** for that video:

| Read | Where |
| --- | --- |
| Impressions and impressions click-through rate | Reach |
| Traffic sources (Browse, Suggested, Search) and the top search terms | Reach |
| Views, average view duration, average percentage viewed | Engagement |
| Key moments for audience retention: % still watching at 0:30, the dips and the spikes, each with its timestamp | Engagement → Audience retention |

Then from the **vidIQ Optimize tab** for the same video: either the Optimize tab
vidIQ adds to the video's page in Studio, or vidIQ → Optimize → the video.

| Read | Where |
| --- | --- |
| The content score, out of 100 | Optimize |
| Every issue it lists, verbatim | Optimize → Review |

**Timestamps become beats.** `dip-map.mjs` puts every key moment on the beat and
the words being spoken there, from that episode's `timing.json`:

```bash
node scripts/dip-map.mjs ../../episodes/NIF009 0:30 3:12 7:45 9:02
```

With `--csv` it reads the retention curve itself (`elapsedVideoTimeRatio,
audienceWatchRatio` rows, as the YouTube Analytics API returns them) and finds the
dips and spikes on its own.

Written to `00_intake/postmortem.md`, per episode, in this shape and no longer:

```
NIF009 · "title"                                  day 7
  CTR 4.8% (gate 6%) · APV 38% (gate 45%) · AVD 5:02 of 13:14
  At 0:30: 71% still watching
  Traffic: Browse 52% · Suggested 31% · Search 9% (top term "…")
  vidIQ 62/100. Issues: [verbatim, one per line]
  Dips    3:12  B06 "…words…"   → [cause, one line]
          7:45  B14 "…words…"   → …
  Spikes  5:30  B10 "…words…"   → [what held them]
  DO NOT REPEAT  [one to three rules, each checkable at Step 1 or Step 3]
  KEEP           [what the spikes say worked]
```

**A cause is one the runbook names**, not a mood: a cold open past 30 seconds
(§4.1), a stat run (§4.3), a promise held past 40% (§7.8), a beat that resolved and
opened nothing (§4.4), a held frame (§3 law 11), a section card before its payoff
(§4.7), a drift out of the payer's lane (§1.1), or packaging (low CTR with healthy
retention). A drop in the last 10% is the sign-off leaving, and is not diagnosed.

**One episode is noise; the same cause in both is a signal** (§1.3). A cause found
in both goes into `library/lessons.md` (§14.3). The postmortem also settles §1.4:
whether the last episode held 45% and so has earned a longer runtime.

### 6.2 · The evidence gate

**No topic enters Step 1 without a proven outlier behind it.**

An outlier qualifies on **velocity relative to its own channel's baseline**,
never on lifetime views. This is a hard rule:

| Age of the video | Floor, lifetime views per hour | And |
| --- | --- | --- |
| Up to 3 months | **≥ 80 VPH** (100 or more is strong) | ≥ 3× its channel's baseline |
| 3 to 12 months | **≥ 20 VPH** | ≥ 3× its channel's baseline |
| Over 12 months | **≥ 20 VPH** | ≥ 3× its channel's baseline, and still unusual for that channel |

A video with huge lifetime views and weak current velocity does not qualify. A
smaller video strongly outperforming its own channel does.

**Where to look: vidIQ → Research**, reading only (the browser rules above):

| # | Tab | Read | Keep |
| --- | --- | --- | --- |
| 1 | **For you** | *Outliers for me* and *Rising keywords*, at the bottom of the page | Every outlier with title, channel, age, views and outlier score. Every rising keyword near the payer lane |
| 2 | **Keywords** | Three to five seed terms per candidate topic | Search volume, competition and overall score, and the best related terms. **One primary keyword per candidate** |
| 3 | **Videos** | Each primary keyword, sorted by views per hour or outlier score, over the last 3 months and then the last year | The outliers *For you* missed |
| 4 | **Channels** | The channel behind each outlier | Whether it serves a similar audience. An outlier from an unrelated audience is not evidence |
| 5 | **Thumbnails** | The primary keyword | What the winning thumbnails share, in one line. Read so ours can differ, never copied (§9.10) |

What vidIQ shows depends on the plan. Claude uses what is shown and never upgrades.

**Then the numbers are measured by us.** The shortlist, at most eight videos,
goes through `vph.mjs`. It computes views per hour from the publish time and the
multiple from the channel's own recent uploads:

```bash
node scripts/vph.mjs <url> <url> … --out ../../episodes/NIF0NN/00_intake/evidence.md
```

Where our number and vidIQ's badge disagree, both are reported and the gate uses
ours. A baseline `vph.mjs` could not read falls back to vidIQ's outlier score,
marked as vidIQ's.

`00_intake/evidence.md` holds the `vph.mjs` table, then one line per candidate
topic with its primary keyword, volume and competition, then the rising keywords
worth noting.

If no candidate clears the floor, Claude says so plainly rather than lowering the
bar. Three consecutive failures to clear it means the floor itself gets
re-examined — small-niche channels may not clear a flat number.

### 6.2.1 · The case test

**Demand proves people want the topic. The case test proves it can be a mystery.**
Every shortlisted topic passes all eleven rows before it goes to Round 1, written to
`00_intake/case-test.md`:

| # | Test | Passes when | How |
| --- | --- | --- | --- |
| 1 | **Demand** | The evidence gate passed (§6.2) | `vph.mjs`, vidIQ |
| 2 | **The victim** | A person paying, and one sourced number for what it costs them a year | Research |
| 3 | **The suspects** | Three or more parties who plausibly take a cut, each sourceable | Research |
| 4 | **The red herring** | The answer the top three competitor videos give is incomplete or wrong, and our research shows why | Their transcripts through `vtt-clean.mjs` |
| 5 | **The cold answer** | A fresh model, given only the title's question, does **not** name our culprit | `claude -p --model haiku "Answer in one line: <question>"` |
| 6 | **The culprit** | Named, sourced, surprising, and legal: no crime is alleged | Research |
| 7 | **Why ours** | Three specific things ours has that each of the top three videos lacks, in a table. "Better animation" doesn't count | vidIQ Videos tab, transcripts |
| 8 | **Stageable** | One object, at most two new locations (§2.4) | Library `INDEX.md` |
| 9 | **Safe and evergreen** | No news peg, advertiser-safe, and no advice needed to close it | Judgment |
| 10 | **The transfer** | We can name the proven format we move and the market it has never been used in, in one line (§1.1) | Judgment |
| 11 | **First mover** | Fewer than three of the top 30 search results already frame the topic as a mystery ("who", "culprit", "not who you think") | `saturation.mjs` |

`saturation.mjs` runs on two or three phrasings of the topic and writes
`00_intake/saturation.md`:

```bash
node scripts/saturation.mjs "why is movie theater popcorn so expensive" "cinema popcorn price" --deep 12 \
  --out ../../episodes/NIF0NN/00_intake/saturation.md
```

Its verdict reads the market three ways: **low demand** (nobody ranks big for it, so
the evidence gate will likely fail), **topic crowded, angle open** (many near-copies
all give the same answer: good, the red herring is ready-made), or **angle taken** (we'd
be a copy: drop it).

A topic that fails row 4, 5 or 11 is an explainer or a copy, not our mystery. It goes back to the
shortlist whatever its demand.

### 6.2.2 · The case score

**The case test says which ideas can be episodes. The case score says which one to make
first.** Every topic that passed all eleven rows gets a score out of 100, written under
its case test in `00_intake/case-test.md`:

| Part | Points | How it is scored |
| --- | --- | --- |
| **Demand** | 25 | The outlier's multiple over its own channel's median (`vph.mjs`): 10× or more = 25, 5–10× = 18, 3–5× = 10, under 3× = 0 |
| **Open angle** | 15 | `saturation.md`: *topic crowded, angle open* = 15 (the red herring is ready-made), *open* = 10 |
| **The red herring** | 15 | How many of the top three competitor videos give the popular answer: three = 15, two = 10, one = 5 |
| **The cold answer** | 10 | The fresh model names our red herring = 10; it gives a vague answer = 5 |
| **The victim's number** | 10 | Sourced, per person per year, and something a viewer would repeat = 10; sourced but abstract (only a national total) = 5 |
| **The packaging** | 15 | A title in the §6.0 shape and a thumbnail as one frame of one object, both drafted before scoring. Clickable *and* true to the video = 15; true but flat = 5. If it can't be packaged, it isn't an idea yet: back to the shortlist |
| **Build cost** | 10 | New locations: none = 10, one = 5, two = 0 (§2.4) |

- **A score ranks; it never rescues.** Only topics that passed every row are scored.
- **Every point cites its evidence** (a number, a file, a title). A part without
  evidence scores 0.
- **Round 1 shows the angles in score order.** Claude may recommend a lower-scored one
  only by saying which part the score misjudges.
- **The weights are checked once, after ten cases:** scores against the 7-day CTR and
  APV in `library/shipped.md`. A part that predicted nothing loses its points, through
  §13.5.

Unlike a tool's "virality score", every point here is a number someone can check, so a
wrong score can be traced to the part that was wrong.

### 6.3 · The vidIQ prompt

**Claude brings its own answer to vidIQ and asks vidIQ to beat it.** The prompt
carries the postmortem, the measured evidence and Claude's recommendation, so
vidIQ starts from this channel's data rather than from nothing. The creator runs
it in vidIQ, because it spends vidIQ credits, and pastes the answer into
`00_intake/vidiq-answer.md`.

Claude fills every `[...]` from `00_intake/` and `library/shipped.md`, saves it as
`00_intake/vidiq-prompt.md` and hands it over:

```
You are the research and competitive-intelligence analyst for my YouTube
channel, Someone Always Pays: documentary explainers on hidden economics, told
from the point of view of the person paying. The promise: when something looks
free or cheap, the channel shows you who actually paid, by name.

Published so far. Do NOT re-suggest any of these:
[shipped.md: "title" — one-line topic — CTR — APV]

What my last two episodes taught me:
[postmortem.md: numbers against the gates, the dips and their causes,
 DO NOT REPEAT, KEEP]

My evidence (views per hour measured from publish time; multiple against the
channel's median upload):
[evidence.md: the table, and the primary keywords with volume and competition]

MY RECOMMENDATION
  Topic:        [topic]
  Angle:        [the payer-POV angle, one sentence]
  Outlier:      [video · channel · VPH · multiple]
  Keyword:      [primary keyword · volume · competition]
  Title:        [working title]
  Why it wins:  [one or two lines]
ALTERNATES
  [two more, one line each]

1. ANALYSE MY CHANNEL. Diagnose the actual evidence: packaging, topic demand,
   audience fit, competition, retention, positioning, or insufficient data.
   Do not assume the channel is suppressed. Do not invent evidence.
2. CHALLENGE MY RECOMMENDATION with your data: demand, competition, keyword,
   audience fit. Say specifically where it is weak.
3. FIND PROVEN OUTLIERS I MISSED. Videos significantly outperforming their own
   channel's baseline. Up to 3 months old: 80+ views per hour. 3 to 12 months:
   20+ views per hour and still unusual. Never judge on total views alone.
4. CHECK ALL RELEVANT COMPETITORS before selecting, and confirm each one serves
   a similar audience.
5. SELECT EXACTLY ONE: mine, an alternate, or a better one you found. Not a
   ranked list. Choose on proven demand, outlier strength, audience fit,
   packaging, hook, retention architecture and room for a new interpretation.
6. DECONSTRUCT THE OUTLIER BEHIND IT: topic, title, thumbnail, hook, retention
   architecture, story structure. Extract the content mechanism, not words to
   copy.
7. NICHE BENDING. What proven format does it use, and which market has that
   format never been used in? Do not force a bend that weakens the concept.
8. WHY WOULD A VIEWER WHO ALREADY SAW IT WATCH MINE? Be specific. "Make it
   better" is not an answer. My channel tells each topic as a whodunit: what
   answer do the popular videos give (my red herring), and what would the
   surprising real answer be?
9. KEYWORD AND TITLE. The primary keyword you would build the title on, and
   three titles in the shape: an outlier subject, a curiosity gap, a promised
   payoff.

If data is unavailable, say DATA NOT AVAILABLE rather than guessing.
```

**Claude reconciles the two answers and defers to neither.** Where vidIQ picks a
different topic, Round 1 shows both, each with its evidence.

### 6.4 · Niche bending

The rule: take a proven **format** and move it to a **market** where it has not
been used. Never copy a video; copy the structural reason it worked.

This channel's standing bend is **owner POV → payer POV**. Any further bend must
strengthen clarity, curiosity or storytelling — a bend that weakens the concept
is rejected.

### 6.5 · The intake gate — two rounds

**Round 1 — Topic.** Claude presents the outlier evidence, vidIQ's answer beside
its own, and three angles, ranked with a recommendation, plus the standing option
for the creator to name their own. Each as:

```
[Angle]
  The outlier:    [video · channel · age · VPH · multiple, ours and vidIQ's]
  The keyword:    [primary keyword · volume · competition]
  The lessons:    [how this angle avoids each DO NOT REPEAT in postmortem.md]
  The case:       [victim · suspects (red herring first) · culprit hypothesis]
  Cold answer:    [what a fresh model says, and that it isn't our culprit]
  Case score:     [NN/100, and the part that cost the most points (§6.2.2)]
  Why ours:       [the three things the top videos lack]
  The mechanism:  [one line]
  The number:     [the figure that carries it, and whether it is sourceable]
  The reversal:   [the flip, in one sentence]
  The payer:      [who is paying, specifically — this is the POV test]
  The click:      [why a viewer stops on the thumbnail and title]
  The object:     [the one concrete thing the whole episode is built on]
  Worth-it test:  [what the viewer can do or see differently afterwards]
  The story:      [the 15–30 s true, funny cold-open story, in two lines (§4.1)]
  The history:    [the first person, the first decision, the date the spine starts]
  Locations:      [which library locations it uses, which are new. Max two new (§2.4)]
  ⭐ RECOMMENDED — [why this one]
```

**Round 2 — Shape.** After the full research pass, in one round:

1. **Runtime** — recommended, tighten, or expand. Expansion only with *named*
   extra material, never padding.
2. **Closing callback** — which shipped episode the last beat points back to.
   Backward or sibling only, never a forward tease.
3. **Packaging recommendation.** Claude recommends a working title in the §6.0
   hook shape, and a thumbnail concept described as one frame of one scene: the
   location, the cast and the one object. The title's question is the one the narrator
   asks at the end of the cold open (§4.1), so the script is written toward that promise. The
   title carries the primary keyword where it reads naturally, and never at the cost
   of the hook. The creator checks both in vidIQ and decides. The thumbnail itself is
   built at Step 3 (§9.10).

Step 1 starts only once Round 2 is answered.

### 6.6 · Intake output

**The word budget is the single most consequential number set at intake**, and
it is arithmetic, not judgement: **target minutes × 175 wpm** (§8.1). Ten to
fourteen minutes means **1,750 to 2,450 words**, and twelve minutes means
**2,100**. Budgeting from any other rate than the one the voice is set to just
produces an episode that misses its runtime with no way left to fix it.

| Target | Word budget |
| --- | --- |
| 8 min | 1,400 |
| 10 min | 1,750 |
| 12 min | **2,100** |
| 14 min | 2,450 |

Written to `project.json`:

```
TOPIC             [chosen]
CASE TYPE         [the bait / the fee / the rule]
THE CASE          [victim · suspects (red herring first) · culprit, all sourced]
CASE DEVICES      [the three of seven this episode uses (§2.8)]
EPISODE           NIF0NN
OUTLIER           [channel · video · VPH · multiple vs baseline]
PRIMARY KEYWORD   [keyword · volume · competition]
LESSONS           [the DO NOT REPEAT lines this episode must pass (§7.0)]
THE OBJECT        [the one concrete thing]
THE PAYER         [who pays — the POV anchor]
TARGET RUNTIME    [n] min
WORD BUDGET       [n] words = target minutes × 175   ← the set rate, §8.1
CLOSING CALLBACK  [Ep ## — title]
COLD-OPEN STORY   [two lines]
HISTORY START     [person · decision · date]
LOCATIONS         [library: … · new: … (max 2)]
WORKING TITLE     [recommended, in the hook shape]
TITLE QUESTION    [the question asked at the end of the story, verbatim]
THUMBNAIL CONCEPT [one scene frame: location · cast · object]
```

---

## 7 · Step 1 · Script and beats

Two artefacts and nothing else: `01_script/script.md` and `01_script/beats.md`.
No assets, no prompts, no scene briefs — every duration in them would be wrong.

**Each beat in `script.md` carries one `PLAIN` block.** It is what ElevenLabs
generates (§8.1), the read-aloud reference, the subtitle source, and what the word
count and `reconcile.mjs` are computed from. Delivery is written into it with
punctuation and sentence length; there are no audio tags.

**The narration lives in `script.md` and nowhere else.** `beats.md` and
`shots.json` point at a beat by its ID and quote at most the few words a cue lands
on. A second copy of the narration drifts from the first, and every later step
pays to read it twice.

### 7.0 · Start from the lessons

Before the first line is written, the scriptwriter reads `00_intake/postmortem.md`
and `library/lessons.md`. Those two files are the reason this episode should
retain better than the last one.

- **Every DO NOT REPEAT line gets an answer in `beats.md`**, under a `Lessons`
  heading: the rule, and the beat and line where this script meets it. A lesson
  with no answer fails the Lessons gate (§12).
- **Every KEEP line is used again**, in a new form. What held viewers last time is
  the evidence for what holds them now.
- **Where the last two episodes lost people, this one plans a re-hook.** If both
  dipped at about the same share of runtime, the beat at that share of this
  episode carries one of the §7.3 devices or the §7.4 staged character moment.
- **The intro number sets the cold open's job.** If fewer than about seven in ten
  viewers were still there at 0:30 last time, the story's first line is rewritten
  until it is an image, not a premise.

### 7.1 · Beat IDs

```
B00   the story: 15–30 s, true, funny, ends on the weird fact (§4.1)
B01   the title's question, and the history's first date
B02+  the mechanism starts — no later than B04
B0X   the honest part — after ~2 minutes, never in the first 60 seconds
B0X   FIRST PAYOFF — one surprising fact, delivered and closed, by ~40%
B##   the reversal — recontextualises the first payoff
B##   implication · the one backward callback · the fixed sign-off, verbatim
```

Audio returns as `B00.mp3`, `B01.mp3` … That naming is what makes reconcile
automatic.

### 7.2 · Script rules

Sentences under 20 words. One idea each. Contractions always. No em-dashes, no
parentheticals. Numbers written as spoken words. The object written into the
line. Every script passes the read-aloud test.

| Rule | Why |
| --- | --- |
| **Every beat names a place and a thing** | A scene has to stage it. "Market inefficiency" cannot be staged; "four people reaching into the same till" can |
| **No line requires a recognisable real person** | Name them; show the chair, the podium, the empty desk |
| **Name the exact system, company or mechanism** | Never "this thing" or "that process". Vagueness about who profits is a failure of this channel's actual job |
| A sourced number every 45–60 seconds | Density floor |
| Never more than three consecutive stat beats | The front-loading law |
| Write the pause as a sentence break | The voice model reads punctuation as pacing |
| One dry aside per episode | The point of view, made audible |

**Figures are quoted from the source, never from memory.** A source PDF, DOCX or
spreadsheet is converted with `markitdown <file> -o <file>.md` and the figure is
copied from that text, with its page and year, into the citation ledger.

### 7.3 · Retention devices

Structure keeps a viewer; these keep them *awake*. At least four of the seven
appear in every episode, and which four changes between episodes (§4.8).

**1 · Forward-promise ordering.** Right after the title's question, name what is coming and put
the best thing last, explicitly. *"The first three only make sense once you see
how they stack — number four is the one that knocks everything over."* It is a
contract: the viewer now knows leaving early costs them the best part.

**2 · The stacking recap.** Before the final reveal, count the episode back in
one breath — *"So: one, two, three, four. Now stack those. In that world, what is
the one thing that decides it?"* — then answer. It converts everything already
watched into momentum.

**3 · The public failure.** Around 60–70%, the narrator tries the obvious thing
and it does not work. *"So I did it. And it flopped. And that is when I found the
part I had missed."* Used when the research genuinely contains one; never
invented, because a fabricated failure is a lie about the work.

**4 · The honesty moment.** Say plainly what the channel does *not* do, or where
the evidence stops. Naming a limit buys more trust than any credential, and it is
the cheapest trust available.

**5 · Pre-empt the objection.** Voice the viewer's doubt before they type it —
*"and yes, the obvious answer is X, which is wrong for a reason nobody mentions."*
A doubt named is a doubt defused; a doubt ignored is a comment and an exit.

**6 · Direct address.** Occasional imperatives — *"read that again"*, *"watch what
happens to the number"* — pull a drifting viewer back into the room.

**7 · Spoken signposts.** The section card (§4.7) has an audio half. The card
lands and the narration names it in the same breath.

**8 · The lineup.** The suspects named in one breath, early, with the promise that
one of them is lying: *"Four suspects. One of them has your six dollars. It isn't
the one you think."* It is forward-promise ordering (device 1) in the case's own
language.

**9 · The reconstruction.** The cold open played again with the hidden hands drawn in
(§2.8). The viewer rewatches something they already saw and sees it differently.

**Satisfaction, not watch time.** The platform optimises for whether the viewer
left satisfied, not for how long they stayed. A viewer leaving because they got
the answer is a good outcome. A viewer leaving because the episode stalled is
not. This is why padding is a scored failure and not merely bad taste.

### 7.4 · Humour

Humour is a retention instrument in this channel, not decoration, and it has a
specification.

**One concrete analogy per major concept, and it is always domestic.** A queue, a
shared fridge, a supermarket, flat-pack furniture, a bad seat on a plane. Never
an analogy drawn from finance, tech or economics — the whole job is translating
*out* of that register, and a metaphor from inside it explains nothing.

**The analogy lands at the re-hook.** Every 60–90 seconds the episode needs a
pattern interrupt anyway; making it the analogy does both jobs at once and costs
no runtime.

**One running callback per episode.** A single image returns two or three times,
recontextualised each time. It is the cheapest device available for making an
episode feel authored rather than assembled, and it is impossible to template
because it is built from that episode's own material.

**Self-deprecation, at least once.** The narrator admits a thing they got wrong,
believed, or overpaid for. This is the register the channel already has (§0) —
amused, not superior — and it is what keeps "polite disbelief" from curdling into
smugness.

**The history is told as a story, and the jokes live in it.** Oversimplified's
method: real people are given small, human, slightly absurd moments (the inventor
who mispriced his own patent, the airline boss who argues about a peanut) and
the joke is always true to what they did. The cast rig plays them (§2.5).
One staged character moment every 60–90 seconds is the humour budget, and it
can be the re-hook.

**Never at the viewer's expense.** The joke is aimed at the system, the seller, or
the narrator. A viewer who feels stupid does not return.

**The read-aloud test decides it.** A joke that does not survive being spoken is
cut. Anywhere the tongue trips is where the viewer leaves.

### 7.5 · Beat sheet format

```
B07   "The counter keeps four fifths"        EST 42s        HIGH
      Narration:      script.md B07 (never copied here)
      Words:          118   ← counted by script from the PLAIN block, never by eye
      The object:     [what persists from the previous beat]
      Tier:           2.5D
      Location:       deli (library) · angle: new, low over the till
      Cast:           Lucky · cashier {outfit #2E9E6B, hair bob}
      Scene action:   the cashier rings up $8.99, the till drawer opens, four
                      hands reach in one after another, each takes a cut
      Insert:         the till display, numbers typed on its screen
      Planes:         BG deli wall · MID counter, till · FG hands, Lucky
      Camera:         pull, medium → wide. Reason: reveal who else is paid
      Loop:           opens "so where does the rest go" — B08 answers
      Peak:           on "four fifths"
      Mode:           MECHANISM   ← STORY · COMEDY · MECHANISM (§4.6)
```

**Every duration at this step is marked `EST` and is wrong.** It exists only so
beat count and shape can be reviewed.

**`shots.json` is written with the beat sheet.** It is the same shot list as data,
one entry per shot, and it is what Step 3 builds from (§9.0). It carries no frame
numbers. Those come from `timing.json` words at Step 3.

```json
{ "beat": "B07", "shot": "B07-S2", "tier": "2.5D",
  "location": "deli", "template": "over-shoulder",
  "cast": [ { "who": "lucky", "action": "stand-react" },
            { "who": "cashier", "outfit": "#2E9E6B", "hair": "bob", "action": "ring-up" } ],
  "arrive": { "till-display": "eight ninety nine" },
  "insert": "till-display" }
```

### 7.6 · The humanizer pass

**Every script and beat sheet goes through the `humanizer` skill before the
pre-VO lock.** It is installed at `~/.claude/skills/humanizer/` (blader/
humanizer, MIT) and is available in every session.

It strips the writing patterns that make prose read as machine-made: inflated
claims about importance, name-dropping to borrow authority, vague attribution
like "experts say", "not X but Y" constructions, forced triples, stock AI
vocabulary, filler, and repetitive sentence shape. That is exactly the failure
this channel cannot afford, because the narrator's stance in §0 only works if it
sounds like a person who is quietly unwilling to let something go.

Two rules on top of the skill's own:

- **It may not add a fact.** Not a number, name, date, quote or citation. The
  citation ledger is fixed before this pass and is identical after it.
- **The read-aloud test is the final authority.** If the humanized line is
  cleaner on the page but worse in the mouth, the spoken version wins.

### 7.7 · The pre-VO lock

Before any audio is generated: script final, humanizer pass done, every citation
checked, runtime agreed, cold open final. Voice generation is the point of no
cheap return.

---

### 7.8 · The promise-delivery check

Name the exact promise the title makes, and the exact beat and line where the
episode delivers it.

**If that lands past ~55% of runtime, the script is restructured** so a clear
answer — even a partial one — arrives by ~40% (§4.2, the first payoff).

This is a script gate, not a packaging one. An episode that withholds its promise
too long fails on retention no matter how it is packaged afterwards.

---

## 8 · Step 2 · VO and reconcile

### 8.1 · Voice

One take per beat, named by beat ID.

**The voice is fixed and is written here, not only in code.** Every value below
lives in `engine/remotion/scripts/tts-nif.mjs`. When one changes, it changes in
both places, in the same commit.

| Setting | Value |
| --- | --- |
| Provider | ElevenLabs |
| Voice | **SAP Narrator**, `9Qr0WkVfC2wAjGibgnfe` — a Voice Design voice made for this channel, saved in the channel's own account. Never a premade or trending library voice: those are on hundreds of channels, and a viewer who has heard one reads the episode as mass-produced |
| Model | `eleven_multilingual_v2` — chosen for consistency from beat to beat |
| Text sent | The beat's **`PLAIN`** block. v2 does not read audio tags |
| Settings | stability 0.5 · similarity 0.75 · style 0.2 · speaker boost on · **speed 1.00** (below) · fixed **seed** |
| Continuity | Every beat is sent with the neighbouring beats' text (`previous_text` / `next_text`), so the delivery flows across beat boundaries |
| Output | `mp3_44100_192` |
| Key | `ELEVENLABS_API_KEY` in `engine/remotion/.env`. Never a flag, never in a script |
| Takes | **One per beat. One render is the render.** See below |

**Pace is set by the speed setting: 1.00, locked by the creator on 2026-09-24, which delivers about 175 wpm.** v2 honours
`speed` (0.7–1.2); `eleven_v3` did not, which is why the old bands were whatever
the voice happened to deliver. The speed was chosen by ear from an audition of the cold open at several
settings, and it is held for every episode. It changes only as a runbook change,
with a new audition:

```bash
node scripts/tts-nif.mjs NIF0NN --only B00 --speed 0.85 --out 06_audio/voice-audition --suffix -s0.85
```

SAP Narrator reads fast by nature: on NIF009's cold open, 1.00 gave 177 wpm,
0.90 gave 160 and 0.85 gave 146. The creator chose 1.00. The per-beat spread at the chosen speed is
measured on NIF009 and written here as the observed band.

Variation between beats comes from the **writing** — short sentences for a
figure that needs to land, a run of clauses for an escalation, the sentence break
as the pause (§7.2) — never from a blanket tempo change after generation.

**Changing the channel's voice is a runbook change** (§13.5), made by the creator.
It is the one case where an episode's narration may be generated again: the old
files are moved aside, never deleted, and the change is recorded in that
episode's `project.json`. It is never a way to re-roll a delivery.

**One render is the render. Credits are spent once.**

This is the hardest rule in Step 2. When a beat's audio exists, that beat is
**finished**. It is never generated a second time, and pace is never a reason to
try again.

- A beat whose mp3 exists is **skipped**, always.
- `--force` is for a **file that is broken** — truncated, silent, corrupt, the
  wrong text. It is **never** for a delivery you would like to be different.
- **Delivered WPM is not a defect.** A beat that comes back outside ±8% of 175
  is not re-generated (the target is 175 wpm). It is corrected in Resolve (§8.2), or it is accepted as it
  is.
- A second render costs real credits to buy a different roll of the dice, not a
  better one.

**Why this is safe.** Nothing downstream is built against a target duration —
§5 requires every frame range to come from measured audio. A beat delivered fast
is simply a **shorter beat**, and Step 3 builds the scene to that measured
length. Re-rendering costs money and fixes nothing reliably.

**Always dry-run first**, and audition before the first episode on a new voice
or speed. If a script is going to land badly, the place to fix it is Step 1,
while it is still free.

### 8.2 · Reconcile

Measure every beat. Replace every `EST`. Compute delivered WPM per beat and flag
anything outside its band.

**The chain, in order.** All four live in `engine/remotion/scripts/` and are run
from `engine/remotion/`. This is the whole of Step 2.

| # | Script | Does | Writes |
| --- | --- | --- | --- |
| 1 | `tts-nif.mjs NIF0NN` | ElevenLabs, one take per beat | `02_narration/B##.mp3` |
| 2 | `transcribe.mjs ../../episodes/NIF0NN --fps 24` | **whisper.cpp, run locally.** No API, no cost, no upload. `ggml-medium.en`, token-level timestamps | `03_transcript/words/B##.json` + `transcript.json` |
| 3 | `reconcile.mjs ../../episodes/NIF0NN --fps 24` | real durations → frame geometry, per-beat WPM | `03_transcript/reconcile.json` |
| 4 | `build-timing.mjs ../../episodes/NIF0NN --fps 24` | merges word timings with real durations, placing **every spoken word on a frame** | `03_transcript/timing.json` |

**The order matters.** `build-timing.mjs` reads *both* `transcript.json` and
`reconcile.json`, so reconcile runs third and build-timing last. Running them
the other way round fails on a missing file.

**`--fps` is not optional, on any of the three that take it.** It defaults to
30, which was correct for NIF002 to NIF006 and is wrong for every episode
authored under this runbook. §1.4 is **24fps**. Passing the wrong value silently
produces wrong frame geometry for the entire build, and Step 3 will not notice.

**`timing.json` is the most valuable file in the pipeline.** It is what makes
§3 law 11 possible. A beat component calls `useBeatTiming(beatId)` and then
`at("champagne")` or `after("expired")` to land a graphic on the exact frame the
word is spoken. Without it, animation can only be guessed against a duration,
which is how episodes end up with things sitting still waiting for the audio to
catch up. **Nothing in Step 3 animates against a beat's total duration when it
could animate against a word.**

**Always dry-run first.** `tts-nif.mjs NIF0NN --dry-run` lists the beats and the
credit estimate and generates nothing. Voice generation is the point of no cheap
return (§7.7), so the dry run is where a bad script is still free to fix.

```bash
for f in B*.mp3; do
  printf "%s  " "$f"
  ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"
done
```

Beats outside band are corrected **in Resolve at Step 4**, by clip speed change,
limited to **±8%** — beyond that, pitch artefacts show.

**Beyond ±8% the beat is accepted as delivered.** It is not re-generated (§8.1).
The build adapts to the measured length, because that is what Step 3 reads. Log
the beat as out of band and move on.

Report the delta against target runtime with options. **Never pad an existing
beat with filler.** Either add a beat carrying a real sourced item, or accept the
runtime.

Nothing downstream is built until this step completes.

---

### 8.3 · Chapters

Chapters fall out of reconcile, because every beat's true start is now known.
They are exact — never estimated, never rounded to a tidy number.

**Phrased as answers, never labels.** "What the counter actually keeps", never
"Concessions breakdown". A chapter list is a second set of hooks running down the
side of the player, and a label is not a hook.

Written to `03_transcript/chapters.md` at the end of Step 2, ready to paste at
upload. The timestamps are computed from `reconcile.json`, never typed.

### 8.4 · Mouth cues

Rhubarb runs here, at the end of Step 2, on every beat where Lucky speaks to
camera. It needs only the measured audio and the PLAIN block, so it is mechanical
work, and doing it here keeps it out of the build session's context.

```bash
ffmpeg -i 02_narration/B07.mp3 -ac 1 -ar 16000 B07.wav
C:\tools\rhubarb\Rhubarb-Lip-Sync-1.14.0-Windows\rhubarb.exe -f json \
  --dialogFile B07.txt -o 03_transcript/mouth/B07.json B07.wav
```

`--dialogFile` takes the beat's PLAIN block from `script.md`, saved as a scratch
`.txt`, and makes the shapes follow the real words. The WAV and the `.txt` are
scratch files. The mp3 is never modified (§13.4).

---

## 9 · Step 3 · Build

### 9.0 · The order of work

Step 3 runs in three parts: **3a library, 3b plates, 3c scenes.** Skipping the
inventory is how episodes end up rebuilding what exists, and how a shelved
episode's assets get built in by mistake.

**0 · Read §2 before writing a single shot.** The `nif-house-style` skill at
`engine/remotion/.claude/skills/` was written for the Board and still describes
cream paper. **Where it conflicts with §2, §2 wins.** It is rewritten from the
approved cast pilot, and until then only its easing, typography and anti-fatigue
rules apply. `animation-principles`, `shot-composition`, `motion-art-direction`,
`kinetic-typography` and `remotion-video` still apply.

**1 · Inventory what already exists. Build nothing yet.** Start from
`video-os/library/INDEX.md` (§5.1), which answers most of this table in one file.
Open a folder or a contact sheet only to check a specific angle or part. Anything
3a adds to the library gets its line in `INDEX.md` in the same change.

| Check | Where |
| --- | --- |
| Locations, and the angles already used | `video-os/library/locations/` and each location's contact sheet |
| The cast rig and its parameters | `video-os/library/cast/` |
| Shot templates | `video-os/library/shot-templates/`: walk-in, stand-and-react, over-the-shoulder, look-up-at-a-board, insert push-in, two-shot, reaction close-up |
| Props, 2D and 3D | `video-os/library/props/` |
| Shared Remotion components | `engine/remotion/src/`: `motion/`, `characters/`, `parts/`, `channel/` |
| Leftovers from a shelved episode with this number | `src/NIF0NN/` and `public/*/nif0NN/`. **Delete or rename them before building** |

**2 · 3a Library (Opus).** Build only what `shots.json` needs and the library
lacks: at most two new locations (§2.4), plus any new cast parameter, template or
prop. Each is checked on a contact sheet of stills, and new work goes into
`video-os/library/`, never into the episode, so the next episode inherits it.

**A new location is not finished until its angle kit is** (§9.8.1). 3a renders
twelve locked-off angles for it. Each angle gets its plate layers, its passes and its
measured floor marks. That is the Blender work 3b used to repeat for every shot.

**3 · 3b Shots (Sonnet, medium).** A 2.5D shot is **data, not a build**. For each
one, `shots.json` names an unused angle from the location's kit and a mark for every
character (§9.8.1). Then:

```bash
node scripts/place-check.mjs ../../episodes/NIF0NN --kits ../../library/locations --write
```

It checks every placement with numbers: the mark is free, in title-safe, the head is
visible, the feet are visible (or declared hidden), nobody stands closer than 0.6 m
to anyone else, no walk crosses furniture, no shot is bare, and no angle is used
twice. Then it writes `05_layers/cams/place-<shot>.json`, which Remotion renders
from. **No Blender run, no stills, no foot-lock measurement** for a locked-off shot.

Blender runs in 3b only for the L3 shots, at most two (§9.7), and a shot
that needs an angle the kit lacks gets one new kit angle, made by the same script.

**3b works in batches of eight shots.** Each batch ends by writing
`08_conform/3b-progress.json` (shots done, shots failed, the failure reasons), and a
new session picks up from that file (§5.4). **A shot gets two fix attempts, then it
goes down the ladder (§9.8.2).** It never gets a third.

**3b-0 · The cold open first.** Before any other shot, the cold open (§4.1) is
built and rendered as a proxy with its real VO and sound, and the creator watches it.
It gets the episode's one moving 3D shot if there is one, 4–6 shots in 15 s, and 3+
specific sounds. If the hook doesn't work, it is fixed while it is 15 seconds of work.

**Step 1 writes intent; 3b writes placement.** `shots.json` from Step 1 names the
location, the framing and who stands where. 3b fills `angle` and `mark` from the kit.

**4 · 3c Scenes (Sonnet).** Setups first, then shots as rows (§9.8.4). Remotion composes every shot from `shots.json`
against `timing.json` words (§9.1). It builds the 2D sets, places the cast
and applies the one-drawing rule (§2.1), then adds the inserts and the text.
**One or two genuinely new visible mechanisms per episode** (§4.8). Not more and
not zero: zero means the episode was assembled from the last one.

**5 · Audit the stills and the running Studio page, then render the review
proxy** (§9.5, §11.2). The creator watches the proxy, and nothing renders at full
quality before their go.

**6 · Render the layer passes and hand them to Resolve** (§9.4).

**7 · Record the cost.** Write agent minutes per finished second, split by 3a, 3b
and 3c, into `project.json`. The two-a-week decision is made from these numbers
(§1.4).

### 9.1 · What Remotion owns

Remotion builds **the scene, not only its elements.** It draws the 2D sets and
the cast. It pins the cast into Blender plates through each shot's camera JSON,
and it builds the inserts, every word of on-screen text, the progress rule and
the camera moves on 2D shots.

**If an episode is leaning on something to fill time, the scene was under-built.**
The fix belongs here, never in Resolve.

**The motion contract (§3 law 11), in code terms.** Every shot is built against
`timing.json`, never against its own duration:

- **Drive from words.** `at("champagne")`, `after("expired")`. A thing the
  narration names arrives when the narration says it, and so does a character's
  reaction to it.
- **Stagger, never batch.** Five customers are five entries, each offset.
  Anything that mounts fully formed on frame one is a bug.
- **Direction is meaningful.** Characters and evidence enter from the side they
  belong on: new arrivals from the left, consequences and costs from the right.
- **Something is always alive.** When nothing is entering, the location's ambient
  life and the cast carry it: a blink, a glance, a fan, a jet. A shot with no
  motion for more than about three seconds fails.
- **Exits are animated too.** Characters leave, and props are picked up and
  carried off. A scene that only accumulates is a pile by minute nine.
- **Limited animation is the method** (§2.5). Holds and expressions do the acting.
  Walks are used only for crossings.

### 9.2 · The division — code builds, Resolve assembles

**Remotion and Blender build essentially the whole picture.** Every pixel the
viewer sees is authored in code or a scripted `.blend`, in version control,
reproducible, and synced to the word.

| Remotion owns | Resolve owns |
| --- | --- |
| 2D sets, the cast, and the cast pinned into Blender plates | Final assembly of the passes |
| **All on-screen text** — captions, callouts, hero figures, annotations | Fade in and fade out |
| **Camera movement** — push, pull, drift, settle, overshoot | The grade (§10.9) |
| **Transitions between beats** (`@remotion/transitions`) | **All audio** — VO, music, SFX, loudness (§10.8) |
| Motion blur (`@remotion/motion-blur`), shared by plate and cast | — |
| Occlusion mattes stacked over the cast (§9.8) | Delivery encode (§10.10) |

**Why text moved into code.** `timing.json` puts every spoken word on a frame.
Remotion can land a caption on the exact frame the word is said, and stagger a
callout word by word, for thirty beats, identically every render. Doing that by
hand in Resolve is hours of work that cannot be reproduced and quietly rots the
moment a beat's duration changes.

**The one real cost, and the mitigation.** Baked-in text means a typo costs a
re-render. So **text is always its own layer pass** (§9.3), never merged into
the scene pass. A wrong word costs one cheap text-pass re-render, not the
episode. Never composite text into the scene pass to save a file.
The one exception is type mapped onto a 3D surface through the anchors (§2.8).
That type is still its own pass, rendered with the shot's camera.

**What still must not be generated:** §3 law 4 is unchanged. Every word on
screen is typeset by us or is a real scan. Code-drawn text is typeset by us and
is fine; AI-generated lettering never is.

### 9.2.1 · Use the engine that is already installed

Sixteen Remotion packages are in `package.json`. **Nine have never been imported
once.** Episodes have been hand-rolling cards, charts and diagrams while the
tools to do it properly sat unused. Before writing a bespoke helper, check this
table — the answer is usually already installed.

| Package | Does | Use it for |
| --- | --- | --- |
| **`@remotion/paths`** | SVG path maths — length, point-at-length, interpolation, warping | Routes on maps, lines that draw on, a prop that rides a path. Every drawn line under §3 law 11 |
| **`@remotion/shapes`** | Real geometry — circle, rect, triangle, star, pie, ellipse | Charts, pie splits, callout frames, any prop currently hand-built from divs |
| **`@remotion/noise`** | 2D/3D/4D simplex noise | Idle life in the cast (breathing, sway), hand-wobble on "nothing perfectly aligned" (§3 law 1), organic camera float |
| **`@remotion/transitions`** | Beat-to-beat transitions with presets and timings | §9.2 — transitions now live here, not in Resolve |
| **`@remotion/motion-blur`** | Trail and camera blur | Camera moves that carry weight (§3 law 8) |
| **`@remotion/layout-utils`** | `measureText` before render | Typeset text that never overflows a card. Essential now that Remotion owns all text |
| **`@remotion/captions`** | Caption primitives, `.srt` parsing, token pages | Word-synced captions straight off `timing.json` |
| **`@remotion/media-utils`** | `getAudioData`, `visualizeAudio`, `getVideoMetadata` | Driving motion off the VO waveform; reading a plate's real duration before placing it |
| **`@remotion/google-fonts`** | Font loading | Already used. Keep using it rather than CSS imports |

Also present and barely used: **`@remotion/three`** with `three` and
`@react-three/fiber` (real 3D, two files), **`@remotion/rive`** (the old Lucky rig),
and **`@google/genai`** in one script — which never produces anything that
appears on screen (§3 law 12).

**The rule:** a bespoke implementation of something in this table is a code
review failure. Reach for the package first, and say which one a beat is using.

### 9.3 · The layer contract

Every layer composition takes:

```ts
{
  beatId:             string,
  durationInFrames:   number,   // measured at Step 2, never estimated
  fps:                24,
  globalStartFrame:   number,   // position in the assembled episode
  episodeTotalFrames: number
}
```

The progress rule, grain phase and every location's ambient loops (a fan, a
flap board) are functions of `globalStartFrame + frame`, never of local frame.
Get this wrong and the fan jumps at every beat boundary in a location the camera
never left, which is the slideshow read the scene system exists to prevent.

### 9.4 · Render specs

**Everything is authored, rendered, graded and delivered at 1920×1080, 24fps.**
Every coordinate, font size and layout number in the code is a 1080p number, the
passes come out at that size, and nothing is ever upscaled.

```bash
npx remotion render <id> out/<name>.mov \
  --codec=prores --prores-profile=4444
```

| Pass | Spec |
| --- | --- |
| Composition | 1920×1080 @ 24fps |
| Output | 1920×1080, no `--scale` |
| Scene base | ProRes 4444, opaque: the plate or 2D set with the cast composited |
| Element layers | ProRes 4444 with alpha, `yuva444p10le` |
| Blender passes | 1920×1080 @ 24fps, ProRes 4444 with alpha (§9.8) |

**Type is drawn at delivery resolution, so it is never rescued.** The old
`--scale=2` text pass existed only because 1080p passes were being upscaled to 4K.
End to end at 1080p, a 1 px line is a 1 px line from Remotion to YouTube.

Anything meant to have alpha that renders `yuv444p` still has a background and is
a build failure.

**The layer passes are the episode's master and are permanent.** There is no
ProRes master out of Resolve (§10.10) — these files are the archive. They are
reproducible, version-controlled and re-renderable at any size, and they are
never deleted to reclaim disk.

### 9.5 · Verification happens before render, not after

**This is a hard gate.**

1. Every beat is reviewed as **stills from Remotion Studio** during the build.
2. The `nif-auditor` runs the clean-frame and composition audit on those stills
   (§9.6). It did not build the episode and does not fix it.
3. Failures are fixed in code and re-checked as stills.
4. When every beat passes, the auditor writes `08_conform/stills-audit.json`
   with `"verdict": "PASS"`. That unlocks **the review proxy only** (§11.2).
5. **Full-quality renders need the creator's go**, given at the proxy watch and
   recorded as `"creatorGo"` in the same file. Code changed after the audit makes
   the audit stale. The render-guard hook
   (`D:\YT\.claude\hooks\render-guard.py`) checks all of this before a render
   command runs.

Checking after a render wastes hours and has been the most expensive recurring
mistake in this pipeline's history.

**Review the running page, not only stills.** Remotion Studio runs on localhost.
Open it, play the beat, inspect the DOM where something looks wrong, and read the
console. A still cannot show a held state, a stagger that fires all at once, or
a loop that stops — and those are exactly what §3 law 11 forbids. Screenshots go
back to the creator as proof, never "it should be working now."

**The audit that decides whether it renders**, per beat and then across the
episode:

| Check | Fails when |
| --- | --- |
| **Held state** | Any composition sits visually unchanged past ~3s (§3 law 11) |
| **Progressive arrival** | Anything mounts fully formed instead of entering in order |
| **Word-driven** | Motion is keyed to a duration rather than a `timing.json` word |
| **Repetition** | Two beats read as the same shot with different words |
| **Coverage** | A beat the narration describes has nothing in the scene doing it |
| **Text overlays** | Lines land together instead of one at a time |
| **One drawing** | Any row of §2.1 fails: a line-weight mismatch, a character unlit by the shot's light, no contact shadow, a focus mismatch, a set piece crossing type |
| **Foot lock** | Any shot with feet on screen lacks a measured `footlock_check.py` result, or its max exceeds 1 px (§9.8) |
| **Cast** | Any character that is not Lucky's rig with parameters (§2.5) |
| **Three planes** | Any frame has fewer than background, midground, foreground |

**How the auditor looks, cheapest first** (§5.4):

1. **Scripts first.** `ep-audit.mjs` and `ep-textaudit.mjs` measure contrast,
   title-safe, overlap and text timing. The auditor reads their summary.
2. **Contact sheets second.** Each beat's stills go into one grid image, three
   across and four down, taken a second apart. That is enough to judge
   composition, three planes, one subject, repetition and whether anything moves.
3. **Full-size stills last**, and only for a frame the grid or a script flagged,
   or for a §2.1 check that needs detail, such as line weight or contact shadow.

**Then render the proxy, machine-check it, and stop.** When the audit passes,
render the review proxy (§11.2) and run `motion-check.mjs` on it before grain is
applied:

```bash
node scripts/motion-check.mjs <proxy.mp4> --episode ../../episodes/NIF0NN
```

It measures two laws on every frame of the episode instead of on samples: any
stretch visually unchanged for 3 seconds or more (§3 law 11), and every shot
outside 2–9 seconds (§3 law 2), each mapped to its beat. A held state is a
failure and goes back to 3c. A long shot passes only if it is a continuous flow
shot declared in `shots.json` (§10.7). Then report it with screenshots and put
the proxy in front of the creator. The creator says go, or returns every fix in
one message. Claude never starts a full-quality render on its own judgement.

### 9.6 · The clean-frame check

A frame is clean when the eye knows where to go and nothing on it is filler.
Measured on stills by the auditor, not judged.

| Rule | Fails when |
| --- | --- |
| **One subject** | Two things compete for the first look |
| **One accent** | More than one accent-coloured element (§2.2); the progress rule does not count |
| **Readable** | A line is on screen for less than 1 s per 3 words, or lands together with another line |
| **Contrast** | Text is under 4.5:1 against its local background, or under 3:1 at 48 px and above |
| **Title-safe** | Any text or key element crosses the frame edge or the 5% title-safe margin |
| **No overlap** | Text touches or overlaps other text |
| **No filler** | Something exists only to fill space — a repeated bar, slab or counter used as furniture |
| **Baseline contact** | A solid object floats instead of touching a surface |
| **Three planes** | Fewer than background, midground and foreground (§2.3) |

**Empty is not a failure; filler is.** A frame is fixed by giving the beat a real
object doing a real thing, never by enlarging furniture or adding a decoration.
The audit scripts are `ep-stills.mjs`, `ep-audit.mjs` and `ep-textaudit.mjs` in
`engine/remotion/scripts/`.

### 9.7 · The media budget

**There is no stock.** No stock footage, no stock photos and no generated clips.
Every frame is a scene built by us (§2), or a real document shown inside one
(§9.9).

Per ten minutes of runtime:

| Tier | Share of runtime | Built by |
| --- | --- | --- |
| **L2 · Painted plates**: a Blender still from a kit angle (§9.8.1), rendered in three layers, with the cast, camera and light in Remotion | ~50% | Blender still + Remotion |
| **L1 · Drawn 2D**: SVG sets, history scenes, the case devices | ~35% | Remotion |
| **In-world inserts**: type, maps, documents, numbers, the money meter (§2.8) | ~12% | Remotion, inside a scene |
| **L3 · Moving 3D**: a Blender camera move, including the diorama orbit (§9.8.3) | ≤ 3%: at most two shots of 5–10 s, one in the cold open | Blender |

**The camera belongs to Remotion** on every L1 and L2 shot: push, drift, pan and rack
focus over the plate's three layers, under 8% of frame width (§9.8.1). L3 is the only
shot where Blender moves the camera.

The mix moves between episodes (§4.8). A story set mostly in one real place leans
2.5D, and a story that jumps across centuries leans 2D.

**Anti-repetition laws:**

- **No camera angle is used twice in an episode**, and no angle in a location is
  reused across episodes. Each location's contact sheet is the record, and it is
  checked at build time, not from memory.
- **No two consecutive shots share a location and a framing.** A cut must change
  the location, the angle or the shot size.
- **Shot lengths vary between 2 and 9 seconds** (§3 law 2).
- **Every returning shot template is re-composed**: a new location, angle and
  action (§2.7).

**The cost is measured, not assumed.** Per finished second, the pilot measured
0.7 min of agent time for 2D, **0.8 min for 2.5D when a new location was built**,
and 2–3 minutes for each further shot in an existing location. Step 3 records the
real numbers per episode (§9.0 step 7).

### 9.8 · Blender, locations and the cast

**Blender 5.2 runs headless, from scripts.** Never through the official Blender
MCP, which executes model-written code with no guards.

```bash
"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b \
  --python <shots-script>.py -- <shot> json|plate|debug <out> [frames]
```

Every location and every shot is built by a Python script kept in version
control, so a Blender shot is as reproducible as a Remotion shot.

**The location module** has three layers, as proven in
`engine/remotion/lab/scene-pilot-25d-b00/blender/`:

| Layer | Holds |
| --- | --- |
| `lib25d.py` (shared) | Scene reset, the toon material, glass, primitives, CC0 glTF loading, Line Art, the camera, the floor planners (`Walk`, `Stand`) and `export_shot()` |
| `locations.py` → `library/locations/` | One build function per location. It returns the location's **anchors**: named surfaces such as a board's corners or a counter's deck spots |
| The episode's shots script | One camera block per shot: location, word-keyed frame range, lens, render scale and the character's floor planner |

| Rule | Spec |
| --- | --- |
| Look | EEVEE toon, one cel band, Grease Pencil Line Art in ink at the cast's line weight (§2.1). The location palette (§2.2). No photoreal materials, no chromatic aberration |
| Output | 1920×1080 @ 24fps. Plates as ProRes 4444; occlusion mattes with alpha; into `05_layers/` |
| Kit plates: overscan | **2880×1620**: the composed 1080p frame, plus 10% more field on every side, at 1.25× pixel density. The Remotion camera then drifts up to 8% without showing an edge and pushes in 10% without softening the ink. Marks and anchors are exported in plate pixels, and Remotion moves them with the same transform as the plate. Check the ink weight once on the contact sheet, at a 1:1 crop |
| Defocused plates | May render at 50% and be blurred. They are out of focus, so the loss is invisible |
| Timing | Frame ranges from `timing.json` words, the same as a Remotion shot |
| L3 shots | At most two per episode, 5–10 s each: the cold open's moving shot and the diorama orbit (§9.7, §9.8.3) |
| Assets | CC0 only (§9.9): Poly Haven, Kenney, Quaternius, ambientCG. Or built by us |

**What this renderer will and will not do.** Every line below was measured on a
render, not read in a manual, and each one cost a day to find. They are the
difference between a set that looks built and one that looks flat.

| | |
| --- | --- |
| **Line Art: `OCCLUSION_ONLY`, never `EXCLUDE`** | For anything planted in a plate that must hide the set's ink. `EXCLUDE` removes an object from the Line Art computation *entirely*, so it stops being an **occluder** too, and every contour line behind it prints straight across it. `EXCLUDE` stays correct for the matte pass, where the holdout is the point |
| **The sun has to be able to reach the floor** | A built interior is a closed box. Every location declares which meshes are out of the shadow path — the roof, the glazing, the window head, the ceiling beams, the sky card. The concourse had all five between the sun and the floor, which is why nothing in it had **ever** cast a shadow, at any light preset |
| **The ramp is the whole lighting system** | The toon material runs a Diffuse BSDF through `ShaderToRGB` into a **constant** ramp that steps at 0.12. So light does not fade here — a surface either crosses the step or it does not, and **a light's reach is the edge of the lit shape**. That is the entire trick: pools with a hard border, drawn with no shadow pass anywhere |
| **The sets stay inked** | Line Art on, at the library weight, on the set and the cast alike. The pilot's sets did not look cheap because of the ink; they looked cheap because the ink had boxes to draw and no light to draw against |
| **Hang practicals low** | At ceiling height their pools merge and cover the floor, which reads as flat. Around 2.8 m the lit ellipse gets an edge. Every location declares its own practicals and turns the sun down or off — a built interior lights itself |
| **Geometry has to be worth outlining** | The outline draws the silhouette, so a box has no silhouette. Chair spindles, table knuckles, window mullions, individual books, a spout on the pot. This is what separates a drawn room from a diagram of one |
| **The toon material cannot receive a cast shadow** | `ShaderToRGB` carries no shadowing in EEVEE Next, so no lighting work will put a real shadow on a toon surface. It is rarely needed — the ramp already draws the light's shape. A surface that genuinely must take a cast shadow is built as a real material instead |
| **No world volumetrics** | A Volume Scatter on the world's Volume socket stops the world lighting surfaces at all — the floor goes black while the sky still renders bright through the glass. Haze comes from the **mist pass in the compositor**, which costs nothing and does not touch the lighting |
| **The blur is not Blender's** | EEVEE produced no depth of field at any aperture — f/2.8 and f/0.7 rendered pixel-identical — and a Defocus node on the Z pass did nothing either. Defocus is a Remotion (`blurPx`) or Resolve job on a depth pass (§2.1, same focus) |
| **Aim lights by explicit Euler** | `Vector.to_track_quat("-Z", "Y")` is degenerate when the direction is near ±Y and silently aims the light somewhere else. A sun travels `(−sin rz · sin rx, cos rz · sin rx, −cos rx)` |

**The camera JSON is the contract between Blender and Remotion.**
`export_shot()` writes `05_layers/cams/cam-<shot>.json` by write-then-rename, so
Studio's hot reload never reads a half-written file. Per frame it carries:

- **the floor match**: the character's root point in screen space and pixels per
  metre, from the floor planner
- **the anchors**: each named surface's screen position. Type and 2D props ride a
  3D surface through an SVG `matrix()` built from three projected corners
  (`quadMatrix`)
- **the light**: the key light's screen-space direction and colour, and the
  ambient colour. Remotion uses them to tint, shade and rim the cast, and to cast
  the contact shadow (§2.1)

**The occlusion pass.** Every set piece that crosses in front of a character's
position renders to its own matte. Remotion stacks plate, then cast, then matte,
so a pillar can pass in front of Lucky. A shot without a matte keeps the
fallback rule: nothing may cross in front of the character, and nothing may
cross typeset text.

**The foot-lock gate** applies to walks in a **moving** Blender shot (a hero shot).
A kit shot is exact by construction (§9.8.1). On a moving shot with feet on screen:
1. Blender draws a red pin at every planned footfall (`debug`).
2. Remotion draws a cyan cross on each planted ankle (the `Pins-<shot>` composition).
3. `footlock_check.py` measures the distance between them on 10 stills.

**Pass: max ≤1 px.** The pilot measured ≤0.9 px on all three shots it tested.
Any fix that moves a character or a camera on such a shot re-runs the gate.

**The cast is always the 2D rig in Remotion** (§2.5), in every tier. There is no
3D Lucky until a modelled, rigged 3D character is approved on its own pilot.

**Lip sync comes from Rhubarb** mouth cues made at Step 2 (§8.4). Step 3 reads
`03_transcript/mouth/B##.json` and never runs Rhubarb itself. The nine shapes
(A–H, X) drive the mouth frame by frame.

**Render only what moves.** Most plates cost far more than they need to:

- **A locked-off camera with no character inside the plate (§2.5, the exception)
  renders one plate frame.** The ambient life (a fan, a
  flap board, steam) renders as its own small alpha pass, one loop long, and
  Remotion loops it from `globalStartFrame + frame` (§9.3). A 9-second held shot
  becomes one frame and a two-second loop instead of 216 full frames.
- **Plates render in parallel.** Each Blender process takes its own frame range
  (`-s` / `-e`), as many at once as GPU memory allows.
- **EEVEE samples stay low.** A toon ramp has no soft falloff to clean up, so the
  sample count that removes the ink's aliasing is the right one. It is set once
  per location, on stills, and written into the location's build file.
- **Blender runs with `--quiet`.** Its progress lines are not read by anyone.

### 9.8.1 · Stage & Marks

**A location is a stage with measured marks, the way a theatre floor is taped.** The
expensive part of a 2.5D shot was never the render. It was finding, one shot at a time,
where a character can stand: inside a table or not, feet hidden or not, lit or not,
and then proving foot lock on stills. All of that is a property of the angle, not of
the shot, so it is measured once per angle in 3a.

**The angle kit** lives in `video-os/library/locations/<name>/kit/`. Per angle `Ann`:

| File | What it is |
| --- | --- |
| `Ann.far.png`, `Ann.set.png` | The locked-off plate in two layers, overscanned (§9.8): **far** renders with set and near excluded, so it is whole behind them; **set** has a holdout where far shows through. The ambient-life loop sits beside them when there is one (§9.8, render only what moves) |
| `Ann.fg.png` | The **near** layer: the foreground occluders only, with alpha, rendered once. Remotion stacks far, set, cast, near |
| `Ann.mist.png`, `Ann.practical.png` | Depth for the blur (A4), and the practicals mask for bloom (A3) |
| `Ann.marks.json` | Every floor mark (a 0.5 m grid): screen foot point, pixels per metre, `free`, `feet_visible`, `head_visible`, `in_frame`, `lit` (sampled from the plate itself), the nearest light's screen x, distance |
| `Ann.cam.json` | The camera and the anchors: board corners, counter edges, the surfaces type rides on |

`marks.export()` (`engine/remotion/lab/sap-upgrade-demo/marks.py`, promoted into
`lib25d.py`) writes the marks after the plate renders. A kit of twelve angles is one
script run and a contact sheet with the marks drawn on it, so it is checked once, by eye,
in 3a.

**What this buys, rule by rule:**

| Rule | Before | With marks |
| --- | --- | --- |
| Foot lock (§9.8) | Pins, crosses, 10 stills, `footlock_check.py`, a re-run after every fix | Exact by construction: the rig's feet sit on a projected floor point of the same locked camera. **The gate applies only to walks in a moving Blender shot** |
| Same ground (§2.1) | Judged per shot | `lit` comes from the plate at that exact spot. A character is lit if and only if the floor under it is |
| Occlusion (§9.8) | A matte pass per shot | `Ann.fg.png` once per angle |
| Empty slots, bare shots, a figure inside furniture | Found on stills, fixed, re-rendered | `place-check.mjs` fails them before anything renders |
| Anti-repetition (§9.7) | Checked from memory | An angle is marked used in `INDEX.md` once an episode ships, and `place-check` refuses a reused one |

**Camera movement on a kit shot happens in Remotion**: a push, a drift or a pan across
the plate layers with parallax, about 3–8% of frame width, on an overscanned plate
(§9.8). It reads as a camera and costs nothing. A real move through the space stays an
L3 shot, at most two per episode (§9.7).

**The cast moves with the floor it stands on.** The plate renders as three layers:
**far** (what lies beyond the action: the back wall, the window view, the sky), **set**
(the floor and everything at the action's depth, with a holdout where far shows
through) and **near** (the foreground occluders, `Ann.fg.png`, with alpha). The set
layer and the cast share one transform. Far moves less and near moves more. Moving the
cast faster than its floor slides the feet across it, the exact foot-lock failure the
marks removed.

**A walk on a kit shot** goes in a straight line between two marks. `place-check`
refuses one that crosses furniture. The walk cycle's planted foot follows the projected
line, which is exact because the camera does not move.

### 9.8.2 · The shot ladder

**A shot that fails a gate twice goes down a rung. It never gets a third attempt.**
Ten hours of 3b is what a fix-and-rerender loop with no floor costs.

| Rung | The shot becomes | Cost |
| --- | --- | --- |
| 1 · Hero | A moving Blender shot with the cast pinned in | Highest. At most two an episode (§9.7) |
| 2 · Kit | A locked-off kit angle, marks, a Remotion camera drift | Data plus one Remotion render |
| 3 · Kit, feet out | The same, framed or cropped so no feet are on screen (a counter, a foreground crop) | Removes foot lock and most placement failures |
| 4 · 2D | A 2D scene in Remotion (§2.3) | The cheapest shot the channel makes |

The rung each shot lands on is recorded in `project.json`, next to the cost (§9.0
step 7). An episode where more than a quarter of its 2.5D shots fell two rungs is a
3a problem: the kit's angles do not fit how the channel stages scenes, and the next
kit is planned differently.

### 9.8.3 · The diorama orbit

**One built set, the camera arcing around it for 5–10 seconds, roof off, with
miniature focus.** It is the cheapest spectacular shot the channel has: the location
already exists for its kit, so the orbit is a camera path and GPU time, not new
building.

| Part | Spec |
| --- | --- |
| Camera | An arc of 50–90° around a centre point, high (6–8 m), easing in and out, settling slightly lower as it arrives. Front arc only, where the set has no wall. It is a parameter set in the location's orbit template (`--shot orbit`), never hand-keyed |
| The set | Roof and ceiling off, so the room reads as a model on a table. Pools of light stay on |
| Focus | Stronger depth falloff than an L2 shot (the mist pass, §9.8.1): the sharp band sits on the scene of the crime, and the near and far edges soften. This is what makes it read as a miniature |
| Type | Location labels and suspect labels float over the model on exported anchors (§2.8), fading in after the camera settles |
| Cast | The 2D rig, drawn at its foot point projected **every frame** from the orbit's anchors, and kept under about a tenth of the frame's height. The figures don't turn with the camera; at that size they read as figures on a model, which is the look |
| Life | Something moves: a jet taxiing, a door, the lamps |

**Three uses, one per episode at most:** the cold open's establishing shot, the
reveal of a new location, or **the frozen moment**: the reconstruction (§7.3) as an
orbit around the crime stopped in time, with each suspect labelled where they stand.
Rendering takes minutes of GPU time. Agent time is one template call.

### 9.8.4 · Setups, not shots (3c)

**A setup is a set, a staging and a camera vocabulary. A shot is a data row inside
it.** An episode that builds every shot as its own component pays for 98
compositions. An episode that builds 15–20 setups and lists its shots as rows pays for
20, and cuts just as often.

- **3c builds setups first.** Group every shot in `shots.json` by location, staging and
  who is in frame. Each group becomes one parameterised Remotion component with its
  camera moves (wide, push, close, drift) as props.
- **Then shots are rows:** setup, camera move, the word it starts on, what arrives.
  No new component for a shot a setup can already make.
- **Target: at most one setup per four shots.** §9.7's anti-repetition laws still
  hold: no two consecutive shots share a location *and* a framing, so a setup's
  shots are interleaved with other setups, never run back to back.
- **3c works in batches of setups**, each ending with `08_conform/3c-progress.json`,
  so a session that hits a usage limit resumes without re-reading anything.

### 9.9 · Archival and free sources

**Licence first, then the picture.** An item goes into `04_archival/` only when its
licence allows commercial use, and its source URL, licence and credit line are
written to `video-os/library/stock-ledger.json` at the same moment.

| Source | What is safe | Watch out for |
| --- | --- | --- |
| NASA Image and Video Library | Most NASA media is not copyrighted | No NASA logo or insignia, no implied endorsement; items credited to a third party are that party's |
| Library of Congress | Items marked "no known restrictions" | The rights statement is per item — read it |
| US National Archives | Works of the federal government | Donated collections may carry copyright |
| Internet Archive, Prelinger | Items marked public domain | A public-domain film can carry copyrighted music — Content ID will find it |
| Met, Rijksmuseum, Cleveland, Art Institute of Chicago | CC0 open-access works | Only the open-access images, not every image on the site |
| Smithsonian Open Access | CC0 items | Needs a free api.data.gov key |
| Wikimedia Commons | Public domain, CC0, CC-BY | Never CC-BY-SA or NC; the licence is per file |
| Poly Haven, Kenney, Quaternius, ambientCG | CC0 3D models, textures, HDRIs | — |

**Search with the archive MCPs, fetch with a script.** `open-museum` and
`internet-archive` are loaded only inside the `nif-builder` agent and are for
finding items. Downloads go through a script that writes the ledger entry, so no
item arrives without its licence.

**Attribution goes in the description** whenever the licence asks for it (§13.3).
An item whose licence cannot be established does not go in the episode.

### 9.10 · The thumbnail

**Built from the episode's own world, never generated** (§3 law 12). The
thumbnail concept is agreed at Step 0 as one frame of one scene (§6.5). At Step 3
it is built as a real shot: the location from a thumbnail-only angle, the cast
posed with the expression pushed one step further than in the episode, the one
object, and at most three words of typeset text. It is rendered as a 1920×1080
still into `07_packaging/` in two or three variants.

The rules:
- **Readable at 10% size.** One subject, one face, one object, checked on a
  downscaled still before it is shown.
- **It shows something the episode delivers.** A thumbnail that promises a scene
  that does not exist is a retention failure dressed up as a CTR win.
- **Claude recommends and the creator decides**, checking title and thumbnail in
  vidIQ before upload.

---

## 10 · Step 4 · Resolve

Resolve is the assembly, motion, text and delivery layer. It is driven through
the Resolve MCP. **The creator does not perform manual Resolve operations** —
if a thing needs doing, Claude does it or says plainly that it cannot.

### 10.1 · The Resolve MCP

Resolve Studio 21.1 exposes a **native MCP server** (`DaVinci Resolve Studio` in
Claude). It is the primary Resolve interface for this pipeline. It runs sandboxed
Python 3.14 against the live scripting API, with `resolve` and `project`
pre-injected.

| Tool | Use |
| --- | --- |
| `get_resolve_status` | Is Resolve up, and on what version |
| `launch_resolve` | Start it if not |
| `search_scripting_api` | Find the types and methods covering a topic |
| `get_scripting_api` | Fetch `.pyi` stubs — `DaVinciResolveScript`, `fusion_api`, `ui_api` |
| `get_scripting_docs` | Developer documentation |
| `get_whats_new` | Changelog since a given version |
| `run_script` | Sandboxed — no filesystem, network or process access |
| `run_script_unsafe` | Only when the task genuinely needs the filesystem |
| `generate_lut` / `list_luts` / `list_dctls` / `update_dctl` | Grade assets |

**Always call `get_whats_new` at the start of a Resolve session.** Blackmagic adds
major features faster than any model's training cutoff, and this pipeline depends
on 21.1-only calls.

**Always read the stub before calling a method.** Every capability below initially
returned `false` purely because of wrong parameter names — the API fails silently
rather than raising. Check the TypedDict with `get_scripting_api(types=[...])`
first; a `false` return is far more often a bad key than a missing feature.

### 10.2 · Verified capabilities

Probed live against Resolve Studio 21.1.0.14 on a disposable project, using real
episode renders. All six pass. These are confirmed, not assumed.

| Capability | Call | Status |
| --- | --- | --- |
| Transitions | `TimelineItem.AddTransition` | PASS |
| Fades | `TimelineItem.SetFades` / `GetFades` | PASS |
| Speed change | `TimelineItem.SetSpeed` / `GetSpeed` | PASS |
| Loudness | `Timeline.NormalizeAudioLevel` | PASS |
| Transcription | `MediaPoolItem.GetTranscription` | PASS (API present) |
| Fusion graph | `Composition.AddTool`, `SetInput`, `ConnectInput` | PASS |

**The four traps, all found the hard way:**

1. **`AddTransition` needs `alignment` *and* handles.** Omit `alignment` and it
   returns `false` with no error. The clips must also have media beyond the cut —
   append with explicit `startFrame`/`endFrame` so handles exist, or there is
   nothing to dissolve through. Working call:
   ```python
   item.AddTransition({"type": "Cross Dissolve", "category": "simple",
                       "position": "start", "alignment": "center", "duration": 12})
   ```
2. **`SetSpeed` takes `Percentage`, not a ratio**, and only works on real media —
   a Fusion generator has nothing to retime. `{"Percentage": 108.0}` returns
   `{"Percentage": 108.0, "PitchCorrection": True}`.
3. **Loudness modes take `targetLoudness` (LKFS), not `targetLevel` (dBFS).**
4. **`NormalizeAudioLevel` needs audio items**, passed from
   `GetItemListInTrack("audio", n)` — not the video items.

**Resolve ships a `YouTube` normalization preset.** `GetNormalizeAudioModes()`
returns it alongside EBU R128, ATSC A/85 and Netflix. It is the correct mode for
this channel and it maps directly onto the -14 LUFS target:

```python
timeline.NormalizeAudioLevel(audio_items,
    {"normalizationMode": "YouTube", "targetLoudness": -14.0})
```

**Fusion is fully scriptable, including animation.** `Composition.AddTool` creates
`Background`, `Transform`, `Blur`, `TextPlus` and `Merge`; `ConnectInput` wires
them; and `SetInput(id, value, time)` **writes a keyframe at a frame**, which is
what makes 2.5D parallax, motion blur and animated text achievable in code rather
than by hand:

```python
comp = item.AddFusionComp()
xf = comp.AddTool("Transform", False, 1, 0)
xf.SetInput("Center", {1: 0.2, 2: 0.5}, 0)     # keyframe at frame 0
xf.SetInput("Center", {1: 0.8, 2: 0.5}, 48)    # keyframe at frame 48
xf.SetInput("MotionBlur", 1.0, 0)
```

### 10.3 · Probe before promising

Any capability not in the table above is probed on a **disposable project**
(`_NIF_CAPABILITY_PROBE`), against real media, and deleted afterwards — never on
a live episode. Nothing is reported as working because a release note says so.

**Anything that fails stays in Remotion until it passes.**

### 10.4 · Project settings and scaling

The timeline is the same size as everything upstream. **Nothing is scaled.**

```python
project.SetSetting("timelineResolutionWidth", "1920")
project.SetSetting("timelineResolutionHeight", "1080")
project.SetSetting("timelineFrameRate", "24")
```

Every layer pass enters at 1920×1080 and sits at 1:1. There is no resize filter to
choose and no Super Scale rescue, because there is no rescaling anywhere in the
chain. Real archival documents are placed inside their scene in Remotion at native
size (§9.9) and never reach Resolve on their own.

### 10.5 · Timeline structure

**The timeline is a file, not a session of clicks.** `make-timeline.mjs` writes the
whole timeline as one OpenTimelineIO file from `timing.json`, with every clip on its
beat's first frame. Resolve imports it in one MCP call:

```bash
node scripts/make-timeline.mjs ../../episodes/NIF0NN     # → 08_conform/timeline.otio
```
```python
project.GetMediaPool().ImportTimelineFromFile(
    r"<episode>\08_conform\timeline.otio", {"timelineName": "NIF0NN", "importSourceClips": True})
```

A changed beat is a re-run of the script and a re-import, never a hand edit.
Missing layers are listed and placed as gaps, so a partial build still assembles.
First use on this machine is a capability probe (§10.3) on `_NIF_CAPABILITY_PROBE`.

```
V1 — scene base passes (plate or 2D set with the cast composited)
V2 — element layers (alpha), including occlusion mattes where a shot needs them
V3 — text, callouts, annotation  (rendered BY REMOTION as its own alpha pass, §9.2)
A1 — voiceover
A2 — music
A3 — SFX
```

### 10.5.1 · Power Bins — the shared toolkit

Presets, captions and camera moves live in **Power Bins**, never in a project's
own Master bin. A Master bin belongs to one project and vanishes with it; a
Power Bin is visible in every project on the database, which is the only way a
toolkit survives past one episode.

Standing bins:

| Power Bin | Holds |
| --- | --- |
| `NIF / Captions` | Caption and subtitle styles |
| `NIF / Text` | Text+ presets, fade-ups, highlights |
| `NIF / Camera` | Zooms, reveals, shakes, drifts — the §10.6 vocabulary |
| `NIF / Transitions` | Anything used between beats |

**Anything built in Resolve that could serve a second episode is filed into one
of these before the project closes.** A preset left loose in a timeline is lost.

**Power Bins are not in the Resolve scripting API** — no `PowerBin` object, no
getter, no setter. Promoting a bin is a manual drag in the Media Pool.

**So the toolkit is carried by a template project instead, which is scriptable
end to end.** `video-os/library/NIF-TOOLKIT-TEMPLATE.drp` holds the four bins.
Every episode project is created by importing it, so the toolkit is present from
the first frame without anyone dragging anything:

```
project_manager.import_project(
  path="video-os/library/NIF-TOOLKIT-TEMPLATE.drp", name="NIF0NN")
```

Presets built during an episode are added back to the template, and the template
is re-exported, so it accumulates. The template is the source of truth; a preset
that exists only inside one episode's project is lost when that project closes.

If Power Bins are ever wanted as well, promoting them is a one-time manual step
and the template stops being needed. Until then nothing about this pipeline
requires the creator to touch the Media Pool.

Two standing checks on anything filed:

- **Name it.** A bin of fourteen items called `Text+` is not a toolkit. Every
  item carries the name of what it does.
- **Check the resolution.** The timeline is 1080p (§10.4), the same as every pass
  entering it. A Resolve preset that draws its own type or lines is built at 1080p,
  or the job moves into Remotion.

### 10.6 · Motion in Resolve

Resolve's only motion job is the fade in and the fade out. Every other move is
built in Remotion (§9.2), with `@remotion/paths`, `@remotion/noise` and
`@remotion/motion-blur` (§9.2.1), because there it is synced to `timing.json` words
and reproduced on every render. The vocabulary the camera works from:

- **2.5D parallax.** One camera move over the layers: far moves least, near most,
  and the cast moves with the set layer it stands on (§9.8.1)
- **Elements entering** from left, right, top or bottom, with overshoot and
  settle. Never linear, never a one-second opacity fade
- **Motion blur** on every moving element
- **Depth ordering.** Elements arrive back to front
- **Text, arrows and lines** animate on; they never pop

### 10.7 · Transitions

Built in Remotion (§9.2), with `@remotion/transitions`. Resolve owns only the
fade in and the fade out.

**A cut is the default.** Beat-to-beat is a hard cut or a match cut on a shared
object.

A transition is used only when the story changes **location, time, or point of
view**. Never applied per beat, never applied on a schedule. Transitions are for
meaning; applying one at every boundary produces a slideshow, which is the exact
thing the scene system exists to prevent.

**Continuous flow shots** — a single camera move carrying across three or four
beats without a cut, with the scene changing around it — are the strongest tool
available and should be used at least twice per episode. Each one is declared in
`shots.json` with `"flow": true`, which is what lets it run past nine seconds
through the motion check (§9.5).

### 10.8 · Audio

**The delivered mix is made by `06_audio/mix-final.mjs`, not by Resolve faders.**
Resolve exports three stems — voice, music, effects — and ffmpeg does the rest:
voice EQ and compression, side-chain ducking of the music by the voice, a
brick-wall limiter, then two-pass `loudnorm`. When the creator asks to change a
level, the change is made in that script. Saying "I'll move the fader" is wrong
and will be overwritten on the next mix.

| Target | Value |
| --- | --- |
| Master integrated | **−14 LUFS** |
| True peak | **−1.5 dBTP** |
| Music, every clip in Resolve | **−22 dB** |
| Effects | −4 dB in total, as placed, measured in LUFS against the voice |

Locked chain values live in `video-os/library/nif-look/README.md` (§10.9) and are
not re-tuned per episode.

**Measure balance in integrated LUFS relative to the voice — never by ear alone,
and never by dB-window medians.** On NIF007 the music and effects went through
four rounds of "too loud / too quiet" because the levels were judged by ear while
noise masked the music. Quote the gap as a number every time:

```
voice  −18.2 LUFS      music  ≈24 dB under the voice
                       effects ≈15 dB under the voice
```

Voice stays dominant. Music supports, never competes. Silence is used
deliberately. At the reversal:

```
music → duck → brief silence → the reveal → music returns
```

Sound effects mark meaningful events only. Not every animation gets a sound. SFX
cues derive from the real beat schedule, never guessed in advance. No room tone,
and no filtered-noise "paper" sounds — both were tried and rejected.

### 10.8.1 · Audio provenance

**Music and sound effects come from five standing sources, and nowhere else.**
All free; no paid library.

| # | Source | For | Rule |
| --- | --- | --- | --- |
| 1 | **YouTube Audio Library** | Music, first choice; SFX | Log title, artist, attribution status |
| 2 | **Free Music Archive** | Music, when the Audio Library has nothing that fits | **CC0 or CC BY only**, read per track. Never NC or ND. CC BY carries its credit into the description |
| 3 | **Pixabay Sound Effects** | SFX | Pixabay Content License, no attribution |
| 4 | **Freesound** | SFX | **CC0**, or CC BY with the credit. Never NC |
| 5 | **Recorded in-house** | The episode's signature sounds — the object itself (a paper bag, a tray on a counter) | Ours |

**Pixabay Music is not used.** Some uploaders also register their tracks with
Content ID, so a claim can land on a legal use. **Incompetech is not used**
either: its tracks are so common a viewer has heard them before. No AI-generated
music.

At the moment a track or sound is chosen, record its **source, title, artist,
licence and attribution status** in the episode's audio notes, and carry any
required credit line into the description (§13.3).

**Sound effects are commercially licensed or made in-house.** The shared pack at
`engine/remotion/public/audio/nif006/sfx/` came from the YouTube Audio Library
Sound Effects tab and Pixabay Sound Effects, and is confirmed no-attribution. The
files carry no metadata, so the pack keeps a `SOURCES.md` beside it — update it
whenever the pack is touched.

A track whose licence cannot be established does not go in the episode.

### 10.9 · Grade and grain

**The grade is what makes separately built layers read as one film.** The Board
look (`nif-house.cube`, grain Power 1.8) was tuned for cream paper and is retired
with the Board. The scene look is built once, judged on stills, and locked in
`video-os/library/nif-look/`, the same way.

| Piece | Spec |
| --- | --- |
| **Show LUT** | `nif-scene.cube`, Resolve Colour page, node 1. Warm and slightly lifted in the shadows, so ink stays ink and colour stays flat. One LUT for every episode. **To be built** on the first scene-system episode's stills |
| **Location balance** | Node 2, per location, saved as a still in the gallery named after the location. It brings each set's palette into the show look, so a deli and a concourse feel like the same film |
| **Bloom** | A soft glow on practicals only: lamps, windows, screens. Never over the whole frame |
| **Vignette** | Fusion `Vignette`: size 0.9, softness 0.85, transparency 0.9, Blend 0.22 (unchanged) |
| **Grain** | Fusion `Grain`, monochrome. Power is re-judged for flat colour. Expect lighter than the Board's 1.8 |
| Wiring | `MediaIn1 → Grain1 → Vignette1 → MediaOut1` |

**Use the Fusion `Grain` tool, not the OFX "Film Grain"**, which uses an Overlay
blend that vanishes on flat colour.

**The grade cannot rescue a pasted character.** If a character looks stuck on,
the fault is in §2.1 (light, line, contact shadow, focus) and is fixed in
Remotion, never in Resolve.

**Any look change is verified before a long render.** Show the creator three
things first:
- the whole frame at viewer size
- a 2× crop of a flat colour field and of a character's edge
- the noise number
### 10.10 · Delivery

**One file.** There is no ProRes master from Resolve — NIF007 rendered a 63 GB
one that was never used for anything.

| File | Spec |
| --- | --- |
| Upload | H.265, Main10, 1920×1080, 24fps, ~20 Mbps, AAC 48 kHz |

**The archive is the Remotion and Blender layer passes** (§9.4), which are the true masters:
reproducible, version-controlled, and re-renderable at any size. They are
permanent and are never deleted to reclaim space.

```python
project.SetRenderSettings({
    "TargetDir": "<episode>/09_master", "CustomName": "NIF0NN-picture",
    "FormatWidth": 1920, "FormatHeight": 1080, "FrameRate": 24.0,
    "PixelAspectRatio": "square",
    "VideoQuality": 20000,           # starting point; raise only if the stream bands
    "EncodingProfile": "Main10",     # 10-bit
    "NetworkOptimization": True,
    "ExportVideo": True, "ExportAudio": False,
})  # format "mp4", codec "H265"
```

**Audio is muxed in last, never rendered with the picture** (§11.3). The picture
render produces silent video; ffmpeg muxes the finished mix.

**10-bit is not optional.** The look is large flat colour fields (§2), and flat
fields are exactly where 8-bit banding shows. `Main10` plus the grain is what
keeps them clean.

**Bitrate.** ~20 Mbps is the starting point for 1080p24, which is generous against
YouTube's own reference for the tier. Raise it only if **YouTube's own stream** —
not the local file — shows banding on a flat colour field with grain.

**The 1080p decision, stated once.** 4K delivery was retired on 2026-09-23. A 4K
upload buys a better codec tier from YouTube, but nothing in this pipeline is
authored above 1080p, so the entire benefit came from upscaling — which cost render
time, a text-rescue pass and a resize filter to argue about. If the flat fields ever
band on the published stream, the fix is the grain and the bitrate, not the size.

**Hardware encoding.** `H265_NVIDIA` is far faster and is fine for proxies and
review cuts. **The upload file is always software-encoded** — hardware encoders
are tuned for speed and the difference shows on flat colour.

**QC before upload.** Measure and report: duration, resolution, frame rate,
integrated LUFS, true peak, and completeness. A file that fails QC is not
delivered. The numbers come from two commands, never from a player's info panel:

```bash
ffprobe -v error -show_entries format=duration:stream=codec_name,profile,width,height,r_frame_rate,pix_fmt,bit_rate -of compact 09_master/NIF0NN.mp4
ffmpeg -hide_banner -nostats -i 09_master/NIF0NN.mp4 -map 0:a -af ebur128=peak=true -f null - 2>&1 | tail -n 12
```

## 11 · Render discipline

NIF007 rendered the board once (~98 min) and the text once (~34 min), then burned
a 63 GB ProRes master nobody used, several H.265 picture renders that were
cancelled or superseded over grain, and four audio re-mixes. Almost all of it was
avoidable. The causes were specific: look decisions were judged only *after* a
full render, the creator saw the whole episode with sound only after the final
render, and every stage was an ad-hoc inline call.

### 11.1 · The look is locked in the library

LUT, grain, vignette and the voice/music/effects chain live in
`video-os/library/nif-look/` and the toolkit template (§10.9). **There is no
per-episode grain or grade iteration** unless the creator asks for it. A look
change is a library change, verified on stills, and it applies to every episode
after it.

### 11.2 · Review proxy before any full-quality render

After the stills audit passes (§9.5) and **before any full-quality render**,
build a small full-length proxy. It needs no separate go — the audit's PASS is
what unlocks it:

- ~540p — Remotion `--scale=0.25` to `0.5`
- the grade applied with ffmpeg `lut3d`
- **the real, final mixed audio**
- hardware-encoded, since nobody archives it (§10.10)

`motion-check.mjs` runs on it before the creator sees it (§9.5), so the watch is
spent on pacing, music and look, not on finding frozen frames.

The creator watches the whole episode once, with sound, and returns **every fix
in one message** — or says go, which is recorded as `creatorGo` in
`08_conform/stills-audit.json`. Only then do the full-quality layer renders
start.

This exists because a person cannot judge pacing, music level or grain from
stills, and finding those problems after a 98-minute render is how NIF007 lost
most of its time.

### 11.3 · Picture and audio are independent

**One picture render**, silent. Audio is iterated in ffmpeg on stems and muxed in
last (§10.10).

**An audio change must never trigger a picture render.** Four of NIF007's
re-renders were music-level changes that had no business touching a frame.

### 11.4 · Fix renders are frame ranges

A fix re-renders **only the affected frames** (`--frames`) and stitches them in.
Never the whole episode. Never a whole beat when a range will do.

### 11.5 · The conform is scripted

Each stage is a reusable script in `video-os/engine/scripts/`, one command per
stage: place VO at plan rates, place SFX from the cue plan, render stems, mix,
mux, QC numbers. Not an inline call invented per episode.

The current `nif007-*.mjs` sprawl is the anti-pattern: a dozen one-off scripts
that solved this episode and teach the next one nothing.

### 11.6 · Ask before any long render

Before starting a render longer than a few minutes, state:

1. **what** will be rendered,
2. **why it cannot be batched** with any pending fix,
3. **how long** it is expected to take,

and then ask. This is CLAUDE.md rule 4 and it is not optional.

---

## 12 · Gates

Every gate is pass/fail. A failure stops the step. Gates are grouped by the step
that checks them first, so a session reads only its own block (§0.1). A gate that
is checked again later lists every step in its Step column.

### 12.0 · Step 0 · Intake

| Gate | Step | Test |
| --- | --- | --- |
| Evidence | 0 | A proven outlier clears the §6.2 floor for its age and is ≥ 3× its channel's baseline, measured by `vph.mjs` |
| Case test | 0 | All eleven rows of §6.2.1 pass, written to `00_intake/case-test.md` with the case score (§6.2.2), and `saturation.md` beside it |
| Cold answer | 0 | A fresh model given only the title's question does not name the culprit |
| Why ours | 0 | Three specific things ours has that each of the top three videos lacks |
| POV | 0 | The viewer is the one paying |
| Object | 0 | One concrete object carries the episode |
| Why | 0, 1 | Every §4.5 row answered in writing, none answered with the topic |
| Location cap | 0, 3 | At most two new locations; no camera angle reused within or across episodes |
| Postmortem | 0 | `00_intake/postmortem.md` covers the last two episodes: both numbers against the gates, every dip mapped to a beat with a named cause (§6.1) |
| Keyword | 0 | One primary keyword per candidate, with volume and competition read in vidIQ |
| No spend | 0, 5 | No vidIQ credit spent and nothing on the channel changed by Claude (§6, browser rules) |

### 12.1 · Step 1 · Script

| Gate | Step | Test |
| --- | --- | --- |
| Front-loading | 1 | Mechanism starts by B04; never 3+ consecutive stat beats |
| Humanizer | 1 | `humanizer` run on the script and beats; no fact added; read-aloud passed |
| Object carries it | 1 | Every beat demonstrable with the object; sound-off test passed (§4.6) |
| First payoff | 1 | Delivered and closed by ~40% |
| Beat loops | 1 | No beat resolves without opening the next |
| Stageable | 1 | Every beat names a place and a thing a scene can stage; `shots.json` written |
| Cold-open story | 1 | 15–30 s, true, the payer in it, one laugh in the picture, ends on the weird fact; nothing before it |
| Pre-VO lock | 1 | Script, citations, runtime, cold open all final |
| Uniqueness quota | 1, 3 | 2–3 net-new visible mechanisms, named at Step 1, built at Step 3 |
| Promise delivery | 1 | The promise lands by ~40%: the red herring is cleared |
| Story ratio | 1 | Every beat has a mode; MECHANISM ≤ 35% of runtime; no MECHANISM run over 45 s (§4.6) |
| Suspects sourced | 1 | Every suspect and the culprit named with a source; no crime alleged |
| No advice | 1 | The close says what the viewer will notice, never what they should do |
| Case devices | 1, 3 | Three of the seven devices, not the same three as the last episode (§2.8) |
| Lessons | 1 | Every DO NOT REPEAT line from the postmortem and `lessons.md` answered in `beats.md` with a beat and a line (§7.0) |

### 12.2 · Step 2 · VO

| Gate | Step | Test |
| --- | --- | --- |
| Voice | 2 | SAP Narrator on `eleven_multilingual_v2`, PLAIN block, speed 1.00, fixed seed; dry run before generation |
| Reconcile | 2 | Every EST replaced by a measured duration |
| FPS | 2 | `--fps 24` passed to transcribe, build-timing and reconcile |
| Word timing | 2 | `timing.json` written; every beat has word-level entries |
| WPM | 2 | Every beat inside its band, or logged for Resolve correction. Never re-generated |
| One render | 2 | Zero beats generated twice. `--force` used only on a broken file, never on pace |
| Chapters | 2 | Exact starts from `timing.json`, phrased as answers not labels |
| Mouth cues | 2 | `03_transcript/mouth/B##.json` for every beat where Lucky speaks, `--dialogFile` used (§8.4) |

### 12.3 · Step 3 · Build

| Gate | Step | Test |
| --- | --- | --- |
| Cold open first | 3 | The cold open built and its proxy watched by the creator before any other shot is built |
| Setups | 3 | 3c builds setups, then shots as rows: at most one setup per four shots, with progress written per batch (§9.8.4) |
| Orbit | 3 | At most one diorama orbit, 5–10 s, from the location's template (§9.8.3) |
| Title echo | 3 | The title's object is in the first image, and its key words are in the world by 0:15 (§4.1) |
| Stills review | 3 | Every beat passes on stills; `stills-audit.json` verdict PASS, written by `nif-auditor` |
| Clean frame | 3 | Every row of §9.6 passes on every beat |
| Lip sync | 3 | Lucky's mouth driven by the Step 2 Rhubarb cues (§8.4) |
| Licence | 3 | Every archival and 3D item's licence, source URL and credit in `stock-ledger.json` |
| Placement | 3 | `place-check.mjs` PASS on every 2.5D kit shot: marks free, in title-safe, heads visible, feet visible or declared hidden, no bare shot, no reused angle (§9.8.1) |
| Foot lock | 3 | Walks in a **moving** Blender shot only: measured by `footlock_check.py` on 10 stills, max ≤1 px. Kit shots are exact by construction |
| Fix cap | 3 | No shot fixed more than twice. The third failure moves it down the ladder (§9.8.2), recorded in `project.json` |
| Angle kit | 3 | A new location ships with twelve kit angles: plate, fg matte, passes, marks, contact sheet (§9.8.1) |
| One drawing | 3 | Every §2.1 row passes on every shot: line, shading, light, contact shadow, focus, motion, occlusion |
| Cast | 3 | Every character is Lucky's rig with parameters; no second rig |
| Three planes | 3 | Every frame has background, midground, foreground |
| Layer alpha | 3 | Element passes are `yuva444p10le` |
| Title question | 3 | Nothing before the story and no channel card; the title's question spoken at the story's end (~0:15–0:35) and landing in the world, never on a blank field |
| Section cards | 3 | A 1–3 word card after each mini-payoff; entrance varies per episode |
| No stock | 3 | Zero stock footage or photos; archival only as real documents inside a scene |
| Review proxy | 3, 4 | Full-length ~540p pass with final audio watched before any full-quality render |
| Render go | 3, 4 | Proxy only after audit PASS; full-quality renders only with `creatorGo` recorded at the proxy watch |
| No held state | 3 | No composition visually unchanged for more than ~3s, measured on the proxy by `motion-check.mjs`; nothing mounts fully formed |
| Word-driven | 3 | Beats animate against `timing.json` words, not against total duration |
| Layer render | 3 | Passes at 1920×1080 ProRes 4444; kept permanently |
| Thumbnail | 3 | Built from the episode's own set and cast, readable at 10%, shows something the episode delivers |
| Cost recorded | 3 | Agent minutes per finished second, split 3a/3b/3c, in `project.json` |
| No AI imagery | 3 | Zero AI-generated video, images, textures or words anywhere on screen |
| Motion check | 3 | `motion-check.mjs` on the proxy: zero held states; every shot 2–9 s or a declared flow shot |

### 12.4 · Step 4 · Resolve

| Gate | Step | Test |
| --- | --- | --- |
| Silent picture | 4 | Picture rendered without audio; mix muxed last |
| Audio provenance | 4 | Every music track’s title, artist and attribution recorded |
| Look unchanged | 4 | Show LUT, location balance, grain and vignette taken from the library, not re-tuned |
| Delivery format | 4 | 1920×1080 @ 24fps, 10-bit Main10, ~20 Mbps, one file |
| Stub read | 4 | Every new Resolve method’s TypedDict read before it is called |
| Capability probe | 4 | Anything outside the verified table probed on a disposable project first |
| Loudness | 4 | −14 LUFS integrated, −1.5 dBTP, music −22 dB |
| Delivery QC | 4 | Rendered file passes spec |

### 12.5 · Step 5 · Publish and learn

| Gate | Step | Test |
| --- | --- | --- |
| Pre-publish check | 5 | vidIQ content score and Review issues read on the uploaded, unpublished video; every free fix handed to the creator (§14.1) |
| Description | 5 | The four obligations of §13.3 are in the published description |
| Review | 5 | `10_review/review.md` written at 48 hours and 7 days; `lessons.md` updated and within 40 lines (§14.2–14.3) |

---

## 13 · Tooling and compliance

### 13.1 · Stack

| Layer | Tool |
| --- | --- |
| Script, beats | Claude; `humanizer` skill; MarkItDown CLI for source documents |
| Research | YouTube Studio and vidIQ read in Chrome (Rama); `yt-dlp` for transcripts, cleaned by `vtt-clean.mjs`; `watch` skill for videos |
| Evidence and review | `vph.mjs` (views per hour and outlier multiple), `dip-map.mjs` (retention moments onto beats), in `engine/remotion/scripts/` |
| Motion audit | `motion-check.mjs`: ffmpeg `freezedetect` and scene cuts on the proxy |
| Voice | ElevenLabs, SAP Narrator (Voice Design) on `eleven_multilingual_v2`, one take per beat |
| Timing | whisper.cpp, local, word-level |
| Graphics | Remotion 4.0.526+, with Remotion Agent Skills installed |
| Locations and 3D | Blender 5.2, headless (`blender -b --python`); never the Blender MCP |
| Characters | The cast rig in Remotion (SVG), `video-os/library/cast/` |
| Lip sync | Rhubarb Lip Sync 1.14.0, `C:\tools\rhubarb\Rhubarb-Lip-Sync-1.14.0-Windows\rhubarb.exe` |
| Archival | §9.9 sources; `open-museum` and `internet-archive` MCPs inside `nif-builder` only |
| Assembly, grade, delivery | DaVinci Resolve Studio 21.1, via its native MCP server (§10.1), inside `nif-finisher` |

**No AI imagery tools.** No Flow, Veo, Gemini or any image or video generator is
part of this stack (§3 law 12).

### 13.2 · Third-party components

Preset marketplaces are for learning what effects exist, not for importing code.
A preset carries an unclear licence and, worse, makes the channel look like
everyone else using it. Effects are written into this channel's own library.

### 13.3 · Disclosure

- **The narrator is a synthetic voice** (SAP Narrator, ElevenLabs Voice Design),
  not a person's own cloned voice, so the own-voice exemption no longer applies to
  it. It narrates; it never imitates a real person or presents invented events as
  real. The creator checks YouTube's current altered-content guidance at upload
  and ticks the label if it applies.
- **No AI visuals, so no visual label.** Nothing on screen is generated (§3 law 12).
- The description's AI block states plainly what is generated (the narrator's voice)
  and what is not (every picture), and is rewritten in the same change as any
  policy shift.

**What the description must carry, whoever writes it.** Claude recommends the
packaging and the creator decides it in vidIQ (§9.10), but four items are obligations rather than marketing and must
survive into the published description:

1. The **AI block** above.
2. **Music and archival credits** — every track's title and artist, and every
   archival item's credit line, where attribution is required (§10.8.1, §9.9).
3. **Sources with years**, for every figure stated in the episode.
4. **Chapters**, exactly as computed at Step 2 (§8.3).

These are handed over with the delivered file. A missing credit is a licensing
problem, not a packaging one.

### 13.4 · Source safety

Source media is never modified, transcoded, or overwritten. Archival is verified
per item — a public-domain film can still carry copyrighted music, and Content ID
will find it.

### 13.5 · Change management

This document is the only place process lives. When a rule changes, the rule is
**rewritten in place** — this file never grows a dated addendum, an exception
list, or a change log. History belongs in `archive/`.

Before any process change is written, the creator is shown what is already
locked, what is genuinely new, and what is still open, with a recommendation —
and approves it first.

### 13.6 · Automation

**The agents** are in `D:\YT\.claude\agents\`: `nif-researcher`,
`nif-scriptwriter`, `nif-voice`, `nif-builder`, `nif-auditor`, `nif-finisher`
(§5.2). Each preloads a `nif-sec-*` skill from `D:\YT\.claude\skills\` that
pastes in its own section of this runbook at start.

**Those skills find their section by its heading.** Every top-level heading in
this file keeps the form `## N · Title`, and §9.5 and §9.7 keep theirs. §12 is
split into one block per step (`### 12.N`), so a skill can paste in only its own
step's gates. `nif-researcher` loads §6 and §14, and §12.0 and §12.5. A change
that renumbers or renames a heading updates the `sed` patterns in the six
`nif-sec-*` skills in the same change, or the agents start with the wrong rules.

**The hooks** live in `D:\YT\.claude\hooks\`: a session-start summary of the
active episode's `project.json`, the render guard (§9.5), and a log trimmer that
shortens long command output before Claude reads it. A hook is enabled only after
the creator has seen its file.

**MCP servers are scoped to the agent that needs them.** The archive MCPs load
only inside `nif-builder`, Resolve only inside `nif-finisher`, so the orchestrator
carries neither.

---

## 14 · Step 5 · Publish and learn

**What one episode teaches reaches the next one as a file, not as a memory.** This
step closes the loop: it checks the upload before it goes public, reads how the
episode did, and writes down what the next Step 0 and Step 1 must not repeat.

### 14.1 · Before publish

The creator uploads the delivered file as private or scheduled. Claude never
uploads and never clicks Save in Studio or vidIQ (§6, browser rules).

1. **Read the vidIQ Optimize tab for the uploaded video**: the content score and
   every issue on its Review tab. Claude lists each free fix, such as the primary
   keyword missing from the description's first lines, missing chapters, or a
   title that truncates, and marks any that `lessons.md` has seen before. The
   creator makes the edits.
2. **Check the four obligations of §13.3** against the description as it stands:
   the AI block, the credits, the sources with years, and the chapters from
   `03_transcript/chapters.md`.
3. **Test the thumbnail rather than guess it.** The two or three variants built at
   Step 3 (§9.10) go into Studio's *Test & compare*, and the title too where the
   account offers it. The creator sets it up.
4. **Add the episode to `library/shipped.md`**: code, title, publish date. Its
   numbers are filled in at 7 days.
5. **The end screen points backward:** the last 10–15 seconds after the sign-off carry
   an end screen to the previous case (the closing callback, §6.5). Its second element
   is the **Case files** playlist, every case in order, which the creator keeps. A
   viewer who finishes one case is offered another straight away. That is the binge.
6. **Pin the case question.** At publish, the creator pins one comment: *"Who did you
   suspect before the reveal?"* A whodunit makes people want to say who they
   suspected; the pinned question gives them a place to say it. The creator replies to
   comments in the first two hours. The pinned comment never asks for likes or
   subscriptions.

### 14.2 · The 48-hour and 7-day reviews

**At 48 hours** (§1.3, the seed test): impressions, click-through rate and views,
read in Studio. A click-through rate under 6% on a healthy number of impressions
is a packaging problem, and packaging is the only lever still open. Claude
recommends one change, a thumbnail or a title, and the creator decides.

**Read CTR and retention together, never CTR alone.** A CTR above the channel's median
with 30-second retention below its median means the packaging promised something the
opening didn't show. The fix is a *more accurate* thumbnail or title, not a louder one,
even if CTR falls. YouTube's own help says clickbait gets low view duration and is
recommended less. A low CTR with strong retention is the opposite: the video works and
the packaging undersells it.

**At 7 days**: the full read of §6.1, the same tables, the same `dip-map.mjs`
mapping and the same shape, written to the episode's own `10_review/review.md`.
The next Step 0 reads this file instead of browsing (§6.1). If no session runs the
7-day review, the next Step 0 does it.

`library/shipped.md` gets the episode's CTR and APV on the same day.

### 14.3 · The lessons file

`library/lessons.md` is the channel's standing "do not repeat" list. Step 1 must
answer every line in it (§7.0), so it stays short and exact.

- **One line per lesson:** the rule, the cause it prevents, the episodes it was
  seen in, and the step that checks it. *"The mechanism starts by 1:30 — B05 stat
  run lost 9 points — NIF008, NIF009 — Step 1."*
- **A cause goes in when it appears in two episodes.** One episode is noise (§1.3).
- **A lesson comes out** after three episodes in a row pass without it, or when it
  is promoted into this runbook as a permanent rule through §13.5.
- **40 lines at most.** Over that, the oldest lessons are promoted or retired first.
- **Change one thing at a time.** After episode 10 (the deliberate format change), each
  episode changes at most one of topic type, packaging style or structure in response
  to a lesson. Change three at once and the next review can't say which one worked.
- **A vidIQ Review issue that returns** becomes a line, checked in §14.1.

