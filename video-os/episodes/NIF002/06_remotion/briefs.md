# EP02 · REMOTION BRIEFS (Step 3 · §11)

One brief per beat, with the **real** `durationInFrames` from [EP02_RECONCILE.md](EP02_RECONCILE.md). Choreography detail lives in [EP02_04_SCENES.md](EP02_04_SCENES.md) — this doc is the code shape: composition id, props, component tree, build notes.

`episodeTotalFrames = 30393` · `fps = 30` · 1920×1080 (§11.1). B25 carries a +72 f Dark-Law tail past its VO (see SCENES).

---

## 0 · Shared scaffold

### Audio
Copy `EP02/Audio/B00.mp3 … B27.mp3` → `nothing-is-free-remotion/public/audio/ep02/`. Each beat's `audioSrc` is `"audio/ep02/B##.mp3"`, `audioOffsetMs: 0` (VO starts at beat frame 0). `BeatFrame` mounts it.

### Files
```
src/ep02/
  AuctionFan.tsx  TollStack.tsx  ProfileCard.tsx  WalledVsOpen.tsx  PermissionPrompt.tsx   (§ EP02_03_ASSETS C)
  shapes.ts        AppTile · BuyerTile · SdkChip · RequestCard · Gavel · JunkPage
                   · GovBuilding · DataCrate · RouteMap · PinPath  (FigureShapes)
  beats/B00.tsx … B27.tsx
  index.ts         re-exports the 28 beat components
```

### Beat component pattern (§11.3, project CLAUDE.md)
```tsx
// src/ep02/beats/B07.tsx
import { BeatFrame } from "../../BeatFrame";
import { BeatProps } from "../../tokens";

export const B07: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="IAB OpenRTB spec; RTB request volume, industry est.">
    {/* midground + foreground per EP02_04_SCENES B07 */}
  </BeatFrame>
);
```
Drive everything off `useCurrentFrame()` (local). Anything episode-wide (`Grid` phase, progress rule) is already handled by `BeatFrame`/`LockedField` from `props`. No CSS `transition`/`animation`. Use `scale`/`translate`/`rotate` style props with inline `interpolate()` (Studio-editable). Springs = `MOTION.springIn`; nothing linear except grid drift (§4.1).

### Root.tsx registration (add an `EP02` Folder)
```tsx
import { B00 } from "./ep02/beats/B00";           // …through B27
import { BEAT_PROPS_DEFAULTS } from "./tokens";

const EP_TOTAL = 30393;
const ep02 = (id: string, C: React.FC<any>, durationInFrames: number, globalStartFrame: number) => (
  <Composition
    id={id} component={C}
    durationInFrames={durationInFrames} fps={30} width={1920} height={1080}
    defaultProps={{
      ...BEAT_PROPS_DEFAULTS,
      beatId: id, durationInFrames, fps: 30,
      globalStartFrame, episodeTotalFrames: EP_TOTAL,
      audioSrc: `audio/ep02/${id.replace("EP02_", "")}.mp3`, audioOffsetMs: 0,
    }}
    calculateMetadata={waitForFonts}
  />
);

<Folder name="EP02">
  {ep02("EP02-B00", B00, 277, 0)}
  {ep02("EP02-B01", B01, 1134, 277)}
  {/* … table below … */}
</Folder>
```
`scripts/render-all.mjs` picks up any id matching `^EP\d`, so name them `EP02-B00…EP02-B27` (**hyphen, not underscore** — Remotion ids reject `_`). `durationInFrames` and `globalStartFrame` are **inlined literals** (Studio-editable), not computed in the registry.

### Phase 0 fixes made during the opening-minute build (all bugs, all blocking Step 3)

- `scripts/occupancy_check.py` — `PAPER` constant was `#DADAD2` (pre-2026-09-01 palette). Every `#F6F2E7` pixel scored a summed delta of 73 (> 60) → the gate read ~100% ink on any frame. Now `[246,242,231]`.
- `scripts/render-all.mjs` — the composition list was fetched with `remotion compositions --log=error`, which prints nothing (the table is `info` level) → zero beats ever found. Flag removed.
- `scripts/render-all.mjs` `validate()` — required `pix_fmt === "yuva444p10le"` exactly. ProRes 4444 is a 12-bit codec, so `--pixel-format=yuva444p10le` lands as `yuva444p12le` (still has the alpha channel). Now accepts `yuva444p*le`.

### The numbers (paste into the registry)

| id | durationInFrames | globalStartFrame | class | source tag |
| --- | ---: | ---: | --- | --- |
| EP02-B00 | 277 | 0 | OPENING | channel mark |
| EP02-B01 | 1134 | 277 | OPENING | — (pre-figure) |
| EP02-B02 | 1153 | 1411 | MEDIUM | Statista / Google Play distribution, 2024 |
| EP02-B03 | 1132 | 2564 | MEDIUM | In-app ad spend, industry est., 2025 |
| EP02-B04 | 1342 | 3696 | HIGH | Bidstream contents — US Senate (Wyden) 2021; FTC complaints |
| EP02-B05 | 1477 | 5038 | MEDIUM | Third-party tracking research (Binns 2018; Exodus) |
| EP02-B06 | 841 | 6515 | MEDIUM | (mechanism) |
| EP02-B07 | 1266 | 7356 | HIGH | IAB OpenRTB spec; RTB volume, industry est. |
| EP02-B08 | 1105 | 8622 | HIGH | Mobile eCPM benchmarks, US, 2025 |
| EP02-B09 | 987 | 9727 | MEDIUM | (mechanism) |
| EP02-B10 | 1129 | 10714 | MEDIUM | RTB volume + DSP throughput, industry est., 2026 |
| EP02-B11 | 992 | 11843 | HIGH | (mechanism) |
| EP02-B12 | 1143 | 12835 | BUILD | Programmatic fee ranges: ISBA/PwC; The Trade Desk filings |
| EP02-B13 | 1643 | 13978 | HIGH | ISBA/PwC 2020 & 2022; ANA Dec 2023 |
| EP02-B14 | 1007 | 15621 | MEDIUM | ANA Programmatic Transparency, Dec 2023 |
| EP02-B15 | 836 | 16628 | MEDIUM | The Trade Desk, investor filings |
| EP02-B16 | 781 | 17464 | MEDIUM | Rewarded-video ARPDAU benchmarks, 2025 |
| EP02-B17 | 553 | 18245 | REST | (mechanism) |
| EP02-B18 | 673 | 18798 | REST | (engagement) |
| EP02-B19 | 1547 | 19471 | HIGH | US Senate 2021; FTC v. Mobilewalla, Dec 2024 |
| EP02-B20 | 1266 | 21018 | HIGH | FTC v. Kochava (2026); FTC Gravy/Venntel, Dec 2024 |
| EP02-B21 | 1407 | 22284 | HIGH | Alphabet / Meta / Amazon 10-K, 2025 |
| EP02-B22 | 1012 | 23691 | MEDIUM | Apple ATT (2021); App Store ads (2022) |
| EP02-B23 | 935 | 24703 | MEDIUM | US v. Google, EDVA — ruling 17 Apr 2025 |
| EP02-B24 | 1331 | 25638 | HIGH | Google Play distribution 2024; display CTR benchmarks |
| EP02-B25 | 1240 | 26969 | REVERSAL | (Dark Law — tag hidden) |
| EP02-B26 | 1045 | 28209 | MEDIUM | ATT opt-in ≈ 14%, 2024 |
| EP02-B27 | 1139 | 29254 | MEDIUM | channel mark |

---

## 1 · New components — build + `dev/` demo first

### `AuctionFan` (used B01 ring-mode, B07 sweep, B11 brief, B19 harvest, B26 burst)
Props in [EP02_03_ASSETS.md §C1]. Implementation:
- Arc points: `count` tiles across `spreadDeg`, centred on `-90°` (up), radius `radius`. Position each `BuyerTile` at `(originX + r·cosθ, originY + r·sinθ)`.
- Lines: one `<DrawLine>` per tile from origin, `start + i*staggerFrac`, `staggerFrac ≈ 3/ count * spreadFrames`.
- Sweep: a `<path>` wedge, `fill={COLOR.orange}` `opacity 0.14`, `rotate` from `-90-spread/2` to `-90+spread/2` over `sweepFrames`, starting at `start + fanFrames`.
- A tile greys when the sweep angle passes it, **unless** `outcome:"harvest"`.
- `outcome:"harvest"`: at `keepCardAt`, each non-winner spawns `<ProfileCard variant="mini" redacted>` that `translate`s downward into the lower third with a `springIn` + small settle bounce, staggered.
- Occupancy: expose an `arcDensity` so B07/B21 wide framings can pack tighter.
- Demo: `dev/AuctionFanDemo` — sweep + harvest side by side.

### `TollStack` (B12 ledger, B15 list)
- `rows.reduce` a running value; render each row as `{label}  −{pct}%   {runningValue via CountUp}`.
- Right bar: a vertical rect, height = `barMax * (runningValue/startValue)`, clipped with `interpolate` on row-land frames.
- `tail`: extra rows for `÷ 1,000` and `app keeps` with the orange accent on the very last value only.
- Demo: `dev/TollStackDemo`.

### `ProfileCard` (B09 ×2, B19 mini ×N)
- `variant:"full"`: `cardWhite` card, mono field rows revealed at `revealFrom + i*perFieldFrames`, a vertical price meter (`grey` track, `orange` fill) whose fill = `interpolate(fieldsShown, [0, fields.length], [meter.from, meter.to])`.
- `variant:"mini"`: ~140×90, `redacted` → field text replaced by ▬▬ blocks.
- Demo: `dev/ProfileCardDemo`.

### `WalledVsOpen` (B21)
- Left: a small `outline`-only box labelled OPEN containing a faint collapsed chain (reuse a shrunk `FlowDiagram`).
- Right: a big `COLOR.ink` block; inset a vertical `orange` bar filling to `sharePct%` at `walledRiseAt+…`.
- `values`: stacked `<Callout>`s counting up (use `CountUp` with a custom formatter for "$200B"), each with a sourced logo `<img src={staticFile("logos/google.svg")}/>` or a typeset `LabelBox` fallback.
- Compose at the **wide end** (camera pull) — verify occupancy on the widest frame.
- Demo: `dev/WalledVsOpenDemo`.

### `PermissionPrompt` (B22, B26 small)
- `cardWhite` rounded card, `ink` outline, mono copy, two stacked buttons. Chosen button: `outline` pulses `orange` (`interpolate` sine on `choiceAt`).
- No Apple logo, no SF font — generic.
- Demo: `dev/PermissionPromptDemo`.

### New FigureShapes → `src/ep02/shapes.ts`
`AppTile({glyph})` · `BuyerTile` · `SdkChip` · `RequestCard` · `Gavel` · `JunkPage` · `GovBuilding` · `DataCrate` · `RouteMap` · `PinPath`. Each `({paint, mode, w, h}) => <>…</>`, stroke `COLOR.outline` at `h*0.012`, `mode:"edge"` = silhouette only. One `dev/Ep02ShapesDemo` catalogue frame.

---

## 2 · Per-beat briefs

Only the non-obvious build notes — full choreography is in SCENES. "tree" = the foreground children inside `<BeatFrame>`.

### EP02-B00 — signature · 277 f · OPENING
tree: `<Signature clause="And the app that just charged you nothing ran an auction the second you opened it." accentWord="auction" clauseStart={24} stampSrc="assets/ep02_audio/sfx/stamp.wav" />` + a `<FigureBlock shape={Phone} subject … baseline="ground">` with an `AppTile` glyph on screen + a turning ring (`interpolate` rotate) + a tiny `Gavel` tick at ~f60. `Breathe` the phone. Stamp SFX file may be missing → render still passes.
occupancy: phone mass must sit low; if bottom-third < 35 %, widen the phone or add the table-line mass.

### EP02-B01 — cold-open sting + promise · 1134 f · OPENING
tree: `<SpatialScene>` with a deep-mid `Layer` holding a ring of ~160 `BuyerTile` (use `AuctionFan` with a full-circle `spreadDeg={330}` or a bespoke ring), a subject `Layer` with `Phone` + a peeling packet, a foreground `Layer` with the `DollarCoin` and three promise `LabelBox`es. Camera: `useCamera` small push at f280.
**Hard gate: the "≈ 1¢" sting must be fully readable by f300 (≈ 0:10 global — §15.2).** Storyboard that first.

### EP02-B02 — save-the-cat · 1153 f · MEDIUM
tree: midground `AppTile` grid (StaggerGroup, ~40 tiles, 97 % wash to `paperShade`), a `STUDIO` desk (two `Lucky`-style stick figures or a simple desk shape), foreground `<Lucky pose="sit" expression="worried" subject baseline="ground">` on a couch shape, a caption `LabelBox`. First on-screen figure → `source` prop set.

### EP02-B03 — big rent · 1132 f · MEDIUM
tree: `<Callout valueNode={<CountUp to={390_000_000_000} start={0} end={150} format={n=>"$"+(n/1e9).toFixed(0)+"B"} />} label="IN-APP AD SPEND / YEAR" />` + `<BarChart bars={[{label:"in-app",value:82},{label:"rest of mobile",value:18}]} start={180} end={360} />` + a `TextureBlock` tick field. Mark "EST." on screen next to the figure (§9.2). Number shrinks to a corner chip at the end.

### EP02-B04 — the request · 1342 f · HIGH ⚠️ long
tree: `Phone` + `<FigureBlock shape={RequestCard} subject>`; field rows are a `StaggerGroup` of 7 typeset rows at ~45 f apart with per-row `MotionBlur`; a ghosted setup screen (low-opacity `AppTile` + a checkbox `Icon`). Needs continuous incident → redaction blocks slide in per row, a data-size chip ticks.

### EP02-B05 — the kits · 1477 f · MEDIUM ⚠️ longest body
tree: `<SpatialScene>` — midground `Layer` row of ~8 `AppTile`, subject `Layer` focus `AppTile` with ~10 `SdkChip` plugging in (StaggerGroup 12 f), foreground link line (`DrawLine`). Camera pan L→R at f450, back at f900. Watch the event count — keep chips reacting through the pan.

### EP02-B06 — the ID spine · 841 f · MEDIUM
tree: a tall `DrawLine` spine from the ground rule up; `SdkChip` cloud firing `DrawArrow`s into it; a settings row with a `Icon` toggle (off). Still camera.

### EP02-B07 — AuctionFan sweep · 1266 f · HIGH ⚠️ long
tree: `<SpatialScene>` with `<AuctionFan originX={960} originY={540} count={120} radius={520} spreadDeg={150} outcome="sweep" labelClock="100 ms" start={40} />`. Camera: push f0–f40, **pull f210–f340** — verify occupancy on the f340 frame before finishing. Caption `LabelBox` "REMEMBER THE LOSERS" with an orange underline, f520.

### EP02-B08 — you, priced · 1105 f · HIGH
tree: three `<DataCard>` (banner $1.20 / full-screen $10 / rewarded $20 — accent on rewarded), a "÷ 1,000" `LabelBox`, a hero `<CountUp>`-style result "0.1¢–2¢", a `TextureBlock`/HATCH world-map dim. Draw a bracket between the low and high value.

### EP02-B09 — ProfileCard ×2 · 987 f · MEDIUM
tree: `<ProfileCard variant="full" fields={["someone","somewhere"]} priceMeter={{from:0.1,to:0.2,unit:"¢"}} … />` left; `<ProfileCard variant="full" fields={["woman","30s","near a pharmacy","opened a baby-care app"]} priceMeter={{from:0.1,to:2.0,unit:"¢"}} revealFrom={90} perFieldFrames={90} />` right. Arrow from the cheap card to "YOU" at the end.

### EP02-B10 — the scale · 1129 f · MEDIUM · (SLOW read — keep the counter churning)
tree: a hero number that never settles — `CountUp` to `14e12` with `end` far past the beat so digits keep rolling; a "1,000,000 / SEC" `LabelBox` with a per-second pulse; a small `<Lucky pose="sit" height={~250}>` vignette with a `CountUp` tally to ~3000. Static-run ceiling 90 f — the churn covers it.

### EP02-B11 — money-flow track · 992 f · HIGH
tree: `<SpatialScene>` — the winning `BuyerTile` lights, an ad paints on a `Phone`, a `DollarCoin` tracked R→L via camera through 4 gate labels, shrinking (`scale` interpolate) + `MotionBlur` slivers. Ends matched-motion into B12.

### EP02-B12 — TollStack · 1143 f · BUILD
tree: `<TollStack x={340} y={140} startValue={2.00} rows={[{label:"buying software",pct:20},{label:"exchange",pct:15},{label:"selling software",pct:15},{label:"data targeting",pct:8}]} finalLabel="reaches the app" tail={{label:"÷ 1,000 views → app keeps",to:"≈ 0.05¢"}} start={0} perRowFrames={70} />`. Occupancy anchor — stack + bar own the bottom two-thirds.

### EP02-B13 — the correction · 1643 f · HIGH ⚠️ longest body — split candidate
tree: a struck "50%" `LabelBox`; three `<DataCard>` dealt across a timeline rule with a slow pan; the 2023 card enlarges into a `<Callout value="36¢" />`. Each card's figure counts up. **If a first build pass can't hold 55 s of incident, split at f840 into EP02-B13a (1000 f) / EP02-B13b (643 f)** — adds one composition, 0 runtime; re-index B14+ `globalStartFrame` and `episodeTotalFrames` stays 30393.

### EP02-B14 — made-for-advertising · 1007 f · MEDIUM
tree: `<FigureBlock shape={JunkPage} baseline="ground">` filling with HATCH ad-slots (StaggerGroup), a "1 IN 5" bar, a flame consuming a `DollarCoin` (`clipPath` shrink). "0 READERS" label.

### EP02-B15 — the named toll · 836 f · MEDIUM
tree: a `LabelBox variant="outline"` "THE TRADE DESK" (or `logos/thetradedesk.svg` if sourced), a bar with a 20 % wedge (`<TollStack>` list-mode or a bespoke wedge), 3 receding toll-gates with parallax (`Layer`).

### EP02-B16 — app reshapes · 781 f · MEDIUM · (FAST read — let each ARPDAU step land)
tree: an enlarged `AppTile` game screen, a `<WipeOn>` rewarded panel with a countdown ring (`interpolate` stroke-dashoffset), a `<BarChart>` stepping +30 % then +60 % in two distinct holds. Relabel the panel at the end.

### EP02-B17 — mid-tease · 553 f · REST
tree: a lit chain (3 `LabelBox` verbs), `<FlowDiagram nodes={[…]} hub="?" />` with the hub staying dark, an `Icon` eye opening on it, a "?" rise, slow push.

### EP02-B18 — engagement · 673 f · REST
tree: `<Lucky pose="shrug" expression="curious" subject baseline="ground">` lowering a phone; a `<SpeechBubble>` comment field "ADS BEFORE I PUT IT DOWN: ___" with a blinking cursor (`interpolate` step). `Breathe`.

### EP02-B19 — harvest · 1547 f · HIGH ⚠️ long
tree: `<SpatialScene>` `<AuctionFan outcome="harvest" winnerIndex={54} keepCardAt={240} count={120} />` — the ~119 mini `ProfileCard`s settle into the lower third (occupancy anchor). Two typeset props: "US SENATE — 2021" letter, "REGULATOR ORDER — DEC 2024" (orange seal at f960). Running "119 STILL HAVE IT" counter.

### EP02-B20 — where the data goes · 1266 f · HIGH ⚠️ long · §14.4
tree: `<SpatialScene>` map `Layer`; `<FigureBlock shape={PinPath}>` — pins connect into a path, labels type one clause each (HOME · WORK · A CLINIC · A COURTROOM · A PLACE OF WORSHIP — FTC complaint categories, plain); `DataCrate` "HUNDREDS OF MILLIONS OF DEVICES"; `GovBuilding` + "NO WARRANT". Camera pull f150. **Keep it plain and sourced — no drama (§14.4).** Confirm the N22 government-purchase cite or swap to: *"and, court records show, resold many times over."*

### EP02-B21 — WalledVsOpen · 1407 f · HIGH ⚠️ long
tree: `<SpatialScene>` `<WalledVsOpen openShrinkAt={0} walledRiseAt={200} sharePct={75} values={[{name:"GOOGLE",v:"≈ $200B"},{name:"META",v:"≈ $190B"},{name:"AMAZON",v:">$20B / qtr"}]} valuesFrom={660} />`. Camera **pull back** f200 — the block + values must carry occupancy at the widest frame (§3.3). Logos from `public/logos/` or typeset.

### EP02-B22 — Apple · 1012 f · MEDIUM
tree: `<PermissionPrompt appName="the app" choiceAt={150} choose="ask-not-to-track" start={0} />`, a sagging market-price `DrawLine`, an "APP STORE — SPONSORED" slot lighting orange at f540. The one `[dry]` beat — hold on the slot.

### EP02-B23 — the ruling · 935 f · MEDIUM
tree: a large `<FigureBlock shape={Gavel}>`, "APRIL 2025" `LabelBox`, two `LabelBox`es "PUBLISHER AD SERVER" / "AD EXCHANGE" each getting a "MONOPOLY" stamp (`ScaleUp` + a slight rotate), a MARKETPLACE/BUYER/SELLER triangle (`DrawLine` ×3) collapsing onto one wordmark.

### EP02-B24 — counter-argument · 1331 f · HIGH ⚠️ long
tree: the 97 % `AppTile` grid returns; the `STUDIO` desk re-enters from L; a `CountUp` impression tally to 1000 with exactly 1 "click"; a balance-scale shape (bespoke or two `LabelBox`es on a pivoting `<g>`) wobbling INVASIVE ↔ POINTLESS, settling level. Impression dots rain; one becomes a click.

### EP02-B25 — REVERSAL / Dark Law · 1240 f · (VO 1168 + 72 tail)
tree: `<BeatFrame props={props} darkLawStartGlobalFrame={27089}>` (= gStart 26969 + 120) `<DarkLaw reversalLine="You were never the user. You are the inventory." crossfadeAt={120} cps={18} />` + an `AppTile` that flips to a barcode/lot-number at ~f140 (`rotateY` or a swap). `SignatureReturn` is fired by `DarkLaw` after the line. Music-stop is a Resolve mix note (§12.2). Locked camera.

### EP02-B26 — implication · 1045 f · MEDIUM
tree: paper fades back up (`LockedField` handles it if `darkLawStartGlobalFrame` is *not* set here); a `Phone` opening with one fast `<AuctionFan count={60} sweepFrames={10}>` burst that vanishes; pins scatter; a small `<PermissionPrompt scale={0.6}>`; a price chip `2¢ → 0.4¢`; a `CountUp`/fill "≈ 1 IN 7".

### EP02-B27 — bridge + CTA · 1139 f · MEDIUM
tree: `<FigureBlock shape={RouteMap} baseline="ground">` drawing in; a route `DrawLine` to an orange `Icon` pin; "NEXT — GOOGLE MAPS" `LabelBox`; a `<DataCard title="PREVIOUS" rows={[{label:'',value:'56% of Every Movie Ticket…'}]} />`; a subscribe prompt. Progress rule visibly hits 100 % at the last frame — it already does, driven by `globalStartFrame + frame` over 30393.

---

## 3 · Render + gate (§11.5, §11.6)

```bash
# in nothing-is-free-remotion/
npm run typecheck && npm run lint
npm run render:all EP02          # ProRes 4444, yuva444p10le, validate + occupancy-gate every beat
npm run occupancy -- EP02-B07    # spot-check a single beat while iterating
```
A beat that fails occupancy **does not go to the timeline** (§11.5) — fix scale / anchoring / planes and re-render. `render:all` renders alpha (V1 opaque pieces carry the locked field via `BeatFrame` and are flattened in Resolve — §11.6).

## 4 · Not in scope for Step 3 (→ Step 4 Resolve, §12)
Music bed, ducking at the reversal, SFX (whoosh per beat card, tick on figure entry, low element on the Dark Law), the −16 LUFS mix, grade + grain pass, export. The one SFX this project already expects — `stamp.wav` — is a Phase 0 `MISSING EXTERNAL ASSET`.
