# NIF002 · AUDIO PLAN (music bed + SFX cue sheet + mix)

Built 2026-09-04 for the v4 cut. Timecodes are **episode-global** (the concat),
mm:ss.f at 30fps. Beat starts from `Root.tsx` (post-B25 +180f extension):
total ≈ **16:59** (30573f). Convert to a beat-local frame with
`(global_sec − beat_start_sec) × 30`.

Sources — reconciled with the Mass & Method research doc (2026-09-04,
`compass_artifact…`), which audited licences:
- **Music → Pixabay Music** (Pixabay Content License: commercial, **no attribution**,
  scriptable). Preferred over the YouTube Audio Library — cleaner licence, no
  per-track attribution bookkeeping. Avoid AI music generators (MusicGen weights
  are CC-BY-NC).
- **SFX → Freesound filtered to CC0** (its catalogue mixes CC0 / CC-BY / CC-BY-NC —
  check each file) + **Kenney CC0** packs. Log every file's licence + path.

Nothing is downloaded here — this doc is the shopping list + wiring plan. When
the files exist, drop them in `public/audio/nif002/sfx/` +
`public/audio/nif002/music/` and wire via `<Audio>` / a small `<SfxTrack>` in
`EpisodeV4` (or lay them in DaVinci).

---

## 1 · Music bed

**One continuous bed, whole episode.** Spec for the YT Audio Library search
(Genre: *Ambient* or *Cinematic*; Mood: *Dark* / *Calm* / *Dramatic*;
Attribution: *not required* preferred):

| Property | Target |
| --- | --- |
| Tempo | 60–90 BPM, no drum kit (soft pulse / sub-kick OK) |
| Key | minor / modal — unresolved, "something is off" |
| Instrumentation | piano or felt-piano + warm pad + a low pulse; no melody that competes with speech |
| Length | ≥ 17:00 or cleanly loopable (2 loop points) |
| Level | sits at **−24 LUFS** under the VO (ducked −6 dB more when VO is present) |

**Shortlist to audition** (YT Audio Library, all monetisation-safe):
- *"Ether"* — Silent Partner (ambient pad, no perc)
- *"Blessed"* / *"Lost Frontier"* / *"Anguish"* — Kevin MacLeod (attribution required — only if nothing attribution-free fits)
- *"Where the River Goes"*, *"Meydän – Voyage"*, *"Krypth"* style dark-ambient
- filter: **Ambient + Dark + No vocals + ≥ 3 min** and pick the flattest one

**Bed dynamics:**
- **0:00–0:09** (B00) — bed enters *under* the "Nothing is free." title, very low.
- **normal** through B01–B24, always ducked under VO.
- **14:15 (B25 start)** — bed **cuts to silence** for ~2s as the frame goes black, then a **low sub-drone only** fades in under "the app's real job".
- **~15:00 "YOU ARE THE INVENTORY"** — bed **swells +4 dB** (the one big musical moment), then holds under "NOTHING IS FREE." and tails to near-silence.
- **16:10 (B27 CTA)** — bed lifts **+3 dB**, slightly warmer, resolves on "SUBSCRIBE".
- **last 2s** — bed fades out fully behind the edge-fade.

---

## 2 · SFX cue sheet

Types: `TAP` soft UI click · `WHOOSH` short air move · `THUNK` object lands ·
`PLIP` tiny data blip · `TICK` clock · `COIN` metallic drop · `STAMP` hard
impact · `DRONE` sustained low · `CHIME` bright positive · `BOOM` the reversal.
Keep every one **quiet** (−18 to −12 dB under VO) — this is documentary, not a game.

| Beat | Local f | Global | Cue | SFX |
| --- | ---: | --- | --- | --- |
| B00 | ~6 | 0:00.2 | title letters set | soft `PLIP` ×3 |
| B00 | 148 | 0:04.9 | title lifts | `WHOOSH` up |
| B00 | ~204 | 0:06.8 | **AUCTION** lands | single soft `CHIME`/bell, low |
| B01 | ~155 | 0:14.4 | phone tap | `TAP` |
| B01 | ~266 | 0:18.1 | description sends | `WHOOSH` + faint `PLIP` stream |
| B01 | ~285→600 | 0:18.7–0:29 | stopwatch on screen | `TICK` loop, −20 dB, stops on notice |
| B01 | ~364 | 0:21.4 | companies read (Chips) | swarm of faint `PLIP` (one-shot cluster) |
| B01 | ~520 | 0:26.6 | 1¢ coin arcs to hand | `COIN` (light) |
| B01 | ~845+ | 0:37+ | tail cards slide | 3 × soft `THUNK` |
| B02 | ~100 | 0:48.4 | phone tap | `TAP` |
| B02 | ~199–250 | 0:53.7 | 100-dot grid fills | rising `shimmer` (grain of PLIPs) |
| B02 | ~1032+ | 1:21 | coins trickle to studio | 2 × `COIN` light |
| B03 | ~147 | 1:30.4 | $390B count-up | rising tone under the count, resolves on land |
| B03 | ~390 | 1:38.5 | 80% bar fill | soft `WHOOSH` |
| B03 | ~794 | 1:52.0 | auctions/hour ticker | fast dry `TICK` bed, −22 dB |
| B03 | ~1016 | 1:59.4 | ROUNDING ERROR | one tiny `PLIP` (deliberately small) |
| B04 | ~40 | 2:04.5 | phone tap | `TAP` |
| B04 | ~205 | 2:10.0 | request sent | `WHOOSH` |
| B04 | ~432 | 2:17.6 | data card assembles | rapid `PLIP`/typewriter, ~1s |
| B04 | ~961 | 2:35.2 | checkbox ticks itself | `TAP` + tiny `CHIME` (wrong-feeling) |
| B04 | ~1108 | 2:40.1 | packet compresses | `WHOOSH` "zip" down |
| B04 | ~1286 | 2:46.0 | **YOU** | soft `BOOM` (low, short) |
| B05 | ~503–650 | 2:59+ | 10 kit chips drop in | 10 × soft `PLIP`, staggered |
| B05 | ~1130 | 3:20 | Monday→Thursday connector | pen-stroke `WHOOSH` |
| B05 | ~1448 | 3:30 | 10 COMPANIES | cluster `THUNK` |
| B06 | ~46 | 3:38 | ID token appears | low electronic `DRONE` in, holds faint |
| B06 | ~262 | 3:46 | 7 kits report in | 7 × `PLIP` converging |
| B06 | ~611 | 3:58 | reset button | `TAP` |
| B06 | ~756 | 4:03 | ALMOST NOBODY DOES | (no sfx — let it sit) |
| B07 | ~178 | 4:11 | buyer swarm scatters | soft cluster of `PLIP` |
| B07 | ~427→ | 4:19 | one buyer, 3 steps tick | 3 × `TAP`, 70f apart |
| B07 | ~430→1160 | clock | `TICK` loop |
| B07 | ~1108 | 4:42 | THROWN OUT | short dry `reject` blip (a "nope") |
| B07 | ~1182 | 4:44 | REMEMBER THE LOSERS | held low `DRONE` swell |
| B08 | 127/282/383 | 4:52/4:57/5:01 | 3 price cards | 3 ascending `THUNK` |
| B08 | ~623 | 5:08 | ÷ 1,000 | a short downward `WHOOSH` |
| B08 | ~1090 | 5:24 | YOU, PRICED | soft `BOOM` |
| B09 | ~296 | 5:34 | 2 profile cards | 2 × `THUNK` |
| B09 | ~296→581 | meter fills | rising tone |
| B09 | ~581 | 5:43 | ×12 multiplier | quick rising `PLIP` run |
| B09 | ~946 | 5:55 | AND BETTER FOR YOU | warm resolve (a soft major `CHIME`) |
| B10 | 40→970 | 5:58+ | Lucky walks the beat | footstep loop, very low, −24 dB |
| B10 | walk | auction pings from her feet | rhythmic soft `PLIP`, ~1/0.9s |
| B10 | ~280 | 6:06 | 14 trillion count | ticker bed |
| B10 | ~1018 | 6:31 | SHIPPED YOUR LOCATION | `BOOM` (medium) |
| B11 | ~350 | 6:47 | chain gates appear | 5 × mechanical `TAP` |
| B11 | ~448→ | coin travels + shrinks | descending tone as it moves |
| B11 | ~508–800 | slice coins drop | 4 × `COIN` (light) |
| B11 | ~944 | 7:06 | A SLICE | `THUNK` |
| B12 | 144→282 | 7:10 | ledger rows drop | 4 × register `TAP`/`ka-chunk` |
| B12 | ~334 | 7:19 | shrink bar $2→$1.04 | `WHOOSH` down |
| B12 | scan | scan sweeps | soft airy sweep, ~every 5s |
| B12 | ~1102 | 7:44 | HALF OF THAT | `BOOM` (soft) |
| B13 | 236/525/1142 | 7:53/8:03/8:23 | 3 year-cards fill | 3 × `STAMP` (soft) |
| B13 | ~1434 | 8:40 | A DOZEN SMALL TOLLS | a run of 12 tiny `COIN` plips |
| B14 | ~341→470 | 8:52 | junk page blocks flicker in | glitchy `PLIP` grain |
| B14 | ~551 | 9:00 | 1-in-5 bar | `WHOOSH` |
| B14 | ~970 | 9:14 | BURNING QUIETLY | low `crackle`/`DRONE`, brief |
| B15 | ~126 | 9:18 | Trade Desk card | solid `THUNK` |
| B15 | ~279 | 9:23 | 20% bar carves | `WHOOSH` + a small `STAMP` at 20% |
| B15 | ~660 | 9:36 | ONE FIFTH OF THE MONEY | `BOOM` (soft) |
| B16 | ~194 | 9:48 | rewarded-ad phone | `TAP` + a **cheesy "reward" jingle** (ironic, −16 dB) |
| B16 | ~302 | 9:52 | revenue bar jumps | rising `WHOOSH` |
| B16 | ~698 | 10:05 | A BETTER SEAT FOR THE AUCTION | `THUNK` |
| B17 | ~102→ | 10:11 | 3 gate nodes | 3 × `TAP` |
| B17 | ~434 | 10:22 | the eye node | ominous low `DRONE` fade-in |
| B17 | ~530 | 10:25 | NOT WHO YOU'D THINK TO BLAME | a turn — a low `WHOOSH` |
| B18 | ~128 | 10:31 | phone opens | `TAP` |
| B18 | ~443 | 10:41 | the "?" guess box | `TICK` (cursor blink), −22 dB |
| B18 | ~632 | 10:47 | LOW BY HALF | `BOOM` (soft) |
| B19 | 311→ | 10:59 | 24 file cards land | rapid soft `PLIP` cluster, ~0.8s |
| B19 | ~230 | 10:56 | winner peels out | `WHOOSH` up |
| B19 | ~673 | 11:11 | padlocks click shut | a run of `lock` clicks |
| B19 | 982/1257 | 11:22/11:31 | 2 ruling cards slide | 2 × `THUNK` (paper) |
| B19 | ~1510 | 11:40 | FIRST ORDER OF ITS KIND | `STAMP` |
| B20 | 113→300 | 11:44 | pins connect / route draws | soft pen-draw + `location ping` per pin |
| B20 | trace | dot retraces the route | a `sonar ping` each time it passes a stop |
| B20 | ~1239 | 12:22 | megaphone / PUBLIC ADDRESS SYSTEM | one **brief PA-feedback** squeal (−18 dB, <0.4s) + `BOOM` |
| B21 | 242→ | 12:27 | 75% wall grows | a low building `rumble` |
| B21 | 647→ | 12:41 | 3 walled cards | 3 × heavy `lock`/`STAMP` |
| B21 | ~1378 | 13:06 | NOTHING | `BOOM` (the big one for this act) |
| B22 | ~123 | 13:12 | ATT dialog pops | iOS-style `pop` |
| B22 | ~246 | 13:16 | thumb taps "Ask App Not to Track" | `TAP` |
| B22 | ~393 | 13:21 | everyone-else bar shrinks | `WHOOSH` down |
| B22 | ~972 | 13:40 | Apple's own window opens | a **bright clean `CHIME`** (Apple-ish, not a copy) |
| B23 | ~123 | 13:46 | APRIL 2025 label | `STAMP` |
| B23 | ~344 | 13:53 | 2 MONOPOLY stamps | 2 × hard `STAMP` |
| B23 | ~711 | 14:05 | 3 role tags | 3 × `TAP` |
| B23 | ~924 | 14:12 | AGAINST THE LAW | gavel-ish `STAMP` + `BOOM` |
| B24 | ~455 | 14:23 | Lucky joins the studio | (footstep) |
| B24 | ~823→900 | 14:35 | 1000-dot grid waves in | soft `rain`/grain, ~2s |
| B24 | ~1208 | 14:48 | seesaw tips | a `creak` + settle |
| B24 | ~1275 | 14:50 | AT THE SAME TIME | `BOOM` (soft) |
| **B25** | 0 | 14:15 | **cut to black** | music **stops**; a low `DRONE` fades in over ~1.5s |
| B25 | ~235→ | 14:23 | flow line draws (app←pays←advertiser) | one sustained `tone`, rising slightly |
| B25 | ~590 | 14:35 | "the app's real job" types | `typewriter` |
| B25 | ~740 | 14:40 | underline draws + LivePip | soft `PLIP` + a faint pulse tone |
| B25 | ~1019 | 14:49 | **YOU ARE THE INVENTORY** | the **BOOM** (biggest hit in the film) + music swells +4 dB |
| B25 | ~1230 | 14:56 | "NOTHING IS FREE." types on black | `typewriter`, then a single low resolving note |
| B25 | ~1400 | 15:02 | hold on black | near-silence, a breath of drone |
| B26 | ~78 | 15:06 | phone stutter | a short `glitch`/`stutter` |
| B26 | ~512 | 15:20 | ≈300 companies note (Chips) | soft `PLIP` cluster |
| B26 | ~770 | 15:29 | ATT toggle flicks | a `switch` click |
| B26 | ~902 | 15:33 | 2¢ → 0.4¢ | a small downward `WHOOSH` |
| B26 | ~984 | 15:36 | 1 IN 7 | `THUNK` |
| B27 | ~221 | 15:52 | route draws on map | `map ping` / pen |
| B27 | ~628 | 16:05 | Maps pin drops | `location ding` |
| B27 | ~784 | 16:10 | last-episode ticket card | `THUNK` (paper) |
| B27 | ~1042 | 16:19 | **SUBSCRIBE** | a bright confident `CHIME` + music lift |
| B27 | last 2s | 16:57 | outro | music + drone fade out with the edge-fade |

**Count:** ~15 distinct one-shot SFX files (tap, whoosh, thunk, plip, tick-loop,
coin, stamp, drone, chime-warm, chime-bright, boom, glitch, lock, reject,
pa-squeal) reused ~90 times. Plus footstep loop + reward jingle + sonar ping.

---

## 3 · Mix targets (§ runbook)

| Element | Level |
| --- | --- |
| VO (dialogue) | **−16 LUFS** integrated, true-peak ≤ −1.5 dBTP; gentle de-ess, 80 Hz HPF |
| Music bed | **−24 LUFS**, sidechain-ducked **−6 dB** whenever VO present (fast attack, 300 ms release) |
| SFX | **−18 to −12 dB** under VO; the 4–5 `BOOM`s may touch −8 dB briefly |
| Master | **−14 LUFS** integrated, **−1.5 dBTP** ceiling, LRA ≤ 11 (YouTube target), limiter last |

**Order:** VO clean-up → VO leveler → music duck (sidechain from VO bus) → SFX
bus → sum → master limiter. Export **48 kHz / stereo / AAC 384k** (or WAV for
the Resolve conform).

**Automated master (no NLE):** two-pass FFmpeg
`loudnorm=I=-14:TP=-1.5:LRA=11` — deterministic, reproducible. Reserve DaVinci
Fairlight for a hand-finished pass only.

**Subtitles:** generate the SRT/VTT from the **PLAIN script + WhisperX forced
alignment** (not by transcribing the render — the script is authoritative). The
same alignment feeds the YouTube transcript. `timing.json` already carries
whisper.cpp word times for the beats; WhisperX is the upgrade for the shipping
captions.

## 4 · Wiring (once files land)

- SFX: a tiny `<SfxTrack cues={[...]}/>` in `EpisodeV4.tsx` that renders one
  `<Audio src startFrom volume>` per cue (global frame → `startFrom`), OR lay
  them on the DaVinci timeline (faster to nudge by ear).
- Music: one `<Audio src loop volume>` spanning the episode, with a `volume`
  callback for the B25/B27 swells + the B25 dropout.
- Ducking is easiest in DaVinci (a track compressor keyed off the VO bus) — do
  it there, not in Remotion.
