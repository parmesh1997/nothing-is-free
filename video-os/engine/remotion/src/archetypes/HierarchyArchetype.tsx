import { AbsoluteFill } from "remotion";
import { FIELD, WIDTH } from "../tokens";
import { FigureShape } from "../print/figure";
import {
  Connection,
  Layer,
  SceneCameraKey,
  SceneObjects,
  SpatialObject,
  SpatialScene,
  focusOn,
  pullToFit,
} from "../spatial";
import { SceneFigure } from "./SceneFigure";

type Node = {
  id: string;
  label: string;
  shape: FigureShape;
  /** Entry direction (§3.6 step 3: "from their own directions"). */
  from?: "L" | "R" | "up" | "down";
};

/**
 * HierarchyArchetype — TIER 6 (§3.6). The house pattern for relationships:
 * ownership, fee stacks, platform ecosystems, cause and effect.
 *
 *   1  Reveal the parent, framed tight
 *   2  Camera pulls back slightly
 *   3  Children enter from their own directions, staggered
 *   4  Connection lines draw between parent and children
 *   5  Camera reframes to hold the complete hierarchy
 *   6  Camera travels toward the next relevant branch  (optional)
 *
 * Do not destroy previous elements when moving on — keeping them in the same
 * spatial world is what produces documentary continuity (§3.6).
 */
export const HierarchyArchetype: React.FC<{
  parent: Omit<Node, "from">;
  children: Node[];
  durationInFrames: number;
  parentHeight?: number;
  childHeight?: number;
  /** Step 6: at this frame the camera travels toward `nextBranchId`. */
  nextBranchAt?: number;
  nextBranchId?: string;
  extraObjects?: SceneObjects;
}> = ({
  parent,
  children,
  durationInFrames,
  parentHeight = 360,
  childHeight = 240,
  nextBranchAt,
  nextBranchId,
  extraObjects = {},
}) => {
  const groundY = FIELD.groundRule.y;

  // Parent sits in the upper band; children spread along the ground rule below
  // it, so connection lines fan downward and nothing overlaps (§3.6).
  const parentRect = {
    x: WIDTH / 2 - (parentHeight * 0.72) / 2,
    y: 96,
    w: parentHeight * 0.72,
    h: parentHeight,
    plane: "subject" as const,
  };

  const n = children.length;
  const spread = Math.min(WIDTH - 380, Math.max(1, n) * (childHeight * 1.25));
  const childObjs: SceneObjects = {};
  children.forEach((c, i) => {
    const t = n <= 1 ? 0.5 : i / (n - 1);
    const cx = WIDTH / 2 - spread / 2 + t * spread;
    childObjs[c.id] = {
      x: cx - (childHeight * 0.5) / 2,
      y: groundY - childHeight,
      w: childHeight * 0.5,
      h: childHeight,
      plane: "subject",
    };
  });

  // Parent must clear the tallest child + its label.
  const maxChildTop = Math.min(...Object.values(childObjs).map((r) => r.y));
  if (parentRect.y + parentRect.h > maxChildTop - 70) {
    parentRect.h = Math.max(180, maxChildTop - 70 - parentRect.y);
  }

  const objects: SceneObjects = { [parent.id]: parentRect, ...childObjs, ...extraObjects };
  const groups = { hierarchy: [parent.id, ...children.map((c) => c.id)] };

  const clampF = (f: number) => Math.min(durationInFrames - 1, Math.max(0, Math.round(f)));
  const childrenEnter = clampF(durationInFrames * 0.28);
  const linesDraw = clampF(durationInFrames * 0.48);
  const holdAll = clampF(durationInFrames * 0.62);

  const camera: SceneCameraKey[] = [
    { frame: 0, target: focusOn(parent.id, 0.66) }, // 1
    { frame: clampF(durationInFrames * 0.2), target: focusOn(parent.id, 0.5) }, // 2
    { frame: holdAll, target: pullToFit("hierarchy", 90) }, // 5 — hold tight (Wide-End Law §3.3)
  ];
  if (nextBranchAt !== undefined && nextBranchId) {
    camera.push({ frame: clampF(nextBranchAt), target: focusOn(nextBranchId, 0.6) }); // 6
  }

  return (
    <AbsoluteFill>
      <SpatialScene objects={objects} groups={groups} camera={camera}>
        <Layer plane="subject">
          <SpatialObject id={parent.id}>
            <SceneFigure rect={parentRect} shape={parent.shape} label={parent.label} labelPos="above" />
          </SpatialObject>

          {children.map((c, i) => (
            <SpatialObject
              key={c.id}
              id={c.id}
              enterFrame={childrenEnter + i * 6}
              enterFrom={c.from ?? (i % 2 === 0 ? "L" : "R")}
            >
              <SceneFigure
                rect={childObjs[c.id]}
                shape={c.shape}
                label={c.label}
                entryFrame={childrenEnter + i * 6}
              />
            </SpatialObject>
          ))}
        </Layer>

        {children.map((c, i) => (
          <Connection
            key={c.id}
            from={parent.id}
            to={c.id}
            start={linesDraw + i * 5}
            end={linesDraw + i * 5 + 18}
          />
        ))}
      </SpatialScene>
    </AbsoluteFill>
  );
};
