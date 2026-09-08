import { AbsoluteFill } from "remotion";
import { FIELD, WIDTH } from "../tokens";

/**
 * GroundRule — the baseline everything sits on (§2.2, §2.3).
 * "#B8B8AE, 2px, at 78% frame height, full width."
 *
 * Drawn in every single frame, including the reversal. Together with the grid it
 * is the continuity that makes the piece read as one continuous shot (§2.3).
 *
 * Every solid foreground object must touch this line or a surface resting on it
 * — nothing floats (§2.2 baseline contact).
 */
export const GroundRule: React.FC = () => {
  const { color, thickness, y } = FIELD.groundRule;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: y,
          width: WIDTH,
          height: thickness,
          backgroundColor: color,
        }}
      />
    </AbsoluteFill>
  );
};
