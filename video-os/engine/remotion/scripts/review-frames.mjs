// Extract N evenly-spaced frames from each NIF002-B##v4.mp4 for the beat-by-beat
// review. PNG (the bundled mjpeg encoder trips on the renders' colour range).
//   node scripts/review-frames.mjs            → 6 frames each, all 28
//   node scripts/review-frames.mjs B07 B19    → just those
//   node scripts/review-frames.mjs --n 9      → 9 frames each
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";

const ff = "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const ffprobe = "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe";
const inDir = "out/review";
const outDir = "out/review/frames";
mkdirSync(outDir, { recursive: true });

const args = process.argv.slice(2);
let n = 6;
const ni = args.indexOf("--n");
if (ni >= 0) { n = parseInt(args[ni + 1], 10); args.splice(ni, 2); }
const only = args.filter((a) => /^B\d\d$/.test(a));
const beats = Array.from({ length: 28 }, (_, i) => `B${String(i).padStart(2, "0")}`).filter((b) => !only.length || only.includes(b));

for (const b of beats) {
  const mp4 = `${inDir}/NIF002-${b}v4.mp4`;
  if (!existsSync(mp4)) { console.log(`skip ${b} (no render)`); continue; }
  const dur = parseFloat((spawnSync(ffprobe, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4], { encoding: "utf8" }).stdout || "0").trim());
  const times = Array.from({ length: n }, (_, i) => (dur * (i + 0.5)) / n);
  times.forEach((t, i) => {
    spawnSync(ff, ["-y", "-ss", t.toFixed(2), "-i", mp4, "-vframes", "1", "-vf", "scale=1280:-2", `${outDir}/${b}-${i}-${t.toFixed(1)}s.png`, "-loglevel", "error"]);
  });
  process.stdout.write(`${b}(${dur.toFixed(0)}s) `);
}
console.log(`\n→ ${outDir}/`);
