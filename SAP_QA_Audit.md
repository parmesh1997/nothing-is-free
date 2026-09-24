# QA audit: sub-niche strategy and production plan

Written 2026-09-24. An adversarial review of `SAP_Subniche_Strategy.md` and
`SAP_Production_Plan_v2.md` as first written. Each finding has a severity, a fix, and
where the fix now lives. **The biggest finding changes the recommendation.**

Severity: 🔴 changes a decision · 🟠 would cost real time or money · 🟡 a gap to close

---

## 1 · Sub-niche strategy

| # | Finding | Sev | Fix | Where |
| --- | --- | --- | --- | --- |
| S1 | **The heist frame keeps the explainer engine.** A heist reveals *who* early (the crew, at ~10–35%) and leaves *how* as the open question. "How does it work?" is the educational question in costume, the exact thing the creator is trying to leave. The viewer's curiosity is spent on the mechanism again | 🔴 | Switch the open question from **how** to **who**. A **whodunit** keeps *who* open until ~85%. The channel's tagline is already a whodunit reveal ("Now you know who"), and the runbook's own spine already has "who is actually behind this" at ~70% and the reversal at ~85% | Strategy §2–§4, recommendation changed |
| S2 | **"Why watch ours?" had no hard answer.** Other channels already make videos on these topics | 🔴 | The whodunit turns that into our advantage: **the answer the popular videos give is our red herring**, cleared on screen. A viewer who has seen the explainers gets a twist, not a repeat. It becomes a Step 0 test: if the popular answer is already the full story, the topic fails | Strategy §3; runbook §6.2.1 |
| S3 | **Template risk in my own format.** I criticised "The Catch" for five fixed sections, then gave the heist six fixed movements and an "every episode" replay | 🟠 | The skeleton stays (crime → suspects → reveal); the *devices rotate*. Each episode uses three of the six case devices, and never the same three twice in a row. The staging of each device changes every time | Strategy §4.2; runbook §4.8 |
| S4 | **"Proven format" was asserted, not measured.** Web search cannot give views per hour | 🟠 | The mystery/true-crime shape is proven at genre level. Each *topic* must still pass the §6.2 evidence gate, and the whodunit fitness is checked by the case test (S5) | Runbook §6.2.1 |
| S5 | **No test for curiosity itself.** The runbook says "a topic an AI chatbot answers in four seconds is not a video", but nothing actually checks it | 🟠 | **The cold-answer test:** a fresh model with no context answers the title's question in one line (`claude -p --model haiku`). If it names our culprit, the mystery is dead: pick another topic or angle | Runbook §6.2.1 |
| S6 | **The heist framing is legally sharper:** "you were robbed" by a named company, every week | 🟠 | A whodunit's "culprit" is often a *rule*, a *structure* or another *customer*, not a company. The safety rules stay: legal is the premise, no accusations, sourced facts | Strategy §4.3 |
| S7 | **Viewer fatigue:** "you were robbed" every week reads cynical | 🟡 | The victim is not always Lucky. Sometimes Lucky is the unwitting culprit (the twist in the credit-card case). Polite disbelief, not outrage | Strategy §4.3 |
| S8 | **The sub-niche had no one-word name** | 🟡 | **Whodunit.** One line: *"Every episode, someone takes your money, legally. By the end, you know who."* | Strategy §1; runbook §0 |
| S9 | **Idea selection had no scoring.** Step 0 picks on evidence and taste | 🟠 | Step 0 gains named sub-steps, **0a–0e**, and a nine-row case test that every idea passes before Round 1 | Runbook §6 |

## 2 · Production plan

| # | Finding | Sev | Fix | Where |
| --- | --- | --- | --- | --- |
| P1 | **Multiplane parallax from the mist pass leaves holes.** Splitting one render by depth means that when the foreground slides, there is no background behind it | 🟠 | Render the layers separately: the background *with the foreground collection excluded* (so it is complete behind), then the midground, then the foreground alone with alpha. Parallax stays under 8% of frame width | Production §3; runbook §9.8.1 |
| P2 | **Agent-time numbers were estimates presented next to measurements** | 🟡 | Every budget is marked as an estimate. §9.0 step 7 records actual minutes, and those replace the estimates after one episode | Production §5 |
| P3 | **`place-check` needs `angle` and `mark` in `shots.json`, but Step 1 cannot know the kit angles** | 🟡 | Step 1 writes intent (location, framing, who is where). 3b fills `angle` and `mark` from the kit. Stated explicitly | Runbook §9.0 |
| P4 | **The cold-open-first gate could stall on missing VO** | 🟡 | Not an issue: Step 2 generates all beats. The cold-open proxy uses the real VO from Step 2 | Production §4 |
| P5 | **The replay device (now the reconstruction) is costly** if rebuilt from scratch | 🟡 | The reconstruction re-renders the cold open's own compositions with an overlay layer: same shots, new text and marks. There is no new staging | Production §7 |
| P6 | **The episode 9 path was unclear.** Restart Step 3? | 🟠 | No restart. Finish 3b on the ladder (no new plates), then 3c in batches, the audit, Steps 4 and 5. Timings are in Production §9 | Production §9 |
| P7 | **`make-timeline.mjs` has never been imported into Resolve** | 🟡 | A mandatory capability probe on first use (§10.3). The layer file-name patterns are flags | Production §6 |
| P8 | **Tools were spread across four documents** | 🟡 | One toolchain document: every step, tool, licence, and how Claude runs it | `SAP_Toolchain.md` |

## 3 · What survived the audit unchanged

- **2D-first with Blender-painted plates (L2)** as the default, and one moving 3D shot
  at most, in the cold open.
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
