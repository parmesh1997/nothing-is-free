import { Audio, Sequence, staticFile, interpolate } from "remotion";

/**
 * audio.tsx — the SFX bed + music bed for the full NIF003 episode (EpisodeV4
 * only; per-beat renders stay SFX-silent by design, since cues are global-frame).
 * Mirrors src/nif002/v4/audio.tsx exactly — same mechanism, same 15-slug
 * vocabulary (these are generic documentary one-shots, not episode-specific,
 * so the exact files already sourced for NIF002 were copied straight into
 * public/audio/nif003/{sfx,music}/ rather than re-sourced).
 *
 * Levels follow the same audio-plan.md §3 convention as NIF002. Ducking under
 * the VO is a fixed −6 dB here (bundled ffmpeg can't sidechain) — for a
 * hand-mixed duck, do it in DaVinci or feed a premixed bed to a master script.
 */

export type Sfx =
  | "tap"
  | "whoosh"
  | "thunk"
  | "plip"
  | "tick"
  | "coin"
  | "stamp"
  | "drone"
  | "chime-warm"
  | "chime-bright"
  | "boom"
  | "glitch"
  | "lock"
  | "switch"
  | "footsteps";

// ─────────────────────────────────────────────────────────────────────────────
// OPT-IN, but already flipped ON — unlike NIF002 at first pass, the files are
// already sitting in public/audio/nif003/{sfx,music}/ (copied from NIF002's
// own sourced set, since these are generic UI/documentary sounds reused
// across episodes, not episode-specific). If the creator wants a different
// take for a specific slug, drop a new file at the same path/name — nothing
// here needs to change.
const ALL_SFX = true;
const HAVE: readonly Sfx[] = [];
// MUSIC removed from the Remotion render (creator 2026-09-06: "the music is
// too loud — remove it, we'll do it in DaVinci Resolve"). The bed file still
// sits in public/audio/nif003/music/ for reference; MusicBed is a no-op.
const MUSIC = false;
const EXT = ".mp3";
// NIF003-SFX stem composition forces SFX on regardless of ALL_SFX:
export const SFX_STEM = true;
// Master SFX bus gain applied to the per-beat <BeatSfx> layer (linear, not dB).
// The cue-level gains in NIF003_SFX (g: −13…−19) already balance the one-shots
// against each other; this is the single knob for the whole SFX bed vs the VO.
// 1.0 = as baked. The creator rides the final SFX level in DaVinci Resolve
// (or drops the NIF003-SFX stem on its own Fairlight track), so keep this at
// unity unless a rough-playback pass needs the accents louder.
export const SFX_BUS = 1;
// ─────────────────────────────────────────────────────────────────────────────

const has = (s: Sfx, force = false) => force || ALL_SFX || HAVE.includes(s);
const anySfx = (force = false) => force || ALL_SFX || HAVE.length > 0;
const db = (d: number) => 10 ** (d / 20);
const sfxUrl = (s: Sfx) => staticFile(`audio/nif003/sfx/${s}${EXT}`);

/** one SFX cue — `at` is a frame LOCAL to its beat, `g` is dB under 0 (VO ≈ 0). */
export type SfxCue = { at: number; s: Sfx; g?: number };

/** Per-beat SFX cue sheet (2026-09-06 rebuild). LOCAL frames, matches
 *  `08_conform/NIF003-sfx-cues.md` and the rebuilt beats.tsx sync points.
 *  Rendered INTO each per-beat comp via <BeatSfx> (creator: "SFX by beat"). */
export const NIF003_SFX: Record<string, SfxCue[]> = {
  B00: [{ at: 2, s: "whoosh", g: -15 }, { at: 16, s: "tap", g: -17 }, { at: 111, s: "switch", g: -14 }, { at: 199, s: "coin", g: -15 }, { at: 204, s: "coin", g: -15 }, { at: 209, s: "coin", g: -15 }, { at: 214, s: "coin", g: -15 }, { at: 206, s: "boom", g: -13 }, { at: 213, s: "plip", g: -18 }, { at: 218, s: "plip", g: -18 }, { at: 223, s: "plip", g: -18 }, { at: 228, s: "plip", g: -18 }],
  B01: [{ at: 6, s: "whoosh", g: -15 }, { at: 26, s: "tap", g: -17 }, { at: 58, s: "thunk", g: -15 }, { at: 62, s: "switch", g: -15 }, { at: 108, s: "tap", g: -17 }, { at: 230, s: "thunk", g: -15 }, { at: 305, s: "plip", g: -17 }, { at: 326, s: "coin", g: -15 }, { at: 359, s: "plip", g: -17 }, { at: 384, s: "coin", g: -15 }, { at: 439, s: "plip", g: -17 }, { at: 487, s: "coin", g: -15 }, { at: 540, s: "plip", g: -17 }, { at: 578, s: "coin", g: -15 }, { at: 706, s: "chime-bright", g: -13 }, { at: 936, s: "plip", g: -19 }, { at: 950, s: "plip", g: -19 }, { at: 964, s: "plip", g: -19 }, { at: 979, s: "tick", g: -18 }, { at: 1000, s: "tick", g: -18 }, { at: 1021, s: "tick", g: -18 }],
  B02: [{ at: 2, s: "whoosh", g: -16 }, { at: 18, s: "tap", g: -17 }, { at: 216, s: "thunk", g: -16 }, { at: 351, s: "thunk", g: -16 }, { at: 517, s: "thunk", g: -16 }, { at: 771, s: "plip", g: -18 }, { at: 787, s: "plip", g: -18 }, { at: 803, s: "plip", g: -18 }, { at: 947, s: "stamp", g: -14 }, { at: 1073, s: "stamp", g: -14 }, { at: 1251, s: "tap", g: -16 }],
  B03: [{ at: 108, s: "whoosh", g: -16 }, { at: 244, s: "stamp", g: -14 }, { at: 460, s: "tap", g: -17 }, { at: 474, s: "tap", g: -17 }, { at: 488, s: "tap", g: -17 }, { at: 826, s: "boom", g: -13 }],
  B04: [{ at: 131, s: "whoosh", g: -16 }, { at: 492, s: "thunk", g: -15 }, { at: 623, s: "stamp", g: -12 }, { at: 822, s: "whoosh", g: -16 }, { at: 884, s: "plip", g: -17 }, { at: 1101, s: "plip", g: -17 }, { at: 1554, s: "stamp", g: -13 }],
  B05: [{ at: 107, s: "plip", g: -19 }, { at: 227, s: "plip", g: -19 }, { at: 307, s: "plip", g: -18 }, { at: 387, s: "plip", g: -18 }, { at: 441, s: "boom", g: -12 }, { at: 989, s: "thunk", g: -15 }, { at: 1307, s: "plip", g: -16 }],
  B06: [{ at: 40, s: "thunk", g: -16 }, { at: 263, s: "plip", g: -17 }, { at: 597, s: "boom", g: -13 }, { at: 750, s: "stamp", g: -13 }, { at: 1373, s: "thunk", g: -16 }, { at: 1495, s: "coin", g: -14 }],
  B07: [{ at: 382, s: "glitch", g: -14 }, { at: 384, s: "drone", g: -15 }, { at: 382, s: "switch", g: -15 }, { at: 984, s: "stamp", g: -12 }],
  B08: [{ at: 124, s: "tap", g: -16 }, { at: 204, s: "glitch", g: -15 }, { at: 333, s: "switch", g: -15 }, { at: 349, s: "switch", g: -15 }, { at: 365, s: "switch", g: -15 }, { at: 381, s: "switch", g: -15 }, { at: 520, s: "boom", g: -12 }, { at: 800, s: "boom", g: -12 }, { at: 888, s: "chime-bright", g: -13 }],
  B09: [{ at: 137, s: "stamp", g: -14 }, { at: 160, s: "plip", g: -17 }, { at: 223, s: "whoosh", g: -16 }, { at: 256, s: "whoosh", g: -16 }, { at: 283, s: "glitch", g: -15 }, { at: 407, s: "boom", g: -13 }, { at: 570, s: "plip", g: -17 }, { at: 588, s: "plip", g: -17 }, { at: 606, s: "plip", g: -17 }, { at: 921, s: "boom", g: -12 }, { at: 1082, s: "chime-warm", g: -18 }],
  B10: [{ at: 131, s: "stamp", g: -14 }, { at: 203, s: "whoosh", g: -16 }, { at: 230, s: "whoosh", g: -16 }, { at: 387, s: "switch", g: -17 }, { at: 723, s: "plip", g: -18 }, { at: 1058, s: "whoosh", g: -14 }, { at: 1070, s: "thunk", g: -14 }, { at: 1080, s: "thunk", g: -14 }, { at: 1090, s: "thunk", g: -14 }, { at: 1649, s: "stamp", g: -11 }],
  B11: [{ at: 10, s: "thunk", g: -16 }, { at: 175, s: "glitch", g: -15 }, { at: 235, s: "whoosh", g: -16 }, { at: 650, s: "plip", g: -18 }, { at: 800, s: "thunk", g: -15 }, { at: 1258, s: "stamp", g: -13 }],
  B12: [{ at: 8, s: "chime-bright", g: -13 }, { at: 471, s: "whoosh", g: -16 }],
  B13: [{ at: 6, s: "thunk", g: -16 }, { at: 571, s: "boom", g: -13 }, { at: 794, s: "plip", g: -18 }, { at: 827, s: "plip", g: -18 }, { at: 886, s: "plip", g: -18 }],
  B14: [{ at: 125, s: "thunk", g: -16 }, { at: 286, s: "boom", g: -13 }, { at: 756, s: "plip", g: -18 }, { at: 776, s: "stamp", g: -14 }, { at: 889, s: "stamp", g: -13 }],
  B15: [{ at: 247, s: "boom", g: -11 }, { at: 446, s: "tap", g: -19 }],
  B16: [{ at: 8, s: "thunk", g: -16 }, { at: 200, s: "tap", g: -16 }, { at: 206, s: "switch", g: -15 }, { at: 465, s: "plip", g: -18 }, { at: 505, s: "glitch", g: -16 }, { at: 776, s: "stamp", g: -12 }],
  B17: [{ at: 40, s: "plip", g: -19 }, { at: 60, s: "plip", g: -19 }, { at: 80, s: "plip", g: -19 }, { at: 100, s: "plip", g: -18 }, { at: 120, s: "plip", g: -18 }, { at: 140, s: "plip", g: -18 }, { at: 160, s: "plip", g: -17 }, { at: 180, s: "plip", g: -17 }, { at: 200, s: "plip", g: -17 }, { at: 870, s: "thunk", g: -15 }, { at: 1426, s: "glitch", g: -14 }, { at: 1360, s: "boom", g: -10 }, { at: 1365, s: "drone", g: -14 }, { at: 1763, s: "stamp", g: -12 }],
  B18: [{ at: 30, s: "tap", g: -19 }, { at: 46, s: "tap", g: -19 }, { at: 142, s: "chime-bright", g: -15 }, { at: 519, s: "plip", g: -17 }, { at: 695, s: "boom", g: -15 }],
  B19: [{ at: 156, s: "thunk", g: -15 }, { at: 488, s: "thunk", g: -15 }, { at: 795, s: "stamp", g: -13 }, { at: 1115, s: "boom", g: -13 }],
  B20: [{ at: 40, s: "tap", g: -19 }, { at: 313, s: "plip", g: -17 }, { at: 330, s: "whoosh", g: -17 }, { at: 360, s: "whoosh", g: -17 }, { at: 572, s: "stamp", g: -13 }],
  B21: [{ at: 40, s: "tap", g: -19 }, { at: 311, s: "boom", g: -12 }, { at: 569, s: "stamp", g: -13 }, { at: 585, s: "plip", g: -18 }, { at: 600, s: "plip", g: -18 }],
  B22: [{ at: 307, s: "lock", g: -14 }, { at: 511, s: "lock", g: -14 }, { at: 650, s: "lock", g: -14 }, { at: 1166, s: "stamp", g: -12 }],
  B23: [{ at: 182, s: "whoosh", g: -15 }, { at: 200, s: "thunk", g: -14 }, { at: 437, s: "boom", g: -12 }],
  B24: [{ at: 206, s: "plip", g: -18 }, { at: 616, s: "boom", g: -12 }, { at: 907, s: "stamp", g: -13 }],
  B25: [{ at: 191, s: "thunk", g: -16 }, { at: 213, s: "thunk", g: -16 }, { at: 235, s: "thunk", g: -15 }, { at: 562, s: "stamp", g: -12 }, { at: 566, s: "lock", g: -13 }, { at: 1483, s: "boom", g: -10 }],
  B26: [{ at: 202, s: "switch", g: -15 }, { at: 278, s: "chime-warm", g: -18 }, { at: 511, s: "chime-warm", g: -18 }, { at: 840, s: "chime-warm", g: -16 }],
  B27: [{ at: 290, s: "thunk", g: -16 }, { at: 314, s: "thunk", g: -16 }, { at: 338, s: "thunk", g: -15 }, { at: 756, s: "stamp", g: -12 }],
  B28: [{ at: 92, s: "thunk", g: -16 }, { at: 427, s: "thunk", g: -15 }, { at: 672, s: "thunk", g: -14 }, { at: 929, s: "thunk", g: -14 }, { at: 1120, s: "boom", g: -11 }, { at: 1128, s: "coin", g: -14 }],
  // B29 — THE REVERSAL. The Dark-Law crossfade at ~f1335 = music stops (n/a,
  // music removed) + a low drone hit; the unfilled YOU node lands in silence.
  B29: [{ at: 690, s: "coin", g: -15 }, { at: 745, s: "coin", g: -15 }, { at: 797, s: "coin", g: -15 }, { at: 868, s: "coin", g: -15 }, { at: 922, s: "coin", g: -15 }, { at: 1335, s: "drone", g: -12 }, { at: 1360, s: "tick", g: -20 }],
  B30: [{ at: 283, s: "whoosh", g: -17 }, { at: 851, s: "thunk", g: -14 }],
  B31: [{ at: 338, s: "whoosh", g: -16 }, { at: 378, s: "tap", g: -17 }, { at: 518, s: "stamp", g: -13 }, { at: 623, s: "plip", g: -17 }],
  B32: [{ at: 125, s: "chime-bright", g: -12 }, { at: 350, s: "tick", g: -18 }, { at: 495, s: "coin", g: -13 }],
};

/** each beat's globalStartFrame (from Root.tsx / reconcile.json) — used to
 *  compose the per-beat cues into the full-episode SFX stem. */
export const BEAT_STARTS: Record<string, number> = {
  B00: 0, B01: 311, B02: 1375, B03: 2924, B04: 4115, B05: 5794, B06: 7204, B07: 8914,
  B08: 9923, B09: 10968, B10: 12313, B11: 13985, B12: 15270, B13: 15850, B14: 16830,
  B15: 17964, B16: 18851, B17: 20211, B18: 22072, B19: 22971, B20: 24134, B21: 24848,
  B22: 25625, B23: 26843, B24: 27769, B25: 28697, B26: 30210, B27: 31222, B28: 32051,
  B29: 33456, B30: 34998, B31: 35890, B32: 36595,
};

/** the per-beat SFX layer — rendered inside each NIF003 beat comp by V4Beat,
 *  so `render-beats-nif003.mjs` output carries the SFX (creator, §22.7).
 *  Plays ONE pre-baked mix per beat (`scripts/build-sfx-mix.mjs` → the cues
 *  in NIF003_SFX, summed with per-cue delays/gains into sfx-mix/B##.mp3).
 *  One <Audio> instead of ~20 avoids the Chrome-tab crash on full renders. */
export const BeatSfx: React.FC<{ beat: string }> = ({ beat }) => {
  const id = beat.replace(/v4$/i, "");
  if (!ALL_SFX || !NIF003_SFX[id]) return null;
  return (
    <Audio
      src={staticFile(`audio/nif003/sfx-mix/${id}.mp3`)}
      volume={SFX_BUS}
      delayRenderTimeoutInMilliseconds={30_000}
    />
  );
};

/** SFX one-shots. Renders nothing until opted in. `force` (the NIF003-SFX
 *  stem comp) renders every cue regardless of the ALL_SFX flag. */
export const SfxTrack: React.FC<{ force?: boolean }> = ({ force = false }) => {
  if (!anySfx(force)) return null;
  // compose the per-beat cue tables into episode-global frames
  const all: { f: number; s: Sfx; g?: number }[] = [];
  for (const [beat, cues] of Object.entries(NIF003_SFX)) {
    const start = BEAT_STARTS[beat] ?? 0;
    for (const c of cues) if (has(c.s, force)) all.push({ f: start + Math.max(0, c.at), s: c.s, g: c.g });
  }
  return (
    <>
      {all.map((c, i) => (
        <Sequence key={i} from={c.f} durationInFrames={200} name={`sfx:${c.s}`}>
          <Audio src={sfxUrl(c.s)} volume={db(c.g ?? -14)} delayRenderTimeoutInMilliseconds={30_000} />
        </Sequence>
      ))}
    </>
  );
};

/** The SFX-only stem — a full-length composition of just the SFX, no picture,
 *  for Resolve to drop on one Fairlight track. Render `NIF003-SFX` to a .wav. */
export const SfxStem: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#000" }}>
    <SfxTrack force />
  </div>
);

/**
 * One ambient bed under the whole episode. Ducked −6 dB baseline, with two
 * moves mirroring NIF002's own reversal-swell convention:
 *   • B25 cut-to-black (f 28697) → dip to silence briefly, then a bare drone level
 *   • B29's "YOU" node lands (f 34791) → swell, the one musical moment
 *   • B32 "SUBSCRIBE" (f 36720) → lift, resolve
 *   • last 2s → fade out
 */
export const MusicBed: React.FC = () => {
  const total = 37230;
  if (!MUSIC) return null;
  return (
    <Audio
      src={staticFile(`audio/nif003/music/bed${EXT}`)}
      loop
      delayRenderTimeoutInMilliseconds={60_000}
      volume={(f) => {
        const base = db(-6); // ducked bed
        // B25 dip to black then a bare drone level
        if (f >= 28697 && f < 28697 + 240)
          return interpolate(f, [28697, 28697 + 45], [base, 0], { extrapolateRight: "clamp" });
        if (f >= 28697 + 240 && f < 28697 + 1153) return db(-14);
        // the swell as the chain relights and the final "YOU" node lands
        if (f >= 33456 + 1200 && f < 34998)
          return interpolate(f, [33456 + 1200, 33456 + 1260, 33456 + 1460, 34998], [db(-14), db(-2), db(-2), db(-9)]);
        // B32 CTA lift + resolve
        if (f >= 36595 + 60 && f < total - 60)
          return interpolate(f, [36595 + 60, 36595 + 125], [base, db(-3)], { extrapolateLeft: "clamp" });
        // outro fade
        if (f >= total - 60) return interpolate(f, [total - 60, total - 6], [base, 0], { extrapolateRight: "clamp" });
        return base;
      }}
    />
  );
};

export const AUDIO_ENABLED = MUSIC || ALL_SFX || HAVE.length > 0;
