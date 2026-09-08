# DaVinci Resolve MCP — what it can and can't do (measured, Studio 21.0.4)

The FX / Effects tab has everything you'd expect — **video transitions**
(Cross Dissolve, Film Dissolve, Smooth Cut, Additive, ~30 Fusion transitions),
**audio transitions** (crossfades), **titles** (Text, Text+), **generators**
(Solid Color, gradient, noise), **OpenFX / ResolveFX** (Vignette, Film Grain,
Glow, Blur, Sharpen, Lens FX, Chromatic Aberration, …), **audio effects**
(FairlightFX: Ducker, De-Esser, Compressor, EQ, Reverb, …).

The **question is not what Resolve has — it's what the scripting API exposes.**
Most of that library is UI-only. Here's the real line:

## ✅ The MCP CAN drive (scripted, render-verified)

| Area | What |
|---|---|
| Project / DB | create, load, save, settings (resolution, `timelineFrameRate` on a fresh project) |
| Media | import to pool, build a timeline from clips (frame-exact, positioned) |
| Timeline | tracks, markers, flags, clip colour, name, start TC |
| **Grade — CDL** | slope / offset / power / saturation on an **existing** node (write-only, verify by rendered frame) |
| **Grade — LUT / DCTL** | **author + install a custom `.dctl` shader**, refresh discovery, **apply it to a node** — DCTLs render reliably. *This is the real effects route.* |
| Grade — DRX | apply a whole prebuilt `.drx` grade (node trees / windows / OFX included, as a package) |
| Grade — groups, versions | create/assign groups, add/load/snapshot grade versions |
| Super Scale | set the clip property (2× / Enhanced) |
| **AI — captions** | `create_subtitles` — auto-caption from audio (transcription) |
| AI — scene cuts | `detect_scene_cuts` |
| AI — Dolby Vision | `analyze_dolby_vision` |
| Fusion Fuses | author + install `.fuse` Lua plugins (need a Resolve restart to register) |
| Render | set format + codec (QuickTime + H265), resolution, fps, faststart, audio; add job; **start render**; job status; verify output |
| Fairlight | apply a whole saved **Fairlight preset** to the timeline; voice isolation; audio mapping reads |
| Stills | grab / import / export gallery stills + `.drx` |

## ❌ The MCP CANNOT drive on 21.0.4 (UI-only — no scripting API)

| Want | Reality |
|---|---|
| **Add a transition** (cross-dissolve etc.) | no create/clone API. Can *read* and *delete* existing ones; to add, author offline into a `.drp` and import, or do it in the UI. |
| **Add a ResolveFX / OFX node** (Vignette, Grain, Glow…) | no node-add API at all → **use a DCTL instead** (does the same job, renders, and IS scriptable) |
| **New nodes**, node reorder, Lift/Gamma/Gain wheels, curves, qualifiers, **power windows**, tracker | not exposed — CDL + DCTL + DRX only |
| **Fairlight**: clip/track volume, pan, EQ, **ducking**, automation curves, FairlightFX params | none. Only whole-preset apply. |
| **AI Audio Assistant** (auto dialogue/music/FX balance) | no scripting hook — UI button only |
| **Music leveler / auto-duck** | same — UI only |
| **Titles / generators** on a chosen track | insert methods ignore trackIndex (land on V1); workaround is nested-timeline |
| **Keyframe** a property from script | `SetKeyframe*` is write-only, no readback; effectively UI |
| Render bitrate / Main10 profile / 2-pass | `SetRenderSettings` rejects `VideoQuality`, `EncodingProfile`, `MultiPassEncode` |
| Fusion effects added via API | render as **no-ops** on 21.0.4 (measured — a known bug) |
| Playback frame rate | `timelinePlaybackFrameRate` never writes |

## So the NIF002 plan

- **Audio mix** → `scripts/mix-v4.mjs` (a real dynamic music envelope, ffmpeg) —
  OR you run the GUI AI Audio Assistant on the 4 stems (1 click).
- **The "premium" look** (warm grade + hard-corner vignette + fine grain) →
  **a single custom DCTL**, installed + applied via the MCP. Renders. Scripted.
- **Super Scale 2×** → MCP clip property.
- **HEVC Main10 / 30 Mbps / 2-pass / slower** → `scripts/hevc-master.mjs`
  (`libx265`, exact spec — Resolve's API can't set those knobs).
- **Captions** → MCP `create_subtitles` or WhisperX from the plain script.
- Transitions aren't needed — it's one clip, the beat-to-beat cream dissolves
  are baked in the render.
