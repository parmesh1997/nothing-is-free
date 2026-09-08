// One command: NIF002 picture → finished HEVC master.
// Assumes  out/master/NIF002_full.mov  exists (render NIF002-V4, VO-only, prores).
//
//   node scripts/finish-v4.mjs           → SFX stem · dynamic mix · HEVC master
//   node scripts/finish-v4.mjs --nvenc   → GPU HEVC (fast) instead of libx265 2-pass
//
// Output: episodes/NIF002/09_master/NIF002_master.mov  + stems in out/master/
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const cli = "node_modules/@remotion/cli/remotion-cli.js";
const ff = "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const nvenc = process.argv.includes("--nvenc");
const run = (cmd, args, label) => {
  console.log(`\n── ${label} ──`);
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) { console.log(`FAILED: ${label}`); process.exit(r.status ?? 1); }
};

if (!existsSync("out/master/NIF002_full.mov")) {
  console.log("missing out/master/NIF002_full.mov");
  console.log("→ node node_modules/@remotion/cli/remotion-cli.js render NIF002-V4 out/master/NIF002_full.mov --codec=prores --prores-profile=hq --audio-codec=aac --enforce-audio-track");
  process.exit(1);
}

// 1. SFX-only stem
if (!existsSync("out/master/NIF002-sfx.wav")) {
  run("node", [cli, "render", "NIF002-SFX", "out/master/NIF002-sfx.wav", "--log=error"], "SFX stem → NIF002-sfx.wav");
} else console.log("\n── SFX stem: cached ──");

// 2. VO stem (extract from the picture render — for the Resolve AI-Assistant option)
if (!existsSync("out/master/NIF002-vo.wav")) {
  run(ff, ["-y", "-i", "out/master/NIF002_full.mov", "-vn", "-c:a", "pcm_s24le", "out/master/NIF002-vo.wav"], "VO stem → NIF002-vo.wav");
}

// 3. dynamic mix → NIF002_mixed.mov (+ NIF002-mix.wav)
run("node", ["scripts/mix-v4.mjs", "--wav"], "dynamic mix (music rides + SFX → −14 LUFS)");

// 4. HEVC master
run("node", ["scripts/hevc-master.mjs", ...(nvenc ? ["--nvenc"] : [])], "HEVC master (QuickTime · H.265 Main10 · 30 Mbps)");

console.log("\n════════════════════════════════════════");
console.log("  episodes/NIF002/09_master/NIF002_master.mov");
console.log("  stems: out/master/NIF002-{vo,sfx,mix}.wav");
console.log("  Resolve polish (optional): davinci-finish-guide.md");
console.log("════════════════════════════════════════");
