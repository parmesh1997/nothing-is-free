import React from "react";
import { MM_COLOR } from "./tokens";

/**
 * ScaleFigure — Mass & Method's only character (`identity.json`:
 * "anonymous": true, "faceless": true). Its one job is scale: stand it next
 * to a structure so the viewer can read how big the thing actually is. No
 * face, no hair, no clothing colour — a single flat ivory silhouette, the
 * same idea as an architectural drawing's scale figure.
 *
 * `heightPx` is the figure's real on-screen height — callers do the
 * real-world-metres → pixels conversion so every ScaleFigure in a scene sits
 * at one consistent scale.
 */
export const ScaleFigure: React.FC<{
  x: number;
  /** the figure's feet — it draws upward from here. */
  y: number;
  heightPx: number;
  color?: string;
  /** 1 = facing right, -1 = facing left (mirrors the pose). */
  facing?: 1 | -1;
  opacity?: number;
}> = ({ x, y, heightPx, color = MM_COLOR.ivory, facing = 1, opacity = 1 }) => {
  const h = heightPx;
  // proportions, head-to-heel, roughly life-like (an 1/7.5-head figure):
  const headR = h * 0.068;
  const headCY = y - h + headR;
  const neckY = headCY + headR * 0.92;
  const shoulderY = neckY + h * 0.015;
  const hipY = y - h * 0.46;
  const shoulderW = h * 0.18;
  const hipW = h * 0.13;
  const armW = h * 0.07;
  const legW = h * 0.085;
  const footY = y;

  return (
    <g transform={`translate(${x} 0) scale(${facing} 1)`} opacity={opacity}>
      {/* head */}
      <circle cx={0} cy={headCY} r={headR} fill={color} />
      {/* torso — a soft trapezoid, shoulders wider than hips */}
      <path
        d={`M ${-shoulderW / 2} ${shoulderY}
            L ${shoulderW / 2} ${shoulderY}
            L ${hipW / 2} ${hipY}
            L ${-hipW / 2} ${hipY}
            Z`}
        fill={color}
      />
      {/* arms — straight at the sides, a slight inward taper */}
      {[-1, 1].map((side) => (
        <path
          key={side}
          d={`M ${side * (shoulderW / 2 - armW * 0.15)} ${shoulderY + 4}
              L ${side * (shoulderW / 2 + armW * 0.3)} ${hipY - h * 0.02}
              L ${side * (shoulderW / 2 - armW * 0.5)} ${hipY + h * 0.02}
              L ${side * (shoulderW / 2 - armW * 0.9)} ${shoulderY + 4}
              Z`}
          fill={color}
        />
      ))}
      {/* legs — a small stance gap, straight to the ground */}
      {[-1, 1].map((side) => (
        <path
          key={side}
          d={`M ${side * legW * 0.15} ${hipY}
              L ${side * (legW * 0.15 + legW)} ${hipY}
              L ${side * (legW * 0.15 + legW * 0.85)} ${footY}
              L ${side * legW * 0.3} ${footY}
              Z`}
          fill={color}
        />
      ))}
    </g>
  );
};
