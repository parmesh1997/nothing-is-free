import { interpolate } from "remotion";
import { EASE } from "../parts/motion";
import { Z } from "../tokens";

/**
 * camera.ts — TIER 4 (§3.2, §3.4). The 2.5D camera model.
 *
 * A frame is 2D artwork on parallax planes. The camera adds x, y, zoom and a
 * depth `z`. Distant planes move less; near planes move more (§3.2). The viewer
 * should feel depth, not notice a gimmick (§3.2).
 *
 * `z` mirrors the runbook scene blocks ("z −0.5 → −1.4 pull", §11.2). More
 * negative z = further back = wider framing. It is converted to an effective
 * zoom so a pull genuinely reveals context.
 */

export type CameraState = {
  /** World-space pan in px. */
  x: number;
  y: number;
  /** Multiplicative zoom on top of the z-derived framing. 1 = neutral. */
  zoom: number;
  /** Depth, runbook convention. Default = the subject plane. */
  z: number;
};

export const CAMERA_HOME: CameraState = {
  x: 0,
  y: 0,
  zoom: 1,
  z: Z.subject.z,
};

/** How hard a change in camera z reframes. Tuned so z −0.5 → −1.4 ≈ 0.7× zoom. */
const Z_TO_ZOOM = 0.45;

/**
 * Framing zoom from camera depth. Further back (z more negative) → smaller
 * value → wider shot. At z = subject plane it is exactly 1.
 */
export const framingZoom = (z: number) => 1 / (1 + (Z.subject.z - z) * Z_TO_ZOOM);

/** The zoom actually applied: user zoom folded with the z-derived framing. */
export const resolvedZoom = (cam: CameraState) => cam.zoom * framingZoom(cam.z);

// ── Keyframes ────────────────────────────────────────────────────────────────

export type CameraKeyframe = {
  /** Local frame this pose is reached. */
  frame: number;
  /** Partial pose — unspecified fields hold their previous value. */
  pose: Partial<CameraState>;
  /** Easing for the segment ENDING at this keyframe. Default inOut cubic (§4.1). */
  easing?: (t: number) => number;
};

/**
 * Sample the camera at `frame` from an ordered keyframe list. Camera motion is
 * slower and smoother than object entrances (§3.4); large reveals need room.
 */
export const sampleCamera = (
  frame: number,
  keyframes: CameraKeyframe[],
): CameraState => {
  if (keyframes.length === 0) return { ...CAMERA_HOME };

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
  let state: CameraState = { ...CAMERA_HOME, ...sorted[0].pose };

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    const from: CameraState = { ...state, ...a.pose };
    const to: CameraState = { ...from, ...b.pose };
    if (frame <= a.frame) return from;
    if (frame >= b.frame) {
      state = to;
      continue;
    }
    const ease = b.easing ?? EASE.inOut;
    const lerp = (k: keyof CameraState) =>
      interpolate(frame, [a.frame, b.frame], [from[k], to[k]], {
        easing: ease,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    return { x: lerp("x"), y: lerp("y"), zoom: lerp("zoom"), z: lerp("z") };
  }

  return state;
};
