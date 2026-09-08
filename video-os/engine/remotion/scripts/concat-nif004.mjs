// concat-nif004.mjs — stitch the 34 per-beat NIF004 clips end-to-end into one
// full-episode file (hard cuts; add cross-dissolves in Resolve). Stream-copy
// when the inputs share codec params (they do — same render settings).
//
//   node scripts/concat-nif004.mjs            # out/review-nif004/*.mp4  → NIF004-EPISODE.mp4
//   node scripts/concat-nif004.mjs --prores   # out/beats-nif004/*.mov  → NIF004-EPISODE.mov
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const FF = join(require.resolve("@remotion/compositor-win32-x64-msvc/package.json"), "..", "ffmpeg.exe");

const prores = process.argv.includes("--prores");
const dir = prores ? "out/beats-nif004" : "out/review-nif004";
const ext = prores ? "mov" : "mp4";
const beats = Array.from({ length: 34 }, (_, i) => `${dir}/NIF004-B${String(i).padStart(2, "0")}.${ext}`);

const missing = beats.filter((f) => !existsSync(f));
if (missing.length) {
  console.log("MISSING:", missing.join(" "));
  console.log(`render first: node scripts/render-beats-nif004.mjs${prores ? "" : " --h264"}`);
  process.exit(1);
}

const listFile = `${dir}/_concat.txt`;
writeFileSync(listFile, beats.map((f) => `file '${f.split("/").pop()}'`).join("\n") + "\n");

const out = `${dir}/NIF004-EPISODE.${ext}`;
console.log(`concatenating 34 beats → ${out}`);
try {
  execFileSync(FF, ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", "-movflags", "+faststart", out], { stdio: ["ignore", "pipe", "pipe"] });
} catch {
  console.log("stream-copy failed, re-encoding…");
  execFileSync(FF, ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c:v", prores ? "prores_ks" : "libx264", "-crf", "18", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], { stdio: "inherit" });
}
const probe = execFileSync(FF.replace("ffmpeg.exe", "ffprobe.exe"), ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], { encoding: "utf8" }).trim();
console.log(`done — ${out}  (${(Number(probe) / 60).toFixed(2)} min)`);
