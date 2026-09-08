import { AbsoluteFill, Sequence } from "remotion";
import { BEAT_PROPS_DEFAULTS, BeatProps, FPS } from "../../tokens";
import { V4_BEATS_NIF004 } from "./beats";

/**
 * EpisodeV4 (NIF004) — the whole of "Google Maps — the hidden economics of the
 * free map" in one composition, mirroring src/nif003/v4/EpisodeV4.tsx. Each beat
 * is <Sequence>d at its reconciled global start frame; the beat's own <V4Beat>
 * reads that start from props so the grid drift + progress rule stay continuous
 * across cuts.
 *
 * Durations + starts: episodes/NIF004/03_transcript/reconcile.json → total
 * 31654 frames (17:35.1 @ 30fps, Step 2 reconcile, creator accepted 2026-09-09).
 * SFX ride inside each beat comp (<BeatSfx> via V4Beat); no music in the render
 * (Resolve). The standalone SFX-only stem for Resolve is the NIF004-SFX comp.
 */

const TOTAL = 31654;

// [id, durationInFrames, globalStartFrame]
const TABLE: [keyof typeof V4_BEATS_NIF004, number, number][] = [
  ["B00v4", 493, 0],
  ["B01v4", 882, 493],
  ["B02v4", 1093, 1375],
  ["B03v4", 884, 2468],
  ["B04v4", 1081, 3352],
  ["B05v4", 1107, 4433],
  ["B06v4", 1079, 5540],
  ["B07v4", 901, 6619],
  ["B08v4", 1191, 7520],
  ["B09v4", 1110, 8711],
  ["B10v4", 1389, 9821],
  ["B11v4", 920, 11210],
  ["B12v4", 784, 12130],
  ["B13v4", 637, 12914],
  ["B14v4", 827, 13551],
  ["B15v4", 1038, 14378],
  ["B16v4", 764, 15416],
  ["B17v4", 748, 16180],
  ["B18v4", 1168, 16928],
  ["B19v4", 949, 18096],
  ["B20v4", 942, 19045],
  ["B21v4", 1038, 19987],
  ["B22v4", 654, 21025],
  ["B23v4", 1470, 21679],
  ["B24v4", 1114, 23149],
  ["B25v4", 834, 24263],
  ["B26v4", 892, 25097],
  ["B27v4", 1052, 25989],
  ["B28v4", 748, 27041],
  ["B29v4", 657, 27789],
  ["B30v4", 1186, 28446],
  ["B31v4", 748, 29632],
  ["B32v4", 678, 30380],
  ["B33v4", 596, 31058],
];

export const EpisodeV4: React.FC = () => (
  <AbsoluteFill>
    {TABLE.map(([id, dur, start]) => {
      const Beat = V4_BEATS_NIF004[id];
      const props: BeatProps = {
        ...BEAT_PROPS_DEFAULTS,
        beatId: id,
        durationInFrames: dur,
        fps: FPS,
        globalStartFrame: start,
        episodeTotalFrames: TOTAL,
        audioSrc: "",
        audioOffsetMs: 0,
      };
      return (
        <Sequence key={id} from={start} durationInFrames={dur} name={id}>
          <Beat {...props} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

export const EPISODE_V4_TOTAL = TOTAL;
