import { useCurrentFrame, useVideoConfig } from "remotion";
import { FPS } from "../tokens";

/**
 * Breathe — TIER 3. The anti-static floor (§4.2): a barely-there scale cycle so
 * held frames are never frozen. Micro-motion — it does NOT count toward the
 * 3.5s event rule.
 *
 * Pair with grid drift (already in the LockedField). A held beat still needs
 * real events every ~3.3s (§4.2 Rest = 3 per 10s).
 */
export const Breathe: React.FC<{
  /** Peak scale delta, e.g. 0.006 = ±0.6%. */
  amount?: number;
  /** Seconds per full breath. */
  periodSeconds?: number;
  /** Phase offset so multiple elements don't breathe in lockstep. */
  phase?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  amount = 0.006,
  periodSeconds = 6,
  phase = 0,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / (periodSeconds * (fps || FPS))) * Math.PI * 2 + phase;
  const scale = 1 + Math.sin(t) * amount;

  return <div style={{ scale, ...style }}>{children}</div>;
};
