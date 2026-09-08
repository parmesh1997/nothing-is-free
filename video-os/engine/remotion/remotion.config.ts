/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 *
 * Nothing Is Free — channel-level Remotion project (Runbook v1.0 §11.1, Tier 0).
 * Resolution / fps are fixed on every <Composition> (1920x1080 @ 30fps), not here.
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
// PNG so the alpha channel survives for V2 overlap pieces (Runbook §11.6).
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
