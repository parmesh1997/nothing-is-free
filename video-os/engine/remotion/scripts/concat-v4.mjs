// Concat the 28 NIF002-B##v4 beat renders into one episode file.
//
// The bundled Remotion ffmpeg is built --disable-filters (no xfade / blend /
// fade), so a true cross-dissolve isn't possible here. Instead every beat bakes
// a ~8f edge-fade to/from the field colour (V4Beat), so a plain hard concat
// gives a soft dissolve-through-cream at each cut + the clean tail the creator
// asked for. Real dissolves, if wanted, are a 2-min job in the DaVinci finish.
//
// concat demuxer, stream copy — instant, lossless.
import { spawnSync } from "node:child_process";
import { existsSync, writeFileSync, readdirSync } from "node:fs";

const dir = "out/review";
const ff = "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const ffprobe = "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe";

const beats = Array.from({ length: 28 }, (_, i) => `${dir}/NIF002-B${String(i).padStart(2, "0")}v4.mp4`);
const missing = beats.filter((b) => !existsSync(b));
if (missing.length) {
  console.log("MISSING:", missing.map((m) => m.split("/").pop()).join(" "));
  process.exit(1);
}

const durOf = (f) => {
  const r = spawnSync(ffprobe, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" });
  return parseFloat((r.stdout || "0").trim()) || 0;
};
const lens = beats.map(durOf);
const total = lens.reduce((a, b) => a + b, 0);
console.log("durations:", lens.map((n) => n.toFixed(1)).join(" "));
console.log(`→ episode ${Math.floor(total / 60)}:${String(Math.round(total % 60)).padStart(2, "0")}  (${total.toFixed(1)}s)`);

writeFileSync(`${dir}/_concat.txt`, beats.map((b) => `file '${b.split("/").pop()}'`).join("\n") + "\n");

const r = spawnSync(
  ff,
  ["-y", "-f", "concat", "-safe", "0", "-i", "_concat.txt", "-c", "copy", "-movflags", "+faststart", "NIF002-FULL.mp4"],
  { cwd: dir, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" },
);
if (r.status !== 0) {
  console.log("stream-copy concat failed, re-encoding…\n", (r.stderr || "").split("\n").slice(-8).join("\n"));
  const r2 = spawnSync(
    ff,
    ["-y", "-f", "concat", "-safe", "0", "-i", "_concat.txt", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "NIF002-FULL.mp4"],
    { cwd: dir, stdio: "inherit" },
  );
  process.exit(r2.status ?? 1);
}
console.log(readdirSync(dir).includes("NIF002-FULL.mp4") ? `OK → ${dir}/NIF002-FULL.mp4` : "no output");
