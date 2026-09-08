import { TYPE } from "../tokens";
import { FigureShape } from "../print/figure";
import { FlatFigure } from "../print/FlatFigure";
import { PaperEdge } from "../print/PaperEdge";
import { Rect } from "../spatial";

/**
 * SceneFigure — a flat-colour cutout that FILLS its <SpatialObject> box (already
 * positioned by the scene). Torn paper edge + flat figure + optional unit label.
 */
export const SceneFigure: React.FC<{
  rect: Rect;
  shape: FigureShape;
  label?: string;
  labelPos?: "below" | "above";
  entryFrame?: number;
}> = ({ rect, shape, label, labelPos = "below", entryFrame = 0 }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PaperEdge shape={shape} w={rect.w} h={rect.h} entryFrame={entryFrame} />
    <FlatFigure shape={shape} w={rect.w} h={rect.h} />
    {label ? (
      <div
        style={{
          position: "absolute",
          left: -60,
          ...(labelPos === "above" ? { top: -46 } : { top: rect.h + 14 }),
          width: rect.w + 120,
          textAlign: "center",
          ...TYPE.unit,
        }}
      >
        {label}
      </div>
    ) : null}
  </div>
);
