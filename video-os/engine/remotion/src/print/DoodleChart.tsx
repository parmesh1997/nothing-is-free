import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT } from "../tokens";
import { EASE } from "../parts/motion";

/**
 * DoodleChart — a hand-drawn pie or bar chart (the sketchy charts in the collage
 * reference). Rough strokes, draws on. It carries a real number, but the loose
 * treatment says "back-of-envelope", not "official figure" — use it that way.
 */

type Slice = { label: string; value: number; color?: string };

export const DoodlePie: React.FC<{
  slices: Slice[];
  cx: number;
  cy: number;
  r?: number;
  start: number;
  end: number;
}> = ({ slices, cx, cy, r = 120, start, end }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  const total = slices.reduce((s, x) => s + x.value, 0);
  let acc = -Math.PI / 2;

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {/* wobbly outer circle */}
      <path d={roughCircle(cx, cy, r, t)} fill="none" stroke={COLOR.ink} strokeWidth={4} strokeLinecap="round" />
      {slices.map((s, i) => {
        const frac = s.value / total;
        const a0 = acc;
        const a1 = acc + frac * Math.PI * 2 * t;
        acc += frac * Math.PI * 2;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const x0 = cx + Math.cos(a0) * r;
        const y0 = cy + Math.sin(a0) * r;
        const x1 = cx + Math.cos(a1) * r;
        const y1 = cy + Math.sin(a1) * r;
        return (
          <path
            key={i}
            d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
            fill={s.color ?? (i === 0 ? COLOR.orange : "transparent")}
            fillOpacity={s.color || i === 0 ? 0.9 : 0}
            stroke={COLOR.ink}
            strokeWidth={3}
          />
        );
      })}
    </svg>
  );
};

export const DoodleBars: React.FC<{
  bars: Slice[];
  x: number;
  y: number;
  w?: number;
  h?: number;
  start: number;
  end: number;
}> = ({ bars, x, y, w = 420, h = 240, start, end }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...bars.map((b) => b.value));
  const bw = w / bars.length;

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {/* axis */}
      <path d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h}`} fill="none" stroke={COLOR.ink} strokeWidth={4} strokeLinecap="round" />
      {bars.map((b, i) => {
        const t = interpolate(frame, [start + i * 4, end + i * 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.countOut,
        });
        const bh = (b.value / max) * h * t;
        const bx = x + i * bw + bw * 0.18;
        return (
          <g key={i}>
            <rect x={bx} y={y + h - bh} width={bw * 0.64} height={bh} fill={b.color ?? COLOR.orange} />
            <path d={`M ${bx} ${y + h - bh} l ${bw * 0.64} 0`} stroke={COLOR.ink} strokeWidth={3} />
            <text x={bx + bw * 0.32} y={y + h + 26} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} fill={COLOR.graphite}>
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const roughCircle = (cx: number, cy: number, r: number, t: number) => {
  const pts: string[] = [];
  const sweep = t * Math.PI * 2.05;
  for (let a = -Math.PI / 2; a <= -Math.PI / 2 + sweep; a += 0.14) {
    const wob = 1 + Math.sin(a * 6) * 0.025;
    pts.push(`${cx + Math.cos(a) * r * wob} ${cy + Math.sin(a) * r * wob}`);
  }
  return "M " + pts.join(" L ");
};
