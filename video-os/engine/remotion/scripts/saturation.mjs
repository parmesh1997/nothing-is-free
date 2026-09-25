/**
 * saturation.mjs — Step 0c (§6.2.1). "Is this already saturated, and is our angle still
 * open?" answered from YouTube's own search results, not from a feeling.
 *
 *   (from engine/remotion/)
 *   node scripts/saturation.mjs "why is movie theater popcorn so expensive" "cinema popcorn price" \
 *        [--n 30] [--deep 12] [--out ../../episodes/NIF0NN/00_intake/saturation.md]
 *   node scripts/saturation.mjs --json fixture.json          (offline: {query: {entries: [...]}})
 *
 * Per query it reads the top N search results (yt-dlp, flat) and reports:
 *   demand      top and median views of what YouTube already ranks for it
 *   crowding    how many results are near-copies of the query (title word overlap ≥ 0.5)
 *   channels    how many different channels hold the top N (few = a couple of owners)
 *   our angle   how many titles already frame it as a mystery ("who", "culprit", "not who
 *               you think"…) — the thing that would make us a copy instead of a first mover
 *   recency     with --deep K: publish dates of the top K, so a topic everyone did three
 *               years ago reads differently from one everyone did last month
 *
 * The verdict is a heuristic for Round 1, never the gate itself: the evidence gate (§6.2)
 * and the case test (§6.2.1) decide.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  if (i < 0) return d;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const N = parseInt(opt("--n", "30"), 10);
const DEEP = parseInt(opt("--deep", "0"), 10);
const outFile = opt("--out", null);
const fixture = opt("--json", null);
const queries = args;
if (!queries.length && !fixture) {
  console.error('usage: node scripts/saturation.mjs "<query>" ["<query>" …] [--n 30] [--deep 12] [--out file.md]');
  process.exit(1);
}

const ytdlp = (a) =>
  JSON.parse(execFileSync("yt-dlp", a, { encoding: "utf8", maxBuffer: 64 << 20, stdio: ["ignore", "pipe", "ignore"] }));
const STOP = new Set("a an the is are was why how what who your you to of in on for so and or it its does do this that with".split(" "));
const words = (s) => new Set(s.toLowerCase().replace(/[^a-z0-9$ ]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w)));
const overlap = (a, b) => {
  const A = words(a), B = words(b);
  const inter = [...A].filter((w) => B.has(w)).length;
  return inter / Math.max(1, Math.min(A.size, B.size));
};
const MYSTERY = /\b(who|whom|culprit|suspect|mystery|whodunit|not who you think|someone|somebody|behind)\b/i;
const median = (xs) => {
  const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
  return s.length ? (s.length % 2 ? s[s.length >> 1] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : NaN;
};
const fmt = (n) => (Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "—");

const data = fixture ? JSON.parse(readFileSync(fixture, "utf8")) : null;
const lines = [`Saturation check · ${new Date().toISOString().slice(0, 10)} · top ${N} results per query`, ""];
for (const q of fixture ? Object.keys(data) : queries) {
  let entries;
  try {
    entries = fixture ? data[q].entries : ytdlp(["-J", "--flat-playlist", `ytsearch${N}:${q}`]).entries ?? [];
  } catch (e) {
    lines.push(`### "${q}"\nERROR — ${String(e.message).split("\n")[0]}\n`);
    continue;
  }
  entries = entries.filter((e) => e && e.title).slice(0, N);
  const views = entries.map((e) => e.view_count);
  const copies = entries.filter((e) => overlap(q, e.title) >= 0.5);
  const mystery = entries.filter((e) => MYSTERY.test(e.title));
  const channels = new Set(entries.map((e) => e.channel || e.uploader || e.channel_id)).size;
  const top = Math.max(...views.filter(Number.isFinite), 0);
  const med = median(views);

  let recent = null;
  if (DEEP > 0 && !fixture) {
    const cutoff = Date.now() - 365 * 86400e3;
    const dated = [];
    for (const e of entries.slice(0, DEEP)) {
      try {
        const v = ytdlp(["-J", "--skip-download", `https://www.youtube.com/watch?v=${e.id}`]);
        const ts = v.timestamp ? v.timestamp * 1000 : v.upload_date ? Date.parse(`${v.upload_date.slice(0, 4)}-${v.upload_date.slice(4, 6)}-${v.upload_date.slice(6, 8)}`) : NaN;
        dated.push({ ts, views: v.view_count });
      } catch { /* skip */ }
    }
    const inYear = dated.filter((d) => d.ts >= cutoff);
    recent = { checked: dated.length, inYear: inYear.length, medViews: median(inYear.map((d) => d.views)) };
  } else if (fixture && entries.some((e) => e._days !== undefined)) {
    const inYear = entries.slice(0, DEEP || N).filter((e) => e._days <= 365);
    recent = { checked: Math.min(DEEP || N, entries.length), inYear: inYear.length, medViews: median(inYear.map((e) => e.view_count)) };
  }

  const verdict = [];
  if (top < 50_000) verdict.push("LOW DEMAND — nobody ranks big for this; the evidence gate will likely fail");
  if (mystery.length >= 3) verdict.push(`ANGLE TAKEN — ${mystery.length} titles already frame it as a mystery; we would be a copy`);
  else if (copies.length >= 10) verdict.push(`TOPIC CROWDED, ANGLE OPEN — ${copies.length} near-copies all give the same answer: the red herring is ready-made`);
  else if (top >= 50_000) verdict.push("OPEN — demand exists and the mystery angle is unclaimed");
  if (channels <= 5) verdict.push(`${channels} channels own the top ${entries.length}: hard to displace in search, still fine for Browse`);

  lines.push(`### "${q}"`);
  lines.push(`| Demand (top · median views) | Near-copies | Channels | Mystery-framed | Last 12 months |`);
  lines.push(`| --- | --- | --- | --- | --- |`);
  lines.push(`| ${fmt(top)} · ${fmt(med)} | ${copies.length} of ${entries.length} | ${channels} | ${mystery.length} | ${recent ? `${recent.inYear} of ${recent.checked} checked · median ${fmt(recent.medViews)}` : "— (use --deep)"} |`);
  lines.push("");
  lines.push(`**${verdict.join(" · ") || "No signal"}**`);
  if (mystery.length) lines.push(`Mystery-framed titles: ${mystery.slice(0, 5).map((e) => `"${e.title}" (${fmt(e.view_count)})`).join("; ")}`);
  lines.push("");
}
const text = lines.join("\n");
console.log(text);
if (outFile) writeFileSync(outFile, text + "\n");
