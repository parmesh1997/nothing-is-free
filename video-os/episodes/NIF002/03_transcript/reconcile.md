# EP02 · RECONCILE (Step 2 · §10)

**Authoritative post-record timing.** Supersedes every `EST` in [EP02_01_SCRIPT.md](EP02_01_SCRIPT.md) and [EP02_02_BEATS.md](EP02_02_BEATS.md). Machine-readable copy: [reconcile.json](reconcile.json). Master VO track: [EP02_master.mp3](EP02_master.mp3) (16:50.73).

Measured with the Remotion-bundled `ffprobe` (n7.1). 28/28 beat files present in `EP02/Audio/`.

## Headline

| | |
| --- | --- |
| Intake target runtime | 15:00 |
| Floor / ceiling (§0.2) | 12:00 / 60:00 |
| **ACTUAL** | **16:50.7** (1010.7s) |
| Delta vs target | **+1:50.7** |
| Delta vs floor | +4:50.7 |
| `episodeTotalFrames` @ 30 fps | **30321** |
| Words (PLAIN, measured) | 2254 |
| **Delivered rate** | **133.8 wpm** gross |

**The runbook assumed 205 wpm (§6.1). The real clone, reading these v3-tagged documentary scripts at the creator's settings, delivers 133.8.** That is a ~35% miss and it is why the episode ran ~2 min long against a word count that was itself ~18% below my own estimate. This take **is** the calibration — see "Calibration finding" below. Nothing downstream is affected by the length except the value of `episodeTotalFrames`, which the progress rule and grid drift are driven from (§11.3).

## Per-beat table

`globalStartFrame` / `durationInFrames` / `episodeTotalFrames` are the §11.3 props-contract values for Step 3. Frames = `round(seconds × 30)`.

| Beat | Words | Dur (s) | Frames | globalStartFrame | Starts @ | WPM | Flag |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| B00 | 19 | 9.247 | 277 | 0 | 0:00.00 | 123.3 | |
| B01 | 85 | 37.799 | 1134 | 277 | 0:09.23 | 134.9 | |
| B02 | 90 | 38.426 | 1153 | 1411 | 0:47.03 | 140.5 | |
| B03 | 72 | 37.721 | 1132 | 2564 | 1:25.47 | 114.5 | near-slow |
| B04 | 94 | 44.748 | 1342 | 3696 | 2:03.20 | 126.0 | |
| B05 | 106 | 49.241 | 1477 | 5038 | 2:47.93 | 129.2 | |
| B06 | 58 | 28.029 | 841 | 6515 | 3:37.17 | 124.2 | |
| B07 | 94 | 42.188 | 1266 | 7356 | 4:05.20 | 133.7 | |
| B08 | 87 | 36.833 | 1105 | 8622 | 4:47.40 | 141.7 | |
| B09 | 72 | 32.914 | 987 | 9727 | 5:24.23 | 131.2 | |
| B10 | 70 | 37.642 | 1129 | 10714 | 5:57.13 | **111.6** | **SLOW >15%** |
| B11 | 81 | 33.071 | 992 | 11843 | 6:34.77 | 147.0 | |
| B12 | 95 | 38.113 | 1143 | 12835 | 7:07.83 | 149.6 | |
| B13 | 119 | 54.753 | 1643 | 13978 | 7:45.93 | 130.4 | |
| B14 | 71 | 33.567 | 1007 | 15621 | 8:40.70 | 126.9 | |
| B15 | 67 | 27.873 | 836 | 16628 | 9:14.27 | 144.2 | |
| B16 | 72 | 26.044 | 781 | 17464 | 9:42.13 | **165.9** | **FAST >15%** |
| B17 | 47 | 18.442 | 553 | 18245 | 10:08.17 | 152.9 | |
| B18 | 49 | 22.439 | 673 | 18798 | 10:26.60 | 131.0 | |
| B19 | 101 | 51.566 | 1547 | 19471 | 10:49.03 | 117.5 | near-slow |
| B20 | 95 | 42.188 | 1266 | 21018 | 11:40.60 | 135.1 | |
| B21 | 103 | 46.916 | 1407 | 22284 | 12:22.80 | 131.7 | |
| B22 | 72 | 33.724 | 1012 | 23691 | 13:09.70 | 128.1 | |
| B23 | 75 | 31.164 | 935 | 24703 | 13:43.43 | 144.4 | |
| B24 | 112 | 44.356 | 1331 | 25638 | 14:14.60 | 151.5 | |
| B25 | 87 | 38.922 | 1168 | 26969 | 14:58.97 | 134.1 | |
| B26 | 85 | 34.847 | 1045 | 28137 | 15:37.90 | 146.4 | |
| B27 | 76 | 37.956 | 1139 | 29182 | 16:12.73 | 120.1 | |
| **TOTAL** | **2254** | **1010.73** | **30321** | | **16:50.73** | **133.8** | |

Flag band: ±15% of the 133.8 mean = 113.7–153.9 wpm.

## Per-beat WPM flags

- **B10 — SLOW (111.6, −16.6%).** The "fourteen trillion auctions a day" scale beat. `[slowly]` on the big number plus short list fragments drag it. Delivery, not content — the beat is fine, it just sits heavy. Re-record option in C.
- **B16 — FAST (165.9, +24.0%).** The rewarded-video beat. It rushes the "+30 to 60 percent" figure and the "with you in it" landing, which is the beat's whole point. Re-record option in C.
- **B03 (114.5) and B19 (117.5)** sit just inside the slow edge — both are the deliberately fragmented "list" beats (the request fields; the losing bidders). Expected. No action.
- **B27 (120.1)** — the warm CTA. Expected. No action.

## Calibration finding (§17.1 — `CALIBRATED WPM`)

`CALIBRATED WPM` has been blank since Phase 0. **This record fills it.**

```
CALIBRATED WPM = 134     (gross; this clone + v3 tagged, documentary register + short-sentence
                          house style + creator's current stability setting)
```

Derivation: 2254 PLAIN words ÷ (1010.7s ÷ 60) = 133.8, taken across 28 separately-recorded beats with tightly-trimmed heads/tails (no internal silence > 0.4 s at −40 dB). Inter-beat gaps are already inside the number.

**Consequences for every future episode:**
- Word budget = `target_seconds ÷ 60 × 134`, **not** 205. A 15-minute episode is **~2,000 words**, not ~2,950. The §6.1 table (12 min → ~2,350; 15 min → ~2,950) is wrong for this clone by ~35%.
- The separate pause budget in §6.1 (0.4 s / beat boundary, etc.) is now largely redundant — beat-boundary gaps are baked into 134. Keep only the `[DROP]` 1.2 s at the reversal as an explicit add.
- This is a **Type C-adjacent** input (it changes how every word budget is derived). Not a visual/pipeline/character/asset change, so it doesn't gate — but it should be written into the runbook's §6.1 and §17.1, and re-run if the creator changes voice, model or stability (§6.1).
- Why so far off 205: the runbook's 205 came from Episode 1, which used a different (faster, less-tagged) delivery. Heavy `[slowly]`/`[thoughtful]`/`[serious]` tagging plus one-idea-per-sentence structure both cost pace. Real explainer channels commonly sit 135–160 wpm, so 134 is a legitimate register — it just needs the shorter word budget.

## Delta options (§10 — creator chooses before Step 3)

**A — Accept 16:50.7.** ⭐ Recommended. Every beat is real sourced material; nothing is padding; the length is normal for the reference set (Tony Talks Business 15:00, Ned Talks Business 21:00). Lock `episodeTotalFrames = 30321` and build.

**B — Trim to ~15:00.** Cut ~1:50 by dropping the two least load-bearing beats and tightening:
- **B03** (market-size framing, $390B / 82%) — −37.7 s. The episode works without the "how big is the rent" aside.
- **B14** (made-for-advertising sites) — −33.6 s. A tangent off the B13 correction; the correction stands without it.
- light trims to B05 / B13 — ~−25 s.
- → ~15:05. Costs 2 sourced beats and some texture. The correction, counter-argument and reversal are untouched. Requires re-recording only the trimmed beats.

**C — Re-record B10 and B16 for delivery.** Independent of A/B, ~0 runtime change. B10 slower material read a touch faster and lighter; B16 given room on the number and the final clause. Worth doing under either A or B.

**Recommendation: A + C.** Accept the length, fix the two flagged reads.

## Reconcile gate (§15.3)

| Check | Status |
| --- | --- |
| Every beat has an audio file | ✅ B00–B27, 28/28 |
| Durations measured, not estimated | ✅ ffprobe, table above |
| Per-beat WPM flagged | ✅ B10 SLOW, B16 FAST |
| Delta reported with options | ✅ A / B / C above |
| Master track + beat boundaries logged | ✅ [EP02_master.mp3](EP02_master.mp3) + this table + [reconcile.json](reconcile.json) |

**Nothing downstream is built until the creator picks A / B / C.** Then Step 3 generates `EP02_03_ASSETS.md`, `EP02_04_SCENES.md`, `EP02_06_PROMPTS_REMOTION.md` against these frame numbers.
