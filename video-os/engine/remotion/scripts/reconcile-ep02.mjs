/**
 * reconcile-ep02.mjs — Step 2 (§10) for EP02.
 *
 * Measures every EP02/Audio/B##.mp3, parses the PLAIN word count per beat from
 * EP02_01_SCRIPT.md, computes real durationInFrames @ 30fps, globalStartFrame,
 * cumulative timecode and delivered WPM, flags WPM outliers, concatenates a
 * master track, and writes reconcile.json + a boundary log.
 *
 *   node scripts/reconcile-ep02.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { REMOTION_CLI } from "./_remotion.mjs";

const FPS = 30;
const EP = "../EP02";
const AUDIO = `${EP}/Audio`;
const N = 28;

const ff = (args) =>
  execFileSync(process.execPath, [REMOTION_CLI, ...args], { encoding: "utf8" });

// --- word counts from the PLAIN blocks -------------------------------------
const script = readFileSync(`${EP}/EP02_01_SCRIPT.md`, "utf8");
const wordCounts = {};
for (let i = 0; i < N; i++) {
  const id = "B" + String(i).padStart(2, "0");
  const re = new RegExp(`━━━ ${id} ━[\\s\\S]*?\\nPLAIN\\n([\\s\\S]*?)\\n\\s*v3 TAGGED`, "m");
  const mm = script.match(re);
  if (!mm) { wordCounts[id] = null; continue; }
  const words = mm[1]
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
  wordCounts[id] = words;
}

// --- durations ------------------------------------------------------------
const rows = [];
let cumFrames = 0;
let totalWords = 0;
let totalDur = 0;
for (let i = 0; i < N; i++) {
  const id = "B" + String(i).padStart(2, "0");
  const f = `${AUDIO}/${id}.mp3`;
  const out = ff(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]);
  const dur = parseFloat(out.trim());
  const frames = Math.round(dur * FPS);
  const words = wordCounts[id];
  const wpm = words ? words / (dur / 60) : null;
  rows.push({
    id,
    words,
    durationSec: +dur.toFixed(3),
    durationInFrames: frames,
    globalStartFrame: cumFrames,
    startTimecode: fmt(cumFrames / FPS),
    wpm: wpm ? +wpm.toFixed(1) : null,
  });
  cumFrames += frames;
  totalWords += words || 0;
  totalDur += dur;
}
const episodeTotalFrames = cumFrames;
const overallWpm = totalWords / (totalDur / 60);

// --- WPM flags: > ±15% of the delivered set mean ------------------------
const meanWpm = overallWpm;
for (const r of rows) {
  if (r.wpm == null) { r.flag = "no-wordcount"; continue; }
  const dev = (r.wpm - meanWpm) / meanWpm;
  r.deviation = +(dev * 100).toFixed(1);
  r.flag = Math.abs(dev) > 0.15 ? (dev > 0 ? "FAST >15%" : "SLOW >15%") : "";
}

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
}

// --- master concat + boundary log --------------------------------------
const listPath = `${AUDIO}/_concat.txt`;
writeFileSync(
  listPath,
  rows.map((r) => `file '${r.id}.mp3'`).join("\n") + "\n",
);
ff(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", `${EP}/EP02_master.mp3`]);

const result = {
  episode: "EP02",
  fps: FPS,
  measuredAt: "see git / file mtime",
  totalWords,
  totalDurationSec: +totalDur.toFixed(3),
  totalTimecode: fmt(totalDur),
  episodeTotalFrames,
  overallWpm: +overallWpm.toFixed(1),
  beats: rows,
};
writeFileSync(`${EP}/reconcile.json`, JSON.stringify(result, null, 2));

// --- print --------------------------------------------------------------
console.log("ID   words  dur(s)  frames   gStart   start@   wpm    flag");
for (const r of rows) {
  console.log(
    r.id.padEnd(4),
    String(r.words).padStart(5),
    String(r.durationSec).padStart(7),
    String(r.durationInFrames).padStart(7),
    String(r.globalStartFrame).padStart(8),
    r.startTimecode.padStart(8),
    String(r.wpm).padStart(6),
    "  " + (r.flag || ""),
  );
}
console.log("---");
console.log("TOTAL words        ", totalWords);
console.log("TOTAL duration     ", fmt(totalDur), `(${totalDur.toFixed(1)}s)`);
console.log("episodeTotalFrames ", episodeTotalFrames);
console.log("overall delivered  ", overallWpm.toFixed(1), "wpm");
console.log("wrote", `${EP}/reconcile.json`, "and", `${EP}/EP02_master.mp3`);
