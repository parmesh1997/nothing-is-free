import { COLOR, shade, tint } from "../tokens";
import { FigureShape } from "./figure";

/**
 * objects.tsx — premium flat props from the collage reference: a gold crown, a
 * gold medal on a ribbon. Flat colour with a shade + tint tone for the metal
 * read. FigureShapes, so they get the torn-paper edge for free.
 */

/** A five-point crown. */
export const Crown: FigureShape = ({ paint, mode, w, h }) => {
  const detail = mode === "fill";
  const base = h * 0.72;
  return (
    <>
      <path
        d={`M 0 ${h} L 0 ${base}
            L ${w * 0.16} ${h * 0.28} L ${w * 0.32} ${base * 0.9}
            L ${w * 0.5} ${h * 0.12} L ${w * 0.68} ${base * 0.9}
            L ${w * 0.84} ${h * 0.28} L ${w} ${base}
            L ${w} ${h} Z`}
        fill={paint(COLOR.gold)}
      />
      {detail && (
        <>
          <rect x={0} y={base} width={w} height={h * 0.1} fill={paint(shade(COLOR.gold, 0.2))} />
          <path d={`M 0 ${h} L 0 ${base} L ${w * 0.5} ${base} L ${w * 0.5} ${h} Z`} fill={paint(tint(COLOR.gold, 0.18))} fillOpacity={0.5} />
          {[0.16, 0.5, 0.84].map((t, i) => (
            <circle key={i} cx={w * t} cy={h * (t === 0.5 ? 0.14 : 0.3)} r={w * 0.03} fill={paint(COLOR.red)} />
          ))}
        </>
      )}
    </>
  );
};

/** A round medal hanging from a V ribbon. */
export const Medal: FigureShape = ({ paint, mode, w, h }) => {
  const detail = mode === "fill";
  const cx = w / 2;
  const medalCY = h * 0.68;
  const medalR = w * 0.34;
  return (
    <>
      {/* ribbon */}
      <path d={`M ${cx - w * 0.16} 0 L ${cx} ${medalCY - medalR * 0.6} L ${cx - w * 0.02} ${medalCY - medalR * 0.6} L ${cx - w * 0.24} 0 Z`} fill={paint(COLOR.red)} />
      <path d={`M ${cx + w * 0.16} 0 L ${cx} ${medalCY - medalR * 0.6} L ${cx + w * 0.02} ${medalCY - medalR * 0.6} L ${cx + w * 0.24} 0 Z`} fill={paint(shade(COLOR.red, 0.18))} />
      {/* medal */}
      <circle cx={cx} cy={medalCY} r={medalR} fill={paint(COLOR.gold)} />
      {detail && (
        <>
          <circle cx={cx} cy={medalCY} r={medalR * 0.78} fill="none" stroke={paint(shade(COLOR.gold, 0.22))} strokeWidth={w * 0.02} />
          <path d={`M ${cx - medalR} ${medalCY} A ${medalR} ${medalR} 0 0 1 ${cx} ${medalCY - medalR} L ${cx} ${medalCY} Z`} fill={paint(tint(COLOR.gold, 0.22))} fillOpacity={0.6} />
          <circle cx={cx} cy={medalCY} r={medalR * 0.16} fill={paint(shade(COLOR.gold, 0.3))} />
        </>
      )}
    </>
  );
};
