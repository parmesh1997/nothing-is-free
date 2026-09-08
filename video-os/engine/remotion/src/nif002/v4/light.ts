/**
 * light.ts — the v4 depth model (creator, 2026-09-03: "flat big style… I need
 * that depth… a little bit of lighting… the shadow").
 *
 * NOT 3D. Depth comes from ONE consistent light and the shadows it throws:
 *
 *   1. a fixed key light from the TOP-LEFT (135° ≈ 10-o'clock)
 *   2. every grounded prop/figure drops a soft CONTACT shadow on the cream
 *   3. cards / floating elements get a soft warm DROP shadow, offset down-right
 *   4. far parallax planes get a faint warm HAZE so distance reads as air
 *   5. a lit top edge (1 stop up) on big masses
 *
 * All tuned warm (the shadow is brown-black, never blue) so it sits in the
 * cream world. Keep it subtle — this is editorial lighting, not a game engine.
 */
import { COLOR } from "../../tokens";

export const LIGHT = {
  /** key direction, degrees clockwise from 12 o'clock. 135 = down-right throw. */
  angleDeg: 135,
  /** shadow ink — warm near-black, NEVER pure #000 and never blue. */
  shadowRGB: "34, 26, 18",
  /** contact shadow: how far past the object footprint it spreads. */
  contactSpread: 1.4,
  /** elevation → drop-shadow blur / offset multiplier. */
  elevations: {
    /** sits on the ground (figures, furniture). */
    grounded: 0.7,
    /** a card / packet a few cm off the surface. */
    raised: 1.15,
    /** hero type / a callout floating clearly in front. */
    floating: 1.8,
  },
} as const;

const rad = (deg: number) => (deg * Math.PI) / 180;
/** unit light vector in screen space (x right, y down). */
export const LIGHT_VEC = {
  x: Math.sin(rad(LIGHT.angleDeg)),
  y: Math.cos(rad(LIGHT.angleDeg)) * -1, // 135° → throw downward
};

/**
 * A soft warm drop shadow for a floating element (card, packet, hero word).
 * `elevation` picks the throw distance + blur; `k` scales the whole thing with
 * the element size (pass the element's height / 100 or so, default 1).
 */
export const dropShadow = (
  elevation: keyof typeof LIGHT.elevations = "raised",
  k = 1,
  opacity = 0.22,
): string => {
  const e = LIGHT.elevations[elevation];
  const dx = LIGHT_VEC.x * 11 * e * k;
  const dy = Math.abs(LIGHT_VEC.y) * 13 * e * k + 5 * e;
  const blur = 16 * e * k;
  // a second, tighter contact shadow so the element reads as truly grounded, not
  // pasted — the near-shadow anchors it, the far-shadow gives it air.
  const near = `drop-shadow(${(dx * 0.35).toFixed(1)}px ${(dy * 0.3 + 1).toFixed(1)}px ${(blur * 0.35).toFixed(1)}px rgba(${LIGHT.shadowRGB}, ${(opacity * 0.9).toFixed(2)}))`;
  const far = `drop-shadow(${dx.toFixed(1)}px ${dy.toFixed(1)}px ${blur.toFixed(1)}px rgba(${LIGHT.shadowRGB}, ${opacity}))`;
  return `${near} ${far}`;
};

/**
 * Inline style for a soft elliptical CONTACT shadow you place as its own element
 * directly under a grounded object. `w` is the object's visual width at the
 * ground; the ellipse is drawn `contactSpread`× wider and short.
 */
export const contactShadowStyle = (
  w: number,
  opts: { opacity?: number; squash?: number; blur?: number } = {},
): React.CSSProperties => {
  const width = w * LIGHT.contactSpread;
  const height = Math.max(10, w * 0.14 * (opts.squash ?? 1));
  return {
    position: "absolute",
    width,
    height,
    borderRadius: "50%",
    background: `radial-gradient(50% 50% at 50% 50%, rgba(${LIGHT.shadowRGB}, ${opts.opacity ?? 0.26}) 0%, rgba(${LIGHT.shadowRGB}, 0) 72%)`,
    filter: `blur(${opts.blur ?? 5}px)`,
    pointerEvents: "none",
  };
};

/**
 * A warm floor wash: a soft gradient the scene sits on, darker toward the
 * bottom, fading to nothing well before it would become a hard "floor line".
 * The cream shows through — this is a pool of shade, not a surface.
 */
export const floorWashStyle = (
  topY: number,
  opts: { strength?: number } = {},
): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: topY,
  bottom: 0,
  background: `linear-gradient(180deg, rgba(${LIGHT.shadowRGB}, 0) 0%, rgba(${LIGHT.shadowRGB}, ${0.05 * (opts.strength ?? 1)}) 45%, rgba(${LIGHT.shadowRGB}, ${0.11 * (opts.strength ?? 1)}) 100%)`,
  pointerEvents: "none",
});

/**
 * Distance haze for a far parallax plane. Returns an overlay style: a thin wash
 * of warm cream that lifts the plane's contrast so it reads as "further away".
 * `depth` 0 (near) → 1 (far).
 */
export const hazeStyle = (depth: number): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  background: COLOR.paper,
  opacity: Math.max(0, Math.min(0.5, depth * 0.16)),
  mixBlendMode: "screen",
  pointerEvents: "none",
});

/** A subtle lit top edge for a big flat mass — a 1-stop-up inner highlight. */
export const litEdgeStyle = (): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  boxShadow: `inset 0 2px 0 rgba(255, 250, 238, 0.5)`,
  pointerEvents: "none",
});
