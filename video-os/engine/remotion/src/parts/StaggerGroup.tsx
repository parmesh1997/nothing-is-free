import { Children } from "react";
import { MOTION } from "../tokens";
import { SpringIn } from "./SpringIn";
import { staggerDelay } from "./motion";

/**
 * StaggerGroup — TIER 3 (§4.3). "Stagger, never stack." Never more than 2
 * elements arriving in the same 6 frames; a group of five enters as five events
 * at 4-frame offsets.
 *
 * Wraps each child in a SpringIn with an incrementing delay. Counts as N motion
 * events for the 3.5s rule (§4.2), not one.
 */
export const StaggerGroup: React.FC<{
  /** Frames before the first child arrives. */
  startDelay?: number;
  /** Per-child offset. Default 4 (§4.3). */
  offset?: number;
  durationInFrames?: number;
  rise?: number;
  slide?: number;
  /** Container style — position the group; children lay out inside it. */
  style?: React.CSSProperties;
  childStyle?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  startDelay = 0,
  offset = MOTION.staggerOffsetFrames,
  durationInFrames = 20,
  rise = 24,
  slide = 0,
  style,
  childStyle,
  children,
}) => {
  const items = Children.toArray(children);

  return (
    <div style={style}>
      {items.map((child, i) => (
        <SpringIn
          key={i}
          delay={startDelay + staggerDelay(i, offset)}
          durationInFrames={durationInFrames}
          rise={rise}
          slide={slide}
          style={childStyle}
        >
          {child}
        </SpringIn>
      ))}
    </div>
  );
};
