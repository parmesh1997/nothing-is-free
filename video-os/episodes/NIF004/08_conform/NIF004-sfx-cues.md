# NIF004 — SFX cue sheet

Per-beat one-shot cues. **Already baked** into the beat renders (and into
`public/audio/nif004/sfx-mix/B##.mp3` via `scripts/build-sfx-mix-nif004.mjs`).
This sheet is for reference / re-mixing. `g` = gain in dB (the cue-level
balance); the master SFX-vs-VO knob is `SFX_BUS` in `src/nif004/v4/audio.tsx`
(kept at unity — ride the final level in Resolve).

Slugs: tap whoosh thunk plip tick coin stamp drone chime-warm chime-bright boom
glitch lock switch footsteps (generic documentary one-shots, shared across
episodes).

| Beat | Abs start | Cues (local frame · slug · dB) |
|---|---|---|
| B00 | 0:00.0 | 4f whoosh -15dB · 34f tick -20dB · 40f switch -15dB · 210f plip -17dB |
| B01 | 0:16.4 | 8f tap -17dB · 30f plip -16dB · 46f plip -16dB · 64f plip -16dB · 120f drone -18dB |
| B02 | 0:45.8 | 6f whoosh -16dB · 210f plip -17dB · 250f boom -14dB |
| B03 | 1:22.3 | 10f tap -17dB · 300f thunk -15dB · 520f boom -13dB |
| B04 | 1:51.7 | 20f whoosh -16dB · 120f coin -16dB · 300f coin -16dB · 520f thunk -14dB |
| B05 | 2:27.8 | 30f stamp -13dB · 260f glitch -15dB · 500f thunk -14dB · 720f switch -14dB |
| B06 | 3:04.7 | 40f thunk -15dB · 220f plip -17dB · 300f boom -13dB · 360f stamp -13dB |
| B07 | 3:40.6 | 60f tap -17dB · 260f coin -16dB · 430f coin -16dB · 620f thunk -14dB |
| B08 | 4:10.7 | 40f whoosh -16dB · 320f stamp -13dB · 560f thunk -14dB · 700f drone -16dB |
| B09 | 4:50.4 | 30f whoosh -16dB · 220f footsteps -16dB · 300f footsteps -16dB · 380f footsteps -16dB |
| B10 | 5:27.4 | 40f thunk -15dB · 300f coin -16dB · 620f stamp -13dB · 900f boom -13dB |
| B11 | 6:13.7 | 30f glitch -15dB · 60f switch -15dB · 90f switch -15dB · 120f switch -15dB |
| B12 | 6:44.3 | 8f chime-bright -13dB · 300f whoosh -16dB |
| B13 | 7:10.5 | 40f tap -17dB · 220f coin -15dB · 320f boom -13dB |
| B14 | 7:31.7 | 30f thunk -15dB · 160f stamp -13dB · 400f boom -13dB |
| B15 | 7:59.3 | 40f plip -17dB · 200f coin -15dB · 260f coin -15dB · 320f coin -15dB · 480f stamp -13dB |
| B16 | 8:33.9 | 40f tap -17dB · 260f coin -15dB · 320f switch -14dB · 520f stamp -13dB |
| B17 | 8:59.3 | 40f whoosh -16dB · 200f glitch -15dB · 440f boom -13dB |
| B18 | 9:24.3 | 40f tap -17dB · 300f switch -15dB · 500f drone -17dB · 700f tick -19dB |
| B19 | 10:03.2 | 40f plip -17dB · 300f thunk -15dB · 520f chime-warm -18dB |
| B20 | 10:34.8 | 40f switch -16dB · 300f glitch -15dB · 340f glitch -15dB · 560f stamp -13dB · 780f boom -12dB |
| B21 | 11:06.2 | 40f thunk -15dB · 260f boom -13dB · 520f glitch -15dB · 720f stamp -13dB |
| B22 | 11:40.8 | 40f thunk -15dB · 260f stamp -13dB · 400f chime-warm -18dB |
| B23 | 12:02.6 | 40f whoosh -16dB · 300f thunk -14dB · 420f tick -18dB · 440f tick -18dB · 460f tick -18dB · 900f boom -12dB · 1100f switch -15dB |
| B24 | 12:51.6 | 40f plip -17dB · 300f coin -15dB · 360f coin -15dB · 560f boom -13dB · 900f chime-bright -14dB |
| B25 | 13:28.8 | 40f tap -18dB · 200f drone -17dB · 520f boom -13dB |
| B26 | 13:56.6 | 40f whoosh -16dB · 260f switch -15dB · 520f chime-warm -18dB |
| B27 | 14:26.3 | 40f thunk -15dB · 300f thunk -15dB · 520f coin -15dB · 700f stamp -13dB |
| B28 | 15:01.4 | 40f thunk -15dB · 260f thunk -14dB · 420f boom -13dB |
| B29 | 15:26.3 | 40f tap -18dB · 300f drone -16dB · 500f boom -13dB |
| B30 | 15:48.2 | 6f drone -15dB · 300f coin -15dB · 360f coin -15dB · 420f coin -15dB · 900f boom -11dB · 940f drone -13dB |
| B31 | 16:27.7 | 6f drone -15dB · 260f whoosh -16dB · 520f thunk -14dB |
| B32 | 16:52.7 | 6f drone -15dB · 260f plip -17dB · 520f tick -19dB |
| B33 | 17:15.3 | 40f chime-bright -13dB · 300f tick -18dB · 500f coin -14dB |
