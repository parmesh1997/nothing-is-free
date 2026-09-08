import { interpolate } from "remotion";
import { EASE, springIn } from "../parts/motion";

/**
 * The NIF002 beat-stage contract — HYBRID model (creator, 2026-09-02, option C;
 * reconciles the WhatsApp empty-seam direction with v2.0 §Step 6 continuity).
 *
 *   frame 0            → EMPTY except any THROUGHLINE element carried from the
 *                        previous beat (entered at its parked state).
 *   build              → beat-specific elements ENTER one at a time, synced to VO.
 *   throughout         → a motion event every ≤3.5s. No static hold longer.
 *   last ~1.2s         → BEAT-SPECIFIC elements disperse (fly / fade). THROUGHLINE
 *                        elements `park()` — settle to a defined small/faint state
 *                        that the next beat resumes from.
 *   final ~0.4s        → only the parked throughline + the locked field remain.
 *
 * `present(at)`  — beat-specific opacity: enters, holds, disperses to 0.
 * `carry(at)`    — throughline opacity: enters, holds, settles to `parkOpacity`
 *                  (default 0.9 — it stays visible, just quiet).
 * `park(frame)`  — 0..1, 1 during the beat body, easing to 0 over the park window;
 *                  drive a throughline element's scale/position toward its parked
 *                  pose with `1 - park`.
 * The locked field (paper, grid, ground rule, progress rule) is never touched.
 */
export const useStage = (
  durationInFrames: number,
  opts: { disperseFrames?: number; holdFrames?: number; fps?: number } = {},
) => {
  const fps = opts.fps ?? 30;
  const DISPERSE = opts.disperseFrames ?? 40; // time to clear the stage
  const HOLD = opts.holdFrames ?? 15; // empty tail before the cut
  const disperseAt = Math.max(30, durationInFrames - HOLD - DISPERSE);

  const outRaw = (frame: number) =>
    interpolate(frame, [disperseAt, disperseAt + DISPERSE], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return {
    disperseAt,
    disperseFrames: DISPERSE,

    /** Element entrance, 0..1+ (spring — can overshoot, good for scale). */
    enter: (frame: number, at: number, dur = 16) =>
      springIn({ frame, fps, delay: at, durationInFrames: dur }),

    /** Global exit multiplier, 1 → 0 across the disperse window, cubic-in. */
    exit: (frame: number) =>
      interpolate(frame, [disperseAt, disperseAt + DISPERSE], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE.exitIn,
      }),

    /** Opacity multiplier every foreground element uses: enters, holds, disperses. */
    present: (frame: number, at: number, dur = 16) =>
      Math.max(0, Math.min(1, springIn({ frame, fps, delay: at, durationInFrames: dur })) * outRaw(frame)),

    /** Whether an element has fully entered and not yet begun to disperse. */
    isUp: (frame: number, at: number) => frame >= at && frame < disperseAt,

    /** px x-offset for a scene object flying out on disperse (0 until disperseAt). */
    fly: (frame: number, dir: 1 | -1, distance = 760) =>
      dir *
      distance *
      (1 -
        interpolate(frame, [disperseAt, disperseAt + DISPERSE], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.inOut,
        })),

    /** px y-offset for a scene object dropping/rising out on disperse. */
    flyY: (frame: number, dir: 1 | -1, distance = 520) =>
      dir *
      distance *
      (1 -
        interpolate(frame, [disperseAt, disperseAt + DISPERSE], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.inOut,
        })),

    // ── HYBRID additions — throughline elements that persist across beats ──

    /** Opacity for a THROUGHLINE element: enters at `at`, holds, then settles to
     *  `parkOpacity` (stays visible, just quiet) instead of dispersing. */
    carry: (frame: number, at: number, dur = 16, parkOpacity = 0.9) => {
      const inn = Math.min(1, springIn({ frame, fps, delay: at, durationInFrames: dur }));
      const settle = interpolate(frame, [disperseAt, disperseAt + DISPERSE], [1, parkOpacity], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE.inOut,
      });
      return Math.max(0, inn * settle);
    },

    /** 1 during the body, → 0 over the park window. Drive a throughline element
     *  toward its parked pose with `1 - park` (e.g. scale, recentre). */
    park: (frame: number) =>
      interpolate(frame, [disperseAt, disperseAt + DISPERSE], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE.inOut,
      }),
  };
};

/**
 * pulse — a quick, self-contained scale/opacity bump on an element that is
 * already on stage. Use to satisfy the ≤3.5s motion rule on a held element
 * (a number ticks, a card nudges, an icon flashes). Micro-motion / breathing
 * does NOT count (§4.2) — this is a real, visible beat.
 */
export const pulse = (frame: number, at: number, amount = 0.06, frames = 12) => {
  const t = interpolate(frame, [at, at + frames * 0.4, at + frames], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  return 1 + t * amount;
};

/**
 * loop — a continuous cyclic value in [0,1) for anything that must keep moving
 * while it sits on screen (a spinner, a loading bar, Lucky's idle gesture).
 * "When you are showing anything, make it a loop" — creator, 2026-09-02.
 */
export const loop = (frame: number, periodFrames: number, phase = 0) =>
  (((frame / periodFrames) % 1) + 1 + phase) % 1;

/**
 * safeRamp — an in→hold→out envelope that tolerates VO-timed frames landing on
 * top of each other. Give it 4 keyframes; it forces each ≥ 1 frame after the
 * last (so `interpolate` never throws on a non-monotonic range), then evaluates
 * `[0,1,1,0]`.
 */
import { interpolate as _interp } from "remotion";
export const safeRamp = (
  frame: number,
  pts: [number, number, number, number],
  values: [number, number, number, number] = [0, 1, 1, 0],
): number => {
  const [a] = pts;
  const b = Math.max(pts[1], a + 1);
  const c = Math.max(pts[2], b + 1);
  const d = Math.max(pts[3], c + 1);
  return _interp(frame, [a, b, c, d], values, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};
