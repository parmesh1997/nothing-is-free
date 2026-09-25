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
`vtt-clean.mjs`, `dip-map.mjs`, `motion-check.mjs`, `place-check.mjs`, `saturation.mjs`,
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

---

## What changed in the second pass (the three reference videos, 2026-09-25)

**1 · "Is it saturated?" is now measured.** `saturation.mjs` reads YouTube's top 30
results for a topic and returns *low demand*, *topic crowded, angle open* (go: their
answer is our red herring) or *angle taken* (drop: we'd be a copy). It is case test row
11, **First mover**.

**2 · The transfer is named.** Case test row 10: every topic states which proven format
moves into which new market. Ours is the mystery, moved onto everyday prices. Other
languages are a later lever, once ten English cases prove retention.

**3 · One viewer, one format, every upload** (runbook §1.1). YouTube predicts partly from
how your earlier viewers responded, so from episode 10 every upload is a case.

**4 · The case format starts at about 8 minutes** and grows only when an episode holds
45% (§1.4).

**5 · The title echoes within 5 seconds** (§4.1): the title's object is in the first image.

**6 · 3c builds setups, not shots** (§9.8.4): 15–25 parameterised setups, with shots as
data rows, in batches with a progress file. It is the 3c version of Stage & Marks.
**Episode 9's 3c has a paste-ready prompt** in Production Plan §9.1.

**7 · The diorama orbit** (§9.8.3, Production §3.1): Imperial's move, built from the
location that already exists. At most one per episode. The recipe is tested on
the deli (start, middle and end frames); no video file was kept.

**8 · Also:** a backward end screen (§14.1), and change one thing at a time after
episode 10 (§14.3).

**Every runbook change is in commit `fd033a6`**, separate from the whodunit commit
`3c72857`.

---

## What changed in the camera pass (2026-09-25)

**The decision stands: the camera is Remotion's** on every L1 and L2 shot, which is
about 97% of the runtime. Blender moves the camera only in the L3 shots, at most two
per episode: the cold open's moving shot and the diorama orbit. The camera audit (QA
§7) found five things to fix, and they're now in the runbook and the production plan:

1. **Feet would have slid in parallax.** The runbook said the cast moves faster than
   the background, but the cast stands on the background's floor. Now the layers are
   far / set / near, and the cast moves with the set layer.
2. **Plates had no overscan.** A 1080p plate shows its edge on an 8% drift and goes
   soft on a 10% push. Kit plates now render at 2880×1620.
3. **The hero-shot count disagreed with itself.** Six places still said "two or three";
   they all say "at most two" now, and the §2.3 tier table uses L1/L2/L3.
4. **"The camera always belongs to Remotion"** contradicted the L3 shots. It now names
   the two exceptions.
5. **The cast in an orbit** is drawn from per-frame anchors and kept small, so the
   figures read as figures on a model.


## What changed from the "trust score" video (2026-09-25)

The video's big claim, a hidden 1–100 channel score, isn't confirmed by YouTube, which
says each video is judged on its own. Its useful parts are YouTube's own advice.
Details and sources are in QA §8.

1. **The case score** (runbook §6.2.2). Ideas that pass the eleven-row case test are
   ranked out of 100: demand 25, open angle 15, red herring 15, packaging 15, cold
   answer 10, the victim's number 10, build cost 10. Every point cites its evidence.
   It's our answer to "virality score" tools, except every number can be checked.
2. **A fixed slot, never missed** (§1.4). The promise is one case a week, same day and
   time. Two a week stays the target, and it opens after four on-time episodes. *This
   changes the old "two per week" rule; revert it if you'd rather keep that promise.*
3. **Read CTR and retention together** (§14.2). High CTR with weak 30-second retention
   means the packaging overpromised: make it more accurate, not louder.
4. **The challenge**, a seventh case device (§2.8): the picture freezes before the
   reveal, "You know what we know. Who took it?"
5. **A pinned "Who did you suspect?" comment** and replies in the first two hours; the
   **Case files** playlist on the end screen (§14.1).
6. **Fixed:** §6.2.1 said "nine rows"; it's eleven.

## Locations: reuse the parts, never the room (2026-09-25)

Runbook §2.4 gained two rules, so the channel never looks like one set with the nouns
swapped:

1. **Every case has its own scene of the crime:** at least one location per episode
   that has never been on screen, built from the kit's parts plus one hero prop (about
   an hour). Case test row 8 now requires it, and the case score's build cost counts
   one new location as the best case.
2. **A returning location has to earn it:** only when the story really happens there,
   and re-dressed (signs, lamps, props, time of day, era). Each dressing is recorded
   on the location's contact sheet and never repeats.

