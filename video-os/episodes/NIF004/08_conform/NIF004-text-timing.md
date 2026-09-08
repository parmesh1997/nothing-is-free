# NIF004 — text timing sheet (for the Resolve text pass)

NIF004 beats render **picture + VO + SFX**. On-screen running text is added in
Resolve (runbook §22.7).

## Subtitles

Auto-transcribe in Resolve Studio, then correct every line against the **PLAIN**
blocks in `01_script/script.md` (the verbatim read). Beat boundaries below /
in `NIF004-markers.csv`.

## Baked Stamps — DO NOT re-add these as subtitles

Each beat carries at most one short boxed "Stamp" punch label baked into the
Remotion picture (an editorial accent, ~24–44px, boxed, orange or ink). The
subtitle pass should treat these as graphics already on screen. Rough inventory
(exact wording is in `src/nif004/v4/beats.tsx`):

| Beat | Baked Stamp (approx.) |
|---|---|
| B01 | THE SAME MACHINE |
| B02 | AND THIS IS THE SMALLEST OF THE THREE |
| B04 | EVERY LOAD IS A CHARGE ON THEIR BILL |
| B05 | JULY 16, 2018 · AND A VALID CARD ON FILE — NOW REQUIRED |
| B06 | +1,000% OVERNIGHT |
| B07 | YOU NEVER SEE THE RECEIPT |
| B08 | A COMPANY THAT SIZE — OVER A BARREL |
| B09 | EXPENSIVE, SLOWER, OR A DOWNGRADE |
| B10 | RIVALS TEAM UP TO ESCAPE YOUR METER |
| B11 | EVERY KIND OF LOOK, BY NAME |
| B13 | one small grey word: "Sponsored" |
| B15 | THE ORDER IS AN AUCTION FOR YOUR EMERGENCY |
| B16 | WHOEVER PAID MOST FOR THE SLOT |
| B17 | A DIRECTORY WOULD MAKE YOU SUSPICIOUS. A MAP DOES NOT. |
| B18 | THE SIGNAL DOES NOT STOP WHEN YOU PARK |
| B19 | YOU ARE ONE OF THE SENSORS IT IS BUILT FROM |
| B20 | MOST PEOPLE HAD NO IDEA THE SECOND SWITCH EXISTED |
| B21 | said it would stop → kept tracking → to sell ads |
| B23 | 1 IN 4 LAW-ENFORCEMENT WARRANTS GOOGLE GOT |
| B24 | YOU ARE THE REASON BOTH OF THEM WORK |
| B25 | IF YOU ARE THE ONE PAYING — WHY DOESN'T IT FEEL LIKE IT? |
| B26 | 10,000,000+ MILES OF STREET VIEW · EVERYWHERE ELSE RUNS ON THIS ONE |
| B27 | REFLEX IS WHAT A STANDARD IS MADE OF |
| B28 | GIVING THE MAP AWAY FOR FREE IS HOW THE MOAT GOT DUG |
| B30 | (reversal — the "023" window number + APP/ADVERTISER readouts are baked) |
| B31 | IT CHARGES BOTH SIDES OF THE GLASS AT ONCE |
| B32 | SAME CHANNEL, SAME QUESTION — WE READ THAT METER TOO |
| B33 | NOTHING IS FREE (signature, baked typeset) |

## Beat boundaries

| Beat | In (abs) | Out (abs) | Dur | Density |
|---|---|---|---|---|
| B00 | 0:00.0 | 0:16.4 | 16.4s | OPENING |
| B01 | 0:16.4 | 0:45.8 | 29.4s | OPENING |
| B02 | 0:45.8 | 1:22.3 | 36.4s | MEDIUM |
| B03 | 1:22.3 | 1:51.7 | 29.5s | MEDIUM |
| B04 | 1:51.7 | 2:27.8 | 36.0s | MEDIUM |
| B05 | 2:27.8 | 3:04.7 | 36.9s | HIGH |
| B06 | 3:04.7 | 3:40.6 | 36.0s | HIGH |
| B07 | 3:40.6 | 4:10.7 | 30.0s | MEDIUM |
| B08 | 4:10.7 | 4:50.4 | 39.7s | HIGH |
| B09 | 4:50.4 | 5:27.4 | 37.0s | MEDIUM |
| B10 | 5:27.4 | 6:13.7 | 46.3s | HIGH |
| B11 | 6:13.7 | 6:44.3 | 30.7s | MEDIUM |
| B12 | 6:44.3 | 7:10.5 | 26.1s | REST |
| B13 | 7:10.5 | 7:31.7 | 21.2s | MEDIUM |
| B14 | 7:31.7 | 7:59.3 | 27.6s | HIGH |
| B15 | 7:59.3 | 8:33.9 | 34.6s | MEDIUM |
| B16 | 8:33.9 | 8:59.3 | 25.5s | MEDIUM |
| B17 | 8:59.3 | 9:24.3 | 24.9s | MEDIUM |
| B18 | 9:24.3 | 10:03.2 | 38.9s | MEDIUM |
| B19 | 10:03.2 | 10:34.8 | 31.6s | MEDIUM |
| B20 | 10:34.8 | 11:06.2 | 31.4s | HIGH |
| B21 | 11:06.2 | 11:40.8 | 34.6s | HIGH |
| B22 | 11:40.8 | 12:02.6 | 21.8s | MEDIUM |
| B23 | 12:02.6 | 12:51.6 | 49.0s | HIGH |
| B24 | 12:51.6 | 13:28.8 | 37.1s | HIGH |
| B25 | 13:28.8 | 13:56.6 | 27.8s | MEDIUM |
| B26 | 13:56.6 | 14:26.3 | 29.7s | MEDIUM |
| B27 | 14:26.3 | 15:01.4 | 35.1s | MEDIUM |
| B28 | 15:01.4 | 15:26.3 | 24.9s | MEDIUM |
| B29 | 15:26.3 | 15:48.2 | 21.9s | MEDIUM |
| B30 | 15:48.2 | 16:27.7 | 39.5s | REVERSAL |
| B31 | 16:27.7 | 16:52.7 | 24.9s | MEDIUM |
| B32 | 16:52.7 | 17:15.3 | 22.6s | MEDIUM |
| B33 | 17:15.3 | 17:35.1 | 19.9s | MEDIUM |

Total: 17:35.1 (31654f).
