import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { EASE } from "../parts/motion";
import { SpatialScene, SceneCameraKey } from "../spatial/SpatialScene";

// the one accent (COLOR.orange #E24D28 = rgb(226,77,40)); used at low alpha for glow.
const ACCENT_RGB = "226,77,40";

/**
 * glide.tsx — the **Glide** motion register (creator, 2026-09-09, after the
 * `demo.mp4` reference: two AI-explainer segments, different looks, one motion
 * grammar).
 *
 * Glide is the *cinematic* register — for the 1–2 beats per episode that want
 * weight: the cold open, the reversal, a "pull back to see the whole system"
 * beat. It is NOT the house default (§3.1 — "2.5D is a tool, not the identity;
 * most frames stay flat"). The other registers stay:
 *   · Punch  — spring pop-ins, draw-ons, Bloom, hard cuts  (most NIF beats)
 *   · Doodle — draw-on / boil / typewriter  (channel-2 study)
 *
 * The six things that make the reference read "smooth", ported:
 *   1. the camera never stops        → `drift` on <GlideScene> (ambient wobble)
 *   2. layered parallax              → author puts content in <Layer plane=…>
 *   3. everything micro-moves held   → <GlideCard> floats; hold mechanics
 *   4. soft transitions, no hard cut → <GlideIn>/<GlideOut> focus-pull
 *   5. depth cues                    → <Atmosphere> vignette + ambient glow
 *   6. slow eased timing             → GLIDE_EASE, ~0.5–1.5s moves
 *
 * Channel-agnostic: renders whatever children/palette you give it. Sits INSIDE
 * a beat wrapper (V4Beat / BeatFrame), around the beat's visual content.
 */

export const GLIDE = {
  /** element enter — opacity + rise + a hair of scale + a touch of focus-pull blur */
  enter: { dur: 22, rise: 26, scaleFrom: 0.965, blur: 6 },
  /** element exit — drift up + scale past 1 + fade (the reference's "handled, set aside") */
  exit: { dur: 16, rise: -16, scaleTo: 1.045 },
  /** held-card idle float (px / deg) — keep tiny, it must not read as a wobble */
  float: { x: 4, y: 5, rot: 0.5, periodX: 5.8, periodY: 7.1, periodRot: 9.0 },
} as const;

/** Softer than the house `OUT` (which is a snappy settle) — Glide decelerates gently. */
export const GLIDE_EASE = Easing.bezier(0.16, 1, 0.3, 1);

// ── the stage ────────────────────────────────────────────────────────────────

type Push = "in" | "out" | "left" | "right" | "hold";

const pushKeys = (kind: Push, dur: number): SceneCameraKey[] => {
  const e = EASE.inOut;
  switch (kind) {
    case "in":
      return [
        { frame: 0, target: { zoom: 1.0, x: -16 } },
        { frame: dur, target: { zoom: 1.11, x: 8 }, easing: e },
      ];
    case "out":
      return [
        { frame: 0, target: { zoom: 1.13, x: 12 } },
        { frame: dur, target: { zoom: 1.0, x: -10 }, easing: e },
      ];
    case "left":
      return [
        { frame: 0, target: { x: 78, zoom: 1.04 } },
        { frame: dur, target: { x: -78, zoom: 1.04 }, easing: e },
      ];
    case "right":
      return [
        { frame: 0, target: { x: -78, zoom: 1.04 } },
        { frame: dur, target: { x: 78, zoom: 1.04 }, easing: e },
      ];
    default:
      return [];
  }
};

/**
 * <GlideScene> — a beat's cinematic stage. One continuous camera move over the
 * whole beat (`push`) + a permanent ambient drift so no frame is ever locked +
 * the depth atmosphere. Put content in `<Layer plane="background|deepMid|
 * midground|subject|foreground">` so the parallax has something to separate.
 *
 *   <V4Beat props={props} beat="B00" bareRoom noTransition audioDir="nif004">
 *     <GlideScene push="in">
 *       <Layer plane="background"><Grid/></Layer>
 *       <Layer plane="midground"><GlideCard at={24}>…</GlideCard></Layer>
 *       <Layer plane="subject"><GlideIn at={48}><Pin/></GlideIn></Layer>
 *     </GlideScene>
 *   </V4Beat>
 */
export const GlideScene: React.FC<{
  /** the single camera move over the beat. `hold` = drift only. default `in`. */
  push?: Push;
  /** explicit camera keyframes — overrides `push` when you need a multi-phase move. */
  camera?: SceneCameraKey[];
  /** frames the `push` takes. default = the composition's full duration (the move
   *  runs the whole beat). Set shorter to land the move before the beat ends. */
  spanFrames?: number;
  /** ambient drift amount (0 locked … 1 house). default 1 — Glide is never still. */
  drift?: number;
  /** atmosphere tone — `paper` (cream) or `ink` (Dark-Law). default `paper`. */
  tone?: "paper" | "ink";
  /** draw the atmosphere overlay. default true. */
  atmosphere?: boolean;
  children?: React.ReactNode;
}> = ({ push = "in", camera, spanFrames, drift = 1, tone = "paper", atmosphere = true, children }) => {
  const { durationInFrames } = useVideoConfig();
  const keys = camera ?? pushKeys(push, spanFrames ?? durationInFrames);
  return (
    <SpatialScene camera={keys} drift={drift}>
      {children}
      {atmosphere && <Atmosphere tone={tone} />}
    </SpatialScene>
  );
};

// ── element helpers ──────────────────────────────────────────────────────────

/** soft focus-pull entrance, then holds. Wrap any element that should arrive. */
export const GlideIn: React.FC<{
  at: number;
  /** rise distance px. default GLIDE.enter.rise. */
  rise?: number;
  dur?: number;
  blur?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ at, rise = GLIDE.enter.rise, dur = GLIDE.enter.dur, blur = GLIDE.enter.blur, style, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: GLIDE_EASE,
  });
  const o = interpolate(frame, [at, at + Math.min(dur, 10)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0.001) return null;
  return (
    <div
      style={{
        opacity: o,
        transform: `translateY(${(1 - t) * rise}px) scale(${GLIDE.enter.scaleFrom + t * (1 - GLIDE.enter.scaleFrom)})`,
        filter: blur ? `blur(${((1 - t) * blur).toFixed(2)}px)` : undefined,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** soft exit — drifts up, scales a hair past 1, fades. `at` is when it starts leaving. */
export const GlideOut: React.FC<{
  at: number;
  dur?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ at, dur = GLIDE.exit.dur, style, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.exitIn,
  });
  if (t >= 1) return null;
  return (
    <div
      style={{
        opacity: 1 - t,
        transform: `translateY(${t * GLIDE.exit.rise}px) scale(${1 + t * (GLIDE.exit.scaleTo - 1)})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** the reference's hovering card — glides in, floats while held, glides out. */
export const GlideCard: React.FC<{
  at: number;
  /** frame it starts leaving. omit = stays to the end. */
  out?: number;
  x: number;
  y: number;
  w?: number;
  /** seed so a group of cards doesn't float in unison. */
  seed?: number;
  /** subtle orange rim glow (a landing / the one accent). */
  glow?: boolean;
  tone?: "paper" | "ink";
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ at, out, x, y, w = 420, seed = 0, glow = false, tone = "paper", style, children }) => {
  const frame = useCurrentFrame();
  const held = frame > at + GLIDE.enter.dur && (out === undefined || frame < out);
  const k = held ? 1 : 0;
  const TAU = Math.PI * 2;
  const fx = Math.sin((frame / 30 / GLIDE.float.periodX) * TAU + seed) * GLIDE.float.x * k;
  const fy = Math.cos((frame / 30 / GLIDE.float.periodY) * TAU + seed * 1.3) * GLIDE.float.y * k;
  const fr = Math.sin((frame / 30 / GLIDE.float.periodRot) * TAU + seed * 0.7) * GLIDE.float.rot * k;
  const shadow =
    tone === "ink"
      ? "0 24px 60px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.4)"
      : "0 22px 54px rgba(52,36,20,0.20), 0 4px 12px rgba(52,36,20,0.14)";
  const inner = (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y,
        width: w,
        transform: `translate(${fx.toFixed(2)}px, ${fy.toFixed(2)}px) rotate(${fr.toFixed(3)}deg)`,
        filter: `drop-shadow(${shadow})${glow && held ? ` drop-shadow(0 0 26px rgba(${ACCENT_RGB},0.35))` : ""}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
  if (out === undefined) return <GlideIn at={at}>{inner}</GlideIn>;
  return frame < out ? <GlideIn at={at}>{inner}</GlideIn> : <GlideOut at={out}>{inner}</GlideOut>;
};

// ── atmosphere ───────────────────────────────────────────────────────────────

/** depth: a corner-weighted vignette + a slow ambient top glow. Palette-aware. */
export const Atmosphere: React.FC<{ tone?: "paper" | "ink"; glow?: boolean }> = ({
  tone = "paper",
  glow = true,
}) => {
  const frame = useCurrentFrame();
  const g = 0.62 + 0.38 * Math.abs(Math.sin(frame / 64));
  const edge = tone === "ink" ? "rgba(0,0,0,0.6)" : "rgba(96,80,52,0.26)";
  const bloom =
    tone === "ink" ? `rgba(${ACCENT_RGB},0.09)` : "rgba(255,244,214,0.34)";
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(128% 96% at 50% 40%, transparent 38%, ${edge} 100%)`,
          pointerEvents: "none",
        }}
      />
      {glow && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(58% 40% at 50% 26%, ${bloom} 0%, transparent 72%)`,
            opacity: g,
            mixBlendMode: "soft-light",
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
};

// re-export so a Glide beat needs one import
export { Layer } from "../spatial/Layer";
