# Their workflow against ours: the rating and the blend

Written 2026-09-29. "Theirs" is the 43-section *NIF: Complete Production Workflow* you
pasted. "Ours" is `Someone_Always_Pays_Runbook.md` (with rounds 2 and 3) and the tools
in `video-os/engine/remotion/scripts/`. **Nothing here is applied to the runbook yet.**
Every change has an ID (W1 to W13). Say which to apply, and they go in as merge round 4.

---

## 1 · The short answer

**Theirs is a good production architecture. Ours is a better channel system.** Their
document is strongest where ours is thinnest: a reuse-first asset library with camera
and lighting presets, licences as data, one command that answers PASS or FAIL, a
learning database, and a check on the final file. It is weakest where ours is
strongest: it has no story engine (the case spine, the case test, the cold answer), no
measured cinema rules, and it uses tools that our own laws forbid and that put a small
channel's monetisation at risk (Meshy, RIFE, Real-ESRGAN, stock clips, MiniMax).

**The best blend keeps the runbook as the spine and takes their layer on top of it:**

- **Take** their research labels, licence manifest, lighting and camera presets, single
  validation command, final-file QA, learning database, 28-day review and phased
  publishing (W1 to W9).
- **Adapt** three things: render formats, the music source, and the topic funnel
  (W10 to W12).
- **Leave out** Meshy, RIFE, Real-ESRGAN, stock clips, MiniMax, YouTube Trends as a
  topic source, and the Blender MCP.

| Score out of 10 | Theirs | Ours today | Blended |
| --- | --- | --- | --- |
| **Total (12 rows below, average)** | **6.3** | **7.9** | **8.7** |

## 2 · The rating, row by row

The scores judge the plan as written, and the last row separates "designed" from
"tested".

| # | Dimension | Theirs | Ours | Blended | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | **Idea and demand validation** | 6 | 9 | 9 | Both use vidIQ outliers and the same VPH floor. Ours adds the case test (11 rows), the cold-answer test, `saturation.mjs`, "why ours", the payer in the title and the feed test. Theirs stops at "find proven demand, choose a unique angle" |
| 2 | **Story and format doctrine** | 5 | 9 | 9 | Their chain (hook → question → context → conflict → payoff) fits any video. Ours is one format: the case spine, but/therefore beats, misconception first, the Ledger and the challenge |
| 3 | **Research rigour and legal safety** | **8** | 7 | 9 | **They win here.** Labelling every claim FACT, CLAIM, ALLEGATION, INTERPRETATION or UNKNOWN is exactly what a channel about real crimes needs. Ours cites sources but doesn't label them (W1) |
| 4 | **Packaging and SEO** | 6 | 9 | 9 | Ours has the payer-in-title gate, the feed test, one thumbnail at publish, and now the full metadata plan (`SAP_Master_Plan.md` §12) |
| 5 | **Asset and reuse system (design)** | 8 | 8 | 9 | Theirs is a clear library design: locations, ten cameras, seven lights, props. Ours already has the library, `INDEX.md`, Stage & Marks, angle kits and the shot ladder. Their preset names make the treatment easier to write (W3) |
| 6 | **Automation and orchestration** | **8** | 6 | 8 | **They win here.** One entry point that returns PASS, FAIL, WARNING or REQUIRES DECISION. We have about 40 scripts and no single door (W5) |
| 7 | **QA** | 7 | 8 | 9 | Ours has `motion-check`, `place-check`, the feed test and the creator's issue sheet. Neither checks the *final file* the way theirs proposes (W6) |
| 8 | **Compliance, licences, AI policy** | 4 | 9 | 9 | Their licence manifest is good. But Meshy, RIFE, Real-ESRGAN, MiniMax and unrestricted thumbnail tests contradict law 12 and our disclosure rules, and YouTube's 2025–26 policies target this risk |
| 9 | **Analytics and learning loop** | **8** | 7 | 9 | **They win here.** 24h/48h/7d/28d and a knowledge database. Ours reviews at 48h and 7d, and keeps a 40-line lessons file (W7, W8) |
| 10 | **Cost and token discipline** | 7 | 8 | 8 | Same principle ("Claude decides, scripts execute, never send long logs"). Ours has the concrete rules: a context ceiling, model routing, fix by class, a log trimmer |
| 11 | **Cinematic quality rules** | 6 | 8 | 8 | Theirs gives a style name and a tool split. Ours measures it: directed cold open, every scene directed, atmosphere kit, activity floor |
| 12 | **Tested in practice** | 3 | 7 | 7 | Theirs is a design. Ours has shipped ten episodes and about 40 working scripts, and it carries their scars (NIF007's 63 GB master, NIF009's UI-issue marathon) |
| | **Average** | **6.3** | **7.9** | **8.7** | |

## 3 · Their 43 sections, mapped

| Their § | Their idea | Ours | Verdict |
| --- | --- | --- | --- |
| 1 | Topic discovery: Trends → vidIQ → competitors → outliers | §6.2, §6.3 | **Adapt (W12).** Same funnel, minus YouTube Trends, which is news-driven and breaks "evergreen". The outlier floor is already ours |
| 2 | Primary research, with the five labels | §6.2.1, §7.2 | **Adopt (W1)** |
| 3 | Story development chain | §4.2 the case spine | **Keep ours.** The chain is a subset of it |
| 4 | Packaging first: 3 titles, 3 thumbnails, one promise | §6.5 Round 2, §9.10 | **Have it.** Ours adds the feed test |
| 5 | Episode spec, `episode.json`, typed folders | `project.json`, folders `00_`–`10_` by step | **Keep ours.** Folders by step map to gates and to what a session reads. **Adopt the schema check (W5)** |
| 6 | Audio: ElevenLabs primary, MiniMax backup, Epidemic Sound primary | §8.1, §10.8.1 | **ElevenLabs: have it. MiniMax: leave out. Epidemic: a decision (W11)** |
| 7 | Remotion vs Blender per shot | §9.1, §9.8 | **Same split.** Have it |
| 8 | "Cinematic Editorial 2.5D" | §2.1 | **Adopt the name as a label** (W3). "Avoid Oversimplified visuals" matches our rule: we borrow their story method, never their look |
| 9 | Lucky built once, from parts | §2.5, the cast rig | **Have it.** Era wardrobe is in `SAP_Master_Plan.md` §5.1 |
| 10 | Location library | §9.8, `library/` | **Have it** |
| 11 | Camera library, C01–C10 | The angle kit, §9.8.1 | **Adopt the names** (W3), mapped onto the existing kit |
| 12 | Lighting library, L01–L07 | §9.0.1 (time of day, weather) | **Adopt** (W3) |
| 13 | Prop library | `library/props/`, `INDEX.md` | **Have it** |
| 14 | Asset decision tree: library → Poly Haven → Meshy | §9.9, §9.0.1 step 1 | **Adopt the tree, replace Meshy with "build by hand"** (R1) |
| 15–16 | Poly Haven, Quaternius | §9.9 (both are already listed, with Kenney and ambientCG) | **Have it** |
| 17 | Meshy | Law 12, §13.1 | **Leave out (R1)** |
| 18 | Blender automation through the Blender MCP | §13.1: headless Python, "never the Blender MCP" | **Keep ours (R4).** The `nif_*` command idea is adopted as one wrapper (W5) |
| 19 | Preview first, final after a pass | §9.4, §11.2 proxies, the shot ladder | **Have it** |
| 20 | Remotion workflow | §9 | **Have it** |
| 21 | Stock clip limit: 3 uses | §9.7: "There is no stock" | **Keep ours,** which is stricter (R3) |
| 22–23 | Shot production, the visual pipeline | §7.5 `shots.json`, §9.0 | **Have it** |
| 24–25 | Resolve for the edit; the audio mix in Resolve | §10, §10.8: the mix is `mix-final.mjs`, not Resolve faders | **Keep ours (R5)** |
| 26 | FFmpeg, ffprobe, Whisper, RIFE, Real-ESRGAN | §13.1 | **FFmpeg, ffprobe, Whisper: have. RIFE, Real-ESRGAN: leave out (R2)** |
| 27 | Output: 1080p, H.264/H.265, "not ProRes 4444" | §9.4, §10.10: H.265 Main10 upload, ProRes 4444 layers | **Adapt (W10).** The delivery matches. Their ProRes point is a fair render-time question |
| 28 | Captions from Whisper | §8.2, `transcribe.mjs` | **Have it.** Correct the names by hand (metadata §12.4) |
| 29 | Chapters: first at 00:00, at least 3, ascending, 10 s minimum | §8.3 | **Adopt the validation** (W6) |
| 30 | Thumbnails A/B/C, tests | §9.10, §14.1 | **Adapt.** Make three concepts, publish one, test after about 1,000 impressions (R6) |
| 31 | Automated QA: content, media, visual, licence, reuse | §12 gates, `motion-check`, `place-check` | **Adopt the media, licence and reuse checks** (W5, W6) |
| 32 | Licence manifest | `library/stock-ledger.json`, §10.8.1 | **Adopt (W2)** |
| 33 | The YouTube package | §13.3 `packaging.md` | **Have it** |
| 34 | The private upload, then review, then publish | §14.1 | **Have it** |
| 35 | Publishing automation, phased | §13.6: Claude never uploads | **Adopt as a roadmap, not now (W9)** |
| 36 | The 24h/48h/7d/28d loop | §14.2: 48h and 7d | **Adopt the 28-day review (W8). Skip the 24-hour one** (below 300 impressions it's noise) |
| 37 | Performance diagnosis | §14.2, `SAP_Master_Plan.md` §10 | **Have it** |
| 38 | Learning database | `library/shipped.md`, `lessons.md` | **Adopt as one machine-readable file (W7)** |
| 39 | Token discipline | §5.4, the log trimmer | **Have it** |
| 40 | One NIF MCP | §13.6: MCPs scoped to the agent that needs them | **Adopt the idea as one command-line wrapper now (W5). An MCP only if the wrapper earns it** |
| 41 | The final tool stack | §13.1 | Differences: Meshy, MiniMax, Epidemic, RIFE, Real-ESRGAN (above) |
| 42–43 | The full flow, the core principle | The runbook's philosophy | **Same idea.** "Episode 50 mostly assembles" is the goal of the library and the kit |

## 4 · The changes, in one list

### 4.1 · Adopt (W1 to W9)

| ID | Change | Runbook § | Built by | Cost |
| --- | --- | --- | --- | --- |
| **W1** | **The research dossier.** Step 0e writes `00_intake/dossier.md`: every claim tagged **FACT** (sourced and established), **CLAIM** (someone said it, attributed), **ALLEGATION** (charged, not proven), **INTERPRETATION** (ours, marked) or **UNKNOWN**. The script may state a FACT plainly, a CLAIM only with its speaker, an ALLEGATION only as alleged, and never an INTERPRETATION as a fact. Case test rows 2, 3 and 6 must cite dossier lines. A new gate: **Dossier** | §6.2.1, §6.5 (0e), §7.2, §12.0, §12.1 | Claude (Sonnet) | Text only |
| **W2** | **The licence manifest, as data.** Extend `library/stock-ledger.json` into `library/licenses.json` with the fields `asset, provider, source, license, downloadDate, episode, commercialUse, credit, category`, where the category is **software, asset, audio or source-media** (tracked separately). Every download script writes an entry. `license-check.mjs` fails on a missing licence, a `commercialUse: false`, or an entry that needs a credit that isn't in the description. A new gate: **Licences** | §9.9, §10.8.1, §12.3, §13.3 | Claude (Sonnet), one session | A small script |
| **W3** | **Presets and names.** Lighting presets **L01 Morning · L02 Afternoon · L03 Evening · L04 Night · L05 Dramatic · L06 Interior · L07 Exterior**, used by name in the treatment and recorded per plate. Camera names **C01 Establishing … C10 Hero**, mapped onto our existing angle kit (no rebuild). The look gets a one-line label: **"Cinematic Editorial 2.5D: authored 2D characters inside mid-detail stylised 3D worlds"**, plus "we borrow Oversimplified's story method, never its visuals" | §2.1, §9.0.1, §9.8.1 | Claude (Opus, in the treatment) | Text only |
| **W4** | **Reuse check.** From `shots.json` and the last three episodes: any (location, angle) pair used twice, any prop or plate used more than 3 times in one episode, is a **WARNING**. Our law "no camera angle reused within or across episodes" becomes automatic | §2.7, §12.3 | Part of W5 | Small |
| **W5** | **One door: `nif`.** A single command-line wrapper over the scripts we already have: `nif validate` (the `project.json` and `shots.json` schemas, references resolve, every asset has a licence, the reuse check), `nif audit` (`place-check`, `motion-check`, `flicker-check`), `nif media` (W6), `nif package`. It prints at most **20 lines**: each check as **PASS, FAIL, WARNING or REQUIRES DECISION**, then stops. Claude reads only those lines. **No MCP for now** (R4) | §5.4, §13.6, §12 | Claude (Sonnet), 2–3 sessions | Scripts, no new dependency |
| **W6** | **Final-file QA: `media-qa.mjs`**, run on the delivered MP4 with ffprobe and ffmpeg: **1920×1080, 24 fps, H.265 Main10, BT.709 SDR tags, AAC 48 kHz, −14 LUFS and −1.5 dBTP, duration within ±0.5 s of `timing.json`, no black run over 1 s except the dips, no missing media referenced by `project.json`**. Plus **chapters valid**: the first at 00:00, at least 3, ascending, each at least 10 s | §8.3, §10.10, §12.4 | Claude (Sonnet) | One script |
| **W7** | **The learning database, kept small.** `library/patterns.json`, appended by a script at the 7-day review: case type, hook type, title pattern, thumbnail pattern, the era, CTR, share watched, retention at 30 s, and the section that held best. **Only scripts read it:** `patterns-report.mjs` prints at most 15 lines at Step 0. `lessons.md` stays the 40-line human summary. Their eight separate JSON files would blow the token budget | §14.3, §6 (step 1) | Claude (Sonnet) | One script |
| **W8** | **The 28-day review.** After 48 hours and 7 days, a channel-level look at 28 days: which case types, hook types and eras carry the traffic, and the suggested-traffic share (`SAP_Master_Plan.md` §10). One lesson into `lessons.md`. **No 24-hour review**: at a few hundred impressions it only measures noise, so 24 hours is just "confirm the upload processed and the thumbnail shows" | §14.2 | Claude, cloud session | Text |
| **W9** | **Publishing phases, as a roadmap.** **Phase 1 (now):** you upload. **Phase 2 (after ten shipped episodes, and only if uploading is the bottleneck):** an API script uploads **private only**, with the metadata; you review and publish. **Phase 3 is out.** Claude never gets a public-publish authority (§13.6 stays) | §13.6, §14.1 | — | Later |

### 4.2 · Adapt (W10 to W12)

| ID | Change | Why it isn't taken as-is |
| --- | --- | --- |
| **W10** | **Render formats: benchmark before changing.** Their point: "do not use ProRes 4444 as the normal Remotion output". Ours: layers are ProRes 4444 because they need alpha, and NIF007's 63 GB master shows what disk and time cost. **Test on one setup:** opaque scene bases as high-bitrate H.264/H.265 (or ProRes 422 HQ) and keep ProRes 4444 only for alpha layers. Compare render time, file size, and visible banding in gradients, fog and grain. **If the numbers hold, §9.4 changes to "alpha layers only"**; otherwise nothing changes | §9.4, §11.2 (only after the benchmark) |
| **W11** | **Music source.** Epidemic Sound as a seventh standing source (§10.8.1). **If you already pay for it,** add it as the first choice for music and keep each track's licence in `licenses.json` (W2). Check its terms on commercial use and on linking the channel before relying on it. **If you don't pay for it, don't start until the channel is monetised:** the six free and ElevenLabs sources cover the need | §10.8.1, §13.5: **your call** |
| **W12** | **Topic discovery.** The funnel stays: vidIQ keywords → competitors → outliers → the outlier floor. **YouTube Trends is dropped** as a source, because trending topics are news pegs and our case test row 9 requires none. vidIQ's rising keywords show which *closed* cases are having a moment. One sentence is added: **the floor is a research filter, not a prediction** | §6.2, §6.3, §12.0 |

### 4.3 · Leave out (R1 to R6)

| ID | What | Why |
| --- | --- | --- |
| **R1** | **Meshy.** AI-generated 3D models and their textures | **Law 12:** no AI-generated image or texture "at any size", and a person directs every choice. **§13.1:** no AI image tools in the stack. The tools rule: a new tool must be free at our scale with a nameable licence. **Audience:** FERN reports that viewers now read 3D-looking AI work as slop, and YouTube is starting to label it. **What replaces it:** the tree becomes *library → Poly Haven, Kenney, Quaternius, ambientCG → build it by hand in Blender from primitives (a hero prop is 30 to 60 minutes; FERN blocks out with cubes) → register in the library.* If you want to overturn law 12 for props, that's a §13.5 change and a disclosure check first; I'd advise against it |
| **R2** | **RIFE and Real-ESRGAN.** Neural frame interpolation and upscaling | We render at native size and frame rate, and Remotion sets the fps, so interpolation and upscaling only add invented pixels. That sits against law 12. They'd be a rescue for a broken render, and only with your yes |
| **R3** | **The stock clip limit (3 uses).** | Ours is stricter: **there is no stock** (§9.7). Archival appears only as real documents inside a scene |
| **R4** | **The Blender MCP, and building a NIF MCP now.** | §13.1: headless Python, "never the Blender MCP", and MCPs stay scoped to the agent that needs them (§13.6). The wrapper (W5) gives the same one-door effect with no server to maintain |
| **R5** | **Mixing in Resolve.** | The mix is `mix-final.mjs`, measured in LUFS, and repeatable. Resolve does the timeline, the grade and the stems |
| **R6** | **Testing thumbnails at publish, and A/B/C thumbnails as a habit.** | Three concepts are written, **one** is published, and *Test & compare* starts after about 1,000 impressions (§14.1). At 170 impressions each variant gets about 57 views |
| — | **MiniMax as a backup voice** | A second synthetic voice to disclose and licence, and nothing to gain while ElevenLabs works. **A question:** their "existing ElevenLabs clone" line: if it's your own voice, tell me. That changes the disclosure (§13.3), and it's the safest narrator we could have |

## 5 · What stays exactly as it is

The case spine, the case test, the cold-answer test, `saturation.mjs`, the feed test,
the payer in the title, the Ledger, the six pillars, the directed cold open and
every-scene rules, the atmosphere kit, `motion-check`, Stage & Marks, the fix loop,
manual QA with `issues.csv`, the token rules, and the creator-uploads rule. None of
them is in their document, and each one answers a failure we measured.

## 6 · How to apply it

**In order, cheapest and most useful first:**

1. **W1, W3, W4, W12** and the words for **W8**: text in the runbook, no code. One
   Sonnet session, about an hour.
2. **W2 and W6**: two small scripts, and the two new gates (**Licences**, **Media**).
3. **W5**: `nif`, as the wrapper around everything. It's built after W2 and W6, so it has
   something to call.
4. **W7**: after the first case has its 7-day numbers.
5. **W10**: one benchmark, on one setup, during the kit build (`SAP_Master_Plan.md` §5.1).
6. **W9**: revisit after ten episodes.

**How it reaches the runbook:** a fourth merge round, in the same pack (`SAP_Merge_Pack.md`,
change IDs R4-1 and up), so it's still one merge on your PC.

## 7 · What I need from you

| # | Decision | My recommendation |
| --- | --- | --- |
| 1 | Apply **W1 to W9 and W12** to the runbook as merge round 4? | **Yes.** They add capability and cost almost nothing |
| 2 | **Epidemic Sound** (W11): do you already pay for it? | If yes, add it as source 7. If no, wait until the channel is monetised |
| 3 | **ProRes benchmark** (W10): run it during the kit build? | Yes |
| 4 | **Meshy** (R1): confirm it stays out | Yes, out |
| 5 | The **ElevenLabs clone**: is it your own voice? | If yes, tell me; it may be the better narrator |
