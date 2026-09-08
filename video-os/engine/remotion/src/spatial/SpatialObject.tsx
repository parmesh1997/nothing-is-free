import { useCurrentFrame, useVideoConfig } from "remotion";
import { springIn } from "../parts/motion";
import { useScene } from "./SpatialScene";

/**
 * SpatialObject — TIER 4 (§3.5).
 *   SpatialObject { id, asset, position {x,y,z}, rotation, scale, opacity, animation }
 *
 * Places its child at a world rect inside the current <Layer>. The `id` must
 * match a rect declared on <SpatialScene objects={...}> so the camera can target
 * it. `position` here is the top-left, matching the declared rect.
 */
export const SpatialObject: React.FC<{
  id: string;
  /** Entry frame + side, mirrors §11.2 "Entry side". */
  enterFrame?: number;
  enterFrom?: "L" | "R" | "up" | "down" | "none";
  enterDurationInFrames?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  children?: React.ReactNode;
}> = ({
  id,
  enterFrame = 0,
  enterFrom = "none",
  enterDurationInFrames = 20,
  rotation = 0,
  scale = 1,
  opacity = 1,
  children,
}) => {
  const { objects } = useScene();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rect = objects[id];
  if (!rect) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[SpatialObject] "${id}" is not declared on <SpatialScene objects>`);
    }
    return null;
  }

  const p =
    enterFrom === "none"
      ? 1
      : springIn({ frame, fps, delay: enterFrame, durationInFrames: enterDurationInFrames });

  const dist = 220;
  const ex =
    enterFrom === "L" ? -dist : enterFrom === "R" ? dist : 0;
  const ey =
    enterFrom === "up" ? -dist : enterFrom === "down" ? dist : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        translate: `${ex * (1 - p)}px ${ey * (1 - p)}px`,
        rotate: rotation ? `${rotation}deg` : undefined,
        scale: scale === 1 ? undefined : scale,
        opacity: opacity * (enterFrom === "none" ? 1 : p),
      }}
    >
      {children}
    </div>
  );
};
