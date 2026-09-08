/**
 * build-timing.mjs — merge whisper word timings + reconcile durations → timing.json
 *
 *   node scripts/build-timing.mjs ../../episodes/NIF002
 *
 * Output (03_transcript/timing.json): per beat, the reconciled frame geometry
 * plus every spoken word placed at a LOCAL frame (whisper startMs → frame).
 * A beat component reads its own entry via `useBeatTiming(beatId)` and calls
 * `at("auction")` / `after("finishes")` to sync a graphic to the exact word.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const FPS = 30;
const epDir = resolve(process.argv[2] ?? "../../episodes/NIF002");
const reconcile = JSON.parse(readFileSync(join(epDir, "03_transcript/reconcile.json"), "utf8"));
const transcript = JSON.parse(readFileSync(join(epDir, "03_transcript/transcript.json"), "utf8"));

// B25 carries a +72f Dark-Law tail past its VO (project.json) → rebuild globalStartFrame.
// NIF002-specific (its B25 is the reversal beat) — keyed by episode dir name so this
// doesn't silently corrupt another episode's beat that happens to share the id "B25"
// (bug found 2026-09-05 building NIF003, whose B25 is an unrelated beat).
const TAIL_BY_EPISODE = { NIF002: { B25: 72 } };
const TAIL = TAIL_BY_EPISODE[epDir.split(/[\\/]/).pop()] ?? {};
let shift = 0;
const geo = {};
for (const b of reconcile.beats) {
  const extra = TAIL[b.id] ?? 0;
  geo[b.id] = {
    durationInFrames: b.durationInFrames + extra,
    globalStartFrame: b.globalStartFrame + shift,
  };
  shift += extra;
}
const episodeTotalFrames = reconcile.beats.reduce(
  (s, b) => s + b.durationInFrames + (TAIL[b.id] ?? 0), 0,
);

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const timing = {
  version: "2.0",
  fps: FPS,
  episodeTotalFrames,
  source: "whisper medium.en token-level + reconcile.json",
  beats: {},
};

for (const [id, tb] of Object.entries(transcript.beats)) {
  const g = geo[id];
  if (!g) continue;
  const words = tb.words
    .map((w) => ({
      t: w.t,
      key: norm(w.t),
      start: Math.round((w.s / 1000) * FPS),
      end: Math.round((w.e / 1000) * FPS),
      conf: w.c,
    }))
    .filter((w) => w.key.length > 0) // drop punctuation-only tokens
    .map((w, i) => ({ i, ...w }));
  timing.beats[id] = {
    ...g,
    words,
    lowConfidence: tb.lowConfidence.map((w) => norm(w.t)),
  };
}

writeFileSync(join(epDir, "03_transcript/timing.json"), JSON.stringify(timing, null, 2));
console.log(
  `wrote timing.json — ${Object.keys(timing.beats).length} beats, ${episodeTotalFrames} frames (${(episodeTotalFrames / FPS / 60).toFixed(2)} min)`,
);
