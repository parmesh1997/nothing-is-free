// audit-stills-nif004.mjs — render a few stills per NIF004 beat for the
// by-eye audit (§22.7.1). Uses `remotion still` (no video encode) so it's fast.
//
//   node scripts/audit-stills-nif004.mjs              all 34, 4 frames each
//   node scripts/audit-stills-nif004.mjs B00,B30      just these
//   node scripts/audit-stills-nif004.mjs --fracs 0.15,0.4,0.65,0.9
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { REMOTION_CLI } from "./_remotion.mjs";

// [id, durationInFrames] — from reconcile.json
const TABLE = [
  ["B00", 493], ["B01", 882], ["B02", 1093], ["B03", 884], ["B04", 1081], ["B05", 1107],
  ["B06", 1079], ["B07", 901], ["B08", 1191], ["B09", 1110], ["B10", 1389], ["B11", 920],
  ["B12", 784], ["B13", 637], ["B14", 827], ["B15", 1038], ["B16", 764], ["B17", 748],
  ["B18", 1168], ["B19", 949], ["B20", 942], ["B21", 1038], ["B22", 654], ["B23", 1470],
  ["B24", 1114], ["B25", 834], ["B26", 892], ["B27", 1052], ["B28", 748], ["B29", 657],
  ["B30", 1186], ["B31", 748], ["B32", 678], ["B33", 596],
];

const args = process.argv.slice(2);
let fracs = [0.2, 0.45, 0.7, 0.92];
const fi = args.indexOf("--fracs");
if (fi >= 0) { fracs = args[fi + 1].split(",").map(Number); args.splice(fi, 2); }
const pick = args.find((a) => !a.startsWith("--"));
const only = pick ? pick.split(",").map((s) => s.trim().toUpperCase().replace(/^B?/, "B")) : null;

const outDir = "out/audit-nif004";
mkdirSync(outDir, { recursive: true });

const beats = TABLE.filter(([b]) => !only || only.includes(b));
const failed = [];
for (const [b, dur] of beats) {
  for (const fr of fracs) {
    const frame = Math.max(0, Math.min(dur - 1, Math.round(dur * fr)));
    const out = `${outDir}/${b}_f${String(frame).padStart(4, "0")}.png`;
    process.stdout.write(`${b} @${frame} … `);
    try {
      execFileSync(process.execPath, [REMOTION_CLI, "still", "src/index.ts", `NIF004-${b}v4`, out, `--frame=${frame}`, "--log=error"], { stdio: ["ignore", "pipe", "pipe"] });
      console.log("ok");
    } catch (e) {
      failed.push(`${b}@${frame}`);
      console.log("FAIL\n" + ((e.stderr || "") + (e.stdout || "")).toString().trim().split("\n").slice(-5).join("\n") + "\n");
    }
  }
}
console.log(failed.length ? `\nFAILED: ${failed.join(" ")}` : `\nall ok → ${outDir}/`);
process.exit(failed.length ? 1 : 0);
