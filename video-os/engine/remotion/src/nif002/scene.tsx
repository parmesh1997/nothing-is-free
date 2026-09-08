import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT, HEIGHT, WIDTH, shade, tint } from "../tokens";
import { EASE } from "../parts/motion";
import type { useStage } from "./stage";

type Stage = ReturnType<typeof useStage>;

/**
 * scene.tsx — NIF002's occupancy backbone.
 *
 * Flat cream + line art scores ~4% ink on its own; the occupancy law wants ≥22%
 * ink and ≥35% in the bottom third, every body frame (§2.2). Rather than lean on
 * one bare grey slab every beat (the creator's standing note), these give each
 * beat a real, varied surface + an upper mass to compose against — a room, not a
 * rectangle. Every beat drops a <Floor> and usually a <Backboard> or a big
 * filled foreground. All follow the beat's own <useStage> so they disperse with it.
 */

// ─────────────────────────────────────────────────────────────────────────────

/** A surface the scene sits on — desk / counter / floor. Full width, low. */
export const Floor: React.FC<{
  stage: Stage;
  at?: number;
  /** Fraction of frame height the surface occupies from the bottom. */
  heightFraction?: number;
  tone?: string;
  kind?: "desk" | "floor" | "slab";
}> = ({ stage, at = 0, heightFraction = 0.24, tone = COLOR.grey, kind = "desk" }) => {
  const frame = useCurrentFrame();
  const top = Math.round(HEIGHT * (1 - heightFraction));
  const inn = interpolate(frame, [at, at + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const y = (1 - inn) * 120 + stage.flyY(frame, 1, 200);

  return (
    <div style={{ position: "absolute", left: 0, top, width: WIDTH, height: HEIGHT - top, opacity: Math.min(1, inn) * stage.exit(frame), translate: `0px ${y}px` }}>
      <div style={{ position: "absolute", inset: 0, background: shade(tone, 0.18) }} />
      {kind === "desk" && (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: 14, background: tint(tone, 0.16) }} />
          <div style={{ position: "absolute", left: 0, top: 14, width: WIDTH, height: 4, background: shade(tone, 0.34) }} />
        </>
      )}
      {kind === "floor" && <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: 3, background: shade(tone, 0.32) }} />}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** A large faint panel behind the content — upper-third ink mass that doesn't
 *  compete. Studio backdrop / pinboard. */
export const Backboard: React.FC<{
  stage: Stage;
  at?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  tone?: string;
  label?: string;
}> = ({ stage, at = 0, x = WIDTH * 0.1, y = HEIGHT * 0.07, w = WIDTH * 0.8, h = HEIGHT * 0.6, tone = COLOR.paperShade, label }) => {
  const frame = useCurrentFrame();
  const inn = interpolate(frame, [at, at + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  if (inn <= 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: shade(tone, 0.05),
        border: `3px solid ${COLOR.ink}`,
        opacity: Math.min(1, inn) * stage.exit(frame),
        scale: String(0.97 + 0.03 * Math.min(1, inn)),
        transformOrigin: "50% 60%",
      }}
    >
      {label && (
        <div style={{ position: "absolute", left: 26, top: 18, fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.18em", color: COLOR.grey }}>{label}</div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** A heavy title slab — big Bebas on ink or orange. Carries a lot of ink; use
 *  for the opening statement of a beat. */
export const TitleSlab: React.FC<{
  lines: string[];
  at: number;
  outAt: number;
  y?: number;
  variant?: "ink" | "orange";
}> = ({ lines, at, outAt, y = HEIGHT * 0.13, variant = "ink" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 12, outAt, outAt + 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        padding: "18px 90px 18px 120px",
        background: variant === "ink" ? COLOR.ink : COLOR.orange,
        opacity: t,
        clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`,
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: FONT.hero, fontSize: 74, lineHeight: 0.98, letterSpacing: "0.015em", color: COLOR.cardWhite }}>
          {l}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** A framed stat block — big filled number on an ink/orange ground with a label.
 *  A dense, self-contained occupancy unit. */
export const StatCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  at: number;
  stage: Stage;
  value: React.ReactNode;
  label: string;
  variant?: "ink" | "orange" | "card";
}> = ({ x, y, w = 520, at, stage, value, label, variant = "ink" }) => {
  const frame = useCurrentFrame();
  const inn = interpolate(frame, [at, at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  if (inn <= 0.01) return null;
  const bg = variant === "ink" ? COLOR.ink : variant === "orange" ? COLOR.orange : COLOR.cardWhite;
  const fg = variant === "card" ? COLOR.ink : COLOR.cardWhite;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "26px 34px",
        background: bg,
        border: variant === "card" ? `3px solid ${COLOR.ink}` : "none",
        opacity: Math.min(1, inn) * stage.exit(frame),
        translate: `0px ${(1 - Math.min(1, inn)) * 20}px`,
      }}
    >
      <div style={{ fontFamily: FONT.hero, fontSize: 128, lineHeight: 0.92, color: fg, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase", color: variant === "card" ? COLOR.grey : COLOR.cardWhite, opacity: 0.86, marginTop: 8 }}>{label}</div>
    </div>
  );
};
