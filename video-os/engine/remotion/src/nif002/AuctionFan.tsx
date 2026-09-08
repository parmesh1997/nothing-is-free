import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT } from "../tokens";
import { EASE, springIn } from "../parts/motion";
import { useVideoConfig } from "remotion";

/**
 * AuctionFan — NIF002's signature visual (§14.2). The ad exchange fans a bid
 * request out to N buyers; a sweep clock runs; losers grey out; optionally one
 * winner stays lit and the losers keep a copy of the profile.
 *
 * One <svg>, N tiles drawn inline (N can be 60–160). Modes:
 *   layout "ring"  — full circle around the origin        (B01, B26)
 *   layout "arc"   — a wide fan                            (B07, B19)
 *   outcome "sweep"   — a 100ms clock sweep greys tiles    (B07)
 *   outcome "harvest" — all stay lit, each spawns a card   (B19)
 *   outcome "winner"  — one tile wins, rest dim            (B11)
 *   outcome "none"    — tiles just light and hold          (B01, B26)
 *
 * All frames are LOCAL to the beat.
 */
export const AuctionFan: React.FC<{
  originX: number;
  originY: number;
  count?: number;
  radius?: number;
  /** Angular spread in degrees. 360 = ring. Centred on straight up. */
  spreadDeg?: number;
  layout?: "ring" | "arc";
  start?: number;
  /** Frames for the whole fan-out wave. */
  fanFrames?: number;
  outcome?: "none" | "sweep" | "harvest" | "winner";
  winnerIndex?: number;
  /** Frame the sweep begins (outcome "sweep"). */
  sweepStart?: number;
  sweepFrames?: number;
  /** Frame the losers each spawn a mini card (outcome "harvest"). */
  harvestAt?: number;
  clockLabel?: string;
  tileScale?: number;
  showNode?: boolean;
  nodeLabel?: string;
}> = ({
  originX,
  originY,
  count = 120,
  radius = 460,
  spreadDeg = 150,
  layout = "arc",
  start = 0,
  fanFrames = 60,
  outcome = "none",
  winnerIndex,
  sweepStart,
  sweepFrames = 30,
  harvestAt,
  clockLabel = "100 ms",
  tileScale = 1,
  showNode = true,
  nodeLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tw = 46 * tileScale;
  const th = 28 * tileScale;

  const full = layout === "ring" ? 360 : spreadDeg;
  const a0 = -90 - full / 2;

  const tiles = Array.from({ length: count }, (_, i) => {
    const frac = count === 1 ? 0.5 : i / (count - 1);
    const ang = layout === "ring" ? (i / count) * 360 - 90 : a0 + frac * full;
    const rad = (ang * Math.PI) / 180;
    // ring: a wave sweeps once around the circle. arc: opens outward from centre.
    const tStart =
      layout === "ring"
        ? start + (i / count) * fanFrames * 0.55 + (i % 5) * 1.5
        : start + (Math.abs(ang - -90) / (full / 2 || 1)) * (fanFrames * 0.7);
    return {
      i,
      x: originX + Math.cos(rad) * radius,
      y: originY + Math.sin(rad) * radius,
      ang,
      tStart,
    };
  });

  const sweepS = sweepStart ?? start + fanFrames + 10;
  const sweepT =
    outcome === "sweep"
      ? interpolate(frame, [sweepS, sweepS + sweepFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.inOut,
        })
      : 0;
  const sweepAng = a0 + sweepT * full;

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {/* connection lines */}
      {tiles.map((t) => {
        const p = interpolate(frame, [t.tStart, t.tStart + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.inOut,
        });
        if (p <= 0) return null;
        return (
          <line
            key={`l${t.i}`}
            x1={originX}
            y1={originY}
            x2={originX + (t.x - originX) * p}
            y2={originY + (t.y - originY) * p}
            stroke={COLOR.grid}
            strokeWidth={1.5}
          />
        );
      })}

      {/* sweep wedge */}
      {outcome === "sweep" && sweepT > 0 && sweepT < 1 && (
        <path
          d={sweepWedge(originX, originY, radius * 1.05, a0, sweepAng)}
          fill={COLOR.orange}
          opacity={0.14}
        />
      )}

      {/* tiles */}
      {tiles.map((t) => {
        const pop = springIn({ frame, fps, delay: t.tStart + 6, durationInFrames: 12 });
        if (pop <= 0.01) return null;

        const isWinner = winnerIndex === t.i;
        const passedBySweep = outcome === "sweep" && t.ang <= sweepAng && !isWinner;
        const greyed =
          (outcome === "sweep" && passedBySweep) ||
          (outcome === "winner" && !isWinner);
        const lit = isWinner || (!greyed && outcome !== "winner");

        const fill = greyed ? COLOR.grey : COLOR.cardWhite;
        const stroke = isWinner ? COLOR.orange : COLOR.outline;
        const opacity = greyed ? 0.62 : 1;

        // harvest: a mini profile card drifts down from the tile
        const harvS = harvestAt ?? sweepS + 20;
        const harv =
          outcome === "harvest" && !isWinner
            ? springIn({ frame, fps, delay: harvS + (t.i % 12) * 3, durationInFrames: 18 })
            : 0;

        return (
          <g key={`t${t.i}`} opacity={pop * opacity} transform={`translate(${t.x - tw / 2} ${t.y - th / 2})`}>
            <rect width={tw} height={th} rx={4} fill={fill} stroke={stroke} strokeWidth={isWinner ? 3.5 : 3} />
            {!greyed && <rect x={0} y={0} width={tw} height={th * 0.34} rx={4} fill={COLOR.ink} />}
            <rect x={tw * 0.14} y={th * 0.5} width={tw * 0.5} height={th * 0.16} fill={greyed ? COLOR.cardWhite : COLOR.ink} opacity={greyed ? 0.5 : 0.8} />
            <rect x={tw * 0.14} y={th * 0.74} width={tw * 0.34} height={th * 0.14} fill={greyed ? COLOR.cardWhite : COLOR.ink} opacity={greyed ? 0.4 : 0.6} />
            {lit && (
              <circle cx={tw * 0.82} cy={th * 0.5} r={th * 0.18} fill={COLOR.orange} opacity={isWinner ? 1 : 0.9} />
            )}
            {harv > 0 && (
              <g transform={`translate(${-tw * 0.1} ${th + 10 + harv * 26})`} opacity={harv * 0.9}>
                <rect width={tw * 1.2} height={th * 1.5} rx={3} fill={COLOR.cardWhite} stroke={COLOR.outline} strokeWidth={1.4} />
                <rect x={4} y={5} width={tw * 0.8} height={3} fill={COLOR.grey} />
                <rect x={4} y={12} width={tw * 0.55} height={3} fill={COLOR.grey} />
                <rect x={4} y={19} width={tw * 0.68} height={3} fill={COLOR.grey} />
              </g>
            )}
          </g>
        );
      })}

      {/* the exchange node */}
      {showNode && (
        <g>
          <circle cx={originX} cy={originY} r={34} fill={COLOR.ink} stroke={COLOR.outline} strokeWidth={2} />
          <circle cx={originX} cy={originY} r={14} fill={COLOR.orange} />
          {nodeLabel && (
            <text x={originX} y={originY + 62} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} fill={COLOR.grey}>
              {nodeLabel}
            </text>
          )}
        </g>
      )}

      {/* the 100ms clock dial */}
      {outcome === "sweep" && frame >= sweepS - 6 && (
        <g transform={`translate(${originX} ${originY})`}>
          <circle r={radius * 0.5} fill="none" stroke={COLOR.grid} strokeWidth={2} strokeDasharray="4 8" />
          <line
            x1={0}
            y1={0}
            x2={Math.cos((sweepAng * Math.PI) / 180) * radius * 0.5}
            y2={Math.sin((sweepAng * Math.PI) / 180) * radius * 0.5}
            stroke={COLOR.orange}
            strokeWidth={3}
          />
          <text x={0} y={radius * 0.5 + 34} textAnchor="middle" fontFamily={FONT.mono} fontSize={22} fill={COLOR.ink}>
            {clockLabel}
          </text>
        </g>
      )}
    </svg>
  );
};

const sweepWedge = (cx: number, cy: number, r: number, aFrom: number, aTo: number) => {
  const p0 = polar(cx, cy, r, aFrom);
  const p1 = polar(cx, cy, r, aTo);
  const large = aTo - aFrom > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y} Z`;
};
const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + Math.cos((deg * Math.PI) / 180) * r,
  y: cy + Math.sin((deg * Math.PI) / 180) * r,
});
