import { interpolate, useCurrentFrame } from "remotion";
import { COLOR } from "../tokens";
import { EASE } from "./motion";

/**
 * Bloom — a time-boxed glow-halo pulse on an accent element (v2.0 §5.6).
 *
 * Implemented as a layered radial-gradient, GPU-composited, with zero per-frame
 * filter cost. The runbook's objection to `feGaussianBlur` is that it
 * re-rasterises a moving/scaling element every frame; a gradient never does.
 * (True `@remotion/skia` was tried and its native dep is broken under rspack on
 * this machine — swap the internals here if that ever gets fixed.)
 *
 * RULES (enforced by review, not code):
 *   - accent colour ONLY (the channel pack's one accent, or amber/cyan for MM)
 *   - time-boxed: pulses IN → HOLD → pulses OUT. Never an ambient halo.
 *   - reserved uses only: progress rule, a counted value landing, a connection
 *     draw-on completing, a winner flare, the reversal
 *   - NEVER counts toward the occupancy floor (§13.5) — occupancy_check.py
 *     excludes it; the underlying content must clear the floor unaided
 */
export const Bloom: React.FC<{
  /** [inStart, inEnd, outStart, outEnd] — LOCAL frames of the pulse. */
  window: [number, number, number, number];
  /** Core glow radius in px (the halo reaches ~2× this). */
  radius?: number;
  color?: string;
  /** Peak opacity of the core, 0..1. */
  intensity?: number;
  /** Centre. Defaults to the middle of the positioned parent. */
  x?: number | string;
  y?: number | string;
  /** Sits behind `children` if given, else renders standalone. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  window: [i0, i1, o0, o1],
  radius = 120,
  color = COLOR.orange,
  intensity = 0.9,
  x = "50%",
  y = "50%",
  children,
  style,
}) => {
  if (process.env.NODE_ENV === "development" && o1 - i0 > 90) {
    console.warn(
      `[Bloom] window ${o1 - i0}f (${((o1 - i0) / 30).toFixed(1)}s) — Bloom is time-boxed, never ambient (v2.0 §5.6). Keep it under ~3s.`,
    );
  }

  const t = useBloom([i0, i1, o0, o1]);
  const a = t * intensity;
  const r = radius * (0.72 + 0.28 * t);

  return (
    <>
      {t > 0.002 && (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            translate: "-50% -50%",
            width: r * 4,
            height: r * 4,
            pointerEvents: "none",
            zIndex: 0,
            background: `radial-gradient(circle, ${rgba(color, a * 0.5)} 0%, ${rgba(
              color,
              a * 0.26,
            )} 26%, ${rgba(color, a * 0.08)} 48%, ${rgba(color, 0)} 66%)`,
            ...style,
          }}
        />
      )}
      {children}
    </>
  );
};

/** The bloom envelope value 0..1, for a component that wants to drive its own
 *  scale/opacity off the same pulse (e.g. a coin that swells as it lands).
 *
 *  The window is forced strictly-monotonic before it reaches `interpolate`:
 *  VO-timed windows near a beat end routinely collide (`F.peak + 32` landing
 *  past `dur - 14`). A 1-frame nudge is invisible; a thrown render is not. */
export const useBloom = (window: [number, number, number, number]): number => {
  const frame = useCurrentFrame();
  const a = window[0];
  const b = Math.max(window[1], a + 1);
  const c = Math.max(window[2], b + 1);
  const d = Math.max(window[3], c + 1);
  return interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
};

const rgba = (hex: string, alpha: number): string => {
  if (hex.startsWith("rgb")) return hex.replace(/rgba?\(([^)]+)\)/, (_, inner) => `rgba(${inner.split(",").slice(0, 3).join(",")}, ${alpha})`);
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};
