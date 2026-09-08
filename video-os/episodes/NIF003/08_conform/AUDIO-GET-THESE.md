# NIF003 — audio: already wired, using NIF002's own sourced set

> **✅ DONE 2026-09-06** — all 16 files copied straight from
> `public/audio/nif002/{sfx,music}/` into `public/audio/nif003/{sfx,music}/`.
> `ALL_SFX`/`MUSIC` are already `true` in `src/nif003/v4/audio.tsx`. Nothing
> to source before rendering. Kept below for reference / re-sourcing if you
> want a different take for a specific slug.

These 15 SFX + 1 music bed are **generic documentary one-shots, not
episode-specific** — the exact same set you already picked for NIF002 (short,
dry, neutral takes, no attribution required) works here unchanged, and reuses
across every future NIF episode too. No new listening/sourcing pass was
needed.

If you ever want to swap ONE slug for a different take (e.g. you find a
"thunk" you like better), just replace that single file at the same path —
nothing else changes:

| file | what it is | used for in NIF003 |
|---|---|---|
| `sfx/tap.mp3` | soft UI tap, dry, <0.15s | remote clicks, phone/UI taps, typewriter card (~15×) |
| `sfx/whoosh.mp3` | short air move, <0.4s | signal ripples, card flips, transitions (~17×) |
| `sfx/thunk.mp3` | a card/object lands, soft | rate cards, receipts, invoices landing (~15×) |
| `sfx/plip.mp3` | tiny data blip, <0.1s | grid cells lighting, bar-chart ticks, particles (~13×) |
| `sfx/tick.mp3` (loopable) | one clock tick | day-counters (12/13 DAYS), the closing clock prop |
| `sfx/coin.mp3` | a single metallic coin | the payment-chain token, B32's "somebody already answered" |
| `sfx/stamp.mp3` | hard paper stamp / gavel | "FREE TO RECEIVE", the Cable Act, rulings (~8×) |
| `sfx/drone.mp3` | sustained low tension, 3-6s | the reversal (B25/B29), bankruptcy, black-screen dread |
| `sfx/chime-warm.mp3` | soft positive, gentle | the $20 credit anticlimax, "real reporters" |
| `sfx/chime-bright.mp3` | bright confident ping | SUBSCRIBE, the pin lands on the map |
| `sfx/boom.mp3` | cinematic sub-hit, <1s | every reversal/emphasis hit — "$15B", "NEVER", "13 DAYS" (~20×) |
| `sfx/glitch.mp3` | short digital stutter | B07 "your screen just goes black" |
| `sfx/lock.mp3` | a padlock clicking shut | "locked, lowest rate," "no leverage to say no," "no card number" |
| `sfx/switch.mp3` | a toggle / light switch flick | the checklist's Sports Tier ✗, the Cable Act's two paths |
| `sfx/footsteps.mp3` | loopable steps | not used this episode (no walking beat in NIF003) — kept for parity, harmless unused |
| `music/bed.mp3` | one continuous ambient bed | the whole 20:41, ducked under VO |

## If you re-source anyway

Same two free, no-attribution sources as before: **YouTube Audio Library**
(studio.youtube.com → Audio Library → Sound Effects/Music tabs) or **Pixabay**
(pixabay.com/sound-effects/, /music/). Pick the shortest, driest, most
neutral take — this is a documentary, not a game.

## Re-render with audio baked in

```bash
cd engine/remotion
node scripts/render-v4.mjs                 # per-beat h264 review (unchanged, still silent — cues are episode-global)
npx remotion render src/index.ts NIF003-V4 out/NIF003_v1.mp4 --codec=h264 --enforce-audio-track --audio-codec=aac --audio-bitrate=320k
```

The full `NIF003-V4` composition is the only one that carries the SFX/music
beds (they're global-frame cues across the whole episode, same reasoning as
NIF002's own `EpisodeV4`). Per-beat renders (`NIF003-B##v4`) stay VO-only by
design — that's what every beat you've been reviewing this whole build has
sounded like.

For the DaVinci Fairlight path instead of a flat FFmpeg bake: render
`NIF003-SFX` to a `.wav` (the SFX-only stem, silent picture) and drop it on
its own Fairlight track alongside the VO-only per-beat renders, so you can
ride the mix by hand instead of the fixed dB levels baked into `audio.tsx`.
