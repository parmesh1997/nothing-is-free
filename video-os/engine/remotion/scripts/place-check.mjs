/**
 * place-check.mjs — Step 3b, Stage & Marks (§9.8). Checks every 2.5D shot's cast placement
 * against the measured marks of its angle, with numbers instead of stills, and writes the
 * placement file Remotion renders from.
 *
 *   (from engine/remotion/)
 *   node scripts/place-check.mjs ../../episodes/NIF0NN [--kits ../../library/locations] [--write]
 *
 * shots.json entries it reads (2.5D shots only):
 *   { "shot": "B05-S2", "tier": "2.5D", "angle": "deli/A07",
 *     "cast": [ { "who": "lucky", "mark": "m0612" },
 *               { "who": "cashier", "mark": "m0915", "feet": "hidden-ok" },
 *               { "who": "walker", "path": ["m0203", "m0903"] } ],
 *     "empty": false }
 *
 * Fails (exit 1) on: an angle with no kit · a mark that does not exist · a mark that is not
 * free, not in title-safe or has the head hidden · feet hidden without "feet": "hidden-ok" ·
 * two cast members closer than 0.6 m · a walk whose straight line crosses an unusable mark ·
 * a 2.5D shot with nobody in it unless "empty": true · one angle used by two shots.
 * With --write, each passing shot gets 05_layers/cams/place-<shot>.json.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  if (i < 0) return d;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const kits = resolve(opt("--kits", "../../library/locations"));
const write = args.includes("--write");
const ep = resolve(args.filter((a) => a !== "--write")[0] ?? ".");

const shotsFile = join(ep, "01_script/shots.json");
const shots = JSON.parse(readFileSync(shotsFile, "utf8"));
const list = (Array.isArray(shots) ? shots : shots.shots).filter((s) => s.tier === "2.5D");

const kitCache = {};
const kitFor = (angle) => {
  if (!(angle in kitCache)) {
    const [loc, a] = angle.split("/");
    const f = join(kits, loc, "kit", `${a}.marks.json`);
    kitCache[angle] = existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : null;
  }
  return kitCache[angle];
};
const usable = (m) => m && m.free && m.in_frame && m.head_visible;
const dist = (a, b) => Math.hypot(a.world[0] - b.world[0], a.world[1] - b.world[1]);

const rows = [];
let failed = 0;
const angleUse = {};
for (const s of list) {
  const errs = [];
  const warn = [];
  if (!s.angle) errs.push("no angle — pick one from the location's kit");
  const kit = s.angle ? kitFor(s.angle) : null;
  if (s.angle && !kit) errs.push(`no kit for ${s.angle}`);
  if (s.angle) (angleUse[s.angle] ??= []).push(s.shot);
  const cast = s.cast ?? [];
  if (!cast.length && !s.empty) errs.push("bare 2.5D shot — add cast or declare \"empty\": true");
  const byId = kit ? Object.fromEntries(kit.marks.map((m) => [m.id, m])) : {};
  const placed = [];
  for (const c of cast) {
    const ids = c.path ?? (c.mark ? [c.mark] : []);
    if (!ids.length) {
      errs.push(`${c.who}: no mark`);
      continue;
    }
    const ms = ids.map((id) => byId[id]);
    ids.forEach((id, k) => {
      const m = ms[k];
      if (!m) errs.push(`${c.who}: mark ${id} not in kit`);
      else if (!usable(m)) errs.push(`${c.who}: ${id} is ${!m.free ? "not free" : !m.in_frame ? "outside title-safe" : "head hidden"}`);
      else if (!m.feet_visible && c.feet !== "hidden-ok") errs.push(`${c.who}: feet hidden at ${id} — mark "feet": "hidden-ok" or move`);
    });
    if (c.path && ms.every(Boolean) && kit) {
      // every grid mark within half a spacing of the straight walk line must be usable
      const [a, b] = [ms[0], ms[ms.length - 1]];
      const L = dist(a, b);
      const sp = kit.spacing_m ?? 0.5;
      for (const m of kit.marks) {
        const t = ((m.world[0] - a.world[0]) * (b.world[0] - a.world[0]) + (m.world[1] - a.world[1]) * (b.world[1] - a.world[1])) / (L * L || 1);
        if (t <= 0 || t >= 1) continue;
        const px = a.world[0] + t * (b.world[0] - a.world[0]);
        const py = a.world[1] + t * (b.world[1] - a.world[1]);
        if (Math.hypot(m.world[0] - px, m.world[1] - py) < sp / 2 && !m.free) {
          errs.push(`${c.who}: walk ${ids[0]}→${ids.at(-1)} crosses ${m.id} (not free)`);
          break;
        }
      }
    }
    if (ms[0]) placed.push({ who: c.who, m: ms[0], c });
  }
  for (let i = 0; i < placed.length; i++)
    for (let j = i + 1; j < placed.length; j++)
      if (dist(placed[i].m, placed[j].m) < 0.6) errs.push(`${placed[i].who} and ${placed[j].who} closer than 0.6 m`);
  const lit = placed.filter((p) => p.m.lit).length;
  if (placed.length && !lit) warn.push("nobody stands in a lit pool");

  if (errs.length) failed++;
  rows.push(`| ${s.shot} | ${s.angle ?? "—"} | ${placed.map((p) => `${p.who}@${p.m.id}${p.m.lit ? "☼" : ""}`).join(" ") || "—"} | ${errs.length ? "FAIL: " + errs.join("; ") : "PASS"}${warn.length ? " · " + warn.join("; ") : ""} |`);

  if (write && !errs.length && kit) {
    const dir = join(ep, "05_layers/cams");
    mkdirSync(dir, { recursive: true });
    const out = {
      shot: s.shot, angle: s.angle, camera: kit.camera,
      cast: placed.map(({ who, m, c }) => ({
        who, mark: m.id, foot: m.foot, px_per_m: m.px_per_m, lit: !!m.lit, light_x: m.light_x ?? null,
        dist_m: m.dist_m, feet_visible: m.feet_visible,
        path: c.path ? c.path.map((id) => byId[id].foot) : null,
      })),
    };
    writeFileSync(join(dir, `place-${s.shot}.json`), JSON.stringify(out, null, 1));
  }
}
for (const [a, used] of Object.entries(angleUse))
  if (used.length > 1) {
    failed++;
    rows.push(`| ${used.join(", ")} | ${a} | — | FAIL: one angle used by ${used.length} shots (§9.7) |`);
  }

console.log(`place-check · ${list.length} 2.5D shots · ${failed ? `${failed} FAIL` : "all PASS"}\n`);
console.log("| Shot | Angle | Cast (☼ = in a pool) | Result |\n| --- | --- | --- | --- |");
console.log(rows.join("\n"));
process.exit(failed ? 1 : 0);
