import { AbsoluteFill, interpolate } from "remotion";
import { COLOR, FIELD, FPS, HEIGHT, WIDTH } from "../tokens";

/**
 * Grid — 1px lines, 48px spacing, 22% opacity (§2.3).
 *
 * Grid drift: "+2px x, +1px y over 20s, sinusoidal — imperceptible, kills the
 * frozen read." The drift is a function of the GLOBAL frame (§11.3), so it is
 * continuous across every beat boundary and never jumps.
 *
 * In the Dark Law the grid stays, dropping to 8% white (§2.9).
 */
export const Grid: React.FC<{
  /** globalStartFrame + local frame — NOT the local frame (§11.3). */
  globalFrame: number;
  darkLawProgress?: number;
}> = ({ globalFrame, darkLawProgress = 0 }) => {
  const { spacing, lineWidth, opacity, drift } = FIELD.grid;

  const periodFrames = drift.periodSeconds * FPS;
  const phase = (globalFrame / periodFrames) * Math.PI * 2;
  const driftX = Math.sin(phase) * drift.xAmplitude;
  const driftY = Math.cos(phase) * drift.yAmplitude;

  // Paper-grey lines fade toward white as the Dark Law takes hold.
  const lineColor =
    darkLawProgress <= 0
      ? COLOR.grid
      : `rgba(255, 255, 255, ${interpolate(darkLawProgress, [0, 1], [0, 1])})`;
  const groupOpacity = interpolate(
    darkLawProgress,
    [0, 1],
    [opacity, FIELD.grid.darkLawOpacity],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Oversize by one cell in every direction so the drift never exposes an edge.
  const pad = spacing;

  return (
    <AbsoluteFill style={{ opacity: groupOpacity }}>
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern
            id="nif-grid"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${driftX} ${driftY})`}
          >
            <path
              d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
              fill="none"
              stroke={lineColor}
              strokeWidth={lineWidth}
            />
          </pattern>
        </defs>
        <rect
          x={-pad}
          y={-pad}
          width={WIDTH + pad * 2}
          height={HEIGHT + pad * 2}
          fill="url(#nif-grid)"
        />
      </svg>
    </AbsoluteFill>
  );
};
