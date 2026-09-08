# NIF002 — audio edit list (SFX cues + music level map)

Generated 2026-09-04 from the actual source (`src/nif002/v4/audio.tsx` CUES array
+ `scripts/mix-v4.mjs` envelope) — every timecode below is real, not estimated.

## Where things actually stand right now

**The finished mix already exists** — `episodes/NIF002/09_master/NIF002_master.mov`
has VO + SFX + music combined by `scripts/mix-v4.mjs`, following exactly the map
below, normalised to −14 LUFS / −1.5 dBTP. If you just play that file, all of
this is already done.

**What's in the Resolve project (`NIF002_master` → timeline `NIF002_graded`) is
different on purpose** — it's the raw material, laid out on 3 tracks so you can
see and hand-ride it if you don't want to trust the automated mix:

| Track | Clip | What it is |
|---|---|---|
| V1 | `NIF002_full.mov` | picture + baked VO (its own audio = A1) |
| A2 | `NIF002-sfx.wav` | **the SFX stem — already fully mixed**, every cue below baked at its exact frame and level. Leave it alone; it doesn't need riding. |
| A3 | `_music_loop_full.wav` | **the raw music bed, unducked, at 0 dB** — loops `bed.mp3` for the full 16:59. This is the ONE thing that actually needs your hand (or Fairlight's AI Audio Assistant) — Resolve's scripting API can't set clip volume or keyframes, so I can't ride this one for you from here.

So: nothing is "missing" — the SFX track just looks/sounds like one flat file
because it already IS the finished sub-mix. The only real work left, if you
want to do it in Resolve instead of trusting `mix-v4.mjs`, is **pulling A3's
fader up and down** on the map below.

---

## 1. Music level map — what to do with the A3 fader

Think of it as 4 plateaus + 3 moves. All times are MM:SS from the top of the episode.

| Time | Level | What / why |
|---|---|---|
| 0:00 – 1:25 (B00–B02) | **≈ −18 dB** | cold open, music can breathe |
| 1:25 – 1:28 | ramp down | into the dense explainer |
| **1:28 – 14:12** (B03–B23) | **≈ −27 dB** | almost inaudible — VO is wall-to-wall here, don't fight it |
| 14:12 – 14:15 | ramp up | coming out of the explainer |
| 14:15 – 14:59 (B24) | **≈ −18 dB** | back to open level, "walled garden" section |
| **14:59 – 15:07** (B25 cut to black) | **drop hard to ≈ −37 dB** (almost silent) | the reversal — let the black screen and VO sit alone |
| 15:07 – 15:33 | back to **≈ −18 dB** | statement cards on black |
| **15:33 – 15:41** ("YOU ARE THE INVENTORY") | **swell to ≈ −12 dB** — the loudest the bed ever gets | the one deliberately musical moment in the episode |
| 15:41 – 16:56 | back to **≈ −18 dB** | tail of B25 + B27 teaser |
| **16:56 onward** (into "SUBSCRIBE") | **lift to ≈ −14.5 dB** | CTA push |
| 16:57 – 16:59 | fade to 0 | clean out |

Two things worth knowing if you hand-ride this instead of trusting the file:
- The B25 drop and the "INVENTORY" swell are **hard cuts** in the automated
  version, not ramps — timed to land exactly on the cut to black / the line
  landing. If you're riding it by ear, a fast fade (4–6 frames) reads the same
  as a hard cut and is safer than a slow one.
- Every level above is *relative to the VO*, which sits at 0 dB (untouched) —
  match by ear against the VO, not against a meter number, since your monitoring
  chain's gain-staging may differ from what generated these numbers.

---

## 2. SFX cue sheet — 114 cues, already placed in `NIF002-sfx.wav`

You do **not** need to place these — they're baked into the A2 stem at these
exact frames. This list exists so you know what's playing when, in case
something sounds wrong and you want to find it fast (Fairlight ▸ zoom to
timecode) or mute an individual cue.

**B00** (0:00.0)
- 0:00.2 — plip (−20 dB) · 0:02.0 — plip (−20) · 0:03.7 — plip (−20) · 0:05.0 — whoosh (−16) · 0:06.8 — chime-warm (−17)

**B01** (0:09.2)
- 0:14.4 — tap (−14) · 0:18.1 — whoosh (−15) · 0:21.4 — plip (−19) · 0:26.6 — coin (−15) · 0:37.4/0:39.7/0:42.1 — thunk ×3 (−17)
- *tick loop 0:18.7–0:29.2* (a running clock)

**B02** (0:47.0)
- 0:50.4 — tap (−14) · 0:54.0 — plip (−18) · 1:21.5/1:22.9 — coin ×2 (−16)

**B03** (1:25.5)
- 1:38.5 — whoosh (−16) · 1:59.3 — plip (−22)
- *tick loop 1:51.9–1:57.1*

**B04** (2:03.2)
- 2:04.5 — tap (−14) · 2:10.0 — whoosh (−15) · 2:17.6 — plip (−19) · 2:35.2 — tap (−15) · 2:40.1 — whoosh (−14) · 2:46.1 — boom (−12)

**B05** (2:47.9)
- 3:04.7/3:06.6/3:08.6 — plip ×3 (−19) · 3:25.6 — whoosh (−17) · 3:36.2 — thunk (−15)

**B06** (3:37.2)
- 3:38.7 — drone (−20) · 3:45.9 — plip (−19) · 3:57.5 — tap (−14)

**B07** (4:05.2)
- 4:11.1 — plip (−19) · 4:19.4/4:21.8/4:24.1 — tap ×3 (−15) · 4:42.1 — glitch (−16) · 4:44.6 — drone (−19)
- *tick loop 4:19.5–4:43.9*

**B08** (4:47.4)
- 4:51.6/4:56.8/5:00.2 — thunk ×3 (−16) · 5:08.2 — whoosh (−15) · 5:23.7 — boom (−12)

**B09** (5:24.2)
- 5:34.1 — thunk (−16) · 5:43.6 — plip (−18) · 5:55.8 — chime-warm (−16)

**B10** (5:57.1)
- 6:06.5 — whoosh (−20) · 6:31.1 — boom (−11)
- *footsteps loop 5:58.5–6:29.5*

**B11** (6:34.8)
- 6:46.4 — tap (−16) · 6:51.7/6:55.4/6:59.1 — coin ×3 (−16) · 7:06.2 — thunk (−15)

**B12** (7:07.8)
- 7:12.8/7:15.2/7:17.5 — tap ×3 (−16) · 7:19.0 — whoosh (−15) · 7:44.6 — boom (−13)

**B13** (7:45.9)
- 7:53.8 — stamp (−16) · 8:03.4 — stamp (−16) · 8:24.0 — stamp (−14)

**B14** (8:40.7)
- 8:52.1 — plip (−19) · 8:59.1 — whoosh (−16) · 9:13.0 — drone (−18)

**B15** (9:14.3)
- 9:18.5 — thunk (−15) · 9:23.6 — whoosh (−16) · 9:36.3 — boom (−13)

**B16** (9:42.1)
- 9:48.6 — tap (−14) · 9:52.2 — whoosh (−16) · 10:05.4 — thunk (−15)

**B17** (10:08.2)
- 10:11.6/10:12.3/10:13.0 — tap ×3 (−15) · 10:22.6 — drone (−18) · 10:25.8 — whoosh (−15)

**B18** (10:26.6)
- 10:30.9 — tap (−14) · 10:47.7 — boom (−13)

**B19** (10:49.0)
- 10:56.7 — whoosh (−15) · 10:59.4 — plip (−19) · 11:11.5 — lock (−15) · 11:21.8/11:30.9 — thunk ×2 (−16) · 11:39.4 — stamp (−13)

**B20** (11:40.6)
- 11:50.6 — plip (−19) · 12:21.9 — boom (−13)

**B21** (12:22.8)
- 12:44.4/12:54.3/12:59.1 — lock ×3 (−14) · 13:08.7 — boom (−9, the loudest one-shot in the episode — the merger slam)

**B22** (13:09.7)
- 13:13.8 — plip (−16) · 13:17.9 — switch (−14) · 13:22.8 — whoosh (−16) · 13:42.1 — chime-bright (−14)

**B23** (13:43.4)
- 13:47.5 — stamp (−15) · 13:54.9/13:55.6 — stamp ×2 (−13) · 14:14.2 — boom (−11)

**B24** (14:14.6)
- 14:44.7 — plip (−20) · 14:54.9 — glitch (−17) · 14:57.1 — boom (−13)

**B25 — the reversal** (14:59.0)
- 15:07.0 — drone (−15) · 15:18.6 — tick (−20) · 15:32.9 — boom (−7, the loudest sound in the whole episode — lands on "the inventory") · 15:40.0 — boom (−16)

**B26** (15:46.3)
- 15:48.9/15:52.1 — glitch ×2 (−15/−17) · 16:03.4 — plip (−19) · 16:12.0 — switch (−14) · 16:16.4 — whoosh (−16) · 16:19.1 — thunk (−15)

**B27** (16:21.1)
- 16:28.5 — plip (−18) · 16:42.1 — chime-warm (−16) · 16:47.3 — thunk (−16) · 16:55.9 — chime-bright (−12, on "SUBSCRIBE")

---

## 3. If you want to actually re-do the mix in Resolve

1. Open the **Fairlight** page on the `NIF002_graded` timeline (project
   `NIF002_master`) — A1 = VO, A2 = SFX (leave it), A3 = raw music.
2. Either:
   - **Automate A3 by hand** using the level map in §1 — right-click the clip ▸
     add a volume keyframe at each timecode above, or draw the automation line
     directly on the track.
   - **Run the AI Audio Assistant** on the 3 tracks (Fairlight ▸ ▸ AI Audio
     Assistant ▸ Analyze) and let Resolve propose a balance, then compare it by
     ear against §1 — it doesn't know this is a documentary with a reversal beat,
     so it may not duck as hard through B03–B23 or swell on B25.
3. Bounce/export the mix and hand it back — I'll re-run
   `node scripts/hevc-master.mjs --nvenc --audio <your-mix.wav>` to build the
   final master from whichever mix you land on.

The MCP genuinely cannot ride A3's fader or set keyframes from script (Resolve's
audio surface is read-only via the API) — this step needs a human in the GUI,
which is the one piece of "editing" actually left.
