import { interpolate, useCurrentFrame } from "remotion";
import { COLOR } from "../tokens";
import { EASE } from "./motion";

/**
 * DrawLine — TIER 3 (§4.1, §3.7). strokeDashoffset + Easing.inOut(cubic).
 *
 * Connection graphics are information design, not decoration. Place them at
 * their own depth (Z = −0.1 behind the parent) so camera movement separates
 * them naturally — that's the caller's job via <Layer>.
 */
export const DrawLine: React.FC<{
  /** SVG path data, in the composition's pixel space. */
  d: string;
  start: number;
  end: number;
  stroke?: string;
  strokeWidth?: number;
  dashed?: boolean;
  /** Total path length; pass it if known, else a safe over-estimate is used. */
  pathLength?: number;
  style?: React.CSSProperties;
}> = ({
  d,
  start,
  end,
  stroke = COLOR.graphite,
  strokeWidth = 3,
  dashed = false,
  pathLength = 4000,
  style,
}) => {
  const frame = useCurrentFrame();
  const drawn = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });

  return (
    <svg
      style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}
    >
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={pathLength}
        strokeDasharray={
          dashed ? "12 10" : `${pathLength} ${pathLength}`
        }
        strokeDashoffset={
          dashed ? undefined : pathLength * (1 - drawn)
        }
        opacity={dashed ? drawn : 1}
      />
    </svg>
  );
};
