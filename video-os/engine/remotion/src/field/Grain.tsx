import { AbsoluteFill, staticFile } from "remotion";
import { FIELD, HEIGHT, WIDTH } from "../tokens";

/**
 * Grain — aged-paper texture, tiled from a BAKED PNG (v2.0 §5.5).
 *
 * The old version ran `feTurbulence` across the full 1920×1080 every frame —
 * "the single biggest render-cost mistake" (v2.0). It is baked once to
 * `public/grain-tile.png` by the `bake-grain-tile` composition:
 *
 *   npx remotion still bake-grain-tile public/grain-tile.png
 *
 * and tiled here via an SVG `<pattern>` (Remotion forbids CSS background-image).
 * Static; a crawling texture would fight the "one continuous shot" read.
 */
export const Grain: React.FC = () => {
  const t = FIELD.grain.tilePx;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: FIELD.grain.opacity,
        mixBlendMode: "multiply",
      }}
    >
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <defs>
          <pattern id="nif-grain" width={t} height={t} patternUnits="userSpaceOnUse">
            <image href={staticFile("grain-tile.png")} width={t} height={t} />
          </pattern>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#nif-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * GrainTile — one 512×512 frame of the paper turbulence. Rendered ONCE to a PNG
 * (see above). Never used at runtime.
 */
export const GrainTile: React.FC = () => {
  const { baseFrequency, numOctaves, tilePx } = FIELD.grain;
  return (
    <svg width={tilePx} height={tilePx} viewBox={`0 0 ${tilePx} ${tilePx}`}>
      <filter id="grain-bake" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves={numOctaves}
          stitchTiles="stitch"
          result="n"
        />
        <feColorMatrix in="n" type="saturate" values="0" />
      </filter>
      <rect width={tilePx} height={tilePx} filter="url(#grain-bake)" />
    </svg>
  );
};
