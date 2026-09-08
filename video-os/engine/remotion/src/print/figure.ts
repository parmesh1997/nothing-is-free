/**
 * A FigureShape draws one code-native figure/object in its OWN LOCAL BOX: an SVG
 * viewBox of `0 0 w h`, origin top-left. FLAT COLOUR — no halftone.
 *
 * Called twice:
 *   - mode "fill" → `paint(c)` returns `c`; draw the full object with its real
 *     colours (base + a `shade()` tone + a `tint()` highlight for premium flat
 *     modelling), plus fine detail.
 *   - mode "edge" → `paint(c)` returns the sticker-edge colour for EVERY call;
 *     draw ONLY the big silhouette masses (skip thin lines / detail — gate on
 *     `mode === "fill"`). This pass, scaled up slightly, is the torn-paper
 *     cutout edge behind the figure (§2.5 successor).
 */
export type FigureShapeProps = {
  paint: (color: string) => string;
  mode: "fill" | "edge";
  /** The local box size in px. Draw within 0..w, 0..h. */
  w: number;
  h: number;
  /** Always 0 — kept so shapes can read a nominal origin. */
  ox: number;
  oy: number;
};

export type FigureShape = React.FC<FigureShapeProps>;
