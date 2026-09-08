import { useCurrentFrame } from "remotion";
import { HEIGHT, WIDTH } from "../../tokens";
import { V3, dk, lt } from "./palette";
import { cyc } from "./stage3";

/**
 * v3 SETS — a built environment behind every beat (Infographics Show: a real
 * location with depth, not sparse elements on a slab).
 *
 * <Street>  — the free-app district: a road receding to a vanishing point,
 *             storefront blocks left & right, a dusk sky, sidewalks. The default
 *             backdrop; Lucky + Walkers live on the road.
 * <Room>    — a generic interior: back wall, floor, one side wall, a window.
 *             Parameterised by tone for the studio / warehouse / courtroom.
 * <Walker>  — a simple background pedestrian (OverSimplified-plain) with a walk
 *             cycle, placed at a depth on the street.
 */

const HORIZON = Math.round(HEIGHT * 0.46);

// ── Street ──────────────────────────────────────────────────────────────────
//
// Backdrop style (Infographics Show): a crisp row of clean building blocks at
// the horizon, each with a shopfront + awning + window grid, in distinct muted
// tones. A sidewalk band, then a shallow-perspective road coming to camera.
// Lampposts + a crossing give the street furniture. Not a deep perspective
// tunnel — a stage.

type Bldg = { w: number; h: number; tone: string; sign?: string; awn: string };

const ROW_L: Bldg[] = [
  { w: 300, h: 360, tone: V3.bldgB, sign: "FREE", awn: V3.accent },
  { w: 240, h: 300, tone: V3.bldgC, sign: "APPS", awn: V3.bldgShade },
  { w: 280, h: 420, tone: V3.bldgA, awn: V3.bldgShade },
];
const ROW_R: Bldg[] = [
  { w: 260, h: 330, tone: V3.bldgA, awn: V3.bldgShade },
  { w: 300, h: 400, tone: V3.bldgB, sign: "PLAY", awn: V3.accent },
  { w: 250, h: 300, tone: V3.bldgC, awn: V3.bldgShade },
];

const Building: React.FC<{ x: number; groundY: number; b: Bldg }> = ({ x, groundY, b }) => {
  const cols = Math.max(3, Math.round(b.w / 64));
  const rows = Math.max(3, Math.round(b.h / 78));
  const top = groundY - b.h;
  const shopH = Math.min(120, b.h * 0.28);
  return (
    <g>
      {/* body */}
      <rect x={x} y={top} width={b.w} height={b.h} fill={b.tone} />
      <rect x={x} y={top} width={b.w} height={10} fill={lt(b.tone, 0.2)} />
      <rect x={x + b.w - 8} y={top} width={8} height={b.h} fill={dk(b.tone, 0.24)} />
      {/* windows above the shopfront */}
      {Array.from({ length: cols * (rows - 1) }).map((_, k) => {
        const c = k % cols;
        const r = Math.floor(k / cols);
        const wx = x + b.w * (0.1 + (c / cols) * 0.82);
        const wy = top + 26 + r * ((b.h - shopH - 40) / (rows - 1));
        const on = (c * 3 + r * 7 + Math.round(x)) % 5 < 2;
        return <rect key={k} x={wx} y={wy} width={b.w / cols * 0.56} height={b.h / rows * 0.5} rx={2} fill={on ? V3.window : V3.windowDim} />;
      })}
      {/* shopfront */}
      <rect x={x + 6} y={groundY - shopH} width={b.w - 12} height={shopH} fill={dk(b.tone, 0.3)} />
      <rect x={x + 6} y={groundY - shopH} width={b.w - 12} height={shopH * 0.55} fill={lt(V3.window, 0)} opacity={0.9} />
      <rect x={x + 6} y={groundY - shopH} width={b.w - 12} height={shopH * 0.55} fill={V3.window} opacity={0.5} />
      {/* awning */}
      <path d={`M ${x} ${groundY - shopH} L ${x + b.w} ${groundY - shopH} L ${x + b.w - 14} ${groundY - shopH + 34} L ${x + 14} ${groundY - shopH + 34} Z`} fill={b.awn} />
      <path d={`M ${x} ${groundY - shopH} L ${x + b.w} ${groundY - shopH} L ${x + b.w} ${groundY - shopH + 8} L ${x} ${groundY - shopH + 8} Z`} fill={dk(b.awn, 0.2)} />
      {b.sign && (
        <text x={x + b.w / 2} y={top - 14} textAnchor="middle" fontFamily='"Bebas Neue", sans-serif' fontSize={44} letterSpacing="0.06em" fill={b.awn === V3.accent ? V3.accent : V3.paperLight}>
          {b.sign}
        </text>
      )}
    </g>
  );
};

const Lamppost: React.FC<{ x: number; groundY: number; s?: number }> = ({ x, groundY, s = 1 }) => (
  <g>
    <rect x={x - 4 * s} y={groundY - 150 * s} width={8 * s} height={150 * s} fill={V3.ink} />
    <path d={`M ${x} ${groundY - 150 * s} q ${34 * s} 0 ${34 * s} ${28 * s}`} fill="none" stroke={V3.ink} strokeWidth={7 * s} />
    <ellipse cx={x + 34 * s} cy={groundY - 118 * s} rx={12 * s} ry={9 * s} fill={V3.window} />
  </g>
);

export const Street: React.FC<{ dusk?: boolean }> = ({ dusk = false }) => {
  const cx = WIDTH / 2;
  const vpY = HORIZON;
  const bldgGround = Math.round(HEIGHT * 0.6);
  const sky1 = dusk ? "#C79062" : V3.skyHi;
  const sky2 = dusk ? "#6E5F5A" : V3.sky;

  const roadTopHalf = WIDTH * 0.09;
  const roadBotHalf = WIDTH * 0.4;

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="v3-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky1} />
          <stop offset="100%" stopColor={sky2} />
        </linearGradient>
        <linearGradient id="v3-road2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dk(V3.road, 0.22)} />
          <stop offset="100%" stopColor={V3.roadHi} />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x={0} y={0} width={WIDTH} height={bldgGround} fill="url(#v3-sky)" />

      {/* ── building rows ── */}
      {(() => {
        let lx = -40;
        return ROW_L.map((b, i) => {
          const el = <Building key={`l${i}`} x={lx} groundY={bldgGround} b={b} />;
          lx += b.w - 24;
          return el;
        });
      })()}
      {(() => {
        let rx = WIDTH + 40 - ROW_R.reduce((a, b) => a + b.w - 24, 0) - 24;
        return ROW_R.map((b, i) => {
          const el = <Building key={`r${i}`} x={rx} groundY={bldgGround} b={b} />;
          rx += b.w - 24;
          return el;
        });
      })()}

      {/* ── ground: sidewalk then road ── */}
      <rect x={0} y={bldgGround} width={WIDTH} height={HEIGHT - bldgGround} fill={V3.walk} />
      <rect x={0} y={bldgGround} width={WIDTH} height={16} fill={lt(V3.walk, 0.16)} />
      {/* paving joints on the sidewalk */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={(i / 12) * WIDTH} y1={bldgGround} x2={(i / 12) * WIDTH - 40} y2={HEIGHT} stroke={dk(V3.walk, 0.16)} strokeWidth={2} opacity={0.5} />
      ))}

      {/* road */}
      <path d={`M ${cx - roadTopHalf} ${vpY} L ${cx + roadTopHalf} ${vpY} L ${cx + roadBotHalf} ${HEIGHT} L ${cx - roadBotHalf} ${HEIGHT} Z`} fill="url(#v3-road2)" />
      <path d={`M ${cx - roadTopHalf} ${vpY} L ${cx - roadBotHalf} ${HEIGHT} L ${cx - roadBotHalf - 20} ${HEIGHT} L ${cx - roadTopHalf - 6} ${vpY} Z`} fill={dk(V3.walk, 0.26)} />
      <path d={`M ${cx + roadTopHalf} ${vpY} L ${cx + roadBotHalf} ${HEIGHT} L ${cx + roadBotHalf + 20} ${HEIGHT} L ${cx + roadTopHalf + 6} ${vpY} Z`} fill={dk(V3.walk, 0.26)} />

      {/* zebra crossing near camera — bars across the road */}
      {Array.from({ length: 7 }).map((_, i) => {
        const yTop = HEIGHT * 0.8;
        const yBot = HEIGHT * 0.92;
        // road half-width at each y
        const hwTop = roadTopHalf + (roadBotHalf - roadTopHalf) * ((yTop - vpY) / (HEIGHT - vpY));
        const hwBot = roadTopHalf + (roadBotHalf - roadBotHalf * 0) * 0 + (roadBotHalf - roadTopHalf) * ((yBot - vpY) / (HEIGHT - vpY));
        const span = i / 7;
        const x0t = cx - hwTop * 0.9 + span * hwTop * 1.8;
        const x0b = cx - hwBot * 0.9 + span * hwBot * 1.8;
        const bw = hwTop * 0.16;
        return <path key={i} d={`M ${x0t} ${yTop} L ${x0t + bw} ${yTop} L ${x0b + bw * 1.3} ${yBot} L ${x0b} ${yBot} Z`} fill={V3.laneMark} opacity={0.8} />;
      })}
      {/* centre dashes */}
      {Array.from({ length: 6 }).map((_, i) => {
        const t = i / 6;
        const y0 = vpY + (HEIGHT * 0.8 - vpY) * (t * t * 0.85 + t * 0.15);
        const w = 3 + t * 16;
        return <rect key={i} x={cx - w / 2} y={y0} width={w} height={10 + t * 26} fill={V3.laneMark} opacity={0.85} />;
      })}

      {/* lampposts */}
      <Lamppost x={WIDTH * 0.2} groundY={HEIGHT * 0.78} s={1.1} />
      <Lamppost x={WIDTH * 0.8} groundY={HEIGHT * 0.78} s={1.1} />
      <Lamppost x={WIDTH * 0.36} groundY={bldgGround + 40} s={0.62} />
      <Lamppost x={WIDTH * 0.64} groundY={bldgGround + 40} s={0.62} />
    </svg>
  );
};

/** The y where the building row meets the pavement (mid-scene ground line). */
export const STREET_HORIZON = Math.round(HEIGHT * 0.6);
/** Baseline for a foreground character standing near the camera. */
export const STREET_GROUND = Math.round(HEIGHT * 0.9);

// ── Walker ──────────────────────────────────────────────────────────────────

export const Walker: React.FC<{
  /** centre x in px */
  x: number;
  /** baseline y in px */
  baseline: number;
  /** figure height in px */
  h: number;
  /** -1 faces/moves left, 1 right */
  facing?: 1 | -1;
  /** walk cycle speed (frames per stride) */
  stride?: number;
  /** body colour */
  tone?: string;
  /** stroke phase offset so a crowd isn't in lockstep */
  phase?: number;
}> = ({ x, baseline, h, facing = 1, stride = 26, tone = V3.bldgB, phase = 0 }) => {
  const frame = useCurrentFrame();
  const t = cyc(frame, stride, phase);
  const swing = Math.sin(t * Math.PI * 2);
  const bob = Math.abs(Math.cos(t * Math.PI * 2)) * h * 0.02;
  const headR = h * 0.13;
  const legL = h * 0.4;
  const w = h * 0.3;
  const cy = baseline - h;

  const leg = (s: 1 | -1) => {
    const a = swing * s * 0.5;
    const kx = x + facing * Math.sin(a) * legL * 0.5;
    const ky = baseline - legL + Math.abs(Math.sin(a)) * legL * 0.12;
    const fx = x + facing * Math.sin(a) * legL;
    return (
      <g key={s}>
        <line x1={x} y1={baseline - legL} x2={kx} y2={ky} stroke={dk(tone, 0.3)} strokeWidth={h * 0.09} strokeLinecap="round" />
        <line x1={kx} y1={ky} x2={fx} y2={baseline} stroke={dk(tone, 0.3)} strokeWidth={h * 0.09} strokeLinecap="round" />
      </g>
    );
  };

  return (
    <g transform={`translate(0 ${-bob})`}>
      {leg(-1)}
      {leg(1)}
      {/* torso */}
      <rect x={x - w / 2} y={cy + headR * 1.4} width={w} height={h * 0.46} rx={w * 0.32} fill={tone} />
      <rect x={x - w / 2} y={cy + headR * 1.4} width={w} height={h * 0.08} rx={w * 0.3} fill={lt(tone, 0.14)} />
      {/* swinging arm */}
      <line
        x1={x}
        y1={cy + headR * 1.7}
        x2={x + facing * Math.sin(swing * 0.6) * w * 0.9}
        y2={cy + headR * 1.7 + h * 0.3}
        stroke={dk(tone, 0.36)}
        strokeWidth={h * 0.08}
        strokeLinecap="round"
      />
      {/* head */}
      <circle cx={x} cy={cy + headR * 0.2} r={headR} fill="#E7C9A6" />
      <path d={`M ${x - headR} ${cy + headR * 0.05} a ${headR} ${headR} 0 0 1 ${headR * 2} 0 l 0 ${-headR * 0.5} a ${headR} ${headR} 0 0 0 ${-headR * 2} 0 Z`} fill={dk(tone, 0.5)} />
    </g>
  );
};

// ── Room ────────────────────────────────────────────────────────────────────
//
// A lit interior: back wall + a left side wall in shallow perspective + floor.
// Parameterised by tone; `decor` selects what's on the back wall. Furniture is
// added by the beat via the <Furniture> primitives below so any room can be a
// studio / living room / boardroom.

export const ROOM_FLOOR_Y = Math.round(HEIGHT * 0.6);
const ROOM_BACK = ROOM_FLOOR_Y;

let _rid = 0;
const rid = () => `v3r${++_rid}`;

export const Room: React.FC<{
  tone?: string;
  floorTone?: string;
  /** back-wall treatment */
  decor?: "plain" | "window" | "blinds" | "screens" | "panelling";
  /** overhead light strips */
  lights?: boolean;
  dim?: boolean;
}> = ({ tone = V3.wall, floorTone = V3.walk, decor = "window", lights = true, dim = false }) => {
  const id = rid();
  const wallTone = dim ? dk(tone, 0.18) : tone;
  const flTone = dim ? dk(floorTone, 0.16) : floorTone;
  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lt(wallTone, 0.14)} />
          <stop offset="100%" stopColor={dk(wallTone, 0.06)} />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dk(flTone, 0.2)} />
          <stop offset="100%" stopColor={lt(flTone, 0.05)} />
        </linearGradient>
      </defs>

      <rect x={0} y={0} width={WIDTH} height={ROOM_BACK} fill={`url(#${id}w)`} />
      {/* left side wall */}
      <path d={`M 0 -10 L ${WIDTH * 0.15} ${HEIGHT * 0.08} L ${WIDTH * 0.15} ${ROOM_BACK + HEIGHT * 0.06} L 0 ${ROOM_BACK + HEIGHT * 0.2} Z`} fill={dk(wallTone, 0.26)} />
      {/* floor */}
      <path d={`M 0 ${ROOM_BACK + HEIGHT * 0.2} L ${WIDTH * 0.15} ${ROOM_BACK + HEIGHT * 0.06} L ${WIDTH} ${ROOM_BACK} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`} fill={`url(#${id}f)`} />
      {/* skirting + floor seam */}
      <rect x={0} y={ROOM_BACK - 10} width={WIDTH} height={12} fill={dk(wallTone, 0.32)} />

      {lights && [0.24, 0.5, 0.76].map((fx, i) => (
        <g key={i}>
          <rect x={WIDTH * fx - 100} y={-6} width={200} height={22} fill={dk(wallTone, 0.44)} />
          <rect x={WIDTH * fx - 82} y={16} width={164} height={7} fill={V3.window} opacity={0.9} />
        </g>
      ))}

      {decor === "window" && (
        <g>
          <rect x={WIDTH * 0.58} y={HEIGHT * 0.09} width={WIDTH * 0.3} height={ROOM_BACK * 0.52} fill={V3.sky} />
          <rect x={WIDTH * 0.58} y={HEIGHT * 0.09 + ROOM_BACK * 0.34} width={WIDTH * 0.3} height={ROOM_BACK * 0.18} fill={dk(V3.sky, 0.2)} />
          <rect x={WIDTH * 0.58} y={HEIGHT * 0.09} width={WIDTH * 0.3} height={ROOM_BACK * 0.52} fill="none" stroke={dk(wallTone, 0.42)} strokeWidth={12} />
          <line x1={WIDTH * 0.73} y1={HEIGHT * 0.09} x2={WIDTH * 0.73} y2={HEIGHT * 0.09 + ROOM_BACK * 0.52} stroke={dk(wallTone, 0.42)} strokeWidth={7} />
          <line x1={WIDTH * 0.58} y1={HEIGHT * 0.09 + ROOM_BACK * 0.26} x2={WIDTH * 0.88} y2={HEIGHT * 0.09 + ROOM_BACK * 0.26} stroke={dk(wallTone, 0.42)} strokeWidth={7} />
        </g>
      )}
      {decor === "blinds" && Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={WIDTH * 0.56} y={HEIGHT * 0.08 + i * 26} width={WIDTH * 0.34} height={14} fill={i % 2 ? dk(wallTone, 0.2) : lt(wallTone, 0.1)} opacity={0.9} />
      ))}
      {decor === "panelling" && Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={WIDTH * (0.08 + i * 0.145)} y={HEIGHT * 0.1} width={WIDTH * 0.11} height={ROOM_BACK * 0.66} rx={4} fill="none" stroke={dk(wallTone, 0.22)} strokeWidth={6} />
      ))}
      {decor === "screens" && Array.from({ length: 3 }).map((_, i) => (
        <g key={i}>
          <rect x={WIDTH * (0.12 + i * 0.28)} y={HEIGHT * 0.1} width={WIDTH * 0.22} height={ROOM_BACK * 0.4} rx={6} fill={V3.ink} />
          <rect x={WIDTH * (0.12 + i * 0.28) + 10} y={HEIGHT * 0.1 + 10} width={WIDTH * 0.22 - 20} height={ROOM_BACK * 0.4 - 20} fill={i === 1 ? V3.accentDim : "#2f6b6a"} opacity={0.8} />
        </g>
      ))}
    </svg>
  );
};

// ── Furniture — beats drop these into any Room ──────────────────────────────

const F = { ink: V3.ink };

export const Desk: React.FC<{ x: number; y: number; w?: number; facing?: 1 | -1; tone?: string }> = ({ x, y, w = 340, facing = 1, tone = "#6a5b49" }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={WIDTH} height={HEIGHT}>
    <path d={`M ${x - w / 2} ${y} L ${x + w / 2} ${y} L ${x + w / 2 - 30} ${y + 34} L ${x - w / 2 + 30} ${y + 34} Z`} fill={lt(tone, 0.12)} />
    <rect x={x - w / 2 + 14} y={y + 30} width={22} height={120} fill={dk(tone, 0.24)} />
    <rect x={x + w / 2 - 36} y={y + 30} width={22} height={120} fill={dk(tone, 0.24)} />
    <rect x={facing === 1 ? x + 6 : x - w / 2 + 18} y={y + 34} width={w * 0.42} height={116} fill={dk(tone, 0.16)} />
  </svg>
);

export const Monitor: React.FC<{ x: number; y: number; w?: number; screen?: string }> = ({ x, y, w = 150, screen = "#2f6b6a" }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={WIDTH} height={HEIGHT}>
    <rect x={x - w / 2} y={y - w * 0.62} width={w} height={w * 0.62} rx={6} fill={F.ink} />
    <rect x={x - w / 2 + 8} y={y - w * 0.62 + 8} width={w - 16} height={w * 0.62 - 16} fill={screen} />
    <rect x={x - 14} y={y - w * 0.06} width={28} height={w * 0.12} fill={dk(F.ink, 0.1)} />
    <rect x={x - 40} y={y + w * 0.06} width={80} height={10} rx={4} fill={F.ink} />
  </svg>
);

export const Couch: React.FC<{ x: number; y: number; w?: number; tone?: string }> = ({ x, y, w = 380, tone = "#8a6b52" }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={WIDTH} height={HEIGHT}>
    <rect x={x - w / 2} y={y - 90} width={w} height={110} rx={22} fill={tone} />
    <rect x={x - w / 2} y={y - 150} width={w} height={80} rx={20} fill={dk(tone, 0.12)} />
    <rect x={x - w / 2 - 26} y={y - 150} width={40} height={170} rx={18} fill={lt(tone, 0.08)} />
    <rect x={x + w / 2 - 14} y={y - 150} width={40} height={170} rx={18} fill={lt(tone, 0.08)} />
    <rect x={x - w / 2} y={y + 16} width={w} height={26} fill={dk(tone, 0.3)} />
  </svg>
);

export const Plant: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={WIDTH} height={HEIGHT}>
    <path d={`M ${x - 30 * s} ${y} L ${x + 30 * s} ${y} L ${x + 22 * s} ${y - 60 * s} L ${x - 22 * s} ${y - 60 * s} Z`} fill={dk("#a8643c", 0.1)} />
    {[-1, -0.4, 0.3, 1].map((d, i) => (
      <path key={i} d={`M ${x} ${y - 55 * s} Q ${x + d * 60 * s} ${y - 120 * s} ${x + d * 30 * s} ${y - 190 * s}`} fill="none" stroke="#4f7a3f" strokeWidth={14 * s} strokeLinecap="round" />
    ))}
  </svg>
);

export const Shelf: React.FC<{ x: number; y: number; w?: number; h?: number; tone?: string }> = ({ x, y, w = 260, h = 360, tone = "#5c5043" }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={WIDTH} height={HEIGHT}>
    <rect x={x - w / 2} y={y - h} width={w} height={h} fill={tone} />
    {Array.from({ length: 4 }).map((_, r) => (
      <g key={r}>
        <rect x={x - w / 2} y={y - h + 12 + r * (h / 4)} width={w} height={10} fill={dk(tone, 0.28)} />
        {Array.from({ length: 3 }).map((__, c) => (
          <rect key={c} x={x - w / 2 + 16 + c * (w / 3)} y={y - h + 12 + r * (h / 4) - 46} width={w / 4} height={46} fill={[V3.accentDim, dk(tone, 0.1), V3.card][(r + c) % 3]} opacity={0.9} />
        ))}
      </g>
    ))}
  </svg>
);

// ── Exchange — the auction trading floor ────────────────────────────────────

export const Exchange: React.FC<{ deskRows?: number; litFrom?: number }> = ({ deskRows = 5 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="v3ex-w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lt(V3.wall, 0.06)} />
          <stop offset="100%" stopColor={dk(V3.wall, 0.14)} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={WIDTH} height={ROOM_BACK} fill="url(#v3ex-w)" />
      <path d={`M 0 -10 L ${WIDTH * 0.14} ${HEIGHT * 0.08} L ${WIDTH * 0.14} ${ROOM_BACK + HEIGHT * 0.06} L 0 ${ROOM_BACK + HEIGHT * 0.2} Z`} fill={dk(V3.wall, 0.3)} />
      <path d={`M 0 ${ROOM_BACK + HEIGHT * 0.2} L ${WIDTH * 0.14} ${ROOM_BACK + HEIGHT * 0.06} L ${WIDTH} ${ROOM_BACK} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`} fill={dk(V3.walk, 0.28)} />
      <rect x={0} y={ROOM_BACK - 10} width={WIDTH} height={12} fill={dk(V3.wall, 0.36)} />

      {/* ceiling light rig */}
      {[0.2, 0.4, 0.6, 0.8].map((fx, i) => (
        <g key={i}>
          <rect x={WIDTH * fx - 90} y={-6} width={180} height={22} fill={dk(V3.wall, 0.42)} />
          <rect x={WIDTH * fx - 72} y={16} width={144} height={7} fill={V3.window} opacity={0.95} />
        </g>
      ))}
      <path d={`M ${WIDTH * 0.5} 30 L ${WIDTH * 0.5 - 560} ${ROOM_BACK + 90} L ${WIDTH * 0.5 + 560} ${ROOM_BACK + 90} Z`} fill={lt(V3.wall, 0.3)} opacity={0.22} />

      {/* rows of bidder desks receding */}
      {Array.from({ length: deskRows }).map((_, r) => {
        const t = r / deskRows;
        const y = ROOM_BACK + 44 + t * t * (HEIGHT - ROOM_BACK) * 1.15;
        const depth = 1 - t * 0.8;
        const n = 5 + r;
        return (
          <g key={r}>
            {Array.from({ length: n }).map((__, c) => {
              const x = WIDTH * (0.5 + ((c - (n - 1) / 2) / n) * (0.5 + t * 0.7));
              const w = 128 * depth;
              const h = 48 * depth;
              const lit = (Math.floor(frame / 6) + r * 3 + c * 5) % 4 < 2;
              return (
                <g key={c} transform={`translate(${x} ${y})`}>
                  <path d={`M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2 - 8} ${h * 0.5} L ${-w / 2 + 8} ${h * 0.5} Z`} fill={dk(V3.walk, 0.34)} />
                  <rect x={-w * 0.3} y={-h} width={w * 0.6} height={h * 0.82} rx={3} fill={V3.ink} />
                  <rect x={-w * 0.26} y={-h + h * 0.1} width={w * 0.52} height={h * 0.54} fill={lit ? V3.accentDim : "#2f6b6a"} opacity={0.95} />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

// ── ControlRoom — for data / document beats (charts render on the back wall) ──

export const ControlRoom: React.FC<{ tone?: string }> = ({ tone = "#A9A398" }) => {
  const id = rid();
  const board = { x: WIDTH * 0.14, y: HEIGHT * 0.07, w: WIDTH * 0.72, h: ROOM_BACK * 0.7 };
  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lt(tone, 0.2)} />
          <stop offset="100%" stopColor={dk(tone, 0.08)} />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dk(tone, 0.28)} />
          <stop offset="100%" stopColor={dk(tone, 0.12)} />
        </linearGradient>
      </defs>
      {/* back wall */}
      <rect x={0} y={0} width={WIDTH} height={ROOM_BACK} fill={`url(#${id}w)`} />
      {/* side walls */}
      <path d={`M 0 -10 L ${WIDTH * 0.11} ${HEIGHT * 0.05} L ${WIDTH * 0.11} ${ROOM_BACK + HEIGHT * 0.04} L 0 ${ROOM_BACK + HEIGHT * 0.15} Z`} fill={dk(tone, 0.16)} />
      <path d={`M ${WIDTH} -10 L ${WIDTH * 0.89} ${HEIGHT * 0.05} L ${WIDTH * 0.89} ${ROOM_BACK + HEIGHT * 0.04} L ${WIDTH} ${ROOM_BACK + HEIGHT * 0.15} Z`} fill={dk(tone, 0.16)} />
      {/* floor */}
      <path d={`M 0 ${ROOM_BACK + HEIGHT * 0.15} L ${WIDTH * 0.11} ${ROOM_BACK + HEIGHT * 0.04} L ${WIDTH * 0.89} ${ROOM_BACK + HEIGHT * 0.04} L ${WIDTH} ${ROOM_BACK + HEIGHT * 0.15} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`} fill={`url(#${id}f)`} />
      <rect x={0} y={ROOM_BACK - 8} width={WIDTH} height={12} fill={dk(tone, 0.24)} />
      {/* ceiling light strips */}
      {[0.24, 0.5, 0.76].map((fx, i) => (
        <g key={i}>
          <rect x={WIDTH * fx - 110} y={-6} width={220} height={18} fill={dk(tone, 0.24)} />
          <rect x={WIDTH * fx - 92} y={12} width={184} height={6} fill={V3.window} opacity={0.95} />
        </g>
      ))}
      {/* the big dark screen on the light wall */}
      <rect x={board.x - 16} y={board.y - 16} width={board.w + 32} height={board.h + 32} rx={12} fill={dk(tone, 0.34)} />
      <rect x={board.x} y={board.y} width={board.w} height={board.h} rx={8} fill="#171a20" />
      <rect x={board.x} y={board.y} width={board.w} height={board.h} rx={8} fill="none" stroke={dk(tone, 0.4)} strokeWidth={3} />
      {/* operator consoles in the foreground */}
      {[0.22, 0.78].map((fx, i) => (
        <g key={i}>
          <path d={`M ${WIDTH * fx - 160} ${HEIGHT - 34} L ${WIDTH * fx + 160} ${HEIGHT - 34} L ${WIDTH * fx + 118} ${HEIGHT + 40} L ${WIDTH * fx - 118} ${HEIGHT + 40} Z`} fill={dk(tone, 0.34)} />
          <path d={`M ${WIDTH * fx - 160} ${HEIGHT - 34} L ${WIDTH * fx + 160} ${HEIGHT - 34} L ${WIDTH * fx + 156} ${HEIGHT - 24} L ${WIDTH * fx - 156} ${HEIGHT - 24} Z`} fill={lt(tone, 0.08)} />
          <rect x={WIDTH * fx - 66} y={HEIGHT - 88} width={132} height={56} rx={4} fill="#171a20" />
          <rect x={WIDTH * fx - 56} y={HEIGHT - 80} width={112} height={40} fill={i ? "#2f6b6a" : V3.accentDim} opacity={0.9} />
        </g>
      ))}
    </svg>
  );
};

/** The rect of the ControlRoom screen — beats render their content here. */
export const BOARD = {
  x: Math.round(WIDTH * 0.14 + 44),
  y: Math.round(HEIGHT * 0.07 + 38),
  w: Math.round(WIDTH * 0.72 - 88),
  h: Math.round(ROOM_BACK * 0.7 - 76),
};
