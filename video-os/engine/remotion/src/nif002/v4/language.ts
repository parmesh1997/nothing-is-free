import { Easing, interpolate } from "remotion";

/**
 * language.ts — the NIF v4 MOTION LANGUAGE (locked 2026-09-03).
 *
 * Derived from the creative brief (mood: "confident, precise, warm" = the
 * calm-sharp / Premium-Corporate cell of the tone matrix) + the motion-design
 * craft references now in .agents/skills/ (animation-principles, motion-art-
 * direction, shot-composition). Every v4 move obeys this — one easing family,
 * one timing unit, one transition family.
 *
 * The rules that bite:
 *   · NO overshoot on this content. "Don't add overshoot to serious/financial
 *     content — it reads as toy-like." Scale enters 0.96→1.0, never past 1.02.
 *   · Two eases only: OUT for entrances/landings, IN for exits.
 *   · Base unit 12f (0.4s). Enters 12f, big moves 24f, micro 6f.
 *   · Stagger 2f (~60ms). Cap a word reveal at ~24f total.
 *   · Hold ≥ 9f of stillness after each beat.
 *   · Transitions: match-cut + crossfade only. No wipes, no spins.
 *   · Travel ≤ 24px for a settle; bigger only for a real entrance from off-frame.
 *   · One "wow" per scene. In the opener that is the AUCTION punch.
 */

export const UNIT = 12; // frames — the atomic duration (0.4s @ 30fps)

export const DUR: { micro: number; enter: number; big: number; hero: number; countUp: number } = {
  micro: 6,
  enter: 12,
  big: 24,
  hero: 20,
  countUp: 30,
};

export const STAGGER = 2; // frames between grouped elements (~60ms)

/** OUT — entrances, landings, settles. cubic-bezier(0.22,1,0.36,1) ≈ easeOutQuint. */
export const OUT = Easing.bezier(0.22, 1, 0.36, 1);
/** IN — exits, accelerate-away. cubic-bezier(0.4,0,1,1). */
export const IN = Easing.bezier(0.4, 0, 1, 1);
/** MOVE — reposition while on screen (camera, a settled element sliding). */
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);

/** overshoot budget — this is the ceiling, not a target. */
export const MAX_SCALE_POP = 1.02;

// ── envelopes ────────────────────────────────────────────────────────────────

/** 0→1 entrance over `dur`, eased OUT, clamped. */
export const enterT = (frame: number, at: number, dur: number = DUR.enter) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: OUT });

/** 1→0 exit over `dur`, eased IN, clamped. */
export const exitT = (frame: number, at: number, dur: number = DUR.enter) =>
  interpolate(frame, [at, at + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: IN });

/** in → hold → out. `out` omitted = stays up. */
export const lifeT = (frame: number, at: number, out?: number, inDur = DUR.enter, outDur = DUR.enter) => {
  const i = enterT(frame, at, inDur);
  return out === undefined ? i : i * exitT(frame, out, outDur);
};

/**
 * A premium "focus-pull" reveal: opacity 0→1 + blur 10px→0, eased OUT.
 * Returns { opacity, blur } — apply blur as `filter: blur(${blur}px)`.
 * Use for punch words and scene entrances. Cheaper than it looks at ≤10px.
 */
export const focusPull = (frame: number, at: number, dur = DUR.hero) => {
  const t = enterT(frame, at, dur);
  return { opacity: t, blur: (1 - t) * 10 };
};

/** the calm settle offset: `travel`px → 0, eased OUT. Keep travel ≤ 24. */
export const settleY = (frame: number, at: number, travel = 18, dur = DUR.enter) =>
  (1 - enterT(frame, at, dur)) * travel;

/**
 * A restrained scale-pop for a landing — caps at MAX_SCALE_POP (2%).
 * 0.965 → 1.02 → 1.0. Use ONLY on the one "wow" per scene.
 */
export const landPop = (frame: number, at: number) =>
  interpolate(frame, [at, at + 6, at + 16], [0.965, MAX_SCALE_POP, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: OUT,
  });

// ── choreography primitives ─────────────────────────────────────────────────
// The creator's model (2026-09-03): every beat is a layered BUILD — the ground
// arrives, then a figure, then a prop, then the data — each with a real
// entrance (never a plain fade) and each DOING something while it is on screen
// (a hand sweeps, a card drifts, a bar fills). These make that a one-liner.

/** the standard entrance: slide up `dist`px into place while opacity snaps in
 *  fast. Returns { opacity, y } — apply as `opacity` + `translate: 0 ${y}px`. */
export const rise = (frame: number, at: number, dist = 40, dur = DUR.big) => {
  const t = enterT(frame, at, dur);
  const o = interpolate(frame, [at, at + Math.min(dur, 8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity: o, y: (1 - t) * dist };
};

/** a horizontal entrance — slides in from `fromX`px away. { opacity, x }. */
export const slideIn = (frame: number, at: number, fromX = -60, dur = DUR.big) => {
  const t = enterT(frame, at, dur);
  const o = interpolate(frame, [at, at + Math.min(dur, 8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity: o, x: (1 - t) * fromX };
};

/** an arc entrance for a packet / coin flying A→B. `p` 0..1 along the path. */
export const arc = (frame: number, at: number, dur = DUR.countUp) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: MOVE });

/** the idle for a HELD element — a slow breath on scale, ± `amp` (keep ≤ 0.02).
 *  `seed` decorrelates elements so a group doesn't pulse in unison. */
export const breathe = (frame: number, seed = 0, amp = 0.012) =>
  1 + Math.sin(frame / 46 + seed * 1.7) * amp;

/** the idle drift for a held card — a few px of wander + a hair of rotate.
 *  { x, y, rot } — apply on top of the element's resting transform. */
export const driftIdle = (frame: number, seed = 0) => ({
  x: Math.sin(frame / 58 + seed) * 3,
  y: Math.cos(frame / 71 + seed * 1.3) * 3.5,
  rot: Math.sin(frame / 90 + seed * 0.7) * 0.5,
});

/** a repeating tick — 0→1 sawtooth every `period` frames, for a mechanism that
 *  is visibly WORKING (a second hand, a meter needle, a pulse on a wire). */
export const tick = (frame: number, at: number, period = 30) => {
  if (frame < at) return 0;
  return ((frame - at) % period) / period;
};

/** a continuous rotation in degrees — `dps` degrees per second (30fps). */
export const spin = (frame: number, dps = 60) => (frame / 30) * dps;

/** N roughly-even cue frames across a beat, leaving `head` in and `tail` out.
 *  `beatCues(dur, 5)` → [h, ..., dur-tail] for quick layered choreography. */
export const beatCues = (dur: number, n: number, head = 8, tail = 24) => {
  const span = Math.max(1, dur - head - tail);
  return Array.from({ length: n }, (_, i) => Math.round(head + (span * i) / Math.max(1, n - 1)));
};
