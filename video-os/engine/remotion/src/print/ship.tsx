import { COLOR, shade, tint } from "../tokens";
import { FigureShape } from "./figure";

/**
 * Tanker — a code-native crude carrier (§1.1: drawn, not photographed).
 * Flat colour: dark hull, kraft deck, teal accommodation block, gold rail.
 * In "edge" mode only the big silhouette masses draw.
 */
export const Tanker: FigureShape = ({ paint, mode, w, h }) => {
  const deckY = h * 0.5;
  const sheer = h * 0.04;
  const keelY = h * 0.9;
  const sternX = w * 0.04;
  const bowX = w * 0.99;
  const detail = mode === "fill";
  const hull = COLOR.ink;

  return (
    <>
      {/* hull mass */}
      <path
        d={`M ${sternX} ${deckY}
            L ${w * 0.9} ${deckY - sheer}
            Q ${bowX} ${deckY - sheer} ${bowX} ${h * 0.74}
            L ${w * 0.9} ${keelY}
            L ${sternX + w * 0.01} ${keelY} Z`}
        fill={paint(hull)}
      />
      {/* accommodation block + funnel */}
      <rect x={w * 0.06} y={deckY - h * 0.3} width={w * 0.11} height={h * 0.3} fill={paint(COLOR.teal)} />
      <rect x={w * 0.08} y={deckY - h * 0.37} width={w * 0.06} height={h * 0.08} fill={paint(shade(COLOR.teal, 0.2))} />
      <path d={`M ${w * 0.045} ${deckY - h * 0.02} l 0 ${-h * 0.16} l ${w * 0.028} 0 l 0 ${h * 0.16} z`} fill={paint(COLOR.red)} />

      {detail && (
        <>
          {/* deck band */}
          <path
            d={`M ${sternX} ${deckY} L ${w * 0.92} ${deckY - sheer}
                L ${w * 0.92} ${deckY - sheer + h * 0.05} L ${sternX} ${deckY + h * 0.05} Z`}
            fill={paint(COLOR.kraft)}
          />
          {/* waterline stripe */}
          <path
            d={`M ${sternX} ${h * 0.78} L ${w * 0.92} ${h * 0.7}
                L ${w * 0.92} ${h * 0.75} L ${sternX} ${h * 0.83} Z`}
            fill={paint(COLOR.red)}
          />
          {/* bridge windows */}
          <rect x={w * 0.06} y={deckY - h * 0.27} width={w * 0.11} height={h * 0.03} fill={paint(COLOR.gold)} />
          {/* foremast */}
          <line x1={w * 0.11} y1={deckY - h * 0.37} x2={w * 0.11} y2={h * 0.02} stroke={paint(shade(hull, -0.5))} strokeWidth={w * 0.005} />
          {/* deck manifold + cranes */}
          <rect x={w * 0.22} y={deckY - h * 0.04} width={w * 0.6} height={h * 0.02} fill={paint(COLOR.graphite)} />
          {[0.36, 0.62].map((cx, i) => (
            <g key={i}>
              <line x1={w * cx} y1={deckY} x2={w * cx} y2={deckY - h * 0.16} stroke={paint(COLOR.gold)} strokeWidth={w * 0.012} />
              <line x1={w * cx} y1={deckY - h * 0.15} x2={w * (cx + 0.09)} y2={deckY - h * 0.19} stroke={paint(COLOR.gold)} strokeWidth={w * 0.009} />
            </g>
          ))}
          {/* bow rail highlight */}
          <path d={`M ${w * 0.88} ${deckY - sheer} L ${bowX} ${h * 0.62} L ${w * 0.9} ${h * 0.6} Z`} fill={paint(tint(hull, 0.5))} />
        </>
      )}
    </>
  );
};
