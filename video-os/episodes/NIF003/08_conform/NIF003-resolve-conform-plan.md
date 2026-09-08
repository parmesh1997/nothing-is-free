# NIF003 — Resolve conform plan (MCP-driven import, then hand-finish)

Split of labour: **the MCP scripts the mechanical conform** (project, 33-clip
timeline, subtitle track, navigation markers). **You do the creative finish by
hand** (transitions, Text+ deep-text, music, grade, master). Runbook §22.7.

## Prereq — before restarting Claude Code

1. Launch **DaVinci Resolve Studio** (21.0.4.5). Open it to the Project Manager
   or any project — it just needs to be running for the scripting API.
2. Resolve → Preferences → System → General → **"External scripting using" = Local**.
3. Restart Claude Code in `D:\YT\Nothing Is Free` and **approve the
   `davinci-resolve` MCP server** when prompted.
4. Tell me "resolve is up" and I run the steps below.

## What the MCP session does

| # | Step | Detail |
|---|---|---|
| 1 | **Project** | Create `NIF003` (or open if it exists). Set project + timeline to **1920×1080, 30.0 fps** (exact, non-drop — matches the renders). Colour science default; grade comes later. |
| 2 | **Import** | New bin `NIF003 beats`. Import all 33 `D:\YT\Nothing Is Free\video-os\engine\remotion\out\beats\NIF003-B00.mov … B32.mov`. |
| 3 | **Timeline** | Create `NIF003_v1_conform`. Append B00→B32 **in numeric order, on V1, butt-joined, no gaps**. Each clip is full length — the timeline lands at exactly **37 230 frames = 00:20:41:00**. |
| 4 | **Check** | Assert timeline frame count == 37230 and clip count == 33; report any drift. |
| 5 | **Subtitles** | Run **Create Subtitles from Audio** (Resolve Studio, English) → a subtitle track off the baked VO. First pass only — you retype against `01_script/script.md` PLAIN. |
| 6 | **Markers** | Drop the 98 markers from `NIF003-markers.csv` on the timeline: 33 blue beat-boundary markers + 65 text-cue markers (orange PUNCH / yellow DEEP TEXT / green LABEL / pink SIGNATURE). Navigate marker-to-marker for the Text+ pass. |
| 7 | **Save** | Save the project. Hand back. |

I will **not** touch grade, Fusion/Text+, transitions, or the render — those are
yours.

## Your hand-finish, in order

1. **Transitions between beats** — your call on style (the old look was a ~1.4 s
   black push; `V4Beat` no longer bakes it). 32 cut points, all on beat
   boundaries (blue markers).
2. **Subtitles** — fix the auto-transcribe track against `01_script/script.md`
   PLAIN wording. Style per channel.
3. **Deep-text / punch** — `NIF003-deeptext-abs.md`. Each row = one Text+ clip:
   drop at the **IN** timecode, hold to **OUT**. Orange Bebas for PUNCH,
   the `free.` accent is `#E24D28`. `†` cues ride across a cut — leave them.
4. **Music bed** — `engine/remotion/public/audio/nif003/music/bed.mp3`, on its
   own track, ducked ~-6 dB under VO. **Duck it out at ~`00:19:18`** — just
   before the B29 Dark-Law ink wash (`~00:19:19:21`) — and let the "YOU" beat
   play dry; bring it back for B32.
5. **Grade + net vignette** — the `NIF_look.dctl` / corner vignette from NIF002.
6. **Master** — QuickTime, HEVC Main10, ~30 Mbps, 1920×1080, 30 fps →
   `episodes/NIF003/09_master/`.

## Files this depends on

- `out/beats/NIF003-B##.mov` × 33 — the picture (VO + SFX baked, verified)
- `NIF003-deeptext-abs.md` — the Text+ cue sheet (absolute TC)
- `NIF003-markers.csv` — timeline markers (beat + text cues)
- `NIF003-text-timing.md` — source of truth for text (mixed rel/abs)
- `01_script/script.md` PLAIN blocks — verbatim subtitle wording
- `public/audio/nif003/music/bed.mp3` — music bed (add here, not in Remotion)
