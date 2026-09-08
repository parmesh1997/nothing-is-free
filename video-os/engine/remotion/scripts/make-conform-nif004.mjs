// make-conform-nif004.mjs — generate the NIF004 08_conform/ deliverables from
// the single sources of truth: 03_transcript/reconcile.json (beat geometry) and
// src/nif004/v4/audio.tsx (NIF004_SFX cue table).
//
// Writes:
//   NIF004-render-guide.md   — what to render + the Resolve finish rules
//   NIF004-sfx-cues.md        — the per-beat SFX table (absolute + local frames)
//   NIF004-text-timing.md     — subtitle source + baked-Stamp inventory + markers
//   NIF004-markers.csv        — beat-boundary markers for the Resolve timeline
//
//   node scripts/make-conform-nif004.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const FPS = 30;
const OUT = "../../episodes/NIF004/08_conform";
mkdirSync(OUT, { recursive: true });

const recon = JSON.parse(readFileSync("../../episodes/NIF004/03_transcript/reconcile.json", "utf8"));
const beats = recon.beats;
const TOTAL = recon.episodeTotalFrames;

const tc = (frames) => {
  const t = frames / FPS;
  const m = Math.floor(t / 60);
  const s = (t % 60).toFixed(1).padStart(4, "0");
  return `${m}:${s}`;
};
const tcFull = (frames) => {
  const ff = frames % FPS;
  const tot = Math.floor(frames / FPS);
  const s = tot % 60, m = Math.floor(tot / 60) % 60, h = Math.floor(tot / 3600);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(h)}:${p(m)}:${p(s)}:${p(ff)}`;
};

// pull NIF004_SFX out of audio.tsx
const src = readFileSync("src/nif004/v4/audio.tsx", "utf8");
const m = src.match(/export const NIF004_SFX[^=]*=\s*({[\s\S]*?\n});/m);
const SFX = Function(`"use strict";return (${m[1]})`)();

// ── markers.csv ──────────────────────────────────────────────────────────────
let csv = "Timecode,Name,Notes\n";
for (const b of beats) csv += `${tcFull(b.globalStartFrame)},${b.id},${b.density} · ${b.words}w · ${(b.durationInFrames / FPS).toFixed(1)}s${b.flag ? " · " + b.flag : ""}\n`;
csv += `${tcFull(TOTAL - 1)},END,${tc(TOTAL)} total\n`;
writeFileSync(`${OUT}/NIF004-markers.csv`, csv);

// ── render-guide.md ──────────────────────────────────────────────────────────
const rg = `# NIF004 — render + Resolve finish guide

**Episode:** Google Maps — the hidden economics of the "free" map.
**Runtime:** ${tc(TOTAL)} · ${TOTAL} frames @ ${FPS}fps · 34 beats (B00–B33).
Generated ${new Date().toISOString().slice(0, 10)} from \`03_transcript/reconcile.json\`.

## What Remotion renders (the picture)

Every NIF004 beat renders **picture + VO + baked per-beat SFX**. Nothing else is
baked (runbook §22.7 / creator 2026-09-09):

- **NO music** — added in DaVinci Resolve.
- **NO subtitles** — auto-transcribe in Resolve Studio, match wording to
  \`01_script/script.md\` PLAIN.
- **NO beat-to-beat transitions** — each clip starts and ends on its full
  picture. Add a **cross-dissolve** in Resolve (select all → Add Cross Dissolve;
  the creator picked a Resolve cross-dissolve, no baked fade).
- **Stamps ARE baked** — the short boxed punch labels (e.g. "THE SAME MACHINE",
  "+1,000% OVERNIGHT") are part of the Remotion picture, one per beat max. They
  are editorial accents, not subtitles. See \`NIF004-text-timing.md\` for the
  inventory so the subtitle pass doesn't double them.

## Render commands (from \`video-os/engine/remotion/\`)

\`\`\`
# rebuild the per-beat SFX mixes (safe to re-run)
node scripts/build-sfx-mix-nif004.mjs

# per-beat ProRes HQ clips → out/beats-nif004/NIF004-B##.mov  (for the conform)
node scripts/render-beats-nif004.mjs

# OR the whole episode in one file → out/beats-nif004/NIF004-EPISODE.mov
node scripts/render-beats-nif004.mjs --episode

# fast H.264 review copies instead
node scripts/render-beats-nif004.mjs --h264
\`\`\`

Composition ids: \`NIF004-B00v4\` … \`NIF004-B33v4\` (per beat), \`NIF004-V4\`
(whole episode), \`NIF004-SFX\` (SFX-only stem — render to a .wav for a separate
Fairlight track if wanted).

## Resolve conform

1. Import the 34 \`NIF004-B##.mov\` clips (or the single \`NIF004-EPISODE.mov\`).
2. If using per-beat clips: lay them end-to-end in id order, hard cuts, at
   ${FPS}fps 1920×1080. Boundaries are in \`NIF004-markers.csv\` (import as timeline
   markers).
3. Select all clips → **Add Cross Dissolve** (default length is fine).
4. **Subtitles:** auto-transcribe → correct against \`01_script/script.md\` PLAIN.
5. **Music:** one bed, ducked under VO. Swell into the B30 reversal
   (${tc(beats[30].globalStartFrame)}), lift on the B33 CTA
   (${tc(beats[33].globalStartFrame)}), fade the last ~2s.
6. **SFX:** already baked per beat. To ride the level separately, mute the beat
   audio's SFX and drop the \`NIF004-SFX\` stem on its own track.
7. Grade: warm, gentle corner vignette (removed from the Remotion picture since
   Ep3 — it's a hand grade now).

## FAST-flagged beats (VO came in above the 134 wpm calibration)

${beats.filter((b) => b.flag).map((b) => `- **${b.id}** — ${b.wpm} wpm (${b.deltaPctFrom134 > 0 ? "+" : ""}${b.deltaPctFrom134}%). Accepted per the one-take rule (§22.11). No re-record.`).join("\n") || "- none"}
`;
writeFileSync(`${OUT}/NIF004-render-guide.md`, rg);

// ── sfx-cues.md ──────────────────────────────────────────────────────────────
let sc = `# NIF004 — SFX cue sheet

Per-beat one-shot cues. **Already baked** into the beat renders (and into
\`public/audio/nif004/sfx-mix/B##.mp3\` via \`scripts/build-sfx-mix-nif004.mjs\`).
This sheet is for reference / re-mixing. \`g\` = gain in dB (the cue-level
balance); the master SFX-vs-VO knob is \`SFX_BUS\` in \`src/nif004/v4/audio.tsx\`
(kept at unity — ride the final level in Resolve).

Slugs: tap whoosh thunk plip tick coin stamp drone chime-warm chime-bright boom
glitch lock switch footsteps (generic documentary one-shots, shared across
episodes).

| Beat | Abs start | Cues (local frame · slug · dB) |
|---|---|---|
`;
for (const b of beats) {
  const cues = SFX[b.id] || [];
  const abs = b.globalStartFrame;
  sc += `| ${b.id} | ${tc(abs)} | ${cues.map((c) => `${c.at}f ${c.s} ${c.g ?? -14}dB`).join(" · ") || "—"} |\n`;
}
writeFileSync(`${OUT}/NIF004-sfx-cues.md`, sc);

// ── text-timing.md ──────────────────────────────────────────────────────────
const tt = `# NIF004 — text timing sheet (for the Resolve text pass)

NIF004 beats render **picture + VO + SFX**. On-screen running text is added in
Resolve (runbook §22.7).

## Subtitles

Auto-transcribe in Resolve Studio, then correct every line against the **PLAIN**
blocks in \`01_script/script.md\` (the verbatim read). Beat boundaries below /
in \`NIF004-markers.csv\`.

## Baked Stamps — DO NOT re-add these as subtitles

Each beat carries at most one short boxed "Stamp" punch label baked into the
Remotion picture (an editorial accent, ~24–44px, boxed, orange or ink). The
subtitle pass should treat these as graphics already on screen. Rough inventory
(exact wording is in \`src/nif004/v4/beats.tsx\`):

| Beat | Baked Stamp (approx.) |
|---|---|
| B01 | THE SAME MACHINE |
| B02 | AND THIS IS THE SMALLEST OF THE THREE |
| B04 | EVERY LOAD IS A CHARGE ON THEIR BILL |
| B05 | JULY 16, 2018 · AND A VALID CARD ON FILE — NOW REQUIRED |
| B06 | +1,000% OVERNIGHT |
| B07 | YOU NEVER SEE THE RECEIPT |
| B08 | A COMPANY THAT SIZE — OVER A BARREL |
| B09 | EXPENSIVE, SLOWER, OR A DOWNGRADE |
| B10 | RIVALS TEAM UP TO ESCAPE YOUR METER |
| B11 | EVERY KIND OF LOOK, BY NAME |
| B13 | one small grey word: "Sponsored" |
| B15 | THE ORDER IS AN AUCTION FOR YOUR EMERGENCY |
| B16 | WHOEVER PAID MOST FOR THE SLOT |
| B17 | A DIRECTORY WOULD MAKE YOU SUSPICIOUS. A MAP DOES NOT. |
| B18 | THE SIGNAL DOES NOT STOP WHEN YOU PARK |
| B19 | YOU ARE ONE OF THE SENSORS IT IS BUILT FROM |
| B20 | MOST PEOPLE HAD NO IDEA THE SECOND SWITCH EXISTED |
| B21 | said it would stop → kept tracking → to sell ads |
| B23 | 1 IN 4 LAW-ENFORCEMENT WARRANTS GOOGLE GOT |
| B24 | YOU ARE THE REASON BOTH OF THEM WORK |
| B25 | IF YOU ARE THE ONE PAYING — WHY DOESN'T IT FEEL LIKE IT? |
| B26 | 10,000,000+ MILES OF STREET VIEW · EVERYWHERE ELSE RUNS ON THIS ONE |
| B27 | REFLEX IS WHAT A STANDARD IS MADE OF |
| B28 | GIVING THE MAP AWAY FOR FREE IS HOW THE MOAT GOT DUG |
| B30 | (reversal — the "023" window number + APP/ADVERTISER readouts are baked) |
| B31 | IT CHARGES BOTH SIDES OF THE GLASS AT ONCE |
| B32 | SAME CHANNEL, SAME QUESTION — WE READ THAT METER TOO |
| B33 | NOTHING IS FREE (signature, baked typeset) |

## Beat boundaries

| Beat | In (abs) | Out (abs) | Dur | Density |
|---|---|---|---|---|
${beats.map((b) => `| ${b.id} | ${tc(b.globalStartFrame)} | ${tc(b.globalStartFrame + b.durationInFrames)} | ${(b.durationInFrames / FPS).toFixed(1)}s | ${b.density} |`).join("\n")}

Total: ${tc(TOTAL)} (${TOTAL}f).
`;
writeFileSync(`${OUT}/NIF004-text-timing.md`, tt);

console.log(`wrote 4 files → ${OUT}/`);
for (const f of ["NIF004-render-guide.md", "NIF004-sfx-cues.md", "NIF004-text-timing.md", "NIF004-markers.csv"]) console.log("  " + f);
