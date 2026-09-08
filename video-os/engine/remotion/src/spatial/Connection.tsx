import { Z } from "../tokens";
import { DrawArrow } from "../parts/DrawArrow";
import { DrawLine } from "../parts/DrawLine";
import { boundsOf, useScene } from "./SpatialScene";
import { Layer } from "./Layer";

/**
 * Connection — TIER 4 (§3.7). Lines and arrows are information design, not
 * decoration. Placed at their own depth (Z = −0.1 behind the parent) so camera
 * movement separates them naturally.
 *
 * Endpoints are object ids from <SpatialScene objects>; the line is drawn
 * centre-to-centre (or edge-to-edge with `attach: "edge"`).
 */
export const Connection: React.FC<{
  from: string;
  to: string;
  start: number;
  end: number;
  kind?: "line" | "arrow";
  attach?: "center" | "edge";
  stroke?: string;
  strokeWidth?: number;
}> = ({
  from,
  to,
  start,
  end,
  kind = "arrow",
  attach = "edge",
  stroke,
  strokeWidth,
}) => {
  const { objects, groups } = useScene();
  const a = boundsOf(from, objects, groups);
  const b = boundsOf(to, objects, groups);

  let p1 = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
  let p2 = { x: b.x + b.w / 2, y: b.y + b.h / 2 };

  if (attach === "edge") {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    p1 = { x: p1.x + ux * (a.w / 2), y: p1.y + uy * (a.h / 2) };
    p2 = { x: p2.x - ux * (b.w / 2), y: p2.y - uy * (b.h / 2) };
  }

  return (
    <Layer plane="midground" style={{ zIndex: Math.round((3 + Z.connection.z) * 100) }}>
      {kind === "arrow" ? (
        <DrawArrow
          from={p1}
          to={p2}
          start={start}
          end={end}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ) : (
        <DrawLine
          d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
          start={start}
          end={end}
          stroke={stroke}
          strokeWidth={strokeWidth}
          pathLength={Math.hypot(p2.x - p1.x, p2.y - p1.y)}
        />
      )}
    </Layer>
  );
};
