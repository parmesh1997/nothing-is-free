import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT, HEIGHT, SUPPORT, WIDTH, shade, softShadow, tint } from "../../tokens";
import { SANS } from "./fonts4";
import { DUR, OUT, enterT, lifeT } from "./language";

/**
 * nodegraph.tsx — the systems-map / flowchart visual language (creator, 2026-09-03:
 * "merge this style" — a screenshot of a node-graph pipeline: cream dotted grid,
 * black + white rounded cards, orange curved connectors with numbered tokens,
 * orange stage badges, decision diamonds). This is the fill for the data beats
 * that were "a bar and a number" — it packs the top 80% with structured,
 * animated information that reads as a premium documentary explainer.
 *
 * Everything lives ABOVE the text lane (y < 0.78). Captions stay bottom-20%.
 */

const LANE = HEIGHT * 0.78;

// ── a card: white (default) or black, with an orange eyebrow + headline + body ─
export const NodeCard: React.FC<{
  x: number;
  y: number;
  w: number;
  at: number;
  out?: number;
  variant?: "white" | "black";
  eyebrow?: string;
  title?: string;
  tag?: string;
  body?: string;
  from?: "l" | "r" | "t" | "b";
  children?: React.ReactNode;
}> = ({ x, y, w, at, out, variant = "white", eyebrow, title, tag, body, from = "b", children }) => {
  const frame = useCurrentFrame();
  const t = lifeT(frame, at, out, DUR.big, DUR.enter);
  if (t <= 0.01) return null;
  const slide = (1 - enterT(frame, at, DUR.big)) * 24;
  const off =
    from === "l" ? { x: -slide, y: 0 } : from === "r" ? { x: slide, y: 0 } : from === "t" ? { x: 0, y: -slide } : { x: 0, y: slide };
  const black = variant === "black";
  const drift = Math.sin((frame + x) / 88) * 2.5;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: Math.min(y, LANE - 90),
        width: w,
        opacity: t,
        translate: `${off.x}px ${off.y + drift}px`,
        background: black ? COLOR.ink : COLOR.cardWhite,
        border: `2.5px solid ${COLOR.ink}`,
        borderRadius: 18,
        padding: "26px 32px",
        filter: softShadow(w / 300, black ? 0.28 : 0.2),
      }}
    >
      {eyebrow && (
        <div style={{ fontFamily: FONT.mono, fontSize: 15, letterSpacing: "0.14em", textTransform: "uppercase", color: COLOR.orange, marginBottom: 10 }}>
          {eyebrow}
        </div>
      )}
      {title && (
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: Math.max(26, w * 0.092), lineHeight: 1.08, color: black ? COLOR.cardWhite : COLOR.ink }}>
          {title}
          {tag && <span style={{ color: COLOR.orange, marginLeft: 8 }}>{tag}</span>}
        </div>
      )}
      {body && (
        <div style={{ fontFamily: FONT.mono, fontSize: 17, lineHeight: 1.55, color: black ? "rgba(246,242,231,0.85)" : COLOR.grey, marginTop: title ? 12 : 0, whiteSpace: "pre-line" }}>
          {body}
        </div>
      )}
      {children}
    </div>
  );
};

// ── an orange curved connector with a numbered token + a mono label ──────────
export const Connector: React.FC<{
  a: [number, number];
  b: [number, number];
  at: number;
  out?: number;
  label?: string;
  token?: string | number;
  bow?: number;
}> = ({ a, b, at, out, label, token, bow = 60 }) => {
  const frame = useCurrentFrame();
  const t = lifeT(frame, at, out, DUR.big, DUR.enter);
  if (t <= 0.01) return null;
  const draw = interpolate(frame, [at, at + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: OUT });
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2 - bow;
  const d = `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.25 + 40;
  const tokT = interpolate(frame, [at + 20, at + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const q = (p: number) => {
    const u = 1 - p;
    return [u * u * a[0] + 2 * u * p * mx + p * p * b[0], u * u * a[1] + 2 * u * p * my + p * p * b[1]] as const;
  };
  const [tx, ty] = q(Math.min(1, tokT));
  const [hx, hy] = q(0.985);
  const [px, py] = q(0.9);
  const ang = (Math.atan2(hy - py, hx - px) * 180) / Math.PI;
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: t }}>
      <path d={d} fill="none" stroke={COLOR.orange} strokeWidth={4} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
      {draw > 0.98 && (
        <g transform={`translate(${hx} ${hy}) rotate(${ang})`}>
          <path d="M 0 0 L -14 -8 L -14 8 Z" fill={COLOR.orange} />
        </g>
      )}
      {label && draw > 0.5 && (
        <g>
          <rect x={mx - label.length * 4.7 - 9} y={my - 15} width={label.length * 9.4 + 18} height={24} rx={5} fill={COLOR.paper} stroke={COLOR.grid} strokeWidth={1.5} />
          <text x={mx} y={my + 2} textAnchor="middle" fontFamily={FONT.mono} fontSize={12} letterSpacing="0.1em" fill={COLOR.grey}>{label.toUpperCase()}</text>
        </g>
      )}
      {token !== undefined && tokT > 0.02 && tokT < 0.98 && (
        <g transform={`translate(${tx} ${ty})`}>
          <circle r={17} fill={COLOR.paper} stroke={COLOR.ink} strokeWidth={2} />
          <text textAnchor="middle" y={5} fontFamily={SANS} fontWeight={800} fontSize={15} fill={COLOR.ink}>{token}</text>
        </g>
      )}
    </svg>
  );
};

// ── an orange stage badge + a bold title ────────────────────────────────────
export const StageBadge: React.FC<{ n: number | string; title: string; x: number; y: number; at: number; out?: number }> = ({ n, title, x, y, at, out }) => {
  const frame = useCurrentFrame();
  const t = lifeT(frame, at, out, DUR.enter, DUR.enter);
  if (t <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 18, opacity: t, translate: `0px ${(1 - t) * 14}px` }}>
      <div style={{ width: 56, height: 56, background: COLOR.orange, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.cardWhite, filter: softShadow(0.9, 0.22) }}>
        {n}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: COLOR.ink }}>{title}</div>
    </div>
  );
};

// ── a decision diamond with labelled exits ─────────────────────────────────
export const DecisionDiamond: React.FC<{
  x: number;
  y: number;
  q: string;
  yes?: string;
  no?: string;
  at: number;
  out?: number;
  size?: number;
}> = ({ x, y, q, yes, no, at, out, size = 140 }) => {
  const frame = useCurrentFrame();
  const t = lifeT(frame, at, out, DUR.big, DUR.enter);
  if (t <= 0.01) return null;
  const s = size;
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: t }}>
      <g transform={`translate(${x} ${y}) scale(${0.9 + t * 0.1})`}>
        <path d={`M 0 ${-s} L ${s * 1.35} 0 L 0 ${s} L ${-s * 1.35} 0 Z`} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={2.5} />
        <text textAnchor="middle" y={4} fontFamily={SANS} fontWeight={700} fontSize={s * 0.19} fill={COLOR.ink}>{q}</text>
        {no && <text x={-s * 1.5} y={s * 0.62} fontFamily={FONT.mono} fontSize={12} letterSpacing="0.1em" fill={COLOR.grey}>{no.toUpperCase()}</text>}
        {yes && <text x={s * 1.5} y={-s * 0.3} textAnchor="end" fontFamily={FONT.mono} fontSize={12} letterSpacing="0.1em" fill={COLOR.orange}>{yes.toUpperCase()}</text>}
      </g>
    </svg>
  );
};

// ── a dotted grid backdrop — the systems-map ground. sits over the field. ────
export const DotField: React.FC<{ reveal?: number }> = ({ reveal = 1 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 3;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.42 * reveal,
        backgroundImage: `radial-gradient(${shade(COLOR.grid, 0.08)} 1.6px, transparent 1.7px)`,
        backgroundSize: "40px 40px",
        backgroundPosition: `${drift}px ${drift * 0.6}px`,
        pointerEvents: "none",
      }}
    />
  );
};

// ── a compact stat chip (number + unit) for a node ─────────────────────────
export const StatChip: React.FC<{ value: string; unit?: string; accent?: boolean; at: number; big?: boolean }> = ({ value, unit, accent, at, big }) => {
  const frame = useCurrentFrame();
  const t = enterT(frame, at, DUR.enter);
  return (
    <div style={{ opacity: t, translate: `0px ${(1 - t) * 10}px` }}>
      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: big ? 54 : 34, color: accent ? COLOR.orange : COLOR.ink, letterSpacing: "-0.02em" }}>{value}</span>
      {unit && <span style={{ fontFamily: FONT.mono, fontSize: 13, color: COLOR.grey, marginLeft: 8 }}>{unit}</span>}
    </div>
  );
};

export { tint, SUPPORT };
