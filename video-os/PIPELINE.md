# video-os — the production pipeline ("the orchestra")

Adapted from Mache's "layered system" (youtube BfPfDtjx1mo) to our multi-channel
stack: **Nothing Is Free** (hidden economics), **Mass & Method** (historical
engineering, not started), and a future **audit** channel.

The thesis we're adopting: **no single AI tool does everything — chain
single-domain tools, and the operator's job is to conduct, not to play faster.**
One instruction in plain English per stage, review the result, customize.

---

## The chain

| Stage | Their tool | Ours | When we use it |
|---|---|---|---|
| **1. Script + research** | — | Claude Code + the episode's `01_script` / `02_research` | every episode |
| **2. Blueprint / background still** | Nano Banana Pro, GPT Image | **Nano Banana / Nano Banana Pro** | only when a beat needs a *specific* place code can't sell (a real skyline, a lived-in room). NOT every beat. Disclose AI. |
| **3. Precision animation** | Claude Code + Remotion | **Claude Code + Remotion** (`engine/remotion/`) | every visible informational pixel — characters, captions, data, the field. 100% code. |
| **4. 3D geometry + camera** | Blender → agent | *(not used yet)* | NIF/M&M are flat. Revisit if a channel wants real dimensional scenes. |
| **5. Organic motion / material / light** | video model (Kling 2.5) | *(not used yet)* | candidate: texture/motion on a background plate behind the code layer. Test on one beat before adopting. |
| **6. Style consistency** | a **skill** | **`nif-house-style` skill** (`.claude/skills/`) + `language.ts` | every beat — invoke before writing. Per channel: `mm-house-style` when M&M starts. |
| **7. Assemble + finish** | After Effects / Premiere | FFmpeg-first; **DaVinci Resolve** for grade / mix / transitions / render only (never titles, effects, Fusion) | every episode |
| **8. Voice** | — | creator's cloned voice (VoiceStudio, EP03+), calibrated ~134 wpm | every episode |
| **9. Sound** | — | Freesound (CC0/CC-BY only) SFX · YouTube Audio Library music | per episode conditions |

Steps 1, 3, 6, 7, 8 run **every episode**. Steps 2, 5, 9 are **conditions** —
turn them on only when the episode needs them.

---

## The skill layer (step 6) is what kills "slop"

A skill is a document that teaches the agent to do something a *specific* way, and
it re-applies every time it's invoked. Without it, the agent defaults to the
generic explainer look. Ours:

- **`nif-house-style`** — palette, the two fonts, the motion language, small
  OverSimplified characters that never face camera, sparse-prop staging on cream,
  whisper-timed floating captions, anti-fatigue rules, the code-first pipeline,
  and an explicit "never" list. Location: `engine/remotion/.claude/skills/nif-house-style/`.
- Supporting (installed, generic): `motion-art-direction`, `explainer-video`,
  `kinetic-typography`, `animated-infographic`, `chart-animation`,
  `shot-composition`, `remotion-*`. These execute technique; `nif-house-style`
  sets the rules they follow.

When a new channel starts, write its own `<channel>-house-style` skill first —
before any beat.

---

## Step 2 in practice — background plates

For a beat that gets a `<BgPlate>` (rare):

1. Write the prompt from the beat's script line — subject, mood, composition,
   light direction (top-left, warm, matches `KeyHaze`), palette (cream + the
   SUPPORT colours), flat/editorial, **no text, no characters** (those are the
   code layer), 16:9.
2. Generate → edit the still (fix colour, layout, crop) → save to
   `engine/remotion/public/plates/NIF0XX/B##.png`.
3. `<V4Beat ... ><BgPlate src="plates/NIF0XX/B##.png" /> …code layer… </V4Beat>`.
4. The code layer (captions, data, Lucky) sits on top at full fidelity.

Keep a per-episode `plates/PROMPTS.md` listing which beats got a plate and the
exact prompt, so a plate is reproducible and revisable.

---

## The operator's loop per beat

1. Invoke `nif-house-style`.
2. Read the beat's script line + its whisper word timings (`timing.json`).
3. Decide: pure code, or code + a plate?
4. Write the beat — one `<V4Beat>`, staging + captions + data + a punch on the peak.
5. Render `NIF002-B##v4`, pull frames, check against the "never" list.
6. Revise numbers, not structure. Re-render.

Once a beat is right it's a template — the next episode's equivalent beat starts
from it.
