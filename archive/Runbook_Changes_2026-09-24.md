# Runbook changes, 2026-09-24: proposal for approval

This goes with `Someone_Always_Pays_Runbook.md`. The runbook keeps no change log
(§13.5), so the list of changes lives here. Once you approve it, move this file
to `archive/`.

The exact edits are in git: commit `3670ff7` is your runbook unchanged, and the
commit after it holds every change. `git diff 3670ff7 -- Someone_Always_Pays_Runbook.md`
shows them line by line.

---

## 1 · What did not change

Unchanged: the channel (§1.1–1.2), the visual system (§2), the anti-slop laws
(§3), the format doctrine (§4), the voice and the one-render rule (§8.1), the
render specs (§9.4), the Blender rules (§9.8), the grade (§10.9), audio (§10.8),
delivery (§10.10), and every existing gate. Nothing about the look changed.
Visual ideas are in `Visual_Upgrade_Plan.md` as lab tests, not as rules.

---

## 2 · What is new, by section

### Token use

| Where | Change | Saving |
| --- | --- | --- |
| **§0.1** (new) | A read map: every step reads §0, §3 and its own sections only | A session loads 5k–21k tokens of runbook instead of about 53k |
| **§5.4** (new) | Token rules: hand over file paths instead of pasting contents; read page text before taking screenshots; browsing subagents return fixed tables; scripts print summaries; transcripts are cleaned; stills are audited as contact sheets; nothing is researched twice | The large costs were screenshots, raw logs and re-reading |
| **§5.2** | Step 0 split into collect (Sonnet subagent, browser) and decide (Opus). Step 2 moves to Haiku 4.5, with Sonnet as the fallback. Opus 5 becomes Opus 5.5. New row for Step 5 | The expensive model never reads raw pages |
| **§7 intro, §7.5** | Narration lives only in `script.md`. `beats.md` points to it and does not copy it. Word counts come from a script | Removes a second copy of the narration that every later step was reading |
| **§8.4** (new) | Rhubarb moves from Step 3 to the end of Step 2 | Keeps mechanical work out of the build session |
| **§9.0** | Inventory starts from a one-file `library/INDEX.md` | Replaces walking folders and contact sheets |
| **§9.5** | The auditor works cheapest first: scripts, then 12-still contact sheets, then full-size stills only for flagged frames | Roughly one image per beat instead of twelve |
| **§12** | Gates grouped by step (`### 12.0`–`12.5`) | An agent loads only its own step's gates |
| **§10.6** | The superseded Fusion text is cut to the move vocabulary | Smaller file |

### Step 0 (what you described)

| Where | Change |
| --- | --- |
| **§6 intro** | "What a fresh session does, in order": a 7-row table, so `Run the runbook. Episode 10.` needs no further explanation. Browser rules: Rama profile; what counts as reading; what never gets clicked (Generate, Regenerate, AI, chat, Apply, Save, Publish, Upgrade, anything with a credit cost) |
| **§6.1** (new) **The postmortem** | Before any new topic: the last two episodes in Studio (CTR, impressions, traffic sources, AVD, APV, % watching at 0:30, dips and spikes with timestamps) and in the vidIQ Optimize tab (content score /100, every Review issue verbatim). `dip-map.mjs` maps every timestamp to its beat and the words spoken there. Output is a fixed 10-line block per episode ending in **DO NOT REPEAT** and **KEEP**. A cause must be one the runbook names. The same cause in both episodes goes into `lessons.md` |
| **§6.2 The evidence gate** | Your VPH rule written as a hard table: **up to 3 months ≥80 VPH (≥100 is strong); 3–12 months ≥20; over 12 months ≥20 and still unusual**, all at **≥3× the channel's baseline**. The vidIQ Research walk in order: For you (Outliers for me, Rising keywords), then Keywords, Videos, Channels, Thumbnails. Then `vph.mjs` measures the shortlist itself; where it disagrees with vidIQ's badge, both are shown and the gate uses ours |
| **§6.3 The vidIQ prompt** | Now carries the postmortem, the measured evidence and **Claude's own recommendation (topic, angle, outlier, keyword, title) plus two alternates**, and asks vidIQ to challenge it, find what Claude missed, pick exactly one, and propose a keyword and three titles. Claude then compares both answers without deferring to either |
| **§6.5 Round 1** | Each angle adds: the outlier (our numbers and vidIQ's), the primary keyword, and how it avoids each DO NOT REPEAT line |
| **§6.6 Output** | `PRIMARY KEYWORD` and `LESSONS` added to `project.json` |
| **§5.1** | New folders `00_intake/` and `10_review/`. New library files `shipped.md`, `lessons.md` (40-line cap) and `INDEX.md` |
| **§1.3** | Diagnostics table: AVD, % at 0:30, dips, traffic sources, vidIQ score. Tracked, not gated |

### Steps 1–5

| Where | Change |
| --- | --- |
| **§7.0** (new) **Start from the lessons** | Every DO NOT REPEAT line gets an answer in `beats.md` (beat and line). Every KEEP line is reused in a new form. Where both past episodes dipped at the same share of runtime, this script plans a re-hook at that share. A weak 0:30 number forces a rewrite of the cold open's first line |
| **§9.8** | **Render only what moves.** A locked-off camera renders one plate frame plus a small looping ambient pass. Plates render in parallel by frame range. EEVEE sample count set once per location. Blender runs with `--quiet` |
| **§9.5, §11.2** | `motion-check.mjs` runs ffmpeg's freeze detection and scene-cut detection over every frame of the proxy. It measures law 11 (no held state ≥3 s) and law 2 (shots 2–9 s), mapped to beats, before you watch. Continuous flow shots are declared with `"flow": true` in `shots.json` (§10.7) |
| **§10.10** | Delivery QC is two exact commands: ffprobe for the stream spec, ebur128 for LUFS and true peak |
| **§14** (new) **Step 5 · Publish and learn** | Before publish: read the vidIQ Optimize score and Review issues on the private upload and list the free fixes; check the four §13.3 description obligations; put the 2–3 Step 3 thumbnails into Studio's *Test & compare*. At 48 hours: the seed test, with one packaging recommendation if CTR is under 6%. At 7 days: `10_review/review.md` in the postmortem format. The `lessons.md` rules: one line per lesson; added after two episodes; removed after three clean episodes or when promoted into the runbook; 40 lines at most |
| **§12** | New gates: Postmortem, Keyword, No spend (Step 0); Lessons (1); Mouth cues (2); Motion check (3); Pre-publish check, Description, Review (5). Evidence, No held state and Lip sync reworded to point at the new scripts |
| **§13.1, §13.6** | Stack lists the new scripts. `nif-researcher` loads §6, §14, §12.0 and §12.5 |

### Fixes to existing text

- The §8.2 dry-run line pointed to §7.5 for "the point of no cheap return". That
  rule is in §7.7; the reference is fixed.
- Every `§` reference in the file was checked by script. All of them now point to a
  heading that exists.

---

## 3 · Decisions for you

| # | Decision | My recommendation |
| --- | --- | --- |
| 1 | Floor for videos up to 3 months: **80 VPH**. You said "80 to 100"; I made 80 the floor and 100 "strong" | Keep 80. It widens the pool without admitting weak outliers, because the 3× multiple still has to hold |
| 2 | **3× the channel's baseline**: a new number. The old text said only "significantly outperforming" | 3×. vidIQ's outlier score reads the same way, so the two can be compared directly |
| 3 | **Haiku 4.5 for Step 2** | Try it on one episode. Step 2 is four fixed commands. If it trips once, go back to Sonnet 5 low |
| 4 | **"About seven in ten at 0:30"** as the level that forces a cold-open rewrite (§7.0). A new number | Keep it as a trigger, not a gate, until three episodes of our own data exist |
| 5 | **Test & compare** for thumbnails at every publish (§14.1) | Yes. Step 3 already builds 2–3 variants, so the test costs nothing |

---

## 4 · Setup before the next episode

1. Copy `video-os/engine/remotion/scripts/{vph,dip-map,vtt-clean,motion-check}.mjs`
   into `D:\YT\…\engine\remotion\scripts\`. They need Node and `yt-dlp` (already
   used for transcripts). `motion-check` uses the Remotion-bundled ffmpeg, or
   `$FFMPEG`.
2. Create `video-os/library/shipped.md` (one line per published episode),
   `lessons.md` (empty; the first Step 0 fills it) and `INDEX.md`.
3. Update the agent files in `D:\YT\.claude\agents\` to match §5.2 (Opus 5.5;
   Haiku 4.5 for `nif-voice`), and give `nif-researcher` a browsing subagent on
   Sonnet 5.
4. Update the `nif-sec-*` skills: §12 is now split per step, §14 is new, and
   Rhubarb moved to §8.4, so `nif-voice` needs §8.4 and `nif-builder` no longer
   does.
5. Check that the Chrome browser tools are connected in the Rama profile before
   saying `Run the runbook. Episode 10.`
6. Optional: set up the YouTube Analytics API (free, one-time OAuth). The
   `audienceWatchRatio` rows it returns go straight into
   `dip-map.mjs --csv`, which finds the dips itself instead of relying on the
   key-moments card.

## 5 · The scripts, tested here

| Script | What it does | Tested |
| --- | --- | --- |
| `vph.mjs` | Views per hour from publish time; outlier multiple from the channel's recent uploads; verdict against the §6.2 table; compact markdown table | Offline, on yt-dlp-shaped JSON. The live yt-dlp call was not run here (no YouTube access from this sandbox) |
| `dip-map.mjs` | Retention timestamps or a curve CSV mapped to beat, % into the beat, and the words spoken | On NIF004's real `timing.json`, with both timestamps and a synthetic curve |
| `vtt-clean.mjs` | Removes the rolling repetition from auto-subs; adds `[m:ss]` markers every 30 s | On a sample auto-sub file |
| `motion-check.mjs` | Freeze detection plus scene cuts on the proxy; held states and shot lengths mapped to beats; exits 1 on a held state | On a synthetic 24 s video with a 5 s freeze, a 12 s shot and a 1 s shot. All three were caught |
