import { AbsoluteFill, Sequence } from "remotion";
import { BEAT_PROPS_DEFAULTS, BeatProps, FPS } from "../../tokens";
import { V4_BEATS } from "./beats";
import { MusicBed, SfxTrack } from "./audio";

/**
 * EpisodeV4 — the whole of NIF002 in the v4 language, one composition (creator,
 * 2026-09-03: "create a full video with all beats"). Each beat is <Sequence>d at
 * its reconciled global start frame; the beat's own <V4Beat> reads that start
 * from props so the grid drift + progress rule stay continuous across cuts.
 *
 * Durations + starts: episodes/NIF002/03_transcript/reconcile.json, with B25's
 * +180f Dark-Law tail so the closing title lands and holds → total 30573.
 */

const TOTAL = 30573;

// [id, durationInFrames, globalStartFrame]
const TABLE: [keyof typeof V4_BEATS, number, number][] = [
  ["B00v4", 277, 0],
  ["B01v4", 1134, 277],
  ["B02v4", 1153, 1411],
  ["B03v4", 1132, 2564],
  ["B04v4", 1342, 3696],
  ["B05v4", 1477, 5038],
  ["B06v4", 841, 6515],
  ["B07v4", 1266, 7356],
  ["B08v4", 1105, 8622],
  ["B09v4", 987, 9727],
  ["B10v4", 1129, 10714],
  ["B11v4", 992, 11843],
  ["B12v4", 1143, 12835],
  ["B13v4", 1643, 13978],
  ["B14v4", 1007, 15621],
  ["B15v4", 836, 16628],
  ["B16v4", 781, 17464],
  ["B17v4", 553, 18245],
  ["B18v4", 673, 18798],
  ["B19v4", 1547, 19471],
  ["B20v4", 1266, 21018],
  ["B21v4", 1407, 22284],
  ["B22v4", 1012, 23691],
  ["B23v4", 935, 24703],
  ["B24v4", 1331, 25638],
  ["B25v4", 1420, 26969],
  ["B26v4", 1045, 28389],
  ["B27v4", 1139, 29434],
];

export const EpisodeV4: React.FC = () => (
  <AbsoluteFill>
    {TABLE.map(([id, dur, start]) => {
      const Beat = V4_BEATS[id];
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
    {/* SFX + music beds — no-ops until public/audio/nif002/{sfx,music}/ is
        populated + audio.tsx HAVE/MUSIC are set. See 08_conform/AUDIO-GET-THESE.md */}
    <SfxTrack />
    <MusicBed />
  </AbsoluteFill>
);

export const EPISODE_V4_TOTAL = TOTAL;
