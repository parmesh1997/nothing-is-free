# NIF — Tooling & Skills Catalogue

Companion to `Nothing Is Free — Master Runbook v1.0.md`.
Written 2026-09-06. Evaluates the 24 repositories handed over that day, plus the
two "awesome" indexes and the free image/video-model landscape, against the
runbook's standing rule (**§18**): *any tool that touches content creation must be
(a) free at this channel's scale, commercial use included, and (b) carry a
licence you can name. "Not sure about the licence → don't use it."*

Nothing here has been installed yet. This is the researched-and-graded state —
install per §0, in order.

---

## Verdict legend

| Tag | Meaning |
|---|---|
| **ADOPT** | Install now. Clear win, licence clean, fits the pipeline. |
| **ADOPT (piece)** | Take one part / a few skills, not the whole bundle. |
| **CONDITIONAL** | Install only when a specific named need shows up. |
| **HAVE** | You already run this, or a working equivalent. Do not double-install. |
| **SKIP** | Not for this operation, or the licence fails the §18 rule. |

Lane = where it belongs: **Content** (touches an episode), **Ops** (marketing /
scheduling / packaging), **Dev** (working on the `video-os` codebase), **—** (n/a).

> **Star counts are omitted on purpose.** The fetch tool returned wildly
> inconsistent numbers (40k–280k for the same class of repo). Every "ADOPT"
> below was graded on licence + fit, not popularity. Verify activity yourself on
> the repo page before installing.

---

## 0 · Install-first list (the ~20-minute setup)

Do these five. They are all MIT/Apache, all free, and each closes a real gap in
the runbook pipeline.

**Status (2026-09-06):** 3 and 5 are DONE (run from the terminal). 1, 2, 4 are
`/plugin` commands — run them in the Claude Code client yourself.

```bash
# 1. [TODO — run in client] Research — topic sensing across Reddit / HN / YouTube / arXiv, ranked by engagement
/plugin marketplace add mvanhorn/last30days-skill
/plugin install last30days-skill

# 2. [TODO — run in client] QC — Claude WATCHES the render (frames + local-whisper transcript)
/plugin marketplace add https://github.com/jordanrendric/claude-video-vision
/plugin install claude-video-vision
# then: /setup-video-vision   (choose LOCAL whisper — you already have whisper.cpp)

# 3. [DONE] Craft — GSAP 100% free (SplitText, MorphSVG, DrawSVG). 8 skills installed to
#    video-os/engine/remotion/.claude/skills/ + .agents/skills/ . Usable in Remotion via useGSAP.
#    npx skills add greensock/gsap-skills --skill '*' -y

# 4. [TODO — run in client] Packaging — CRO/copywriting/SEO for titles, thumbnails, descriptions
/plugin marketplace add coreyhaines31/marketingskills
/plugin install marketing-skills

# 5. [DONE] Research scraping — Scrapling 0.4.15 + Chromium installed, fetch test OK (BSD-3-Clause).
#    from scrapling.fetchers import Fetcher, StealthyFetcher, DynamicFetcher
```

Then read **§4** (script humanizing gate) and **§11** (the runbook change) and
decide on those two.

---

## 1 · What you already have

So nothing gets installed twice.

### Skills installed — `video-os/engine/remotion/.claude/skills/` (+ `.agents/skills/`)

`after-effects` · `animated-infographic` · `animation-principles` ·
`beat-sync-editing` · `chart-animation` · `color-motion` · `diagram-animation` ·
`explainer-video` · **`humanizer`** (blader/humanizer, MIT) · `isometric-animation` ·
`kinetic-typography` · `logo-animation` · `motion-art-direction` ·
`motion-background` · **`nif-house-style`** (custom, the locked look) ·
`presentation-video` · `remotion-video` · `shot-composition` ·
`whiteboard-animation` · `wrapped-video` · plus the official
`remotion-best-practices` router (`remotion-*`).

That is already the iart-ai motion/explainer/kinetic/data packs + humanizer +
official Remotion, unpacked to ~20 granular skills. **Most "skills collection"
repos in the handover overlap this set** — see §2.

### MCP connectors already wired

| Connector | What it gives you | Note |
|---|---|---|
| **vidiq** (50+ tools) | keyword research, title/thumbnail scoring, competitor & outlier analysis, channel analytics, trend categories, transcripts, comment replies, `generate_*` (script/titles/thumbnail/broll/music/voiceover) | Runbook §13.3 validation layer. Huge. Underused. |
| **davinci-resolve** | full Resolve control (timeline, Fairlight, colour, render) | Runbook Step 4. Free edition via in-app bridge. |
| **Creative** (`creative_generate_image` / `_video` / `_speech`, `creative_design_voice`) | image / video / TTS generation + voice design | **Verify output licence + cost before any published use** — §18 rule applies to it too. |
| **HeyGen HyperFrames** (`compose`, `render_video`, `list_projects`…) | HTML→video projects, cloud render | `compose`/`render_video` are **disabled for CLI agents** anyway. You already have a full Remotion engine — do not run a second video engine (§10). |
| **caveman** (`caveman_compress`, `_retrieve`, `_stats`, `_toon_encode/decode`) | token / context compression | This **is** `JuliusBrussee/caveman` from the handover. You already have it. |
| **scheduled-tasks** / cron | recurring automated runs | Ops automation (§8). |
| **mcp-registry** | search/install more MCP servers | discovery |

### Memory

Native file-based auto-memory at
`C:\Users\parme\.claude\projects\D--YT-Nothing-Is-Free\memory\` — 12 memory
files + `MEMORY.md` index, actively maintained. **This is a working memory
system.** See §9 for why not to add a second one.

---

## 2 · The verdict table

### The 24 handed over

| # | Repo | What it is | Licence | Verdict | Lane |
|---|---|---|---|---|---|
| 1 | **thedotmack/claude-mem** | Hook-based auto-memory: SQLite + Chroma + worker service, compresses session history | Apache-2.0 | **SKIP** — you have native memory (§9) | — |
| 2 | **Egonex-AI/Understand-Anything** | Builds an interactive knowledge graph of a codebase; `/understand`, `/understand-onboard`, etc. | MIT | **CONDITIONAL** — if `video-os` navigation becomes a drag | Dev |
| 3 | **K-Dense-AI/scientific-agent-skills** | 163 science skills (bio/chem/clinical/ML) + a unified "Database Lookup" over 100+ scientific DBs | MIT (repo); per-skill licences vary | **SKIP** for NIF — cherry-pick only the `Database Lookup` skill if an episode is health / pharma economics | Content (rare) |
| 4 | **alirezarezvani/claude-skills** | 388 skills across eng / marketing / product / C-level; zero-dep Python tools | MIT | **CONDITIONAL** — cherry-pick the marketing + `security-auditor` + `rag-architect` domains; don't install all 388 | Ops / Dev |
| 5 | **punkpeye/awesome-mcp-servers** | Index of MCP servers | MIT (list) | **REFERENCE** — findings folded into §5 / §8 | — |
| 6 | **D4Vinci/Scrapling** | Adaptive web scraper: anti-bot fetchers, Scrapy-style spiders, sitemap crawl, has its own MCP | **BSD-3-Clause** | **ADOPT** — research stage, when WebFetch/WebSearch fall short (JS sites, archives, bulk). Respect robots.txt / site ToS. | Content |
| 7 | **nextlevelbuilder/ui-ux-pro-max-skill** | Design-system generator: 79 UI styles, 192 palettes, 74 font pairs, tech-stack guides | MIT | **CONDITIONAL** — for a channel **site** or the future "audit" channel dashboards, not for beat visuals (§6, §10) | Ops |
| 8 | **JuliusBrussee/caveman** | Token compression ("talk like caveman") — skill + local proxy + MCP | MIT (skill/CLI); **BSL-1.1** (engine/proxy → Apache 2030) | **HAVE** — already a connected MCP | Dev |
| 9 | **addyosmani/agent-skills** | 25 tight lifecycle skills (spec → plan → build → verify → review → ship) + `frontend-ui-engineering` | MIT | **ADOPT (piece)** — `code-review-and-quality`, `code-simplification`, `debugging-and-error-recovery`, `security-and-hardening` for the `video-os` codebase | Dev |
| 10 | **Leonxlnx/taste-skill** | Anti-slop **frontend** design refinement (VARIANCE/MOTION/DENSITY dials, `image-to-code`) | MIT | **CONDITIONAL** — only if you build a web frontend; `nif-house-style` already does this job for video | Ops |
| 11 | **rtk-ai/rtk** | Rust CLI that filters shell-command output before it hits context (60–90% fewer tokens) | Apache-2.0 | **CONDITIONAL** — pick **one** of {rtk, caveman}. RTK if you want zero-config command filtering; you already have caveman. Don't stack both. | Dev |
| 12 | **Imbad0202/academic-research-skills** | Deep-research + academic-paper + peer-review pipeline, multi-agent | **CC BY-NC 4.0** | **SKIP** — **non-commercial licence, channel is monetized.** Fails §18. Use `last30days-skill` + `Scrapling` + Claude WebSearch instead | — |
| 13 | **MadsLorentzen/ai-job-search** | Automated job applications, CV tailoring, portal scrapers | MIT | **SKIP** — not relevant to the channel | — |
| 14 | **mvanhorn/last30days-skill** | `/last30days <topic>` — researches Reddit / X / YouTube / HN / arXiv / GitHub / Polymarket, ranked by real engagement; offline library | MIT | **ADOPT** — Intake topic sensing + "what's the current conversation about X" + competitive scan. Free core needs no keys. | Content / Ops |
| 15 | **obra/superpowers** | Methodology skills: `brainstorming`, `writing-plans`, `systematic-debugging`, `verification-before-completion`, `using-git-worktrees` | MIT | **ADOPT (piece)** — `brainstorming` + `writing-plans` for episode/script planning, `systematic-debugging` for render bugs | Dev / Content |
| 16 | **ayghri/i-have-adhd** | Output-formatting skill: direct answers, no preamble, numbered steps | MIT | **CONDITIONAL** — personal preference; cheap to try, easy to remove | — |
| 17 | **nyldn/claude-octopus** | Multi-model orchestration (Codex / Gemini / Perplexity / …), consensus gates | MIT | **SKIP** unless you already pay for ChatGPT **and** Gemini — full value needs other model subscriptions. `/code-review ultra` already covers multi-agent review | Dev |
| 18 | **activeloopai/hivemind** | Team knowledge-sharing: session traces → shared skills, needs a Deeplake account | Apache-2.0 | **SKIP** — built for multi-engineer teams; you're solo | — |
| 19 | **jordanrendric/claude-video-vision** | `/watch-video`, `video-perception` skill + MCP: extract frames + transcribe, Claude *sees* the render | MIT | **ADOPT** — the missing QC eye. **Local whisper** path is free & offline (you have whisper.cpp) | Content |
| 20 | **quemsah/awesome-claude-plugins** | Ranked top-100 Claude plugin index | (list) | **REFERENCE** — best finds folded into §5–§8 | — |
| 21 | **fcakyon/claude-codex-settings** | Opinionated config bundle: `humanize` hook, `simplify`, git-confirm hooks, formatters | Apache-2.0 | **ADOPT (piece)** — the **`humanize.py` write-hook** + `git_commit_confirm` / `block_force_push` hooks (see §4, §8) | Dev / Content |
| 22 | **ReflexioAI/claude-smart** | Corrections → reusable local rules; ONNX embeddings, fully offline | Apache-2.0 | **CONDITIONAL** — if you keep re-correcting the same things and the memory `feedback` type isn't catching it | Dev |
| 23 | **microsoft/power-platform-skills** | Build Power Apps / Power Automate flows / Power Pages | MIT (skills) | **SKIP** — real use needs paid Power Platform / Dataverse / premium-connector licences. Your automation layer is Claude + scheduled-tasks + scripts | — |
| 24 | **K-Dense / awesome-mcp-servers (dup of #5)** | — | — | see #5 | — |

### Notable finds from the two awesome lists (worth more than several of the above)

| Repo | What it is | Licence | Verdict | Lane |
|---|---|---|---|---|
| **greensock/gsap-skills** | GSAP skill pack; **GSAP itself is now 100% free incl. every plugin** (SplitText, MorphSVG, DrawSVG, Flip) | MIT (skills) | **ADOPT** — highest-value *new craft capability*; works in Remotion via `useGSAP` | Content |
| **coreyhaines31/marketingskills** | ~50 skills: CRO, copywriting, `seo-audit`, `ai-seo`, `social`, `image`, `ad-creative`, `launch`, `pricing`, `customer-research`, `aso` | MIT | **ADOPT** — Step 5 packaging + channel growth | Ops |
| **cathrynlavery/diagram-design** | 39 editorial diagram types (Sankey, flywheel, quadrant, Wardley, funnel…) → self-contained HTML/SVG, brand-matched | MIT | **ADOPT (piece)** — as a **diagram-type reference + fast static mockup** before you code the animated Remotion version of a data beat | Content |
| **upstash/context7** | MCP: pulls current, version-correct library docs into context (`resolve-library-id`, `query-docs`) | MIT | **ADOPT** — stops stale-API hallucinations when touching Remotion / three / maplibre code. Free, optional key for higher limits | Dev |
| **wshobson/agents** | 202 agents / 183 skills / 105 commands, multi-harness | MIT | **CONDITIONAL** — alternative to `superpowers`; pick one, not both | Dev |
| **nexu-io/open-design** | Coding-agent → prototypes / decks / dashboards / images, `DESIGN.md` brand spec, HTML→PDF/PPTX | Apache-2.0 | **CONDITIONAL** — thumbnail system, pitch decks, a channel one-pager. Overkill if you only need thumbnails (§6) | Ops |
| **AgriciDaniel/claude-seo** | 25 SEO sub-skills + 18 agents; technical SEO, schema, GEO/AEO | MIT | **CONDITIONAL** — **web** SEO (a companion blog / site). Little direct YouTube value — `seo-schema` only validates `VideoObject` markup on pages embedding your videos | Ops |

---

## 3 · Content-creation stack, by pipeline stage

Mapped onto the runbook's five steps. **Bold = recommended addition.** Everything
else you already have.

| Stage | Have | Add | Why |
|---|---|---|---|
| **Step 0 — Intake / topic** | Claude, vidiq (`keyword_research`, `trend_categories`, `outliers`) | **`last30days-skill`** | Test a topic against the *live* conversation (Reddit/HN/YouTube) before committing a runtime to it. Answers the runbook's "novelty ✅ · timing ✅ · demand ✅" gate with data. |
| **Step 1 — Script + research** | `humanizer`, `explainer-video`, Claude WebSearch/WebFetch | **`Scrapling`** (primary-source scraping), **`superpowers/brainstorming` + `writing-plans`**, **the humanize write-hook (§4)** | Scrapling for filings / archives / JS-heavy sources WebFetch can't reach. The hook makes "run humanizer on every script" (runbook §18) automatic instead of a thing you remember. |
| **Step 2 — Reconcile** | `whisper.cpp`, `reconcile-*.mjs` | — | Solid. No change. |
| **Step 3 — Build + render** | Remotion engine, ~20 motion skills, `nif-house-style`, occupancy scripts | **`gsap-skills`** (SplitText / MorphSVG / DrawSVG), **`diagram-design`** (mockups), **`context7`** (correct APIs), **`claude-video-vision`** (frame-level QC) | GSAP's SplitText + DrawSVG are a real upgrade to kinetic type + draw-on beats. diagram-design gives you 39 named diagram layouts to pick from for the ~18 data beats. claude-video-vision replaces manual `ffmpeg → PIL` frame checks with Claude actually looking. |
| **Step 4 — Resolve + audio** | davinci-resolve MCP, FFmpeg master scripts | — (see §5 for SFX/music sourcing, unchanged from runbook §20) | Solid. |
| **Step 5 — Package + ship** | vidiq (`score_title`, `score_thumbnail`, `generate_titles`), runbook §13 | **`marketingskills`** (`copywriting`, `image`, `social`, `customer-research`) | vidiq scores; marketingskills *drafts* the candidates and the pinned-comment / community-tab / cross-post copy. |
| **QC gate (§15.4)** | occupancy law, manual watch-through | **`claude-video-vision`** + **Binoculars** (script AI-tell test, §4) | Two automated eyes: one on the picture, one on the words. |

### The three that matter most

1. **`claude-video-vision`** — the runbook has a rigorous *numeric* gate
   (occupancy) but the "watch the whole thing, catch overlaps / mistimed
   captions / clipped text" pass is still manual and ad-hoc. This makes it a
   command: `/watch-video out/review/NIF00X-FULL.mp4 "check every caption is
   on-screen while its line is spoken, flag any text overlap or element
   collision"`. Local whisper = free, offline, no new dependency.

2. **`gsap-skills`** — GSAP going fully free (all plugins) in 2025 is the single
   biggest free-craft change in the ecosystem. `SplitText` (per-char/word/line
   with masking), `MorphSVG` (shape-to-shape), `DrawSVG` (true draw-on with a
   tip position for the marker-hand). All usable in Remotion. This is worth an
   afternoon of integrating on Episode 3.

3. **`last30days-skill`** — the runbook derives runtime from "the topic's actual
   narrative capacity" and demands a novelty/timing check. Right now that's
   Claude's judgement. This grounds it: run `/last30days "<topic>"` at intake,
   see what's actually being discussed, how much, and where.

---

## 4 · Script humanizing + the automated test gate

The runbook (§18) already says *"run humanizer on every script pass"*. Right now
that's a manual skill invocation. You asked for **a test**. Here is the full
loop — three layers, cheapest first.

### Layer 1 — write-order discipline (free, no tools)

From the M&M pipeline research (already in memory): **the human writes the messy
draft first, AI polishes second. Never one-shot a script.** One-shot AI prose is
what every detector and every viewer's ear catches. This is a rule, not a tool.

### Layer 2 — the humanize write-hook (automated, blocks on save)

From **`fcakyon/claude-codex-settings`** (`hooks/humanize.py`). It's a
`PostToolUse` hook on `Write`/`Edit` that scans for AI tells — the "not X, but
Y" construction, buzzword pile-ups, "it's worth noting", em-dash overuse,
too-symmetrical structure — and **surfaces them before the file is saved**. The
`humanizer` skill you have is the fix; this hook is the *trigger* so you never
forget to run it.

Setup (I can wire this for you — it edits `settings.json`):

```jsonc
// .claude/settings.json  →  hooks.PostToolUse
{
  "matcher": "Write|Edit",
  "hooks": [{
    "type": "command",
    "command": "python \"D:\\YT\\Nothing Is Free\\.claude\\hooks\\humanize.py\"",
    // fires only on episode script files
    "condition": "$CLAUDE_FILE_PATH == *'/01_script/'*"
  }]
}
```

Scope it to `**/01_script/**` so it only nags on scripts, not on `.tsx` beats.

### Layer 3 — Binoculars, the actual detector (self-hosted, free, CPU)

**`ahans30/Binoculars`** (ICML 2024) / the one-command Docker wrapper
**`DonnieCourtney/binoculars-detector`** — zero-shot AI-text detection by
comparing perplexity between two small local models. No training data, no API,
no per-check cost. Runs on CPU, web UI at `localhost:8111`.

Workflow:

```
1. Draft script (human-first) → polish with `humanizer` skill
2. Paste each beat's PLAIN narration into Binoculars
3. Anything flagged "likely AI" → rewrite that beat, re-check
4. Gate: no beat over the detector's threshold before it goes to Step 2 (record)
```

This is the "testing" you asked for — a number per beat, same spirit as the
occupancy law being a number not a vibe. Add it to the **Step 1 gate** in
runbook §15.2.

> Note on detectors generally: they are noisy and biased against non-native and
> plain/technical English. Use Binoculars as a *smoke alarm* — a flag means
> "read this beat aloud and see if it sounds like a person", not an automatic
> fail. The read-aloud test in §9.2 stays the final authority.

### What you do NOT need

Paid detectors (GPTZero, Originality.ai, Winston). No measurable benefit over
Binoculars + the humanizer skill + reading it aloud, and they're a recurring
cost against the "$0 pipeline" principle.

---

## 5 · Image & video generation — free and licence-clean

**Read the runbook first.** `identity.json` already encodes the policy:
`generatedImagesAllowed: true` but **`subj` + `fg` planes are code-only**,
`maxShotsWithGeneratedAssets: 0.40`, disclosure required. NIF002 shipped 100%
code. So this whole section is for **rare BG/MID establishing plates**, and more
for **Mass & Method / the audit channel** than for NIF core.

The runbook §18 licence table already vets **Wan 2.2** (Apache-2.0, weights
included) and flags **Veo/Imagen** as a paid exception. Additions below.

### Images — the free path (replaces the "Nano Banana API needs GCP billing" blocker)

| Option | Licence | Cost | Use when |
|---|---|---|---|
| **FLUX.1 [schnell]** (local, via ComfyUI / diffusers) | **Apache-2.0** (model + weights) | Free, your GPU | The default. Cleanest licence in open image gen. 1–4 steps, fast. |
| **Z-Image-Turbo** (local) | **Apache-2.0** | Free, your GPU | Newer, competitive quality at Turbo speed, same clean licence. |
| **Cloudflare Workers AI** (cloud) | model = FLUX schnell (Apache-2.0) | **Free daily allowance**, needs a free CF account, no card | No local GPU / quick one-off plate. Hosts FLUX schnell + SDXL. This is the free *cloud* image API that actually exists in 2026. |
| Stable Diffusion 3.5 | Stability Community Licence | Free **under $1M/yr revenue** | Mature tooling / ControlNet. Revenue-gated licence — fine now, note it. |
| Nano Banana / Nano Banana Pro (Gemini) | Google terms | Free only via the **Gemini app / Flow subscription** pool, *not* the API free tier | Already how you'd do it manually. API path still needs billing. |
| **Pollinations.ai** | MIT platform | ⚠️ moved to a "Pollen" credit model in 2026 — no longer truly key-free | Deprioritised. Was the easy pick, isn't anymore. |

### Video — additional Apache-2.0 options alongside Wan 2.2

| Model | Licence | Note |
|---|---|---|
| **Wan 2.2** | **Apache-2.0 incl. weights** | Runbook's existing pick. Keep as default. |
| **LTX-2 / LTX-Video** | **Apache-2.0**, free under $10M ARR, licensed training data | Cleanest *story* (training-data provenance matters for a channel whose defence is originality). Only open model with **native synced audio**. |
| **HunyuanVideo 1.5** | **Apache-2.0** | Strong photoreal / motion. Heavier. |
| **Mochi 1** | Apache-2.0 | Runs ~20GB FP8. |
| **CogVideoX-2B** | Apache-2.0 (the 2B; 5B has a custom licence — check) | Lightest, runs on consumer cards. Entry point. |

**Verdict:** add **FLUX.1 schnell** (local) + **Cloudflare Workers AI** (cloud)
as the vetted free *image* options, and **LTX-2** + **HunyuanVideo 1.5** as
Apache-2.0 *video* options next to Wan 2.2. All still bound by the Plane Rule —
BG/MID only, disclosed, never the subject, never as evidence.

### The connected Creative MCP

`creative_generate_image` / `_video` / `_speech` are already available. Before
using **any** of its output in a published, monetized episode: confirm the
output licence and whether generation is metered/paid. Until that's confirmed in
writing, treat it as "not vetted" under §18 — fine for internal mockups, not for
a frame that ships.

### SFX / music — unchanged from runbook §20

Freesound (CC0 / CC-BY only, log each), Pixabay Music / YouTube Audio Library.
No tool change needed. `myinstants-mcp` exists (meme soundboard) — not for this
channel's register.

---

## 6 · Front-end / UI / design — what "the component libraries" are for

You mentioned HyperUI-type kits and shadcn-style component libraries. Here is
where each is and isn't useful, because the runbook (**§14.2, the code-template
trap**) specifically warns that reusable component libraries make episode 5 look
like episode 4.

### For NIF **beat visuals** → mostly no

The house style is deliberately bespoke. A generic component library pulls it
toward the "generic explainer look" `nif-house-style` exists to prevent. The one
exception: **`Remocn`** (MIT, a Remotion-native shadcn-style registry) — *copy
individual pieces* into the engine, never add it as a dependency. Already noted
in the production-stack audit.

### For **thumbnails** → yes

A thumbnail is 3840×2160, built once per episode, and *should* be visually
consistent channel-to-channel (unlike beats). Build them as a Remotion `<Still>`
composition or an HTML page rendered via Playwright. Useful here:
- **Magic UI** (MIT) — animated/gradient text, borders, backgrounds; pairs with the Remotion React stack you already run
- **shadcn/ui** (MIT) — clean primitives, copy-paste, you own the code
- **`nextlevelbuilder/ui-ux-pro-max-skill`** — for the *type + colour + layout* decisions (192 palettes, 74 font pairs)

### For a **channel website / the "audit" business channel** → yes, this is the stack

- **shadcn/ui** (MIT) + **Tailwind** — the base
- **HyperUI** (hyperui.dev, MIT) — free Tailwind marketing/page blocks ("hyper cream"?)
- **Magic UI** / **Motion Primitives** (both MIT) — animated sections
- **`nexu-io/open-design`** (Apache-2.0) — agent builds the whole prototype + exports
- **`Leonxlnx/taste-skill`** (MIT) — anti-slop pass on the result
- **`nextlevelbuilder/ui-ux-pro-max-skill`** (MIT) — the design-system spec up front

All MIT/Apache, all free, all commercial-safe.

### Verdict

- **Now:** nothing. NIF core doesn't need it.
- **When you build the first thumbnail system:** Magic UI + shadcn/ui, cherry-picked.
- **When the audit channel or a site starts:** the full stack above, with `ui-ux-pro-max-skill` driving the spec.

---

## 7 · Marketing, SEO & packaging

| Job | Tool | Note |
|---|---|---|
| Titles / thumbnail text / descriptions | **vidiq** (have) + **`marketingskills`** (`copywriting`, `image`) | vidiq scores & suggests; marketingskills drafts. Runbook §13. |
| Title/thumbnail A/B scoring | **vidiq** (`score_title`, `score_thumbnail`, `refine_thumbnail`) | Already there. Runbook §13.3 — target 90+, never fabricate a score. |
| Audience / competitive research | **`last30days-skill`** + vidiq (`outliers`, `similar_channels`, `list_competitors`) | |
| Community tab / pinned comment / cross-post copy | **`marketingskills`** (`social`, `community-marketing`) | |
| Channel description, about, playlists | **`marketingskills`** (`content-strategy`, `aso` = app-store-optimization, adapts to YouTube search) | |
| A companion blog / site SEO | **`AgriciDaniel/claude-seo`** | Only if a site exists. Not YouTube-native. |
| PR / outreach if an episode breaks out | **`marketingskills`** (`public-relations`, `influencer-marketing`) | |

**Do not** install `claude-seo` expecting it to do YouTube SEO — it's web SEO.
YouTube discoverability = vidiq + the runbook's title/thumbnail/chapter
discipline + `marketingskills` copy.

---

## 8 · Automation & ops — running more of this hands-off

You want maximum automation, manpower only for approval. Here's the honest map.

### Already possible today

| Want | How |
|---|---|
| Scheduled recurring tasks (e.g. "every Monday, run `/last30days` on the 3 pillars and file a topic brief") | **`scheduled-tasks`** MCP / the `schedule` skill (cloud cron) |
| A polling loop ("check the render every 10 min, ping me when done") | the `loop` skill |
| Multi-file planning that survives a session crash | `superpowers/writing-plans` or the built-in Plan agent |
| Batch renders overnight | `scripts/render-v4.mjs` (have) + `run_in_background` |
| Auto-block risky git actions | **`claude-codex-settings`** hooks: `block_force_push.py`, `git_commit_confirm.py`, `gh_pr_create_confirm.py` |
| Cut token spend on long sessions | **caveman** (have) or **rtk** — pick one |

### The approval gates (where manpower stays)

The runbook's pipeline is *already* built as gated automation — five steps, each
"stops and waits". Keep the human at exactly these points:

1. **Step 0 → 1:** topic choice (pick 1 of 4)
2. **Step 1 → 2:** script sign-off + **record the VO** (the one irreducibly manual step, runbook §17.4)
3. **Step 3 checkpoint:** watch the first 5 beats, go / no-go
4. **Step 5:** final watch-through + publish confirm

Everything between those is scriptable. The additions in this doc
(`claude-video-vision`, the humanize hook, `last30days`, Binoculars) each remove
a manual *check*, not a manual *decision* — which is the right thing to automate.

### What NOT to automate

- Publishing (stays a human confirm — irreversible, outward-facing)
- The VO recording (it's the channel's authenticity anchor — runbook §14.1)
- Topic selection (editorial judgement is the moat)

### Power Platform (`microsoft/power-platform-skills`)

Skipped. Real Power Automate needs premium-connector licences; Dataverse needs a
plan. Your ops surface (Claude + cron + Node scripts + the vidiq/Resolve MCPs)
is already more capable here and costs $0.

---

## 9 · Memory & context — do not add a second system

Four repos in the handover are memory systems: **claude-mem** (#1),
**hivemind** (#18), plus `mem0` and `claude-smart` from the awesome list. You
already have a **working, actively-maintained native memory** (12 files + index,
rich project history).

| System | What it'd add | Verdict |
|---|---|---|
| **claude-mem** | Auto-capture every session to SQLite+Chroma, hook-driven, worker service | **SKIP** — parallel heavyweight system, 30-day hosted trial then falls back to your plan. Your hand-curated memory is higher-signal than auto-captured logs. |
| **hivemind** | Team knowledge sharing, needs Deeplake account | **SKIP** — solo operation |
| **mem0** | Universal memory layer / API | **SKIP** — same reason |
| **`claude-smart`** (ReflexioAI) | Turns *corrections* into local rules, fully offline, ONNX embeddings | **CONDITIONAL** — the *only* one that does a distinct job (correction→rule vs. fact storage). Try it **only** if you notice yourself re-correcting the same mistakes and the memory `feedback` entries aren't preventing them. |

The native memory + `feedback`-type entries already cover "guidance on how you
should work". Adding a second store means two places to look and drift between.

---

## 10 · Conflicts & dedupe

Nothing is currently installed that needs *removing* — the conflicts are all
"don't add X because you have Y":

| Don't add | Because you have | 
|---|---|
| claude-mem / hivemind / mem0 | native file memory (§9) |
| A 2nd token-compressor (rtk **and** caveman) | caveman MCP — pick one |
| HeyGen HyperFrames as a video **engine** | the Remotion `video-os` engine — runbook rule: one engine (mine HyperFrames for ideas only) |
| `taste-skill` for **video** | `nif-house-style` does exactly this for beats |
| Full `alirezarezvani/claude-skills` (388) / full `scientific-agent-skills` (163) / `wshobson/agents` (202) | ~20 focused skills already installed + `superpowers` piece — cherry-pick, don't bulk-install |
| `academic-research-skills` | **licence fail** (CC BY-NC) — use `last30days` + `Scrapling` + WebSearch |
| A generic component library in beats | bespoke-by-design house style (runbook §14.2) |

**One real drift to fix while you're in the files** (not from this handover, but
noticed): `identity.json` still says `bloom.engine: "@remotion/skia"` and
`motion.maxEventIntervalSeconds: 3.5`, but `CLAUDE.md` / runbook §19 say Skia was
removed (radial-gradient instead) and cadence is now ≤3.0s. Sync `identity.json`
to match. Minor, separate task.

---

## 11 · Runbook change

Append the following as **§21** to `Nothing Is Free — Master Runbook v1.0.md`,
per its own §16 (Type C — architectural: touches tooling policy + the Step 1 and
Step 3/5 gates). **This has been drafted and added** — text below for reference.

> ### 21 · Tooling additions — the 2026-09-06 evaluation
>
> Type C. Extends §18's licence rule and toolkit list; adds two automated QC
> checks to the §15 gates. Full evaluation of all 24 candidates:
> `TOOLKIT.md` (repo root).
>
> **Added to the standing toolkit** (all MIT/Apache, free at this scale,
> commercial use included):
>
> | Tool | Licence | Pipeline slot |
> |---|---|---|
> | `mvanhorn/last30days-skill` | MIT | Step 0 — topic sensing against the live conversation |
> | `jordanrendric/claude-video-vision` | MIT | Step 3 visual gate + Step 5 watch-through (LOCAL whisper only) |
> | `greensock/gsap-skills` + GSAP (now 100% free incl. all plugins) | MIT / no-charge | Step 3 — SplitText, MorphSVG, DrawSVG inside Remotion |
> | `coreyhaines31/marketingskills` | MIT | Step 5 — packaging + growth copy |
> | `D4Vinci/Scrapling` | BSD-3-Clause | Step 1 — primary-source scraping (respect robots.txt / ToS) |
> | `cathrynlavery/diagram-design` | MIT | Step 3 — diagram-type reference + static mockups for data beats |
> | `upstash/context7` | MIT | Dev — current library docs, anti-hallucination |
> | `addyosmani/agent-skills` (review/simplify/debug/security pieces) | MIT | Dev — codebase quality |
> | `obra/superpowers` (brainstorming / writing-plans / systematic-debugging) | MIT | Step 1 planning + render debugging |
> | `fcakyon/claude-codex-settings` (humanize + git-confirm hooks only) | Apache-2.0 | Step 1 gate + Dev safety |
>
> **Image/video licence table — additions to §18:**
>
> | Tool | Licence | Verdict |
> |---|---|---|
> | FLUX.1 [schnell] | Apache-2.0 (incl. weights) | ✅ default free image model, local; Plane Rule still applies |
> | Cloudflare Workers AI (hosting FLUX schnell / SDXL) | model-Apache; free daily tier | ✅ the free *cloud* image path; replaces the Nano-Banana-API billing blocker |
> | Z-Image-Turbo | Apache-2.0 | ✅ alt free image model |
> | Stable Diffusion 3.5 | Stability Community Licence | ⚠️ free only under $1M/yr revenue — revenue-gated, note it |
> | LTX-2 / LTX-Video | Apache-2.0 (free < $10M ARR) | ✅ Apache video option; only open model with native synced audio |
> | HunyuanVideo 1.5 | Apache-2.0 | ✅ Apache video option |
> | Mochi 1 / CogVideoX-2B | Apache-2.0 | ✅ lighter local video options |
> | Connected "Creative" MCP output | unverified | ⚠️ not vetted — internal mockups only until licence + metering confirmed in writing |
>
> **Two new §15 gate checks:**
>
> - **§15.2 (Script):** each beat's PLAIN narration passes a local AI-text
>   detector (Binoculars, self-hosted, free) below its threshold — a smoke
>   alarm, not an override of the §9.2 read-aloud test. Human-first drafting
>   order (messy human draft → AI polish, never one-shot) is now a written rule.
> - **§15.4 (Visual):** a `claude-video-vision` watch-through of the assembled
>   cut, checking caption-on-screen-while-spoken, element collisions, clipped
>   text — before the picture is called locked.
>
> **Rejected:** `academic-research-skills` (CC BY-NC — non-commercial, fails the
> §18 rule); a second memory system (claude-mem / hivemind / mem0 — native
> memory stands); HyperFrames as an engine (one engine rule); Power Platform
> skills (needs paid licences); bulk skill packs (cherry-pick).

---

## 12 · Sources

Repo pages for all 24 candidates (GitHub, fetched 2026-09-06) ·
[FLUX/open image models 2026 (BentoML)](https://www.bentoml.com/blog/a-guide-to-open-source-image-generation-models) ·
[open video models 2026 (Thunder Compute)](https://www.thundercompute.com/blog/best-open-source-ai-video-generation-models) ·
[LTX open-video landscape](https://ltx.io/blog/open-source-video-generation-models-guide) ·
[free image APIs reality check (Runflow)](https://www.runflow.io/blog/free-ai-image-generation-api-lies) ·
[Cloudflare Workers AI free image gen](https://bagrounds.org/ai-blog/2026-03-20-cloudflare-free-image-generation) ·
[Binoculars (ICML 2024)](https://github.com/ahans30/Binoculars) ·
[binoculars-detector (self-host)](https://github.com/DonnieCourtney/binoculars-detector) ·
[GSAP now free incl. plugins](https://gsap.com/) ·
[Magic UI](https://github.com/magicuidesign/magicui) · [Motion Primitives](https://github.com/ibelick/motion-primitives) ·
existing memory: `production-stack-audit`, `mm-pipeline-research`, `nif-house-style-skill`, `runbook-v2`.
