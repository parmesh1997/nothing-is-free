import { interpolate, useCurrentFrame } from "remotion";
import { COLOR } from "../tokens";
import { EASE } from "../parts/motion";

/**
 * Doodle — hand-drawn annotation marks (the red circles + arrows over the
 * blueprint in the reference). Sketchy stroke, draws on. Information design on
 * top of the composed frame — use sparingly, one idea per doodle.
 */
type Common = {
  start: number;
  end: number;
  color?: string;
  strokeWidth?: number;
};

/** A rough hand-drawn ellipse around something. */
export const CircleDoodle: React.FC<Common & { cx: number; cy: number; rx: number; ry: number }> = ({
  cx,
  cy,
  rx,
  ry,
  start,
  end,
  color = COLOR.red,
  strokeWidth = 5,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  // overshoot slightly past 360° for the scribbled-loop feel
  const sweep = t * Math.PI * 2.15;
  const pts: string[] = [];
  for (let a = 0; a <= sweep; a += 0.12) {
    const wobble = 1 + Math.sin(a * 7) * 0.03;
    pts.push(`${cx + Math.cos(a - 0.6) * rx * wobble} ${cy + Math.sin(a - 0.6) * ry * wobble}`);
  }
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/** A rough hand-drawn arrow from A to B. */
export const ArrowDoodle: React.FC<Common & { from: { x: number; y: number }; to: { x: number; y: number }; curve?: number }> = ({
  from,
  to,
  start,
  end,
  curve = 40,
  color = COLOR.red,
  strokeWidth = 5,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 - curve;
  const headT = Math.max(0, (t - 0.75) / 0.25);
  const ang = Math.atan2(to.y - my, to.x - mx);
  const hs = 22;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path
        d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.min(1, t / 0.85)}
      />
      {headT > 0 && (
        <polyline
          points={`${to.x - Math.cos(ang - 0.4) * hs} ${to.y - Math.sin(ang - 0.4) * hs} ${to.x} ${to.y} ${to.x - Math.cos(ang + 0.4) * hs} ${to.y - Math.sin(ang + 0.4) * hs}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={headT}
        />
      )}
    </svg>
  );
};

/** A rough underline / emphasis stroke under a word. */
export const UnderlineDoodle: React.FC<Common & { x1: number; x2: number; y: number }> = ({
  x1,
  x2,
  y,
  start,
  end,
  color = COLOR.orange,
  strokeWidth = 8,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  const x = x1 + (x2 - x1) * t;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path
        d={`M ${x1} ${y} Q ${(x1 + x) / 2} ${y + 6} ${x} ${y - 2}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};
