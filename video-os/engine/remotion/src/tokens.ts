/**
 * tokens.ts — the single source of truth for the Nothing Is Free visual system.
 *
 * Every value here is lifted directly from "Nothing Is Free — Master Runbook v1.0".
 * Section references (§) point back to the runbook. If a number changes here it
 * changes everywhere; never hard-code a colour, size or duration in a component.
 *
 * Runbook §11.1 Tier 0: "tokens.ts (palette, spacing, timing)".
 */

// ─────────────────────────────────────────────────────────────────────────────
// Frame — fixed for the whole channel (§11.1 Tier 0)
// ─────────────────────────────────────────────────────────────────────────────

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/**
 * The reserved TEXT LANE (creator, 2026-09-03: "the bottom 20% is only for the
 * text — the deep text, whatever the text — and it never interacts with any of
 * the images. Everything visual is in the remaining 80%.").
 * Captions and punch words live at y ≥ TEXT_LANE_Y; figures, props, data,
 * generated plates all stay above it.
 */
export const TEXT_LANE_Y = Math.round(HEIGHT * 0.8);

/** Runtime floor / ceiling in seconds (§0.2, §8.3). */
export const RUNTIME = {
  floorSeconds: 12 * 60,
  ceilingSeconds: 60 * 60,
  get floorFrames() {
    return this.floorSeconds * FPS;
  },
  get ceilingFrames() {
    return this.ceilingSeconds * FPS;
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Palette — the creator's ASSETS LIBRARY sheet (2026-09-01). SIX colours only.
//
// Supersedes runbook §2.4/§2.6. Look: flat illustration + halftone texture +
// bold type, warm cream grid background, one warm orange accent, minimal
// shadows, clean & premium. Still 100% code (§0.1 C3, §14 hold).
// ─────────────────────────────────────────────────────────────────────────────

export const COLOR = {
  /** #F6F2E7 — the locked cream field. Never changes, never cuts (§2.1). */
  paper: "#F6F2E7",
  /** #EDE5D6 — the second paper tone: panels, cards, tickets, prop bodies. */
  paperShade: "#EDE5D6",
  /** #111111 — type, line-art strokes, dark props, trousers. */
  ink: "#111111",
  /** The line-art outline on every drawn shape. Same as ink. */
  outline: "#111111",
  /** #E24D28 — THE warm orange accent. One bright element per frame (§2.4). */
  orange: "#E24D28",
  /** #6D6A63 — warm grey: secondary type, shading, midground. */
  grey: "#6D6A63",

  // ── derived / support ──
  /** Cards & documents — the lighter paper tone. */
  cardWhite: "#FBF8F0",
  /** Skin / tan — the character's top and hands. */
  tan: "#E3B183",
  /** Grid lines — warm, faint. */
  grid: "#DDD5C4",
  /** Baseline (§2.2). */
  ground: "#D3CBB9",
  /** The warm-white torn-paper sticker edge. */
  stickerEdge: "#FDFBF5",
  /** Alias — some components still say `graphite`. */
  graphite: "#6D6A63",
  /** @deprecated → COLOR.paperShade */
  kraft: "#EDE5D6",
  /** @deprecated → COLOR.tan */
  ochre: "#E3B183",
  /** @deprecated → COLOR.orange */
  red: "#E24D28",
  /** @deprecated → COLOR.orange */
  orangeBright: "#E24D28",
  /** @deprecated → COLOR.tan */
  gold: "#E3B183",
  /** @deprecated → COLOR.grey */
  teal: "#6D6A63",
  /** @deprecated → COLOR.orange */
  highlight: "#E24D28",
  /** @deprecated */
  vignette: "#D3CBB9",
  /** @deprecated → COLOR.orange */
  offsetRed: "#E24D28",
} as const;

/**
 * SUPPORT — the saturated companion palette (creator, 2026-09-03: "it is looking
 * like a pale thing, give some saturation… use our color palette"). The cream
 * field and the orange accent stay; props, fills and set-dressing pull from
 * these so a frame has real colour and depth without losing the identity.
 */
export const SUPPORT = {
  /** deep teal — cool props, water, tech, night. */
  teal: "#26746E",
  /** forest — foliage, "good for you", growth. */
  forest: "#498636",
  /** mustard — warm props, lamps, wood-warm. */
  mustard: "#DD9E1E",
  /** clay — brick, terracotta, warm buildings. */
  clay: "#C4592E",
  /** plum — upholstery, shade, a second accent (used sparingly). */
  plum: "#834060",
  /** sky — a cool wash for sky / windows / far planes. */
  sky: "#5BA9CE",
} as const;

/** A warm grounded drop-shadow (depth without 3D). `k` scales the spread.
 *  Three stops: a tight contact anchor + a mid + a soft far throw — an element
 *  reads as sitting in the scene, not pasted on (creator 2026-09-03: "the depth,
 *  the shadow — we can do it better"). */
export const softShadow = (k = 1, opacity = 0.2) =>
  `drop-shadow(0 ${2 * k}px ${3 * k}px rgba(52,36,20,${opacity * 0.95})) ` +
  `drop-shadow(0 ${7 * k}px ${12 * k}px rgba(52,36,20,${opacity})) ` +
  `drop-shadow(0 ${16 * k}px ${28 * k}px rgba(52,36,20,${opacity * 0.55}))`;

/** Prop-fill colours to rotate through so a scene reads as one palette. */
export const PROP_COLORS = [
  COLOR.orange,
  SUPPORT.teal,
  SUPPORT.mustard,
  SUPPORT.clay,
  SUPPORT.forest,
  COLOR.grey,
] as const;

/**
 * Parse either `#rrggbb` or an `rgb(r, g, b)` / `rgba(r, g, b, a)` string (the
 * exact shape `shade()`/`tint()` themselves return) into [r,g,b]. Every
 * colour helper below routes through this — 2026-09-06 fix: `shade()`/
 * `tint()` used to only understand hex, so a call like `shade(tint(hex, x), y)`
 * (a DimCard fill built from an already-tinted colour, e.g. `fill={tint(COLOR.grey,0.55)}`
 * then DimCard internally doing `shade(fill, 0.08)`) fed an `rgb(...)` string
 * into `parseInt(hex.replace('#',''), 16)`, which returns NaN — and NaN
 * bit-shifted/masked (`(NaN>>16)&255`) coerces to 0 for every channel, so the
 * "shaded" result silently became pure black (`rgb(0,0,0)`) instead of a
 * slightly-darker tone. No error, no warning — just a card whose bottom edge
 * quietly rendered as a solid-black gradient. Confirmed via B16's "SPORTS,
 * ALONE" card and B14's ESPN card, both built with a `tint(...)`-derived
 * `fill`; likely present on every DimCard call site that doesn't pass a raw
 * hex literal. Fixing the parser here repairs every such call site at once.
 */
function parseColor(input: string): [number, number, number] {
  const rgbMatch = input.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }
  const n = parseInt(input.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Darken a hex OR `rgb(...)` colour by `amount` (0..1) for flat shading / a second tone. */
export const shade = (color: string, amount = 0.16): string => {
  const [cr, cg, cb] = parseColor(color);
  const r = Math.max(0, Math.round(cr * (1 - amount)));
  const g = Math.max(0, Math.round(cg * (1 - amount)));
  const b = Math.max(0, Math.round(cb * (1 - amount)));
  return `rgb(${r}, ${g}, ${b})`;
};

/** Lighten a hex OR `rgb(...)` colour by `amount` (0..1) for a highlight tone. */
export const tint = (color: string, amount = 0.2): string => {
  const [cr, cg, cb] = parseColor(color);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix(cr)}, ${mix(cg)}, ${mix(cb)})`;
};

// ─────────────────────────────────────────────────────────────────────────────
// The paper field (§2.3) — drawn in every single frame, including the reversal.
// ─────────────────────────────────────────────────────────────────────────────

export const FIELD = {
  grid: {
    /** px between grid lines. */
    spacing: 60,
    lineWidth: 1.4,
    /** Visible as a grid — structure you see, faint (creator note 2026-09-02;
     *  runbook §2.3 originally said 22%). */
    opacity: 0.3,
    /** Grid drift: +2px x, +1px y over 20s, sinusoidal — kills the frozen read. */
    drift: { xAmplitude: 2, yAmplitude: 1, periodSeconds: 20 },
    /** In the Dark Law the grid drops to 8% white (§2.9). */
    darkLawOpacity: 0.08,
  },
  vignette: {
    /** warm brown-grey — reads as edge shade in the cream world, not a filter. */
    color: "#8F7E5E",
    /** heavier, concentrated in the CORNERS — the frame has real weight at the
     *  edges (creator 2026-09-03: wants the "net on the corners" feel in-code). */
    opacity: 0.4,
    /** Clear until this fraction from centre, then darkens to the corners. */
    outerFraction: 0.5,
  },
  groundRule: {
    color: COLOR.ground,
    thickness: 2,
    /** Sits at 78% of frame height (§2.3). */
    yFraction: 0.78,
    get y() {
      return Math.round(HEIGHT * this.yFraction);
    },
  },
  grain: {
    /** Aged-paper texture. Baked ONCE to public/grain-tile.png (v2.0 §5.5) and
     *  tiled — never a per-frame feTurbulence. */
    baseFrequency: 0.6,
    opacity: 0.035,
    numOctaves: 3,
    tilePx: 512,
  },
  /** Fold creases removed — they read as stray lines over the content
   *  (creator note 2026-09-02). */
  creases: { count: 0, opacity: 0 },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// The progress rule (§2.8) — always present, never resets, never segmented.
// Driven by globalStartFrame / episodeTotalFrames, NEVER local frame (§11.3).
// ─────────────────────────────────────────────────────────────────────────────

export const PROGRESS_RULE = {
  height: 10,
  color: COLOR.orange,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// The Dark Law (§2.9) — once per episode, at the reversal.
// ─────────────────────────────────────────────────────────────────────────────

export const DARK_LAW = {
  field: COLOR.ink,
  /** Paper field crossfades to ink over 20 frames. */
  crossfadeFrames: 20,
  gridOpacity: FIELD.grid.darkLawOpacity,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// The cutout edge (§2.5 successor) — a paper "sticker" edge behind a foreground
// figure/object, like a hand-torn magazine cutout. Replaces the red offset.
// Foreground figures & props only — never type, cards, charts, midground.
// ─────────────────────────────────────────────────────────────────────────────

export const EDGE = {
  /** The sticker edge colour (warm near-white). */
  color: COLOR.stickerEdge,
  /** Edge thickness as a fraction of the subject's height. */
  widthFractionOfHeight: 0.016,
  /** Min / max edge thickness in px. */
  minWidth: 5,
  maxWidth: 16,
  /** Rough-torn wobble amplitude in px (0 = clean sticker). */
  roughness: 3,
  /** On entry, the edge "prints" on over this many frames. */
  printOnFrames: 6,
  /** MINIMAL shadow (creator sheet: "Minimal Shadows"). */
  shadow: { blur: 14, y: 7, opacity: 0.1 },
} as const;

/**
 * @deprecated Halftone is removed (creator direction). Kept as a stub so any
 * stale import still type-checks during the transition. Do not use.
 */
export const HALFTONE = { tile: 0, dot: COLOR.ink, tone: { shadow: 0, mid: 0, light: 0 } } as const;
export type HalftoneTone = "shadow" | "mid" | "light";

/**
 * FILL — the flat-colour tone set handed to a shape. `base` is the local colour,
 * `dark` a shading tone, `light` a highlight tone. Build shapes from these three.
 */
export type Fill = { base: string; dark: string; light: string; edge: string };

export const makeFill = (base: string): Fill => ({
  base,
  dark: shade(base, 0.18),
  light: tint(base, 0.22),
  edge: COLOR.stickerEdge,
});

// ─────────────────────────────────────────────────────────────────────────────
// Typography (§2.7)
// Hero figures are NEVER smaller than 180px.
// ─────────────────────────────────────────────────────────────────────────────

export const FONT = {
  /** HEADING — Bebas Neue: tall condensed all-caps display (creator sheet). */
  hero: '"Bebas Neue", "Oswald", "Arial Narrow", sans-serif',
  /** BODY — Inter: captions, labels, callout values. */
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  /** Source tags, typed lines, small mono labels. */
  mono: '"IBM Plex Mono", "SFMono-Regular", ui-monospace, monospace',
} as const;

export const TYPE = {
  /** Hero heading: Bebas Neue, all-caps, big. Tracking slightly OPEN (Bebas is tight). */
  hero: {
    fontFamily: FONT.hero,
    minSize: 140,
    maxSize: 300,
    fontWeight: 400,
    textTransform: "uppercase" as const,
    letterSpacing: "0.01em",
    lineHeight: 0.92,
    color: COLOR.ink,
  },
  /** Big number / value: Inter 700 (the "$12" / "$9.00" read). */
  number: {
    fontFamily: FONT.sans,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1,
    color: COLOR.ink,
  },
  /** Unit / label under a figure: Inter, uppercase, letterspaced, grey. */
  unit: {
    fontFamily: FONT.sans,
    fontSize: 26,
    textTransform: "uppercase" as const,
    letterSpacing: "0.14em",
    fontWeight: 600,
    color: COLOR.grey,
  },
  /** Caption line: Inter, sentence case, ink, lower third. */
  caption: {
    fontFamily: FONT.sans,
    minSize: 40,
    maxSize: 54,
    fontWeight: 500,
    color: COLOR.ink,
  },
  /** The typed line: mono uppercase, 46px, letterspaced 0.06em, block cursor. */
  typed: {
    fontFamily: FONT.mono,
    fontSize: 46,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    fontWeight: 500,
    color: COLOR.ink,
  },
  /** Card labels: 18–22px, mono, graphite. */
  cardLabel: {
    fontFamily: FONT.mono,
    minSize: 18,
    maxSize: 22,
    color: COLOR.graphite,
  },
  /** Source tag: 16px, mono, graphite at 60%, bottom-left, persistent, every frame. */
  sourceTag: {
    fontFamily: FONT.mono,
    fontSize: 16,
    color: COLOR.graphite,
    opacity: 0.6,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Layout / spacing
// ─────────────────────────────────────────────────────────────────────────────

export const SPACE = {
  /** Base spacing unit (matches the grid). */
  unit: 48,
  /** Action-safe area — nothing important outside this (§9.2 "inside the safe area"). */
  safe: { x: 120, y: 90 },
  /** Title-safe — headline / hero type stays inside this. */
  titleSafe: { x: 192, y: 108 },
  /** The bottom third — carries the ground, subject mass, progress rule, caption (§2.2). */
  bottomThirdY: Math.round(HEIGHT * (2 / 3)),
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Occupancy law (§2.2) — checked on every rendered piece (§11.5). A number,
// not a judgement call. Frames below floor: ZERO.
// ─────────────────────────────────────────────────────────────────────────────

export const OCCUPANCY = {
  /** % of pixels differing from paper by >60 in summed RGB. */
  inkCoverageFloor: 0.22,
  inkCoverageTarget: [0.25, 0.3] as const,
  /** Same measure, lower 30% of frame. */
  bottomThirdFloor: 0.35,
  bottomThirdTarget: 0.45,
  /** Bounding box of the primary subject, as a fraction of frame height. */
  subjectHeightRange: [0.45, 0.7] as const,
  /** Under 22% for > this many consecutive frames fails. */
  maxFramesBelowFloor: 12,
  /** Sampled every 0.5s. */
  sampleIntervalSeconds: 0.5,
  /** RGB summed-difference threshold that counts a pixel as "ink". */
  paperDeltaThreshold: 60,
  /** Frames whose mean luma is below this are Dark Law frames and are exempt. */
  darkLawMeanLuma: 120,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// The Z model (§3.2) — the three planes ARE the spatial model; 2.5D adds a
// camera plus two intermediate depths. Distant elements move less.
// ─────────────────────────────────────────────────────────────────────────────

export const Z = {
  background: { z: -3.0, parallax: 0.02 },
  deepMid: { z: -2.0, parallax: 0.04 },
  midground: { z: -1.0, parallax: 0.06 },
  subject: { z: -0.5, parallax: 0.1 },
  foreground: { z: 0.0, parallax: 0.14 },
  /** Connection lines sit just behind the parent (§3.7). */
  connection: { z: -0.1, parallax: 0.12 },
} as const;

export type PlaneName = keyof typeof Z;

// ─────────────────────────────────────────────────────────────────────────────
// Motion (§4) — everything is spring() or interpolate() with easing.
// NOTHING moves linearly except grid drift and wave bands.
// ─────────────────────────────────────────────────────────────────────────────

export const MOTION = {
  /** Anything arriving. */
  springIn: { damping: 12, mass: 0.8, stiffness: 100 },
  /** A motion event lands at least every 3.5s, including rest beats (§4.2). */
  eventMaxGapSeconds: 3.5,
  get eventMaxGapFrames() {
    return Math.round(this.eventMaxGapSeconds * FPS);
  },
  /** Events per 10s by beat class (§4.2). */
  eventsPer10s: { opening: 7, high: 5, medium: 4, rest: 3 },
  /** Never more than 2 elements arriving in the same 6 frames (§4.3). */
  staggerMaxInWindow: 2,
  staggerWindowFrames: 6,
  staggerOffsetFrames: 4,
  /** Static-run ceilings (§15.4): <3.0s, <1.5s in the opening minute. */
  staticRunMaxFrames: 90,
  staticRunMaxFramesOpening: 45,
  openingWindowFrames: 60 * FPS,
  /** Per-element motion blur, derived from velocity, zero at rest (§4.4). */
  motionBlur: { perPxPerFrame: 0.45, maxPx: 24 },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// The per-beat composition props contract (§11.3)
// Because Resolve assembles separately-rendered pieces (§0.1 C2), every beat
// composition MUST know where it sits in the episode, or the locked background
// and the progress rule break at every cut.
// ─────────────────────────────────────────────────────────────────────────────

export type BeatProps = {
  beatId: string;
  /** From Step 2 reconcile — never estimated (§10, §11.3). */
  durationInFrames: number;
  fps: typeof FPS;
  /** Position of this beat's first frame in the assembled episode. */
  globalStartFrame: number;
  /** Total frames in the finished episode — drives progress rule + grid phase. */
  episodeTotalFrames: number;
  audioSrc: string;
  audioOffsetMs: number;
};

/**
 * Sensible defaults so a beat composition can render standalone in Studio
 * before the episode total is known. 12-minute floor, beat at the top.
 */
export const BEAT_PROPS_DEFAULTS: BeatProps = {
  beatId: "B00",
  durationInFrames: 5 * FPS,
  fps: FPS,
  globalStartFrame: 0,
  episodeTotalFrames: RUNTIME.floorFrames,
  audioSrc: "",
  audioOffsetMs: 0,
};

/**
 * Grid drift, vignette phase and the progress rule are all functions of
 * (globalStartFrame + frame), never of local frame (§11.3). Use this everywhere.
 */
export const globalFrame = (localFrame: number, props: BeatProps) =>
  props.globalStartFrame + localFrame;

/** Progress rule fill 0 → 1 across the whole episode (§2.8). Monotonic. */
export const episodeProgress = (localFrame: number, props: BeatProps) =>
  Math.min(
    1,
    Math.max(0, globalFrame(localFrame, props) / props.episodeTotalFrames),
  );
