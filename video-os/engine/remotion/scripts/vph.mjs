/**
 * vph.mjs — Step 0. The evidence gate (runbook §6.2), measured by us, not read
 * off a badge.
 *
 *   (from engine/remotion/)
 *   node scripts/vph.mjs <url|id> [<url|id> …] [--baseline 15] [--out <file.md>]
 *   node scripts/vph.mjs --json cand1.json cand2.json      (pre-fetched yt-dlp -J output)
 *
 * For every candidate:
 *   1. `yt-dlp -J --skip-download` → views, publish time, channel
 *   2. lifetime views/hour = views ÷ hours since publish
 *   3. the channel baseline: median views of its last N uploads (flat playlist),
 *      the candidate excluded → the outlier multiple
 *   4. the verdict against the §6.2 floor table
 *
 * Prints one compact markdown table and nothing else, so a session reads ten
 * lines instead of ten pages of JSON. yt-dlp must be on PATH (it already is for
 * §6.1 transcripts). Reading only: no login, no cookies, nothing spent.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

// ── the §6.2 floor table. Change it here AND in the runbook, same commit. ────
const DAY = 24;
const BANDS = [
  { name: "≤3 mo", maxDays: 92, floor: 80, strong: 100 },
  { name: "3–12 mo", maxDays: 366, floor: 20, strong: 40 },
  { name: ">12 mo", maxDays: Infinity, floor: 20, strong: 40 },
];
const MIN_MULTIPLE = 3; // views vs the channel's median upload

const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = args.indexOf(name);
  if (i < 0) return dflt;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const baselineN = parseInt(flag("--baseline", "15"), 10);
const outFile = flag("--out", null);
const jsonMode = args.includes("--json");
const inputs = args.filter((a) => a !== "--json");
if (!inputs.length) {
  console.error("usage: node scripts/vph.mjs <url|id> … [--baseline 15] [--out file.md]");
  process.exit(1);
}

const ytdlp = (a) =>
  JSON.parse(
    execFileSync("yt-dlp", a, { encoding: "utf8", maxBuffer: 64 << 20, stdio: ["ignore", "pipe", "ignore"] }),
  );
const toUrl = (s) => (/^https?:/.test(s) ? s : `https://www.youtube.com/watch?v=${s}`);

const median = (xs) => {
  const s = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!s.length) return NaN;
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const publishedAt = (v) => {
  if (v.timestamp) return { ms: v.timestamp * 1000, exact: true };
  if (v.release_timestamp) return { ms: v.release_timestamp * 1000, exact: true };
  const d = v.upload_date; // YYYYMMDD, no time of day → ±12 h
  if (d) return { ms: Date.UTC(+d.slice(0, 4), +d.slice(4, 6) - 1, +d.slice(6, 8), 12), exact: false };
  return null;
};

const fmt = (n, d = 0) =>
  Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d }) : "—";

const rows = [];
for (const input of inputs) {
  let v;
  try {
    v = jsonMode ? JSON.parse(readFileSync(input, "utf8")) : ytdlp(["-J", "--skip-download", toUrl(input)]);
  } catch (e) {
    rows.push({ title: input, verdict: `ERROR — ${String(e.message).split("\n")[0]}` });
    continue;
  }
  const pub = publishedAt(v);
  const hours = pub ? (Date.now() - pub.ms) / 3600e3 : NaN;
  const days = hours / DAY;
  const views = v.view_count;
  const vph = views / hours;
  const band = BANDS.find((b) => days <= b.maxDays);

  // baseline: the channel's last N uploads, candidate excluded
  let base = NaN;
  let baseCount = 0;
  if (Array.isArray(v._baseline_views)) {
    base = median(v._baseline_views); // test hook / offline mode
    baseCount = v._baseline_views.length;
  } else if (!jsonMode && v.channel_url && baselineN > 0) {
    try {
      const pl = ytdlp(["-J", "--flat-playlist", "--playlist-end", String(baselineN + 1), `${v.channel_url}/videos`]);
      const others = (pl.entries || []).filter((e) => e.id !== v.id).slice(0, baselineN);
      const counts = others.map((e) => e.view_count).filter(Number.isFinite);
      base = median(counts);
      baseCount = counts.length;
    } catch {
      /* baseline unavailable → reported as — */
    }
  }
  const multiple = views / base;

  const fails = [];
  if (!Number.isFinite(vph)) fails.push("no publish time");
  else if (vph < band.floor) fails.push(`VPH < ${band.floor}`);
  if (!Number.isFinite(multiple)) fails.push("baseline n/a — check vidIQ outlier score");
  else if (multiple < MIN_MULTIPLE) fails.push(`< ${MIN_MULTIPLE}× baseline`);
  const verdict = fails.length
    ? fails.every((f) => f.startsWith("baseline n/a")) ? "PASS on VPH · multiple unverified" : `FAIL (${fails.join("; ")})`
    : vph >= band.strong ? "PASS · strong" : "PASS";

  rows.push({
    title: (v.title || input).slice(0, 60),
    channel: (v.channel || v.uploader || "—").slice(0, 28),
    age: Number.isFinite(days) ? `${fmt(days)} d${pub.exact ? "" : "~"}` : "—",
    band: band ? band.name : "—",
    views: fmt(views),
    vph: fmt(vph, 1),
    base: Number.isFinite(base) ? `${fmt(base)} (n=${baseCount})` : "—",
    multiple: Number.isFinite(multiple) ? `${fmt(multiple, 1)}×` : "—",
    verdict,
    url: v.webpage_url || (v.id ? toUrl(v.id) : toUrl(input)),
  });
}

const head = "| Video | Channel | Age | Band | Views | VPH | Baseline median | Multiple | Verdict |";
const lines = [
  `Evidence gate — measured ${new Date().toISOString().slice(0, 16)}Z · floors: ` +
    BANDS.map((b) => `${b.name} ≥${b.floor}`).join(", ") + ` VPH · multiple ≥${MIN_MULTIPLE}×`,
  "",
  head,
  "| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |",
  ...rows.map((r) =>
    r.channel
      ? `| [${r.title}](${r.url}) | ${r.channel} | ${r.age} | ${r.band} | ${r.views} | ${r.vph} | ${r.base} | ${r.multiple} | ${r.verdict} |`
      : `| ${r.title} | — | — | — | — | — | — | — | ${r.verdict} |`,
  ),
  "",
  "`~` = publish date only (±12 h). Baseline = median views of the channel's last uploads,",
  "candidate excluded; recent uploads pull it down, so a borderline multiple is re-checked against vidIQ's outlier score.",
];
const text = lines.join("\n");
console.log(text);
if (outFile) writeFileSync(outFile, text + "\n");
