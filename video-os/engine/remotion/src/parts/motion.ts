/**
 * motion.ts — TIER 3 core (§4). Everything is spring() or interpolate() with
 * easing. NOTHING moves linearly except grid drift and wave bands.
 *
 * These are the shared primitives the parts-bin components and the archetypes
 * build on. Keep the maths here; keep components thin.
 */
import { Easing, interpolate, spring } from "remotion";
import { MOTION } from "../tokens";

// ── Easing presets (§4.1) ────────────────────────────────────────────────────

export const EASE = {
  /** A number counting. */
  countOut: Easing.out(Easing.cubic),
  /** Anything leaving. */
  exitIn: Easing.in(Easing.cubic),
  /** Camera push / pull, line drawing. */
  inOut: Easing.inOut(Easing.cubic),
} as const;

// ── Arrivals (§4.1: spring damping 12, mass 0.8, stiffness 100) ───────────────

export const springIn = ({
  frame,
  fps,
  delay = 0,
  durationInFrames,
}: {
  frame: number;
  fps: number;
  delay?: number;
  durationInFrames?: number;
}) =>
  spring({
    frame: frame - delay,
    fps,
    config: MOTION.springIn,
    durationInFrames,
  });

// ── Departures (§4.1) ────────────────────────────────────────────────────────

/** 1 → 0 over [start, end], cubic-in. Pair with opacity + a small translate. */
export const exitOut = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.exitIn,
  });

// ── Counting (§4.1) ──────────────────────────────────────────────────────────

export const countUp = (
  frame: number,
  from: number,
  to: number,
  start: number,
  end: number,
) =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.countOut,
  });

// ── Motion blur (§4.4) ───────────────────────────────────────────────────────

/**
 * Per-element blur derived from velocity, falling to zero at rest.
 * A blurred object at rest is a bug (§4.4).
 */
export const velocityBlur = (velocityPxPerFrame: number) =>
  Math.min(
    Math.abs(velocityPxPerFrame) * MOTION.motionBlur.perPxPerFrame,
    MOTION.motionBlur.maxPx,
  );

/**
 * Numerically differentiate a value-of-frame function to get px/frame, then
 * convert to a blur radius. Use when you don't have an analytic velocity.
 */
export const blurFromSampler = (
  frame: number,
  sampler: (f: number) => number,
) => velocityBlur(sampler(frame) - sampler(frame - 1));

// ── Stagger (§4.3: never > 2 arriving in the same 6 frames; 4-frame offsets) ──

export const staggerDelay = (
  index: number,
  offset: number = MOTION.staggerOffsetFrames,
) => index * offset;
