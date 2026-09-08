import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, HEIGHT, WIDTH } from "../../tokens";
import { shade, tint } from "../../tokens";
import { EASE } from "../../parts/motion";
import { LIGHT } from "./light";

/**
 * Room3D — the v4 depth model, v2 (creator, 2026-09-03: "2.5D or a little 3D
 * style" — the OverSimplified room).
 *
 * A drawn one-point-perspective room on the cream palette:
 *   · the WALL is the cream (kept — ~50% of frame, the "background stays" rule)
 *   · the FLOOR is a warm plane receding to a vanishing point, with a faint
 *     converging grid that fades toward the back
 *   · a soft window-light shaft from the top-left key direction, with a warm
 *     pool where it lands on the floor
 *   · a corner ambient-occlusion gradient so the room has a back corner
 *
 * Flat-shaded, no textures, no real 3D — perspective is drawn, not projected.
 * Furniture sits on `FLOOR_Y` with its own ContactShadow. Wall art hangs above
 * `HORIZON`.
 */

export const HORIZON = Math.round(HEIGHT * 0.5); // wall/floor seam
export const FLOOR_Y = Math.round(HEIGHT * 0.87); // where furniture stands
export const VP = { x: WIDTH * 0.42, y: HORIZON }; // vanishing point, a touch left

const FLOOR = "#EBE1CC"; // barely-warmer than the cream — depth comes from the
const FLOOR_BACK = tint(FLOOR, 0.35); // lines + light, NOT a dark slab (80% cream rule)

export const Room3D: React.FC<{
  /** 0..1 build-in (the room rises / resolves). */
  reveal?: number;
  /** dim the whole room slightly (a later beat pushing it back). */
  dim?: number;
}> = ({ reveal = 1, dim = 1 }) => {
  const frame = useCurrentFrame();
  const r = Math.max(0, Math.min(1, reveal));

  // gentle life in the light so a held frame never freezes
  const flicker = 0.96 + 0.04 * Math.sin(frame / 40) + 0.015 * Math.sin(frame / 11);

  return (
    <AbsoluteFill style={{ opacity: dim }}>
      {/* WALL — the cream, with the faintest warm gradient toward the floor seam */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: HORIZON + 2,
          background: `linear-gradient(180deg, ${COLOR.paper} 0%, ${COLOR.paper} 78%, ${tint(FLOOR, 0.5)} 100%)`,
        }}
      />

      {/* FLOOR — a receding plane, full width at the bottom, meeting the wall at HORIZON */}
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="v4-floor" x1="0" y1={HORIZON} x2="0" y2={HEIGHT} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={FLOOR_BACK} />
            <stop offset="40%" stopColor={FLOOR} />
            <stop offset="100%" stopColor={shade(FLOOR, 0.05)} />
          </linearGradient>
          <radialGradient id="v4-lightpool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,246,222,0.55)" />
            <stop offset="70%" stopColor="rgba(255,246,222,0.12)" />
            <stop offset="100%" stopColor="rgba(255,246,222,0)" />
          </radialGradient>
          <linearGradient id="v4-corner" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor={`rgba(${LIGHT.shadowRGB}, 0.08)`} />
            <stop offset="40%" stopColor={`rgba(${LIGHT.shadowRGB}, 0)`} />
            <stop offset="100%" stopColor={`rgba(${LIGHT.shadowRGB}, 0)`} />
          </linearGradient>
        </defs>

        {/* the floor quad */}
        <path d={`M 0 ${HEIGHT} L 0 ${HORIZON} L ${WIDTH} ${HORIZON} L ${WIDTH} ${HEIGHT} Z`} fill="url(#v4-floor)" />

        {/* converging depth lines — fade toward the back */}
        <g opacity={0.62 * r}>
          {[-0.5, -0.18, 0.16, 0.5, 0.86, 1.3].map((fx, i) => (
            <line
              key={i}
              x1={WIDTH * fx}
              y1={HEIGHT}
              x2={VP.x}
              y2={VP.y}
              stroke={shade(FLOOR, 0.13)}
              strokeWidth={1.6}
              opacity={0.55}
            />
          ))}
          {/* horizontal floor bands, tighter toward the back */}
          {[0.16, 0.34, 0.54, 0.76, 1].map((t, i) => {
            const y = HORIZON + (HEIGHT - HORIZON) * t * t;
            return <line key={`h${i}`} x1={0} y1={y} x2={WIDTH} y2={y} stroke={shade(FLOOR, 0.11)} strokeWidth={1.3} opacity={0.42} />;
          })}
        </g>

        {/* the seam highlight — a thin lit line where wall meets floor */}
        <line x1={0} y1={HORIZON} x2={WIDTH} y2={HORIZON} stroke={tint(FLOOR, 0.4)} strokeWidth={2} opacity={0.7 * r} />

        {/* back-corner ambient occlusion (right side, away from the key light) */}
        <rect x={WIDTH * 0.55} y={0} width={WIDTH * 0.45} height={HEIGHT} fill="url(#v4-corner)" transform={`translate(${WIDTH * 0.55} 0) scale(-1 1) translate(${-WIDTH * 0.55} 0)`} />
      </svg>

      {/* WINDOW LIGHT — a soft shaft from the top-left, landing as a pool on the floor */}
      <div
        style={{
          position: "absolute",
          left: -WIDTH * 0.1,
          top: -HEIGHT * 0.1,
          width: WIDTH * 0.62,
          height: HEIGHT * 1.1,
          background: `linear-gradient(115deg, rgba(255,247,224,${0.5 * flicker * r}) 0%, rgba(255,247,224,${0.16 * flicker * r}) 34%, rgba(255,247,224,0) 62%)`,
          pointerEvents: "none",
        }}
      />
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <ellipse cx={WIDTH * 0.32} cy={HEIGHT * 0.74} rx={WIDTH * 0.26} ry={HEIGHT * 0.12} fill="url(#v4-lightpool)" opacity={flicker * r} />
      </svg>
    </AbsoluteFill>
  );
};

/** convenience: the build-in ramp for the room, given a start frame. */
export const roomReveal = (frame: number, at: number, dur = 26) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
