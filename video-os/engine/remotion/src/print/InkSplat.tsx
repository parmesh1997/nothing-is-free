import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, MOTION } from "../tokens";

/**
 * InkSplat — a paint / ink splatter decoration (the black splats in the collage
 * reference). Procedural: a lopsided central blob + a ring of droplets. Snaps on
 * with a spring so it reads as "thrown down".
 *
 * Decoration only — never carries information. Use behind or beside a subject to
 * add collage energy; keep to one or two per frame.
 */
export const InkSplat: React.FC<{
  x: number;
  y: number;
  /** Overall size in px. */
  size?: number;
  color?: string;
  /** Deterministic variety — same seed → same splat. */
  seed?: number;
  entryFrame?: number;
  rotate?: number;
  opacity?: number;
}> = ({ x, y, size = 160, color = COLOR.ink, seed = 1, entryFrame = 0, rotate = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - entryFrame, fps, config: { ...MOTION.springIn, stiffness: 160 } });

  const rand = mulberry(seed);
  const r = size / 2;

  // central blob: a wobbly polygon
  const blobPts: string[] = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (0.55 + rand() * 0.5);
    blobPts.push(`${Math.cos(a) * rr} ${Math.sin(a) * rr}`);
  }

  // droplets
  const drops = Array.from({ length: 7 }).map(() => {
    const a = rand() * Math.PI * 2;
    const dist = r * (0.9 + rand() * 1.4);
    return { cx: Math.cos(a) * dist, cy: Math.sin(a) * dist, rr: r * (0.05 + rand() * 0.18) };
  });

  return (
    <svg
      style={{
        position: "absolute",
        left: x,
        top: y,
        overflow: "visible",
        transform: `rotate(${rotate}deg) scale(${p})`,
        transformOrigin: "0 0",
        opacity: opacity * p,
      }}
    >
      <polygon points={blobPts.join(" ")} fill={color} />
      {drops.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.rr} fill={color} />
      ))}
    </svg>
  );
};

/** tiny deterministic PRNG so a seed always yields the same splat */
const mulberry = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
