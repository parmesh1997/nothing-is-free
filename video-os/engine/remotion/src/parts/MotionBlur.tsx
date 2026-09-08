import { useCurrentFrame } from "remotion";
import { velocityBlur } from "./motion";

/**
 * MotionBlur — TIER 3 (§4.4). Per-element blur derived from velocity, falling to
 * zero at rest: blur = min(|velocityPxPerFrame| * 0.45, 24).
 *
 * A blurred object at rest is a bug. Never on stationary type, small UI, or slow
 * movement — the component clamps sub-pixel velocities to zero blur.
 *
 * Give it either an explicit `velocityPxPerFrame`, or a `sampler(frame) → px`
 * along the primary axis of motion and it differentiates.
 */
export const MotionBlur: React.FC<{
  velocityPxPerFrame?: number;
  sampler?: (frame: number) => number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ velocityPxPerFrame, sampler, style, children }) => {
  const frame = useCurrentFrame();
  const v =
    velocityPxPerFrame ??
    (sampler ? sampler(frame) - sampler(frame - 1) : 0);
  const blur = velocityBlur(v);
  const px = blur < 0.5 ? 0 : blur;

  return (
    <div style={{ filter: px === 0 ? undefined : `blur(${px}px)`, ...style }}>
      {children}
    </div>
  );
};
