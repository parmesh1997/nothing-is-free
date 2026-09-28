# Someone Always Pays: the plan on one page

Read this first. Every line points to the document that holds the detail. Written
2026-09-25 and updated 2026-09-26 (`SAP_QA_Audit.md` §9–§10). **The runbook is the only
source of truth**; this page and the other `SAP_*` files explain it. To bring
everything into the runbook on your PC, use `SAP_Merge_Pack.md`.

---

## 1 · The channel

**One word: Whodunit.** *Every episode, someone takes your money, legally. By the end,
you know who.* Chosen by the creator on 2026-09-25, from episode 10.

- **What the viewer gets that other channels don't:** the answer the popular videos give
  is our red herring, cleared on screen. They explain; we solve (strategy §3).
- **The mix:** at least 65% story and comedy, at most 35% mechanism (strategy §6.1).
- **Length:** 10 to 15 minutes, usually about 13 (creator, 2026-09-28; runbook §1.4).
- **Where the cases come from is re-opened** (`SAP_Subniche_v3.md`): everyday prices
  alone gives too few strong topics and a CTR under 2%. The front-runner is **money
  history told as mysteries**; the vidIQ research decides.

## 2 · Where we stand

| | Popcorn (ep 1) | Printer ink | Google Maps | Free local TV |
| --- | --- | --- | --- | --- |
| Impressions | ~650 | ~450 | ~350 | ~200 |
| Views | ~100 | 57 | ~32 | ~30 |
| Share of the video watched | ≈25% | ≈27% | — | — |

1. **Clicks got the test; retention ended it.** Viewers kept about a quarter of the
   best two, so YouTube stopped widening after a few hundred people.
2. **Titles where the viewer is the one paying did best** (your popcorn, your ink). The
   company-income topics did worse.
3. **Weekend-evening uploads (IST) did best**, but the oldest video has also had the most
   time. That's a lead, so the day is now fixed and videos are compared at equal age.

**Newer (2026-09-28):** the McDonald's episode had 0.8% CTR on 170 impressions in 18
hours; airline food 3.4%, with views returning once the A/B test was removed; printer
ink 1.8–2%. YouTube's normal range starts at 2%, so **the click is the first wall**.
From now on: one thumbnail at publish, and a test only after about 1,000 impressions.

Detail: strategy §2.1 and `SAP_Subniche_v3.md` §1.

## 3 · How a video grows from hundreds to lakhs of impressions

YouTube shows a new video to a small group, compares what they do with what they do
with the other videos it could have shown them, and widens only if ours wins. **Clicks
buy the test. What happens after the click decides whether it grows.** Every stage below
has to hold:

| # | Stage | What YouTube sees | What decides it | Our check |
| --- | --- | --- | --- | --- |
| 1 | **The idea** | Do people want this topic? | Proven demand | Outliers at 3× or more their channel's median, the VPH floor (runbook §6.2) |
| 2 | **The angle** | Is this a *different* reason to watch? | The red herring: their answer, cleared by us | Case test rows 4, 7, 11; `saturation.mjs` |
| 3 | **The turn** | Does the question stay open? | A culprit a fresh model doesn't name | The cold-answer test (row 5); the reveal at ~85% |
| 4 | **The packaging** | CTR in the test | The payer and the object in the title; one face and one object in the thumbnail; different from the row beside it | The payer-in-title gate (§6.0); the **feed test** (`feed-mock.mjs`, §9.10); *Test & compare* |
| 5 | **The first 30 seconds** | Did the click get what it was promised? | The title's object in the first image; its words by 0:15 | Cold open first; title echo (§4.1) |
| 6 | **The hold** | Share of the video watched (gate 45%) | The question held to the end; story over mechanism | The case spine; the challenge; `dip-map.mjs` |
| 7 | **The end** | Did they watch another video? | The next case, offered at once | Backward end screen, **Case files** playlist, the pinned "Who did you suspect?" (§14.1) |

**"YouTube knows this topic is already done."** It doesn't keep a list of finished
topics. For each viewer it compares our video with the alternatives. A tenth copy of the
same answer loses that comparison; a video with a different reason to watch can win it.
That difference has to show **in the thumbnail** (the feed test checks it) and be
**paid off in the video** (the red herring cleared). A topic where someone already tells
it as a mystery is dropped (`saturation.mjs`, row 11).

### 3.1 · Why thirteen minutes instead of a four-second chatbot answer

A chatbot has the answer. It doesn't have **the case**: the people and the day it
happened, the popular answer shown fairly and then taken apart, the suspects cleared
one by one, and a reveal the viewer can't skip to. Four rules make the viewer learn
*while* watching the story (runbook §4.4–§4.6):

1. **Misconception first.** The popular answer is staged as believable before it's
   cleared. Derek Muller's research found that this roughly doubled what viewers
   learned; clear explanations alone didn't move test scores.
2. **But / therefore, never "and then".** Every beat complicates or causes the next.
3. **Every fact is a decision someone makes on screen**, in a place, on a date.
4. **The chatbot test:** if the script would lose nothing read as a summary, it fails.

### 3.2 · Cinematic without the cost (runbook §4.9)

A colour script (one palette per spine movement, graded per section); shot sizes
that tighten toward the reveal (the reveal is the closest shot); money moving left to
right; match cuts from the past to the present; the sound of the next scene arriving
first; letterbox bars for history; a layer dolly zoom on the reveal; the culprit first
seen in silhouette. None of these needs a new render, except the silhouette's one
extra plate.

## 4 · How an idea is chosen (Step 0, runbook §6)

1. **0a · Postmortem:** the last two episodes, plus the channel's own outliers at equal
   age (Studio's *First 7 days*).
2. **0b · Evidence:** vidIQ Research, then `vph.mjs` on the shortlist.
3. **0c · The case test:** eleven rows. Any failure means the topic goes back.
4. **The case score:** out of 100, with each part citing its evidence. It ranks the
   ideas that passed.
5. **The payer in the title**, and a thumbnail concept, before any script.
6. **0d · Round 1** (you choose the topic), then **0e · Round 2** (shape and packaging).

## 5 · How an episode is made

| Step | What | Who |
| --- | --- | --- |
| 1 · Script | The case spine, three of seven case devices, the 30/70 mix | Claude (Opus) |
| 2 · VO | ElevenLabs, whisper timing, mouth cues | Claude (Haiku) |
| 3a · Locations | **You build rooms from kit parts in Blender** (about an hour for a new scene of the crime); Claude runs the angle-kit script | You + Claude |
| 3b · Shots | Angle and floor-mark data, checked by `place-check` | Claude (Sonnet) |
| 3c · Scenes | Setups first, shots as data rows, batches with a progress file | Claude (Sonnet) |
| Audit, proxy | Scripts, contact sheets, `motion-check`; **you watch the proxy** | Claude + you |
| Fix loop | **You write `issues.csv`** once; one fresh session fixes by class, component first, re-renders only changed clips; two rounds at most (§9.5.1) | You + Claude |
| Renders | **You start them**; Claude never waits on them | You |
| 4 · Finish | Timeline file into Resolve, one grade, mix, QC | Claude |
| 5 · Publish | **You upload** at the slot; Claude reads vidIQ and the reviews | You + Claude |

**Cheaper and faster, by rule (runbook §5.4, §9.4):** end a session near 100k of
context; no session runs for hours; subagents only for separate work (`nif-builder`
on Sonnet, its helpers on Haiku); bake blur and glow as images instead of per-frame
CSS; re-render only changed clips; proxies at half size.

The look: Blender background images and Remotion camera, characters and text (about
97% of the runtime). At most two moving 3D shots per episode (the cold open's and one
orbit). Tools: Blender, Remotion and Resolve Studio, all free or already owned
(`SAP_Toolchain.md`).

## 6 · The calendar

| When | What |
| --- | --- |
| **Now** | Connect vidIQ in this cloud session and run the sub-niche research (`SAP_Subniche_v3.md` §5), or paste its three prompts into vidIQ one at a time and send me the answers |
| **Then** | Merge round 2 on your PC (`SAP_Merge_Pack.md`), including the reference-video study (its step 8) |
| **The current episode (airline tax)** | Rebuild the cold open to runbook §4.1: Opus writes the treatment first (§9.0.1), then the atmosphere layers it needs (§9.8.5); `motion-check` must show at least 70% active frames in the first 15 s |
| **In parallel, once** | Build the atmosphere kit and the case-file kit; test one plate toon vs soft-lit |
| **The next case** | From the sub-niche the research picks. The popcorn remake fits the front-runner too (a 1930s case) |
| **Every week** | One case, **Sunday 21:00 IST** (your merge). The second slot opens after four on-time episodes |
| **After episodes 10–12** | The three-case read below |

## 7 · How we judge it, and what we change

Two gates at 7 days: **CTR ≥ 6%** and **share watched ≥ 45%**. Each episode is compared
with the others at the same age, and episode 10 against episode 1.

| After three cases | It means | Change (one thing only, §14.3) |
| --- | --- | --- |
| CTR good, retention low | The case doesn't hold | The script: read the dips in `dip-map.mjs` |
| CTR low, retention good | The video works; the packaging undersells it | Thumbnail and title: the feed test, *Test & compare* |
| Both low | The idea | Re-weight the case score against the results |
| Both good, but impressions still small | The test is still small | Nothing. Keep the slot and keep shipping |

## 8 · The documents

| File | Holds |
| --- | --- |
| **`SAP_Master_Plan.md`** | This page |
| `SAP_Subniche_Strategy.md` | The whodunit: why ours, our own numbers, the format, the 12-case slate, the channel description |
| **`SAP_Subniche_v3.md`** | **The territory re-opened:** the candidates, the vidIQ research plan and prompts, the decision rule, the thumbnail review |
| `Someone_Always_Pays_Runbook.md` | Every step, rule and gate |
| `SAP_Production_Plan_v2.md` | How it's made: levels, depth tricks, orbit, cold open, Steps 3–4, episodes 9 and 10 |
| `SAP_Toolchain.md` | Every tool, its licence and cost, and how Claude runs it |
| `SAP_QA_Audit.md` | Every finding, pass by pass, and where each fix lives |
| `SAP_README.md` | The index and the change history |
| `SAP_Merge_Pack.md` + `merge/` | The prompt and files that merge all of this into the runbook on your PC |
| `Step3_Step4_Options.md` | Only §2, the prompt that finishes episode 9's 3b |
| `archive/` | Superseded rounds |
