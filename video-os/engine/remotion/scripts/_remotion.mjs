/**
 * _remotion.mjs — resolve the Remotion CLI entry so scripts can invoke it as
 * `node <cli> …` with no shell and no `.cmd` shim (Windows execFileSync rejects
 * `.cmd` targets with EINVAL on modern Node).
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const cliPkgJson = require.resolve("@remotion/cli/package.json");

/** Absolute path to @remotion/cli/remotion-cli.js */
export const REMOTION_CLI = join(dirname(cliPkgJson), "remotion-cli.js");

/** Run the Remotion CLI. Throws (with .status) on non-zero exit. */
export const remotion = (args, opts = {}) =>
  execFileSync(process.execPath, [REMOTION_CLI, ...args], {
    stdio: "inherit",
    ...opts,
  });

/** Same, but capture stdout as a string. */
export const remotionOut = (args) =>
  execFileSync(process.execPath, [REMOTION_CLI, ...args], { encoding: "utf8" });
