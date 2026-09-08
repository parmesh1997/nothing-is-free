# NIF003 — SFX cues (per beat)

> **STATUS 2026-09-06:** these cues are now **wired into the beat comps in code**
> (`engine/remotion/src/nif003/v4/audio.tsx` → `NIF003_SFX`, rendered by
> `<BeatSfx>` inside every `NIF003-B##v4`). So `render-beats-nif003.mjs` output
> **already carries the SFX** — nothing to place by hand in Resolve. The
> `NIF003-SFX` composition is still there as a standalone SFX-only `.wav` stem
> if you want SFX on their own Fairlight track instead. **Music was removed**
> from the render (creator: too loud → add it in Resolve). This doc is now the
> human-readable mirror of `NIF003_SFX`; edit the code to change a cue.

From 2026-09-06 (§22.7): SFX are specified **per beat**, tied to what happens
on screen — mostly element **entrances** in the progressive build, plus the
landings (a company paid, a stamp, the reversal). Quiet, dry, documentary
(same 16-file set as NIF002: `public/audio/nif003/sfx/`).

Times are **local to the beat** (frame @ 30 fps, and mm:ss). To place on a
Fairlight track in Resolve, add the beat's episode start (see
`NIF003-text-timing.md` header for each beat's absolute start).

Populated per beat as each beat's visual is locked. **B01 done.**

| slug | file | used for |
|---|---|---|
| whoosh | `sfx/whoosh.mp3` | furniture / prop slides in |
| thunk | `sfx/thunk.mp3` | a card / object lands on a surface |
| switch | `sfx/switch.mp3` | the TV clicks on, a toggle |
| plip | `sfx/plip.mp3` | a small mark / icon pops in |
| coin | `sfx/coin.mp3` | a payment lands on a company |
| tap | `sfx/tap.mp3` | a soft UI / person move |
| chime-bright | `sfx/chime-bright.mp3` | a positive landing (full chain complete) |
| boom | `sfx/boom.mp3` | a hard emphasis hit |
| tick | `sfx/tick.mp3` | a clock tick / a person leaving |
| switch | `sfx/switch.mp3` | the remote clicks / the TV lights |

---

## B00 · cold open (starts 0:00.0)

| Local frame | mm:ss | slug | what it marks |
|---|---|---|---|
| 2 | 0:00.1 | whoosh | the credenza slides in |
| 16–18 | 0:00.5 | tap ×2 | the clock, then Lucky, settle |
| 111 | 0:03.7 | switch | she clicks the remote — the TV screen lights |
| 199 | 0:06.6 | coin ×4 (~5f apart) | four payments fire out of the screen |
| 205 | 0:06.8 | boom (soft) | the startle hit — Lucky jolts, the "!" pops |
| 213, 218, 223, 228 | 0:07.1+ | plip ×4 | each company mark stamps in at the top |

---

## B01 · "the chain of payments you never see" (starts 0:10.4)

| Local frame | mm:ss | slug | what it marks |
|---|---|---|---|
| 6 | 0:00.2 | whoosh | the grey credenza slides up into frame |
| 26 | 0:00.9 | tap | the wall clock + picture settle in |
| 58 | 0:01.9 | thunk + switch | the TV is set down, then the screen clicks on |
| 108 | 0:03.6 | tap | Lucky settles onto the floor cushion |
| 230 | 0:07.7 | thunk | the bill drops onto the credenza |
| 305 | 0:10.2 | plip | NETWORK mark pops in |
| 326 | 0:10.9 | coin | NETWORK paid (money lands, mark flips orange) |
| 359 | 0:12.0 | plip | STATION mark pops in |
| 384 | 0:12.8 | coin | STATION paid |
| 439 | 0:14.6 | plip | RATINGS mark pops in |
| 487 | 0:16.2 | coin | RATINGS paid |
| 540 | 0:18.0 | plip | ADVERTISER mark pops in |
| 578 | 0:19.3 | coin | ADVERTISER paid |
| 706 | 0:23.5 | chime-bright | the whole chain glows once ("link by link") |
| 936, 948, 960, 972 | 0:31.2+ | plip ×4 (soft, rising) | the bill ticks up ("keeps climbing") |
| 979, 997, 1015, 1033 | 0:32.6+ | tick ×4 | each viewer walks out of frame ("millions quit") |

---

## B03–B08 (SFX, local frames)

**B03** (1:37.5): antenna rises f108 → whoosh · waves start f255 → soft rising tone (or plip loop) · FREE TO RECEIVE stamp f244 → stamp · network chips f460,474,488 → tap ×3 · the "?" lands f826 → boom (soft).
**B04** (2:17.2): BEFORE-1992 arrow f131 → whoosh · "$0" f492 → thunk · CABLE ACT stamp f623 → stamp (hard) · fork splits f822 → whoosh · MUST CARRY f884 / RETRANS f1101 → plip each · ALMOST EVERY STATION f1554 → stamp.
**B05** (3:13.1): each bar f107/227/307/387/401/441 → plip (rising pitch) · $15.3B hero f441 → boom · rate card f989 → thunk · +7% badge f1307 → plip.
**B06** (4:00.1): each bill row f40/263/1373 → thunk · BROADCAST TV FEE highlight f263 → plip · $48 flash f597 → boom (soft) · NOT-A-TAX stamp f750 → stamp · total row → coin.
**B07** (4:57.1): screen cuts to black f382 → glitch + drone (low, sustained ~3s) · switch throws f382 → switch · NEGOTIATING TACTIC stamp f984 → stamp.
**B08** (5:30.8): SEP 2023 calendar f124 → tap · lightning divider f204 → glitch · each channel chip darkens f333/349/365/381 → switch ×4 · 15,000,000 counter f470 → rising plips → boom at rest · 12-day tally f796 → tick ×12 fast → boom · ESPN relights / MNF f878 → chime-bright.

---
## B09–B16 (SFX, local frames)
**B09** (5:45.5): SEP-2024 stamp f137→stamp · dish f160→plip · DISNEY/DIRECTV chips f223/256→whoosh ×2 · lightning f283→glitch · 11M counter f407→rising plips→boom · 3 event chips f570/588/606→plip, grey-out→switch · 13-tally f901→tick×13→boom · $20 credit f1082→chime-warm (weak/anticlimactic).
**B10** (6:50.4): OCT-2025 stamp f131→stamp · chips f203/230→whoosh · 20 chip grid f387+→switch (fast stutter) · $4.3M/day f723→rising plips loop · pattern reveal f1058→whoosh + 3× thunk (calendars land) · schedule stamp f1649→stamp.
**B11** (7:46.3): cable card f10→thunk · CANCELLED stamp f175→glitch · arrow/app f235→whoosh · folded row f650→plip · RSN FEE f800→thunk · close stamp f1258→stamp.
**B12** (8:29.0): SUBSCRIBE card f8→chime-bright · chain motif slides f471→whoosh.
**B13** (8:48.4): bar frame f6→thunk · SPORTS fill f571→rising tone · comedy/drama/news grey-out f794/827/886→plip ×3 (dry) · 60–90% f581→boom.
**B14** (9:20.9): ESPN chip f125→thunk · $9.50 count f286→rising plips→boom · FS1 chip f756→plip (small) · 7× stamp f776→stamp · billed stamp f889→stamp.
**B15** (9:58.7): $7.5B f247→rising plips→BOOM + Bloom · grey icon row f446→(silent, or one soft tap).
**B16** (10:28.3): checklist f8→thunk · cursor to Sports Tier f200→tap · locked shake f200→switch (denied buzz) · à-la-carte bubble f465→plip · bubble burst f505→glitch · baked-in stamp f776→stamp.

---
## B17–B32 (SFX, local frames)
**B17** (11:13.7): blocks stack f40+ →plip ×9 (rising) · $9.6B f870 →thunk · $140M stamp f1426 →glitch · collapse f1360 →BOOM + a long crumble (drone/rumble ~2s) · outrun stamp f1763 →stamp.
**B18** (12:15.7): grid builds f30+ →tap (soft, sparse) · SAMPLE lights f142 →chime-bright · formula parts f519/695 →plip ×2 · "=" reveal →boom (soft).
**B19** (12:45.7): invoice 1 f156 →thunk · invoice 2 f488 →thunk · sold stamp f795 →stamp · "only see the first" f1115 →boom (soft).
**B20** (13:24.5): grid f10+ →tap · 77M count f313 →rising plips · households drop f313+ →whoosh (cascading) · 50% line f572 →stamp.
**B21** (13:48.3): expect-▼ f40 →(soft) · ▲7% f311 →boom · households f569+ →plip ×4 · stamp f569 →stamp.
**B22** (14:14.2): each 🔒 badge f307/511/650 →lock ×3 · leverage stamp f1166 →stamp.
**B23** (14:54.8): card flip f182 →whoosh + thunk (lands on NEXSTAR) · 200+ f437 →boom.
**B24** (15:25.6): donut fills f206 →rising tone · $700M f616 →boom · antenna stamp f907 →stamp.
**B25** (15:56.6): ladder rungs f191+ →thunk ×3 (rising) · political rung f562 →stamp (hard) + lock · "never yours" f1483 →boom.
**B26** (16:47.0): newsroom relights f202 →switch + a warm room-tone swell · reporters f840 →chime-warm · stamp →stamp.
**B27** (17:20.7): MENU ghost f232 →(soft) · BUNDLE/BILL/TAX f290+ →thunk ×3 · room stamp f756 →stamp.
**B28** (17:48.4): each receipt row f92/427/672/929 →thunk (rising) · total row f1120 →BOOM + coin.
**B29** (18:35.2) THE REVERSAL: each chain link f690/745/797/868/922 →coin (as it flips PAID) · Dark-Law crossfade at seatAt (~f1335) →**music stops**, one low drone hit · YOU node lands →silence (no sfx — the absence is the point) · "seat at the table" typeset f1355 →a single soft tick.
**B30** (19:26.6): YOU›company›thing f283 →whoosh · auction ghost f570 →(faint, Ep2 callback tone) · tower silhouette f851 →thunk.
**B31** (19:56.3): phone in f338 →whoosh · map appears f378 →tap · pin draws f623 →plip · pin pulse loop →soft tick every ~0.4s · stamp f518 →stamp.
**B32** (20:19.8): field returns from ink f0–24 →a rising swell (music resumes) · SUBSCRIBE f125 →chime-bright · "still watching?" prompt f350 →tick · closing line f495 →one final soft coin (callback to B00's cold open).
