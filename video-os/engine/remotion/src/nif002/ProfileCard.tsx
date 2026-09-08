import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT } from "../tokens";
import { EASE, springIn } from "../parts/motion";

/**
 * ProfileCard — NIF002 (B09 ×2). A card describing "you" to an advertiser, with
 * a vertical price meter that climbs as fields fill. A sparse card ("someone /
 * somewhere", meter low) next to a rich one (fields stack, meter maxes).
 *
 * `variant:"mini"` is a small redacted card (the AuctionFan bakes its own mini,
 * so this is mostly the full variant).
 */
export const ProfileCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  fields: string[];
  /** meter fill 0..1 at 0 fields and at all fields */
  meterFrom: number;
  meterTo: number;
  meterUnit?: string;
  at: number;
  perFieldFrames?: number;
  accent?: boolean;
}> = ({ x, y, w = 460, h = 560, title, fields, meterFrom, meterTo, meterUnit = "¢", at, perFieldFrames = 70, accent = false }) => {
  const frame = useCurrentFrame();
  const frameIn = springIn({ frame, fps: 30, delay: at, durationInFrames: 16 });
  if (frameIn <= 0.01) return null;

  const shown = Math.max(0, Math.min(fields.length, Math.floor((frame - at - 20) / perFieldFrames) + 1));
  const meterFrac = interpolate(shown, [0, fields.length], [meterFrom, meterTo], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const meterValue = interpolate(meterFrac, [0, 1], [0.1, 2.0]);

  const meterW = 54;
  const bodyW = w - meterW - 24;

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: Math.min(1, frameIn), scale: String(0.96 + 0.04 * Math.min(1, frameIn)), transformOrigin: "50% 40%" }}>
      <div style={{ position: "absolute", inset: 0, background: COLOR.cardWhite, border: `3px solid ${COLOR.ink}` }} />

      {/* header */}
      <div style={{ position: "absolute", left: 0, top: 0, width: bodyW + 24, height: 54, background: COLOR.ink, color: COLOR.cardWhite, fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.08em", display: "flex", alignItems: "center", paddingLeft: 20 }}>
        {title}
      </div>

      {/* fields */}
      <div style={{ position: "absolute", left: 20, top: 76, width: bodyW - 20 }}>
        {fields.map((f, i) => {
          const fon = interpolate(frame, [at + 20 + i * perFieldFrames, at + 20 + i * perFieldFrames + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
          if (fon <= 0.01) return null;
          return (
            <div key={i} style={{ opacity: Math.min(1, fon), translate: `${(1 - Math.min(1, fon)) * -12}px 0px`, fontFamily: FONT.sans, fontWeight: 600, fontSize: 30, lineHeight: 1.5, color: COLOR.ink, borderBottom: `1.5px solid ${COLOR.grid}`, padding: "8px 0" }}>
              {f}
            </div>
          );
        })}
      </div>

      {/* price meter */}
      <div style={{ position: "absolute", right: 14, top: 68, width: meterW, bottom: 56 }}>
        <div style={{ position: "absolute", inset: 0, border: `2.5px solid ${COLOR.ink}`, background: COLOR.paperShade }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: `${meterFrac * 100}%`,
            background: accent && meterFrac > 0.8 ? COLOR.orange : COLOR.ink,
          }}
        />
      </div>
      <div style={{ position: "absolute", right: 8, bottom: 16, width: meterW + 12, textAlign: "center", fontFamily: FONT.hero, fontSize: 30, color: accent && meterFrac > 0.8 ? COLOR.orange : COLOR.ink }}>
        {meterValue.toFixed(meterValue < 1 ? 1 : 1)}{meterUnit}
      </div>
    </div>
  );
};
