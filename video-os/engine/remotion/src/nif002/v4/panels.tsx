import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, HEIGHT, WIDTH, shade, tint } from "../../tokens";
import { EASE, springIn } from "../../parts/motion";
import { SANS } from "./fonts4";
import { DUR, STAGGER, enterT, landPop } from "./language";
import { dropShadow } from "./light";

/**
 * panels.tsx — the shared visual vocabulary for the v4 beats. Everything here
 * renders ON the cream / the Room3D wall, flat-shaded, Hanken labels. The
 * recurring props from the visual plan: a framed panel, a hero count-up, a bar,
 * a fee ledger, a toll chain, the auction fan, a tile grid, a pin path.
 */

const label = (size = 20): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 700,
  fontSize: size,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: COLOR.grey,
});

/** a slow idle float so a held card is never dead (creator: no 5–6s of nothing). */
const idleFloat = (frame: number, at: number, seed = 0) => {
  const p = (frame - at) / 30;
  return { dy: Math.sin(p / 2.6 + seed) * 2.4, rot: Math.sin(p / 3.4 + seed) * 0.25 };
};

// ── Panel — a framed content card mounted on the wall ────────────────────────
export const Panel: React.FC<{
  x: number; y: number; w: number; h: number;
  at?: number;
  title?: string;
  children?: React.ReactNode;
}> = ({ x, y, w, h, at = 0, title, children }) => {
  const frame = useCurrentFrame();
  const t = enterT(frame, at, DUR.big);
  const f = idleFloat(frame, at, x * 0.001);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: t, translate: `0px ${(1 - t) * 24 + t * f.dy}px`, rotate: `${t * f.rot}deg`, filter: dropShadow("raised", h / 320, 0.2) }}>
      <div style={{ position: "absolute", inset: 0, background: COLOR.cardWhite, border: `2px solid ${COLOR.ink}`, borderRadius: 12 }} />
      {title && <div style={{ position: "absolute", left: 22, top: 18, ...label(17) }}>{title}</div>}
      <div style={{ position: "absolute", left: 22, right: 22, top: title ? 50 : 22, bottom: 22 }}>{children}</div>
    </div>
  );
};

// ── HeroNumber — a big count-up, centred ────────────────────────────────────
export const HeroNumber: React.FC<{
  at: number;
  from?: number;
  to: number;
  dur?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  size?: number;
  y?: number;
  color?: string;
  sub?: string;
  format?: (n: number) => string;
}> = ({ at, from = 0, to, dur = 90, prefix = "", suffix = "", decimals = 0, size = 200, y = HEIGHT * 0.3, color = COLOR.ink, sub, format }) => {
  const frame = useCurrentFrame();
  const n = interpolate(frame, [at, at + dur], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut });
  const shown = format ? format(n) : n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const pop = landPop(frame, at + dur - 8);
  const t = enterT(frame, at - 4, DUR.enter);
  const done = frame > at + dur;
  const drift = done ? Math.sin((frame - at - dur) / 64) * 3 : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: t, translate: `0px ${drift}px` }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: "-0.03em", color, scale: String(pop), filter: dropShadow("floating", size / 160, 0.22) }}>
        {prefix}{shown}{suffix}
      </div>
      {sub && <div style={{ ...label(24), marginTop: 14 }}>{sub}</div>}
    </div>
  );
};

// ── Bar — a horizontal bar, fills to `frac`, with a % readout ────────────────
export const Bar: React.FC<{
  x: number; y: number; w: number; h?: number;
  at: number;
  frac: number;
  labelText?: string;
  fill?: string;
  showPct?: boolean;
}> = ({ x, y, w, h = 58, at, frac, labelText, fill = COLOR.orange, showPct = true }) => {
  const frame = useCurrentFrame();
  const f = interpolate(frame, [at, at + 50], [0, frac], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut });
  const t = enterT(frame, at - 4, DUR.enter);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: t }}>
      {labelText && <div style={{ ...label(20), marginBottom: 12 }}>{labelText}</div>}
      <div style={{ position: "relative", width: "100%", height: h, border: `2px solid ${COLOR.ink}`, borderRadius: 6, background: COLOR.cardWhite }}>
        <div style={{ position: "absolute", inset: 0, width: `${f * 100}%`, background: fill, borderRadius: 4 }} />
        {showPct && (
          <div style={{ position: "absolute", right: -4, top: "50%", transform: "translate(100%,-50%)", paddingLeft: 14, fontFamily: SANS, fontWeight: 800, fontSize: h * 0.7, color: COLOR.ink }}>
            {Math.round(f * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};

// ── Ledger — fee rows drop in, a running total re-counts, a shrink bar ──────
export const Ledger: React.FC<{
  x: number; y: number; w: number;
  at: number;
  gap?: number;
  start: { label: string; value: number };
  rows: { label: string; deltaPct?: number; note?: string }[];
  final: { label: string; value: number };
  fmt?: (n: number) => string;
}> = ({ x, y, w, at, gap = 26, start, rows, final, fmt = (n) => `$${n.toFixed(2)}` }) => {
  const frame = useCurrentFrame();
  const rowH = 58;
  let running = start.value;
  const stamps = rows.map((r, i) => {
    const rowAt = at + 30 + i * gap;
    if (r.deltaPct) running = running * (1 - r.deltaPct);
    return { ...r, rowAt, running };
  });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: SANS }}>
      {/* start line */}
      <Row at={at} y={0} labelText={start.label} value={fmt(start.value)} bold />
      {stamps.map((r, i) => {
        const t = enterT(frame, r.rowAt, DUR.enter);
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: rowH * (i + 1), opacity: t, translate: `${(1 - t) * 24}px 0px`, display: "flex", justifyContent: "space-between", fontSize: 32, color: COLOR.grey }}>
            <span>{r.label}{r.deltaPct ? `  −${Math.round(r.deltaPct * 100)}%` : ""}</span>
            <span style={{ color: COLOR.ink, fontVariantNumeric: "tabular-nums" }}>{fmt(r.running)}</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: rowH * (rows.length + 1) + 8, borderTop: `2px solid ${COLOR.ink}` }} />
      <Row at={at + 30 + rows.length * gap + 20} y={rowH * (rows.length + 1) + 22} labelText={final.label} value={fmt(final.value)} bold accent />
    </div>
  );
};

const Row: React.FC<{ at: number; y: number; labelText: string; value: string; bold?: boolean; accent?: boolean }> = ({ at, y, labelText, value, bold, accent }) => {
  const frame = useCurrentFrame();
  const t = enterT(frame, at, DUR.enter);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, opacity: t, display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: bold ? 800 : 500, fontSize: 38, color: accent ? COLOR.orange : COLOR.ink, fontVariantNumeric: "tabular-nums" }}>
      <span>{labelText}</span><span>{value}</span>
    </div>
  );
};

// ── Chain — N gate boxes left→right, a coin travels the line and shrinks as
//    each gate takes a slice (rebuilt 2026-09-04: the old version was tiny
//    squares + a dot; the frame read empty). ───────────────────────────────
export const Chain: React.FC<{
  y: number;
  at: number;
  gates: string[];
  coinAt?: number;
  coinDur?: number;
}> = ({ y, at, gates, coinAt, coinDur = 260 }) => {
  const frame = useCurrentFrame();
  const n = gates.length;
  const x0 = WIDTH * 0.12;
  const x1 = WIDTH * 0.88;
  const gx = (i: number) => x0 + ((x1 - x0) / (n - 1 || 1)) * i;
  const coinT = coinAt === undefined ? -1 : interpolate(frame, [coinAt, coinAt + coinDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const coinX = coinT >= 0 ? interpolate(coinT, [0, 1], [x1, x0]) : 0;
  // how many gates the coin has already passed (right→left)
  const passed = coinT >= 0 ? gates.filter((_, i) => coinX < gx(i) - 4).length : 0;
  const coinSize = 56 - passed * 6;
  return (
    <>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={x0} y1={y} x2={x1} y2={y} stroke={COLOR.grid} strokeWidth={5} opacity={enterT(frame, at, DUR.big)} strokeLinecap="round" />
        {coinT >= 0 && coinT < 1 && <line x1={coinX} y1={y} x2={x1} y2={y} stroke={COLOR.orange} strokeWidth={5} strokeLinecap="round" opacity={0.5} />}
      </svg>
      {gates.map((g, i) => {
        const t = enterT(frame, at + 6 + i * STAGGER * 3, DUR.big);
        const took = coinT >= 0 && coinX < gx(i) - 4;
        return (
          <div key={i} style={{ position: "absolute", left: gx(i) - 74, top: y - 44, width: 148, textAlign: "center", opacity: t, translate: `0px ${(1 - t) * 16}px` }}>
            <div style={{ width: 88, height: 88, margin: "0 auto 10px", background: took ? COLOR.orange : COLOR.cardWhite, border: `3px solid ${COLOR.ink}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", filter: dropShadow("raised", 0.9, 0.18) }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: took ? COLOR.cardWhite : COLOR.grid, border: `2px solid ${COLOR.ink}` }} />
            </div>
            <div style={{ ...label(16), color: COLOR.ink }}>{g}</div>
          </div>
        );
      })}
      {coinT >= 0 && coinT < 0.98 && (
        <div style={{ position: "absolute", left: coinX - coinSize / 2, top: y - 6 - coinSize / 2, width: coinSize, height: coinSize, borderRadius: "50%", background: `radial-gradient(circle at 35% 32%, ${tint(COLOR.orange, 0.45)}, ${COLOR.orange} 62%, ${shade(COLOR.orange, 0.2)})`, border: `3px solid ${COLOR.ink}`, filter: dropShadow("floating", 1, 0.28), boxShadow: `0 0 22px rgba(226,77,40,0.4)` }} />
      )}
    </>
  );
};

// ── Fan — a node + an arc of buyer tiles, an optional sweep that greys some ──
export const Fan: React.FC<{
  at: number;
  count?: number;
  cx?: number; cy?: number; r?: number;
  sweepAt?: number;
  loseFrac?: number;
}> = ({ at, count = 90, cx = WIDTH * 0.5, cy = HEIGHT * 0.44, r = 340, sweepAt, loseFrac = 0.4 }) => {
  const frame = useCurrentFrame();
  const sweep = sweepAt === undefined ? -1 : interpolate(frame, [sweepAt, sweepAt + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: cx - 26, top: cy - 26, width: 52, height: 52, borderRadius: 10, background: COLOR.ink, opacity: enterT(frame, at, DUR.enter) }} />
      {Array.from({ length: count }).map((_, i) => {
        const a = -Math.PI * 0.72 + (Math.PI * 1.44 * i) / (count - 1);
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r * 0.62;
        const t = enterT(frame, at + 6 + (i % 12) * STAGGER, DUR.enter);
        const lost = sweep >= 0 && i / count < loseFrac && sweep > (i / count) / loseFrac;
        const won = sweep >= 0.98 && (i === Math.floor(count * 0.5) || i === Math.floor(count * 0.62) || i === Math.floor(count * 0.4));
        return (
          <div key={i} style={{ position: "absolute", left: px - 7, top: py - 7, width: 14, height: 14, borderRadius: 3, background: won ? COLOR.orange : lost ? "transparent" : COLOR.grey, border: lost ? `1.5px solid ${shade(COLOR.grey, 0.1)}` : "none", opacity: t * (lost ? 0.4 : 1), scale: String(won ? 1.5 : 1) }} />
        );
      })}
    </div>
  );
};

// ── TileGrid — N×M app tiles, `litFrac` stay ink, the rest wash to paper ────
export const TileGrid: React.FC<{
  x: number; y: number; cols: number; rows: number; cell: number; gap: number;
  at: number;
  litCount?: number;
}> = ({ x, y, cols, rows, cell, gap, at, litCount = 0 }) => {
  const frame = useCurrentFrame();
  const total = cols * rows;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "grid", gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap }}>
      {Array.from({ length: total }).map((_, i) => {
        const t = enterT(frame, at + (i % 10) * 2, DUR.enter);
        const wash = interpolate(frame, [at + 40, at + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const lit = i < litCount;
        return <div key={i} style={{ width: cell, height: cell, borderRadius: cell * 0.22, background: lit ? COLOR.orange : `rgb(${mix(wash)})`, opacity: t }} />;
      })}
    </div>
  );
};
const mix = (w: number) => {
  const a = [17, 17, 17];
  const b = [237, 229, 214];
  return a.map((c, i) => Math.round(c + (b[i] - c) * w)).join(",");
};

// ── PinPath — scattered pins that connect into a labelled path ──────────────
export const PinPath: React.FC<{
  at: number;
  stops: { x: number; y: number; label: string }[];
}> = ({ at, stops }) => {
  const frame = useCurrentFrame();
  const connect = interpolate(frame, [at + 40, at + 40 + stops.length * 14], [0, stops.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {stops.slice(1).map((s, i) => {
        const prev = stops[i];
        const on = connect > i + 1;
        return <line key={i} x1={prev.x} y1={prev.y} x2={s.x} y2={s.y} stroke={COLOR.orange} strokeWidth={6} strokeLinecap="round" opacity={on ? 0.9 : 0} />;
      })}
      {stops.map((s, i) => {
        const t = Math.min(1, springIn({ frame, fps: 30, delay: at + i * 6, durationInFrames: 14 }));
        return (
          <g key={i} opacity={t}>
            <circle cx={s.x} cy={s.y} r={16} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={4} />
            <circle cx={s.x} cy={s.y} r={6} fill={COLOR.orange} />
            <text x={s.x + 26} y={s.y + 9} fontFamily={SANS} fontWeight={700} fontSize={28} letterSpacing="0.04em" fill={COLOR.ink}>{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ── Chips — many small tiles scattering into a clean field (companies, kits) ──
// Rewritten (creator 2026-09-03: the old version stacked into a scribble ball
// that collided with labels). Now: a stable pseudo-random scatter across an
// elliptical area, staggered in from the centre, gentle idle drift, never
// overlapping. `spread` is the half-width; `cy` area is 0.62× that tall.
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const Chips: React.FC<{
  cx: number; cy: number; count: number; at: number;
  /** legacy alias for `spread`. */
  radius?: number;
  spread?: number;
  tone?: string;
  chip?: number;
}> = ({ cx, cy, count, at, radius, spread, tone = COLOR.grey, chip = 26 }) => {
  const frame = useCurrentFrame();
  const S = spread ?? radius ?? 260;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        // a stable scattered target inside an ellipse (rejection-free polar)
        const ang = rnd(i + 1) * Math.PI * 2;
        const rad = Math.sqrt(rnd(i + 99)) ;
        const tx = cx + Math.cos(ang) * rad * S;
        const ty = cy + Math.sin(ang) * rad * S * 0.62;
        const t = Math.min(1, springIn({ frame, fps: 30, delay: at + (i % 16) * 2, durationInFrames: 18 }));
        // fly out from the centre to the target
        const x = cx + (tx - cx) * t + Math.sin(frame / 50 + i) * 2.5 * t;
        const y = cy + (ty - cy) * t + Math.cos(frame / 57 + i * 1.3) * 2.5 * t;
        const hot = rnd(i + 7) > 0.9;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - chip / 2,
              top: y - chip * 0.34,
              width: chip,
              height: chip * 0.68,
              borderRadius: 4,
              background: hot ? COLOR.orange : tone,
              border: `1.5px solid ${COLOR.ink}`,
              opacity: t,
            }}
          />
        );
      })}
    </>
  );
};

export { tint };
