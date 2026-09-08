import { interpolate, useCurrentFrame } from "remotion";
import { COLOR } from "../tokens";
import { EASE } from "./motion";

type Pt = { x: number; y: number };

/**
 * DrawArrow — TIER 3 (§3.7). A straight connector that draws on, then reveals
 * its arrowhead. Supports cause→effect and money-flow chains (§3.1).
 *
 * For curved / multi-segment connectors use DrawLine with a path and add a
 * separate arrowhead, or extend this.
 */
export const DrawArrow: React.FC<{
  from: Pt;
  to: Pt;
  start: number;
  end: number;
  stroke?: string;
  strokeWidth?: number;
  headSize?: number;
  style?: React.CSSProperties;
}> = ({
  from,
  to,
  start,
  end,
  stroke = COLOR.ink,
  strokeWidth = 3,
  headSize = 16,
  style,
}) => {
  const frame = useCurrentFrame();
  const span = end - start;
  const lineEnd = start + span * 0.8;
  const drawn = interpolate(frame, [start, lineEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  const head = interpolate(frame, [lineEnd, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  // Stop the shaft short of the tip so the head sits cleanly.
  const tipX = from.x + dx * drawn;
  const tipY = from.y + dy * drawn;
  const baseX = to.x - ux * headSize;
  const baseY = to.y - uy * headSize;
  const nx = -uy;
  const ny = ux;

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>
      <line
        x1={from.x}
        y1={from.y}
        x2={tipX}
        y2={tipY}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {head > 0 && (
        <polygon
          points={`${to.x},${to.y} ${baseX + nx * headSize * 0.6},${
            baseY + ny * headSize * 0.6
          } ${baseX - nx * headSize * 0.6},${baseY - ny * headSize * 0.6}`}
          fill={stroke}
          opacity={head}
        />
      )}
    </svg>
  );
};
