import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT } from "../tokens";
import { EASE } from "../parts/motion";

/**
 * diagrams.tsx — the ECONOMIC DIAGRAMS from the ASSETS LIBRARY sheet:
 * pie chart, flow diagram, money flow, revenue bar chart. Clean flat, line-art
 * outline, animate-on. These carry real figures — keep them tidy, not doodled.
 */

// ─────────────────────────────────────────────────────────────────────────────

type Slice = { label: string; value: number; color?: string };
const SLICE_COLORS = [COLOR.orange, COLOR.ink, COLOR.grey, COLOR.ochre, COLOR.kraft];

export const PieChart: React.FC<{
  slices: Slice[];
  cx: number;
  cy: number;
  r?: number;
  start: number;
  end: number;
  /** Show a legend to the right. */
  legend?: boolean;
}> = ({ slices, cx, cy, r = 130, start, end, legend = true }) => {
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
            fill={s.color ?? SLICE_COLORS[i % SLICE_COLORS.length]}
            stroke={COLOR.outline}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        );
      })}
      {legend &&
        slices.map((s, i) => (
          <g key={i} transform={`translate(${cx + r + 40}, ${cy - r + 12 + i * 40})`} opacity={interpolate(frame, [end - 10 + i * 4, end + 6 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <rect width={22} height={22} fill={s.color ?? SLICE_COLORS[i % SLICE_COLORS.length]} stroke={COLOR.outline} strokeWidth={2} />
            <text x={34} y={17} fontFamily={FONT.sans} fontSize={22} fontWeight={500} fill={COLOR.ink}>
              {s.label} {Math.round((s.value / total) * 100)}%
            </text>
          </g>
        ))}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const BarChart: React.FC<{
  bars: Slice[];
  x: number;
  y: number;
  w?: number;
  h?: number;
  start: number;
  end: number;
}> = ({ bars, x, y, w = 460, h = 260, start, end }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...bars.map((b) => b.value));
  const bw = w / bars.length;

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h}`} fill="none" stroke={COLOR.outline} strokeWidth={3} strokeLinecap="round" />
      {bars.map((b, i) => {
        const t = interpolate(frame, [start + i * 5, end + i * 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.countOut,
        });
        const bh = (b.value / max) * (h - 20) * t;
        const bx = x + i * bw + bw * 0.2;
        return (
          <g key={i}>
            <rect x={bx} y={y + h - bh} width={bw * 0.6} height={bh} fill={b.color ?? (i === bars.length - 1 ? COLOR.orange : COLOR.ink)} stroke={COLOR.outline} strokeWidth={2.5} strokeLinejoin="round" />
            <text x={bx + bw * 0.3} y={y + h + 28} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} fill={COLOR.grey}>
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** A left→right chain of labelled boxes with draw-on connectors. */
export const FlowDiagram: React.FC<{
  nodes: string[];
  x: number;
  y: number;
  boxW?: number;
  boxH?: number;
  gap?: number;
  start: number;
  perStep?: number;
  /** An optional box hanging below the chain, joined by dashed lines to all. */
  hub?: string;
}> = ({ nodes, x, y, boxW = 200, boxH = 78, gap = 70, start, perStep = 10, hub }) => {
  const frame = useCurrentFrame();

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {nodes.map((n, i) => {
        const nx = x + i * (boxW + gap);
        const appear = interpolate(frame, [start + i * perStep, start + i * perStep + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const arrow = i < nodes.length - 1
          ? interpolate(frame, [start + i * perStep + 6, start + i * perStep + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : 0;
        return (
          <g key={i}>
            <g opacity={appear}>
              <rect x={nx} y={y} width={boxW} height={boxH} fill={COLOR.cardWhite} stroke={COLOR.outline} strokeWidth={2.5} strokeLinejoin="round" />
              <text x={nx + boxW / 2} y={y + boxH / 2 + 7} textAnchor="middle" fontFamily={FONT.sans} fontSize={22} fontWeight={600} fill={COLOR.ink}>
                {n.toUpperCase()}
              </text>
            </g>
            {i < nodes.length - 1 && (
              <g opacity={arrow}>
                <line x1={nx + boxW} y1={y + boxH / 2} x2={nx + boxW + gap - 10} y2={y + boxH / 2} stroke={COLOR.outline} strokeWidth={2.5} />
                <path d={`M ${nx + boxW + gap - 16} ${y + boxH / 2 - 6} l 8 6 l -8 6`} fill="none" stroke={COLOR.outline} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </g>
        );
      })}
      {hub && (
        <g opacity={interpolate(frame, [start + nodes.length * perStep, start + nodes.length * perStep + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          {nodes.map((_, i) => {
            const nx = x + i * (boxW + gap) + boxW / 2;
            const hx = x + ((nodes.length - 1) * (boxW + gap)) / 2 + boxW / 2;
            return <line key={i} x1={nx} y1={y + boxH} x2={hx} y2={y + boxH + 90} stroke={COLOR.outline} strokeWidth={2} strokeDasharray="5 5" />;
          })}
          <rect x={x + ((nodes.length - 1) * (boxW + gap)) / 2 + boxW / 2 - boxW / 2} y={y + boxH + 90} width={boxW} height={boxH} fill={COLOR.orange} stroke={COLOR.outline} strokeWidth={2.5} strokeLinejoin="round" />
          <text x={x + ((nodes.length - 1) * (boxW + gap)) / 2 + boxW / 2} y={y + boxH + 90 + boxH / 2 + 7} textAnchor="middle" fontFamily={FONT.sans} fontSize={22} fontWeight={700} fill={COLOR.cardWhite}>
            {hub.toUpperCase()}
          </text>
        </g>
      )}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** $ → $ → $ coins with arrows drawing between, each bigger than the last. */
export const MoneyFlow: React.FC<{
  steps: number;
  x: number;
  y: number;
  start: number;
  perStep?: number;
}> = ({ steps, x, y, start, perStep = 12 }) => {
  const frame = useCurrentFrame();
  const gap = 180;

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {Array.from({ length: steps }).map((_, i) => {
        const cx = x + i * gap;
        const r = 34 + i * 8;
        const appear = interpolate(frame, [start + i * perStep, start + i * perStep + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <g key={i}>
            <g opacity={appear}>
              <circle cx={cx} cy={y} r={r} fill={COLOR.ochre} stroke={COLOR.outline} strokeWidth={2.5} />
              <text x={cx} y={y + r * 0.34} textAnchor="middle" fontFamily={FONT.sans} fontSize={r} fontWeight={700} fill={COLOR.ink}>
                $
              </text>
            </g>
            {i < steps - 1 && (
              <g opacity={interpolate(frame, [start + i * perStep + 6, start + i * perStep + 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                <line x1={cx + r + 6} y1={y} x2={cx + gap - r - 14} y2={y} stroke={COLOR.outline} strokeWidth={2.5} />
                <path d={`M ${cx + gap - r - 20} ${y - 6} l 8 6 l -8 6`} fill="none" stroke={COLOR.outline} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
