import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, SUPPORT, shade, softShadow, tint } from "../../tokens";

/**
 * TV.tsx — the NIF003 cold-open prop (B00): an OverSimplified television on a
 * low stand, matching the flat-illustration + warm-shadow house style (never
 * a perspective box — a flat front-on set, same drawing convention as every
 * other prop in `locations.tsx`).
 *
 * <TV x y w on glow> — `on` 0..1 drives the screen power-on (a quick flicker
 * to a lit "programme" glow, a moving colour band suggesting motion without
 * drawing an actual show). <PaymentGlyphs> fires small coin glyphs from the
 * screen toward the frame edges — the cold-open's whole visual joke: four
 * payments leave before a single frame of the "free" show has properly
 * loaded.
 */

export const TV: React.FC<{
  x: number;
  y: number;
  w?: number;
  /** 0..1 power state — screen dark→lit. */
  on?: number;
  reveal?: number;
}> = ({ x, y, w = 360, on = 1, reveal = 1 }) => {
  const frame = useCurrentFrame();
  const h = w * 0.62;
  const bodyH = h + w * 0.1;
  const screenPad = w * 0.045;

  // a slow colour drift on the "programme" glow so a held frame never freezes
  const hueShift = Math.sin(frame / 54) * 10;
  const bandX = ((frame % 130) / 130) * w * 1.4 - w * 0.2;

  // flicker: 2 quick pops then settle lit (a TV "waking up")
  const flicker =
    on <= 0
      ? 0
      : Math.min(
          1,
          on *
            (0.55 +
              0.45 * Math.abs(Math.sin(frame * 1.7)) * Math.max(0, 1 - frame / 10) +
              Math.min(1, frame / 6)),
        );

  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    <g opacity={reveal} style={{ filter: softShadow(1, 0.2) }}>
      {/* stand */}
      <rect x={x - w * 0.14} y={y - w * 0.02} width={w * 0.28} height={w * 0.05} rx={4} fill={shade(SUPPORT.clay, 0.1)} stroke={COLOR.ink} strokeWidth={3} />
      <rect x={x - w * 0.03} y={y - w * 0.1} width={w * 0.06} height={w * 0.09} fill={COLOR.ink} />

      {/* cabinet */}
      <rect
        x={x - w / 2}
        y={y - w * 0.1 - bodyH}
        width={w}
        height={bodyH}
        rx={w * 0.05}
        fill={shade(SUPPORT.clay, 0.08)}
        stroke={COLOR.ink}
        strokeWidth={4}
      />

      {/* screen — dark bezel, then the lit/unlit face */}
      <rect
        x={x - w / 2 + screenPad}
        y={y - w * 0.1 - bodyH + screenPad}
        width={w - screenPad * 2}
        height={h - screenPad * 1.2}
        rx={w * 0.02}
        fill={COLOR.ink}
      />
      {flicker > 0.02 && (
        <>
          <defs>
            <clipPath id="tvScreenClip">
              <rect
                x={x - w / 2 + screenPad * 1.6}
                y={y - w * 0.1 - bodyH + screenPad * 1.6}
                width={w - screenPad * 3.2}
                height={h - screenPad * 2.8}
                rx={w * 0.015}
              />
            </clipPath>
          </defs>
          <g clipPath="url(#tvScreenClip)" opacity={flicker}>
            <rect
              x={x - w / 2}
              y={y - w * 0.1 - bodyH}
              width={w}
              height={h}
              fill={tint(SUPPORT.sky, 0.15 + hueShift * 0.01)}
            />
            {/* a moving colour band — "something is playing," never a static lit box */}
            <rect
              x={x - w / 2 + bandX}
              y={y - w * 0.1 - bodyH}
              width={w * 0.4}
              height={h}
              fill={tint(SUPPORT.mustard, 0.2)}
              opacity={0.5}
            />
            <rect
              x={x - w / 2}
              y={y - w * 0.1 - bodyH + h * 0.68}
              width={w}
              height={h * 0.1}
              fill={shade(SUPPORT.sky, 0.1)}
              opacity={0.6}
            />
          </g>
          {/* screen glow spilling onto the wall behind */}
          <ellipse
            cx={x}
            cy={y - w * 0.1 - bodyH * 0.55}
            rx={w * 0.85}
            ry={h * 0.7}
            fill={`rgba(255,244,214,${0.18 * flicker})`}
          />
        </>
      )}

      {/* two little feet under the cabinet corners for a grounded read */}
      {[-1, 1].map((s) => (
        <rect key={s} x={x + s * w * 0.42 - 6} y={y - w * 0.02} width={12} height={w * 0.03} fill={COLOR.ink} />
      ))}
    </g>
    </svg>
  );
};

export type PaymentGlyphSpec = {
  /** local frame the glyph launches. */
  at: number;
  /** launch angle in degrees, 0 = straight up, 90 = right. */
  angle: number;
  label: string;
};

/**
 * PaymentGlyphs — four small orange coin-tokens that fire from the TV toward
 * the frame edges, each carrying a two/three-letter tag for who got paid.
 * This IS the cold-open's whole contradiction, drawn: money already leaving
 * before the "free" show has even properly started (§5.3 cold-open shape).
 */
export const PaymentGlyphs: React.FC<{
  originX: number;
  originY: number;
  specs: PaymentGlyphSpec[];
}> = ({ originX, originY, specs }) => {
  const frame = useCurrentFrame();
  const rad = (d: number) => (d * Math.PI) / 180;
  const travel = 620;

  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {specs.map((g, i) => {
        const t = interpolate(frame, [g.at, g.at + 34], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: (x) => 1 - Math.pow(1 - x, 3),
        });
        if (t <= 0) return null;
        const fadeOut = interpolate(frame, [g.at + 20, g.at + 34], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const dist = travel * t;
        const gx = originX + Math.sin(rad(g.angle)) * dist;
        const gy = originY - Math.cos(rad(g.angle)) * dist * 0.72;
        const scale = interpolate(t, [0, 0.15, 1], [0.3, 1.15, 0.8]);
        // tumbles once during flight, lands right-side-up so the label is
        // always legible at rest (a coin that stays readable, not a spinner).
        const spin = interpolate(t, [0, 0.4, 1], [0, 260, 360]);

        return (
          <g key={i} opacity={fadeOut} transform={`translate(${gx} ${gy})`}>
            {/* a short motion streak back toward the TV — outside the spin so
                it always points the right way */}
            <line x1={0} y1={0} x2={-Math.sin(rad(g.angle)) * 46} y2={Math.cos(rad(g.angle)) * 33} stroke={COLOR.orange} strokeWidth={5} strokeLinecap="round" opacity={0.35} />
            <g transform={`rotate(${spin}) scale(${scale})`}>
              <circle r={34} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={4} />
            </g>
            {/* label drawn AFTER the spin, unrotated — always horizontal */}
            <text x={0} y={6} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={20} fill={COLOR.ink} opacity={interpolate(t, [0, 0.4, 0.55], [0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              {g.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
