import { interpolate } from "remotion";
import { EASE, springIn } from "../../parts/motion";

/**
 * useStage3 — the v3 beat stage (2026-09-03 pivot).
 *
 * Difference from v2 `useStage`: elements do NOT fade. They SLIDE in from an
 * edge and, on disperse, slide off left/right (Infographics-Show entrances).
 * `opacity` still ramps a little so an alpha edge is never a hard pop, but the
 * read is a slide, not a crossfade.
 *
 *   const s = useStage3(dur);
 *   ...style={{ ...s.slideIn(frame, at, "bottom") }}     // {opacity, translate}
 *   ...style={{ ...s.exitPush(frame, "left") }}          // adds a disperse push
 *   const gone = s.dispersed(frame);
 */
type Dir = "left" | "right" | "top" | "bottom";

export const useStage3 = (
  durationInFrames: number,
  opts: { disperseFrames?: number; holdFrames?: number; fps?: number } = {},
) => {
  const fps = opts.fps ?? 30;
  const DISPERSE = opts.disperseFrames ?? 30;
  const HOLD = opts.holdFrames ?? 12;
  const disperseAt = Math.max(24, durationInFrames - HOLD - DISPERSE);

  const outT = (frame: number, easing = EASE.inOut) =>
    interpolate(frame, [disperseAt, disperseAt + DISPERSE], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    });

  /** Off-screen travel for an edge, in px. */
  const OFF = { left: -900, right: 900, top: -680, bottom: 680 } as const;

  const enterOffset = (frame: number, at: number, from: Dir, dur: number) => {
    const p = springIn({ frame, fps, delay: at, durationInFrames: dur }); // 0..~1.05
    const k = 1 - Math.min(1, p); // 1 → 0
    const d = OFF[from] * 0.38; // enter from a bit off, not fully off-screen
    return from === "left" || from === "right"
      ? { x: d * k, y: 0 }
      : { x: 0, y: d * k };
  };

  return {
    disperseAt,
    disperseFrames: DISPERSE,
    fps,

    /** Element entrance value 0..~1.05 (spring). */
    enter: (frame: number, at: number, dur = 16) =>
      springIn({ frame, fps, delay: at, durationInFrames: dur }),

    /** true once the disperse has fully cleared the stage. */
    dispersed: (frame: number) => frame >= disperseAt + DISPERSE,

    /** true when fully entered and not yet dispersing. */
    isUp: (frame: number, at: number) => frame >= at && frame < disperseAt,

    /**
     * Full entrance+exit style for a beat-specific element:
     *   slide in from `from`, hold, then push off toward `exitTo` (default: the
     *   same side it came from, so left-comers exit left).
     */
    slide: (
      frame: number,
      at: number,
      from: Dir = "bottom",
      dur = 16,
      exitTo?: "left" | "right",
    ) => {
      const inO = enterOffset(frame, at, from, dur);
      const side = exitTo ?? (from === "right" ? "right" : "left");
      const push = outT(frame) * (side === "left" ? OFF.left : OFF.right);
      const op = interpolate(
        springIn({ frame, fps, delay: at, durationInFrames: dur }),
        [0, 0.4],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ) * (1 - outT(frame, EASE.exitIn) * 0.15);
      return {
        opacity: Math.max(0, op),
        translate: `${inO.x + push}px ${inO.y}px`,
      };
    },

    /** Just the entrance offset (for elements that manage their own opacity). */
    slideIn: (frame: number, at: number, from: Dir = "bottom", dur = 16) => {
      const o = enterOffset(frame, at, from, dur);
      return { translate: `${o.x}px ${o.y}px` };
    },

    /** Disperse push only — for a throughline element leaving on the cut. */
    exitPush: (frame: number, to: "left" | "right" = "left") => ({
      translate: `${outT(frame) * (to === "left" ? OFF.left : OFF.right)}px 0px`,
    }),

    /** 0..1, 1 through the body, → 0 across disperse. Multiply a scene layer's
     *  opacity / drive a parked pose with (1 - this). */
    body: (frame: number) => 1 - outT(frame),

    /** Throughline opacity: enters, holds, settles to parkOpacity (stays visible). */
    carry: (frame: number, at: number, dur = 16, parkOpacity = 1) => {
      const inn = Math.min(1, springIn({ frame, fps, delay: at, durationInFrames: dur }));
      const settle = interpolate(frame, [disperseAt, disperseAt + DISPERSE], [1, parkOpacity], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE.inOut,
      });
      return Math.max(0, inn * settle);
    },
  };
};

export type Stage3 = ReturnType<typeof useStage3>;

/** A quick scale bump on an element already on stage (satisfies the ≤3.5s rule). */
export const bump = (frame: number, at: number, amount = 0.08, frames = 14) => {
  const t = interpolate(frame, [at, at + frames * 0.35, at + frames], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  return 1 + t * amount;
};

/** Continuous cyclic value [0,1) — spinners, walk cycles, ambient drift. */
export const cyc = (frame: number, periodFrames: number, phase = 0) =>
  (((frame / periodFrames) % 1) + 1 + phase) % 1;
