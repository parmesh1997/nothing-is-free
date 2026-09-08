// fast H.264 review renders → out/review/NIF002-B##.mp4
// usage: node scripts/_review-render.mjs [B05,B06,...]   (default: all)
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { REMOTION_CLI } from "./_remotion.mjs";
import timing from "../src/nif002/timing.json" with { type: "json" };

mkdirSync("out/review", { recursive: true });
const only = process.argv[2] ? process.argv[2].split(",") : null;
const skipExisting = process.argv.includes("--skip-existing");
const ids = Object.keys(timing.beats).filter((id) => !only || only.includes(id));

let failed = [];
for (const id of ids) {
  const out = `out/review/NIF002-${id}.mp4`;
  if (skipExisting && existsSync(out)) {
    console.log(`${id} … skip (exists)`);
    continue;
  }
  process.stdout.write(`${id} … `);
  try {
    execFileSync(
      process.execPath,
      [REMOTION_CLI, "render", `NIF002-${id}`, out, "--codec=h264", "--log=error", "--concurrency=2"],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    console.log("ok");
  } catch (e) {
    failed.push(id);
    const msg = ((e.stderr || "") + (e.stdout || "")).toString().trim().split("\n").slice(-8).join("\n");
    console.log("FAIL\n" + (msg || e.message) + "\n");
  }
}
console.log(failed.length ? `\nFAILED: ${failed.join(" ")}` : "\nall ok");
process.exit(failed.length ? 1 : 0);
