// Render the NIF002-B##v4 beats.
//   node scripts/render-v4.mjs                → h264 review copies → out/review/
//   node scripts/render-v4.mjs B07 B11        → just those (h264)
//   node scripts/render-v4.mjs --prores       → ProRes 422 HQ master → out/master/ (DaVinci conform)
//   node scripts/render-v4.mjs --prores B25   → just B25 as ProRes
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";

const cli = "node_modules/@remotion/cli/remotion-cli.js";
const args = process.argv.slice(2);
const prores = args.includes("--prores");
const only = args.filter((a) => /^B\d\d$/.test(a));

const outDir = prores ? "out/master" : "out/review";
const ext = prores ? "mov" : "mp4";
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const codecArgs = prores
  ? ["--codec=prores", "--prores-profile=hq", "--log=error", "--concurrency=4"]
  : ["--codec=h264", "--log=error", "--concurrency=6"];

const beats = Array.from({ length: 28 }, (_, i) => `B${String(i).padStart(2, "0")}`)
  .filter((b) => only.length === 0 || only.includes(b));

const started = Date.now();
const results = [];
for (const b of beats) {
  const comp = `NIF002-${b}v4`;
  const out = `${outDir}/${comp}.${ext}`;
  const t0 = Date.now();
  process.stdout.write(`\n▶ ${comp} … `);
  const r = spawnSync("node", [cli, "render", comp, out, ...codecArgs], { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  const ok = r.status === 0 && existsSync(out);
  results.push({ b, ok, secs });
  process.stdout.write(ok ? `done (${secs}s)` : `FAIL (${r.status})\n${(r.stderr || "").split("\n").filter((l) => l && !/404|Failed to load/.test(l)).slice(-6).join("\n")}`);
}

console.log(`\n\n=== render-v4 (${prores ? "ProRes HQ" : "h264"}) complete in ${((Date.now() - started) / 60000).toFixed(1)} min → ${outDir}/ ===`);
for (const { b, ok, secs } of results) console.log(`${ok ? "  ok " : "FAIL "}${b}  ${secs}s`);
const failed = results.filter((r) => !r.ok).map((r) => r.b);
if (failed.length) {
  console.log(`\nFAILED: ${failed.join(" ")}`);
  process.exit(1);
}
