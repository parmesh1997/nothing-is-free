# Someone Always Pays: start here

Everything produced in the 2026-09-24 sessions, in the order to read it.

| # | File | What it is | Status |
| --- | --- | --- | --- |
| 1 | `SAP_Subniche_Strategy.md` | **What the channel is from episode 10:** The Money Whodunit, why viewers watch ours, the format, the 12-case slate | Final (after the audit) |
| 2 | `SAP_QA_Audit.md` | The audit of the strategy and the plan: 17 findings, what changed, what only data can settle | Final |
| 3 | `SAP_Production_Plan_v2.md` | **How it's made:** 2D-first with painted plates, depth tricks, the cold open, Steps 3–4, finishing episode 9 | Final |
| 4 | `SAP_Toolchain.md` | Every tool by step: licence, cost, how Claude runs it, automation, optional AI (not recommended) | Final |
| 5 | `Someone_Always_Pays_Runbook.md` | **The runbook**, with every change applied | Live |
| 6 | `Step3_Step4_Options.md` | The Step 3/4 options and **the prompt to finish episode 9's 3b** (§2) | Use §2 now |
| — | `Visual_Upgrade_Plan.md`, `Runbook_Changes_2026-09-24.md` | Earlier rounds, folded into files 3 and 5 | Move to `archive/` once you've read file 3 |
| — | `video-os/channels/unseen/` | The Unseen channel draft | Parked |

**Tested tools** (`video-os/engine/remotion/scripts/` unless noted): `vph.mjs`,
`vtt-clean.mjs`, `dip-map.mjs`, `motion-check.mjs`, `place-check.mjs`,
`make-timeline.mjs`, and `lab/sap-upgrade-demo/marks.py`.

---

## What changed in this round (the audit pass)

**1 · The recommendation changed: The Legal Heist → The Money Whodunit.**
The audit found that a heist holds *how does it work?* open, which is the explainer
question in costume. A whodunit holds *who?* open until ~85%, and your tagline is
already its closing line. The heist's best parts (the crew, the replay) live on inside
it as the suspects and the reconstruction.

**2 · "Why watch ours?" now has a hard answer, and it's a gate.** The answer the
popular videos give is our red herring, cleared on screen. A topic where the popular
answer is already the whole story fails Step 0.

**3 · Step 0 has sub-steps (0a–0e) and a nine-row case test (§6.2.1)**, including the
**cold-answer test**: a fresh model gets only the title's question, and if it names our
culprit, the topic isn't a mystery.

**4 · The runbook applies the whodunit** as one commit: §0, §1.1, §1.2, §2.8, §4,
§4.2, §4.5, §4.6, §4.8, §6, §6.2.1, §6.6, §7.3, §7.5, §9.0, §9.7 and §12. To choose a
different sub-niche, revert that one commit (`3c72857`); the production changes stay.

**5 · Production fixes from the audit:**
- Multiplane layers render separately, so parallax has no holes.
- Case devices rotate, three of six per episode, so the format isn't a template.
- The reconstruction reuses the cold open's own shots instead of re-staging them.
- Step 1 writes intent; 3b writes placement.

**6 · Episode 9:** don't restart Step 3. Finish 3b on the ladder, do 3c in batches,
then the audit, Step 4 and Step 5. My estimate is 7–12 agent hours from where it
stands (Production Plan §9.1).

**7 · Toolchain:** one document for every tool.
- Everything used is free or already owned, and Remotion is free for up to three
  people.
- The AI image-to-3D options are listed but not recommended: they break law 12, and
  one of them (Hunyuan3D) has a territorial licence.
