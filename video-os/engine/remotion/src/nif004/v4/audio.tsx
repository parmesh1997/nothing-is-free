import { Audio, Sequence, staticFile } from "remotion";

/**
 * audio.tsx — NIF004 per-beat SFX (same mechanism as nif003/v4/audio.tsx).
 * The 16-slug generic documentary one-shot set, reused; files copied into
 * public/audio/nif004/sfx/ from nif003's set (they're not episode-specific).
 *
 * NO MUSIC in the render (creator, runbook §22.7 — music bed is added in
 * DaVinci Resolve). Subtitles + transitions are Resolve's too.
 *
 * `NIF004_SFX[beat]` = cues at LOCAL frames. `scripts/build-sfx-mix.mjs` bakes
 * each beat's cues into one `public/audio/nif004/sfx-mix/B##.mp3`; `<BeatSfx>`
 * plays that one file next to the VO so each per-beat render carries its sound.
 */

export type Sfx =
  | "tap" | "whoosh" | "thunk" | "plip" | "tick" | "coin" | "stamp"
  | "drone" | "chime-warm" | "chime-bright" | "boom" | "glitch" | "lock"
  | "switch" | "footsteps";

const ALL_SFX = true;
export const SFX_BUS = 1;
const EXT = ".mp3";

export type SfxCue = { at: number; s: Sfx; g?: number };

/** Per-beat SFX cue sheet. LOCAL frames. Populated as each beat is built +
 *  audited (runbook §22.7 — SFX per beat, tied to what happens on screen). */
export const NIF004_SFX: Record<string, SfxCue[]> = {
  // cues re-timed to the beats.tsx visual schedule (2026-09-09) — s(frac)·dur
  B00: [{ at: 8, s: "whoosh", g: -15 }, { at: 40, s: "tick", g: -20 }, { at: 200, s: "boom", g: -15 }],
  B01: [{ at: 123, s: "whoosh", g: -16 }, { at: 135, s: "plip", g: -16 }, { at: 151, s: "plip", g: -16 }, { at: 485, s: "plip", g: -15 }, { at: 759, s: "boom", g: -13 }],
  B02: [{ at: 152, s: "whoosh", g: -16 }, { at: 178, s: "plip", g: -17 }, { at: 548, s: "thunk", g: -14 }, { at: 942, s: "stamp", g: -13 }],
  B03: [{ at: 53, s: "thunk", g: -15 }, { at: 63, s: "thunk", g: -15 }, { at: 73, s: "thunk", g: -15 }, { at: 407, s: "boom", g: -13 }],
  B04: [{ at: 54, s: "whoosh", g: -16 }, { at: 140, s: "coin", g: -16 }, { at: 280, s: "coin", g: -16 }, { at: 649, s: "stamp", g: -13 }],
  B05: [{ at: 22, s: "stamp", g: -13 }, { at: 230, s: "whoosh", g: -16 }, { at: 443, s: "thunk", g: -14 }, { at: 462, s: "tick", g: -18 }, { at: 797, s: "stamp", g: -13 }],
  B06: [{ at: 259, s: "thunk", g: -15 }, { at: 367, s: "thunk", g: -15 }, { at: 453, s: "boom", g: -13 }, { at: 475, s: "stamp", g: -13 }],
  B07: [{ at: 72, s: "thunk", g: -15 }, { at: 180, s: "thunk", g: -15 }, { at: 306, s: "tap", g: -16 }, { at: 346, s: "tap", g: -17 }, { at: 386, s: "tap", g: -17 }, { at: 739, s: "stamp", g: -13 }],
  B08: [{ at: 167, s: "whoosh", g: -16 }, { at: 405, s: "whoosh", g: -17 }, { at: 667, s: "boom", g: -13 }, { at: 905, s: "stamp", g: -13 }],
  B09: [{ at: 67, s: "whoosh", g: -16 }, { at: 150, s: "footsteps", g: -16 }, { at: 400, s: "footsteps", g: -16 }, { at: 650, s: "footsteps", g: -16 }, { at: 910, s: "stamp", g: -13 }],
  B10: [{ at: 139, s: "thunk", g: -16 }, { at: 163, s: "thunk", g: -16 }, { at: 611, s: "whoosh", g: -16 }, { at: 778, s: "thunk", g: -13 }, { at: 1083, s: "stamp", g: -13 }],
  B11: [{ at: 74, s: "whoosh", g: -16 }, { at: 110, s: "switch", g: -16 }, { at: 150, s: "switch", g: -16 }, { at: 190, s: "switch", g: -16 }, { at: 644, s: "stamp", g: -13 }],
  B12: [{ at: 8, s: "chime-bright", g: -13 }, { at: 408, s: "whoosh", g: -16 }, { at: 440, s: "thunk", g: -15 }],
  B13: [{ at: 32, s: "whoosh", g: -16 }, { at: 250, s: "thunk", g: -14 }, { at: 433, s: "plip", g: -16 }],
  B14: [{ at: 30, s: "drone", g: -17 }, { at: 281, s: "stamp", g: -14 }, { at: 310, s: "boom", g: -12 }],
  B15: [{ at: 83, s: "thunk", g: -16 }, { at: 113, s: "thunk", g: -16 }, { at: 420, s: "coin", g: -16 }, { at: 470, s: "coin", g: -16 }, { at: 810, s: "stamp", g: -13 }],
  B16: [{ at: 38, s: "whoosh", g: -16 }, { at: 244, s: "tap", g: -15 }, { at: 410, s: "thunk", g: -14 }, { at: 611, s: "stamp", g: -13 }],
  B17: [{ at: 165, s: "whoosh", g: -15 }, { at: 230, s: "thunk", g: -16 }, { at: 260, s: "thunk", g: -16 }, { at: 583, s: "stamp", g: -13 }],
  B18: [{ at: 150, s: "whoosh", g: -16 }, { at: 240, s: "footsteps", g: -16 }, { at: 440, s: "footsteps", g: -16 }, { at: 584, s: "switch", g: -15 }, { at: 620, s: "drone", g: -18 }],
  B19: [{ at: 342, s: "whoosh", g: -16 }, { at: 360, s: "plip", g: -17 }, { at: 380, s: "plip", g: -17 }, { at: 759, s: "stamp", g: -13 }],
  B20: [{ at: 283, s: "switch", g: -15 }, { at: 490, s: "switch", g: -14 }, { at: 735, s: "stamp", g: -13 }],
  B21: [{ at: 65, s: "plip", g: -18 }, { at: 110, s: "plip", g: -18 }, { at: 353, s: "boom", g: -12 }, { at: 643, s: "stamp", g: -13 }],
  B22: [{ at: 10, s: "thunk", g: -15 }, { at: 157, s: "thunk", g: -14 }, { at: 165, s: "stamp", g: -13 }, { at: 366, s: "thunk", g: -14 }, { at: 396, s: "chime-warm", g: -18 }],
  B23: [{ at: 176, s: "whoosh", g: -16 }, { at: 470, s: "tick", g: -18 }, { at: 495, s: "tick", g: -18 }, { at: 735, s: "thunk", g: -14 }, { at: 1029, s: "stamp", g: -13 }, { at: 1235, s: "lock", g: -15 }],
  B24: [{ at: 89, s: "plip", g: -17 }, { at: 178, s: "plip", g: -17 }, { at: 356, s: "whoosh", g: -16 }, { at: 735, s: "boom", g: -13 }, { at: 762, s: "stamp", g: -13 }],
  B25: [{ at: 8, s: "footsteps", g: -18 }, { at: 250, s: "whoosh", g: -16 }, { at: 300, s: "drone", g: -17 }, { at: 634, s: "boom", g: -13 }],
  B26: [{ at: 54, s: "thunk", g: -15 }, { at: 285, s: "whoosh", g: -16 }, { at: 714, s: "stamp", g: -13 }],
  B27: [{ at: 84, s: "thunk", g: -15 }, { at: 100, s: "thunk", g: -15 }, { at: 116, s: "thunk", g: -14 }, { at: 589, s: "whoosh", g: -16 }, { at: 863, s: "stamp", g: -13 }],
  B28: [{ at: 65, s: "thunk", g: -16 }, { at: 97, s: "thunk", g: -16 }, { at: 299, s: "switch", g: -16 }, { at: 539, s: "stamp", g: -13 }],
  B29: [{ at: 53, s: "chime-warm", g: -17 }, { at: 145, s: "chime-warm", g: -18 }, { at: 250, s: "chime-warm", g: -18 }, { at: 407, s: "boom", g: -14 }],
  B30: [{ at: 6, s: "drone", g: -15 }, { at: 71, s: "whoosh", g: -17 }, { at: 474, s: "plip", g: -16 }, { at: 620, s: "boom", g: -11 }, { at: 645, s: "drone", g: -13 }, { at: 925, s: "boom", g: -14 }],
  B31: [{ at: 6, s: "drone", g: -15 }, { at: 80, s: "thunk", g: -16 }, { at: 104, s: "thunk", g: -16 }, { at: 464, s: "boom", g: -13 }],
  B32: [{ at: 6, s: "drone", g: -15 }, { at: 95, s: "whoosh", g: -17 }, { at: 231, s: "plip", g: -17 }, { at: 475, s: "stamp", g: -14 }],
  B33: [{ at: 24, s: "chime-warm", g: -15 }, { at: 358, s: "chime-warm", g: -16 }, { at: 390, s: "tick", g: -19 }],
};

/** Per-beat global start frames — from episodes/NIF004/03_transcript/reconcile.json
 *  (same table as EpisodeV4.tsx / Root.tsx). Used only by <SfxStem>. */
export const BEAT_STARTS: Record<string, number> = {
  B00: 0, B01: 493, B02: 1375, B03: 2468, B04: 3352, B05: 4433, B06: 5540,
  B07: 6619, B08: 7520, B09: 8711, B10: 9821, B11: 11210, B12: 12130, B13: 12914,
  B14: 13551, B15: 14378, B16: 15416, B17: 16180, B18: 16928, B19: 18096,
  B20: 19045, B21: 19987, B22: 21025, B23: 21679, B24: 23149, B25: 24263,
  B26: 25097, B27: 25989, B28: 27041, B29: 27789, B30: 28446, B31: 29632,
  B32: 30380, B33: 31058,
};

const NIF004_TOTAL_FRAMES = 31654;

/** the per-beat SFX layer, rendered inside each NIF004 beat comp by V4Beat. */
export const BeatSfx: React.FC<{ beat: string }> = ({ beat }) => {
  const id = beat.replace(/v4$/i, "");
  if (!ALL_SFX || !NIF004_SFX[id]) return null;
  return (
    <Audio
      src={staticFile(`audio/nif004/sfx-mix/${id}${EXT}`)}
      volume={SFX_BUS}
      delayRenderTimeoutInMilliseconds={30_000}
    />
  );
};

/** The SFX-only stem — a full-length composition of just the baked per-beat SFX
 *  mixes, no picture, for Resolve to drop on one Fairlight track. Render the
 *  `NIF004-SFX` composition to a .wav. */
export const SfxStem: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#000" }}>
    {Object.keys(NIF004_SFX).map((id) => (
      <Sequence key={id} from={BEAT_STARTS[id] ?? 0} durationInFrames={NIF004_TOTAL_FRAMES - (BEAT_STARTS[id] ?? 0)} name={`sfx:${id}`}>
        <Audio src={staticFile(`audio/nif004/sfx-mix/${id}${EXT}`)} volume={SFX_BUS} delayRenderTimeoutInMilliseconds={30_000} />
      </Sequence>
    ))}
  </div>
);
