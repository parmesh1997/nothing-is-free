import { FigureShape } from "./figure";

/**
 * FlatFigure — TIER 2. Draws a FigureShape's flat-colour pass into a LOCAL svg
 * (viewBox 0 0 w h) that fills its positioned parent. Pair with <PaperEdge> for
 * the torn-cutout look, or use <FigureBlock> / <SceneFigure> which do both.
 */
export const FlatFigure: React.FC<{
  shape: FigureShape;
  w: number;
  h: number;
}> = ({ shape: Shape, w, h }) => (
  <svg
    width={w}
    height={h}
    viewBox={`0 0 ${w} ${h}`}
    style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
  >
    <Shape paint={(c) => c} mode="fill" w={w} h={h} ox={0} oy={0} />
  </svg>
);
