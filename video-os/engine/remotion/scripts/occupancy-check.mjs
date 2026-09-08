/**
 * occupancy-check.mjs — run the occupancy law (§2.2) on a composition (§11.5).
 *
 *   node scripts/occupancy-check.mjs <composition-id> [--props props.json]
 *
 * Renders the composition to a low-res PNG sequence, keeps one frame every 0.5s
 * (§2.2 sampling), and hands them to occupancy_check.py. Exits non-zero on FAIL
 * so it can gate a render pipeline: "a piece that fails does not go to the
 * timeline" (§11.5).
 *
 * We have no system ffmpeg here, so a cheap sequence render stands in for the
 * runbook's "extract frames from the finished .mov" step.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, renameSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { remotion } from "./_remotion.mjs";

const FPS = 30;
const SAMPLE_EVERY = Math.round(0.5 * FPS); // one sample per 0.5s
const SCALE = 320 / 1920; // downscale to 320px wide for the measure

const [, , compId, ...rest] = process.argv;
if (!compId) {
  console.error("usage: node scripts/occupancy-check.mjs <composition-id> [--props file.json]");
  process.exit(2);
}
const propsIdx = rest.indexOf("--props");
const propsFile = propsIdx >= 0 ? rest[propsIdx + 1] : null;

const work = mkdtempSync(join(tmpdir(), "nif-occ-"));
const seqDir = join(work, "seq");
const sampleDir = join(work, "sample");
mkdirSync(seqDir, { recursive: true });
mkdirSync(sampleDir, { recursive: true });

try {
  console.log(`occupancy: rendering ${compId} sequence at ${Math.round(SCALE * 1920)}px…`);
  const args = [
    "render",
    compId,
    seqDir, // --sequence output must be a directory, not a filename pattern
    "--sequence",
    "--image-format=png",
    `--scale=${SCALE.toFixed(4)}`,
    "--log=error",
  ];
  if (propsFile) args.push(`--props=${propsFile}`);
  remotion(args);

  const frames = readdirSync(seqDir).filter((f) => f.endsWith(".png")).sort();
  let kept = 0;
  frames.forEach((f, i) => {
    if (i % SAMPLE_EVERY === 0) {
      renameSync(join(seqDir, f), join(sampleDir, `s${String(kept).padStart(4, "0")}.png`));
      kept++;
    }
  });
  console.log(`occupancy: sampled ${kept} / ${frames.length} frames`);

  const py = process.platform === "win32" ? "python" : "python3";
  execFileSync(py, [join("scripts", "occupancy_check.py"), sampleDir], {
    stdio: "inherit",
  });
  console.log("occupancy: PASS");
} catch (err) {
  if (err.status) process.exitCode = err.status;
  else {
    console.error(err.message);
    process.exitCode = 1;
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
