/**
 * transcribe.mjs — v2.0 Step 4. Local whisper.cpp, word-level VO timing.
 *
 *   (from engine/remotion/)  node scripts/transcribe.mjs <episodeDir>
 *   node scripts/transcribe.mjs ../../episodes/NIF002
 *
 * For every 02_narration/B##.(mp3|wav):
 *   1. convert to 16 kHz mono s16le wav (whisper.cpp requires this)
 *   2. transcribe with tokenLevelTimestamps → accurate per-word timings
 *   3. toCaptions() → Caption[] {text, startMs, endMs, confidence}
 * Writes 03_transcript/words/B##.json (per beat) and 03_transcript/transcript.json.
 *
 * Prebuilt whisper.cpp binaries are fetched for win32 — no compiler needed.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import { REMOTION_CLI } from "./_remotion.mjs";

const ffmpeg = (args) =>
  execFileSync(process.execPath, [REMOTION_CLI, "ffmpeg", ...args], { stdio: "pipe" });
const ffprobeDur = (f) =>
  parseFloat(
    execFileSync(process.execPath, [REMOTION_CLI, "ffprobe", "-v", "error",
      "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).trim(),
  );

const WHISPER_VERSION = "1.5.5";
const MODEL = "medium.en";

const epDir = resolve(process.argv[2] ?? "../../episodes/NIF002");
const narrDir = join(epDir, "02_narration");
const outDir = join(epDir, "03_transcript");
const wordsDir = join(outDir, "words");
const whisperDir = resolve(".whisper");
mkdirSync(wordsDir, { recursive: true });

console.log("installing whisper.cpp", WHISPER_VERSION);
await installWhisperCpp({ to: whisperDir, version: WHISPER_VERSION });
console.log("downloading model", MODEL);
await downloadWhisperModel({ model: MODEL, folder: whisperDir });

const beats = readdirSync(narrDir).filter((f) => /^B\d\d\.(mp3|wav)$/i.test(f)).sort();
const transcript = { version: "2.0", model: MODEL, whisper: WHISPER_VERSION, fps: 30, beats: {} };

for (const file of beats) {
  const id = file.slice(0, 3);
  const src = join(narrDir, file);
  const wav = join(outDir, `${id}_16k.wav`);
  ffmpeg(["-y", "-i", src, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav]);

  const out = await transcribe({
    model: MODEL,
    whisperPath: whisperDir,
    whisperCppVersion: WHISPER_VERSION,
    inputPath: wav,
    tokenLevelTimestamps: true,
  });
  const { captions } = toCaptions({ whisperCppOutput: out });
  writeFileSync(join(wordsDir, `${id}.json`), JSON.stringify(captions, null, 2));

  const words = captions.map((c) => ({
    t: c.text.trim(),
    s: Math.round(c.startMs),
    e: Math.round(c.endMs),
    c: c.confidence == null ? null : +c.confidence.toFixed(2),
  }));
  transcript.beats[id] = {
    file,
    durationSec: +ffprobeDur(src).toFixed(3),
    words,
    lowConfidence: words.map((w, i) => ({ ...w, i })).filter((w) => w.c != null && w.c < 0.6),
  };
  const lc = transcript.beats[id].lowConfidence.length;
  console.log(`  ${id}  ${words.length} words${lc ? `  (${lc} low-confidence)` : ""}`);
  if (existsSync(wav)) rmSync(wav);
}

writeFileSync(join(outDir, "transcript.json"), JSON.stringify(transcript, null, 2));
console.log("\nwrote", join(outDir, "transcript.json"));
