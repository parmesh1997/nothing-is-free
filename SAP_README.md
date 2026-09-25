# Someone Always Pays: start here

Everything from the 2026-09-24 and 2026-09-25 sessions. **Read `SAP_Master_Plan.md`
first**: it's the whole plan on one page, and it points to the detail.

| # | File | What it is | Status |
| --- | --- | --- | --- |
| 1 | **`SAP_Master_Plan.md`** | **The plan on one page:** the channel, our numbers, how a video grows, how ideas are chosen, who does what, the calendar, how we judge it | Final |
| 2 | `SAP_Subniche_Strategy.md` | **What the channel is:** The Money Whodunit, why viewers watch ours, what our own numbers say (§2.1), the format, the 12-case slate, the channel description | Final; chosen 2026-09-25 |
| 3 | `Someone_Always_Pays_Runbook.md` | **The runbook:** every step, rule and gate, with every change applied | Live |
| 4 | `SAP_Production_Plan_v2.md` | **How it's made:** 2D-first with painted plates, depth tricks, the orbit, the cold open, Steps 3–4, episodes 9 and 10 | Final |
| 5 | `SAP_Toolchain.md` | Every tool by step: licence, cost, how Claude runs it, optional AI (not recommended) | Final |
| 6 | `SAP_QA_Audit.md` | Every audit finding, pass by pass (§1–§9), and where each fix lives | Final |
| 7 | `Step3_Step4_Options.md` | Only **§2, the prompt that finishes episode 9's 3b** | Archive once episode 9 ships |
| — | `archive/` | `Visual_Upgrade_Plan.md`, `Runbook_Changes_2026-09-24.md`: earlier rounds, folded into files 3 and 4 | Archived |
| — | `NIF_CONTENT_PLAN_Sept-Dec_2026.md` | The old 90-day plan: a record of episodes 1–9, superseded from episode 10 (see its first lines) | Record |
| — | `video-os/channels/unseen/` | The Unseen channel draft | Parked |

**Tested tools** (`video-os/engine/remotion/scripts/` unless noted): `vph.mjs`,
`vtt-clean.mjs`, `dip-map.mjs`, `motion-check.mjs`, `place-check.mjs`, `saturation.mjs`,
`feed-mock.mjs`, `make-timeline.mjs`, and `lab/sap-upgrade-demo/marks.py`.

**Visual references:** `lab/sap-upgrade-demo/sap_after.jpg` (the look) and
`sap_compare.jpg` (before and after).

---

## Change history, newest first

### 7 · Our own numbers, and the whole-set audit (QA §9)

- **Episode 10 is still popcorn, as a deliberate remake of episode 1.** It's the
  channel's best-reached topic, and the cleanest test of the new format. Episode 1's
  own answer (the studio) becomes suspect two, and the culprit hypothesis moves to
  metering: fans pay more for snacks so casual viewers' tickets stay cheap (Gil &
  Hartmann, 2009). It must still pass the case test. Printer ink (slate #5) is marked
  as shipped.
- **Retention is the ceiling:** about 25% watched on the two best episodes. The
  whodunit, the 8-minute start and the cold open exist to fix exactly that.
- **The payer in the title** is a Step 0 gate (§6.0): the titles about your popcorn and
  your ink beat the titles about a company's income.
- **The Saturday 21:30 IST slot** (§1.4), and **every comparison at equal age**
  (Studio's *First 7 days*, §6.1, §14.2). Views ÷ impressions is not CTR.
- **The feed test** (`feed-mock.mjs`, §9.10, a new §12.3 gate): our thumbnail
  variants beside the topic's top results, in the home, sidebar and search views, with
  a squint button. "A scene still is not a thumbnail."
- **Cleaned up:** stale cross-references fixed; two superseded docs moved to
  `archive/`; the old content plan marked superseded; the sub-niche recorded as chosen.
- **One thing flagged, not changed:** `video-os/engine/remotion/CLAUDE.md` still
  describes the older pipeline (30 fps). It says changes to it need your go-ahead.

### 6 · Locations: reuse the parts, never the room (§2.4)

- **Every case has its own scene of the crime:** at least one location never seen
  before, built from kit parts plus one hero prop. Case test row 8 requires it.
- **A returning location has to earn it:** it comes back only when the story happens
  there, and it's re-dressed each time.

### 5 · The "trust score" video (QA §8)

- **The case score** (§6.2.2): a 100-point ranking of the ideas that pass the case
  test, where every point cites its evidence.
- **A fixed weekly slot**, never missed; two a week once earned (§1.4).
- **CTR read together with retention** (§14.2).
- **The challenge**, a seventh case device (§2.8).
- **The pinned "Who did you suspect?" comment**, and the **Case files** playlist on
  the end screen (§14.1).

### 4 · The camera pass (QA §7)

- **The camera stays Remotion's** on about 97% of the runtime. At most two moving
  Blender shots per episode.
- **Far / set / near layers**, with the cast locked to the set layer so feet don't
  slide.
- **2880×1620 overscan** on kit plates.
- **"At most two" moving shots everywhere**, and the orbit's cast placed from
  per-frame anchors.

### 3 · The three reference videos (QA §5, §6)

- **`saturation.mjs`**, case test row 11 (first mover), and row 10 (the transfer).
- **One viewer, one format, every upload** (§1.1).
- **An 8-minute start** (§1.4), and **the title echo within 5 seconds** (§4.1).
- **3c builds setups, not shots** (§9.8.4), with a paste-ready episode 9 prompt
  (Production §9.1).
- **The diorama orbit** (§9.8.3).
- **A backward end screen**, and **change one thing at a time** (§14).

### 2 · The audit round (QA §1–§4)

- **The Legal Heist became The Money Whodunit.** "Who?" stays open until about 85% of
  the way through; "how?" was the explainer question in costume.
- **"Why watch ours?" became a gate:** their answer is our red herring.
- **Step 0 sub-steps 0a–0e and the case test** (now eleven rows), including the
  **cold-answer test**.
- **Separate multiplane layers, rotating case devices** (now three of seven), and a
  reconstruction that reuses the cold open.
- **Episode 9 isn't restarted.**
- **One toolchain document.**

### 1 · The first round (now in `archive/`)

- Step 0 rebuilt on Studio, vidIQ and the VPH floor.
- Token discipline.
- Stage & Marks, the shot ladder and the scripted Resolve timeline.
- The visual upgrade items A1–B3.
