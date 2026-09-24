/**
 * vtt-clean.mjs — Step 0. Turn a competitor's YouTube auto-subs into plain text
 * a session can read cheaply.
 *
 *   yt-dlp --skip-download --write-auto-subs --sub-langs en --sub-format vtt -o "comp/%(id)s" <url>
 *   node scripts/vtt-clean.mjs comp/<id>.en.vtt [--every 30] [> comp/<id>.txt]
 *
 * Auto-subs are "rolling": every cue repeats the line before it and carries
 * per-word <00:00:01.234><c> tags, so the raw file is roughly three times the
 * words actually spoken. This keeps each spoken word once and drops a [m:ss]
 * marker every N seconds (default 30) so a structure note can still point at
 * a moment in the video.
 */
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const i = args.indexOf("--every");
const every = i >= 0 ? parseFloat(args.splice(i, 2)[1]) : 30;
const file = args[0];
if (!file) {
  console.error("usage: node scripts/vtt-clean.mjs <file.vtt> [--every 30]");
  process.exit(1);
}

const toSec = (ts) => {
  const p = ts.split(":").map(parseFloat);
  return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1];
};
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const raw = readFileSync(file, "utf8").replace(/\r/g, "");
const blocks = raw.split(/\n\n+/);
const out = [];
let last = "";
let nextMark = 0;
for (const b of blocks) {
  const lines = b.split("\n");
  const ti = lines.findIndex((l) => l.includes("-->"));
  if (ti < 0) continue;
  const start = toSec(lines[ti].split("-->")[0].trim());
  for (const l of lines.slice(ti + 1)) {
    const text = l.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!text || text === last) continue;
    // a rolling cue often starts with the previous line: keep only what's new
    const fresh = last && text.startsWith(last) ? text.slice(last.length).trim() : text;
    last = text;
    if (!fresh) continue;
    if (start >= nextMark) {
      out.push(`\n[${mmss(start)}]`);
      nextMark = (Math.floor(start / every) + 1) * every;
    }
    out.push(fresh);
  }
}
const txt = out.join(" ").replace(/ \n/g, "\n").trim();
console.log(txt);
const words = txt.split(/\s+/).filter((w) => !/^\[\d+:\d\d\]$/.test(w)).length;
console.error(`vtt-clean: ${words} words (raw file ${raw.length.toLocaleString()} chars → ${txt.length.toLocaleString()})`);
