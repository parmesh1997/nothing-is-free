import { AbsoluteFill } from "remotion";
import { PlaneName, Z } from "../tokens";
import { useScene } from "./SpatialScene";

/**
 * Layer — TIER 4 (§3.2). A parallax plane. Distant planes move less; near planes
 * move more. The subject plane tracks the camera 1:1; every other plane moves at
 * its rate RELATIVE to the subject (the §3.2 ratios).
 *
 *   background −3.0  0.02×      → 0.2× of the subject's pan
 *   deepMid    −2.0  0.04×      → 0.4×
 *   midground  −1.0  0.06×      → 0.6×
 *   subject    −0.5  0.10×      → 1.0×
 *   foreground  0.0  0.14×      → 1.4×
 */
const SUBJECT_RATE = Z.subject.parallax;
export const relativeParallax = (plane: PlaneName) =>
  Z[plane].parallax / SUBJECT_RATE;

export const Layer: React.FC<{
  plane: PlaneName;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ plane, style, children }) => {
  const { camera } = useScene();
  const r = relativeParallax(plane);

  return (
    <AbsoluteFill
      style={{
        translate: `${-camera.x * r}px ${-camera.y * r}px`,
        zIndex: Math.round((3 + Z[plane].z) * 100),
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
