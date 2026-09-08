# NIF003 — text timing sheet (for the DaVinci Resolve text pass)

From 2026-09-06 (runbook §22.7): NIF003 beats render **visual-only**. All
on-screen words — subtitles **and** the kinetic "deep text" punch cards — are
added in Resolve over the Remotion picture. This sheet is the **source of
truth**; it mixes beat-relative and episode-absolute times per beat.

> **For the Resolve Text+ pass use `NIF003-deeptext-abs.md`** — every PUNCH /
> DEEP TEXT / SIGNATURE / LABEL cue from here, normalised to one absolute
> 30 fps timecode with an in-point + hold. Regenerate it with
> `python engine/remotion/scripts/build-deeptext-abs.py` after editing this file.
> Subtitles: auto-transcribe in Resolve, then match wording to `01_script/script.md` PLAIN.

- **SUBTITLE** = the running bottom caption. For the verbatim SRT use the
  `PLAIN` block in `01_script/script.md`; the lines below are the condensed
  on-screen phrasing used in the old baked version, kept as a reference.
- **PUNCH** = a full-frame kinetic hit (orange Bebas, the "deep text").
  `kicker` = the small line above it, `sub` = the small line below.
- Times are where the cue should **land** (≈ the word being spoken). Give each
  a ~6–10f lead-in.

Populated per beat as each beat's visual rebuild is finished. **B00, B01 done.**

---

## B00 · 0:00.0 – 0:10.4  (cold open + signature)

| Land (abs) | Type | Text |
|---|---|---|
| 0:00.2 | **SIGNATURE** | **Nothing is free.** — the fixed channel signature (§6.4). Condensed bold sans, ~150px, uppercase, ink; the word **"free."** in orange (`#E24D28`). Flat, no emotion, every episode. Lands by ~0:01.4, holds to ~0:02, lifts up-and-out over ~20f. An audio stamp on the accent. |
| 0:04.2 | SUBTITLE | And the channel you just turned on for free… |
| 0:07.1 | PUNCH | kicker: "Already paid" · **FOUR COMPANIES** · sub: "before your show even started." |

Visual sync (in the picture): 0:06.6 the TV lights and 4 coins fire out;
0:07.1–0:07.8 the 4 company marks stamp in along the top on connecting lines;
Lucky startles (open mouth + "!") at ~0:07.0.

---

## B01 · 0:10.4 – 0:45.9  ("the chain of payments you never see")

| Land (abs) | Type | Text |
|---|---|---|
| 0:10.5 | SUBTITLE | Here is what nobody tells you about the television in your living room. |
| 0:15.6 | SUBTITLE | Turning it on sets off a chain of payments you never see. |
| 0:20.5 | SUBTITLE | The network gets paid. |
| 0:21.7 | SUBTITLE | The local station gets paid again, separately. |
| 0:24.9 | SUBTITLE | A ratings company gets paid to count you. |
| 0:28.1 | SUBTITLE | An advertiser pays to reach you. |
| 0:31.8 | SUBTITLE | This episode follows that chain, link by link. |
| 0:39.2 | PUNCH | kicker: "Every company that gets paid," · **IN WHAT ORDER** |
| 0:40.1 | SUBTITLE | And why the bill keeps climbing even as millions of people quit paying it entirely. |

Visual sync notes (already in the Remotion picture — text should ride these):
- 0:21.2 / 0:23.2 / 0:26.6 / 0:29.6 — each chain card flips to **PAID** with an
  orange spark (network / station / ratings / advertiser).
- 0:33.9 — the whole chain glows orange once ("link by link").
- 0:41.6 → end — the "$95/mo" bill turns orange and climbs; the "% have quit"
  bar grows.

---

## B03 · starts 1:37.5 — "how does channel four make a dollar?"

| Land (local) | Type | Text |
|---|---|---|
| ~0:04 | SUBTITLE | Over-the-air TV has always been free to receive. |
| ~0:09 | SUBTITLE | Buy an antenna once. ABC, CBS, Fox — no charge, forever. |
| ~0:28 | PUNCH | FREE TO RECEIVE |
| ~0:28+ | SUBTITLE | So here's the question this episode answers… |
| ~0:34 → end | DEEP TEXT (hold) | If nobody charges you at the antenna — how does channel four make anyone a dollar? |

## B04 · starts 2:17.2 — the 1992 Cable Act, must-carry vs retrans

| Land (local) | Type | Text |
|---|---|---|
| ~0:04 | SUBTITLE | Before 1992, cable took the signal for free and resold it. Broadcasters got nothing. |
| ~0:20 | PUNCH | THE CABLE ACT · 1992 |
| ~0:29 | SUBTITLE | Now every station picks one of two paths, every three years. |
| ~0:29 | LABEL (on art) | MUST CARRY — carried, can't charge a cent |
| ~0:36 | LABEL (on art) | RETRANS CONSENT — charge anything, or go dark |
| ~0:52 | PUNCH | ALMOST EVERY STATION picked to get paid |

## B05 · starts 3:13.1 — under $1B → $15B

| Land (local) | Type | Text |
|---|---|---|
| ~0:04 | SUBTITLE | In 2010, retrans fees across the whole industry were under $1 billion a year. |
| ~0:15 | DEEP TEXT | This year: $15 BILLION |
| ~0:33 | SUBTITLE | The rate cable pays per subscriber is now about $4.83 a month… |
| ~0:44 | PUNCH | +7% in a single year |

## B06 · starts 4:00.1 — the broadcast TV fee line

| Land (local) | Type | Text |
|---|---|---|
| ~0:06 | SUBTITLE | Look at your cable bill for a line called a "broadcast TV fee". |
| ~0:09 | LABEL (on art) | BROADCAST TV FEE — $10–$30/mo (up to $48 in some Comcast markets) |
| ~0:25 | PUNCH | NOT A TAX · NOT OPTIONAL |
| ~0:37 | SUBTITLE | It's itemized separately, so the store price looks smaller than the real one. |
| ~0:46 | SUBTITLE | And that's before equipment rental — another $12–$15 a month, per box. |

## B07 · starts 4:57.1 — going dark

| Land (local) | Type | Text |
|---|---|---|
| ~0:05 | SUBTITLE | Path two comes with a weapon: the station can simply go dark. |
| ~0:13 | SUBTITLE | No warning, no error message. Your screen just goes black. |
| ~0:33 | PUNCH (over the black screen) | "NEGOTIATING TACTIC" |

## B08 · starts 5:30.8 — Disney vs Charter, 2023

| Land (local) | Type | Text |
|---|---|---|
| ~0:04 | LABEL (on art) | SEP 2023 |
| ~0:07 | SUBTITLE | Disney and Charter couldn't agree on a price. |
| ~0:12 | SUBTITLE | Disney pulled ABC, ESPN and a dozen channels from ~15 million Spectrum homes. |
| ~0:16 | DEEP TEXT | 15,000,000 households · no vote |
| ~0:26 | DEEP TEXT | 12 DAYS DARK |
| ~0:30 | SUBTITLE | It ended hours before Monday Night Football — on ESPN, the channel that went dark. |

---

## B09 · starts 6:05.6 — Disney vs DirecTV, 2024
| Land (local) | Type | Text |
|---|---|---|
| ~0:05 | LABEL (art) | SEP 2024 · SATELLITE |
| ~0:08 | SUBTITLE | Disney and DirecTV missed their deadline too. Channels went dark for 11M+ subscribers. |
| ~0:19 | SUBTITLE | Right as the US Open, college football and the season's first MNF were about to air. |
| ~0:30 | DEEP TEXT | 13 DAYS |
| ~0:37 | SUBTITLE | DirecTV offered a $20 credit — for three weeks of channels they were already paying for. |

## B10 · starts 6:50.4 — Disney vs YouTube TV, 2025 + the pattern
| Land (local) | Type | Text |
|---|---|---|
| ~0:05 | LABEL (art) | OCT 2025 · STREAMING |
| ~0:12 | SUBTITLE | ~20 channels dark. Disney reportedly lost ~$4.3M a day in ad revenue — its own channels dark. |
| ~0:36 | DEEP TEXT | Cable. Satellite. Streaming. Three fights, three years in a row. |
| ~0:52 | PUNCH | A STRATEGY DISNEY RUNS ON A SCHEDULE |

## B11 · starts 7:46.3 — cutting the cord doesn't exit the chain
| ~0:04 | SUBTITLE | Cutting the cord? You just watched the counter-example. |
| ~0:15 | SUBTITLE | Streaming folds the same retrans + sports payments into a higher base price. |
| ~0:27 | LABEL (art) | RSN FEE — $3–$17/mo (Fubo shows it openly) |
| ~0:42 | PUNCH | YOU JUST CHANGED WHO MAILS YOU THE BILL |

## B12 · starts 8:29.0 — mid-roll
| ~0:00 | DEEP TEXT | SUBSCRIBE — we price the number on your bill, every episode |
| ~0:16 | SUBTITLE | Back to the chain — it gets stranger from here. |

## B13 · starts 8:48.4 — sports = 60–90%
| ~0:04 | SUBTITLE | Both fights were about one thing: sports rights. |
| ~0:19 | DEEP TEXT | 60–90% of every dollar cable pays broadcasters |
| ~0:26 | SUBTITLE (dry) | Not comedy. Not drama. Not the local news you actually watch. |

## B14 · starts 9:20.9 — ESPN's carriage rate
| ~0:04 | SUBTITLE | ESPN charges providers ~$9.50 per subscriber, every month. |
| ~0:17 | SUBTITLE | The highest carriage rate of any channel in the country — ~7× what FS1 gets. |
| ~0:30 | PUNCH | BILLED WHETHER YOU WATCH A GAME OR NOT |

## B15 · starts 9:58.7 — $7.5B/year
| ~0:04 | SUBTITLE | Add it across everyone with cable — ESPN's main network alone: ~$7.5 billion a year. |
| ~0:15 | DEEP TEXT | $7.5B — before one ad, one ticket, one jersey |

## B16 · starts 10:28.3 — no opt-out
| ~0:04 | SUBTITLE | There's no version of a cable package where you uncheck sports and your bill drops. |
| ~0:20 | LABEL (art) | SPORTS TIER — CAN'T REMOVE |
| ~0:26 | PUNCH | THE FEE IS BAKED IN ON PURPOSE |
| ~0:32 | SUBTITLE | A household that never turns on a game still funds it — every month. |

---
## B17–B32

**B17** (11:13.7) — Bally Sports RSN bankruptcy
| ~0:12 | SUBTITLE | The company behind Bally Sports' regional networks filed for bankruptcy — the biggest owner of regional sports rights in the country. |
| ~0:29 | SUBTITLE | Bought in 2021 for $9.6B, mostly on borrowed money — the bet was that cord-cutters would keep paying. |
| ~0:45 | SUBTITLE | Cord-cutting won. It missed a $140M payment and collapsed under $8.7B in debt. |
| ~0:58 | PUNCH | THE MODEL OUTRAN ITS OWN AUDIENCE |

**B18** (12:15.7) — Nielsen
| ~0:05 | SUBTITLE | A company called Nielsen estimates how many people watch each show, every night. |
| ~0:18 | LABEL (art) | $ per 1,000 viewers × the rating = the ad price |
| ~0:23 | PUNCH | SAME 30 SECONDS · HIGHER PRICE |

**B19** (12:45.7) — two invoices
| ~0:05 | SUBTITLE | Your cable bill already paid the channel to exist on your dial. |
| ~0:16 | SUBTITLE | Then, because you showed up in Nielsen's sample, an advertiser paid again — for you. |
| ~0:26 | PUNCH | BILLED AS A SUBSCRIBER · SOLD AS AN AUDIENCE |
| ~0:37 | DEEP TEXT | You only ever see the first one. |

**B20** (13:24.5) — 77M
| ~0:05 | SUBTITLE | More people are quitting cable now than at any point on record. |
| ~0:11 | DEEP TEXT | 77,000,000 households have cut it entirely |
| ~0:19 | PUNCH | FEWER THAN HALF STILL PAY FOR TV — A FIRST |

**B21** (13:48.3) — rates rose anyway
| ~0:05 | SUBTITLE | You'd expect prices to drop as customers leave. They did the opposite. |
| ~0:11 | DEEP TEXT | ▲ 7% — the per-subscriber rate, the same year millions left |
| ~0:19 | PUNCH | FEWER PEOPLE · EACH HOLDING MORE OF THE BILL |

**B22** (14:14.2) — who's left
| ~0:04 | SUBTITLE | The people still paying are the ones who can't easily leave. |
| ~0:10–0:22 | LABELS (art) | SPORTS FAN · BUNDLED W/ INTERNET · ONLY ONE PROVIDER |
| ~0:40 | PUNCH | THE LEAST LEVERAGE TO SAY NO |

**B23** (14:54.8) — Nexstar
| ~0:07 | SUBTITLE | Nexstar owns more local TV stations than any company in American history. |
| ~0:15 | DEEP TEXT | 200+ stations |
| ~0:28 | SUBTITLE | You think you're watching your hometown station. Very often, you're watching Nexstar. |

**B24** (15:25.6) — Nexstar revenue
| ~0:07 | SUBTITLE | ~60% of Nexstar's revenue is distribution fees — not ads. |
| ~0:20 | DEEP TEXT | $700M+ in one quarter |
| ~0:30 | PUNCH | FOR SIGNALS FREE WITH A $20 ANTENNA |

**B25** (15:56.6) — the political rate
| ~0:06 | SUBTITLE | Federal law guarantees exactly one class of customer a fair price. |
| ~0:19 | LABEL (art) | POLITICAL CANDIDATE — lowest rate, by law, no negotiating up |
| ~0:35 | PUNCH | A PROTECTED BEST PRICE — NEVER ONCE YOURS |

**B26** (16:47.0) — not a scam
| ~0:03 | SUBTITLE | Before this sounds like a scam — it genuinely isn't. Real newsrooms cost money. |
| ~0:28 | PUNCH | PROBABLY WHY YOUR STATION STILL HAS REAL REPORTERS |

**B27** (17:20.7) — no menu
| ~0:08 | SUBTITLE | You never got handed a menu. You got a bundle, a bill, and a line that looks like a tax. |
| ~0:25 | PUNCH | YOU WERE NEVER IN THE ROOM WHERE THE PRICE GOT DECIDED |

**B28** (17:48.4) — stack the total
| ~0:03–0:35 | LABELS (art, on the receipt) | Avg TV bill $100+/mo · Broadcast fee $100+/yr, can't remove · Sports fee, can't decline · The rate ▲ every year |
| ~0:37 | DEEP TEXT | NEVER ACTUALLY YOUR CHOICE — hundreds of dollars a year |

**B29** (18:35.2) — THE REVERSAL  ·  Dark Law fires on "You are the only party"
| ~0:03 | SUBTITLE | You were told the TV was free, or included, or already paid for. It never was. |
| ~0:22–0:31 | LABELS (art) | THE NETWORK · LOCAL STATION · RATINGS CO. · ADVERTISER · THE OPERATOR — each: PAID |
| ~0:44 (on ink) | DEEP TEXT | YOU — never once got a seat at the table |

**B30** (19:26.6) — same shape
| ~0:09 | SUBTITLE | Somewhere between you and the simple thing, there's a company you've never heard of. |
| ~0:15 | SUBTITLE | Last episode it ran an auction behind your phone. This time it might own your local news station. |

**B31** (19:56.3) — bridge to Ep4
| ~0:12 | SUBTITLE | Next time: the map on your phone. It never asks for a card number or a password. |
| ~0:17 | PUNCH | SOMEBODY ALREADY PAYS FOR EVERY PIN |

**B32** (20:19.8) — close
| ~0:04 | DEEP TEXT | SUBSCRIBE — it's free, and this time we mean it |
| ~0:12 | SIGNATURE (returns, typeset, silent) | **Nothing is free.** (condensed bold, ~150px, "free." in orange — the §6.4 return) |
| ~0:16 | DEEP TEXT | Somebody already answered that question — for money — before you did. |
