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
  B00: [{ at: 4, s: "whoosh", g: -15 }, { at: 34, s: "tick", g: -20 }, { at: 40, s: "switch", g: -15 }, { at: 210, s: "plip", g: -17 }],
  B01: [{ at: 8, s: "tap", g: -17 }, { at: 30, s: "plip", g: -16 }, { at: 46, s: "plip", g: -16 }, { at: 64, s: "plip", g: -16 }, { at: 120, s: "drone", g: -18 }],
  B02: [{ at: 6, s: "whoosh", g: -16 }, { at: 210, s: "plip", g: -17 }, { at: 250, s: "boom", g: -14 }],
  B03: [{ at: 10, s: "tap", g: -17 }, { at: 300, s: "thunk", g: -15 }, { at: 520, s: "boom", g: -13 }],
  B04: [{ at: 20, s: "whoosh", g: -16 }, { at: 120, s: "coin", g: -16 }, { at: 300, s: "coin", g: -16 }, { at: 520, s: "thunk", g: -14 }],
  B05: [{ at: 30, s: "stamp", g: -13 }, { at: 260, s: "glitch", g: -15 }, { at: 500, s: "thunk", g: -14 }, { at: 720, s: "switch", g: -14 }],
  B06: [{ at: 40, s: "thunk", g: -15 }, { at: 220, s: "plip", g: -17 }, { at: 300, s: "boom", g: -13 }, { at: 360, s: "stamp", g: -13 }],
  B07: [{ at: 60, s: "tap", g: -17 }, { at: 260, s: "coin", g: -16 }, { at: 430, s: "coin", g: -16 }, { at: 620, s: "thunk", g: -14 }],
  B08: [{ at: 40, s: "whoosh", g: -16 }, { at: 320, s: "stamp", g: -13 }, { at: 560, s: "thunk", g: -14 }, { at: 700, s: "drone", g: -16 }],
  B09: [{ at: 30, s: "whoosh", g: -16 }, { at: 220, s: "footsteps", g: -16 }, { at: 300, s: "footsteps", g: -16 }, { at: 380, s: "footsteps", g: -16 }],
  B10: [{ at: 40, s: "thunk", g: -15 }, { at: 300, s: "coin", g: -16 }, { at: 620, s: "stamp", g: -13 }, { at: 900, s: "boom", g: -13 }],
  B11: [{ at: 30, s: "glitch", g: -15 }, { at: 60, s: "switch", g: -15 }, { at: 90, s: "switch", g: -15 }, { at: 120, s: "switch", g: -15 }],
  B12: [{ at: 8, s: "chime-bright", g: -13 }, { at: 300, s: "whoosh", g: -16 }],
  B13: [{ at: 40, s: "tap", g: -17 }, { at: 220, s: "coin", g: -15 }, { at: 320, s: "boom", g: -13 }],
  B14: [{ at: 30, s: "thunk", g: -15 }, { at: 160, s: "stamp", g: -13 }, { at: 400, s: "boom", g: -13 }],
  B15: [{ at: 40, s: "plip", g: -17 }, { at: 200, s: "coin", g: -15 }, { at: 260, s: "coin", g: -15 }, { at: 320, s: "coin", g: -15 }, { at: 480, s: "stamp", g: -13 }],
  B16: [{ at: 40, s: "tap", g: -17 }, { at: 260, s: "coin", g: -15 }, { at: 320, s: "switch", g: -14 }, { at: 520, s: "stamp", g: -13 }],
  B17: [{ at: 40, s: "whoosh", g: -16 }, { at: 200, s: "glitch", g: -15 }, { at: 440, s: "boom", g: -13 }],
  B18: [{ at: 40, s: "tap", g: -17 }, { at: 300, s: "switch", g: -15 }, { at: 500, s: "drone", g: -17 }, { at: 700, s: "tick", g: -19 }],
  B19: [{ at: 40, s: "plip", g: -17 }, { at: 300, s: "thunk", g: -15 }, { at: 520, s: "chime-warm", g: -18 }],
  B20: [{ at: 40, s: "switch", g: -16 }, { at: 300, s: "glitch", g: -15 }, { at: 340, s: "glitch", g: -15 }, { at: 560, s: "stamp", g: -13 }, { at: 780, s: "boom", g: -12 }],
  B21: [{ at: 40, s: "thunk", g: -15 }, { at: 260, s: "boom", g: -13 }, { at: 520, s: "glitch", g: -15 }, { at: 720, s: "stamp", g: -13 }],
  B22: [{ at: 40, s: "thunk", g: -15 }, { at: 260, s: "stamp", g: -13 }, { at: 400, s: "chime-warm", g: -18 }],
  B23: [{ at: 40, s: "whoosh", g: -16 }, { at: 300, s: "thunk", g: -14 }, { at: 420, s: "tick", g: -18 }, { at: 440, s: "tick", g: -18 }, { at: 460, s: "tick", g: -18 }, { at: 900, s: "boom", g: -12 }, { at: 1100, s: "switch", g: -15 }],
  B24: [{ at: 40, s: "plip", g: -17 }, { at: 300, s: "coin", g: -15 }, { at: 360, s: "coin", g: -15 }, { at: 560, s: "boom", g: -13 }, { at: 900, s: "chime-bright", g: -14 }],
  B25: [{ at: 40, s: "tap", g: -18 }, { at: 200, s: "drone", g: -17 }, { at: 520, s: "boom", g: -13 }],
  B26: [{ at: 40, s: "whoosh", g: -16 }, { at: 260, s: "switch", g: -15 }, { at: 520, s: "chime-warm", g: -18 }],
  B27: [{ at: 40, s: "thunk", g: -15 }, { at: 300, s: "thunk", g: -15 }, { at: 520, s: "coin", g: -15 }, { at: 700, s: "stamp", g: -13 }],
  B28: [{ at: 40, s: "thunk", g: -15 }, { at: 260, s: "thunk", g: -14 }, { at: 420, s: "boom", g: -13 }],
  B29: [{ at: 40, s: "tap", g: -18 }, { at: 300, s: "drone", g: -16 }, { at: 500, s: "boom", g: -13 }],
  B30: [{ at: 6, s: "drone", g: -15 }, { at: 300, s: "coin", g: -15 }, { at: 360, s: "coin", g: -15 }, { at: 420, s: "coin", g: -15 }, { at: 900, s: "boom", g: -11 }, { at: 940, s: "drone", g: -13 }],
  B31: [{ at: 6, s: "drone", g: -15 }, { at: 260, s: "whoosh", g: -16 }, { at: 520, s: "thunk", g: -14 }],
  B32: [{ at: 6, s: "drone", g: -15 }, { at: 260, s: "plip", g: -17 }, { at: 520, s: "tick", g: -19 }],
  B33: [{ at: 40, s: "chime-bright", g: -13 }, { at: 300, s: "tick", g: -18 }, { at: 500, s: "coin", g: -14 }],
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
