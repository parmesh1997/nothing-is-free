/**
 * nif002/shapes.ts — episode-local FigureShapes for NIF002 "the real-time auction".
 *
 * Same contract as print/props.tsx: a FigureShape draws in its own 0..w / 0..h
 * box, flat colour + COLOR.outline stroke, `mode:"edge"` = silhouette masses
 * only. Factories (appTile / studioDesk) follow the luckyShape() pattern.
 *
 * Promote to print/ only if a second episode needs them (§16 Type B).
 */
import { COLOR, shade, tint } from "../tokens";
import { FigureShape } from "../print/figure";

const S = (h: number, k = 0.012) => ({
  stroke: COLOR.outline,
  strokeWidth: h * k,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
});

// ─────────────────────────────────────────────────────────────────────────────
// AppTile — a rounded-square app icon with a simple centred glyph.
// ─────────────────────────────────────────────────────────────────────────────

export type AppGlyph = "letter" | "controller" | "bag" | "cloud" | "map" | "dots";

export const appTile =
  ({
    glyph = "letter",
    color = COLOR.orange,
    screen = false,
  }: { glyph?: AppGlyph; color?: string; screen?: boolean } = {}): FigureShape =>
  ({ paint, mode, w, h }) => {
    const r = Math.min(w, h) * 0.22;
    const g = paint(mode === "fill" ? COLOR.cardWhite : color);
    const gw = w * 0.5;
    const cx = w / 2;
    const cy = h / 2;
    return (
      <>
        <rect
          x={0}
          y={0}
          width={w}
          height={h}
          rx={r}
          fill={paint(color)}
          {...S(h)}
        />
        {mode === "fill" && !screen && (
          <>
            {glyph === "letter" && (
              <rect x={cx - gw * 0.32} y={cy - gw * 0.34} width={gw * 0.64} height={gw * 0.68} rx={gw * 0.08} fill={g} />
            )}
            {glyph === "controller" && (
              <>
                <rect x={cx - gw * 0.5} y={cy - gw * 0.22} width={gw} height={gw * 0.44} rx={gw * 0.22} fill={g} />
                <circle cx={cx + gw * 0.22} cy={cy} r={gw * 0.09} fill={paint(color)} />
                <rect x={cx - gw * 0.36} y={cy - gw * 0.04} width={gw * 0.22} height={gw * 0.08} fill={paint(color)} />
              </>
            )}
            {glyph === "bag" && (
              <>
                <path d={`M ${cx - gw * 0.34} ${cy - gw * 0.18} L ${cx + gw * 0.34} ${cy - gw * 0.18} L ${cx + gw * 0.42} ${cy + gw * 0.38} L ${cx - gw * 0.42} ${cy + gw * 0.38} Z`} fill={g} />
                <path d={`M ${cx - gw * 0.18} ${cy - gw * 0.18} Q ${cx} ${cy - gw * 0.5} ${cx + gw * 0.18} ${cy - gw * 0.18}`} fill="none" stroke={g} strokeWidth={h * 0.02} />
              </>
            )}
            {glyph === "cloud" && (
              <ellipse cx={cx} cy={cy + gw * 0.06} rx={gw * 0.44} ry={gw * 0.26} fill={g} />
            )}
            {glyph === "map" && (
              <path d={`M ${cx - gw * 0.36} ${cy - gw * 0.3} l ${gw * 0.24} ${gw * 0.1} l ${gw * 0.24} ${-gw * 0.1} l ${gw * 0.24} ${gw * 0.1} l 0 ${gw * 0.6} l ${-gw * 0.24} ${-gw * 0.1} l ${-gw * 0.24} ${gw * 0.1} l ${-gw * 0.24} ${-gw * 0.1} Z`} fill={g} />
            )}
            {glyph === "dots" && (
              [-1, 0, 1].map((i) => <circle key={i} cx={cx + i * gw * 0.28} cy={cy} r={gw * 0.09} fill={g} />)
            )}
          </>
        )}
      </>
    );
  };

// ─────────────────────────────────────────────────────────────────────────────
// phoneBody — a phone with a PLAIN screen (no play-button glyph), so a beat can
// draw its own UI on top. Screen rect: x 0.08w · y 0.06h · 0.84w × 0.88h.
// ─────────────────────────────────────────────────────────────────────────────

export const phoneBody =
  ({ screen = COLOR.cardWhite }: { screen?: string } = {}): FigureShape =>
  ({ paint, w, h }) => (
    <>
      <rect x={0} y={0} width={w} height={h} rx={w * 0.12} fill={paint(COLOR.ink)} {...S(h, 0.014)} />
      <rect x={w * 0.08} y={h * 0.06} width={w * 0.84} height={h * 0.88} rx={w * 0.06} fill={paint(screen)} />
      <rect x={w * 0.4} y={h * 0.025} width={w * 0.2} height={h * 0.014} rx={h * 0.007} fill={paint(COLOR.grey)} />
    </>
  );

/** SCREEN — helper: the on-screen rect of a phoneBody of size w×h, for a beat to
 *  position UI. Returns {left, top, width, height} relative to the phone box. */
export const phoneScreenRect = (w: number, h: number) => ({
  left: w * 0.08,
  top: h * 0.06,
  width: w * 0.84,
  height: h * 0.88,
});

// ─────────────────────────────────────────────────────────────────────────────
// Keys — a small keychain + two keys, for desk clutter.
// ─────────────────────────────────────────────────────────────────────────────

export const Keys: FigureShape = ({ paint, w, h }) => (
  <>
    <circle cx={w * 0.24} cy={h * 0.5} r={w * 0.16} fill="none" stroke={paint(COLOR.grey)} strokeWidth={h * 0.06} />
    {[0.12, -0.06].map((rot, i) => (
      <g key={i} transform={`rotate(${rot * 100} ${w * 0.24} ${h * 0.5})`}>
        <rect x={w * 0.34} y={h * (0.42 + i * 0.12)} width={w * 0.5} height={h * 0.1} rx={h * 0.03} fill={paint(COLOR.grey)} {...S(h)} />
        <rect x={w * 0.78} y={h * (0.4 + i * 0.12)} width={w * 0.06} height={h * 0.14} fill={paint(COLOR.grey)} />
      </g>
    ))}
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// Notebook — a closed notebook / pad, seen at a slight angle. Desk clutter.
// ─────────────────────────────────────────────────────────────────────────────

export const Notebook: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={0} y={h * 0.1} width={w} height={h * 0.82} rx={h * 0.04} fill={paint(COLOR.grey)} {...S(h)} />
      {d && <rect x={w * 0.08} y={h * 0.1} width={w * 0.06} height={h * 0.82} fill={paint(shade(COLOR.grey, 0.3))} />}
      {d && [0.3, 0.45, 0.6, 0.75].map((fy, i) => (
        <line key={i} x1={w * 0.22} y1={h * fy} x2={w * 0.86} y2={h * fy} stroke={paint(COLOR.cardWhite)} strokeWidth={h * 0.02} opacity={0.5} />
      ))}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stopwatch — a big clock face. `handAngle` (deg, 0 = up) is set by the caller
// for the sweep. The "half second" the auction lives in (B01).
// ─────────────────────────────────────────────────────────────────────────────

export const stopwatch =
  ({ handAngle = 0, label }: { handAngle?: number; label?: string } = {}): FigureShape =>
  ({ paint, mode, w, h }) => {
    const d = mode === "fill";
    const cx = w / 2;
    const cy = h * 0.56;
    const r = Math.min(w, h * 0.9) * 0.44;
    return (
      <>
        {/* crown + button */}
        <rect x={cx - w * 0.05} y={cy - r - h * 0.1} width={w * 0.1} height={h * 0.1} rx={w * 0.02} fill={paint(COLOR.ink)} {...S(h)} />
        {/* face */}
        <circle cx={cx} cy={cy} r={r} fill={paint(COLOR.paperShade)} {...S(h, 0.016)} />
        <circle cx={cx} cy={cy} r={r * 0.86} fill={paint(shade(COLOR.paperShade, 0.05))} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={paint(COLOR.ink)} strokeWidth={h * 0.024} />
        {d &&
          Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={cx + Math.sin(a) * r * 0.82}
                y1={cy - Math.cos(a) * r * 0.82}
                x2={cx + Math.sin(a) * r * 0.92}
                y2={cy - Math.cos(a) * r * 0.92}
                stroke={paint(COLOR.grey)}
                strokeWidth={h * 0.012}
              />
            );
          })}
        {/* hand */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + Math.sin((handAngle * Math.PI) / 180) * r * 0.78}
          y2={cy - Math.cos((handAngle * Math.PI) / 180) * r * 0.78}
          stroke={paint(COLOR.orange)}
          strokeWidth={h * 0.02}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={h * 0.022} fill={paint(COLOR.ink)} />
        {d && label && (
          <text x={cx} y={cy + r * 0.5} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace' fontSize={h * 0.09} fill={paint(COLOR.ink)}>
            {label}
          </text>
        )}
      </>
    );
  };

// ─────────────────────────────────────────────────────────────────────────────
// Gavel — auctioneer's gavel + round sound block.
// ─────────────────────────────────────────────────────────────────────────────

export const Gavel: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      {/* sound block */}
      <ellipse cx={w * 0.3} cy={h * 0.9} rx={w * 0.26} ry={h * 0.08} fill={paint(shade(COLOR.tan, 0.15))} {...S(h)} />
      {/* handle */}
      <rect x={w * 0.34} y={h * 0.12} width={w * 0.12} height={h * 0.66} rx={w * 0.05} fill={paint(COLOR.tan)} transform={`rotate(28 ${w * 0.4} ${h * 0.45})`} {...S(h)} />
      {/* head */}
      <rect x={w * 0.5} y={h * 0.06} width={w * 0.4} height={h * 0.24} rx={w * 0.05} fill={paint(COLOR.ink)} transform={`rotate(28 ${w * 0.7} ${h * 0.18})`} {...S(h)} />
      {d && <rect x={w * 0.58} y={h * 0.02} width={w * 0.06} height={h * 0.32} fill={paint(COLOR.orange)} transform={`rotate(28 ${w * 0.7} ${h * 0.18})`} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Packet — the bid request leaving the phone: a small tagged envelope.
// ─────────────────────────────────────────────────────────────────────────────

export const Packet: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={0} y={h * 0.12} width={w} height={h * 0.76} rx={h * 0.08} fill={paint(COLOR.cardWhite)} {...S(h)} />
      {d && (
        <>
          <path d={`M 0 ${h * 0.16} L ${w * 0.5} ${h * 0.54} L ${w} ${h * 0.16}`} fill="none" stroke={paint(COLOR.grey)} strokeWidth={h * 0.03} />
          <rect x={w * 0.12} y={h * 0.62} width={w * 0.5} height={h * 0.09} fill={paint(COLOR.grey)} />
          <rect x={w * 0.12} y={h * 0.75} width={w * 0.34} height={h * 0.09} fill={paint(COLOR.grey)} />
          <circle cx={w * 0.82} cy={h * 0.72} r={h * 0.1} fill={paint(COLOR.orange)} />
        </>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Forearm — a hand + forearm rising from below to hold a phone. Big bottom mass.
// Box is drawn as if the wrist enters at the bottom-centre and the hand grips
// near the top. `facing` via the caller's scaleX if needed.
// ─────────────────────────────────────────────────────────────────────────────

export const Forearm: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  const skin = COLOR.tan;
  return (
    <>
      {/* forearm — a fat rounded bar from bottom to ~55% */}
      <path
        d={`M ${w * 0.28} ${h}
            L ${w * 0.24} ${h * 0.5}
            Q ${w * 0.26} ${h * 0.3} ${w * 0.5} ${h * 0.26}
            L ${w * 0.78} ${h * 0.3}
            Q ${w * 0.86} ${h * 0.55} ${w * 0.8} ${h}
            Z`}
        fill={paint(skin)}
        {...S(h, 0.014)}
      />
      {/* palm / grip */}
      <path
        d={`M ${w * 0.3} ${h * 0.34}
            Q ${w * 0.2} ${h * 0.14} ${w * 0.42} ${h * 0.06}
            L ${w * 0.82} ${h * 0.04}
            Q ${w * 0.96} ${h * 0.12} ${w * 0.9} ${h * 0.32}
            Q ${w * 0.7} ${h * 0.42} ${w * 0.3} ${h * 0.34} Z`}
        fill={paint(tint(skin, 0.06))}
        {...S(h, 0.014)}
      />
      {d && (
        <>
          {/* knuckle lines / fingers wrapping */}
          {[0.18, 0.36, 0.54, 0.72].map((fx, i) => (
            <path key={i} d={`M ${w * (0.34 + fx * 0.5)} ${h * 0.05} q ${w * 0.04} ${h * 0.06} 0 ${h * 0.12}`} fill="none" stroke={paint(shade(skin, 0.18))} strokeWidth={h * 0.012} />
          ))}
          {/* wrist crease */}
          <path d={`M ${w * 0.26} ${h * 0.44} Q ${w * 0.5} ${h * 0.4} ${w * 0.8} ${h * 0.46}`} fill="none" stroke={paint(shade(skin, 0.16))} strokeWidth={h * 0.012} />
        </>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Desk — a heavy foreground surface slab. The bottom-third occupancy anchor for
// talking-to-a-phone beats. Draw it full-width at the bottom of the frame.
// ─────────────────────────────────────────────────────────────────────────────

export const Desk: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={0} y={h * 0.18} width={w} height={h * 0.82} fill={paint(COLOR.grey)} {...S(h, 0.006)} />
      {d && (
        <>
          <rect x={0} y={h * 0.18} width={w} height={h * 0.06} fill={paint(tint(COLOR.grey, 0.14))} />
          <rect x={0} y={h * 0.24} width={w} height={h * 0.02} fill={paint(shade(COLOR.grey, 0.22))} />
        </>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Couch — a simple two-seat sofa silhouette (Lucky sits here in B02).
// ─────────────────────────────────────────────────────────────────────────────

export const Couch: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  const base = COLOR.grey;
  return (
    <>
      {/* back */}
      <rect x={w * 0.04} y={0} width={w * 0.92} height={h * 0.56} rx={h * 0.14} fill={paint(base)} {...S(h)} />
      {/* seat */}
      <rect x={0} y={h * 0.4} width={w} height={h * 0.44} rx={h * 0.12} fill={paint(shade(base, 0.08))} {...S(h)} />
      {/* arms */}
      <rect x={-w * 0.02} y={h * 0.3} width={w * 0.16} height={h * 0.5} rx={h * 0.1} fill={paint(base)} {...S(h)} />
      <rect x={w * 0.86} y={h * 0.3} width={w * 0.16} height={h * 0.5} rx={h * 0.1} fill={paint(base)} {...S(h)} />
      {/* legs */}
      <rect x={w * 0.1} y={h * 0.82} width={w * 0.05} height={h * 0.16} fill={paint(COLOR.ink)} />
      <rect x={w * 0.85} y={h * 0.82} width={w * 0.05} height={h * 0.16} fill={paint(COLOR.ink)} />
      {d && <line x1={w * 0.5} y1={h * 0.42} x2={w * 0.5} y2={h * 0.8} stroke={paint(shade(base, 0.18))} strokeWidth={h * 0.01} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// studioDesk — a two-person dev desk under a "STUDIO" label (B02, B24).
// Two small seated blob figures + monitors.
// ─────────────────────────────────────────────────────────────────────────────

export const studioDesk =
  ({ color = COLOR.grey }: { color?: string } = {}): FigureShape =>
  ({ paint, mode, w, h }) => {
    const d = mode === "fill";
    // a person standing behind the desk: head, torso, one raised/gesturing arm
    const person = (px: number, face: number, key: string) => (
      <g key={key}>
        {/* torso */}
        <path d={`M ${px - w * 0.075} ${h * 0.66} L ${px - w * 0.055} ${h * 0.34} Q ${px} ${h * 0.28} ${px + w * 0.055} ${h * 0.34} L ${px + w * 0.075} ${h * 0.66} Z`} fill={paint(color)} {...S(h)} />
        {/* head */}
        <circle cx={px} cy={h * 0.22} r={h * 0.075} fill={paint(COLOR.tan)} {...S(h, 0.01)} />
        {d && <path d={`M ${px - h * 0.055} ${h * 0.19} a ${h * 0.08} ${h * 0.08} 0 0 1 ${h * 0.11} 0 Z`} fill={paint(COLOR.ink)} />}
        {/* one arm: a bent gesture */}
        <path d={`M ${px + face * w * 0.05} ${h * 0.38} L ${px + face * w * 0.11} ${h * 0.46} L ${px + face * w * 0.16} ${h * 0.34}`} fill="none" stroke={paint(COLOR.tan)} strokeWidth={h * 0.045} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
    return (
      <>
        {person(w * 0.3, 1, "p1")}
        {person(w * 0.7, -1, "p2")}
        {/* desk top */}
        <rect x={-w * 0.02} y={h * 0.62} width={w * 1.04} height={h * 0.1} fill={paint(COLOR.grey)} {...S(h)} />
        {/* a small monitor / whiteboard between them */}
        {d && <rect x={w * 0.42} y={h * 0.44} width={w * 0.16} height={h * 0.16} rx={h * 0.015} fill={paint(COLOR.ink)} {...S(h, 0.008)} />}
        {/* legs */}
        <rect x={w * 0.05} y={h * 0.72} width={w * 0.05} height={h * 0.28} fill={paint(COLOR.ink)} />
        <rect x={w * 0.9} y={h * 0.72} width={w * 0.05} height={h * 0.28} fill={paint(COLOR.ink)} />
      </>
    );
  };

// ─────────────────────────────────────────────────────────────────────────────
// sdkChip — a small "kit" of ad-company code: a rounded chip with contact pins.
// The kit that rides inside a free app (B05, B06). `tone` rotates the fill.
// ─────────────────────────────────────────────────────────────────────────────

export const sdkChip =
  ({ tone = COLOR.orange, tag }: { tone?: string; tag?: string } = {}): FigureShape =>
  ({ paint, mode, w, h }) => {
    const d = mode === "fill";
    return (
      <>
        <rect x={w * 0.14} y={h * 0.2} width={w * 0.72} height={h * 0.6} rx={h * 0.1} fill={paint(tone)} {...S(h)} />
        {[0.28, 0.5, 0.72].map((fx, i) => (
          <g key={i}>
            <rect x={w * fx - w * 0.02} y={h * 0.08} width={w * 0.04} height={h * 0.14} fill={paint(COLOR.grey)} />
            <rect x={w * fx - w * 0.02} y={h * 0.78} width={w * 0.04} height={h * 0.14} fill={paint(COLOR.grey)} />
          </g>
        ))}
        {d && <rect x={w * 0.26} y={h * 0.38} width={w * 0.48} height={h * 0.24} rx={h * 0.04} fill={paint(COLOR.ink)} opacity={0.85} />}
        {d && tag && (
          <text x={w * 0.5} y={h * 0.55} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace' fontSize={h * 0.16} fill={paint(COLOR.cardWhite)}>
            {tag}
          </text>
        )}
      </>
    );
  };

// ─────────────────────────────────────────────────────────────────────────────
// barcode — a vertical code strip. The advertising ID as "your name" (B06),
// and the app flipping to a lot number at the reversal (B25).
// ─────────────────────────────────────────────────────────────────────────────

export const barcode =
  ({ seed = 7, label }: { seed?: number; label?: string } = {}): FigureShape =>
  ({ paint, mode, w, h }) => {
    const d = mode === "fill";
    let x = w * 0.08;
    const bars: React.ReactNode[] = [];
    let n = seed;
    let i = 0;
    while (x < w * 0.92) {
      n = (n * 1103515245 + 12345) & 0x7fffffff;
      const bw = w * (0.008 + (n % 5) * 0.006);
      if ((n >> 3) % 3 !== 0) bars.push(<rect key={i} x={x} y={h * 0.06} width={bw} height={h * (label ? 0.8 : 0.88)} fill={paint(COLOR.ink)} />);
      x += bw + w * 0.006;
      i++;
    }
    return (
      <>
        <rect x={0} y={0} width={w} height={h} fill={paint(COLOR.cardWhite)} {...S(h, 0.008)} />
        {bars}
        {d && label && (
          <text x={w * 0.5} y={h * 0.96} textAnchor="middle" fontFamily='"IBM Plex Mono", monospace' fontSize={h * 0.07} letterSpacing="0.2em" fill={paint(COLOR.ink)}>
            {label}
          </text>
        )}
      </>
    );
  };

// ─────────────────────────────────────────────────────────────────────────────
// govBuilding — a columned civic building silhouette (B19, B20).
// ─────────────────────────────────────────────────────────────────────────────

export const govBuilding: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      {/* pediment */}
      <path d={`M ${w * 0.04} ${h * 0.28} L ${w * 0.5} ${h * 0.04} L ${w * 0.96} ${h * 0.28} Z`} fill={paint(COLOR.grey)} {...S(h)} />
      {/* architrave */}
      <rect x={w * 0.06} y={h * 0.28} width={w * 0.88} height={h * 0.08} fill={paint(shade(COLOR.grey, 0.1))} {...S(h)} />
      {/* columns */}
      {[0.14, 0.3, 0.46, 0.62, 0.78].map((fx, i) => (
        <rect key={i} x={w * fx} y={h * 0.36} width={w * 0.08} height={h * 0.5} fill={paint(COLOR.cardWhite)} {...S(h, 0.008)} />
      ))}
      {/* base */}
      <rect x={0} y={h * 0.86} width={w} height={h * 0.14} fill={paint(COLOR.grey)} {...S(h)} />
      {d && <rect x={w * 0.42} y={h * 0.5} width={w * 0.16} height={h * 0.36} fill={paint(COLOR.ink)} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// dataCrate — a shipping crate stamped with a barcode. "Sold in bulk" (B19, B20).
// ─────────────────────────────────────────────────────────────────────────────

export const dataCrate: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      <rect x={w * 0.04} y={h * 0.12} width={w * 0.92} height={h * 0.82} fill={paint(COLOR.tan)} {...S(h)} />
      <path d={`M ${w * 0.04} ${h * 0.12} L ${w * 0.96} ${h * 0.12} M ${w * 0.04} ${h * 0.94} L ${w * 0.96} ${h * 0.94} M ${w * 0.04} ${h * 0.12} L ${w * 0.96} ${h * 0.94} M ${w * 0.96} ${h * 0.12} L ${w * 0.04} ${h * 0.94}`} stroke={paint(shade(COLOR.tan, 0.22))} strokeWidth={h * 0.02} />
      {d && (
        <g>
          <rect x={w * 0.3} y={h * 0.34} width={w * 0.4} height={h * 0.32} fill={paint(COLOR.cardWhite)} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={w * (0.33 + i * 0.055)} y={h * 0.38} width={w * (i % 2 ? 0.02 : 0.035)} height={h * 0.24} fill={paint(COLOR.ink)} />
          ))}
        </g>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// junkPage — a browser frame that fills with ad slots and never shows an article
// (B14). `fillFrac` 0..1 is how many slots are in; drawn by the beat via opacity.
// ─────────────────────────────────────────────────────────────────────────────

export const junkPage: FigureShape = ({ paint, mode, w, h }) => {
  const d = mode === "fill";
  return (
    <>
      {/* chrome */}
      <rect x={0} y={0} width={w} height={h} rx={h * 0.02} fill={paint(COLOR.cardWhite)} {...S(h, 0.008)} />
      <rect x={0} y={0} width={w} height={h * 0.08} fill={paint(COLOR.paperShade)} {...S(h, 0.008)} />
      {d && [0.04, 0.09, 0.14].map((fx, i) => <circle key={i} cx={w * fx} cy={h * 0.04} r={h * 0.014} fill={paint(COLOR.grey)} />)}
      {d && <rect x={w * 0.2} y={h * 0.022} width={w * 0.6} height={h * 0.036} rx={h * 0.018} fill={paint(COLOR.cardWhite)} stroke={paint(COLOR.grey)} strokeWidth={h * 0.004} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// streetGrid — a plain abstract street map (B20 data-path, B27 route). No labels.
// ─────────────────────────────────────────────────────────────────────────────

export const streetGrid: FigureShape = ({ paint, w, h }) => (
  <>
    <rect x={0} y={0} width={w} height={h} fill={paint(COLOR.paperShade)} />
    {[0.16, 0.34, 0.52, 0.7, 0.88].map((fy, i) => (
      <rect key={`h${i}`} x={0} y={h * fy} width={w} height={h * 0.012} fill={paint(COLOR.grid)} />
    ))}
    {[0.12, 0.3, 0.46, 0.62, 0.8, 0.94].map((fx, i) => (
      <rect key={`v${i}`} x={w * fx} y={0} width={w * 0.008} height={h} fill={paint(COLOR.grid)} />
    ))}
    {/* a couple of blocks tinted so it reads as a place */}
    <rect x={w * 0.3} y={h * 0.16} width={w * 0.16} height={h * 0.18} fill={paint(COLOR.grey)} opacity={0.14} />
    <rect x={w * 0.62} y={h * 0.52} width={w * 0.18} height={h * 0.18} fill={paint(COLOR.grey)} opacity={0.14} />
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// balanceScale — a two-pan balance. INVASIVE ↔ POINTLESS, settles level (B24).
// `tiltDeg` is set by the beat.
// ─────────────────────────────────────────────────────────────────────────────

export const balanceScale =
  ({ tiltDeg = 0 }: { tiltDeg?: number } = {}): FigureShape =>
  ({ paint, w, h }) => {
    const cx = w / 2;
    const beamY = h * 0.24;
    const armLen = w * 0.4;
    const rad = (tiltDeg * Math.PI) / 180;
    const dx = Math.cos(rad) * armLen;
    const dy = Math.sin(rad) * armLen;
    const pan = (px: number, py: number, key: string) => (
      <g key={key}>
        <line x1={px} y1={py} x2={px} y2={py + h * 0.22} stroke={paint(COLOR.ink)} strokeWidth={h * 0.012} />
        <path d={`M ${px - w * 0.12} ${py + h * 0.22} Q ${px} ${py + h * 0.34} ${px + w * 0.12} ${py + h * 0.22} Z`} fill={paint(COLOR.paperShade)} {...S(h)} />
      </g>
    );
    return (
      <>
        {/* post */}
        <rect x={cx - w * 0.02} y={beamY} width={w * 0.04} height={h * 0.62} fill={paint(COLOR.ink)} />
        <path d={`M ${cx - w * 0.12} ${h * 0.86} L ${cx + w * 0.12} ${h * 0.86} L ${cx + w * 0.16} ${h * 0.94} L ${cx - w * 0.16} ${h * 0.94} Z`} fill={paint(COLOR.grey)} {...S(h)} />
        {/* beam */}
        <line x1={cx - dx} y1={beamY - dy} x2={cx + dx} y2={beamY + dy} stroke={paint(COLOR.ink)} strokeWidth={h * 0.016} strokeLinecap="round" />
        <circle cx={cx} cy={beamY} r={h * 0.02} fill={paint(COLOR.orange)} />
        {pan(cx - dx, beamY - dy, "L")}
        {pan(cx + dx, beamY + dy, "R")}
      </>
    );
  };
