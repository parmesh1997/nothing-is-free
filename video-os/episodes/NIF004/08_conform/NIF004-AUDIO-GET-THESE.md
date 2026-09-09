# NIF004 — music: get these 5 from the YouTube Audio Library

**New for this episode:** NIF002/003 used ONE bed the whole way. NIF004 rotates
**5 tracks, one per act**, with the picture dipping to black between beats (see
`NIF004-render-guide.md`). SFX stay baked per beat; music + the dips are the
Resolve pass.

Get them at **studio.youtube.com → Audio Library → Music tab**. Search the
title; if it's gone, use the *filter fallback* line. Prefer the **"Attribution
not required"** version, download **MP3**, drop into
`episodes/NIF004/07_audio/music/` (see the README there for names).

Runtime map is the assembled concat (30 fps), before the inter-beat gaps are
added. Beat starts from `EpisodeV4.tsx`.

| # | Track (artist — title) | Act · beats · timecode | Feel / why | Filter fallback |
|---|---|---|---|---|
| 1 | **Aakash Gandhi — "Lifting Dreams"** | Act 1 · B00–B03 · 0:00–1:52 | warm felt-piano, curious, a touch wistful — "here's the honest part" | Genre *Ambient/Cinematic* · Mood *Calm/Inspirational* · piano-led, no drums, ≥3 min |
| 2 | **Aakash Gandhi — "Meridian"** | Act 2 · B04–B11 · 1:52–6:44 | flowing, unobtrusive, patient — the platform meter, the 2018 change, Uber, Overture | Genre *Ambient* · Mood *Calm* · flat, no melodic hook that fights speech |
| 3 | **Jeremy Blake — "Water Lily"** | Act 3 · B12–B19 · 6:44–10:35 | floating pad + light pulse — the map-as-an-ad, the auctions, $11B | Genre *Ambient* · Mood *Calm/Dramatic* · soft pulse ok |
| 4 | **Asher Fulero — "Sleepless"**  (alt: **"Blue Highway"**) | Act 4 · B20–B25 · 10:35–13:57 | pensive, unresolved, a shadow — the AP test, the settlements, the warrants | Genre *Ambient/Cinematic* · Mood *Dark/Dramatic* · minor key, low, no lift |
| 5 | **Asher Fulero — "Star Attractions"** | Act 5 · B26–B33 · 13:57–17:35 | builds and resolves — the moat, then THE REVERSAL, the bridge, the CTA | Genre *Cinematic* · Mood *Dramatic/Inspirational* · has a real swell, resolves warm |

**Spares** (grab 1–2 if you want options to swap by ear): Aakash Gandhi —
"Heavenly" (swap #1, or reprise it under the B33 CTA as a bookend) · Jeremy
Blake — "Marigold" (swap #3) · Dan Lebowitz — "Cast of Characters" (swap #4).

## Placement / level moves (for the Resolve music track)

- **B00 (0:00–0:16)** — near-dry. Drive ambience + SFX only. Track 1 fades **in
  low** under B01's first line ("Turning it on starts three meters running").
- **Continuous under each act**, looped, **ducked −6 dB** whenever VO is present
  (track compressor keyed off the VO bus).
- **Act seams** — 1.0 s crossfade between tracks, landing in the black gap at
  B03→B04, B11→B12, B19→B20, B25→B26, B29→B30.
- **B06 (~3:15)** small +2 dB lift on "+1,000% OVERNIGHT", back down after.
- **B12 (6:44)** duck track 3 **hard** (−12 dB) under the mid-roll ask, recover
  by B13.
- **B14 (~9:05)** +2 dB into the "$11 billion" number.
- **B23 (~11:55)** thin track 4 to almost nothing under the Sensorvault lines.
- **B30 (15:48)** — track 5 **swells +4 dB** as the field goes to ink ("You are
  the reading on the meter"). The one big musical moment.
- **B33 (17:15)** — warm **+3 dB** lift as the field returns to paper on the CTA.
- **last ~4 s (17:31→end)** — full fade to silence behind "Nothing is free."

> "Music per beat, fading at the end" (creator, 2026-09-09) is read as: rotating
> per **act**, riding continuously through the little inter-beat dips (so it
> doesn't blink 34 times), and fading out fully on the **final** beat. If you
> want it to actually fade in/out at every single beat, say so — that's a
> different, more staccato feel.
