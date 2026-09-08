import { execFileSync } from "node:child_process";
import { REMOTION_CLI } from "./_remotion.mjs";
import timing from "../src/nif002/timing.json" with { type: "json" };

const ff = (args) => execFileSync(process.execPath, [REMOTION_CLI, "ffmpeg", ...args], { stdio: "pipe" });
const OUT = "C:/Users/parme/AppData/Local/Temp/claude/D--YT-Nothing-Is-Free/0c0fbd00-f1ab-40bc-b878-ccd23e694f3d/scratchpad/strips";
execFileSync("mkdir", ["-p", OUT]);

const BEATS = Object.entries(timing.beats).map(([id, v]) => ({ id, dur: v.durationInFrames }));
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const which = args[0] ? args[0].split(",") : null;
const review = process.argv.includes("--review"); // read out/review/*.mp4 + prefix rv_
const N = process.argv.includes("--n12") ? 12 : 8;
const src = (id) => (review ? `out/review/NIF002-${id}.mp4` : `out/NIF002-${id}.mov`);
const pre = review ? "rv_" : "";

for (const { id, dur } of BEATS) {
  if (which && !which.includes(id)) continue;
  for (let i = 0; i < N; i++) {
    const f = Math.round(((i + 0.5) / N) * dur);
    const p = `${OUT}/${pre}${id}_${String(i).padStart(2, "0")}_f${f}.jpg`;
    ff(["-hide_banner", "-loglevel", "error", "-ss", (f / 30).toFixed(2), "-i", src(id), "-frames:v", "1",
      "-vf", `scale=640:-1`, "-q:v", "3", "-y", p]);
  }
  console.log(id, "done");
}
