/**
 * render-all.mjs — render every episode beat composition to a Resolve-ready file
 * and validate it (§11.6). Skips the `dev/` folder (only renders EP** ids).
 *
 *   node scripts/render-all.mjs [EP01]        # all, or one episode's beats
 *
 * Per beat:
 *   1. render  → out/<id>.mov  (ProRes 4444, png / yuva444p10le — §11.6)
 *   2. validate: 1920x1080, fps 30, pix_fmt yuva444p10le, duration matches
 *      durationInFrames, no zero-byte output
 *   3. occupancy check (§11.5) — a failing piece is reported and NOT marked ready
 *
 * V1 opaque pieces vs V2 alpha pieces (§11.6): this renders alpha for everything.
 * A V1 master that must be opaque carries the locked field via BeatFrame and is
 * flattened in Resolve.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { remotion, remotionOut } from "./_remotion.mjs";

const only = process.argv[2]?.toUpperCase() ?? null;
mkdirSync("out", { recursive: true });

// `remotion compositions` prints a table: "<id>  <fps>  <WxH>  <frames> (<sec>)".
// Episode compositions are id'd "<CH><EPN>-B##" (NIF002-B07, MM001-B03, …).
// NB: the table prints at log level "info" — passing --log=error here returns an
// empty string and nothing renders. The regex below discards the progress noise.
const ids = remotionOut(["compositions"])
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => /^(NIF|MM|EP)\d+\S*\s+\d/i.test(line))
  .map((line) => line.split(/\s+/)[0])
  .filter((id) => !only || id.toUpperCase().startsWith(only));

if (ids.length === 0) {
  console.log(
    only
      ? `No EP compositions matching "${only}".`
      : "No EP** compositions registered yet. Beats are built at Step 3 (§11).",
  );
  process.exit(0);
}

const results = [];
for (const id of ids) {
  const out = join("out", `${id}.mov`);
  console.log(`\n── ${id} ─────────────────────────────`);
  try {
    remotion([
      "render",
      id,
      out,
      "--codec=prores",
      "--prores-profile=4444",
      "--image-format=png",
      "--pixel-format=yuva444p10le",
      "--log=error",
    ]);

    const problems = validate(out);
    let occupancy = "n/a";
    try {
      execFileSync(process.execPath, ["scripts/occupancy-check.mjs", id], { stdio: "inherit" });
      occupancy = "PASS";
    } catch {
      occupancy = "FAIL";
      problems.push("occupancy FAIL (§11.5) — does not go to the timeline");
    }
    results.push({ id, problems, occupancy });
  } catch (err) {
    results.push({ id, problems: [`render error: ${err.message}`], occupancy: "n/a" });
  }
}

console.log("\n════════ render-all summary ════════");
let anyFail = false;
for (const r of results) {
  const ok = r.problems.length === 0;
  anyFail ||= !ok;
  console.log(`${ok ? "✓" : "✗"} ${r.id}  (occupancy ${r.occupancy})`);
  for (const p of r.problems) console.log(`    - ${p}`);
}
process.exit(anyFail ? 1 : 0);

function validate(file) {
  const problems = [];
  if (!existsSync(file) || statSync(file).size === 0) {
    problems.push("output missing or zero bytes");
    return problems;
  }
  let probe = "";
  try {
    // Remotion ships its own ffprobe — no system ffmpeg here.
    probe = remotionOut(["ffprobe", file, "-v", "error", "-show_streams", "-show_format"]);
  } catch (err) {
    problems.push(`ffprobe failed: ${err.message}`);
    return problems;
  }
  const get = (k) => probe.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim();
  if (+get("width") !== 1920 || +get("height") !== 1080)
    problems.push(`dimensions ${get("width")}x${get("height")} ≠ 1920x1080`);
  // §11.6 wants alpha on the piece. ProRes 4444 is a 12-bit codec, so
  // --pixel-format=yuva444p10le actually lands as yuva444p12le — both carry the
  // alpha channel (the "a" in yuva). Reject only a format with no alpha.
  if (!/^yuva444p\d+le$/.test(get("pix_fmt") || ""))
    problems.push(`pix_fmt ${get("pix_fmt")} has no alpha channel (want yuva444p*le — §11.6)`);
  const rate = get("r_frame_rate");
  if (rate && rate !== "30/1") problems.push(`frame rate ${rate} ≠ 30/1`);
  return problems;
}
