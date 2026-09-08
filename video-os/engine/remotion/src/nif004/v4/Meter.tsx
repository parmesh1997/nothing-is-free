import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, shade, softShadow, tint } from "../../tokens";
import { SANS } from "../../nif002/v4/fonts4";

/**
 * Meter.tsx — NIF004's throughline asset (runbook §22.8 quota).
 *
 * A ticking dial with a label + a "free bar" that empties, then a running
 * counter. Three of them (APPS / BUSINESSES / YOU) are the episode's spine —
 * they rise out of the phone in B01, recur behind the act boundaries, and all
 * three return in the reversal (B30). In B11 one meter splits into a rack.
 *
 * The "takes space + always moving" mechanic for this episode (§22.8).
 */

type Tone = "paper" | "ink";
const face = (t: Tone) => (t === "ink" ? "#1e1e1e" : COLOR.cardWhite);
const line = (t: Tone) => (t === "ink" ? COLOR.orange : COLOR.ink);
const txt = (t: Tone) => (t === "ink" ? "#F6F2E7" : COLOR.ink);

/** one meter — dial + needle + label + optional emptying free-bar + running $ */
export const Meter: React.FC<{
  at: number;
  x: number;
  y: number;
  label: string;
  /** px radius of the dial. */
  r?: number;
  /** 0..1 — how empty the free allowance is (drains as it runs). */
  drain?: number;
  /** a running dollar figure under the dial. */
  value?: string;
  /** highlight it (the active meter this beat). */
  active?: boolean;
  tone?: Tone;
}> = ({ at, x, y, label, r = 92, drain = 0, value, active = false, tone = "paper" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0.01) return null;
  const spin = ((frame - at) * (active ? 2.6 : 1.4)) % 240;
  const a = (-120 + spin) * (Math.PI / 180);
  const drainW = 1 - Math.min(1, Math.max(0, drain));

  return (
    <div
      style={{
        position: "absolute",
        left: x - r - 20,
        top: y - r - 20,
        width: (r + 20) * 2,
        opacity: Math.min(1, t),
        transform: `scale(${(0.8 + t * 0.2).toFixed(3)})`,
        filter: active ? `drop-shadow(0 0 24px rgba(226,77,40,0.4))` : softShadow(1, 0.2),
        textAlign: "center",
      }}
    >
      <svg width={(r + 20) * 2} height={(r + 20) * 2} style={{ overflow: "visible" }}>
        <g transform={`translate(${r + 20} ${r + 20})`}>
          <circle r={r} fill={face(tone)} stroke={line(tone)} strokeWidth={active ? 7 : 5} />
          {Array.from({ length: 9 }).map((_, i) => {
            const ta = (-120 + i * 30) * (Math.PI / 180);
            return <line key={i} x1={Math.cos(ta) * (r - 16)} y1={Math.sin(ta) * (r - 16)} x2={Math.cos(ta) * (r - 4)} y2={Math.sin(ta) * (r - 4)} stroke={txt(tone)} strokeWidth={3.5} />;
          })}
          <line x1={0} y1={0} x2={Math.cos(a) * (r - 20)} y2={Math.sin(a) * (r - 20)} stroke={COLOR.orange} strokeWidth={6} strokeLinecap="round" />
          <circle r={8} fill={txt(tone)} />
        </g>
      </svg>
      <div style={{ marginTop: -8, fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: "0.06em", textTransform: "uppercase", color: txt(tone) }}>{label}</div>
      {drain > 0 && (
        <div style={{ margin: "8px auto 0", width: r * 1.7, height: 12, border: `3px solid ${line(tone)}`, borderRadius: 7, overflow: "hidden", background: tone === "ink" ? "#000" : COLOR.paper }}>
          <div style={{ width: `${drainW * 100}%`, height: "100%", background: drainW > 0.15 ? COLOR.orange : COLOR.grey, transition: "none" }} />
        </div>
      )}
      {value && <div style={{ marginTop: 6, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.orange }}>{value}</div>}
    </div>
  );
};

/** the three-meter set rising from a phone (B01) / returning (B30). Big and
 *  low so it holds the frame; each dial carries a running $ figure that keeps
 *  ticking (the "if it's a process it keeps running" rule). */
export const ThreeMeters: React.FC<{
  at: number;
  /** which meter is lit (-1 none, 0 apps, 1 businesses, 2 you). */
  active?: number;
  /** compact = the low recurring strip; full = big, centred. */
  mode?: "full" | "strip";
  tone?: Tone;
  values?: [string?, string?, string?];
}> = ({ at, active = -1, mode = "full", tone = "paper", values }) => {
  const frame = useCurrentFrame();
  const labels = ["APPS", "BUSINESSES", "YOU"];
  const y = mode === "full" ? 500 : 980;
  const r = mode === "full" ? 126 : 46;
  const xs = mode === "full" ? [430, 960, 1470] : [430, 960, 1490];
  // a slow running $ per dial when no explicit value is given
  const auto = (i: number) => {
    const t = Math.max(0, frame - at - i * 8);
    const rate = [0.007, 0.019, 0.0012][i];
    return `$${(t * rate).toFixed(2)}`;
  };
  return (
    <>
      {labels.map((l, i) => (
        <Meter
          key={i}
          at={at + i * 8}
          x={xs[i]}
          y={y}
          label={l}
          r={r}
          active={active === i}
          tone={tone}
          value={values ? values[i] : mode === "full" ? auto(i) : undefined}
          drain={active === i ? 0.6 : 0}
        />
      ))}
    </>
  );
};

/** B11 — one big meter splits into a rack of per-call meters, each with its
 *  own draining free-bar. */
export const MeterRack: React.FC<{ at: number; tone?: Tone }> = ({ at, tone = "paper" }) => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [at, at + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kinds = ["MAP LOAD", "ROUTE", "PLACE LOOKUP", "STREET VIEW", "GEOCODE"];
  return (
    <>
      {kinds.map((k, i) => {
        const targetX = 340 + i * 320;
        const x = interpolate(split, [0, 1], [960, targetX]);
        const drain = interpolate(frame, [at + 30 + i * 10, at + 90 + i * 10], [0.1, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <Meter key={k} at={at} x={x} y={430} label={k} r={64} drain={drain} tone={tone} />;
      })}
      {/* a "PLANS" shelf slides in above */}
      {split > 0.6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", gap: 30, opacity: interpolate(frame, [at + 40, at + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {["ESSENTIALS", "PRO", "ENTERPRISE"].map((p) => (
            <div key={p} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, color: COLOR.ink, background: tint(COLOR.grey, 0.6), border: `3px solid ${COLOR.ink}`, borderRadius: 10, padding: "10px 24px" }}>{p}</div>
          ))}
        </div>
      )}
    </>
  );
};

void shade;
