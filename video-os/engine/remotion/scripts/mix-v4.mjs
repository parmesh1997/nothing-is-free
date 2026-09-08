// Dynamic audio mix for NIF002 — the music rides by episode position (never
// fights the wall-to-wall VO), swells on the reversal, lifts into the CTA.
// All audio-domain (no video decode), 2-pass LINEAR loudnorm (keeps the moves).
//
//   node scripts/mix-v4.mjs          → out/master/NIF002_mixed.mov (video + mix)
//   node scripts/mix-v4.mjs --wav    → also out/master/NIF002-mix.wav (mix alone, for Resolve)
import { spawnSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";

const ff = "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const ffprobe = "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe";
const FPS = 30;
const alsoWav = process.argv.includes("--wav");
const R = (p) => resolve(p);

const video = "out/master/NIF002_full.mov";
const vo = "out/master/NIF002-vo.wav";       // VO stem (extract from video if absent)
const sfx = "out/master/NIF002-sfx.wav";     // SFX stem (render NIF002-SFX)
const music = "public/audio/nif002/music/bed.mp3";
if (!existsSync(video)) { console.log(`missing ${video}`); process.exit(1); }
if (!existsSync(sfx)) { console.log(`missing ${sfx} — render NIF002-SFX first`); process.exit(1); }
if (!existsSync(music)) { console.log(`missing ${music}`); process.exit(1); }
if (!existsSync(vo)) {
  console.log("extracting VO stem…");
  spawnSync(ff, ["-y", "-i", R(video), "-vn", "-c:a", "pcm_s24le", R(vo)], { stdio: "inherit" });
}

const dur = parseFloat(spawnSync(ffprobe, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", R(video)], { encoding: "utf8" }).stdout);

// pre-bake the music to ONE clean 48k stereo WAV of the exact length — looping
// a 44.1k mp3 inside the mix filtergraph wrecks the timestamps (measured).
const musLoop = "out/master/_music_loop.wav";
console.log("pre-baking the looped music bed…");
{
  const mk = spawnSync(ff, [
    "-y", "-stream_loop", "-1", "-i", R(music),
    "-t", `${dur}`, "-af", "aresample=48000", "-ac", "2", "-c:a", "pcm_s24le", R(musLoop),
  ], { stdio: "inherit" });
  if (mk.status !== 0 || !existsSync(musLoop)) { console.log("music pre-bake failed"); process.exit(1); }
}

// ── the music envelope (position-based; 4 knobs) ────────────────────────────
const s = (f) => (f / FPS).toFixed(1);
const MUS_OPEN = 0.12;  // ≈ −18 dB  B00–B02
const MUS_MID = 0.045;  // ≈ −27 dB  B03–B23 dense explainer
const MUS_END = 0.12;   // ≈ −18 dB  B24 → out
const TOTAL = 30573;
const b03 = 2564, b24 = 25638, b25 = 26969, inv = 26969 + 1019, sub = 29434 + 1042;
const base =
  `if(lt(t,${s(b03)}),${MUS_OPEN},` +
  `if(lt(t,${s(b03 + 90)}),${MUS_OPEN}+(${MUS_MID}-${MUS_OPEN})*(t-${s(b03)})/3,` +
  `if(lt(t,${s(b24 - 90)}),${MUS_MID},` +
  `if(lt(t,${s(b24)}),${MUS_MID}+(${MUS_END}-${MUS_MID})*(t-${s(b24 - 90)})/3,${MUS_END}))))`;
const moves =
  `if(between(t,${s(b25 + 8)},${s(b25 + 232)}),0.12,` +   // B25 black: bed almost gone
  `if(between(t,${s(inv - 12)},${s(inv + 250)}),2.1,` +    // +6.5 dB swell on YOU ARE THE INVENTORY
  `if(gt(t,${s(sub - 24)}),1.5,1)))`;                       // +3.5 dB lift into SUBSCRIBE
const outro = `if(gt(t,${s(TOTAL - 72)}),max(0,1-(t-${s(TOTAL - 72)})/2.2),1)`;
const musVol = `(${base})*(${moves})*(${outro})`;

// raw mix graph: VO @0dB + enveloped music + SFX stem → amix  (all clean 48k WAVs)
const rawGraph =
  `[0:a]volume=1.0[vo];` +
  `[1:a]volume='${musVol}':eval=frame[mus];` +
  `[2:a]anull[fx];` +
  `[vo][mus][fx]amix=inputs=3:duration=first:normalize=0:dropout_transition=0`;
const ins = ["-i", R(vo), "-i", R(musLoop), "-i", R(sfx)];

// ── pass 1: measure ────────────────────────────────────────────────────────
console.log("mix pass 1/2 — measuring the raw mix…");
const m = spawnSync(ff, [
  "-y", ...ins,
  "-filter_complex", `${rawGraph},loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json[a]`,
  "-map", "[a]", "-t", `${dur}`, "-f", "null", process.platform === "win32" ? "NUL" : "/dev/null",
], { encoding: "utf8" });
const jm = (m.stderr || "").match(/\{\s*"input_i"[\s\S]*?\}/);
if (!jm) { console.log("measure failed:\n", (m.stderr || "").split("\n").slice(-15).join("\n")); process.exit(1); }
const L = JSON.parse(jm[0]);
console.log(`   raw: I=${L.input_i}  TP=${L.input_tp}  LRA=${L.input_lra}  thresh=${L.input_thresh}`);

// ── pass 2: linear normalise → NIF002-mix.wav ──────────────────────────────
const norm =
  `loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:measured_I=${L.input_i}:measured_TP=${L.input_tp}` +
  `:measured_LRA=${L.input_lra}:measured_thresh=${L.input_thresh}:offset=${L.target_offset},aresample=48000`;
const mixWav = "out/master/NIF002-mix.wav";
console.log("mix pass 2/2 — writing NIF002-mix.wav…");
let r = spawnSync(ff, [
  "-y", ...ins, "-filter_complex", `${rawGraph},${norm}[a]`,
  "-map", "[a]", "-t", `${dur}`, "-c:a", "pcm_s24le", R(mixWav),
], { stdio: "inherit" });
if (r.status !== 0) { console.log("pass 2 failed"); process.exit(1); }

// ── mux the mix onto the picture ──────────────────────────────────────────
const out = "out/master/NIF002_mixed.mov";
console.log("muxing mix onto the picture…");
r = spawnSync(ff, [
  "-y", "-i", R(video), "-i", R(mixWav),
  "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "pcm_s24le", "-shortest", R(out),
], { stdio: "inherit" });
if (r.status !== 0) { console.log("mux failed"); process.exit(1); }

console.log(`\n✅ ${out}`);
if (alsoWav) console.log(`✅ ${mixWav}  (mix alone — for Resolve)`);
else { try { unlinkSync(mixWav); } catch {} }
console.log("\nnext:  node scripts/hevc-master.mjs");
