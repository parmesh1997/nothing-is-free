// timesheet.mjs — per-beat VO word timings as absolute timecodes, for the
// DaVinci Resolve text pass (subtitles + kinetic "deep text"). NIF003 beats
// render visual-only from 2026-09-06; all on-screen words are added in Resolve.
//
//   node scripts/timesheet.mjs B01            # one beat
//   node scripts/timesheet.mjs B01 B02 B03    # several
//   node scripts/timesheet.mjs all            # every beat, compact
import timing from "../src/nif003/timing.json" with { type: "json" };

const FPS = 30;
const tc = (f) => {
  const s = f / FPS;
  const m = Math.floor(s / 60);
  const r = (s % 60).toFixed(2).padStart(5, "0");
  return `${m}:${r}`;
};

const args = process.argv.slice(2);
const ids = args[0] === "all" ? Object.keys(timing.beats) : args;

for (const id of ids) {
  const b = timing.beats[id];
  if (!b) { console.log(`?? ${id} not in timing.json`); continue; }
  const g = b.globalStartFrame;
  console.log(`\n━━━ ${id}  ·  starts ${tc(g)} (frame ${g})  ·  ${b.durationInFrames}f / ${(b.durationInFrames / FPS).toFixed(1)}s ━━━`);
  if (args[0] === "all") {
    // compact: just the sentence, reconstructed
    console.log("  " + b.words.map((w) => w.t).join(" "));
    continue;
  }
  for (const w of b.words) {
    console.log(`  ${tc(g + w.start).padEnd(9)} f${String(g + w.start).padEnd(6)} (local ${String(w.start).padEnd(5)})  ${w.t}`);
  }
}
