import { COLOR } from "../tokens";
import { FigureShape } from "./figure";

/**
 * locations.tsx — the ENVIRONMENTS / LOCATIONS from the ASSETS LIBRARY sheet:
 * small building fronts. Flat colour, thin outline, an awning / sign band, doors.
 * FigureShapes — get the torn-paper edge via FigureBlock.
 */

const S = (h: number) => ({
  stroke: COLOR.outline,
  strokeWidth: h * 0.01,
  strokeLinejoin: "round" as const,
});

/** Supermarket — long low front, orange awning, sliding doors. */
export const Supermarket: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={0} y={h * 0.18} width={w} height={h * 0.82} fill={paint(COLOR.cardWhite)} {...S(h)} />
      <rect x={-w * 0.03} y={h * 0.1} width={w * 1.06} height={h * 0.14} fill={paint(COLOR.orange)} {...S(h)} />
      {d && (
        <>
          <rect x={w * 0.06} y={h * 0.32} width={w * 0.5} height={h * 0.22} fill={paint(COLOR.grey)} opacity={0.35} stroke={paint(COLOR.outline)} strokeWidth={h * 0.008} />
          <rect x={w * 0.62} y={h * 0.44} width={w * 0.3} height={h * 0.56} fill={paint(COLOR.ink)} {...S(h)} />
          <line x1={w * 0.77} y1={h * 0.44} x2={w * 0.77} y2={h} stroke={paint(COLOR.cardWhite)} strokeWidth={h * 0.01} />
          <text x={w * 0.31} y={h * 0.2} textAnchor="middle" fontFamily='"Bebas Neue", sans-serif' fontSize={h * 0.1} fill={paint(COLOR.cardWhite)}>MARKET</text>
        </>
      )}
    </>
  );
};

/** Airport — control tower + low terminal + a plane tail. */
export const Airport: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={w * 0.08} y={h * 0.5} width={w * 0.84} height={h * 0.5} fill={paint(COLOR.cardWhite)} {...S(h)} />
      <rect x={w * 0.6} y={h * 0.12} width={w * 0.16} height={h * 0.4} fill={paint(COLOR.grey)} {...S(h)} />
      <path d={`M ${w * 0.56} ${h * 0.12} L ${w * 0.8} ${h * 0.12} L ${w * 0.74} ${h * 0.02} L ${w * 0.62} ${h * 0.02} Z`} fill={paint(COLOR.ink)} {...S(h)} />
      {d && (
        <>
          <rect x={w * 0.62} y={h * 0.16} width={w * 0.12} height={h * 0.08} fill={paint(COLOR.orange)} />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={w * (0.14 + i * 0.12)} y={h * 0.58} width={w * 0.07} height={h * 0.16} fill={paint(COLOR.grey)} opacity={0.4} stroke={paint(COLOR.outline)} strokeWidth={h * 0.006} />
          ))}
          {/* plane tail poking up behind */}
          <path d={`M ${w * 0.02} ${h * 0.5} l ${w * 0.16} ${-h * 0.24} l ${w * 0.04} 0 l ${-w * 0.1} ${h * 0.24} z`} fill={paint(COLOR.orange)} {...S(h)} />
        </>
      )}
    </>
  );
};

/** Coffee shop — narrow front, striped awning, a hanging sign. */
export const CoffeeShop: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={w * 0.06} y={h * 0.22} width={w * 0.88} height={h * 0.78} fill={paint(COLOR.cardWhite)} {...S(h)} />
      {/* scalloped awning */}
      <path
        d={`M ${w * 0.02} ${h * 0.22} L ${w * 0.98} ${h * 0.22} L ${w * 0.98} ${h * 0.36}
            ${Array.from({ length: 6 }).map((_, i) => `Q ${w * (0.9 - i * 0.16)} ${h * 0.46} ${w * (0.82 - i * 0.16)} ${h * 0.36}`).join(" ")}
            L ${w * 0.02} ${h * 0.36} Z`}
        fill={paint(COLOR.orange)}
        {...S(h)}
      />
      {d && (
        <>
          <rect x={w * 0.14} y={h * 0.44} width={w * 0.42} height={h * 0.3} fill={paint(COLOR.grey)} opacity={0.3} stroke={paint(COLOR.outline)} strokeWidth={h * 0.008} />
          <rect x={w * 0.62} y={h * 0.44} width={w * 0.24} height={h * 0.56} fill={paint(COLOR.ink)} {...S(h)} />
          <rect x={w * 0.34} y={h * 0.06} width={w * 0.32} height={h * 0.14} fill={paint(COLOR.ink)} {...S(h)} />
          <text x={w * 0.5} y={h * 0.165} textAnchor="middle" fontFamily='"Bebas Neue", sans-serif' fontSize={h * 0.09} fill={paint(COLOR.cardWhite)}>COFFEE</text>
        </>
      )}
    </>
  );
};
