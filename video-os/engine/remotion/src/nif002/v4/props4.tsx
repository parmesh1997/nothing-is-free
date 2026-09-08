import { COLOR, shade, tint } from "../../tokens";
import { FigureShape } from "../../print/figure";

/**
 * props4.tsx — v4 furniture (creator, 2026-09-03).
 *
 * Flat vector, warm tones that sit ON the cream (not the grey slab, not the
 * dark v3 rooms). Every shape carries its own key-light modelling: a lighter
 * top plane, a `shade()` underside, a thin ink outline. `mode:"edge"` draws
 * nothing — v4 objects have no torn-paper edge.
 *
 * Tone defaults are cream-adjacent warm neutrals; pass `tone` to vary.
 */

const S = (h: number, k = 0.01) => ({
  stroke: COLOR.outline,
  strokeWidth: h * k,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
});

// ── Couch — a low two-seater. Lucky sits here. Split render so a figure can sit
//    BETWEEN the back and the front lip: `back` = cushions + back arms only,
//    `front` = seat lip + front arms + legs. Omit both = the whole couch.
export const couch4 =
  ({ tone = "#C8A97E", back, front }: { tone?: string; back?: boolean; front?: boolean } = {}): FigureShape =>
  ({ paint, mode, w, h }) => {
    const d = mode === "fill";
    const seat = shade(tone, 0.06);
    const both = !back && !front;
    return (
      <>
        {(both || back) && (
          <>
            {/* back cushions */}
            <rect x={w * 0.06} y={h * 0.04} width={w * 0.88} height={h * 0.56} rx={h * 0.16} fill={paint(tone)} {...S(h)} />
            {d && <rect x={w * 0.06} y={h * 0.04} width={w * 0.88} height={h * 0.18} rx={h * 0.14} fill={paint(tint(tone, 0.16))} />}
            {/* seat base (the part behind the sitter's thighs) */}
            <rect x={0} y={h * 0.44} width={w} height={h * 0.4} rx={h * 0.14} fill={paint(seat)} {...S(h)} />
            {d && <rect x={0} y={h * 0.44} width={w} height={h * 0.1} rx={h * 0.12} fill={paint(tint(seat, 0.14))} />}
          </>
        )}
        {(both || front) && (
          <>
            {/* arms */}
            {[-0.02, 0.86].map((fx, i) => (
              <rect key={i} x={w * fx} y={h * 0.32} width={w * 0.16} height={h * 0.52} rx={h * 0.1} fill={paint(tone)} {...S(h)} />
            ))}
            {/* seat front lip — occludes the sitter's legs at the knee */}
            <rect x={w * 0.06} y={h * 0.74} width={w * 0.88} height={h * 0.14} rx={h * 0.07} fill={paint(shade(seat, 0.05))} {...S(h)} />
            {/* legs */}
            {[0.12, 0.84].map((fx, i) => (
              <rect key={i} x={w * fx} y={h * 0.86} width={w * 0.05} height={h * 0.14} rx={h * 0.02} fill={paint(COLOR.ink)} />
            ))}
          </>
        )}
      </>
    );
  };

// ── Potted plant — a foreground-left mass. ───────────────────────────────────
export const plant4: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  const pot = "#B0704A";
  const leaf = "#7C8A5A";
  return (
    <>
      {/* pot */}
      <path d={`M ${w * 0.28} ${h * 0.66} L ${w * 0.72} ${h * 0.66} L ${w * 0.64} ${h} L ${w * 0.36} ${h} Z`} fill={paint(pot)} {...S(h)} />
      {d && <path d={`M ${w * 0.28} ${h * 0.66} L ${w * 0.72} ${h * 0.66} L ${w * 0.7} ${h * 0.74} L ${w * 0.3} ${h * 0.74} Z`} fill={paint(tint(pot, 0.16))} />}
      {/* fronds */}
      {[-42, -18, 6, 30, 54].map((deg, i) => (
        <g key={i} transform={`rotate(${deg} ${w * 0.5} ${h * 0.66})`}>
          <path
            d={`M ${w * 0.5} ${h * 0.66} Q ${w * (0.5 + 0.02)} ${h * 0.3} ${w * 0.5} ${h * 0.12} Q ${w * (0.5 - 0.14)} ${h * 0.34} ${w * 0.5} ${h * 0.66} Z`}
            fill={paint(i % 2 ? shade(leaf, 0.12) : leaf)}
            {...S(h, 0.006)}
          />
        </g>
      ))}
    </>
  );
};

// ── Wall art — two hung frames. A hazed far-plane mass behind a seated figure. ─
export const wallArt4: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  const frame = "#4A4038";
  const oneFrame = (fx: number, fy: number, fw: number, fh: number, art: string) => (
    <g>
      <rect x={w * fx} y={h * fy} width={w * fw} height={h * fh} rx={4} fill={paint(frame)} />
      <rect x={w * fx + 8} y={h * fy + 8} width={w * fw - 16} height={h * fh - 16} fill={paint(COLOR.cardWhite)} />
      {d && <rect x={w * fx + 20} y={h * fy + 20} width={w * fw - 40} height={h * fh - 40} fill={paint(art)} opacity={0.85} />}
    </g>
  );
  return (
    <>
      {oneFrame(0.04, 0.06, 0.5, 0.62, COLOR.orange)}
      {oneFrame(0.6, 0.16, 0.36, 0.5, shade(COLOR.grey, 0.1))}
    </>
  );
};

// ── Rug — a soft ellipse the couch sits on (grounds the vignette). ───────────
export const rug4 =
  ({ tone = "#D8C4A0" }: { tone?: string } = {}): FigureShape =>
  ({ paint, w, h }) => (
    <>
      <ellipse cx={w / 2} cy={h / 2} rx={w * 0.5} ry={h * 0.5} fill={paint(tone)} />
      <ellipse cx={w / 2} cy={h / 2} rx={w * 0.42} ry={h * 0.4} fill="none" stroke={paint(shade(tone, 0.14))} strokeWidth={h * 0.03} />
    </>
  );
