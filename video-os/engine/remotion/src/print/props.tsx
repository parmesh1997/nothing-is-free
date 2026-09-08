import { COLOR, shade } from "../tokens";
import { FigureShape } from "./figure";

/**
 * props.tsx — the PROPS / OBJECTS library from the ASSETS LIBRARY sheet.
 * Flat colour, thin dark outline, minimal detail. Each is a FigureShape so it
 * gets the torn-paper edge + placement + entry via FigureBlock.
 *
 * In "edge" mode each draws only its big silhouette masses.
 */

const S = (h: number) => ({
  stroke: COLOR.outline,
  strokeWidth: h * 0.012,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
});

/** Soda cup with a lid + straw. */
export const SodaCup: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <path d={`M ${w * 0.16} ${h * 0.24} L ${w * 0.84} ${h * 0.24} L ${w * 0.74} ${h} L ${w * 0.26} ${h} Z`} fill={paint(COLOR.cardWhite)} {...S(h)} />
      {d && <rect x={w * 0.2} y={h * 0.5} width={w * 0.6} height={h * 0.12} fill={paint(COLOR.orange)} />}
      <rect x={w * 0.12} y={h * 0.16} width={w * 0.76} height={h * 0.1} rx={h * 0.03} fill={paint(COLOR.grey)} {...S(h)} />
      <line x1={w * 0.62} y1={h * 0.18} x2={w * 0.78} y2={-h * 0.16} stroke={paint(COLOR.orange)} strokeWidth={h * 0.05} strokeLinecap="round" />
    </>
  );
};

/** Movie clapperboard. */
export const Clapperboard: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={0} y={h * 0.3} width={w} height={h * 0.7} fill={paint(COLOR.ink)} {...S(h)} />
      <g transform={`rotate(-14 ${w * 0.06} ${h * 0.3})`}>
        <rect x={0} y={h * 0.14} width={w} height={h * 0.2} fill={paint(COLOR.ink)} {...S(h)} />
        {d && Array.from({ length: 5 }).map((_, i) => (
          <path key={i} d={`M ${w * (0.08 + i * 0.19)} ${h * 0.14} l ${w * 0.08} ${h * 0.2} l ${w * 0.06} 0 l ${-w * 0.08} ${-h * 0.2} z`} fill={paint(COLOR.cardWhite)} />
        ))}
      </g>
      {d && <text x={w * 0.5} y={h * 0.72} textAnchor="middle" fontFamily='"Bebas Neue", sans-serif' fontSize={h * 0.22} fill={paint(COLOR.cardWhite)}>SCENE 1</text>}
    </>
  );
};

/** Shopping cart, side view. */
export const Cart: FigureShape = ({ paint, w, h }) => (
  <>
    <path d={`M ${w * 0.05} ${h * 0.1} L ${w * 0.22} ${h * 0.1} L ${w * 0.34} ${h * 0.6} L ${w * 0.92} ${h * 0.6} L ${w} ${h * 0.24} L ${w * 0.28} ${h * 0.24}`} fill="none" {...S(h)} stroke={paint(COLOR.ink)} strokeWidth={h * 0.05} />
    <circle cx={w * 0.42} cy={h * 0.82} r={h * 0.1} fill={paint(COLOR.ink)} {...S(h)} />
    <circle cx={w * 0.82} cy={h * 0.82} r={h * 0.1} fill={paint(COLOR.ink)} {...S(h)} />
    <rect x={w * 0.34} y={h * 0.26} width={w * 0.58} height={h * 0.32} fill={paint(COLOR.orange)} opacity={0.9} />
  </>
);

/** Credit card. */
export const CreditCard: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={0} y={0} width={w} height={h} rx={h * 0.12} fill={paint(COLOR.ink)} {...S(h)} />
      {d && (
        <>
          <rect x={w * 0.08} y={h * 0.22} width={w * 0.16} height={h * 0.2} rx={h * 0.03} fill={paint(COLOR.ochre)} />
          <rect x={w * 0.08} y={h * 0.62} width={w * 0.5} height={h * 0.08} fill={paint(COLOR.grey)} />
          <circle cx={w * 0.82} cy={h * 0.7} r={h * 0.12} fill={paint(COLOR.orange)} />
          <circle cx={w * 0.72} cy={h * 0.7} r={h * 0.12} fill={paint(COLOR.orange)} opacity={0.6} />
        </>
      )}
    </>
  );
};

/** Smartphone. */
export const Phone: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={0} y={0} width={w} height={h} rx={w * 0.12} fill={paint(COLOR.ink)} {...S(h)} />
      {d && (
        <>
          <rect x={w * 0.09} y={h * 0.08} width={w * 0.82} height={h * 0.84} rx={w * 0.05} fill={paint(COLOR.cardWhite)} />
          <circle cx={w * 0.5} cy={h * 0.5} r={w * 0.2} fill={paint(COLOR.orange)} />
          <path d={`M ${w * 0.44} ${h * 0.42} l ${w * 0.16} ${h * 0.08} l ${-w * 0.16} ${h * 0.08} z`} fill={paint(COLOR.cardWhite)} />
        </>
      )}
    </>
  );
};

/** Laptop, open, 3/4-ish flat. */
export const Laptop: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={w * 0.12} y={0} width={w * 0.76} height={h * 0.66} rx={h * 0.04} fill={paint(COLOR.ink)} {...S(h)} />
      {d && <rect x={w * 0.17} y={h * 0.06} width={w * 0.66} height={h * 0.52} fill={paint(COLOR.orange)} opacity={0.85} />}
      <path d={`M ${w * 0.02} ${h * 0.66} L ${w * 0.98} ${h * 0.66} L ${w * 0.92} ${h * 0.9} L ${w * 0.08} ${h * 0.9} Z`} fill={paint(COLOR.grey)} {...S(h)} />
    </>
  );
};

/** Takeaway coffee cup with a sleeve. */
export const CoffeeCup: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <path d={`M ${w * 0.2} ${h * 0.12} L ${w * 0.8} ${h * 0.12} L ${w * 0.72} ${h} L ${w * 0.28} ${h} Z`} fill={paint(COLOR.cardWhite)} {...S(h)} />
      {d && <rect x={w * 0.22} y={h * 0.42} width={w * 0.56} height={h * 0.22} fill={paint(COLOR.kraft)} stroke={paint(COLOR.outline)} strokeWidth={h * 0.01} />}
      <ellipse cx={w * 0.5} cy={h * 0.12} rx={w * 0.32} ry={h * 0.05} fill={paint(COLOR.ink)} {...S(h)} />
      {d && <path d={`M ${w * 0.44} ${h * 0.08} q ${w * 0.06} ${-h * 0.06} 0 ${-h * 0.12}`} fill="none" stroke={paint(COLOR.grey)} strokeWidth={h * 0.02} />}
    </>
  );
};

/** Cardboard box, slightly open. */
export const Box: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={0} y={h * 0.28} width={w} height={h * 0.72} fill={paint(COLOR.kraft)} {...S(h)} />
      {d && <line x1={w * 0.5} y1={h * 0.28} x2={w * 0.5} y2={h} stroke={paint(shade(COLOR.kraft, 0.2))} strokeWidth={h * 0.015} />}
      <path d={`M 0 ${h * 0.28} L ${w * 0.5} ${h * 0.08} L ${w * 0.5} ${h * 0.28} Z`} fill={paint(shade(COLOR.kraft, 0.12))} {...S(h)} />
      <path d={`M ${w} ${h * 0.28} L ${w * 0.5} ${h * 0.08} L ${w * 0.5} ${h * 0.28} Z`} fill={paint(shade(COLOR.kraft, 0.22))} {...S(h)} />
    </>
  );
};

/** Money bag with a $ mark. */
export const MoneyBag: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <path d={`M ${w * 0.5} ${h * 0.1} C ${w * 0.2} ${h * 0.22} ${w * 0.05} ${h * 0.5} ${w * 0.15} ${h * 0.78} C ${w * 0.22} ${h} ${w * 0.78} ${h} ${w * 0.85} ${h * 0.78} C ${w * 0.95} ${h * 0.5} ${w * 0.8} ${h * 0.22} ${w * 0.5} ${h * 0.1} Z`} fill={paint(COLOR.kraft)} {...S(h)} />
      <path d={`M ${w * 0.32} ${h * 0.1} L ${w * 0.68} ${h * 0.1} L ${w * 0.6} ${h * 0.2} L ${w * 0.4} ${h * 0.2} Z`} fill={paint(shade(COLOR.kraft, 0.18))} {...S(h)} />
      {d && <text x={w * 0.5} y={h * 0.66} textAnchor="middle" fontFamily='"Bebas Neue", sans-serif' fontSize={h * 0.4} fill={paint(COLOR.ink)}>$</text>}
    </>
  );
};

/** A short stack of coins. */
export const Coins: FigureShape = ({ paint, w, h }) => (
  <>
    {[0, 1, 2, 3].map((i) => (
      <ellipse key={i} cx={w * 0.5} cy={h * (0.85 - i * 0.2)} rx={w * 0.42} ry={h * 0.1} fill={paint(COLOR.ochre)} {...S(h)} />
    ))}
    <ellipse cx={w * 0.5} cy={h * 0.05} rx={w * 0.42} ry={h * 0.1} fill={paint(COLOR.ochre)} {...S(h)} />
  </>
);

/** A single big dollar coin. */
export const DollarCoin: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  const r = Math.min(w, h) / 2;
  return (
    <>
      <circle cx={w / 2} cy={h / 2} r={r} fill={paint(COLOR.ochre)} {...S(h)} />
      {d && <circle cx={w / 2} cy={h / 2} r={r * 0.78} fill="none" stroke={paint(shade(COLOR.ochre, 0.24))} strokeWidth={h * 0.02} />}
      <text x={w / 2} y={h / 2 + r * 0.36} textAnchor="middle" fontFamily='"Bebas Neue", sans-serif' fontSize={r * 1.1} fill={paint(COLOR.ink)}>$</text>
    </>
  );
};

/** A percent badge. */
export const PercentBadge: FigureShape = ({ paint, w, h }) => (
  <>
    <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 2} fill={paint(COLOR.orange)} {...S(h)} />
    <text x={w / 2} y={h / 2 + h * 0.16} textAnchor="middle" fontFamily='"Bebas Neue", sans-serif' fontSize={h * 0.5} fill={paint(COLOR.cardWhite)}>%</text>
  </>
);
