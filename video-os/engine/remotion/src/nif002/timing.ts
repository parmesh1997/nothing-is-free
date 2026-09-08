import timingData from "./timing.json";

/**
 * useBeatTiming — word-level VO sync for a beat (v2.0 Step 4).
 *
 * `03_transcript/timing.json` is built by `scripts/build-timing.mjs` from the
 * whisper transcript + reconcile geometry, then copied to `src/nif002/timing.json`
 * and bundled. A beat calls:
 *
 *   const vo = useBeatTiming("B01");
 *   vo.at("auction")          // local frame the word "auction" is first spoken
 *   vo.after("finishes", 6)   // 6 frames after "finishes" ends
 *   vo.phrase("who", "price") // [start of "who", end of "price"] — a span
 *
 * All lookups take a `fallback` (frame) used when the word isn't found or
 * timing.json is still the stub — so a beat degrades to hand-set frames rather
 * than breaking.
 */
type Word = { key: string; start: number; end: number; t: string; conf: number | null };
type BeatTiming = { durationInFrames: number; globalStartFrame: number; words: Word[]; lowConfidence: string[] };

const DATA = timingData as { beats: Record<string, BeatTiming> };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export const timingLoaded = (beatId: string): boolean =>
  (DATA.beats[beatId]?.words?.length ?? 0) > 0;

export const useBeatTiming = (beatId: string) => {
  const b = DATA.beats[beatId];
  const words: Word[] = b?.words ?? [];

  /** all occurrences of a word, in spoken order. Exact match first, then
   *  prefix, then (needle ≥ 4 chars) substring. Never matches short/empty. */
  const findAll = (needle: string): Word[] => {
    const k = norm(needle);
    if (!k) return [];
    const exact = words.filter((w) => w.key === k);
    if (exact.length) return exact;
    const prefix = words.filter((w) => w.key.startsWith(k) || k.startsWith(w.key));
    if (prefix.length) return prefix;
    if (k.length >= 4) {
      const sub = words.filter((w) => w.key.includes(k));
      if (sub.length) return sub;
    }
    return [];
  };
  /** nth occurrence (0-based). */
  const find = (needle: string, nth = 0): Word | undefined => {
    const all = findAll(needle);
    return all.length ? all[Math.min(nth, all.length - 1)] : undefined;
  };

  return {
    loaded: words.length > 0,
    words,
    at: (needle: string, fallback = 0, nth = 0) => find(needle, nth)?.start ?? fallback,
    /** the LAST time a word is spoken — for a closing punch, whose emphasis
     *  word is almost always the final utterance (creator 2026-09-04: punches
     *  were firing on an early occurrence). If the word recurs within `guard`
     *  frames of the fallback, that's a good sign; otherwise the fallback wins
     *  when the last hit is implausibly far from it. */
    atLast: (needle: string, fallback = 0) => {
      const all = findAll(needle);
      if (!all.length) return fallback;
      const last = all[all.length - 1].start;
      return Math.abs(last - fallback) > 400 ? fallback : last;
    },
    end: (needle: string, fallback = 0, nth = 0) => find(needle, nth)?.end ?? fallback,
    after: (needle: string, n = 0, fallback = 0, nth = 0) => (find(needle, nth)?.end ?? fallback) + n,
    phrase: (a: string, z: string, fb: [number, number] = [0, 0]): [number, number] => {
      const first = find(a);
      const last = find(z);
      return [first?.start ?? fb[0], last?.end ?? fb[1]];
    },
  };
};
