import { useCurrentFrame, useVideoConfig } from "remotion";
import { interpolate } from "remotion";
import { EASE, springIn } from "../parts/motion";
import { boundsOf, useScene } from "./SpatialScene";

/**
 * Group — TIER 4 (§3.5). "a group moves, scales, enters, exits and is
 * camera-targetable as one unit, so an entire branch of a diagram can be
 * repositioned without touching its children."
 *
 * Essential for explanatory chains (§3.5). The group's members are declared on
 * <SpatialScene groups={{ name: [...ids] }}>; this component applies a shared
 * transform around their common centre.
 */
export const Group: React.FC<{
  id: string;
  /** Translate the whole group by this much, in px. */
  move?: { x?: number; y?: number };
  /** Scale the group about its centre. */
  scale?: number;
  /** Fade the group. */
  opacity?: number;
  /** Spring the group in as one unit. */
  enterFrame?: number;
  enterDurationInFrames?: number;
  /** Slide the whole group out over [start, end]. */
  exit?: { start: number; end: number; x?: number; y?: number };
  children?: React.ReactNode;
}> = ({
  id,
  move,
  scale = 1,
  opacity = 1,
  enterFrame,
  enterDurationInFrames = 24,
  exit,
  children,
}) => {
  const { objects, groups } = useScene();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = boundsOf(id, objects, groups);
  const originX = b.x + b.w / 2;
  const originY = b.y + b.h / 2;

  const entered =
    enterFrame === undefined
      ? 1
      : springIn({ frame, fps, delay: enterFrame, durationInFrames: enterDurationInFrames });

  const exitP = exit
    ? interpolate(frame, [exit.start, exit.end], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE.exitIn,
      })
    : 0;

  const tx = (move?.x ?? 0) + (exit?.x ?? 0) * exitP;
  const ty = (move?.y ?? 0) + (exit?.y ?? 0) * exitP + 30 * (1 - entered);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: `${originX}px ${originY}px`,
        translate: `${tx}px ${ty}px`,
        scale: scale === 1 ? undefined : scale,
        opacity: opacity * entered * (1 - exitP),
      }}
    >
      {children}
    </div>
  );
};
