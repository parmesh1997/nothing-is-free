/**
 * dip-map.mjs — Step 0 postmortem and Step 5 review. A retention moment is a
 * timestamp; a lesson needs a beat. This turns one into the other.
 *
 *   (from engine/remotion/)
 *   node scripts/dip-map.mjs ../../episodes/NIF009 0:30 2:14 5:40
 *   node scripts/dip-map.mjs ../../episodes/NIF009 --csv retention.csv [--top 3]
 *
 * Timestamps are the ones YouTube Studio prints under Engagement → Audience
 * retention → key moments (intro, dips, spikes). With --csv it reads the curve
 * itself — rows of `elapsedVideoTimeRatio,audienceWatchRatio` as returned by the
 * YouTube Analytics API — and finds the steepest drops and the spikes on its own.
 *
 * For each moment: the beat, how far into the beat, and the words spoken in a
 * ±3 s window, from 03_transcript/timing.json. Output is a markdown table ready
 * to paste into 10_review/review.md or 00_intake/postmortem.md.
 */
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(name);
  if (i < 0) return dflt;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const csv = opt("--csv", null);
const top = parseInt(opt("--top", "3"), 10);
const win = parseFloat(opt("--window", "3"));
const epDir = args.shift();
if (!epDir) {
  console.error("usage: node scripts/dip-map.mjs <episodeDir> <m:ss> … | --csv file.csv [--top 3]");
  process.exit(1);
}

const timing = JSON.parse(readFileSync(join(resolve(epDir), "03_transcript/timing.json"), "utf8"));
const fps = timing.fps;
const beats = Object.entries(timing.beats)
  .map(([id, b]) => ({ id, ...b }))
  .sort((a, b) => a.globalStartFrame - b.globalStartFrame);
const totalSec = (timing.episodeTotalFrames ?? beats.at(-1).globalStartFrame + beats.at(-1).durationInFrames) / fps;

const toSec = (s) => s.split(":").reduce((acc, p) => acc * 60 + parseFloat(p), 0);
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

/** moments: [{ sec, kind, note }] */
const moments = [];
if (csv) {
  const rows = readFileSync(csv, "utf8")
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.split(",").map((c) => c.trim()))
    .filter((c) => c.length >= 2 && Number.isFinite(parseFloat(c[0])) && Number.isFinite(parseFloat(c[1])))
    .map((c) => ({ r: parseFloat(c[0]), w: parseFloat(c[1]) }))
    .sort((a, b) => a.r - b.r);
  // ignore the first 3% — every video loses people there; the intro is reported on its own
  const steps = rows.slice(1).map((p, i) => ({ r: p.r, d: p.w - rows[i].w, w: p.w })).filter((s) => s.r > 0.03);
  const intro = rows.reduce((best, p) => (Math.abs(p.r * totalSec - 30) < Math.abs(best.r * totalSec - 30) ? p : best), rows[0]);
  moments.push({ sec: 30, kind: "intro", note: `${(intro.w * 100).toFixed(0)}% still watching at 0:30` });
  for (const s of [...steps].sort((a, b) => a.d - b.d).slice(0, top))
    moments.push({ sec: s.r * totalSec, kind: "dip", note: `${(s.d * 100).toFixed(1)} pts` });
  for (const s of [...steps].sort((a, b) => b.d - a.d).slice(0, top).filter((s) => s.d > 0))
    moments.push({ sec: s.r * totalSec, kind: "spike", note: `+${(s.d * 100).toFixed(1)} pts` });
} else {
  for (const a of args) moments.push({ sec: toSec(a), kind: "moment", note: "" });
}
moments.sort((a, b) => a.sec - b.sec);

const rows = moments.map((m) => {
  const f = m.sec * fps;
  const beat = beats.find((b) => f >= b.globalStartFrame && f < b.globalStartFrame + b.durationInFrames) ?? beats.at(-1);
  const local = f - beat.globalStartFrame;
  const lo = local - win * fps;
  const hi = local + win * fps;
  const words = (beat.words || []).filter((w) => w.end >= lo && w.start <= hi).map((w) => w.t).join(" ");
  const pct = Math.round((100 * local) / beat.durationInFrames);
  return `| ${mmss(m.sec)} (${Math.round((100 * m.sec) / totalSec)}%) | ${m.kind}${m.note ? ` · ${m.note}` : ""} | ${beat.id} · ${pct}% in | "${words}" |`;
});

console.log(`Retention moments → beats · ${resolve(epDir).split(/[\\/]/).pop()} · ${mmss(totalSec)} · ${fps} fps\n`);
console.log("| At | Moment | Beat | Spoken (±" + win + " s) |");
console.log("| --- | --- | --- | --- |");
console.log(rows.join("\n"));
