# EP02 · ASSETS (Step 3 · §11)

Every figure, prop, structure and component to be drawn for Episode 2. All code, no images (§0.1 C3, §11.4). Tone model is the **flat `Fill`** from `tokens.ts` (`makeFill(base)` → `{base, dark, light, edge}`) — the runbook's "halftone tone map" (§2.6) is superseded by the creator's ASSETS LIBRARY sheet (`HALFTONE` is a deprecated stub). Halftone appears only as optional *texture* (`print/textures.tsx`), used sparingly.

Palette is the six sheet colours only: `paper #F6F2E7` · `paperShade #EDE5D6` · `ink #111` · `orange #E24D28` · `grey #6D6A63` · `tan #E3B183` (+ `cardWhite`, `grid`, `ground` support). **One orange element per frame** (§2.4); the progress rule doesn't count.

---

## A · Reused from Phase 0 — no new code

| Asset | From | Used in |
| --- | --- | --- |
| `LockedField` / `BeatFrame` / `Grid` / `GroundRule` / `Vignette` / `Grain` / `ProgressRule` / `SourceTag` | `field/` | every beat |
| `Signature` | `channel/` | B00 |
| `DarkLaw` + `SignatureReturn` + `TypedLine` | `channel/` | B25 |
| `Lucky` (rig: stand / sit / point / shrug / thumbsUp; expr: neutral / curious / worried / surprised / flat) | `characters/` | B02, B18 (on‑screen), B26 (hand only) |
| `DataCard` / `DataTable` / `Callout` / `LabelBox` / `SpeechBubble` | `print/` | B03, B08, B12, B13, B15, B21, B23, B24 |
| `CountUp` + `fmt` | `parts/` | B03, B08, B10, B16, B21 |
| `BarChart` | `print/diagrams` | B03 (82% bar), B16 (ARPDAU step) |
| `FlowDiagram` (has a `hub` option — the hidden party) | `print/diagrams` | B11, B17 |
| `MoneyFlow` ($ coins shrinking through arrows) | `print/diagrams` | B11 |
| `PieChart` | `print/diagrams` | not planned — avoid a 2nd pie so soon after Ep 1 (§14.2) |
| `DrawLine` / `DrawArrow` / `SpringIn` / `ExitOut` / `StaggerGroup` / `Breathe` / `MotionBlur` / `WipeOn` | `parts/` | throughout |
| `SpatialScene` / `Layer` / `Group` / `Camera` / `useCamera` / `pullToFit` / `DebugOverlay` | `spatial/` | B01, B05, B07, B11, B19, B20, B21 (the 2.5D beats) |
| `Phone`, `CreditCard`, `Coins`, `DollarCoin`, `PercentBadge` (FigureShapes) | `print/props` | B00, B01, B04, B08, B11, B26, B27 |
| `Icon` (16 line icons — `pin`, `eye`, `lock`, `clock`, …) | `print/` | B04, B17, B20, B22, B26 |
| `TextureBlock` / `HATCH` (grey hatch fill for "waste", "dimmed") | `print/textures` | B08 (dimmed map), B14 (junk page), B25 |

---

## B · New FigureShapes — small, add to `print/shapes.tsx` (or a new `print/ep02-shapes.tsx`)

Each is a `FigureShape` (`({paint, mode, w, h}) => <>…</>`), flat colour + `COLOR.outline` stroke at `h*0.012`, so it composes through `FigureBlock` / `FlatFigure` / `PaperEdge` like every other prop. `mode:"edge"` draws silhouette masses only.

| id | Draws | Notes / beats |
| --- | --- | --- |
| **`AppTile`** | rounded-square app icon: tile in a `paint()` colour + a simple centred glyph (letter block, controller, bag, cloud). Param: `glyph` | the app grid (B02, B24), the focus app (B05, B06), the phone home screen (B00, B26). ~96–220px |
| **`BuyerTile`** | small company card: outlined rect, a 2-bar "wordmark" blocked in, a tiny `$` bid chip that can toggle lit/greyed | the AuctionFan population (B07, B19). ~120×72px. Never a real logo — generic blocked wordmark |
| **`SdkChip`** | a small notched chip / puzzle-tab rectangle, `paint()` colour, thin outline | the kits (B05, B06). ~64×40px |
| **`RequestCard`** | a `cardWhite` card, mono header "BID REQUEST", 6–7 stacked field rows (label + value redacted to blocks) | B04 (the packet opened). ~560×640 |
| **`Gavel`** | auctioneer's gavel + a round sound-block, flat, `ink` + `tan` handle | B00 (tiny tick), B23 (the ruling). the B23 use is larger |
| **`JunkPage`** | a browser-ish frame filled with nothing but ad slots (hatched rects), no headline, no body text | B14. ~520×620 |
| **`GovBuilding`** | a plain classical-front silhouette (pediment + columns), one mass, `grey` | B20. small, receiving a data crate |
| **`DataCrate`** | a shipping-crate/box with a barcode band and a stencilled count | B19–B20 ("hundreds of millions of devices"). reuse `Box` shape as base if close enough |
| **`RouteMap`** | a minimal abstract street grid (a few `grid`-toned lines) + one `orange` pin + a dashed route | B27 (bridge to Maps). full-width-ish, low frame |
| **`PinPath`** | a run of small pins that connect into a labelled path (home · work · clinic · courtroom · worship) | B20. the labels are typeset (`FONT.mono`), never generated |

**Company wordmarks (Google, Meta, Amazon, Apple, The Trade Desk):** on screen as **sourced SVG** (press/brand kit or Wikimedia) dropped into `public/logos/`, or set in `FONT.hero` as plain type. **Never generated, never keyed from a raster** (§7.8). B15, B18, B21, B22, B23. If a clean SVG isn't sourced by build time, fall back to typeset name in a `LabelBox variant="outline"`.

---

## C · New components — the 5 flagged in Step 1 (§14.2 anti-template)

Build in `src/ep02/` (episode-local; promote to `print/` or `archetypes/` later only if a 2nd episode needs them — §16 Type B).

### C1 · `AuctionFan`  → `src/ep02/AuctionFan.tsx`
The signature visual of the episode. The exchange node fans bid requests to an arc of buyer tiles; a sweep clock runs; losers grey out; optionally one winner stays lit while the rest keep a copy of the profile.

```ts
AuctionFan({
  originX, originY,            // the exchange node position
  count = 120,                 // buyer tiles in the arc
  radius = 520,                // arc radius
  spreadDeg = 150,             // arc angular spread
  start,                       // frame the fan-out begins
  sweepFrames = 30,            // the ~100ms clock sweep (compressed)
  outcome?: "sweep" | "winner" | "harvest",  // B07 sweep · B19 harvest
  winnerIndex?, 
  keepCardAt?,                 // frame the losers each spawn a mini ProfileCard (B19)
  labelClock = "100 ms",
})
```
- Draws: lines from origin to each tile (`DrawLine` staggered), `BuyerTile` at each arc point, a radial sweep wedge (`orange`, low opacity) rotating once over `sweepFrames`, tiles the sweep passes flip `lit→grey` unless `outcome:"harvest"` (then all stay lit).
- Occupancy: the arc must fill the mid + lower frame. At the camera's wide end (B07 pull) ink must still ≥22% — pack the arc dense, tiles ≥ 8px, add the origin node mass + clock dial.
- Motion events: fan-out start, sweep start, first grey-out wave, sweep complete, (harvest: card spawn). ≥5 across the beat.

### C2 · `TollStack`  → `src/ep02/TollStack.tsx`
The worked-example ledger (B12) and the toll list (B15). A top-down stack of rows, each shaving a % off a running value, with a bar on the right that steps down in sync.

```ts
TollStack({
  x, y, width = 720,
  startValue = 2.00, unit = "$",
  rows: [{ label: "buying software", pct: 20 }, { label: "exchange", pct: 15 }, …],
  finalLabel = "reaches the app",
  perRowFrames = 14, start,
  showBar = true,               // the shrink bar on the right
  tail?: { label: "÷ 1,000 views", to: "0.10¢" } | { label: "app keeps", to: "≈ 0.05¢" },
})
```
- Rows land top→down (`springIn`, 14f stagger). Running value re-counts (`CountUp`) at each row. The right bar clips down to the new fraction (`interpolate` + `EASE.inOut`).
- One `orange` accent: the final "reaches the app" value only.
- Occupancy anchor for B12 — the stack + bar should own the bottom two-thirds.

### C3 · `ProfileCard`  → `src/ep02/ProfileCard.tsx`
Sparse vs rich description of "you", with a price meter. Also the mini card the losers keep in B19.

```ts
ProfileCard({
  x, y, scale = 1,
  fields: string[],             // ["woman", "30s", "near a pharmacy", "opened a baby-care app"]
  revealFrom, perFieldFrames = 8,
  priceMeter?: { from: 0.1, to: 2.0, unit: "¢" },   // climbs as fields appear
  variant?: "full" | "mini",    // mini = B19 harvest copies
  redacted?: boolean,           // mini copies show blocked-out fields
})
```
- `cardWhite`, `ink` outline, mono field rows. The meter is a thin vertical bar, `grey` track + `orange` fill, value in `TYPE.number`.
- B09: two instances side by side (sparse `["someone", "somewhere"]` vs rich). B19: ~120 `variant:"mini" redacted` scattered by the fan.

### C4 · `WalledVsOpen`  → `src/ep02/WalledVsOpen.tsx`
The two-zone comparison for B21: the whole toll chain collapses into a small "OPEN" box; a large solid "WALLED" block holds ~75% of a spend bar; hero values stack.

```ts
WalledVsOpen({
  openShrinkAt,                 // frame the toll chain collapses into the OPEN box
  walledRiseAt,                 // frame the WALLED block rises
  sharePct = 75,                // spend bar fill into the walled block
  values: [{ name: "GOOGLE", v: "≈ $200B" }, { name: "META", v: "≈ $190B" }, { name: "AMAZON", v: ">$20B / qtr" }],
  valuesFrom,
})
```
- WALLED block is a single `ink` mass with an inset `orange` fill bar to `sharePct`. OPEN box is small, `outline` only, with a faint collapsed chain inside.
- Camera (B21) pulls back to show the walled block dwarfing OPEN — compose at the wide end (§3.3); the block + values must carry occupancy alone.

### C5 · `PermissionPrompt`  → `src/ep02/PermissionPrompt.tsx`
A typeset iOS-style tracking dialog (generic, not Apple's exact chrome). B22, and again small in B26.

```ts
PermissionPrompt({
  x, y, scale = 1,
  appName = "the app",
  choiceAt,                     // frame a choice highlights
  choose?: "ask-not-to-track" | "allow",
  start,
})
```
- `cardWhite` rounded card, `ink` outline, mono body: `"Allow "{appName}" to track you across apps and websites?"`, two stacked buttons `Ask App Not to Track` / `Allow`. The chosen button gets an `orange` outline pulse.
- No Apple logo, no exact system font — it reads as "a tracking prompt," not a forgery.

---

## D · Per-beat asset call sheet

| Beat | New shapes | New components | Reused (primary) |
| --- | --- | --- | --- |
| B00 | AppTile, Gavel(tiny) | — | Signature, Phone, Breathe |
| B01 | BuyerTile(ring), AppTile | AuctionFan (ring variant) or Layer ring | Phone, DollarCoin, SpatialScene, DrawLine |
| B02 | AppTile ×grid | — | Lucky(sit), LabelBox, Grid |
| B03 | — | — | CountUp, BarChart, Callout |
| B04 | RequestCard, AppTile | — | Phone, Icon(pin/clock/lock), StaggerGroup |
| B05 | AppTile, SdkChip | — | SpatialScene, Layer, DrawLine, DrawArrow |
| B06 | SdkChip | — | DrawLine (ID spine), Icon(reset toggle), LabelBox |
| B07 | BuyerTile | **AuctionFan** (outcome:"sweep") | SpatialScene, Camera(push→pull), DrawLine |
| B08 | — | — | DataCard ×3 (eCPMs), CountUp, TextureBlock (dim map), Callout |
| B09 | — | **ProfileCard** ×2 | — |
| B10 | — | — | CountUp (14T), LabelBox (1M/sec), Lucky(sit, tiny vignette) |
| B11 | BuyerTile(winner) | **AuctionFan**(brief), MoneyFlow | SpatialScene, Camera(track), Phone |
| B12 | — | **TollStack** (tail: ÷1,000 → app keeps) | CountUp |
| B13 | — | — | DataCard ×3 (2020/2022/2023), LabelBox("50%" struck), Callout("36¢") |
| B14 | JunkPage | — | BarChart or Callout("1 in 5"), HATCH |
| B15 | — | **TollStack**(list mode) | LabelBox (The Trade Desk), Callout("~20%") |
| B16 | AppTile | — | BarChart (ARPDAU step), CountUp, WipeOn (rewarded panel) |
| B17 | BuyerTile(the watcher) | FlowDiagram(hub) | Icon(eye), DrawLine |
| B18 | — | — | Lucky(stand/shrug, curious), SpeechBubble(comment field), Breathe |
| B19 | BuyerTile, RequestCard(props: letter 2021, order Dec-2024) | **AuctionFan**(outcome:"harvest"), ProfileCard(mini ×N) | SpatialScene, Camera(pull) |
| B20 | PinPath, GovBuilding, DataCrate | — | SpatialScene, Camera(pull), Icon(pin), LabelBox |
| B21 | — | **WalledVsOpen** | SpatialScene, Camera(pull-back), CountUp, sourced logos |
| B22 | — | **PermissionPrompt** | LabelBox, DrawLine(price sag), Icon, "APP STORE — Sponsored" slot |
| B23 | Gavel(large) | — | LabelBox ×2 ("PUBLISHER AD SERVER" / "AD EXCHANGE") + "MONOPOLY" stamps, DrawLine (triangle) |
| B24 | AppTile ×grid | — | LabelBox (scale: INVASIVE / POINTLESS), CountUp("1 / 1,000"), Lucky(studio, tiny) |
| B25 | AppTile(flips to lot number) | — | **DarkLaw** (`reversalLine`, `crossfadeAt`), SignatureReturn |
| B26 | AppTile | (PermissionPrompt small) | Phone, AuctionFan(one fast burst), CountUp("1 in 7") |
| B27 | RouteMap | — | LabelBox ("NEXT — GOOGLE MAPS"), DataCard (prev-ep card), Icon(pin) |

---

## E · Build order (§11.1)

1. **New FigureShapes** (§B) — cheap, unblock everything. Add a `dev/Ep02Shapes` showcase frame.
2. **The 5 components** (§C) — each with a `dev/` demo composition, typecheck + lint clean.
3. **Opening minute — B00, B01, B02** (≈ 0:00–1:25, frames 0–2563). Render, occupancy-check, **kill-switch evaluation** (§11.1). Present before going further.
4. **The reversal — B25.** Render, occupancy (Dark Law frames exempt but keep it intentional).
5. **Everything else — B03–B24, B26, B27.** `npm run render:all EP02`, occupancy-gate every piece (§11.5).

## F · Open asset flags

- **Company logo SVGs** — source Google / Meta / Amazon / Apple / The Trade Desk marks into `public/logos/` before B15/B18/B21/B22/B23, or accept typeset fallback.
- **Signature stamp SFX** — `public/assets/ep02_audio/sfx/stamp.wav` still `MISSING EXTERNAL ASSET` (Phase 0 carry-over). B00 wires the prop; render works without it.
- **N5 / N17 / N22** — the "~10 kits", "1 in 5 MFA", "sold to government" figures still need citations locked (Step 1 flag). If any changes, B05 / B14 / B20 on-screen text updates with it.
