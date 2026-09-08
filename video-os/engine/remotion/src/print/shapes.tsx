import { COLOR, shade, tint } from "../tokens";
import { FigureShape } from "./figure";
import { HT } from "./textures";

/**
 * shapes.tsx — generic flat-colour FigureShapes so FigureBlock is usable out of
 * the box. Episode-specific figures are Step 3 assets (§11) — build them next to
 * their episode.
 *
 * Flat colour, premium modelling: a base colour + one `shade()` tone + one
 * `tint()` highlight. In "edge" mode only the big masses draw.
 */

/** A plain tower block — midground buildings, or a foreground "the building". */
export const Building: FigureShape = ({ paint, mode, w, h }) => {
  const detail = mode === "fill";
  const body = COLOR.kraft;
  return (
    <>
      <rect x={0} y={0} width={w} height={h} fill={paint(shade(body, 0.1))} />
      {detail && (
        <>
          <rect x={w * 0.5} y={0} width={w * 0.5} height={h} fill={paint(tint(body, 0.14))} />
          <rect x={0} y={0} width={w} height={h * 0.03} fill={paint(shade(body, 0.3))} />
          {Array.from({ length: 5 }).flatMap((_, r) =>
            Array.from({ length: 3 }).map((__, c) => (
              <rect
                key={`${r}-${c}`}
                x={w * (0.12 + c * 0.3)}
                y={h * (0.1 + r * 0.17)}
                width={w * 0.16}
                height={h * 0.08}
                fill={paint(COLOR.teal)}
              />
            )),
          )}
        </>
      )}
    </>
  );
};

/** A cinema — white facade, rust marquee roof with dome lights, dark doorways. */
export const Cinema: FigureShape = ({ paint, mode, w, h }) => {
  const detail = mode === "fill";
  const roofH = h * 0.26;
  return (
    <>
      {/* facade */}
      <rect x={0} y={roofH * 0.7} width={w} height={h - roofH * 0.7} fill={paint(COLOR.cardWhite)} stroke={paint(COLOR.outline)} strokeWidth={h * 0.006} strokeLinejoin="round" />
      {/* marquee roof */}
      <path d={`M ${-w * 0.04} ${roofH} L ${w * 0.5} 0 L ${w * 1.04} ${roofH} Z`} fill={paint(COLOR.orange)} stroke={paint(COLOR.outline)} strokeWidth={h * 0.006} strokeLinejoin="round" />
      {detail && (
        <>
          {/* dome lights along the roof edge */}
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx={w * (0.1 + i * 0.11)} cy={roofH * 0.72 - i * 0} r={w * 0.014} fill={paint(COLOR.cardWhite)} stroke={paint(COLOR.outline)} strokeWidth={h * 0.004} />
          ))}
          {/* marquee sign */}
          <rect x={w * 0.16} y={roofH + h * 0.06} width={w * 0.68} height={h * 0.12} fill={paint(COLOR.paper)} stroke={paint(COLOR.outline)} strokeWidth={h * 0.005} />
          {/* doorways */}
          {[0.2, 0.42, 0.62].map((t, i) => (
            <rect key={i} x={w * t} y={h * 0.6} width={w * 0.13} height={h * 0.4} fill={paint(COLOR.ink)} stroke={paint(COLOR.outline)} strokeWidth={h * 0.005} />
          ))}
        </>
      )}
    </>
  );
};

/** An ADMIT ONE ticket — cream body + rust stub, perforation, faint text. */
export const Ticket: FigureShape = ({ paint, mode, w, h }) => {
  const detail = mode === "fill";
  const stubX = w * 0.72;
  const sw = h * 0.02;
  return (
    <>
      <rect x={0} y={0} width={w} height={h} rx={h * 0.08} fill={paint(COLOR.cardWhite)} stroke={paint(COLOR.outline)} strokeWidth={sw} strokeLinejoin="round" />
      <path d={`M ${stubX} 0 L ${w} 0 Q ${w} 0 ${w} ${h * 0.08} L ${w} ${h * 0.92} Q ${w} ${h} ${w * 0.92} ${h} L ${stubX} ${h} Z`} fill={paint(COLOR.orange)} stroke={paint(COLOR.outline)} strokeWidth={sw} strokeLinejoin="round" />
      {detail && (
        <>
          <line x1={stubX} y1={h * 0.06} x2={stubX} y2={h * 0.94} stroke={paint(COLOR.outline)} strokeWidth={sw * 0.7} strokeDasharray={`${h * 0.06} ${h * 0.05}`} />
          <text x={w * 0.06} y={h * 0.34} fontFamily='"IBM Plex Mono", monospace' fontWeight={600} fontSize={h * 0.2} letterSpacing={h * 0.02} fill={paint(COLOR.graphite)}>
            ADMIT ONE
          </text>
          <line x1={w * 0.06} y1={h * 0.56} x2={w * 0.5} y2={h * 0.56} stroke={paint(COLOR.grid)} strokeWidth={sw} />
          <line x1={w * 0.06} y1={h * 0.72} x2={w * 0.42} y2={h * 0.72} stroke={paint(COLOR.grid)} strokeWidth={sw} />
        </>
      )}
    </>
  );
};

/**
 * Tub — the hero popcorn bucket from the sheet: orange/cream vertical stripes,
 * halftone texture over the body, a mound of outlined kernels on top.
 */
export const Tub: FigureShape = ({ paint, mode, w, h }) => {
  const detail = mode === "fill";
  const bodyTop = h * 0.26;
  const inset = w * 0.1;
  const sw = h * 0.011;
  const stripes = 7;
  const body = `M 0 ${bodyTop} L ${w} ${bodyTop} L ${w - inset} ${h} L ${inset} ${h} Z`;

  return (
    <>
      {/* body — cream ground */}
      <path d={body} fill={paint(COLOR.cardWhite)} stroke={paint(COLOR.outline)} strokeWidth={sw} strokeLinejoin="round" />

      {detail && (
        <>
          {/* orange vertical stripes, tapering with the tub */}
          <clipPath id="nif-tub-clip">
            <path d={body} />
          </clipPath>
          <g clipPath="url(#nif-tub-clip)">
            {Array.from({ length: stripes }).map((_, i) => {
              const t = i / stripes;
              const t2 = t + 0.5 / stripes;
              const xTop = w * t;
              const xTop2 = w * t2;
              return (
                <path
                  key={i}
                  d={`M ${xTop} ${bodyTop} L ${xTop2} ${bodyTop}
                      L ${inset + (xTop2 / w) * (w - 2 * inset)} ${h}
                      L ${inset + (xTop / w) * (w - 2 * inset)} ${h} Z`}
                  fill={paint(COLOR.orange)}
                />
              );
            })}
            {/* halftone shading down the right side (the sheet's texture) */}
            <rect x={w * 0.6} y={bodyTop} width={w * 0.4} height={h} fill={HT.mid} opacity={0.18} />
          </g>
        </>
      )}

      {/* popcorn mound — outlined kernels */}
      {[
        [0.5, 0.06, 0.2], [0.24, 0.1, 0.17], [0.76, 0.1, 0.17],
        [0.1, 0.17, 0.15], [0.9, 0.17, 0.15], [0.37, 0.16, 0.16], [0.63, 0.16, 0.16],
        [0.5, 0.21, 0.15], [0.18, 0.24, 0.14], [0.82, 0.24, 0.14],
      ].map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={w * cx}
          cy={h * cy}
          r={w * r * 0.5}
          fill={paint(COLOR.cardWhite)}
          stroke={paint(COLOR.outline)}
          strokeWidth={sw}
        />
      ))}
    </>
  );
};
