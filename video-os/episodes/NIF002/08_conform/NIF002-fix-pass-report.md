# NIF002 — the take-your-time review pass (2026-09-04)

## The 5 screenshotted bugs — fixed + render-verified

| # | bug | fix |
| --- | --- | --- |
| 1 | B25 end title showed only "NOTHING IS" | types **"NOTHING IS FREE."** in full, holds 4.5s on black + "· episode 2" |
| 2 | captions stacking 2×/3× | `<Lane>` — exactly one caption at a time, every beat, auto ~1s clean tail |
| 3 | B19 — 96 dead node-cards | 24 working file-cards: staggered land, each blinks "accessed" forever, winner peels, losers padlock, "RE-READ n TIMES" |
| 4 | B02 — tiny devs vs huge Lucky, "97%" buried | one `FIG` scale band, 100-dot grid + 97% high in frame |
| 5 | B02 garbled counter | clean count-up |

## Character — medium, consistent, chunky

- **One scale band** (`FIG`): hero 0.30H / adult 0.28H / seated 0.26H. No beat hard-codes size — a dev at a desk is the same size as the person watching.
- **Proportions reworked** (2 passes): was a lollipop on stilts → Infographics-Show chunky (≈2× thicker limbs, short legs, full head, wide torso). Verified on stand / walk / sit / ghost.
- Ponytail ≈55% smaller. Ghost figure (translucent, no face) for every generic person so Lucky stays the one figure in colour.
- Every figure has a mechanic — phone tap → screen reacts, walk, desk-work cycle, sit-and-scroll. No idle standing.

## "Animation not doing anything" — 13 data beats got a continuing mechanic

Rule now in the house-style skill: *if the on-screen thing is a process, the process keeps running the whole hold* — looping particles, a live counter, a re-sweep, a retraced path. Not just a breathe.

B14 ad slots re-serve + $ WASTED counter · B15 spend pills through the 20% bar + toll counter · B16 30s rewarded-video countdown loop · B17 packets flow the rail through all 3 gates, the eye scans each · B18 "ADS SO FAR" counter on the phone · B19 (above) · B20 tracer glow · B21 spend pours into the wall, walled cards shimmer then slam numbers · B22 tap tally → "≈ 7 in 9 say no" + stepping bar · B23 a GOOGLE node pulses control to both monopoly halves · B24 1000-dot grid re-sweeps (now on a panel, clear of the characters) · B25 money pumps advertiser→app on the arrow · B26 recurring stutter glitch + AUCTION pip · B27 pin retraces the route toward NEXT

## Transitions + tail space

Every beat bakes an ~8-frame fade to/from cream → a plain concat reads as a soft dissolve-through-cream at every cut, with the ~1s clean tail. (Bundled ffmpeg has no `xfade`; the beat-to-beat cream fade is the transition. In Resolve it's one clip so nothing to add.)

## Audio — done

15 SFX + 1 music bed in `public/audio/nif002/`, wired in `src/nif002/v4/audio.tsx`: ~110 cues at episode-global frames + a music bed with the reversal drop → +4 dB swell on "YOU ARE THE INVENTORY" → +3 dB into SUBSCRIBE → fade. Baked by the full-episode render.

## Render bugs caught + fixed

- **B22 crashed** — `interpolate` output had `undefined` (negative array index in a 6-frame window). Clamped.
- **B24 grid over the characters' heads** — moved to a floating white panel.
- **B14 ad slots invisible** (card-coloured) → grey.
- B17 top-heavy → centred; B15 bar widened.

## Known-minor (not blocking)

- **B26** — Lucky's seated legs read a little oddly against the bed (mattress shows between her legs). A staging nudge, deferred.
- Several data beats keep vertical breathing room (elements up top, caption bottom). Motion is fixed; a full density pass is a separate job.
- Resolve playback frame rate may show 24 in the GUI (API can't set it) — the render is 30, only real-time preview is affected.

## The master pipeline

1. `NIF002_full.mov` — whole episode, one ProRes 422 HQ, SFX + music + VO + cream dissolves baked.
2. **Resolve** (MCP): import → 1080p30 timeline → Super Scale 2× + light warm CDL → ProRes out. *(Super Scale is optional — on clean line-art the direct path is usually crisper.)*
3. **`scripts/hevc-master.mjs`** — FFmpeg → QuickTime · H.265 **Main10** · **30 Mbps 2-pass** · preset **slower** · faststart · 1080p30 · AAC 320k → `09_master/NIF002_master.mov`

Full steps + the optional GUI polish (net vignette, B25 crush): `08_conform/davinci-finish-guide.md`.

## Yours to do

1. Watch `NIF002_master.mov` (and `_ss.mov` if Super Scale was run) — pick one, flag anything.
2. Optional GUI polish in Resolve: the net vignette, the B25 black-stretch crush.
3. Upload — mark **"Altered or synthetic content" = YES** (`channels/nif/ON_AI.md`); attach the WhisperX `.srt`.
