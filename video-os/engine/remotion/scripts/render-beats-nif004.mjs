// render-beats-nif004.mjs — one clip per NIF004 beat, picture + VO + SFX
// (no baked captions/kinetic text, no transition, no music), for the DaVinci
// Resolve conform (§22.7). Rebuilds the per-beat SFX mixes first unless --no-sfx.
//
//   node scripts/render-beats-nif004.mjs              all 34 → ProRes HQ
//   node scripts/render-beats-nif004.mjs B01,B30      just these
//   node scripts/render-beats-nif004.mjs --h264       fast H.264 review copies
//   node scripts/render-beats-nif004.mjs --no-sfx     skip the sfx-mix rebuild
//   node scripts/render-beats-nif004.mjs --episode    render NIF004-V4 (whole ep)
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { REMOTION_CLI } from "./_remotion.mjs";

const args = process.argv.slice(2);
const h264 = args.includes("--h264");
const episode = args.includes("--episode");
if (!args.includes("--no-sfx")) {
  console.log("— rebuilding per-beat SFX mixes —");
  try { execFileSync(process.execPath, ["scripts/build-sfx-mix-nif004.mjs"], { stdio: "inherit" }); }
  catch { console.log("  (sfx-mix build failed — renders will fall back to silent SFX)"); }
}
const pick = args.find((a) => !a.startsWith("--"));
const only = pick ? pick.split(",").map((s) => s.trim().toUpperCase().replace(/^B?/, "B").replace(/V4$/i, "")) : null;

const ALL = Array.from({ length: 34 }, (_, i) => `B${String(i).padStart(2, "0")}`);
const beats = episode ? [] : only ? ALL.filter((b) => only.includes(b)) : ALL;

const outDir = h264 ? "out/review-nif004" : "out/beats-nif004";
mkdirSync(outDir, { recursive: true });

const codecArgs = h264
  ? ["--codec=h264", "--crf=18", "--audio-codec=aac"]
  : ["--codec=prores", "--prores-profile=hq", "--audio-codec=aac", "--enforce-audio-track"];

const failed = [];
const targets = episode ? [["NIF004-V4", `${outDir}/NIF004-EPISODE.${h264 ? "mp4" : "mov"}`]] : beats.map((b) => [`NIF004-${b}v4`, `${outDir}/NIF004-${b}.${h264 ? "mp4" : "mov"}`]);
for (const [id, out] of targets) {
  process.stdout.write(`${id} → ${out} … `);
  try {
    execFileSync(process.execPath, [REMOTION_CLI, "render", "src/index.ts", id, out, ...codecArgs, "--log=error"], { stdio: ["ignore", "pipe", "pipe"] });
    console.log("ok");
  } catch (e) {
    failed.push(id);
    console.log("FAIL\n" + ((e.stderr || "") + (e.stdout || "")).toString().trim().split("\n").slice(-6).join("\n") + "\n");
  }
}
console.log(failed.length ? `\nFAILED: ${failed.join(" ")}` : `\nall ${targets.length} ok → ${outDir}/`);
process.exit(failed.length ? 1 : 0);
