// render-nif004-final.mjs — render every NIF004 beat H.264 to out/nif004-final/
// (a fresh dir so the re-render isn't blocked by DaVinci Resolve holding the
// files in out/review-nif004/ open). SFX mixes are assumed already rebuilt.
//   node scripts/render-nif004-final.mjs            all 34
//   node scripts/render-nif004-final.mjs B14,B21    just these
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { REMOTION_CLI } from "./_remotion.mjs";

const args = process.argv.slice(2);
const pick = args.find((a) => !a.startsWith("--"));
const only = pick ? pick.split(",").map((s) => s.trim().toUpperCase().replace(/^B?/, "B").replace(/V4$/i, "")) : null;
const ALL = Array.from({ length: 34 }, (_, i) => `B${String(i).padStart(2, "0")}`);
const beats = only ? ALL.filter((b) => only.includes(b)) : ALL;

const outDir = "out/nif004-final";
mkdirSync(outDir, { recursive: true });

const failed = [];
for (const b of beats) {
  const id = `NIF004-${b}v4`;
  const out = `${outDir}/NIF004-${b}.mp4`;
  process.stdout.write(`${id} → ${out} … `);
  try {
    execFileSync(process.execPath, [REMOTION_CLI, "render", "src/index.ts", id, out, "--codec=h264", "--crf=18", "--audio-codec=aac", "--log=error"], { stdio: ["ignore", "pipe", "pipe"] });
    console.log("ok");
  } catch (e) {
    failed.push(id);
    console.log("FAIL\n" + ((e.stderr || "") + (e.stdout || "")).toString().trim().split("\n").slice(-6).join("\n") + "\n");
  }
}
console.log(failed.length ? `\nFAILED: ${failed.join(" ")}` : `\nall ${beats.length} ok → ${outDir}/`);
process.exit(failed.length ? 1 : 0);
