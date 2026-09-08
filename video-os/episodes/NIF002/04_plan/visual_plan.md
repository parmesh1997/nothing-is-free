# EP02 · SCENES (Step 3 · §11.2)

Per-beat composition, plane by plane, to the frame. Frame numbers are from [EP02_RECONCILE.md](EP02_RECONCILE.md) / [reconcile.json](reconcile.json).

## One deviation from the reconciled total

The reversal beat **B25** needs **+72 frames (2.4 s)** past its VO for the Dark Law resolution — crossfade settle + the silent "Nothing is free." typing on (§2.9, §6.4). That is a defined channel element, not content or padding, so it is built in:

| | audio-exact | **built** |
| --- | --- | --- |
| B25 `durationInFrames` | 1168 | **1240** |
| B26 `globalStartFrame` | 28137 | **28209** |
| B27 `globalStartFrame` | 29182 | **29254** |
| **`episodeTotalFrames`** | 30321 | **30393** (16:53.1) |

All props below and in [EP02_06_PROMPTS_REMOTION.md](EP02_06_PROMPTS_REMOTION.md) use **`episodeTotalFrames = 30393`**. Say the word and I drop B25's tail to keep it exactly 30321 (the Dark Law crossfade then overlaps the last VO words instead).

## Global rules for every block

- `BG` = `LockedField` at **global** phase (`globalStartFrame + frame`), ground rule at 78%, progress rule `globalStartFrame/30393 → (globalStartFrame+dur)/30393`. Never cuts, never resets (§2.1, §2.8, §11.3).
- Three planes minimum, every frame (§2.1). Nothing floats — every solid object on the ground rule or a surface (§2.2).
- One orange element per frame, progress rule excepted (§2.4).
- Occupancy ≥ 22% ink / ≥ 35% bottom-third, every sampled frame (§2.2). "projected" below is the compose-time target; the real check runs on the render (§11.5).
- Event floor by class (§4.2): OPENING 7/10s · HIGH 5/10s · MEDIUM 4/10s · REST 3/10s. **The reconcile made beats ~25% longer than planned — event budgets rose with them. Beats over ~40 s (B05, B07, B13, B19) carry a ⚠️ and need continuous sub-incident, not one big move.**
- Source tag bottom-left, mono, 60%, persistent, every frame (§2.7). Per-beat text below.

---

━━━ B00 ━━━ 9.25 s ━━━ 277 f ━━━ OPENING · signature ━━━
GLOBAL      startFrame 0 of 30393 · progress 0 → 0.9%
AUDIO       B00.mp3 @ f0
PLANES
  BG  locked field, grid, ground rule, progress rule (starts empty)
  MID low-contrast room edge (a table line), grey
  FG  a hand + `Phone` (subject ~52% frame h, on the table line), `AppTile` glyph on screen, a turning load ring, `Signature` type block left
CAMERA      still. `Breathe` 1.000→1.006.
OCCUPANCY   projected ink 24% · bottom-third 38% ✅ (phone mass low + type block)
STATES      f0–f14   "Nothing is free." fades in flat (no overshoot — §6.4)
            f8–f20   phone + hand already present; load ring starts turning
            f24–f70  the clause springs in; ring completes one turn; a `Gavel` tick lands on the ring; a price ghost ("¢") flickers once
            f70–f90  stamp SFX point (§6.4) on the accent word "auction"
            f90–277  hold, breathe, grid drift
EVENTS      fixed-words in · ring start · clause in · gavel tick · price ghost · accent stamp = 6 in 9.25 s ≈ 6.5/10s (OPENING floor 7 — add one: a second ring pulse ~f150) 
PEAK        f~78, "auction"
TEXT        `Signature` clause: *"And the app that just charged you nothing ran an auction the second you opened it."* accent word **auction**. Source tag: none yet (first sourced figure is B02) — show channel mark "NOTHING IS FREE" faint instead.
LOOP        L0 opens

━━━ B01 ━━━ 37.80 s ━━━ 1134 f ━━━ OPENING ━━━
GLOBAL      startFrame 277 of 30393 · progress 0.9% → 4.6%
AUDIO       B01.mp3 @ f0
PLANES
  BG  locked field
  MID the EXCHANGE node + a ring of ~160 `BuyerTile` at deep-mid depth (Z −2.0), faint
  FG  `Phone` (screen up, on the ground rule), a request `packet` glyph, a `DollarCoin` (1¢), three promise lines
CAMERA      f0 hold; f280 very small push toward the node (z −0.5→−0.7, 120f, easeInOut) on "who set that price". reason: point at where the answer lives.
OCCUPANCY   projected ink 25% · bottom-third 40% ✅ (phone + ring lower arc + promise type)
STATES      f0–f90     "Here is the half second…" — phone lit, screen loading
            f90–f150   packet peels off the screen, flies to the node (matched motion, `MotionBlur`)
            f150–f240  the ring of BuyerTiles lights around the node (StaggerGroup, wave)
            f240–f300  ONE tile flares orange; a `DollarCoin` "≈ 1¢" drops onto the phone — **the cold-open sting, must read by f300 ≈ 0:10** (§15.2)
            f300–f720  push; the three promise lines rise in the lower third, one per ~5 s
            f720–1134  hold; ring breathes; grid drift
EVENTS      packet peel · packet arrive · ring light (wave ×2) · tile flare · coin drop · push start · 3 promise lines = ~10 in 37.8 s ≈ 2.6/10s ⚠️ under OPENING 7 → build must add: loading pulses, tiles blinking bids, the coin bouncing, a counter. Target ≥ 26 events.
PEAK        f~270 (the flare + coin)
TEXT        promise lines: "EVERY COMPANY THAT GETS PAID." / "WHAT YOUR ATTENTION COSTS." / "WHO SET THE PRICE." · sting label "≈ 1¢" · source tag none (still pre-figure)
LOOP        L1 opens ("who set that price") · L2 opens ("about a cent")

━━━ B02 ━━━ 38.43 s ━━━ 1153 f ━━━ MEDIUM · save-the-cat ━━━
GLOBAL      startFrame 1411 of 30393 · progress 4.6% → 8.4%
AUDIO       B02.mp3 @ f0
PLANES
  BG  locked field
  MID an app-grid wall (`AppTile` ×~40) at midground; a small two-person `STUDIO` desk
  FG  `Lucky` on a couch (sit, expression neutral→worried), phone glow, a caption
CAMERA      still; `Breathe` on Lucky.
OCCUPANCY   projected ink 27% · bottom-third 46% ✅ (Lucky mass + couch on the ground rule + grid wall)
STATES      f0–f60     Lucky already seated; ads flick on her phone (screen recolours every ~20f)
            f60–f180   the app-grid wall builds behind; 97 of 100 tiles wash to a `paperShade` tint, 3 stay `ink` (a `LabelBox` "97% FREE")
            f180–f360  the STUDIO desk slides in from L under a label; two stick figures at it
            f360–f720  "not the villain" — the desk holds; Lucky lowers the phone, looks at it
            f720–1153  caption rises: "I didn't click one of them. They all still got paid." · hold, breathe
EVENTS      ad flickers (×3 waves) · grid build · tint wash · 97% label · desk slide · Lucky look · caption = ~11 in 38 s ≈ 2.9/10s → MEDIUM floor 4/10s (~15). Add: more ad flickers, a small counter of "ads seen: 0 clicks", desk figures moving.
PEAK        f~980, "still made money off me"
TEXT        `LabelBox` "97% OF APPS: FREE" · caption lower third · **source tag: "Statista / Google Play app distribution, 2024"** (first figure)
LOOP        —

━━━ B03 ━━━ 37.72 s ━━━ 1132 f ━━━ MEDIUM ━━━
GLOBAL      startFrame 2564 of 30393 · progress 8.4% → 12.2%
AUDIO       B03.mp3 @ f0
PLANES
  BG  locked field
  MID a `TextureBlock`/HATCH tick-field that multiplies (the "few billion / hour"), grey, low
  FG  hero `CountUp` to $390,000,000,000 · a `BarChart` single bar to 82% · `Callout` "MORE THAN 80¢ / $1"
CAMERA      still; small push on the count (scale 1→1.03, easeInOut).
OCCUPANCY   projected ink 25% · bottom-third 39% ✅ (hero number sits low, bar anchored to ground rule)
STATES      f0–f180    "big rent" — the hero number counts up from 0, lands ~f150 (align to VO)
            f180–f420  the 82% bar grows under "MONEY SPENT ADVERTISING ON A PHONE"
            f420–f720  the tick-field multiplies behind ("a few billion an hour")
            f720–1132  "rounding error" — the number shrinks to a tiny corner chip; hold
EVENTS      count start · count land · bar grow · label · tick multiply (×2) · number shrink = ~7 → MEDIUM ~15 needed. Add tick waves, a per-second counter.
PEAK        f~150, "$390 billion"
TEXT        hero "$390B / YEAR" · bar label · **source tag: "In-app ad spend, industry est., 2025"** (mark ESTIMATE on screen — §9.2)
LOOP        —

━━━ B04 ━━━ 44.75 s ━━━ 1342 f ━━━ HIGH ━━━ ⚠️ long
GLOBAL      startFrame 3696 of 30393 · progress 12.2% → 16.6%
AUDIO       B04.mp3 @ f0
PLANES
  BG  locked field
  MID a ghosted setup screen with a pre-ticked checkbox, low contrast
  FG  `Phone` on the ground rule · `RequestCard` peeling off it (subject) · field rows stamping on · `Icon` chips (pin, clock, lock)
CAMERA      still; the card is the anchor. tiny drift only.
OCCUPANCY   projected ink 28% · bottom-third 44% ✅ (phone + tall card)
STATES      f0–f90     "start with the tap" — phone lights, screen blank
            f90–f150   the RequestCard peels up off the screen and squares up (the subject)
            f150–f600  field rows stamp on one per ~1.5 s: ADVERTISING ID · LOCATION (pin) · MODEL · CARRIER · APP · TIME (clock) · "+ WHAT THE KIT KNOWS" — `StaggerGroup`, each with a small `MotionBlur`
            f600–f840  the setup screen ghosts in behind, checkbox already ticked; "YOU AGREED TO THIS"
            f840–1342  "the packet is the thing being sold. You." — every field row dims except the card outline, which pulses orange once; hold
EVENTS      card peel · 7 field stamps · setup ghost · checkbox · card pulse = ~11 in 45 s ≈ 2.4/10s ⚠️ HIGH needs ~22 → each field stamp is one event (7), add: cursor, redaction blocks sliding in, the ghost screen assembling in parts, a data-size chip ticking up.
PEAK        f~1000, "That packet is the thing being sold. You."
TEXT        field labels (typeset) · "YOU AGREED TO THIS ON A SETUP SCREEN" · **source tag: "Bidstream contents: US Senate (Wyden), 2021; FTC data-broker complaints"**
LOOP        —

━━━ B05 ━━━ 49.24 s ━━━ 1477 f ━━━ MEDIUM ━━━ ⚠️ long — longest non-reversal beat
GLOBAL      startFrame 5038 of 30393 · progress 16.6% → 21.4%
AUDIO       B05.mp3 @ f0
PLANES
  BG  locked field
  MID a row of ~8 other `AppTile`s at midground (Z −1.0), the "thousands of other apps"
  FG  one focus `AppTile` (subject) · ~10 `SdkChip`s plugging into its edge · a link line "MON · shopping → THU · word game"
CAMERA      f0 hold on the focus app; f450 small pan L→R along the midground app row (90f) on "rides inside thousands"; f900 pan back.
OCCUPANCY   projected ink 26% · bottom-third 40% ✅ (focus app large on ground rule, chip cluster, app row)
STATES      f0–f120    "how does a word game know your age" — focus app alone, a "?" over it
            f120–f420  ~10 SdkChips fly in from R and plug into the app's edge (StaggerGroup, 12f) — "≈ 10 KITS"
            f420–f560  count label: news/weather app version shows "20–30" chips briefly
            f560–f900  pan the app row; the same chip design lights inside 3–4 of the other apps
            f900–f1200 the link line draws: shared chip between "MON shopping" and "THU word game"
            f1200–1477 "a piece of ten advertising companies" — the chips pulse together once; hold
EVENTS      "?" · 10 chip plug-ins · count label · pan start · row apps light (×3) · pan back · link draw · chip pulse = ~18 in 49 s ≈ 3.7/10s ✅ MEDIUM (needs ~20 — close; add 2 more chip reactions)
PEAK        f~1350, "ten advertising companies"
TEXT        "≈ 10 KITS PER FREE APP" / "NEWS & WEATHER: 20–30" · **source tag: "Third-party tracking research (Binns et al. 2018; Exodus Privacy)"** — ⚠️ N5 citation to lock
LOOP        —

━━━ B06 ━━━ 28.03 s ━━━ 841 f ━━━ MEDIUM ━━━
GLOBAL      startFrame 6515 of 30393 · progress 21.4% → 24.2%
AUDIO       B06.mp3 @ f0
PLANES
  BG  locked field
  MID a faint cloud of the B05 chips, low
  FG  a long vertical ID string / barcode drawing up from the ground rule (subject) · chips firing arrows into it · a settings row with a "Reset" toggle
CAMERA      still.
OCCUPANCY   projected ink 24% · bottom-third 41% ✅ (the spine is tall and central, on the ground rule)
STATES      f0–f120    "all those kits write to one number" — the ID spine `DrawLine`s upward
            f120–f360  chips fire arrows into the spine (StaggerGroup); the spine thickens
            f360–f600  "Monday's app and Thursday's game are one person" — two small app glyphs snap to the same spine
            f600–f760  the settings row slides in; the "Reset" toggle sits there, untouched; a cursor hovers and leaves
            f760–841   hold
EVENTS      spine draw · ~6 arrow fires · spine thicken · 2 app snaps · settings row · cursor hover/leave = ~12 in 28 s ≈ 4.3/10s ✅ MEDIUM
PEAK        f~700, "Almost nobody ever does."
TEXT        "YOUR ADVERTISING ID" · "RESET" (toggle, off) · source tag continues from B04 (mechanism, no new figure)
LOOP        —

━━━ B07 ━━━ 42.19 s ━━━ 1266 f ━━━ HIGH ━━━ ⚠️ long · **AuctionFan debut**
GLOBAL      startFrame 7356 of 30393 · progress 24.2% → 28.4%
AUDIO       B07.mp3 @ f0
PLANES
  BG  locked field
  MID the EXCHANGE node
  FG  `AuctionFan` arc (120 `BuyerTile`), the "100 ms" clock dial
CAMERA      f0 push origin→node (z −0.5→−0.8, 40f, easeInOut); f210 PULL to the full arc (z −0.8→−1.5, 130f). reason: how many strangers get your description. **wide-end occupancy** — arc packed, tiles ≥ 8 px, node mass + dial → projected 25% at widest (§3.3).
OCCUPANCY   projected ink 26% · bottom-third 42% ✅
STATES      f0–f40     push; node draws; "THE EXCHANGE"
            f40–f210   lines fan out (DrawLine, 3f stagger) then BuyerTiles pop along the arc (StaggerGroup waves)
            f210–f340  pull begins; the "100 ms" clock dial appears; sweep wedge starts rotating
            f340–f420  sweep passes; a wave of ~40% of tiles greys out; each greyed tile drops a tiny "×"
            f420–f520  sweep completes; 3 tiles hold a lit bid chip
            f520–1266  hold full arc; `Breathe`; caption "remember the losers" lower third, orange underline
EVENTS      node · fan-out (×3 waves) · tile pops (×4 waves) · pull start · dial · sweep start · grey wave · sweep done · 3 winners · caption = ~17 in 42 s ≈ 4/10s ⚠️ HIGH needs ~21 → add per-tile bid blips during the sweep, a counter "120 BUYERS".
PEAK        align sweep-complete to the VO "one hundred milliseconds" (~f?, place at VO peak)
TEXT        "THE EXCHANGE" · "120 BUYERS" · "≈ 100 MILLISECONDS" · "REMEMBER THE LOSERS" · **source tag: "IAB OpenRTB spec; RTB request volume, industry est."**
LOOP        L3 opens ("remember the losers")

━━━ B08 ━━━ 36.83 s ━━━ 1105 f ━━━ HIGH ━━━
GLOBAL      startFrame 8622 of 30393 · progress 28.4% → 32.0%
AUDIO       B08.mp3 @ f0
PLANES
  BG  locked field
  MID a world map, most of it under grey `HATCH` (the "outside the richest countries" dim)
  FG  three `DataCard`s (banner $1.20 / full-screen $10 / rewarded $20 per 1,000) → a "÷ 1,000" operator → hero result "0.1¢ – 2¢"
CAMERA      still; hard settle on the hero at the end.
OCCUPANCY   projected ink 27% · bottom-third 41% ✅ (three cards mid, hero result low)
STATES      f0–f120    card 1 deals in (banner, $1.20)
            f120–f210  card 2 (full-screen, $10)
            f210–f300  card 3 (rewarded video, $20) — accent orange on this one
            f300–f420  the three slide together; a "÷ 1,000" stamps
            f420–f600  hero result "0.1¢ – 2¢" slams in (`CountUp` style, from the cards)
            f600–f780  the dim map: everything outside ~5 regions `HATCH`es over
            f780–1105  "that is you, priced" — the hero holds, one orange pulse; breathe
EVENTS      3 card deals · slide-together · ÷ operator · hero slam · map dim · pulse = ~8 → HIGH needs ~18 → each card has label + value + icon sub-reveals; add a bracket drawing between low and high.
PEAK        f~900, "That is you, priced."
TEXT        card values · "÷ 1,000 VIEWS" · hero "0.1¢–2¢ PER VIEW" · **source tag: "Mobile eCPM benchmarks, US, 2025 (Appodeal / Playio)"**
LOOP        L2 sharpens

━━━ B09 ━━━ 32.91 s ━━━ 987 f ━━━ MEDIUM ━━━ · **ProfileCard debut**
GLOBAL      startFrame 9727 of 30393 · progress 32.0% → 35.2%
AUDIO       B09.mp3 @ f0
PLANES
  BG  locked field
  MID a soft column rule between the two cards
  FG  `ProfileCard` sparse (left, "someone / somewhere", meter low) · `ProfileCard` rich (right, builds, meter climbs)
CAMERA      still.
OCCUPANCY   projected ink 25% · bottom-third 38% ✅ (two tall cards on the ground rule + meters)
STATES      f0–f90     "why the gap" — both card frames appear, empty; meters at floor
            f90–f150   left card fills: "SOMEONE" / "SOMEWHERE" — meter barely moves ("$")
            f150–f540  right card fills line by line: WOMAN · 30s · NEAR A PHARMACY · OPENED A BABY-CARE APP — meter climbs each line ("$$$$")
            f540–f720  "location exact, history long" — the rich meter maxes, orange
            f720–987   "vague is cheaper for the advertiser, better for you" — a small arrow points the cheap card at "you"; hold
EVENTS      2 frames · left 2 fills · right 4 fills · meter climbs (×4) · max · arrow = ~14 in 33 s ≈ 4.2/10s ✅ MEDIUM
PEAK        f~600, the rich meter maxing
TEXT        card fields (typeset) · meter values · source tag continues (mechanism)
LOOP        —

━━━ B10 ━━━ 37.64 s ━━━ 1129 f ━━━ MEDIUM ━━━ · flag: delivered SLOW (111.6 wpm)
GLOBAL      startFrame 10714 of 30393 · progress 35.2% → 38.9%
AUDIO       B10.mp3 @ f0
PLANES
  BG  locked field
  MID a counter wall that can't settle
  FG  hero `CountUp` toward 14,000,000,000,000 · "1,000,000 / SEC" on a bidder box · a tiny `Lucky`-on-couch vignette with a "~3,000" tally
CAMERA      still; the counter's motion is the event.
OCCUPANCY   projected ink 25% · bottom-third 37% ✅ (hero number low, bidder box, Lucky vignette on ground rule)
STATES      f0–f240    "not a rare event" — the hero number tears upward, digits blurring, never lands (loops the last decade of digits)
            f240–f480  "a million a second" — a bidder box stamps in, a per-second pulse
            f480–f780  "you are not special traffic" — the Lucky vignette; a tally over her counts 0 → ~3,000 across her day
            f780–1129  "every one shipped your location somewhere" — small location pings leave the vignette; hold
            NB the read is slow — keep the counter churning the whole beat so it never feels static (static-run ceiling 90f — §15.4)
EVENTS      counter churn (continuous, counts as recurring) · bidder box · per-sec pulses (×3) · Lucky vignette · tally · pings (×3) = enough for MEDIUM if the counter keeps moving
PEAK        f~300, "fourteen trillion"
TEXT        "≈ 14,000,000,000,000 / DAY" · "1,000,000 / SEC" · "YOU: ~3,000 / DAY" · **source tag: "RTB request volume + DSP throughput, industry est., 2026"** (mark ESTIMATE)
LOOP        —

━━━ B11 ━━━ 33.07 s ━━━ 992 f ━━━ HIGH ━━━ · money-flow track
GLOBAL      startFrame 11843 of 30393 · progress 38.9% → 42.2%
AUDIO       B11.mp3 @ f0
PLANES
  BG  locked field
  MID the chain of gates (buyer → exchange → seller → data) at mid-depth
  FG  the winning `BuyerTile` (lit) · the ad painting onto the `Phone` · a `DollarCoin` travelling back R→L through the gates, shaved at each
CAMERA      f120 track the coin R→L along the chain (follow the money, 200f, easeInOut).
OCCUPANCY   projected ink 26% · bottom-third 40% ✅ (phone + chain + coin)
STATES      f0–f90     "the highest bid wins" — one tile lights; the ad paints onto the phone
            f90–f120   "the advertiser gets charged" — a full-size coin appears at the right end
            f120–f600  track: the coin passes 4 gates; at each, a sliver peels off (MotionBlur), the coin visibly smaller, a gate label lights
            f600–f840  the coin arrives at the app, small; "each one keeps a slice"
            f840–992   matched-motion hold — the shrunk coin becomes the top line of B12's ledger
EVENTS      tile light · ad paint · coin appear · track start · 4 gate shaves · 4 gate labels · arrive = ~12 in 33 s ≈ 3.6/10s → HIGH needs ~17; add coin bob, sliver particles, a running "value left" chip.
PEAK        f~700, "each one keeps a slice"
TEXT        gate labels: BUYING SOFTWARE · EXCHANGE · SELLING SOFTWARE · DATA · "value left: …" chip · source tag continues
LOOP        —

━━━ B12 ━━━ 38.11 s ━━━ 1143 f ━━━ BUILD ━━━ · **TollStack debut**
GLOBAL      startFrame 12835 of 30393 · progress 42.2% → 46.0%
AUDIO       B12.mp3 @ f0
PLANES
  BG  locked field
  MID faint column rules
  FG  `TollStack`: $2.00 → −20% buy → −15% exchange → −15% sell → −data → ≈ $1.00 → ÷ 1,000 → 0.10¢ → app keeps ≈ 0.05¢. Shrink bar on the right.
CAMERA      small push as the stack passes the midline (scale 1→1.04).
OCCUPANCY   projected ink 28% · bottom-third 47% ✅ (the stack + bar own the bottom two-thirds — occupancy anchor)
STATES      f0–f60      "$2.00 for a thousand views" — top line lands, bar full
            f60–f420    four toll rows drop in (14f stagger); running value re-counts each time; bar clips down
            f420–f600   "closer to one dollar than two" — the ≈ $1.00 line, held
            f600–f840   "÷ 1,000" then "0.10¢" — the divide
            f840–1143   "the app kept about half of that" — final line "≈ 0.05¢" lands in orange; hold
EVENTS      top line · 4 rows · 4 recounts · 4 bar steps · ≈$1 · ÷1000 · 0.10¢ · final = ~16 in 38 s ≈ 4.2/10s ✅ (BUILD ~ HIGH — close; add bar tick sounds visual)
PEAK        f~980, "≈ 0.05¢"
TEXT        the ledger (typeset) · **source tag: "Programmatic fee ranges: ISBA/PwC; The Trade Desk filings"**
LOOP        L2 pays ("kept about half of that")

━━━ B13 ━━━ 54.75 s ━━━ 1643 f ━━━ HIGH ━━━ ⚠️ **longest body beat** · the correction (L1)
GLOBAL      startFrame 13978 of 30393 · progress 46.0% → 51.4%
AUDIO       B13.mp3 @ f0
PLANES
  BG  locked field
  MID a timeline rule 2020 — 2023
  FG  a "50%" myth block that gets struck · three dated `DataCard`s (2020: 15p unaccounted / 2022: 3p, 65p to publisher / 2023 US: 36¢ reaches a person) · a `Callout` "36¢" hero
CAMERA      small pan across the timeline as the cards land (L→R, slow).
OCCUPANCY   projected ink 27% · bottom-third 43% ✅
STATES      f0–f150     "half of every ad dollar disappears" — the "50%" myth block stamps in big
            f150–f240   a red/ink offset X strikes it ("FOR YEARS, ROUGHLY RIGHT")
            f240–f540   card 2020 deals (15p unaccounted), pan
            f540–f840   card 2022 deals (3p / 65p), pan
            f840–f1200  card 2023 deals (36¢) — this one enlarges into the `Callout` hero, orange
            f1200–1643  "a dozen small tolls, plus a lot of waste" — the struck myth fades; the 36¢ holds; a small stack of "toll" ticks; hold
EVENTS      myth block · strike · 3 card deals (each: frame + figure + label = 3 sub-events) · pan (×3) · hero enlarge · toll ticks · fade = ~20 in 55 s ≈ 3.6/10s ⚠️ HIGH needs ~27 → this beat MUST carry continuous incident. Consider: each card's figure counts up; the pan is continuous; add per-year context ticks. If it still feels thin at build, this is the candidate to split.
PEAK        f~1100, "thirty-six cents"
TEXT        "THE MYTH: 50% VANISHES" · card figures + years on screen · hero "36¢ OF THE $1" · **source tags rotate per card: "ISBA/PwC Study I 2020" / "ISBA/PwC Study II 2022" / "ANA Programmatic Transparency, Dec 2023"**
LOOP        L1 (the inherited-claim correction is audible + on screen here — §15.2)

━━━ B14 ━━━ 33.57 s ━━━ 1007 f ━━━ MEDIUM ━━━ · **JunkPage**
GLOBAL      startFrame 15621 of 30393 · progress 51.4% → 54.7%
AUDIO       B14.mp3 @ f0
PLANES
  BG  locked field
  MID a blank browser frame
  FG  `JunkPage` (fills with ad slots, no article) · a "1 IN 5" bar · a small flame on a `DollarCoin`
CAMERA      still.
OCCUPANCY   projected ink 26% · bottom-third 39% ✅ (the page is large, on the ground rule; bar + coin low)
STATES      f0–f90      "where does the wasted part go" — an empty page frame
            f90–f360    ad slots tile in from top-left, filling the whole page; no headline ever appears (HATCH fills)
            f360–f600   "one ad in five" — the bar fills to 20%
            f600–f840   a flame lands on a dollar coin and slowly eats it ("the advertiser's own money")
            f840–1007   hold; the page keeps flickering ads
EVENTS      page frame · ~8 ad-slot tiles (waves ×3) · bar fill · flame appear · coin burn (continuous) = ~9 → MEDIUM needs ~13; add slot flicker, a "0 READERS" label, the bar ticking.
PEAK        f~700, "burning quietly"
TEXT        "MADE FOR ADVERTISING" · "≈ 1 IN 5 ADS" · **source tag: "ANA Programmatic Transparency, Dec 2023"** — ⚠️ N17 exact % to confirm
LOOP        —

━━━ B15 ━━━ 27.87 s ━━━ 836 f ━━━ MEDIUM ━━━ · TollStack (list mode)
GLOBAL      startFrame 16628 of 30393 · progress 54.7% → 57.5%
AUDIO       B15.mp3 @ f0
PLANES
  BG  locked field
  MID 3–4 unlabelled toll-gates receding (parallax)
  FG  a named card "THE TRADE DESK — LARGEST INDEPENDENT BUYING PLATFORM" (sourced SVG or typeset) · a bar with a ~20% wedge cut out
CAMERA      small push; the receding gates parallax.
OCCUPANCY   projected ink 25% · bottom-third 38% ✅
STATES      f0–f120     "one toll, with a real name" — the named card lands
            f120–f360   the bar appears; a 20% wedge slices out, labelled "FEE TO RUN THE SOFTWARE"
            f360–f600   "one company, one step, one fifth" — the wedge pulses orange
            f600–836    "only one of several steps" — the receding gates light one by one behind it; hold
EVENTS      card · bar · wedge cut · label · pulse · 3 gates light = ~8 in 28 s ≈ 2.9/10s → MEDIUM needs ~11; add the wedge counting to 20%, gate parallax drift.
PEAK        f~500, "one fifth of the money"
TEXT        "THE TRADE DESK" · "≈ 20%" · **source tag: "The Trade Desk, investor filings (revenue ≈ 20% of gross spend)"**
LOOP        —

━━━ B16 ━━━ 26.04 s ━━━ 781 f ━━━ MEDIUM ━━━ · flag: delivered FAST (165.9 wpm) — give the number room
GLOBAL      startFrame 17464 of 30393 · progress 57.5% → 60.0%
AUDIO       B16.mp3 @ f0
PLANES
  BG  locked field
  MID a plain game screen (`AppTile` enlarged)
  FG  a "WATCH 30s TO CONTINUE" panel growing out of it · a `BarChart` ARPDAU step (+30–60%) · a countdown ring
CAMERA      still.
OCCUPANCY   projected ink 26% · bottom-third 40% ✅
STATES      f0–f120     "the app changes shape around it" — the game screen, plain
            f120–f300   a rewarded-video panel `WipeOn`s out of the screen; a 30-second ring starts
            f300–f480   the ARPDAU bar steps up +30% then +60% (two clear steps — the beat is fast, let each step land)
            f480–f660   "it feels like a favour" — the panel glows friendly; then re-labels "A SEAT FOR THE AUCTION, WITH YOU IN IT"
            f660–781    hold
EVENTS      screen · panel wipe · ring start · 2 ARPDAU steps · glow · relabel = ~7 in 26 s ≈ 2.7/10s → MEDIUM needs ~10; add ring ticks, a coin per step.
PEAK        f~620, "with you in it"
TEXT        "WATCH 30s TO CONTINUE" · "ARPDAU +30–60%" · **source tag: "Rewarded-video ARPDAU uplift, 2025 benchmarks"**
LOOP        —

━━━ B17 ━━━ 18.44 s ━━━ 553 f ━━━ REST · mid-tease ━━━
GLOBAL      startFrame 18245 of 30393 · progress 60.0% → 61.8%
AUDIO       B17.mp3 @ f0
PLANES
  BG  locked field
  MID the company chain, lit
  FG  one unlit `BuyerTile` at the back with an `Icon`(eye); a "?" rising; `FlowDiagram` with a `hub` box (the hidden party)
CAMERA      very slow push toward the back tile.
OCCUPANCY   projected ink 24% · bottom-third 36% ✅ (chain low + hub box)
STATES      f0–f120     "every company at least does something" — the chain lights, each box a verb (BUYS / SELLS / ROUTES)
            f120–f300   "one more group, not buying an ad" — the FlowDiagram hub drops below the chain, dashed lines to all, still dark
            f300–f480   an eye icon opens on it; the "?" rises; everything else dims toward it
            f480–553    hold on the dark hub
EVENTS      chain light (×3 verbs) · hub drop · dashed lines · eye open · "?" · dim = ~8 in 18 s ≈ 4.3/10s ✅ REST (floor 3)
PEAK        f~430, "not who you would think to blame"
TEXT        verbs on the boxes · hub label hidden ("?") · source tag continues
LOOP        L4 opens

━━━ B18 ━━━ 22.44 s ━━━ 673 f ━━━ REST · engagement beat (~62%) ━━━
GLOBAL      startFrame 18798 of 30393 · progress 61.8% → 64.0%
AUDIO       B18.mp3 @ f0
PLANES
  BG  locked field
  MID room edge
  FG  `Lucky` (stand → shrug, expression curious) lowering a phone · a `SpeechBubble`/comment field with a blinking cursor
CAMERA      still; `Breathe` on Lucky.
OCCUPANCY   projected ink 26% · bottom-third 44% ✅ (Lucky at human scale on the ground rule)
STATES      f0–f120     Lucky lowers the phone, looks up (to camera-ish but not addressing — §5)
            f120–f300   "how many ads… hold that number" — a comment field slides up, cursor blinking, a "?" where a number goes
            f300–f480   Lucky shrugs (curious)
            f480–673    "most people are low by about half" — the "?" stays; hold
EVENTS      phone lower · look · field slide · cursor (recurring) · shrug · hold = ~6 in 22 s ≈ 2.7/10s → REST floor 3, ok, but add cursor blink cadence + a subtle count-field.
PEAK        f~560, "low by about half"
TEXT        comment field placeholder "ADS BEFORE I PUT IT DOWN: ___" · source tag continues
LOOP        L5 opens (paid B26 + pinned comment at ship)

━━━ B19 ━━━ 51.57 s ━━━ 1547 f ━━━ HIGH ━━━ ⚠️ long · AuctionFan (harvest) · L3 + L4 close
GLOBAL      startFrame 19471 of 30393 · progress 64.0% → 69.1%
AUDIO       B19.mp3 @ f0
PLANES
  BG  locked field
  MID the `AuctionFan` arc returns
  FG  one winner tile lit · ~120 loser tiles each spawning a `ProfileCard variant:"mini" redacted` · a 2021 letter prop · a Dec-2024 order prop
CAMERA      f200 pull slightly to take in how many mini-cards exist.
OCCUPANCY   projected ink 28% · bottom-third 45% ✅ (the mini-cards spread across the lower frame — occupancy anchor)
STATES      f0–f150     "back to the auction, and to the losers" — the arc re-forms
            f150–f240   one tile wins and lights
            f240–f600   the other ~120 stay lit; each spawns a mini ProfileCard that drifts down and settles in the lower frame (StaggerGroup waves) — "THEY PAID NOTHING. THEY KEEP IT."
            f600–f960   the 2021 letter prop stamps in ("US SENATE, 2021"); then the Dec-2024 order ("REGULATOR, DEC 2024")
            f960–f1260  "first order of its kind" — the order prop gets an orange seal
            f1260–1547  hold; the field of mini-cards breathes
EVENTS      arc reform · winner · ~120 card spawns (waves ×5) · pull · letter · order · seal = ~13 discrete + 5 waves ≈ 3.5/10s ⚠️ HIGH needs ~26 → the card-spawn waves must be many small staggered events; add per-card settle bounces, a running "119 STILL HAVE IT" counter.
PEAK        f~1100, "the first order of its kind"
TEXT        "119 LOSERS. ALL KEEP THE FILE." · "US SENATE — 2021" · "REGULATOR ORDER — DEC 2024" · **source tag: "US Senate (Wyden–Cassidy) 2021; FTC v. Mobilewalla order, Dec 2024"**
LOOP        L3 closes, L4 closes

━━━ B20 ━━━ 42.19 s ━━━ 1266 f ━━━ HIGH ━━━ ⚠️ long · §14.4 sensitive — plain, sourced, no drama
GLOBAL      startFrame 21018 of 30393 · progress 69.1% → 73.3%
AUDIO       B20.mp3 @ f0
PLANES
  BG  locked field
  MID a plain abstract street grid (map plane)
  FG  `PinPath` — scattered pins resolving to a labelled path: HOME · WORK · A CLINIC · A COURTROOM · A PLACE OF WORSHIP · a `DataCrate` "HUNDREDS OF MILLIONS OF DEVICES" · a `GovBuilding` receiving one
CAMERA      f150 slow pull from one pin out to the whole path (reveal context, 180f).
OCCUPANCY   projected ink 26% · bottom-third 41% ✅
STATES      f0–f150     "dots become a life" — a scatter of pins on the map
            f150–f540   pull; the pins connect into the path; labels type on one at a time (mono, one clause each — §14.4)
            f540–f780   "sold in bulk" — a `DataCrate` stamps "HUNDREDS OF MILLIONS OF DEVICES"
            f780–f1020  "some passed to government" — a `GovBuilding` silhouette; the crate hands it one; "NO WARRANT"
            f1020–1266  "an auction is a public address system" — the whole path pulses once; hold
EVENTS      pins scatter · pull · path connect · 5 label types · crate · gov building · handoff · pulse = ~12 in 42 s ≈ 2.9/10s ⚠️ HIGH needs ~21 → each label type is one event; add pin-drop bounces, the path drawing segment by segment, the crate barcode scanning.
PEAK        f~1100, "a record of where people go"
TEXT        path labels (typeset, plain) · "HUNDREDS OF MILLIONS OF DEVICES" · "NO WARRANT" · **source tag: "FTC v. Kochava (settlement 2026); FTC Gravy/Venntel, Dec 2024"** — ⚠️ N22 lock the government-purchase cite or use the safer line
LOOP        —

━━━ B21 ━━━ 46.92 s ━━━ 1407 f ━━━ HIGH ━━━ ⚠️ long · **WalledVsOpen debut** · L1 closes
GLOBAL      startFrame 22284 of 30393 · progress 73.3% → 77.9%
AUDIO       B21.mp3 @ f0
PLANES
  BG  locked field
  MID the two zones (OPEN | WALLED)
  FG  the toll chain collapsing into a small OPEN box · a large `ink` WALLED block · a spend bar filling ~75% into it · hero values (Google ≈ $200B / Meta ≈ $190B / Amazon > $20B per qtr)
CAMERA      f200 PULL BACK to reveal the walled block dwarfing OPEN (relative size is the point, 200f). **wide-end occupancy** — block + values carry it alone (§3.3).
OCCUPANCY   projected ink 29% · bottom-third 44% ✅ (the walled block is a large mass on the ground rule)
STATES      f0–f200     "everything so far is the open auction" — the whole B07–B19 chain shown small, then it collapses into a box marked OPEN
            f200–f420   pull; the WALLED block rises from the ground rule, big
            f420–f660   a spend bar fills ~75% into the block ("THREE QUARTERS")
            f660–f1020  hero values stack and count up: GOOGLE ≈ $200B → META ≈ $190B → AMAZON > $20B / QTR (sourced logos or typeset)
            f1020–1407  "ads shown to people who paid nothing" — one orange pulse on the block; hold
EVENTS      chain shrink · collapse · pull · block rise · spend bar · 3 value counts · pulse = ~9 in 47 s ≈ 1.9/10s ⚠️ HIGH needs ~24 → the chain-collapse is a rich animated sequence; each value counts up (3 long events); add bar ticks, logo reveals.
PEAK        f~900, "two hundred billion dollars"
TEXT        "OPEN" / "WALLED" · "≈ 75% OF THE SPEND" · the three values · **source tags: "Alphabet 10-K; Meta 10-K; Amazon 10-K (2025)"**
LOOP        L1 begins to close (who set the price → the walled few)

━━━ B22 ━━━ 33.72 s ━━━ 1012 f ━━━ MEDIUM ━━━ · **PermissionPrompt debut** · the one [dry]
GLOBAL      startFrame 23691 of 30393 · progress 77.9% → 81.2%
AUDIO       B22.mp3 @ f0
PLANES
  BG  locked field
  MID a store shelf line
  FG  `PermissionPrompt` (generic) · a market-price line that sags · an "APP STORE — SPONSORED" slot that lights
CAMERA      still.
OCCUPANCY   projected ink 25% · bottom-third 38% ✅
STATES      f0–f150     "Apple plays this cleverly" — the PermissionPrompt card appears
            f150–f300   the "Ask App Not to Track" button highlights; "MOST PEOPLE SAY NO"
            f300–f540   a market-price line across the frame sags downward ("EVERYONE ELSE'S PRICE")
            f540–f780   "the next year" — an "APP STORE — SPONSORED" slot lights under a wall (Apple keeps this one)
            f780–1012   "the referee opened its own betting window" — one dry beat; hold on the sponsored slot, orange
EVENTS      prompt · button highlight · label · price sag (continuous) · sponsored slot · hold = ~6 → MEDIUM needs ~13; add the price line wobbling as it sags, a cursor on the button, the slot's "SPONSORED" tag typing.
PEAK        f~880, "its own betting window"
TEXT        prompt copy · "MOST SAY NO" · "APP STORE — SPONSORED" · **source tag: "Apple ATT (2021); App Store ads expansion (2022)"**
LOOP        —

━━━ B23 ━━━ 31.16 s ━━━ 935 f ━━━ MEDIUM ━━━ · the ruling
GLOBAL      startFrame 24703 of 30393 · progress 81.2% → 84.3%
AUDIO       B23.mp3 @ f0
PLANES
  BG  locked field
  MID a courtroom rail, low contrast
  FG  a large `Gavel` · "APRIL 2025" · two boxes "PUBLISHER AD SERVER" / "AD EXCHANGE" each taking a "MONOPOLY" stamp · a MARKETPLACE / BUYER / SELLER triangle collapsing onto one wordmark
CAMERA      still; hard settle on each stamp.
OCCUPANCY   projected ink 27% · bottom-third 41% ✅ (gavel + two boxes on the ground rule)
STATES      f0–f120     "how you get sued" — the gavel drops, "APRIL 2025" stamps
            f120–f360   box 1 "PUBLISHER AD SERVER" slides in from L, takes a "MONOPOLY" stamp
            f360–f540   box 2 "AD EXCHANGE" slides in from R, takes a "MONOPOLY" stamp
            f540–f780   the triangle (marketplace / biggest seller / biggest buyer) draws, then collapses onto one wordmark (Google, sourced SVG or typeset)
            f780–935    "against the law" — hold, one orange element = the second stamp
EVENTS      gavel · date stamp · box 1 · stamp 1 · box 2 · stamp 2 · triangle draw · collapse · hold = ~9 in 31 s ≈ 2.9/10s → MEDIUM needs ~12; add gavel bounce, stamp dust, triangle vertices lighting.
PEAK        f~820, "against the law"
TEXT        "APRIL 2025" · box labels · "MONOPOLY" ×2 · **source tag: "US v. Google, EDVA — liability ruling, 17 Apr 2025"**
LOOP        L1 closes

━━━ B24 ━━━ 44.36 s ━━━ 1331 f ━━━ HIGH ━━━ ⚠️ long · counter-argument
GLOBAL      startFrame 25638 of 30393 · progress 84.3% → 88.7%
AUDIO       B24.mp3 @ f0
PLANES
  BG  locked field
  MID the 97% app grid returns
  FG  the two-person STUDIO desk (from B02) · a "1 / 1,000" click tally · a balance scale INVASIVE ↔ POINTLESS
CAMERA      still; `Breathe`.
OCCUPANCY   projected ink 27% · bottom-third 43% ✅
STATES      f0–f150     "clean to call it a scam. it isn't." — the app grid washes back in, 97% tinted
            f150–f450   "the auction lets a two-person studio give a game away and still eat" — the STUDIO desk re-enters from L; the two figures work
            f450–f750   "clicked once in a thousand" — a tally ticks: 1,000 impressions, 1 click
            f750–f1050  "invasive and pointless at the same time" — a balance scale drops in; INVASIVE on one pan, POINTLESS on the other; it wobbles and settles LEVEL
            f1050–1331  the one [dry] delivery — hold on the level scale
EVENTS      grid wash · desk enter · figures work (recurring) · tally (counts) · scale drop · 2 pans load · wobble · settle = ~11 in 44 s ≈ 2.5/10s ⚠️ HIGH needs ~22 → the tally counting 1→1000 is continuous; the scale wobble is continuous; add impression dots raining, one turning into a click.
PEAK        f~1000, "invasive and pointless at the same time"
TEXT        "97% FREE" · "1 CLICK / 1,000" · "INVASIVE" / "POINTLESS" · **source tags: "Google Play distribution 2024; display CTR benchmarks"**
LOOP        —

━━━ B25 ━━━ 41.33 s (VO 38.92 + 2.4 tail) ━━━ 1240 f ━━━ REVERSAL · Dark Law (§2.9) ━━━
GLOBAL      startFrame 26969 of 30393 · progress 88.7% → 92.8%
AUDIO       B25.mp3 @ f0 (ends ~f1168; f1168–1240 silent)
PLANES
  BG  `BeatFrame` with `darkLawStartGlobalFrame` set → field crossfades paper→ink over 20f, grid to 8% white, progress rule stays orange (§2.9)
  MID —
  FG  `DarkLaw` component: the app `AppTile` flips to a lot-number / barcode · the typed reversal line · then `SignatureReturn` "NOTHING IS FREE." silent
CAMERA      locked. No move. The crossfade carries it.
OCCUPANCY   Dark Law frames are exempt (mean luma < 120 — §11.5) but keep intentional: the orange progress rule + the typed line + the barcode.
STATES      f0–f120     "change how you look at it" — paper still up; the AppTile sits center
            f120–f140   crossfade to ink begins (match `darkLawStartGlobalFrame` = 26969 + 120 = 27089)
            f140–f420   "run it forward… describe you well enough that a stranger will bid" — the AppTile flips to a barcode / lot number; the typed reversal line types on in mono (light on ink)
            f420–f1120  "you were never the user. you are the inventory. free because you sell." — line completes; `[DROP]`
            f1120–1240  VO done — "NOTHING IS FREE." types on, silent (`SignatureReturn`), cursor blink; hold
CAMERA/MUSIC music stops at the crossfade; brief silence; handled in Resolve mix (§12.2), not here
EVENTS      AppTile hold · crossfade · barcode flip · typed line (types continuously) · DROP · signature type · cursor = enough; the Dark Law is deliberately sparse
PEAK        the silence after "because you sell."
TEXT        `DarkLaw reversalLine`: **"YOU WERE NEVER THE USER. YOU ARE THE INVENTORY."** (a distilled on-screen line — the full sentence is spoken) · then "NOTHING IS FREE." silent · source tag: hidden during Dark Law
LOOP        L0 closes · L1 / L2 resolved

━━━ B26 ━━━ 34.85 s ━━━ 1045 f ━━━ MEDIUM · implication ━━━
GLOBAL      startFrame 28209 of 30393 · progress 92.8% → 96.2%
AUDIO       B26.mp3 @ f0
PLANES
  BG  `LockedField` — paper fades back up from the Dark Law over the first ~20f
  MID room edge
  FG  a `Phone` opening, the load-stutter drawn as one fast `AuctionFan` burst · a small `PermissionPrompt` · "1 IN 7"
CAMERA      still.
OCCUPANCY   projected ink 25% · bottom-third 39% ✅
STATES      f0–f20      paper returns
            f20–f180    "that small stutter when a free app opens" — a phone opens; on the half-beat, one fast fan-burst fires and vanishes
            f180–f420   "a few hundred companies just got a note about where you are" — pins scatter from the phone briefly
            f420–f720   "ask app not to track… it just lowers your price" — the small PermissionPrompt; the price chip on the phone drops from 2¢ to 0.4¢
            f720–1045   "about one person in seven turns it on" — a "1 IN 7" fills; hold
EVENTS      paper return · phone open · fan burst · pins · prompt · price drop · 1-in-7 fill = ~7 in 35 s ≈ 2/10s → MEDIUM needs ~14; add repeated stutter bursts as examples, pin trails, the prompt buttons.
PEAK        f~600, "It just lowers your price."
TEXT        "ASK APP NOT TO TRACK" · "2¢ → 0.4¢" · "≈ 1 IN 7" · **source tag: "ATT opt-in rate ≈ 14%, 2024 (Singular / Business of Apps)"**
LOOP        L5 closes (pinned comment finishes it at ship)

━━━ B27 ━━━ 37.96 s ━━━ 1139 f ━━━ MEDIUM · bridge + CTA ━━━
GLOBAL      startFrame 29254 of 30393 · progress 96.2% → 100%
AUDIO       B27.mp3 @ f0
PLANES
  BG  locked field; progress rule reaches 100% at the last frame
  MID a minimal `RouteMap` street grid
  FG  a route line drawing to an `orange` pin · "NEXT — GOOGLE MAPS" · a `DataCard` "56% OF EVERY MOVIE TICKET…" (prev-ep card) · a subscribe prompt
CAMERA      f120 small push along the route (easeInOut).
OCCUPANCY   projected ink 25% · bottom-third 40% ✅ (map fills the lower frame; cards mid)
STATES      f0–f180     "an app you don't think of as advertising" — the RouteMap draws in
            f180–f420   a route line draws L→R to a pin; "NEXT — GOOGLE MAPS" sets
            f420–f720   the previous-episode card slides in ("56% OF EVERY MOVIE TICKET DOESN'T GO TO THE THEATER")
            f720–f1000  "subscribe, and the next one finds you" — a subscribe prompt; the progress rule visibly completes
            f1000–1139  hold on 100%; end
EVENTS      map draw · route draw · pin · NEXT label · prev-ep card · subscribe prompt · progress complete = ~7 in 38 s ≈ 1.8/10s → MEDIUM needs ~15; add route dashes animating, map streets drawing individually, the card's figure.
PEAK        f~980, "the next one finds you" + progress hits 100%
TEXT        "NEXT — GOOGLE MAPS" · prev-ep card · "SUBSCRIBE" · source tag: channel mark
LOOP        —

---

## Occupancy risk register (compose-time)

| Beat | Risk | Mitigation |
| --- | --- | --- |
| B07, B21 | camera **pulls** → subject shrinks, ink can drop below 22% at the wide end (§3.3) | compose at the widest framing first; AuctionFan arc packed dense; WalledVsOpen block is a large low mass; check the wide frame explicitly before animating |
| B01, B10, B15, B17, B26, B27 | projected bottom-third near the 35% floor | pull mass down: keep the phone / hero number / map on the ground rule; the progress rule + a caption band help; if a render frame fails, add a foreground element low |
| B25 | Dark Law — exempt, but must not read as "empty/broken" | the orange progress rule + typed line + barcode keep it intentional |
| all long beats (B04, B05, B07, B13, B19, B20, B21, B24) | event density below class floor as written | the STATES above are the skeleton; the build fills continuous sub-incident (counters, staggered waves, parallax). **B13 is the split candidate** if it can't carry 55 s. |

## Event-density note

The reconcile stretched every beat ~25%, so the §4.2 class floors now demand more events per beat than the Step 1 plan budgeted. None of the beats are *structurally* too long, but the four flagged HIGH beats over 42 s need the build to treat counters, staggered group entrances and camera moves as the continuous-incident layer. If B13 (55 s) still feels thin after a first build pass, splitting it at the 2022→2023 card (into B13a / B13b) is the clean fix and adds one composition, not runtime.
