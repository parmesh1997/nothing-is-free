import timingData from "./timing.json";

/**
 * useBeatTiming — word-level VO sync for a NIF004 beat.
 *
 * Same shape and matching logic as `nif002/timing.ts` (kept as a per-episode
 * copy rather than a shared import — the shared `V4Beat.tsx`'s own `useVO`
 * re-export is hard-wired to nif002's timing.json, so NIF004 beats call
 * `useBeatTiming` from HERE directly instead of V4Beat's re-export; see
 * this file's sibling `v4/beats.tsx` for the local `useVO` that wraps it).
 *
 * `03_transcript/timing.json` is built by `scripts/build-timing.mjs` from the
 * whisper transcript + reconcile geometry, then copied here and bundled.
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
  const find = (needle: string, nth = 0): Word | undefined => {
    const all = findAll(needle);
    return all.length ? all[Math.min(nth, all.length - 1)] : undefined;
  };

  return {
    loaded: words.length > 0,
    words,
    at: (needle: string, fallback = 0, nth = 0) => find(needle, nth)?.start ?? fallback,
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
