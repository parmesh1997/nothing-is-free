import { COLOR } from "../tokens";

/**
 * textures.tsx — the PATTERNS / TEXTURES panel from the ASSETS LIBRARY sheet.
 *
 * Halftone is back — as TEXTURE, not as the way figures are rendered. Props are
 * line-art + flat fill, then a halftone/hatch pattern shades them. Decorative
 * texture blocks and brush strokes give the collage energy.
 *
 * Mount <TextureDefs/> once per composition, then reference the fills:
 *   fill={HT.mid}   fill={HATCH.diag}   fill={GRIDFILL}
 */

export const HT = {
  /** Sparse dots — a light tint over a fill. */
  light: "url(#nif-ht-light)",
  /** Medium — the workhorse shading pattern. */
  mid: "url(#nif-ht-mid)",
  /** Dense — deep shadow / a solid-ish texture block. */
  dark: "url(#nif-ht-dark)",
  /** Orange dots — texture in the accent colour. */
  orange: "url(#nif-ht-orange)",
} as const;

export const HATCH = {
  /** 45° line hatch. */
  diag: "url(#nif-hatch-diag)",
  /** Fine square grid. */
  grid: "url(#nif-hatch-grid)",
} as const;

export const TextureDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
    <defs>
      <pattern id="nif-ht-light" width={8} height={8} patternUnits="userSpaceOnUse">
        <circle cx={4} cy={4} r={1.1} fill={COLOR.ink} />
      </pattern>
      <pattern id="nif-ht-mid" width={7} height={7} patternUnits="userSpaceOnUse">
        <circle cx={3.5} cy={3.5} r={1.9} fill={COLOR.ink} />
      </pattern>
      <pattern id="nif-ht-dark" width={6} height={6} patternUnits="userSpaceOnUse">
        <circle cx={3} cy={3} r={2.5} fill={COLOR.ink} />
      </pattern>
      <pattern id="nif-ht-orange" width={7} height={7} patternUnits="userSpaceOnUse">
        <circle cx={3.5} cy={3.5} r={1.9} fill={COLOR.orange} />
      </pattern>
      <pattern id="nif-hatch-diag" width={9} height={9} patternUnits="userSpaceOnUse">
        <path d="M-2 2 L2 -2 M0 9 L9 0 M7 11 L11 7" stroke={COLOR.ink} strokeWidth={1.4} />
      </pattern>
      <pattern id="nif-hatch-grid" width={12} height={12} patternUnits="userSpaceOnUse">
        <path d="M12 0 L0 0 0 12" fill="none" stroke={COLOR.ink} strokeWidth={1.2} />
      </pattern>
    </defs>
  </svg>
);

/**
 * HalftoneDot — a radial halftone disc (the graded dot circles on the sheet).
 * `density` 0..1 controls the falloff. Pure decoration.
 */
export const HalftoneDot: React.FC<{
  x: number;
  y: number;
  r?: number;
  density?: number;
  color?: string;
  opacity?: number;
}> = ({ x, y, r = 60, density = 0.7, color = COLOR.ink, opacity = 1 }) => {
  const step = 6;
  const dots: React.ReactNode[] = [];
  for (let dy = -r; dy <= r; dy += step) {
    for (let dx = -r; dx <= r; dx += step) {
      const d = Math.hypot(dx, dy);
      if (d > r) continue;
      const t = 1 - d / r; // 1 at centre
      const rr = Math.max(0, (step / 2) * (t * density + (1 - density) * 0.25));
      if (rr < 0.2) continue;
      dots.push(<circle key={`${dx},${dy}`} cx={dx} cy={dy} r={rr} />);
    }
  }
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} opacity={opacity}>
      <g fill={color}>{dots}</g>
    </svg>
  );
};

/** A rectangular texture block — halftone, hatch or grid. */
export const TextureBlock: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  opacity?: number;
  rotate?: number;
}> = ({ x, y, w, h, fill = HT.mid, opacity = 1, rotate = 0 }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", rotate: `${rotate}deg` }}>
    <rect width={w} height={h} fill={fill} opacity={opacity} />
  </svg>
);

/**
 * BrushStroke — the black scribble / orange sweep from the sheet. A tapered,
 * slightly ragged band. `progress` 0..1 draws it on (motion #2 "wipe on").
 */
export const BrushStroke: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  color?: string;
  progress?: number;
  rotate?: number;
  seed?: number;
}> = ({ x, y, w, h = 26, color = COLOR.ink, progress = 1, rotate = 0, seed = 1 }) => {
  const rand = mulberry(seed);
  const n = 26;
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const px = t * w;
    // taper at both ends + a little raggedness
    const taper = Math.sin(t * Math.PI) ** 0.55;
    const jitter = (rand() - 0.5) * h * 0.22;
    top.push(`${px} ${h / 2 - (h / 2) * taper + jitter}`);
    bot.unshift(`${px} ${h / 2 + (h / 2) * taper + jitter}`);
  }
  return (
    <svg
      style={{
        position: "absolute",
        left: x,
        top: y,
        overflow: "visible",
        rotate: `${rotate}deg`,
        clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
      }}
    >
      <path d={`M ${top.join(" L ")} L ${bot.join(" L ")} Z`} fill={color} />
    </svg>
  );
};

/** A brush-stroke ARROW — the "slide" motion mark on the sheet. */
export const BrushArrow: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  color?: string;
  progress?: number;
}> = ({ x, y, w, h = 30, color = COLOR.orange, progress = 1 }) => {
  const shaftW = w * 0.74;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}>
      <path
        d={`M 0 ${h * 0.34} Q ${shaftW * 0.5} ${h * 0.1} ${shaftW} ${h * 0.16}
            L ${shaftW} ${-h * 0.35}
            L ${w} ${h * 0.5}
            L ${shaftW} ${h * 1.35}
            L ${shaftW} ${h * 0.84}
            Q ${shaftW * 0.5} ${h * 0.9} 0 ${h * 0.66} Z`}
        fill={color}
      />
    </svg>
  );
};

const mulberry = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
