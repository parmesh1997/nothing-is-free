// build-sfx-mix-nif004.mjs — bake each NIF004 beat's SFX cues into ONE mixed mp3.
//
// Reads NIF004_SFX from src/nif004/v4/audio.tsx (the single source of truth),
// and for each beat writes public/audio/nif004/sfx-mix/B##.mp3 — every one-shot
// delayed to its frame time and summed. <BeatSfx> then plays that one file,
// which avoids the many-<Audio>-tags Chrome crash on full-length renders.
//
//   node scripts/build-sfx-mix-nif004.mjs           # all 34
//   node scripts/build-sfx-mix-nif004.mjs B01,B30   # just these
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const FF = join(require.resolve("@remotion/compositor-win32-x64-msvc/package.json"), "..", "ffmpeg.exe");
const FPS = 30;
const SFX_DIR = "public/audio/nif004/sfx";
const OUT_DIR = "public/audio/nif004/sfx-mix";
mkdirSync(OUT_DIR, { recursive: true });

// pull NIF004_SFX out of audio.tsx without importing TS
const src = readFileSync("src/nif004/v4/audio.tsx", "utf8");
const grab = (name) => {
  const m = src.match(new RegExp(`export const ${name}[^=]*=\\s*({[\\s\\S]*?\\n});`, "m"));
  if (!m) throw new Error(`can't find ${name} in audio.tsx`);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict";return (${m[1]})`)();
};
const SFX = grab("NIF004_SFX");

// beat durations from reconcile.json (for padding the mix to full length)
const recon = JSON.parse(readFileSync("../../episodes/NIF004/03_transcript/reconcile.json", "utf8"));
const DUR = Object.fromEntries(recon.beats.map((b) => [b.id, b.durationInFrames]));

const only = process.argv[2] ? process.argv[2].split(",").map((s) => s.trim().toUpperCase()) : null;
const beats = Object.keys(SFX).filter((b) => !only || only.includes(b));

let failed = [];
for (const beat of beats) {
  const cues = SFX[beat];
  if (!cues?.length) continue;
  const durF = DUR[beat] ?? 1200;
  const lastCueMs = Math.max(...cues.map((c) => (c.at / FPS) * 1000));
  const totalMs = Math.min(Math.round((durF / FPS) * 1000), Math.round(lastCueMs) + 3500);
  const out = join(OUT_DIR, `${beat}.mp3`);

  const inputs = [];
  const filters = [];
  cues.forEach((c, i) => {
    inputs.push("-i", join(SFX_DIR, `${c.s}.mp3`));
    const ms = Math.max(0, Math.round((c.at / FPS) * 1000));
    const g = c.g ?? -14;
    filters.push(`[${i}:a]adelay=${ms}|${ms},volume=${g}dB[a${i}]`);
  });
  const mixIn = cues.map((_, i) => `[a${i}]`).join("");
  filters.push(`${mixIn}amix=inputs=${cues.length}:duration=longest:normalize=0,apad=whole_dur=${totalMs}ms,atrim=0:${totalMs / 1000},aresample=48000[out]`);

  process.stdout.write(`${beat} (${cues.length} cues) … `);
  try {
    execFileSync(FF, ["-y", ...inputs, "-filter_complex", filters.join(";"), "-map", "[out]", "-ac", "2", "-ar", "48000", "-b:a", "128k", out], { stdio: ["ignore", "pipe", "pipe"] });
    console.log("ok");
  } catch (e) {
    failed.push(beat);
    console.log("FAIL\n" + ((e.stderr || "") + (e.stdout || "")).toString().split("\n").slice(-6).join("\n"));
  }
}
writeFileSync(join(OUT_DIR, "_manifest.json"), JSON.stringify({ built: new Date().toISOString(), beats: beats.filter((b) => !failed.includes(b)) }, null, 2));
console.log(failed.length ? `\nFAILED: ${failed.join(" ")}` : `\nall ${beats.length} ok → ${OUT_DIR}/`);
process.exit(failed.length ? 1 : 0);
