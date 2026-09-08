import { AbsoluteFill } from "remotion";
import { FIELD, WIDTH } from "../tokens";
import { FigureShape } from "../print/figure";
import {
  Layer,
  SceneCameraKey,
  SceneObjects,
  SpatialObject,
  SpatialScene,
  focusOn,
  pullToFit,
} from "../spatial";
import { SceneFigure } from "./SceneFigure";

type Item = { id: string; label?: string; shape: FigureShape; from?: "L" | "R" | "up" | "down" };

/**
 * RevealArchetype — TIER 6 (§3.4 Reveal). "Start tight, open out to the larger
 * system." The subject is framed tight; the camera pulls back and the
 * surrounding context enters, then the whole system is held.
 *
 * Wide-End Law (§3.3): the composition must satisfy occupancy at the WIDE end.
 * Space `context` items so the pulled-back frame is not empty.
 */
export const RevealArchetype: React.FC<{
  subject: Item;
  context: Item[];
  durationInFrames: number;
  subjectHeight?: number;
  contextHeight?: number;
}> = ({ subject, context, durationInFrames, subjectHeight = 620, contextHeight = 300 }) => {
  const groundY = FIELD.groundRule.y;

  const subjectRect = {
    x: WIDTH / 2 - subjectHeight * 0.26,
    y: groundY - subjectHeight,
    w: subjectHeight * 0.52,
    h: subjectHeight,
    plane: "subject" as const,
  };

  const objs: SceneObjects = { [subject.id]: subjectRect };
  context.forEach((c, i) => {
    // Alternate sides, receding.
    const side = i % 2 === 0 ? -1 : 1;
    const rank = Math.floor(i / 2) + 1;
    objs[c.id] = {
      x: WIDTH / 2 + side * (420 + rank * 260) - contextHeight * 0.3,
      y: groundY - contextHeight,
      w: contextHeight * 0.6,
      h: contextHeight,
      plane: rank === 1 ? "midground" : "deepMid",
    };
  });

  const clampF = (f: number) => Math.min(durationInFrames - 1, Math.max(0, Math.round(f)));
  const contextEnter = clampF(durationInFrames * 0.34);

  const camera: SceneCameraKey[] = [
    { frame: 0, target: focusOn(subject.id, 0.66) },
    { frame: clampF(durationInFrames * 0.3), target: focusOn(subject.id, 0.6) },
    { frame: clampF(durationInFrames * 0.6), target: pullToFit(["__all__"], 180) },
  ];
  // pullToFit needs a real id set:
  camera[2].target = pullToFit(Object.keys(objs), 90);

  return (
    <AbsoluteFill>
      <SpatialScene objects={objs} camera={camera}>
        {context.map((c, i) => (
          <Layer key={c.id} plane={objs[c.id].plane ?? "midground"}>
            <SpatialObject id={c.id} enterFrame={contextEnter + i * 6} enterFrom={c.from ?? (i % 2 ? "R" : "L")}>
              <SceneFigure rect={objs[c.id]} shape={c.shape} label={c.label} entryFrame={contextEnter + i * 6} />
            </SpatialObject>
          </Layer>
        ))}
        <Layer plane="subject">
          <SpatialObject id={subject.id}>
            <SceneFigure rect={subjectRect} shape={subject.shape} label={subject.label} />
          </SpatialObject>
        </Layer>
      </SpatialScene>
    </AbsoluteFill>
  );
};
