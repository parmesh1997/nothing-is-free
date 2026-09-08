import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, HEIGHT, WIDTH } from "../../tokens";
import { Bloom } from "../../parts/Bloom";
import { DUR, OUT } from "./language";

/**
 * spark.tsx — small "the thing just did something" polish (creator 2026-09-04:
 * "when you are doing something, add a light on and a glow on it … whatever
 * looks good"). Two pieces, used liberally:
 *
 *   <Spark>     a one-shot orange glow flash where an element lands/activates.
 *   <HoldScan>  a soft light bar that sweeps a held card every few seconds so a
 *               long hold reads as "being read", never frozen.
 *
 * Both are pure radial/linear gradients — zero per-frame filter cost — and both
 * sit BEHIND / OVER their target without touching layout.
 */

/** a quick glow flash at (x,y) when `at` hits — ~0.8s in-hold-out. */
export const Spark: React.FC<{ at: number; x: number | string; y: number | string; r?: number; intensity?: number; color?: string }> = ({
  at,
  x,
  y,
  r = 200,
  intensity = 0.5,
  color = COLOR.orange,
}) => <Bloom window={[at - 2, at + 6, at + 16, at + 30]} radius={r} x={x} y={y} intensity={intensity} color={color} />;

/**
 * HoldScan — a diagonal light bar sweeps across a rectangle every `period`
 * frames while `from → to` is on screen. For a data card / ledger / node that
 * is held for several seconds while the VO talks over it.
 */
export const HoldScan: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  from: number;
  to: number;
  period?: number;
  radius?: number;
}> = ({ x, y, w, h, from, to, period = 150, radius = 14 }) => {
  const frame = useCurrentFrame();
  if (frame < from + 20 || frame > to) return null;
  const local = (frame - from - 20) % period;
  const sweep = local / 90; // the bar crosses over ~3s, then rests
  if (sweep >= 1) return null;
  const bandX = interpolate(sweep, [0, 1], [-0.3, 1.3], { easing: OUT });
  const fade = interpolate(sweep, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: radius, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -h * 0.6,
          left: `${bandX * 100}%`,
          width: w * 0.34,
          height: h * 2.2,
          transform: "rotate(14deg)",
          background: `linear-gradient(90deg, rgba(246,242,231,0) 0%, rgba(255,255,255,0.42) 50%, rgba(246,242,231,0) 100%)`,
          opacity: fade * 0.9,
        }}
      />
    </div>
  );
};

/** a small pulsing "live" dot + label — for a held mechanism readout. */
export const LivePip: React.FC<{ x: number; y: number; label?: string; at: number }> = ({ x, y, label = "LIVE", at }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + DUR.enter], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0.01) return null;
  const pulse = 0.5 + 0.5 * Math.abs(Math.sin((frame - at) / 14));
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 8, opacity: t, pointerEvents: "none" }}>
      <div style={{ width: 9, height: 9, borderRadius: "50%", background: COLOR.orange, opacity: 0.35 + 0.65 * pulse, boxShadow: `0 0 ${6 + 8 * pulse}px ${COLOR.orange}` }} />
      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, letterSpacing: "0.16em", color: COLOR.grey }}>{label}</span>
    </div>
  );
};

export { WIDTH as SPARK_W, HEIGHT as SPARK_H };
