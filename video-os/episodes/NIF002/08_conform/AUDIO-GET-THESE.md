# NIF002 — audio: the 16 files to grab (≈15 min)

> **✅ DONE 2026-09-04** — all 16 files are in `public/audio/nif002/{sfx,music}/`,
> `ALL_SFX`/`MUSIC` flags flipped in `audio.tsx`. The audio-baked master renders
> via `node scripts/master-v4.mjs`. Kept below for reference / re-sourcing.


I've wired everything downstream. You just need to put **16 audio files** in
`engine/remotion/public/audio/nif002/` with the **exact names** below, then flip
one flag and re-render. Nothing else.

Two sources, both free, both no-attribution, no code:
- **YouTube Audio Library** (studio.youtube.com → Audio Library) — you asked for this. Sound Effects tab = 100% free, no attribution ever.
- **Pixabay** (pixabay.com/sound-effects/ and /music/) — no login, cleaner search, also no attribution. Use whichever is faster per item.

Pick the **shortest, driest, most neutral** take every time. This is a documentary — nothing cartoonish, nothing with a musical tail.

---

## Music — 1 file → `public/audio/nif002/music/bed.mp3`

One continuous ambient bed for the whole 17 min. Search either library:
- YT Audio Library → **Music** tab → filter **Genre: Ambient**, **Mood: Dark** (or Dramatic), **Duration: > 3:00**, **Attribution: not required**
- Pixabay → **Music** → search `dark ambient documentary` or `tension underscore`

**Want:** 60–90 BPM, minor/unresolved, felt-piano or warm pad + a low pulse, **no melody or vocal that competes with speech**. If it loops cleanly that's enough — it doesn't need to be 17 min long.

Safe picks if you don't want to hunt: YT Audio Library — *"Ether"* (Silent Partner), *"Weightless"*, *"Ripple"*, anything by **Kevin MacLeod** tagged *dark/ambient* (his need attribution — only if nothing attribution-free fits). Pixabay — search `Documentary` in Music, sort by nothing, grab a flat one.

---

## Sound effects — 15 files → `public/audio/nif002/sfx/<name>.mp3`

| save as | what it is | search terms (YT AL "Sound Effects" or Pixabay) | used for |
|---|---|---|---|
| `tap.mp3` | soft UI tap, dry, <0.15s | `ui tap`, `button click`, `menu select` | phone taps, buttons (~20×) |
| `whoosh.mp3` | short air move, <0.4s, no tail | `whoosh short`, `swoosh`, `transition whoosh` | sends, bar fills, transitions (~15×) |
| `thunk.mp3` | a card/object lands, soft, <0.3s | `thud`, `book drop`, `soft impact` | cards landing (~15×) |
| `plip.mp3` | tiny data blip, <0.1s | `blip`, `pop`, `bubble pop`, `water drop` | packets, chips, dots (~12× + clusters) |
| `tick.mp3` | one clock tick (loopable) | `clock tick`, `stopwatch` | clock/timer beds (B01, B03, B07, B18) |
| `coin.mp3` | a single metallic coin, light | `coin drop`, `coins single` | money slices (~6×) |
| `stamp.mp3` | hard paper stamp / gavel | `stamp`, `rubber stamp`, `gavel` | rulings, MONOPOLY, "first order" (~8×) |
| `drone.mp3` | sustained low tension, 3–6s | `dark drone`, `tension drone`, `ominous low` | B06/B07/B14/B17 tension, B25 black |
| `chime-warm.mp3` | soft positive, gentle | `soft chime`, `positive`, `gentle bell` | B09 "better for you", B03 |
| `chime-bright.mp3` | bright confident ping | `success`, `achievement`, `bright chime` | SUBSCRIBE, B22 Apple window |
| `boom.mp3` | cinematic sub-hit, <1s, controlled | `cinematic boom`, `trailer hit`, `impact sub` | the reversal hits — YOU / INVENTORY / NOTHING (~10×) |
| `glitch.mp3` | short digital stutter | `glitch`, `digital error`, `data glitch` | B26 phone stutter |
| `lock.mp3` | a padlock clicking shut | `padlock`, `lock click` | B19 losers lock, B21 walls |
| `switch.mp3` | a toggle / light switch flick | `light switch`, `toggle`, `switch click` | B22 & B26 ATT toggle |
| `footsteps.mp3` | 2–4 steps on hard floor (loopable) | `footsteps concrete`, `walking hard floor` | B10 Lucky walks the beat |

That's it. `.mp3` or `.wav` both fine — if `.wav`, change the extension in
`src/nif002/v4/audio.tsx` `EXT`.

---

## Then (30 seconds)

1. Files in place under `public/audio/nif002/{music,sfx}/`.
2. Open `engine/remotion/src/nif002/v4/audio.tsx` and edit the OPT-IN block:
   - `ALL_SFX = true` if you added all 15 — or list what you added in
     `HAVE = ["tap","boom",...]`
   - `MUSIC = true` if `music/bed.mp3` is in
   - `EXT = ".wav"` if you downloaded WAVs
3. Re-render the full episode: `node scripts/render-v4.mjs` then
   `node scripts/master-v4.mjs` (or `--prores` for the master).
   The SFX + bed only render on the **full `EpisodeV4`** / `master-v4` — per-beat
   renders stay silent-of-SFX by design.

Levels, ducking and the B25/B27 music swells are already coded in `audio.tsx`
against the cue sheet in `audio-plan.md`. Ducking under the VO is a fixed −6 dB
here (bundled ffmpeg can't sidechain); for a hand-mixed duck, do it in DaVinci or
feed a pre-mixed bed back as `master-v4.mjs --music`.
