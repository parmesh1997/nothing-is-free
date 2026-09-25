# Someone Always Pays: the toolchain

Every step, the tool, what it costs, whether commercial use is allowed, and how Claude
runs it. **Free** means free at this channel's scale. The runbook's §18-era rule stands:
*a licence you can't name is a tool you don't use.*

Legend for "Claude runs it": **CLI** (a command in the terminal) · **MCP** (a connected
tool) · **Browser** (Claude in Chrome, Rama profile, read-only) · **API** (a script with
a key) · **You** (a creator decision point by design).

---

## 1 · By step

### Step 0 · Intake

| Job | Tool | Cost · licence | Claude runs it |
| --- | --- | --- | --- |
| Your channel's numbers and retention | YouTube Studio | Free | Browser (read-only) |
| Retention curve as data (optional, better) | YouTube Analytics API → `dip-map.mjs --csv` | Free · Google API terms | API (one-time OAuth) |
| Outliers, keywords, rising topics | vidIQ Research, For you, Keywords, Videos, Channels, Thumbnails | Your plan | Browser (never Generate, chat, Save) |
| Views per hour and outlier multiple, measured | `vph.mjs` + yt-dlp | Free · Unlicense | CLI |
| Public stats at scale (optional) | YouTube Data API v3 | Free: 10,000 units a day; a search costs 100, a video lookup 1 | API |
| Competitor transcripts, the red-herring source | yt-dlp auto-subs → `vtt-clean.mjs` | Free | CLI |
| **Saturation and first mover** | `saturation.mjs` + yt-dlp search: near-copies, channels, mystery-framed titles, recency | Free | CLI |
| The **cold-answer test** | `claude -p --model haiku "Answer in one line: <title question>"` | Your plan | CLI (fresh context on purpose) |
| The vidIQ prompt | vidIQ chat | Spends vidIQ credits | **You** |

### Step 1 · Script

| Job | Tool | Cost · licence | Claude runs it |
| --- | --- | --- | --- |
| Script, beats, `shots.json` | Claude (Opus) | Your plan | Session |
| Source documents to text | MarkItDown | Free · MIT | CLI |
| Real documents and images | Library of Congress, National Archives, Internet Archive, the museum open-access collections (§9.9) | Free · per-item rights | MCPs inside `nif-builder` |
| Humanizer pass | `humanizer` skill | Free · MIT | Skill |
| Word counts, mode ratio | Script | Free | CLI |

### Step 2 · VO

| Job | Tool | Cost · licence | Claude runs it |
| --- | --- | --- | --- |
| Narration | ElevenLabs, SAP Narrator | Your plan · commercial per the plan | CLI (`tts-nif.mjs`) |
| Word timing | whisper.cpp (`@remotion/install-whisper-cpp`) | Free · MIT | CLI, local |
| Mouth cues | Rhubarb Lip Sync 1.14 | Free · MIT | CLI |

### Step 3 · Build

| Job | Tool | Cost · licence | Claude runs it |
| --- | --- | --- | --- |
| Locations, angle kits, passes | Blender 5.2 LTS | Free · GPL (your renders are yours) | CLI, headless |
| Floor marks | `marks.py` | Ours | Inside Blender |
| Placement check | `place-check.mjs` | Ours | CLI |
| Scenes, cast, camera, type | Remotion 4 | Free for up to 3 people, commercial included | CLI + Studio |
| 3D assets and textures | Poly Haven, Kenney, Quaternius, ambientCG | Free · CC0 | CLI (download script with ledger) |
| Fonts | Google Fonts | Free · OFL | `@remotion/google-fonts` |
| Held-frame and shot-length audit | `motion-check.mjs` + ffmpeg | Free | CLI |
| Diorama orbit | The location's orbit template (`--shot orbit`) + floating labels | Ours | CLI, headless Blender |
| 3c setups | `08_conform/3c-setups.json` + one parameterised component per setup | Ours | Session |

### Step 4 · Finish

| Job | Tool | Cost · licence | Claude runs it |
| --- | --- | --- | --- |
| Timeline | `make-timeline.mjs` → OTIO | Free · Apache 2.0 format | CLI |
| Import, grade, encode | DaVinci Resolve Studio 21.1 (native MCP) | Owned | MCP inside `nif-finisher` |
| Mix and loudness | ffmpeg (`mix-final.mjs`, `loudnorm`) | Free | CLI |
| Music and sound effects | YouTube Audio Library, FMA (CC0/CC BY), Pixabay SFX, Freesound (CC0) | Free · per-track licence logged | Download + ledger |
| QC | ffprobe, ebur128 | Free | CLI |

### Step 5 · Publish and learn

| Job | Tool | Cost · licence | Claude runs it |
| --- | --- | --- | --- |
| Upload and publish | YouTube Studio | Free | **You** |
| Pre-publish check | vidIQ Optimize | Your plan | Browser (read-only) |
| Thumbnail test | Studio *Test & compare* | Free | **You** set it up |
| 48-hour and 7-day review | Studio + `dip-map.mjs` | Free | Browser / API |

---

### Later · Other languages (not now)

Once ten English cases have proven retention, the same cases could be dubbed into
another language with ElevenLabs (your plan) as a second audio track or a second
channel. Check what YouTube Studio offers for multi-language audio on your account
at that point. It's a transfer along the language axis (strategy §3.2), and it isn't
worth doing before the English format is proven.

## 2 · Automation: what can run without you

| What | How | Where it runs |
| --- | --- | --- |
| **One step per session** | The six agents in `D:\YT\.claude\agents\`, each with its own model and runbook sections | Claude Code, locally |
| **The 7-day review** | Windows Task Scheduler runs `claude -p "Run runbook §14.2 for NIF0NN"` seven days after publish | Your PC: it needs your Chrome profile, or the Analytics API key |
| **The Monday weekly check** | The same, for `nif-weekly-log.md` | Your PC |
| **Stopping long renders** | The render-guard hook (§9.5) | Claude Code hooks |
| **Trimming logs** | The log-trimmer hook (§13.6) | Claude Code hooks |

**Why not cloud routines (claude.ai):** they can't reach Blender, Resolve, your GPU or
your Chrome profile. Everything that touches the build runs locally. A cloud routine is
only useful for the Step 5 review, and only with the Analytics API set up.

---

## 3 · Optional AI shortcuts: **not recommended**, listed because you asked

Runbook §3 law 12 says no AI imagery, textures or lettering, at any size. Using any of
these means changing that law first (§13.5), and it's your decision.

| Shortcut | What it would do | Licence | Why I don't recommend it |
| --- | --- | --- | --- |
| **TripoSR** image-to-3D | Turn a reference picture of a prop into a mesh, then toon-shade and ink it | MIT (weights and code), commercial OK | The mesh is AI-made; it breaks law 12. Topology is messy for Line Art |
| **TRELLIS / TRELLIS.2** (Microsoft) image-to-3D | Better meshes than TripoSR | MIT, **but** some rendering dependencies (nvdiffrast) have non-commercial terms | The same, plus licence homework before any commercial use |
| **Hunyuan3D 2.1** (Tencent) | High-quality meshes | Community licence **excluding the EU, UK and South Korea**, and capped at 1M monthly users | Territorial licence: avoid |
| **AI images** (including the ElevenLabs connector's image tools) | Moodboards and reference only | Varies by tool | Never on screen. Fine for your own planning |

**If you ever relax law 12:** limit it to background props that are toon-shaded and
inked like everything else. Never faces, never text, never a whole location. Check
YouTube's disclosure guidance at upload. Remember that YouTube's July 2026 clarification
targets *template-based* and *low-effort* channels as a whole, so the more the channel
looks hand-made, the safer it is.

---

## 4 · What Claude can't (and shouldn't) do

- **Publish, upload, or click Save** in Studio or vidIQ: these are creator decision points (§0).
- **Spend vidIQ credits** (Generate, AI chat).
- **See your Resolve, Blender or Chrome from a cloud session.** Those run on your PC.
  (The Resolve MCP failed to connect from this cloud session for exactly that reason:
  its path is on your machine.)
