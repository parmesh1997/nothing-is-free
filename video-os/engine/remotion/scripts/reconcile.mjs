/**
 * reconcile.mjs — Step 2. Real VO durations → 03_transcript/reconcile.json.
 *
 *   node scripts/reconcile.mjs ../../episodes/NIF004
 *
 * ffprobes every 02_narration/B##.mp3, reads each beat's PLAIN word count +
 * density from 01_script/script.md, and writes the per-beat frame geometry
 * (durationInFrames, globalStartFrame) + episode totals. Generic — replaces the
 * NIF002-only reconcile-ep02.mjs. `nothing is built against estimated
 * durations` (runbook §11.3): every beat comp reads its frames from here.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { REMOTION_CLI } from "./_remotion.mjs";

const FPS = 30;
const CAL_WPM = 134;
const epDir = resolve(process.argv[2] ?? "../../episodes/NIF004");
const epCode = epDir.split(/[\\/]/).pop();

const ffprobeDur = (f) =>
  parseFloat(
    execFileSync(process.execPath, [
      REMOTION_CLI, "ffprobe", "-v", "error",
      "-show_entries", "format=duration", "-of", "csv=p=0", f,
    ]).toString().trim(),
  );

// ── parse script.md: per-beat PLAIN words + the header density ───────────────
const md = readFileSync(join(epDir, "01_script/script.md"), "utf8");
const parts = md.split(/^━+ (B\d\d) ━+.*$/m);
const meta = {};
for (let i = 1; i < parts.length; i += 2) {
  const id = parts[i];
  const body = parts[i + 1] || "";
  const hdr = body.split(/\r?\n/).find((l) => /^WORDS\s+\d+/.test(l.trim())) || "";
  const density = (hdr.match(/·\s*([A-Za-z].*?)(?:·|$)/) || [, ""])[1].trim() || "MEDIUM";
  // PLAIN block word count (tags stripped is moot — PLAIN has none)
  const m = /^\s*PLAIN\s*$/m.exec(body);
  let words = 0;
  if (m) {
    const rest = body.slice(m.index + m[0].length).split(/\r?\n/);
    const buf = [];
    for (const raw of rest) {
      const line = raw.trim();
      if (/^(v3 TAGGED|NOTE\b|━|─{3,})/.test(line)) break;
      if (line) buf.push(line);
    }
    words = buf.join(" ").split(/\s+/).filter(Boolean).length;
  }
  meta[id] = { density, words };
}

// ── ffprobe + assemble ──────────────────────────────────────────────────────
const ids = Object.keys(meta).sort();
let start = 0;
let totalWords = 0;
const beats = [];
for (const id of ids) {
  const sec = ffprobeDur(join(epDir, `02_narration/${id}.mp3`));
  const durationInFrames = Math.round(sec * FPS);
  const w = meta[id].words;
  totalWords += w;
  const wpm = w / (sec / 60);
  const delta = ((wpm - CAL_WPM) / CAL_WPM) * 100;
  beats.push({
    id,
    words: w,
    density: meta[id].density,
    durationSeconds: +sec.toFixed(3),
    durationInFrames,
    globalStartFrame: start,
    wpm: +wpm.toFixed(1),
    deltaPctFrom134: +delta.toFixed(1),
    flag: Math.abs(delta) > 15 ? (delta > 0 ? "FAST" : "SLOW") : "",
  });
  start += durationInFrames;
}
const episodeTotalFrames = start;
const totalSeconds = +(episodeTotalFrames / FPS).toFixed(2);
const mmss = `${Math.floor(totalSeconds / 60)}:${String(Math.floor(totalSeconds % 60)).padStart(2, "0")}.${Math.round((totalSeconds % 1) * 10)}`;

const out = {
  episode: epCode,
  fps: FPS,
  calibratedWpmUsedForScript: CAL_WPM,
  reconciledAt: new Date().toISOString().slice(0, 10),
  generatedBy: "scripts/reconcile.mjs (ElevenLabs v3 one-take VO)",
  totalWords,
  totalSeconds,
  totalMMSS: mmss,
  overallWpm: +(totalWords / (totalSeconds / 60)).toFixed(1),
  episodeTotalFrames,
  beats,
};
writeFileSync(join(epDir, "03_transcript/reconcile.json"), JSON.stringify(out, null, 2));

console.log(`${epCode}  ·  ${beats.length} beats  ·  ${mmss}  ·  ${episodeTotalFrames} frames  ·  ${out.overallWpm} wpm`);
for (const b of beats) if (b.flag) console.log(`  ${b.id}  ${b.wpm} wpm  ${b.flag} (${b.deltaPctFrom134 > 0 ? "+" : ""}${b.deltaPctFrom134}%)`);
console.log(`→ 03_transcript/reconcile.json`);
