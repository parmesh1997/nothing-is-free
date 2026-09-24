# Someone Always Pays: production plan v2 (from episode 10)

Everything about *how the episode is made*, in one place: the visual system, the
2D-only question, cheap depth, the cold open, Steps 3 and 4, and the runbook edits.
*What the episode is about* is in `SAP_Subniche_Strategy.md`.

This consolidates `Visual_Upgrade_Plan.md`, `Step3_Step4_Options.md` and
`Runbook_Changes_2026-09-24.md`. Once it is approved, those three move to `archive/`.

---

## 1 · The one-line answer

**Go 2D-first, and let Blender paint backgrounds instead of building shots.**
The camera always belongs to Remotion. Blender renders still plates of each location,
once, from twelve angles. Remotion does everything that moves: the cast, the camera,
the light, the type. Moving 3D shots drop to **one per episode, in the cold open**, and
only when it earns it.

This keeps about 85–90% of the current look (the `sap_after.jpg` still *is* this
pipeline) and removes the per-shot Blender loop that cost ten hours in 3b.

---

## 2 · "Only 2D": what you actually lose

Three levels, cheapest first. **"2D-only" in the sense you mean is Levels 1 + 2**:
Blender never renders a moving shot, and the camera is always Remotion's.

| Level | What it is | Build cost | What it looks like |
| --- | --- | --- | --- |
| **L1 · Drawn 2D** | SVG sets drawn in Remotion (today's 2D tier) | Lowest | Flat. Rooms can read as diagrams, and each new angle is a new drawing |
| **L2 · Painted plates** ⭐ the default | Blender renders a **still** of each location from twelve angles, in layers. Remotion puts the cast in and moves the camera | ~1 h per new location, once. Then almost nothing per shot | Real perspective, real light pools, real ink on the set: the current look |
| **L3 · Moving 3D** | A Blender camera move through the space | High | The one thing L2 can't do: the camera travelling *through* the room |

**What you lose going from L3 to L2:** the camera can't travel *through* a space or
orbit it. It can push, drift, pan and rack focus, and the layers give parallax. In a
12-minute episode, viewers feel the lack of travel only in establishing shots, and
that is what the one L3 shot in the cold open is for.

**What you lose going from L2 to L1:** a sense of place. Light pools, occlusion and
perspective have to be faked by hand for every drawing. L1 is right for history
scenes, the heist board, maps and inserts, which are drawn things anyway.

**The mix from episode 10** (replaces §9.7's tier table):

| Level | Share of runtime |
| --- | --- |
| L2 painted plates, with the cast | ~50% |
| L1 drawn 2D (history, the heist board, the crew cards) | ~35% |
| In-world inserts (the loot counter, documents, prices) | ~12% |
| L3 moving 3D | ≤ 3%: one shot, in the cold open |

---

## 3 · Making 2D look like 2.5D: the cheap tricks

All in Remotion, using the passes each L2 plate already has:

| Trick | How | Why it sells depth |
| --- | --- | --- |
| **Multiplane parallax** | Each plate renders as three layers (background, midground, foreground occluders), split by the mist pass or by view layers. Remotion moves them at different speeds under one camera move | The Disney multiplane idea. The single strongest "this is 3D" signal there is |
| **Push-in with foreground wipe** | Camera pushes 5–10% while a foreground object (a pillar, a plant, a shoulder) slides past the lens faster | Hides the cut, and reads as a dolly |
| **Rack focus** | Blur levels per layer from the mist pass (A4). Focus moves from the foreground to the cast on a word | The camera "decides" what matters |
| **Handheld breath** | `@remotion/noise` at 1–2 px on the camera, varying slowly | A still plate reads as filmed, not placed |
| **Light that lives** | The practicals mask (A3) drives a slow flicker or sway on bloom and pools | The room is on, not printed |
| **Diorama establishing shot** | One high-angle still of the whole location, roof off, then a Remotion push-in with depth blur | Imperial's opening feel, from one render |
| **Line wobble and characters on twos** | A1 and A2 from the visual plan | Reads as drawn by hand: the channel's signature |
| **Cast lit by the floor** | Each standing spot's `lit` value (Stage & Marks) switches the cast between lit and shade tones, with a rim and a contact shadow | The single loudest "one world" signal (§2.1) |

**Cheap locations that still look good (3a):**
- **A modular kit** in Blender: wall and window pieces, a counter, shelving that fills
  itself with items, low-hung lamps, chairs with spindles. A new location is an
  arrangement of kit pieces plus one hero prop. Target: under an hour.
- **Re-dress, don't rebuild:** the same room with a new palette, props and practicals
  becomes a new location for history scenes (a 1930s lobby is the modern one,
  re-dressed).
- **Detail only where the camera looks.** Twelve fixed angles means you know every
  view in advance.

---

## 4 · The cold open (the Job, 0:00–0:15)

**It is the most valuable 15 seconds of the episode, so it gets 20% of the build
budget and is built first.**

| Spec | Why |
| --- | --- |
| **4–6 shots in 15 s**, a cut every 2–4 s | The pace of a heist opening |
| **The episode's one L3 moving shot**, if any, goes here | The first image carries the most weight |
| **Lucky acts:** lip-synced, reacting, one physical gag in the picture that works with the sound off (§4.6) | The laugh has to land in the picture |
| **3+ specific sounds** (the place and the object) and a music sting on the number | The sound-off test fails without the picture, and the sound-on test fails without these |
| **The loot counter's first tick** and **the title question landing in the world** | The promise is set by 0:15–0:30 (§4.1) |

**New gate · Cold open first:** before 3b or 3c build anything else, the cold open is
built, rendered as a proxy with its real VO and sound, and watched by the creator. If
the hook doesn't work, it's fixed while it is 15 seconds of work, not 12 minutes.

---

## 5 · Step 3: the new order of work

| Part | What happens | Model | Budget (agent time, to be measured) |
| --- | --- | --- | --- |
| **3a · Library** | New locations from the modular kit, plus **the angle kit**: twelve angles, each with a layered plate, fg matte, mist and practicals passes, measured floor marks (`marks.py`), and a contact sheet checked once | Opus for a new location; Sonnet for the kit render | ~1 h per new location, 0 for kitted ones |
| **3b-0 · Cold open** | Built first, proxy watched (the gate above) | Sonnet, high | ~45 min |
| **3b · Shots** | Each L2 shot is data: an angle, a mark for each character, a camera move. `place-check.mjs` validates it with numbers and writes `place-<shot>.json`. Batches of eight; two fix attempts, then the ladder (§9.8.2) | Sonnet, medium | ~1–1.5 h for 20 shots |
| **3c · Scenes** | L1 scenes, the heist board, crew cards, the replay overlay, inserts, text | Sonnet, high | Unchanged |
| **Audit** | Scripts first, then contact sheets, then `motion-check.mjs` on the proxy (§9.5) | Sonnet, medium | ~30 min |

**What stops the 10-hour loop, specifically:** no Blender render in 3b except the one
cold-open shot; no foot-lock stills (feet stand on measured spots of a locked camera);
no placement by eye (`place-check`); a hard cap of two fixes per shot; sessions of
eight shots with a progress file.

---

## 6 · Step 4: scripted Resolve

| Stage | How |
| --- | --- |
| Timeline | `make-timeline.mjs` writes the whole OpenTimelineIO file, and one MCP call imports it (§10.5) |
| Grade and grain | One saved show grade applied to all clips, with the grain node. No per-episode tuning (§11.1) |
| Audio | `mix-final.mjs` (ffmpeg), unchanged |
| Render | One preset: H.265 Main10, 1080p24, software encode. Silent picture, audio muxed last |
| QC | The two commands in §10.10 |
| **Budget** | ~15–30 min of agent time, Sonnet or Haiku |

The first episode on this flow does one probe of the OTIO import on
`_NIF_CAPABILITY_PROBE` (§10.3), because the import hasn't been tried in Resolve yet.

---

## 7 · The visual upgrade items, re-ranked for 2D-first

| Item | Where it now lives | Status |
| --- | --- | --- |
| A1 line wobble on twos | Blender plate ink (Grease Pencil noise, step 2) and the Remotion cast (SVG displacement) | Demo built |
| A2 cast on twos | Remotion rig | Demo built |
| A3 bloom on lamps only | Practicals AOV (per plate) plus a Remotion glow | Demo built; EEVEE needs the AOV route |
| A4 depth blur | Mist pass per plate, blur levels per layer in Remotion | Demo built |
| A5 line weight by distance | Geometry Nodes after Line Art | Demo built |
| B1 crayon grain in the shade band | Toon material | Demo built |
| **New · multiplane parallax** | Three plate layers per angle | To build in `kit.py` |
| **New · heist devices** | Loot counter, crew cards, heist board, replay overlay (strategy §4.2) | To build once, then vary |
| B3 Blender 5.3 NPR nodes | Test on the beta; production stays on 5.2 LTS | Wait |

---

## 8 · The runbook edits this plan triggers

Already on the branch (Stage & Marks, the ladder, the scripted timeline):
§9.0, §9.8, §9.8.1, §9.8.2, §10.5, §12.3.

Still to apply, once this plan and the sub-niche are approved:

| Section | Edit |
| --- | --- |
| §2.3 Tiers and §9.7 Media budget | The L1/L2/L3 mix above replaces 2D 55 / 2.5D 25 / 3D 5 / inserts 15 |
| §4.1 and §12.1 | The cold open spec (§4 here) and the **Cold open first** gate |
| §9.0 | 3b-0 · Cold open, before all other shots |
| §9.8.1 | Plates render as three layers (bg/mid/fg) for multiplane parallax |
| §2.8 | The heist devices (strategy §4.2) |
| §5.2 | Budgets per step, as in §5 and §6 above, recorded against actual minutes |

---

## 9 · Getting from episode 9 to episode 10

1. **Finish episode 9 cheaply:** the prompt in `Step3_Step4_Options.md` §2. No new
   plates; failing shots go down the ladder.
2. **Choose the sub-niche** (`SAP_Subniche_Strategy.md` §3), and say yes or no to
   this plan.
3. **Apply the runbook edits** (strategy §6 and §8 here): one session, Opus.
4. **Promote the tools:** `marks.py` into `lib25d.py`; write `kit.py`, which renders
   twelve angles × layered plates, passes, marks and a contact sheet.
5. **Kit the existing locations** (the SB stand, the counter kiosk, the deli) overnight
   on the GPU. After that, episode 10's 3b is mostly data.
6. **Episode 10: Step 0** with the evidence gate on the popcorn heist (or whichever
   topic the gate prefers).
