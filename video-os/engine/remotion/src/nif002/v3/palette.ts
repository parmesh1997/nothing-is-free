/**
 * NIF v3 palette (2026-09-03 creator pivot — see memory nif-visual-direction-v3).
 *
 * The merge of The Infographics Show (built environments, filled + soft-shaded
 * flat vector, medium detail) and Vox style (muted, one hot accent, torn-paper
 * frame, sprockets, edge grain). The cream paper is demoted to a faint texture
 * inside the Vox frame — the SET now provides the ground, not a grey slab.
 *
 * Slightly desaturated / warm-neutral. Orange (#E24D28) stays the ONLY hot colour.
 */

import { COLOR } from "../../tokens";

export const V3 = {
  /** The composite base behind everything — a deep warm ink-brown (Vox darks). */
  base: "#1E1B18",

  /** Sky band at the top of an exterior set — a clean muted teal (Infographics
   *  Show saturation, knocked back a step for Vox). */
  sky: "#5E8C8A",
  skyHi: "#8FB3AF",

  /** The road / floor plane. */
  road: "#5C5952",
  roadHi: "#726E65",
  roadLo: "#48453F",
  /** Lane / kerb marking. */
  laneMark: "#E7E0CC",

  /** Sidewalk / interior floor — a warm stone. */
  walk: "#B8AD97",
  walkHi: "#CCC1A8",

  /** Buildings — three distinct warm tones so a row reads as one street. */
  bldgA: "#B07C55",
  bldgB: "#7C6A57",
  bldgC: "#C9A46E",
  bldgShade: "#4E4237",
  /** Lit window. */
  window: "#F2E9CE",
  windowDim: "#6B6252",

  /** Interior wall. */
  wall: "#C2B091",
  wallShade: "#9A8768",

  /** Paper / card surfaces that still appear (documents, screens, signage). */
  card: "#F1EBDC",
  cardShade: "#DBD3BF",

  /** Ink for outlines + dark props + type on light. */
  ink: COLOR.ink,
  /** Type on dark. */
  paperLight: "#EDE7D8",
  /** Secondary type / far midground. */
  muted: "#8E8778",

  /** THE accent. One bright element per frame. */
  accent: COLOR.orange,
  /** A knocked-back accent for secondary marks. */
  accentDim: "#A8442A",
} as const;

/** Darken a hex by amount (0..1). */
export const dk = (hex: string, amount = 0.16): string => {
  const n = parseInt(hex.replace("#", ""), 16);
  const c = (sh: number) => Math.max(0, Math.round(((n >> sh) & 255) * (1 - amount)));
  return `rgb(${c(16)}, ${c(8)}, ${c(0)})`;
};

/** Lighten a hex by amount (0..1). */
export const lt = (hex: string, amount = 0.2): string => {
  const n = parseInt(hex.replace("#", ""), 16);
  const c = (sh: number) => {
    const v = (n >> sh) & 255;
    return Math.round(v + (255 - v) * amount);
  };
  return `rgb(${c(16)}, ${c(8)}, ${c(0)})`;
};

/**
 * A flat-with-shading fill triple for a shape: mid body, a darker underside,
 * a lighter top edge. The Infographics-Show "soft shading" look without gradients
 * everywhere.
 */
export type V3Fill = { base: string; dark: string; light: string };
export const fill = (base: string): V3Fill => ({
  base,
  dark: dk(base, 0.2),
  light: lt(base, 0.16),
});
