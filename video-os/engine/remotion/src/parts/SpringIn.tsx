import { useCurrentFrame, useVideoConfig } from "remotion";
import { springIn } from "./motion";

/**
 * SpringIn — TIER 3. "Anything arriving" (§4.1): spring(damping 12, mass 0.8,
 * stiffness 100). Opacity + a short rise, optional slide / scale.
 *
 * The rise distance is small on purpose — large travel reads as a slide, not an
 * arrival. For big contextual moves use the camera (Tier 4), not this.
 */
export const SpringIn: React.FC<{
  /** Frames to wait before this element arrives. Use staggerDelay() for groups. */
  delay?: number;
  /** How long the spring takes to settle. */
  durationInFrames?: number;
  /** Vertical rise in px (positive = rises up into place). */
  rise?: number;
  /** Horizontal slide in px (e.g. entry from an edge, §11.2 "Entry side"). */
  slide?: number;
  /** Scale from → 1 (1 = no scale). */
  fromScale?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  delay = 0,
  durationInFrames = 20,
  rise = 24,
  slide = 0,
  fromScale = 1,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springIn({ frame, fps, delay, durationInFrames });

  const s: React.CSSProperties = {
    opacity: p,
    translate: `${slide * (1 - p)}px ${rise * (1 - p)}px`,
    ...style,
  };
  if (fromScale !== 1) s.scale = fromScale + (1 - fromScale) * p;

  return <div style={s}>{children}</div>;
};
