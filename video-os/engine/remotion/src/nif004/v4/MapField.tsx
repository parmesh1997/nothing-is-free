import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, HEIGHT, SUPPORT, WIDTH, shade, tint } from "../../tokens";

/**
 * MapField.tsx — NIF004's spine asset (runbook §22.8 quota).
 *
 * The cream + line-art map bed: roads as ink strokes on the locked field, a
 * drawable route bezier, a blue location dot with a pulsing transmitter, and a
 * dotted trail that keeps being laid behind the dot even after it stops.
 *
 * NOT a MapLibre render (§20) — house-style flat line art, so it sits in the
 * same cream/ink/one-orange world as every other beat. Used in
 * B00/B02/B07/B13/B16/B18/B19/B20/B21/B23/B25.
 *
 *   <MapField routeAt={0} driveTo={0.8} pin={{x,y}} trail />
 */

const ROADS: string[] = [
  // a loose irregular grid + a couple of diagonals — reads as "a place", not paper grid
  "M -40 300 L 2000 260",
  "M -40 560 L 2000 600",
  "M -40 820 L 2000 780",
  "M 240 -40 L 300 1200",
  "M 640 -40 L 700 1200",
  "M 1080 -40 L 1040 1200",
  "M 1500 -40 L 1560 1200",
  "M 120 1120 L 900 200",
  "M 1900 980 L 1180 120",
];

/** a gentle S-curve route across the frame; `p` 0..1 = how much is drawn. */
const ROUTE_D = "M 210 940 C 470 760 430 520 700 470 C 980 418 980 250 1320 210 C 1520 186 1660 250 1780 200";
const ROUTE_LEN = 2100;

export const MapField: React.FC<{
  /** frame the roads fade in. */
  at?: number;
  /** frame the route starts drawing. */
  routeAt?: number;
  /** frames the route draw takes. */
  routeDur?: number;
  /** 0..1 — where the blue dot sits along the route. drives the trail. */
  progress?: number;
  /** keep laying the dotted trail even where progress has passed (B18/B19). */
  trail?: boolean;
  /** dim everything (a beat that moves past the map). */
  dim?: number;
  /** ink tone (Dark Law). */
  tone?: "paper" | "ink";
}> = ({ at = 0, routeAt = 9999, routeDur = 40, progress = 0, trail = false, dim = 1, tone = "paper" }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [at, at + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const draw = interpolate(frame, [routeAt, routeAt + routeDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ink = tone === "ink";
  const road = ink ? "rgba(246,242,231,0.14)" : shade(COLOR.grid, 0.05);
  const roadThick = ink ? "rgba(246,242,231,0.22)" : COLOR.ground;

  // dot position along the route
  const dotP = Math.max(0, Math.min(1, progress));
  const [dx, dy] = pointOnRoute(dotP);
  const moving = frame % 90 < 60 && dotP < 0.999;
  const pulse = 1 + Math.sin(frame / 7) * 0.4;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: reveal * dim }}>
      {/* roads */}
      {ROADS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={i % 3 === 0 ? roadThick : road} strokeWidth={i % 3 === 0 ? 10 : 6} strokeLinecap="round" />
      ))}
      {/* a couple of "blocks" tinted, very faint — depth */}
      <rect x={320} y={300} width={300} height={250} fill={ink ? "rgba(246,242,231,0.03)" : tint(SUPPORT.forest, 0.82)} opacity={0.5} />
      <rect x={1100} y={600} width={380} height={180} fill={ink ? "rgba(246,242,231,0.03)" : tint(SUPPORT.mustard, 0.8)} opacity={0.45} />

      {/* the route */}
      {draw > 0 && (
        <path
          d={ROUTE_D}
          fill="none"
          stroke={COLOR.orange}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={ROUTE_LEN}
          strokeDashoffset={ROUTE_LEN * (1 - draw)}
          opacity={0.9}
        />
      )}

      {/* the dotted trail behind the dot */}
      {trail && dotP > 0.01 && (
        <path
          d={ROUTE_D}
          fill="none"
          stroke={ink ? "rgba(246,242,231,0.5)" : COLOR.grey}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray="2 16"
          strokeDashoffset={ROUTE_LEN * (1 - Math.min(1, dotP + 0.12))}
          pathLength={ROUTE_LEN}
        />
      )}

      {/* the blue location dot + transmitter */}
      {draw > 0.05 && (
        <g transform={`translate(${dx} ${dy})`}>
          <circle r={26 * pulse} fill="none" stroke={SUPPORT.sky} strokeWidth={3} opacity={0.5 / pulse} />
          <circle r={16} fill={SUPPORT.sky} stroke={ink ? COLOR.paper : COLOR.ink} strokeWidth={4} />
          {moving && <circle r={40} fill="none" stroke={SUPPORT.sky} strokeWidth={2} opacity={0.3} />}
        </g>
      )}
    </svg>
  );
};

// crude bezier sampler for the fixed route (two cubic segments chained)
function pointOnRoute(t: number): [number, number] {
  const segs: [number, number][][] = [
    [[210, 940], [470, 760], [430, 520], [700, 470]],
    [[700, 470], [980, 418], [980, 250], [1320, 210]],
    [[1320, 210], [1520, 186], [1660, 250], [1780, 200]],
  ];
  const n = segs.length;
  const u = Math.min(0.999, Math.max(0, t)) * n;
  const i = Math.floor(u);
  const lt = u - i;
  const [p0, p1, p2, p3] = segs[i];
  const b = (a: number, bb: number, c: number, d: number) => {
    const m = 1 - lt;
    return m * m * m * a + 3 * m * m * lt * bb + 3 * m * lt * lt * c + lt * lt * lt * d;
  };
  return [b(p0[0], p1[0], p2[0], p3[0]), b(p0[1], p1[1], p2[1], p3[1])];
}

/** the POV "inside the blue line" cold-open shot — a first-person drive down a
 *  road that recedes to a vanishing point, the blue nav lane laid on top, line-
 *  art buildings sliding past, a low dashboard + wheel + two hands (the car
 *  prop-location, runbook §22.8). The nav lane re-draws to bend right past one
 *  promoted "sponsored" pin. */
export const DrivePOV: React.FC<{ recalcAt?: number; pinAt?: number }> = ({ recalcAt = 60, pinAt = 40 }) => {
  const frame = useCurrentFrame();
  const bend = interpolate(frame, [recalcAt, recalcAt + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });
  const pinIn = interpolate(frame, [pinAt, pinAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const horizonY = 348;
  const vpX = WIDTH / 2 + bend * 150;       // vanishing point drifts right on recalc
  const roadBottom = HEIGHT - 150;          // road meets the dashboard here
  const halfBottom = 560;                   // half-width of the road at the bottom
  const halfTop = 26;                       // half-width at the vanishing point

  // perspective centre-lane dashes — spaced by depth, scrolling toward the camera
  const dashes = [];
  const N = 9;
  for (let i = 0; i < N; i++) {
    const phase = ((frame / 26) + i) % N;          // 0..N, wraps
    const d = 1 - phase / N;                         // 1 = far, 0 = near
    const persp = Math.pow(d, 2.1);                  // non-linear = depth
    const y = horizonY + (roadBottom - horizonY) * (1 - persp);
    const cx = WIDTH / 2 + (vpX - WIDTH / 2) * persp; // centreline: WIDTH/2 near → vpX far
    const w = halfTop + (halfBottom - halfTop) * (1 - persp);
    const len = 8 + 46 * (1 - persp);
    dashes.push({ y, cx, w: Math.max(3, w * 0.05), len, o: 0.3 + 0.55 * (1 - persp) });
  }

  const roadPath =
    `M ${WIDTH / 2 - halfBottom} ${roadBottom} ` +
    `L ${vpX - halfTop} ${horizonY} L ${vpX + halfTop} ${horizonY} ` +
    `L ${WIDTH / 2 + halfBottom} ${roadBottom} Z`;
  const navHalfBottom = 300, navHalfTop = 14;
  const navPath =
    `M ${WIDTH / 2 - navHalfBottom} ${roadBottom} ` +
    `L ${vpX - navHalfTop} ${horizonY + 6} L ${vpX + navHalfTop} ${horizonY + 6} ` +
    `L ${WIDTH / 2 + navHalfBottom} ${roadBottom} Z`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {/* warm sky above the horizon */}
      <rect x={0} y={0} width={WIDTH} height={horizonY + 10} fill={tint(SUPPORT.mustard, 0.86)} />
      <line x1={0} y1={horizonY} x2={WIDTH} y2={horizonY} stroke={COLOR.ink} strokeOpacity={0.14} strokeWidth={3} />

      {/* line-art buildings flanking the road, receding to the vanishing point */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const side = i % 2 ? 1 : -1;
        const rank = Math.floor(i / 2);                          // 0 near … 2 far
        const scroll = ((frame / 30) * 0.34 + rank * 0.4) % 1.2;  // approaches
        const d = 1 - Math.min(1, scroll / 1.2);
        const persp = Math.pow(d, 1.9);
        const y = horizonY + (roadBottom - horizonY) * (1 - persp);
        const roadHalf = halfTop + (halfBottom - halfTop) * (1 - persp);
        const bw = 120 + 240 * (1 - persp);
        const bh = (170 + 360 * (1 - persp));
        const x = (side < 0 ? vpX - roadHalf - bw : vpX + roadHalf);
        const o = 0.05 + 0.16 * persp;
        if (y < horizonY + 8) return null;
        const winW = Math.max(6, bw * 0.18), winH = Math.max(8, bh * 0.08);
        return (
          <g key={i} opacity={o}>
            <rect x={x} y={y - bh} width={bw} height={bh} fill={COLOR.ink} />
            <path d={`M ${x} ${y - bh} L ${x + bw / 2} ${y - bh - 22 - 30 * (1 - persp)} L ${x + bw} ${y - bh}`} fill={COLOR.ink} />
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <rect key={k} x={x + 16 + (k % 2) * (bw - winW - 32)} y={y - bh + 24 + Math.floor(k / 2) * (bh / 3.4)} width={winW} height={winH} fill={COLOR.paper} />
            ))}
          </g>
        );
      })}

      {/* the road surface */}
      <path d={roadPath} fill={shade(COLOR.grid, 0.08)} stroke={COLOR.ink} strokeOpacity={0.18} strokeWidth={3} />
      {/* the blue navigation lane laid on top */}
      <path d={navPath} fill={SUPPORT.sky} opacity={0.32} />
      <path d={navPath} fill="none" stroke={SUPPORT.sky} strokeWidth={4} opacity={0.7} />
      {/* perspective centre-lane dashes */}
      {dashes.map((d, i) => (
        <rect key={i} x={d.cx - d.w} y={d.y} width={d.w * 2} height={d.len} rx={2} fill={COLOR.paper} opacity={d.o} />
      ))}

      {/* the promoted "sponsored" pin the nav bends toward */}
      {pinIn > 0 && (
        <g transform={`translate(${WIDTH / 2 + 230} ${300}) scale(${0.55 + pinIn * 0.5})`} opacity={pinIn}>
          <ellipse cx={0} cy={64} rx={30} ry={9} fill={COLOR.ink} opacity={0.18} />
          <path d="M 0 58 C -54 -6 -54 -84 0 -84 C 54 -84 54 -6 0 58 Z" fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={6} />
          <circle cx={0} cy={-48} r={17} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={5} />
        </g>
      )}

      {/* low dashboard + steering wheel + two hands */}
      <path d={`M -20 ${HEIGHT} L -20 ${HEIGHT - 132} Q ${WIDTH / 2} ${HEIGHT - 210} ${WIDTH + 20} ${HEIGHT - 132} L ${WIDTH + 20} ${HEIGHT} Z`} fill={shade(SUPPORT.clay, 0.34)} stroke={COLOR.ink} strokeWidth={5} />
      <path d={`M -20 ${HEIGHT - 132} Q ${WIDTH / 2} ${HEIGHT - 210} ${WIDTH + 20} ${HEIGHT - 132}`} fill="none" stroke={COLOR.paper} strokeOpacity={0.25} strokeWidth={3} />
      <g transform={`translate(${WIDTH / 2 + bend * 40} ${HEIGHT - 40}) rotate(${bend * 12})`}>
        <path d="M -260 0 a 260 128 0 0 1 520 0" fill="none" stroke={COLOR.ink} strokeWidth={18} strokeLinecap="round" />
        <line x1={-150} y1={-56} x2={150} y2={-56} stroke={COLOR.ink} strokeWidth={12} strokeLinecap="round" />
        {[-1, 1].map((s) => (
          <g key={s} transform={`translate(${s * 176} -44)`}>
            <path d="M -22 44 Q -30 -6 6 -12 Q 34 -16 38 16 L 38 44 Z" fill={tint(COLOR.tan, 0.06)} stroke={COLOR.ink} strokeWidth={4} />
          </g>
        ))}
      </g>
    </svg>
  );
};
