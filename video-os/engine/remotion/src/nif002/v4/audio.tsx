import { Audio, Sequence, staticFile, interpolate } from "remotion";

/**
 * audio.tsx — the SFX bed + music bed for the full episode (EpisodeV4 only;
 * per-beat renders stay SFX-silent by design, since cues are global-frame).
 *
 * NOTHING renders until you add files + opt in:
 *   1. drop files in  public/audio/nif002/sfx/<slug>.mp3  and  music/bed.mp3
 *      (slugs + where to get them: episodes/NIF002/08_conform/AUDIO-GET-THESE.md)
 *   2. set HAVE below to the slugs you added (or "*" for all), MUSIC = true
 *   3. re-render:  node scripts/render-v4.mjs   then   node scripts/master-v4.mjs
 *
 * Levels follow episodes/NIF002/08_conform/audio-plan.md §3. Ducking under the
 * VO is a fixed −6 dB here (bundled ffmpeg can't sidechain) — for a hand-mixed
 * duck, do it in DaVinci or feed a premixed bed to master-v4.mjs --music.
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
// OPT-IN.  Creator 2026-09-04: the MUSIC + SFX MIX is done in DaVinci Resolve
// (Fairlight — dynamic ducking, level automation, AI tools), NOT baked flat
// here, so it can be ridden. So both are OFF for the main NIF002-V4 render
// (VO stays baked — it's whisper-timed to the picture and level-stable).
// The SFX still bake into the `NIF002-SFX` composition (SFX_STEM below) so
// Resolve gets one pre-placed stem to drop on a Fairlight track.
const ALL_SFX = false; // OFF for NIF002-V4
const HAVE: readonly Sfx[] = [];
const MUSIC = false; // OFF for NIF002-V4 — Resolve loops public/audio/nif002/music/bed.mp3
const EXT = ".mp3";
// NIF002-SFX stem composition forces SFX on regardless of ALL_SFX:
export const SFX_STEM = true;
// ─────────────────────────────────────────────────────────────────────────────

const has = (s: Sfx, force = false) => force || ALL_SFX || HAVE.includes(s);
const anySfx = (force = false) => force || ALL_SFX || HAVE.length > 0;
const db = (d: number) => 10 ** (d / 20);
const sfxUrl = (s: Sfx) => staticFile(`audio/nif002/sfx/${s}${EXT}`);

/** one SFX cue: episode-global frame, slug, gain in dB under 0 (VO ≈ 0). */
type Cue = { f: number; s: Sfx; g?: number };

// Cue sheet — the load-bearing ~55 of the ~90 in audio-plan.md. Global frames
// (EpisodeV4 TABLE starts). Keep it quiet: this is documentary, not a game.
const CUES: Cue[] = [
  // B00  start 0
  { f: 6, s: "plip", g: -20 },
  { f: 60, s: "plip", g: -20 },
  { f: 110, s: "plip", g: -20 },
  { f: 150, s: "whoosh", g: -16 },
  { f: 205, s: "chime-warm", g: -17 },
  // B01  start 277
  { f: 277 + 155, s: "tap", g: -14 },
  { f: 277 + 266, s: "whoosh", g: -15 },
  { f: 277 + 364, s: "plip", g: -19 },
  { f: 277 + 520, s: "coin", g: -15 },
  { f: 277 + 845, s: "thunk", g: -17 },
  { f: 277 + 915, s: "thunk", g: -17 },
  { f: 277 + 985, s: "thunk", g: -17 },
  // B02  start 1411
  { f: 1411 + 100, s: "tap", g: -14 },
  { f: 1411 + 210, s: "plip", g: -18 },
  { f: 1411 + 1035, s: "coin", g: -16 },
  { f: 1411 + 1075, s: "coin", g: -16 },
  // B03  start 2564
  { f: 2564 + 390, s: "whoosh", g: -16 },
  { f: 2564 + 1016, s: "plip", g: -22 },
  // B04  start 3696
  { f: 3696 + 40, s: "tap", g: -14 },
  { f: 3696 + 205, s: "whoosh", g: -15 },
  { f: 3696 + 432, s: "plip", g: -19 },
  { f: 3696 + 961, s: "tap", g: -15 },
  { f: 3696 + 1108, s: "whoosh", g: -14 },
  { f: 3696 + 1286, s: "boom", g: -12 },
  // B05  start 5038
  { f: 5038 + 503, s: "plip", g: -19 },
  { f: 5038 + 560, s: "plip", g: -19 },
  { f: 5038 + 620, s: "plip", g: -19 },
  { f: 5038 + 1130, s: "whoosh", g: -17 },
  { f: 5038 + 1448, s: "thunk", g: -15 },
  // B06  start 6515
  { f: 6515 + 46, s: "drone", g: -20 },
  { f: 6515 + 262, s: "plip", g: -19 },
  { f: 6515 + 611, s: "tap", g: -14 },
  // B07  start 7356
  { f: 7356 + 178, s: "plip", g: -19 },
  { f: 7356 + 427, s: "tap", g: -15 },
  { f: 7356 + 497, s: "tap", g: -15 },
  { f: 7356 + 567, s: "tap", g: -15 },
  { f: 7356 + 1108, s: "glitch", g: -16 },
  { f: 7356 + 1182, s: "drone", g: -19 },
  // B08  start 8622
  { f: 8622 + 127, s: "thunk", g: -16 },
  { f: 8622 + 282, s: "thunk", g: -16 },
  { f: 8622 + 383, s: "thunk", g: -16 },
  { f: 8622 + 623, s: "whoosh", g: -15 },
  { f: 8622 + 1090, s: "boom", g: -12 },
  // B09  start 9727
  { f: 9727 + 296, s: "thunk", g: -16 },
  { f: 9727 + 581, s: "plip", g: -18 },
  { f: 9727 + 946, s: "chime-warm", g: -16 },
  // B10  start 10714
  { f: 10714 + 280, s: "whoosh", g: -20 },
  { f: 10714 + 1018, s: "boom", g: -11 },
  // B11  start 11843
  { f: 11843 + 350, s: "tap", g: -16 },
  { f: 11843 + 508, s: "coin", g: -16 },
  { f: 11843 + 620, s: "coin", g: -16 },
  { f: 11843 + 730, s: "coin", g: -16 },
  { f: 11843 + 944, s: "thunk", g: -15 },
  // B12  start 12835
  { f: 12835 + 150, s: "tap", g: -16 },
  { f: 12835 + 220, s: "tap", g: -16 },
  { f: 12835 + 290, s: "tap", g: -16 },
  { f: 12835 + 334, s: "whoosh", g: -15 },
  { f: 12835 + 1102, s: "boom", g: -13 },
  // B13  start 13978
  { f: 13978 + 236, s: "stamp", g: -16 },
  { f: 13978 + 525, s: "stamp", g: -16 },
  { f: 13978 + 1142, s: "stamp", g: -14 },
  // B14  start 15621
  { f: 15621 + 341, s: "plip", g: -19 },
  { f: 15621 + 551, s: "whoosh", g: -16 },
  { f: 15621 + 970, s: "drone", g: -18 },
  // B15  start 16628
  { f: 16628 + 126, s: "thunk", g: -15 },
  { f: 16628 + 279, s: "whoosh", g: -16 },
  { f: 16628 + 660, s: "boom", g: -13 },
  // B16  start 17464
  { f: 17464 + 194, s: "tap", g: -14 },
  { f: 17464 + 302, s: "whoosh", g: -16 },
  { f: 17464 + 698, s: "thunk", g: -15 },
  // B17  start 18245
  { f: 18245 + 102, s: "tap", g: -15 },
  { f: 18245 + 124, s: "tap", g: -15 },
  { f: 18245 + 146, s: "tap", g: -15 },
  { f: 18245 + 434, s: "drone", g: -18 },
  { f: 18245 + 530, s: "whoosh", g: -15 },
  // B18  start 18798
  { f: 18798 + 128, s: "tap", g: -14 },
  { f: 18798 + 632, s: "boom", g: -13 },
  // B19  start 19471
  { f: 19471 + 230, s: "whoosh", g: -15 },
  { f: 19471 + 311, s: "plip", g: -19 },
  { f: 19471 + 673, s: "lock", g: -15 },
  { f: 19471 + 982, s: "thunk", g: -16 },
  { f: 19471 + 1257, s: "thunk", g: -16 },
  { f: 19471 + 1510, s: "stamp", g: -13 },
  // B20  start 21018
  { f: 21018 + 300, s: "plip", g: -19 },
  { f: 21018 + 1239, s: "boom", g: -13 },
  // B21  start 22284
  { f: 22284 + 647, s: "lock", g: -14 },
  { f: 22284 + 946, s: "lock", g: -14 },
  { f: 22284 + 1090, s: "lock", g: -14 },
  { f: 22284 + 1378, s: "boom", g: -9 },
  // B22  start 23691
  { f: 23691 + 123, s: "plip", g: -16 },
  { f: 23691 + 246, s: "switch", g: -14 },
  { f: 23691 + 393, s: "whoosh", g: -16 },
  { f: 23691 + 972, s: "chime-bright", g: -14 },
  // B23  start 24703
  { f: 24703 + 123, s: "stamp", g: -15 },
  { f: 24703 + 344, s: "stamp", g: -13 },
  { f: 24703 + 364, s: "stamp", g: -13 },
  { f: 24703 + 924, s: "boom", g: -11 },
  // B24  start 25638
  { f: 25638 + 903, s: "plip", g: -20 },
  { f: 25638 + 1208, s: "glitch", g: -17 },
  { f: 25638 + 1275, s: "boom", g: -13 },
  // B25  start 26969  — the reversal
  { f: 26969 + 240, s: "drone", g: -15 },
  { f: 26969 + 589, s: "tick", g: -20 },
  { f: 26969 + 1019, s: "boom", g: -7 },
  { f: 26969 + 1230, s: "boom", g: -16 },
  // B26  start 28389
  { f: 28389 + 78, s: "glitch", g: -15 },
  { f: 28389 + 174, s: "glitch", g: -17 },
  { f: 28389 + 512, s: "plip", g: -19 },
  { f: 28389 + 770, s: "switch", g: -14 },
  { f: 28389 + 902, s: "whoosh", g: -16 },
  { f: 28389 + 984, s: "thunk", g: -15 },
  // B27  start 29434
  { f: 29434 + 221, s: "plip", g: -18 },
  { f: 29434 + 628, s: "chime-warm", g: -16 },
  { f: 29434 + 784, s: "thunk", g: -16 },
  { f: 29434 + 1042, s: "chime-bright", g: -12 },
];

// clock-tick loops (start, end) — B01, B03, B07 running clocks
const TICK_LOOPS: [number, number][] = [
  [277 + 285, 277 + 600],
  [2564 + 794, 2564 + 950],
  [7356 + 430, 7356 + 1160],
];

/** SFX one-shots + tick loops. Renders nothing until opted in. `force` (the
 *  NIF002-SFX stem comp) renders every cue regardless of the ALL_SFX flag. */
export const SfxTrack: React.FC<{ force?: boolean }> = ({ force = false }) => {
  if (!anySfx(force)) return null;
  return (
    <>
      {CUES.filter((c) => has(c.s, force)).map((c, i) => (
        <Sequence
          key={`c${i}`}
          from={c.f}
          durationInFrames={300}
          name={`sfx:${c.s}`}
        >
          <Audio
            src={sfxUrl(c.s)}
            volume={db(c.g ?? -16)}
            delayRenderTimeoutInMilliseconds={30_000}
          />
        </Sequence>
      ))}
      {has("tick", force) &&
        TICK_LOOPS.map(([a, b], i) => (
          <Sequence
            key={`t${i}`}
            from={a}
            durationInFrames={b - a}
            name="sfx:tick-loop"
          >
            <Audio
              src={sfxUrl("tick")}
              loop
              volume={db(-21)}
              delayRenderTimeoutInMilliseconds={30_000}
            />
          </Sequence>
        ))}
      {has("footsteps", force) && (
        <Sequence from={10714 + 40} durationInFrames={930} name="sfx:footsteps">
          <Audio
            src={sfxUrl("footsteps")}
            loop
            volume={db(-24)}
            delayRenderTimeoutInMilliseconds={30_000}
          />
        </Sequence>
      )}
    </>
  );
};

/** The SFX-only stem — a full-length composition of just the SFX, no picture,
 *  for Resolve to drop on one Fairlight track. `node scripts/render-v4.mjs`
 *  won't build it; render `NIF002-SFX` to a .wav. */
export const SfxStem: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#000" }}>
    <SfxTrack force />
  </div>
);

/**
 * One ambient bed under the whole episode. Ducked −6 dB baseline (assume VO
 * almost always present), with the audio-plan.md moves:
 *   • B25 cut-to-black (f 26969) → dip to silence ~1.5s, then low drone level
 *   • "YOU ARE THE INVENTORY" (f 27988) → swell +4 dB, the one musical moment
 *   • B27 "SUBSCRIBE" (f 30476) → lift +3 dB, resolve
 *   • last 2s → fade out
 */
export const MusicBed: React.FC = () => {
  const total = 30573;
  if (!MUSIC) return null;
  return (
    <Audio
      src={staticFile(`audio/nif002/music/bed${EXT}`)}
      loop
      delayRenderTimeoutInMilliseconds={60_000}
      volume={(f) => {
        const base = db(-6); // ducked bed
        // B25 dip to black then a bare drone level
        if (f >= 26969 && f < 26969 + 240)
          return interpolate(f, [26969, 26969 + 45], [base, 0], {
            extrapolateRight: "clamp",
          });
        if (f >= 26969 + 240 && f < 27988) return db(-14);
        // the swell on YOU ARE THE INVENTORY, hold under the title, tail down
        if (f >= 27988 && f < 28389)
          return interpolate(
            f,
            [27988, 28040, 28260, 28389],
            [db(-14), db(-2), db(-2), db(-9)],
          );
        // B27 CTA lift + resolve
        if (f >= 30300 && f < total - 60)
          return interpolate(f, [30300, 30476], [base, db(-3)], {
            extrapolateLeft: "clamp",
          });
        // outro fade
        if (f >= total - 60)
          return interpolate(f, [total - 60, total - 6], [base, 0], {
            extrapolateRight: "clamp",
          });
        return base;
      }}
    />
  );
};

export const AUDIO_ENABLED = MUSIC || ALL_SFX || HAVE.length > 0;
