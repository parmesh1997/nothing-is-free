/**
 * motion-check.mjs — Step 3 audit, on the review proxy. Two anti-slop laws
 * measured by ffmpeg instead of by a model looking at stills:
 *
 *   law 11 · no held state   → freezedetect: any stretch visually unchanged ≥ 3 s
 *   law 2  · shot lengths    → scene-cut detection: every shot between 2 and 9 s
 *
 *   (from engine/remotion/)
 *   node scripts/motion-check.mjs <proxy.mp4> [--episode ../../episodes/NIF0NN]
 *        [--hold 3] [--noise -50dB] [--cut 0.3] [--min 2] [--max 9]
 *
 * Run it on the proxy BEFORE grain is added — grain changes every frame and
 * would hide a frozen picture. With --episode, every finding is mapped to its
 * beat through 03_transcript/timing.json. Exit code 1 when anything fails, so
 * the auditor can gate on it.
 *
 * ffmpeg: $FFMPEG if set, else the Remotion-bundled one (same as transcribe.mjs).
 */
import { spawnSync } from "node:child_process";
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
const epDir = opt("--episode", null);
const hold = parseFloat(opt("--hold", "3"));
const noise = opt("--noise", "-50dB");
const cut = parseFloat(opt("--cut", "0.3"));
const minShot = parseFloat(opt("--min", "2"));
const maxShot = parseFloat(opt("--max", "9"));
const input = args[0];
if (!input) {
  console.error("usage: node scripts/motion-check.mjs <proxy.mp4> [--episode dir] [--hold 3] [--cut 0.3]");
  process.exit(2);
}

let cmd;
if (process.env.FFMPEG) cmd = [process.env.FFMPEG];
else {
  const { REMOTION_CLI } = await import("./_remotion.mjs");
  cmd = [process.execPath, REMOTION_CLI, "ffmpeg"];
}

// one decode pass: freezedetect sees every frame, then select keeps only cuts for showinfo
const vf = `freezedetect=n=${noise}:d=${hold},select='gt(scene,${cut})',showinfo`;
const r = spawnSync(cmd[0], [...cmd.slice(1), "-hide_banner", "-nostats", "-i", input, "-vf", vf, "-an", "-f", "null", "-"], {
  encoding: "utf8",
  maxBuffer: 256 << 20,
});
const log = (r.stderr || "") + (r.stdout || "");
if (r.status !== 0) {
  console.error(log.split("\n").slice(-15).join("\n"));
  process.exit(2);
}

const durM = /Duration: (\d+):(\d+):([\d.]+)/.exec(log);
const total = durM ? +durM[1] * 3600 + +durM[2] * 60 + parseFloat(durM[3]) : NaN;

const freezes = [];
for (const m of log.matchAll(/freeze_start: ([\d.]+)/g)) freezes.push({ start: parseFloat(m[1]), end: NaN });
[...log.matchAll(/freeze_end: ([\d.]+)/g)].forEach((m, i) => freezes[i] && (freezes[i].end = parseFloat(m[1])));
for (const f of freezes) if (!Number.isFinite(f.end)) f.end = total;

const cuts = [...log.matchAll(/\[Parsed_showinfo[^\]]*\][^\n]*pts_time:\s*([\d.]+)/g)].map((m) => parseFloat(m[1]));
const bounds = [0, ...cuts, total].filter(Number.isFinite);
const shots = bounds.slice(1).map((e, i) => ({ start: bounds[i], end: e, len: e - bounds[i] }));

// ── beat lookup ──────────────────────────────────────────────────────────────
let beatAt = () => "";
if (epDir) {
  const t = JSON.parse(readFileSync(join(resolve(epDir), "03_transcript/timing.json"), "utf8"));
  const bs = Object.entries(t.beats).map(([id, b]) => ({ id, s: b.globalStartFrame / t.fps, e: (b.globalStartFrame + b.durationInFrames) / t.fps }));
  beatAt = (sec) => (bs.find((b) => sec >= b.s && sec < b.e) ?? bs.at(-1)).id;
}
const mmss = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
const where = (a, b) => `${mmss(a)}–${mmss(b)}${epDir ? ` · ${beatAt(a)}${beatAt(b - 0.01) !== beatAt(a) ? `→${beatAt(b - 0.01)}` : ""}` : ""}`;

const short = shots.filter((s) => s.len < minShot);
const long = shots.filter((s) => s.len > maxShot);
const lens = shots.map((s) => s.len).sort((a, b) => a - b);

const out = [];
out.push(`motion-check · ${input.split(/[\\/]/).pop()} · ${mmss(total)}`);
out.push("");
out.push(`HELD STATE (law 11, ≥${hold}s unchanged at ${noise}): ${freezes.length ? `FAIL × ${freezes.length}` : "PASS"}`);
for (const f of freezes) out.push(`  ${where(f.start, f.end)}  (${(f.end - f.start).toFixed(1)} s)`);
out.push("");
out.push(
  `SHOT LENGTHS (law 2, ${minShot}–${maxShot}s): ${shots.length} shots · median ${(lens[lens.length >> 1] ?? 0).toFixed(1)} s · ` +
    `${short.length} under · ${long.length} over → ${short.length || long.length ? "REVIEW" : "PASS"}`,
);
for (const s of long) out.push(`  long   ${where(s.start, s.end)}  (${s.len.toFixed(1)} s)  — fails unless it is a declared continuous flow shot (§10.7)`);
for (const s of short) out.push(`  short  ${where(s.start, s.end)}  (${s.len.toFixed(1)} s)`);
console.log(out.join("\n"));
process.exit(freezes.length ? 1 : 0);
