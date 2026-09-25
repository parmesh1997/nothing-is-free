# Steps 3 and 4: where the hours go, and the options

Written 2026-09-24, while the current episode was 10+ hours into 3b with most of the
week's usage spent. **The path chosen is Option A (Stage & Marks) inside the
production plan's 2D-first mix, and the current numbers are in
`SAP_Production_Plan_v2.md`** (for example, at most two moving 3D shots per episode,
not the "two or three" below). This file stays at the top level only for **§2, the
prompt that finishes episode 9's 3b**; move it to `archive/` once episode 9 ships.

---

## 1 · Why 3b takes ten hours

Your agent's own explanation names the cost exactly: **22 shots, each hand-built**.
For every 2.5D shot, the current §9.8 asks for:

1. a Blender camera block for that shot
2. a plate render
3. an occlusion matte render
4. a camera JSON with a per-frame floor match
5. a foot-lock proof: red pins, cyan crosses, 10 stills, `footlock_check.py`
6. **and all of it again after any fix that moves a character or the camera**

Steps 1–5 are done by a model looking at images. Every look at a still is paid for in
tokens, and every fix restarts the loop. At about half an hour per shot, 22 shots is
eleven hours. The new locations (the SB stand and the counter kiosk) made it worse,
because their first use with the cast placer is where the empty slot in B01-S5, the
problem in B05-S2 and the bare portal shot came from.

**None of this work is creative.** Where a character can stand, whether the floor
there is lit, whether the feet show: those are properties of the *camera angle*, not
of the shot. They can be measured once, by script, and reused.

---

## 2 · Finish the current episode now (paste into the 3b session)

Your weekly usage is nearly gone, so this finishes 3b with **no new Blender renders**:
every shot either passes as it stands or goes down the ladder.

```
Read Someone_Always_Pays_Runbook.md §9.8.2 (the shot ladder) only.

We are stopping the fix-and-rerender loop in 3b for NIF0NN. Do not render any
new Blender plate, matte or pin still in this session.

1. List all 22 2.5D shots in a table: shot, gates passed, gates failed,
   fix attempts so far. Read this from project.json and 08_conform/ only.
   Do not open images to build the table.
2. Every shot that has passed its gates: keep it as it is.
3. Every shot that has failed any gate twice, including B01-S5, B05-S2 and
   the bare portal shot, goes down the ladder:
   - Rung 3 (feet out): reuse its existing plate. In Remotion, push in (scale
     1.15–1.3) or reframe so no feet are on screen. The foot-lock gate then
     does not apply. A bare shot either gets a character placed on the
     existing plate with the feet cropped out, or is declared empty on purpose.
   - Rung 4 (2D): if rung 3 cannot hide the feet or fill the shot, rebuild it
     as a 2D scene in Remotion from the library.
4. Record each shot's rung and the reason in project.json.
5. Stop and report: the table, the rung for each changed shot, and one still
   per changed shot. Then hand off to 3c with a written prompt (§5.3).

Model: Sonnet, medium effort. Stop and ask before anything that would render
more than one plate.
```

---

## 3 · Step 3: three options

| | **A · Stage & Marks** ⭐ recommended | **B · Cast in the plate** | **C · 2D first** |
| --- | --- | --- | --- |
| **What changes** | 3a renders 12 locked-off angles per new location, with measured floor marks. A 2.5D shot picks an angle and marks. `place-check.mjs` validates with numbers | The 2D rig is rendered to image sequences, then stood inside Blender on planes (your `lab/parented-plane` exception), for every 2.5D shot | 2.5D drops to the two or three hero shots. Everything else is 2D sets in Remotion |
| **3b agent time for 22 shots (my estimate)** | ~1.5–3 h: data entry, one check, two or three hero shots | ~3–5 h. No foot lock or mattes, but every shot needs a full Blender render of the cast | ~1 h, since there is almost no 3b |
| **Render time (GPU, overnight)** | Low. One frame per kit angle, plus Remotion | High. Every frame of every 2.5D shot in EEVEE | Lowest |
| **Look** | Unchanged, and stronger lighting: `lit` comes from the plate itself | The best "one world": real occlusion, and the room lights the cast. Characters cannot turn | Loses the depth your frames have now |
| **Camera** | Remotion drifts and pushes on the layers, plus two or three real Blender moves | Real moves on every shot | 2D camera only |
| **Foot lock** | Exact by construction. The gate is kept for moving hero shots only | Gone: feet stand on the real floor | Not needed |
| **Work to adopt** | Promote `marks.py` into `lib25d.py`, write `kit.py` (12 angles, contact sheet), use `place-check.mjs` (written and tested) | A pilot first. The runbook limits it to 1–2 shots today, and the crowd stops being free | A runbook change to the tier mix (§2.3, §9.7) |
| **Risk** | Low. Your pipeline stays; only the per-shot loop goes | Medium. An unproven look at scale | Low risk, but a visible drop in quality |

**Recommendation: A now, with a one-shot pilot of B inside a later episode.** A removes
the loop that cost the ten hours without changing how the channel looks. B could be
the better long-term look, but it has not been measured at scale, so it earns its place
on one shot first.

---

## 4 · Step 4: what Resolve should and shouldn't do

Resolve Studio today: import clips, grade, audio, export. Most of the token cost here
is the MCP placing clips one call at a time, and the fixes after that.

| | **4A · Scripted Resolve** ⭐ recommended | **4B · ffmpeg finish, Resolve optional** | **4C · Resolve does the look too** |
| --- | --- | --- | --- |
| **How** | `make-timeline.mjs` writes the whole timeline as one OpenTimelineIO file. One MCP call imports it. The show grade is one saved grade applied to every clip. A render preset. Audio stays `mix-final.mjs` | The proxy chain (§11.2) becomes the master chain: `lut3d` grade, grain baked in Remotion, `libx265` Main10 encode, audio muxed | 4A, plus bloom (the practicals AOV) and depth blur (the mist pass) done in Fusion as one saved template |
| **Agent time** | ~15–30 min, Sonnet or Haiku | ~10 min, all scripted | 4A plus the time to build the Fusion template once, then about the same as 4A |
| **Why** | Keeps Resolve for what it is best at (the grade, 10-bit encode, a place to look), without per-clip clicking | Fewest moving parts. Resolve becomes where the look is *developed*, not where every episode passes through | Puts all the look in one app |
| **Catch** | The OTIO import is new on your machine: probe it once (§10.3) | Grain and grade judged without Resolve's viewer | The passes must line up on the timeline frame-accurately; more to go wrong |

**Recommendation: 4A.** It is written into §10.5. Keep bloom and depth blur in
Remotion (data-driven, per shot), and keep Resolve for the grade and the encode.

**What else Resolve Studio could take on, honestly:** the grade and grain (already),
the encode, and a final look at the whole film. It should not take on camera moves or
compositing the cast: that work needs the per-shot data (marks, anchors, word timing),
which lives in Remotion.

---

## 5 · What a heavy episode should cost after this (estimates, to be measured)

| Step | Now (your episode) | With A + 4A |
| --- | --- | --- |
| 3a | 2 h (one 5-hour window) | The same for the first episode that uses a new location, plus ~1 h for its kit. **~0 for an episode whose locations already have kits** |
| 3b | 10+ h and not done | ~1.5–3 h |
| 3c | not reached | unchanged |
| 4 | not reached | ~15–30 min |

These are my estimates, not measurements. §9.0 step 7 records agent minutes per step
in `project.json`. After one episode on the new flow, those numbers replace this table.

---

## 6 · What was built and tested (this branch)

| File | What it does | Tested |
| --- | --- | --- |
| `engine/remotion/lab/sap-upgrade-demo/marks.py` | Measures one angle's floor marks after its plate renders: free, feet/head visible, title-safe, `lit` sampled from the plate, px/m, depth | On the demo deli: 315 marks, 123 usable. The lit/shade split matches the pools on the render |
| `engine/remotion/scripts/place-check.mjs` | Checks every 2.5D shot's placements with numbers; writes `place-<shot>.json` for Remotion; exit 1 on failure | Good and bad test shots: it caught a bare shot, a figure inside furniture, a walk through furniture, and a reused angle |
| `engine/remotion/scripts/make-timeline.mjs` | Writes the Resolve timeline as one OpenTimelineIO file from `timing.json` | On NIF004: the OTIO library reads it back as 34 VO clips on the right frames, 17.59 min. **Not yet imported into Resolve**: probe first (§10.3) |

## 7 · Runbook changes on this branch

- **§9.0**: 3a builds angle kits. 3b becomes kit shots checked by `place-check`,
  in batches of eight, with a cap of two fixes.
- **§9.8**: foot lock applies to walks in moving hero shots only.
- **§9.8.1 (new) Stage & Marks**: kit files, what each rule becomes, camera drift in
  Remotion, walks between marks.
- **§9.8.2 (new) The shot ladder**: hero → kit → kit with feet out → 2D.
- **§10.5**: the timeline is built as a file and imported in one call.
- **§5.2**: model routing for kit angles and kit shots (Sonnet, medium).
- **§12.3**: new gates Placement, Fix cap and Angle kit; Foot lock narrowed.
