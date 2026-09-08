// Final HEVC master encode — the exact creator spec (2026-09-04):
// QuickTime · H.265 Main10 (10-bit) · ~30 Mbps VBR 2-pass · preset slower · faststart · 1080p30.
//
// Input is the Resolve-graded + Super-Scaled ProRes (out/master/NIF002_graded.mov),
// or fall back to the ungraded full render (out/master/NIF002_full.mov).
//
//   node scripts/hevc-master.mjs               → uses NIF002_graded.mov if present, else NIF002_full.mov
//   node scripts/hevc-master.mjs <input.mov>   → explicit input
//   node scripts/hevc-master.mjs --nvenc       → hevc_nvenc (GPU, faster, single-pass) instead of libx265
//
// libx265 is in the bundled Remotion ffmpeg (verified: `-encoders | grep 265`).
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";

const ff = "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const ffprobe = "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe";
const A = process.argv.slice(2);
const nvenc = A.includes("--nvenc");
const explicit = A.find((a) => a.endsWith(".mov") || a.endsWith(".mp4"));
// optional separate audio (skip the 28 GB mux): --audio out/master/NIF002-mix.wav
const audioI = A.includes("--audio") ? A[A.indexOf("--audio") + 1]
  : (!explicit && existsSync("out/master/NIF002-mix.wav") && !existsSync("out/master/NIF002_graded.mov"))
    ? "out/master/NIF002-mix.wav" : null;

const input =
  explicit ||
  (existsSync("out/master/NIF002_graded.mov") ? "out/master/NIF002_graded.mov" :
   audioI ? "out/master/NIF002_full.mov" :
   existsSync("out/master/NIF002_mixed.mov") ? "out/master/NIF002_mixed.mov" :
   "out/master/NIF002_full.mov");
if (!existsSync(input)) {
  console.log(`no input — expected ${input}. Render it first (Resolve → ProRes, or scripts/render-v4 NIF002-V4).`);
  process.exit(1);
}
if (audioI) console.log(`audio: ${audioI} (separate)`);
const outDir = "../../episodes/NIF002/09_master";
mkdirSync(outDir, { recursive: true });
const out = `${outDir}/NIF002_master.mov`;

const dur = parseFloat(spawnSync(ffprobe, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", input], { encoding: "utf8" }).stdout || "0");
console.log(`input:  ${input}  (${dur.toFixed(1)}s)`);
console.log(`output: ${out}\n`);

const common = [
  "-vf", "scale=1920:1080:flags=lanczos,format=yuv420p10le",
  "-r", "30",
  "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
  // hevc_nvenc drops transfer/primaries from the VUI even with the flags above
  // (only the matrix sticks) — force the full BT.709 VUI into the bitstream.
  "-bsf:v", "hevc_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1",
  "-tag:v", "hvc1", "-movflags", "+faststart",
  "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
];

const vIn = ["-i", resolve(input)];
const aIn = audioI ? ["-i", resolve(audioI)] : [];
const aMap = audioI ? ["-map", "0:v:0", "-map", "1:a:0"] : ["-map", "0:v:0", "-map", "0:a:0?"];

let rc;
if (nvenc) {
  console.log("encoding: hevc_nvenc (GPU), main10, ~30 Mbps VBR-HQ, single pass…");
  rc = spawnSync(ff, [
    "-y", ...vIn, ...aIn,
    "-c:v", "hevc_nvenc", "-preset", "p7", "-tune", "hq", "-profile:v", "main10", "-rc", "vbr",
    "-b:v", "30M", "-maxrate", "38M", "-bufsize", "60M", "-multipass", "fullres", "-spatial_aq", "1",
    ...aMap, ...common, resolve(out),
  ], { stdio: "inherit" });
} else {
  console.log("encoding: libx265, main10, 30 Mbps 2-pass, preset slower — this is the slow one, grab a coffee…");
  const passlog = resolve("out/master/_x265pass");
  const x265 = (pass) => `pass=${pass}:stats='${passlog.replace(/\\/g, "/")}':vbv-maxrate=34000:vbv-bufsize=60000`;
  const p1 = spawnSync(ff, [
    "-y", ...vIn,
    "-vf", "scale=1920:1080:flags=lanczos,format=yuv420p10le", "-r", "30",
    "-c:v", "libx265", "-preset", "slower", "-profile:v", "main10",
    "-b:v", "30M", "-x265-params", x265(1),
    "-an", "-f", "null", process.platform === "win32" ? "NUL" : "/dev/null",
  ], { stdio: "inherit" });
  if (p1.status !== 0) { console.log("pass 1 failed"); process.exit(1); }
  rc = spawnSync(ff, [
    "-y", ...vIn, ...aIn,
    "-c:v", "libx265", "-preset", "slower", "-profile:v", "main10",
    "-b:v", "30M", "-x265-params", x265(2),
    ...aMap, ...common, resolve(out),
  ], { stdio: "inherit" });
  ["", ".cutree"].forEach((s) => { try { unlinkSync(passlog + s); } catch {} });
}

if (rc.status !== 0) { console.log("\nHEVC encode failed."); process.exit(1); }

const oProbe = spawnSync(ffprobe, ["-v", "error", "-show_entries", "format=duration,size,bit_rate", "-show_entries", "stream=codec_name,profile,width,height,pix_fmt", "-of", "default=nw=1", resolve(out)], { encoding: "utf8" }).stdout;
console.log(`\n✅ ${out}\n${oProbe}`);
console.log("YouTube upload: 'Altered or synthetic content' = YES  ·  attach the WhisperX .srt");
