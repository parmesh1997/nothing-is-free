# QA audit: sub-niche strategy and production plan

Written 2026-09-24, with further passes on 2026-09-25 (§5–§9). An adversarial review
of `SAP_Subniche_Strategy.md` and `SAP_Production_Plan_v2.md` as first written. Each finding has a severity, a fix, and
where the fix now lives. **The biggest finding changes the recommendation.**

Severity: 🔴 changes a decision · 🟠 would cost real time or money · 🟡 a gap to close

---

## 1 · Sub-niche strategy

| # | Finding | Sev | Fix | Where |
| --- | --- | --- | --- | --- |
| S1 | **The heist frame keeps the explainer engine.** A heist reveals *who* early (the crew, at ~10–35%) and leaves *how* as the open question. "How does it work?" is the educational question in costume, the exact thing the creator is trying to leave. The viewer's curiosity is spent on the mechanism again | 🔴 | Switch the open question from **how** to **who**. A **whodunit** keeps *who* open until ~85%. The channel's tagline is already a whodunit reveal ("Now you know who"), and the runbook's own spine already has "who is actually behind this" at ~70% and the reversal at ~85% | Strategy §2, §5; recommendation changed |
| S2 | **"Why watch ours?" had no hard answer.** Other channels already make videos on these topics | 🔴 | The whodunit turns that into our advantage: **the answer the popular videos give is our red herring**, cleared on screen. A viewer who has seen the explainers gets a twist, not a repeat. It becomes a Step 0 test: if the popular answer is already the full story, the topic fails | Strategy §3; runbook §6.2.1 |
| S3 | **Template risk in my own format.** I criticised "The Catch" for five fixed sections, then gave the heist six fixed movements and an "every episode" replay | 🟠 | The skeleton stays (crime → suspects → reveal); the *devices rotate*. Each episode uses three of the six case devices, and never the same three twice in a row. The staging of each device changes every time | Strategy §6.2; runbook §4.8 |
| S4 | **"Proven format" was asserted, not measured.** Web search cannot give views per hour | 🟠 | The mystery/true-crime shape is proven at genre level. Each *topic* must still pass the §6.2 evidence gate, and the whodunit fitness is checked by the case test (S5) | Runbook §6.2.1 |
| S5 | **No test for curiosity itself.** The runbook says "a topic an AI chatbot answers in four seconds is not a video", but nothing actually checks it | 🟠 | **The cold-answer test:** a fresh model with no context answers the title's question in one line (`claude -p --model haiku`). If it names our culprit, the mystery is dead: pick another topic or angle | Runbook §6.2.1 |
| S6 | **The heist framing is legally sharper:** "you were robbed" by a named company, every week | 🟠 | A whodunit's "culprit" is often a *rule*, a *structure* or another *customer*, not a company. The safety rules stay: legal is the premise, no accusations, sourced facts | Strategy §6.3 |
| S7 | **Viewer fatigue:** "you were robbed" every week reads cynical | 🟡 | The victim is not always Lucky. Sometimes Lucky is the unwitting culprit (the twist in the credit-card case). Polite disbelief, not outrage | Strategy §6.3 |
| S8 | **The sub-niche had no one-word name** | 🟡 | **Whodunit.** One line: *"Every episode, someone takes your money, legally. By the end, you know who."* | Strategy §1; runbook §0 |
| S9 | **Idea selection had no scoring.** Step 0 picks on evidence and taste | 🟠 | Step 0 gains named sub-steps, **0a–0e**, and a nine-row case test that every idea passes before Round 1 | Runbook §6 |

## 2 · Production plan

| # | Finding | Sev | Fix | Where |
| --- | --- | --- | --- | --- |
| P1 | **Multiplane parallax from the mist pass leaves holes.** Splitting one render by depth means that when the foreground slides, there is no background behind it | 🟠 | Render the layers separately: the background *with the foreground collection excluded* (so it is complete behind), then the midground, then the foreground alone with alpha. Parallax stays under 8% of frame width. (Layers renamed far / set / near in the camera pass, C2) | Production §3; runbook §9.8.1 |
| P2 | **Agent-time numbers were estimates presented next to measurements** | 🟡 | Every budget is marked as an estimate. §9.0 step 7 records actual minutes, and those replace the estimates after one episode | Production §5 |
| P3 | **`place-check` needs `angle` and `mark` in `shots.json`, but Step 1 cannot know the kit angles** | 🟡 | Step 1 writes intent (location, framing, who is where). 3b fills `angle` and `mark` from the kit. Stated explicitly | Runbook §9.0 |
| P4 | **The cold-open-first gate could stall on missing VO** | 🟡 | Not an issue: Step 2 generates all beats. The cold-open proxy uses the real VO from Step 2 | Production §4 |
| P5 | **The replay device (now the reconstruction) is costly** if rebuilt from scratch | 🟡 | The reconstruction re-renders the cold open's own compositions with an overlay layer: same shots, new text and marks. There is no new staging | Production §7 |
| P6 | **The episode 9 path was unclear.** Restart Step 3? | 🟠 | No restart. Finish 3b on the ladder (no new plates), then 3c in batches, the audit, Steps 4 and 5. Timings are in Production §9 | Production §9 |
| P7 | **`make-timeline.mjs` has never been imported into Resolve** | 🟡 | A mandatory capability probe on first use (§10.3). The layer file-name patterns are flags | Production §6 |
| P8 | **Tools were spread across four documents** | 🟡 | One toolchain document: every step, tool, licence, and how Claude runs it | `SAP_Toolchain.md` |

## 3 · What survived the audit unchanged

- **2D-first with Blender-painted plates (L2)** as the default. (Moving 3D shots were
  later set at two at most: the cold open's and one orbit, P10.)
- **Stage & Marks, the shot ladder, `place-check`, the scripted timeline.** These are
  independent of the sub-niche and already in the runbook.
- **The 70/30 split and the no-advice rule**, which hold for any frame.
- **The cold-open spec and the cold-open-first gate.**

## 4 · What the audit could not settle (only data can)

- Whether the whodunit lifts CTR and APV. §1.3's gates decide, over three episodes,
  not one (one episode is noise).
- Real agent minutes per step on the new flow. Recorded in `project.json` from
  episode 10.
- Whether the OTIO import works on Resolve 21.1 on your machine. Probe once.

---

## 5 · Second pass: three reference videos (2026-09-25)

Checked against three videos the creator supplied: a faceless-channel coach on not
copying channels, a small-channel educator on low impressions, and a storytime
animator's how-to.

**How far to trust each one.** The first is also a sales funnel for a paid course: its
student income figures are unverified claims. Its *method* (transfer, don't copy)
matches the runbook's own niche-bending rule, so the method is used and the numbers are
ignored. The second matches YouTube's own public explanation of how recommendations are
tested. The third is craft advice from a working animator.

| # | What the video says | What we had | Sev | Change | Where |
| --- | --- | --- | --- | --- | --- |
| T1 | Don't copy; **transfer** a proven concept along one axis (angle, country, length, language), and be first in the new space | The bend was stated, but "first mover" was never checked | 🟠 | Case test row 10 (name the transfer) and row 11 (first mover, measured by `saturation.mjs`) | Runbook §1.1, §6.2.1 |
| T2 | Before copying, check how many already made it, and how they did | No measurement of crowding | 🟠 | `saturation.mjs`: near-copies, channels, mystery-framed titles, recency | Toolchain; runbook §6.2.1 |
| T3 | YouTube is a salesman that predicts before showing, partly from how the channel's earlier viewers responded | Nine episodes in a mix of formats | 🟠 | One viewer, one format, every upload, from episode 10 | Runbook §1.1 |
| T4 | A generic topic loses; the *same* topic with a different reason to watch wins | The why-ours test existed | 🟡 | Stated as the answer to "is it saturated?": a crowded topic is fine, a taken angle is not | Strategy §3.1 |
| T5 | Don't change everything at once; find the weakest part across uploads | No rule | 🟡 | Change one thing at a time after episode 10, which is itself the one deliberate big change, because the diagnosis is the idea | Runbook §14.3 |
| T6 | The opening lines must match the title, or viewers feel misled and leave | The title question lands at 0:15–0:35 | 🟡 | The title's object in the first image; its words in the world by 0:15 | Runbook §4.1 |
| T7 | Solo animators: keep it short enough to finish | No starting length; episode 9 has 98 shots | 🔴 | The case format starts at about 8 minutes, and 3c builds **setups, not shots** (one setup per four or more shots) | Runbook §1.4, §9.8.4 |
| T8 | An end card, and a reason to watch the next one | A closing callback line only | 🟡 | A backward end screen to the previous case | Runbook §14.1 |
| T9 | A simple character you can draw fast; jokes and slapstick | Already the rig and the humour spec | — | No change | — |

**The creator's worry, answered:** "if the idea is saturated, YouTube won't take the
risk." YouTube doesn't refuse crowded topics. It tests every video on a small audience
and expands the ones viewers choose over the alternatives. The risk is being the tenth
copy of the same answer, and the whodunit's red herring is built to be the opposite of
that. Row 11 now checks that nobody else is telling it as a mystery first.

## 6 · Second pass: production

| # | Finding | Sev | Fix | Where |
| --- | --- | --- | --- | --- |
| P9 | **3c is the new bottleneck.** Episode 9's 3c composes 98 shots one by one: "several hours", and it hits the usage limit | 🔴 | Setups, not shots: 15–20 parameterised setups, with shots as data rows, built in batches with a progress file. For episode 9, a paste-ready prompt | Runbook §9.8.4; Production §9.1 |
| P10 | **Imperial's orbit wasn't in the plan** | 🟡 | The diorama orbit: one template per location, 5–10 s, roof off, miniature focus, floating labels. At most one per episode. Demo rendered | Runbook §9.8.3; Production §3.1 |

## 7 · Third pass: the camera (2026-09-25)

The question: is the Remotion camera good enough, and is the plan consistent about it?

**The verdict: keep it.** A camera moved in Remotion costs no render, can be changed
without touching Blender, lives in the same place as the cast and the type, and fits
3c's setups, where camera moves are props. What it can't do is travel through a space
or turn around it. That is what the two L3 shots per episode are for, and in a
12-minute case they are where the viewer feels travel: the opening and one
establishing moment. L2 with a Remotion camera is the look of `sap_after.jpg`; the
orbit is the Imperial moment on top.

| # | Finding | Sev | Fix | Where |
| --- | --- | --- | --- | --- |
| C1 | **"The camera always belongs to Remotion"** and "Blender never renders a moving shot" contradicted the L3 shots and the orbit in the same document | 🟡 | It now says every shot except at most two, and names them | Production §1, §2 |
| C2 | **Parallax would slide the feet.** §9.8.1 said the background moves slowest and the cast faster, but the cast stands on the background's floor. Every drift would have undone the foot lock that the marks guarantee | 🟠 | Three layers, far / set / near. The cast and the set layer share one transform; only far (beyond the action) and near (the occluders) move at other speeds | Runbook §9.8.1, §2.3, the camera vocabulary; Production §3 |
| C3 | **No overscan.** A 1920×1080 plate shows its edge on an 8% drift and softens the ink on a 10% push | 🟠 | Kit plates render at 2880×1620: 10% more field on every side, at 1.25× density. Marks and anchors are in plate pixels and move with the plate | Runbook §9.8; Production §3, §7, §9.2 |
| C4 | **The hero-shot count disagreed.** §2.3, §9.8 and three other places still said "two or three per episode", against §9.7's "at most two", and §2.3 still had the old 55/25/5/15 tiers that Production §8 said were replaced | 🟡 | Every count now says at most two, and §2.3 uses L1/L2/L3 | Runbook §2.3, §5.2, §9.0, §9.8, §9.8.1, §9.8.2 |
| C5 | **The cast in an orbit was underspecified.** The camera moves, so a cutout on a fixed mark would drift off the floor | 🟡 | The 2D rig is drawn at foot points projected every frame from the orbit's anchors (as the demo does), and kept under about a tenth of the frame's height | Runbook §9.8.3; Production §3.1 |

**Not changed:** the 8% parallax cap, rack focus from the mist pass, the handheld
breath, and the one L3 shot in the cold open. **Not a video:** the orbit was checked on
its start, middle and end frames. The full clip wasn't needed and wasn't kept.

## 8 · Fourth pass: the "trust score" video (2026-09-25)

A video claiming YouTube gives every channel a hidden trust score, ending in an
advert for a free "virality score" idea tool. **How far to trust it:** YouTube has
never said a trust score exists, and the video admits it. YouTube's growth lead says
each video is judged on its own, and past performance counts only where it predicts
the next video. What the video calls a trust score is mostly YouTube predicting from
how your earlier viewers responded, which §1.1 already covers. Half its claims are
YouTube's own words; the rest are unsourced or misapplied.

| # | Claim | True? | What we do | Where |
| --- | --- | --- | --- | --- |
| V1 | A hidden channel score, 1–100 | **Not confirmed.** YouTube says videos are judged one at a time | Nothing new: one viewer, one format (§1.1) | — |
| V2 | Upload on a predictable schedule | **Half.** YouTube studied thousands of breaks and found no consistent penalty. A fixed day helps the *audience* build a habit | One fixed weekly slot, never missed; the second slot is earned (four on-time episodes) | Runbook §1.4; strategy §6.6 |
| V3 | Satisfaction is measured by surveys and what viewers do next | **True** (YouTube's recommendation blog: star-rating surveys, "valued watchtime") | Already the binge rule. Added the **Case files** playlist to the end screen | Runbook §14.1 |
| V4 | High CTR with low retention hurts more than low CTR | **True** (YouTube Help: clickbait has low view duration and is recommended less) | Read CTR and 30-second retention together; fix overpromising packaging by making it *more accurate* | Runbook §14.2 |
| V5 | "Half of channels have CTR between 2% and 10%" | **True** (YouTube Help) | No change: §14.2 already reads CTR against impressions | — |
| V6 | Strikes suppress reach; 3 strikes in 90 days ends a channel; policy training clears a warning | **True** for the rules; the "months of suppression" is anecdote | Already covered: licence ledger, sourced claims, no accusations (§6.3 of the strategy) | — |
| V7 | Engagement: ask real questions, reply early | **Reasonable** (the 3.87% benchmark is unsourced) | **The challenge**, a seventh case device ("Who took it?" before the reveal), and a pinned *"Who did you suspect?"* comment with replies in the first two hours | Runbook §2.8, §14.1; strategy §6.2 |
| V8 | Old, verified brand channels dominate the top | **True for search only.** The study (Adilo, via Search Engine Journal) looked at the top three *search* results for competitive keywords | We grow through Browse and Suggested, not search. `saturation.mjs` already warns when a few channels own a search | — |
| V9 | "Ideas decide everything"; pick the idea with the top virality score | **The first half is right**; the score is a sales funnel with no method shown | **The case score:** seven measured parts, 100 points, each with its evidence, ranking only the ideas that passed the case test | Runbook §6.2.2 |
| V10 | EAT and "your money, your life" | **Misapplied.** EAT comes from Google Search's rater guidelines, not a documented YouTube ranking | Already covered by sourced figures and the no-advice rule | — |

**Also fixed:** §6.2.1 still said "nine rows" after row 10 and row 11 were added. It
now says eleven.

## 9 · Fifth pass: our own numbers, and a whole-set audit (2026-09-25)

The creator's figures for five episodes (strategy §2.1), read against every document.

| # | Finding | Sev | Fix | Where |
| --- | --- | --- | --- | --- |
| D1 | **Episode 10 was popcorn, and episode 1 already was popcorn.** The slate's culprit for it (the studio's share of the ticket) is episode 1's own answer and what a fresh model says cold, so it would have failed the cold-answer test | 🔴 | Keep popcorn as a **deliberate remake**: the best-reached topic, and the cleanest test of the format. Episode 1's answer becomes suspect two; the culprit hypothesis moves to metering (Gil & Hartmann, 2009). If the case test still fails, the next topic goes | Strategy §7; Production §9.3 |
| D2 | **Slate #5 (ink) had shipped too**, and its culprit is the popular answer | 🟠 | Marked shipped; a remake only after popcorn's remake is read, and only with a culprit beyond razor-and-blades | Strategy §7 |
| D3 | **Retention is the ceiling**: about 25% on the two best-reached episodes. Clicks earned a few hundred impressions; early exits stopped the test | 🔴 | No new rule: this is what the whodunit, the 8-minute start, the cold open and the title echo are for. Episode 10 is read against episode 1 at equal age | Strategy §2.1; Production §9.3 |
| D4 | **Totals compared at different ages.** Older videos keep collecting impressions, so the oldest looks best | 🟠 | Every episode compared on Studio's *First 7 days*; `shipped.md` records it | Runbook §6.1, §14.2 |
| D5 | **Views ÷ impressions was being read as CTR** | 🟡 | Only Studio's impressions CTR counts | Runbook §6.1 |
| D6 | **The weaker titles had no payer in them** (a company's income; free TV) | 🟠 | New Step 0 gate: the title names the object the viewer pays for, or the viewer | Runbook §6.0, §12.0 |
| D7 | **Upload day varied**, and the weekend-evening (IST) uploads did best | 🟡 | One fixed slot, Saturday 21:30 IST, so the day stops being a variable | Runbook §1.4 |
| D8 | **Nothing checked a thumbnail beside its competition.** Rendering `sap_after.jpg` into the feed mock-up showed a busy scene still vanishing among the competitors' thumbnails | 🟠 | `feed-mock.mjs` and the feed test gate; "a scene still is not a thumbnail" | Runbook §9.10, §12.3; Toolchain |
| D9 | **The old content plan still says Monday + Friday and a "Free X" slate** | 🟡 | A note at its top: superseded from episode 10 by the strategy and runbook §1.4 | `NIF_CONTENT_PLAN_Sept-Dec_2026.md` |
| D10 | **Stale cross-references:** QA rows pointing at strategy §4 for things now in §6; "one moving 3D shot" in §3 here; "findings P1–P8" and "choose the sub-niche" in the production plan; "revert if you choose otherwise" in the strategy | 🟡 | All corrected; the sub-niche is recorded as chosen | This file; Production; Strategy |
| D11 | **`Visual_Upgrade_Plan.md` and `Runbook_Changes_2026-09-24.md`** were superseded but still at the top level | 🟡 | Moved to `archive/` | README |
| D12 | **`video-os/engine/remotion/CLAUDE.md` describes an older pipeline** (30 fps, FFmpeg as the master, NIF002 as current). An agent working in that folder loads it, and it conflicts with this runbook (24 fps, Resolve finishing) | 🟠 | **Not changed**: that file says changes to it are "stop and ask". Flagged to the creator | Creator's decision |

**Checked and consistent:** the case test is eleven rows everywhere; the case devices are
seven everywhere; moving 3D shots are "at most two" everywhere; the far / set / near
layers and the 2880×1620 overscan match between the runbook and the production plan;
every tool in the runbook is in the toolchain.

## 10 · Sixth pass: story, cinema, cost, and the merge (2026-09-26)

The creator's brief: story-driven and cinematic, learning while watching, cheaper in
tokens and render time, and one runbook as the only source of truth. The reference
video (`youtu.be/bCSt0K2kcA4`) couldn't be reached from the review environment
(YouTube is blocked there), so the merge prompt fetches it on the creator's PC and
treats it as proposals, not as changes.

| # | Finding | Sev | Fix | Where |
| --- | --- | --- | --- | --- |
| F1 | **Nothing answered "why eight minutes, not a chatbot's four seconds?"** for the whole episode | 🟠 | A why-test row: the value is the case (people, the day, the suspects cleared, the reveal), not the answer | Runbook §4.5 |
| F2 | **The red herring could be waved away in a line.** Research on learning from video: stating the misconception and taking it apart roughly doubled test scores, while clear explanation alone didn't | 🟠 | Misconception first: the red herring is staged as believable before it's cleared; a new gate | Runbook §4.6, §12.1 |
| F3 | **Beats could follow each other as "and then"** | 🟡 | But / therefore: the beat list is written as one causal chain; a new gate | Runbook §4.4, §12.1 |
| F4 | **"Cinematic" had no rules that cost nothing** | 🟡 | Cinematic on a budget: colour script, shot sizes, screen direction, match cuts, J/L cuts, letterbox, layer dolly zoom, silhouette | Runbook §4.9 |
| F5 | **NIF009's QA loop:** 30–40 issues fixed one at a time and re-checked on stills spent a 5-hour window in about four hours and roughly 30% of the week | 🔴 | The fix loop: prevent repeating classes in shared components, the creator's issue sheet, fixes by class, only changed clips re-rendered, two rounds | Runbook §9.5.1; Production §9.1.1 |
| F6 | **The week's usage:** 93% above 150k context, 57% from sessions of 8+ hours, 23% `nif-builder` | 🔴 | A context ceiling near 100k; no hours-long sessions; subagents only for separate work; `nif-builder` on Sonnet and its helpers on Haiku; weekly `/usage` | Runbook §5.4; merge prompt step 7 |
| F7 | **Per-frame CSS blur and shadows** are slow to render (Remotion's own performance guide) | 🟠 | Bake them as images; re-render changed clips only; half-size proxies; `remotion benchmark` once | Runbook §9.4 |
| F8 | **§9.4 said Blender passes are 1920×1080**, while kit plates are 2880×1620 overscan | 🟡 | Split: moving shots at 1080p, kit plates at overscan | Runbook §9.4 |
| F9 | **§0.1 quoted a token size from before these sessions** | 🟡 | Stated in characters and as a share of the file per step | Runbook §0.1 |
| F10 | **vidIQ Optimize's title and thumbnail scores weren't read** | 🟡 | Read in the postmortem and before publish | Runbook §6.1, §14.1 |
| F11 | **Rooms were built by Claude in code**, the most expensive way | 🟠 | The creator may lay out rooms by hand under a file contract; Claude runs the kit script | Runbook §9.0 |
| F12 | **Two sets of runbook changes, one runbook:** yours on your PC, and these sessions' | 🔴 | A three-way merge pack (base, proposed, prompt, conflict rules, change list), tested on a simulated local copy: local-only edits kept, a shared edit raised as one conflict | `SAP_Merge_Pack.md`, `merge/` |

**Checked and consistent after this pass:** every "§n" in the runbook resolves; the
case test is eleven rows; there are seven case devices; "at most two" moving 3D shots;
one upload slot; `merge/runbook_proposed.md` is identical to the runbook.

## 11 · Seventh pass: the merged runbook, the cold open, and the territory (2026-09-28)

**Your merged runbook** (2026-09-27) checked clean: no conflict markers, no duplicated
section numbers, every "§n" resolves, and your three new sections (key facts on screen,
motion blur and camera speed, stop before export) fit. It is now the repo's source of
truth and the base for the next merge.

| # | Finding | Sev | Fix | Where |
| --- | --- | --- | --- | --- |
| G1 | **The cold open doesn't move.** Measured: 22% of frames active in the first 15 s, a 5.4 s stretch where only an eye blinks, 4 shots. The DoodleDemo reference: 71% active | 🔴 | The cold open is directed: 5–7 shots, a move into a place first, the camera never rests, two atmosphere layers, physical action, kinetic type | Runbook §4.1 |
| G2 | **`motion-check` passed a blink as motion.** Its held-state test only caught 3 s of the 5.4 s stare | 🟠 | An activity measure (share of the picture moving); quiet runs over 2 s (1 s in the cold open) fail | `motion-check.mjs`; runbook §9.5, §12.3 |
| G3 | **Plain boards read as a lesson:** the flat cream floor-and-wall two-shot | 🔴 | No plain boards for story beats; the case-file language for mechanism | Runbook §2.3 |
| G4 | **"Cinematic" was being made by the builder model**, turn by turn | 🟠 | Opus writes the director's treatment before the build; the cold open is built on Opus | Runbook §5.2, §9.0.1 |
| G5 | **Nothing in the world moved by itself** | 🟠 | The atmosphere kit, built once; plates lit fully because they're stills | Runbook §9.8.5 |
| G6 | **CTR 0.8–3.4%**, under YouTube's normal 2–10% range, and topics too thin to choose from | 🔴 | The territory re-opened, with a research plan through the vidIQ connector or three prompts and a scored decision | `SAP_Subniche_v3.md` |
| G7 | **A/B tests started at publish** on videos with 170 impressions | 🟡 | One thumbnail at publish; a test only after about 1,000 impressions | Runbook §14.1 |
| G8 | **Runtime:** the creator set 10–15 minutes; §1.4 still said no fixed length | 🟡 | §1.4 rewritten; the 8-minute references in the other documents updated | Runbook §1.4; Strategy §6.4; Production §5 |
| G9 | **The slot:** your merge chose Sunday 21:00 IST; four documents still said Saturday | 🟡 | Aligned | Master plan, strategy, production plan, content plan |
| G10 | **The "YOU WORK HERE" thumbnails** don't state a money contradiction, the face is neutral, and the key object is tiny; they also look AI-generated, against law 12 | 🟠 | A principle for the fix and a question to the creator | `SAP_Subniche_v3.md` §7 |

**Not reachable from the review environment:** the nine reference videos (YouTube is
blocked). The merge prompt's step 8 turns each into a summary, two numbers and a
contact sheet on the creator's PC.
