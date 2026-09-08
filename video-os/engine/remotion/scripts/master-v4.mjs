// Assemble the shippable NIF002 master WITHOUT DaVinci — the runbook's
// "FFmpeg produces the shippable master" path (v2.0 D5).
//
// The 28 NIF002-B##v4 beats already carry: the VO track, baked grain, and an
// ~8f fade-to-cream at both edges (V4Beat) — so a plain hard concat gives a
// soft dissolve-through-cream at every cut. This script just lays them end to
// end and makes a YouTube-ready H.264.
//
//   node scripts/master-v4.mjs                 → ProRes concat + H.264 delivery (VO only)
//   node scripts/master-v4.mjs --review        → use out/review/*.mp4 instead of out/master/*.mov
//   node scripts/master-v4.mjs --music bed.wav → mix a music bed under the VO (static -18 dB, then loudnorm)
//   node scripts/master-v4.mjs --music bed.wav --sfx fx.wav
//
// Bundled ffmpeg is --disable-filters: no acrossfade / sidechaincompress, so
// music ducking here is a fixed level, not dynamic. For a hand-mixed bed use
// DaVinci/Audition or a full ffmpeg and feed the result back as --music.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const A = process.argv.slice(2);
const review = A.includes("--review");
const musicPath = A.includes("--music") ? A[A.indexOf("--music") + 1] : null;
const sfxPath = A.includes("--sfx") ? A[A.indexOf("--sfx") + 1] : null;

const ff = "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const ffprobe = "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe";
const cli = "node_modules/@remotion/cli/remotion-cli.js";
const srcDir = review ? "out/review" : "out/master";
const ext = review ? "mp4" : "mov";
const outDir = "../../episodes/NIF002/09_master";
mkdirSync(outDir, { recursive: true });

// If the SFX/music beds are switched on in audio.tsx, the ONLY way to bake them
// is to render the full NIF002-V4 composition (cues are episode-global). A
// concat of the silent per-beat renders can't carry them.
const audioSrc = (() => { try { return readFileSync("src/nif002/v4/audio.tsx", "utf8"); } catch { return ""; } })();
const sfxAll = /^\s*const ALL_SFX = true/m.test(audioSrc);
const musicOn = /^\s*const MUSIC = true/m.test(audioSrc);
const havePartial = /^\s*const HAVE: readonly Sfx\[\] = \[\s*["']/m.test(audioSrc);
const audioOn = sfxAll || musicOn || havePartial;
// guard: flags on but the files aren't there yet → the NIF002-V4 render throws
// on the first missing <Audio>. Fall back to the silent concat + tell them.
if (audioOn && !A.includes("--concat")) {
  const need = [];
  if (musicOn) need.push("public/audio/nif002/music/bed.mp3");
  if (sfxAll) ["tap","whoosh","thunk","plip","tick","coin","stamp","drone","chime-warm","chime-bright","boom","glitch","lock","switch","footsteps"].forEach((s) => need.push(`public/audio/nif002/sfx/${s}.mp3`));
  const absent = need.filter((p) => !existsSync(p));
  if (absent.length) {
    console.log(`⚠ audio.tsx has the beds ON but ${absent.length} file(s) are missing:`);
    absent.slice(0, 6).forEach((p) => console.log("   " + p));
    if (absent.length > 6) console.log(`   …and ${absent.length - 6} more`);
    console.log("→ falling back to the SILENT concat (VO only). Add the files (08_conform/AUDIO-GET-THESE.md) and re-run.\n");
    A.push("--concat");
  }
}
if ((audioOn || A.includes("--full")) && !A.includes("--concat")) {
  console.log("audio beds are ON in audio.tsx → rendering the full NIF002-V4 composition (SFX+music baked)…");
  const out = `${outDir}/NIF002_v1.mp4`;
  const r = spawnSync("node", [cli, "render", "NIF002-V4", resolve(out),
    "--codec=h264", "--crf=18", "--x264-preset=slow", "--enforce-audio-track",
    "--audio-codec=aac", "--audio-bitrate=320k", "--concurrency=4", "--log=info"],
    { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
  // loudnorm pass on the muxed audio
  const norm = `${outDir}/NIF002_v1_norm.mp4`;
  const n = spawnSync(ff, ["-y", "-i", resolve(out), "-c:v", "copy",
    "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "320k",
    "-movflags", "+faststart", resolve(norm)], { stdio: "inherit" });
  console.log(n.status === 0 ? `\n✅ master → ${norm}  (loudnorm'd; ${out} is the pre-norm)` : `\n⚠ rendered ${out} but loudnorm pass failed`);
  console.log("\n   YouTube upload: mark 'Altered or synthetic content' = YES");
  process.exit(n.status ?? 0);
}

const beats = Array.from({ length: 28 }, (_, i) => `${srcDir}/NIF002-B${String(i).padStart(2, "0")}v4.${ext}`);
const missing = beats.filter((b) => !existsSync(b));
if (missing.length) {
  console.log("MISSING:", missing.map((m) => m.split("/").pop()).join(" "));
  console.log(`render first: node scripts/render-v4.mjs${review ? "" : " --prores"}`);
  process.exit(1);
}

const probe = (f, sel, key) => {
  const r = spawnSync(ffprobe, ["-v", "error", "-select_streams", sel, "-show_entries", key, "-of", "csv=p=0", f], { encoding: "utf8" });
  return (r.stdout || "").trim();
};
const durs = beats.map((b) => parseFloat(probe(b, "v:0", "format=duration")) || 0);
const total = durs.reduce((a, b) => a + b, 0);
console.log(`28 beats · ${Math.floor(total / 60)}:${String(Math.round(total % 60)).padStart(2, "0")} (${total.toFixed(1)}s)`);

// ── 1. concat (stream copy) ──────────────────────────────────────────────────
writeFileSync(`${srcDir}/_master_concat.txt`, beats.map((b) => `file '${b.split("/").pop()}'`).join("\n") + "\n");
const concatOut = review ? `${srcDir}/_NIF002-concat.mp4` : `${outDir}/NIF002_master.mov`;
const cc = spawnSync(ff, ["-y", "-f", "concat", "-safe", "0", "-i", "_master_concat.txt", "-c", "copy", "-movflags", "+faststart", resolve(concatOut)], { cwd: srcDir, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
if (cc.status !== 0) {
  console.log("concat (copy) failed:\n", (cc.stderr || "").split("\n").slice(-6).join("\n"));
  process.exit(1);
}
console.log(`concat  → ${concatOut}`);

// ── 2. audio: VO (from concat) + optional music/sfx, then loudnorm ───────────
const deliverMp4 = `${outDir}/NIF002_v1.mp4`;
const vArgs = ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-x264-params", "keyint=60:min-keyint=60", "-movflags", "+faststart"];

let aFilter, extraInputs = [];
if (musicPath || sfxPath) {
  // [0:a] VO   [1:a] music (-18dB)   [2:a] sfx (-12dB)  → amix → loudnorm
  const parts = ["[0:a]aresample=48000[vo]"];
  const mixIns = ["[vo]"];
  let idx = 1;
  if (musicPath) { extraInputs.push("-i", musicPath); parts.push(`[${idx}:a]volume=-18dB,aresample=48000[mus]`); mixIns.push("[mus]"); idx++; }
  if (sfxPath) { extraInputs.push("-i", sfxPath); parts.push(`[${idx}:a]volume=-12dB,aresample=48000[fx]`); mixIns.push("[fx]"); idx++; }
  aFilter = parts.join(";") + `;${mixIns.join("")}amix=inputs=${mixIns.length}:duration=first:normalize=0[mix];[mix]loudnorm=I=-14:TP=-1.5:LRA=11[a]`;
} else {
  aFilter = "[0:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]";
}

const enc = spawnSync(ff, [
  "-y", "-i", resolve(concatOut), ...extraInputs,
  "-filter_complex", aFilter,
  "-map", "0:v", "-map", "[a]",
  ...vArgs, "-c:a", "aac", "-b:a", "320k",
  resolve(deliverMp4),
], { cwd: srcDir, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
if (enc.status !== 0) {
  console.log("H.264 encode failed:\n", (enc.stderr || "").split("\n").slice(-10).join("\n"));
  process.exit(1);
}

const outDur = probe(resolve(deliverMp4), "v:0", "format=duration");
const outSize = probe(resolve(deliverMp4), "v:0", "format=size");
console.log(`\n✅ master  → ${deliverMp4}`);
console.log(`   ${(+outDur).toFixed(1)}s · ${(+outSize / 1e6).toFixed(0)} MB · H.264 1080p · loudnorm I=-14 TP=-1.5`);
console.log(musicPath ? `   audio: VO + music${sfxPath ? " + sfx" : ""}` : "   audio: VO only (add --music later)");
console.log("\n   YouTube upload: mark 'Altered or synthetic content' = YES (per channels/nif/ON_AI.md)");
