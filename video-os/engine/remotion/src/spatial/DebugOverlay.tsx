import { AbsoluteFill } from "remotion";
import { COLOR, HEIGHT, WIDTH } from "../tokens";
import { boundsOf, useScene } from "./SpatialScene";

/**
 * DebugOverlay — TIER 4 (§3.8). Development-only. Draws camera position, object
 * x/y/z, group bounds, object IDs and the current focus target.
 *
 * OFF IN EVERY RENDER. <SpatialScene> only mounts this when `debug` is true, and
 * `debug` must never be set on a registered EP** composition.
 */
export const DebugOverlay: React.FC = () => {
  const { camera, objects, groups } = useScene();

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 99999 }}>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
        {/* frame centre crosshair */}
        <line x1={WIDTH / 2 - 20} y1={HEIGHT / 2} x2={WIDTH / 2 + 20} y2={HEIGHT / 2} stroke={COLOR.orange} strokeWidth={1} />
        <line x1={WIDTH / 2} y1={HEIGHT / 2 - 20} x2={WIDTH / 2} y2={HEIGHT / 2 + 20} stroke={COLOR.orange} strokeWidth={1} />

        {Object.entries(objects).map(([id, r]) => (
          <g key={id}>
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              fill="none"
              stroke={COLOR.offsetRed}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text x={r.x + 4} y={r.y - 6} fill={COLOR.offsetRed} fontSize={16} fontFamily="monospace">
              {id} · {r.plane ?? "subject"}
            </text>
          </g>
        ))}

        {Object.keys(groups).map((g) => {
          const b = boundsOf(g, objects, groups);
          return (
            <g key={g}>
              <rect x={b.x - 8} y={b.y - 8} width={b.w + 16} height={b.h + 16} fill="none" stroke="#2b6cff" strokeWidth={1} />
              <text x={b.x - 8} y={b.y - 14} fill="#2b6cff" fontSize={16} fontFamily="monospace">
                group {g}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          padding: "6px 10px",
          background: "rgba(26,26,24,0.8)",
          color: "#fff",
          font: "14px/1.5 monospace",
          whiteSpace: "pre",
        }}
      >
        {`camera  x ${camera.x.toFixed(0)}  y ${camera.y.toFixed(0)}  zoom ${camera.zoom.toFixed(2)}  z ${camera.z.toFixed(2)}`}
      </div>
    </AbsoluteFill>
  );
};
