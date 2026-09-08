// render-beats-nif003.mjs — one clip per NIF003 beat, picture + VO + SFX
// (no baked captions/kinetic text, no transition), for the DaVinci Resolve
// conform (§22.7). Rebuilds the per-beat SFX mixes first unless --no-sfx.
//
//   node scripts/render-beats-nif003.mjs              all 33 → ProRes HQ
//   node scripts/render-beats-nif003.mjs B01,B02      just these
//   node scripts/render-beats-nif003.mjs --h264       fast H.264 review copies
//   node scripts/render-beats-nif003.mjs --no-sfx     skip the sfx-mix rebuild
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { REMOTION_CLI } from "./_remotion.mjs";

const args = process.argv.slice(2);
const h264 = args.includes("--h264");
if (!args.includes("--no-sfx")) {
  console.log("— rebuilding per-beat SFX mixes —");
  try { execFileSync(process.execPath, ["scripts/build-sfx-mix.mjs"], { stdio: "inherit" }); }
  catch { console.log("  (sfx-mix build failed — renders will fall back to silent SFX)"); }
}
const pick = args.find((a) => !a.startsWith("--"));
const only = pick ? pick.split(",").map((s) => s.trim().toUpperCase().replace(/^B?/, "B").replace(/V4$/i, "")) : null;

const ALL = Array.from({ length: 33 }, (_, i) => `B${String(i).padStart(2, "0")}`);
const beats = only ? ALL.filter((b) => only.includes(b)) : ALL;

const outDir = h264 ? "out/review" : "out/beats";
mkdirSync(outDir, { recursive: true });

const failed = [];
for (const b of beats) {
  const id = `NIF003-${b}v4`;
  const out = h264 ? `${outDir}/NIF003-${b}.mp4` : `${outDir}/NIF003-${b}.mov`;
  const codecArgs = h264
    ? ["--codec=h264", "--crf=18", "--audio-codec=aac"]
    : ["--codec=prores", "--prores-profile=hq", "--audio-codec=aac", "--enforce-audio-track"];
  process.stdout.write(`${id} → ${out} … `);
  try {
    execFileSync(process.execPath, [REMOTION_CLI, "render", "src/index.ts", id, out, ...codecArgs, "--log=error"], { stdio: ["ignore", "pipe", "pipe"] });
    console.log("ok");
  } catch (e) {
    failed.push(b);
    console.log("FAIL\n" + ((e.stderr || "") + (e.stdout || "")).toString().trim().split("\n").slice(-6).join("\n") + "\n");
  }
}
console.log(failed.length ? `\nFAILED: ${failed.join(" ")}` : `\nall ${beats.length} ok → ${outDir}/`);
process.exit(failed.length ? 1 : 0);
