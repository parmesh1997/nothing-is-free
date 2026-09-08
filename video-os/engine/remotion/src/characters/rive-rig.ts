/**
 * rive-rig.ts — the bridge config between the code-side character API and a
 * Rive `.riv` export. Applies to Lucky and any future NIF character.
 *
 * IMPORTANT — `@remotion/rive` (4.0.519) drives **linear animations only**; it
 * has no state-machine input API. So the `.riv` must export ONE LOOPING
 * ANIMATION PER POSE (idle motion baked in), and code selects the clip by name.
 * `facing` is a CSS mirror. `phoneScreen` recolour is not expressible through
 * this runtime — the SVG fallback still does it; the Rive rig bakes a neutral
 * screen. See channels/nif/rigs/LUCKY_RIV_BRIEF.md.
 *
 * Flip `RIG_READY` to true once `public/rigs/lucky.riv` exists and previews
 * correctly. Until then every character renders the SVG rig, no risk.
 */
import { LuckyExpression, LuckyPose } from "./lucky-rig";

/** Set true when public/rigs/lucky.riv is in place and verified. */
export const RIG_READY = false;

/** Where the bundled .riv lives (staticFile path). */
export const LUCKY_RIV = "rigs/lucky.riv";

/** Artboard name inside the .riv (must match the export). */
export const LUCKY_ARTBOARD = "Lucky";

/**
 * Map a (pose, expression) pair to the Rive animation clip name. The `.riv`
 * exports a clip per pose, plus `_worried` / `_happy` variants where the
 * expression materially changes the body (sit, showPhone, shrug). Anything
 * missing falls back to the plain pose clip — keep the exporter forgiving.
 */
export const luckyClip = (pose: LuckyPose, expression: LuckyExpression): string => {
  const bodyExpressions: LuckyExpression[] = ["worried", "happy", "surprised"];
  if (bodyExpressions.includes(expression) && POSE_HAS_EXPR_VARIANT.has(pose)) {
    return `${pose}_${expression}`;
  }
  return pose;
};

const POSE_HAS_EXPR_VARIANT = new Set<LuckyPose>([
  "sit",
  "showPhone",
  "shrug",
  "stand",
]);

/** Every clip name the exporter is expected to provide, for a validation pass. */
export const LUCKY_REQUIRED_CLIPS: string[] = [
  "stand",
  "walk",
  "point",
  "showPhone",
  "typing",
  "sit",
  "shrug",
  "thumbsUp",
  "stand_worried",
  "sit_worried",
  "showPhone_worried",
  "shrug_worried",
];
