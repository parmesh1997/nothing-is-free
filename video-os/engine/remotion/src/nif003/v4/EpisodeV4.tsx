import { AbsoluteFill, Sequence } from "remotion";
import { BEAT_PROPS_DEFAULTS, BeatProps, FPS } from "../../tokens";
import { V4_BEATS_NIF003 } from "./beats";

/**
 * EpisodeV4 (NIF003) — the whole of "You don't pay for TV" in one composition,
 * mirroring src/nif002/v4/EpisodeV4.tsx exactly. Each beat is <Sequence>d at
 * its reconciled global start frame; the beat's own <V4Beat> reads that start
 * from props so the grid drift + progress rule stay continuous across cuts.
 *
 * Durations + starts: episodes/NIF003/03_transcript/reconcile.json (same table
 * already registered per-beat in Root.tsx's "NIF003-v4-beats" Folder) → total
 * 37230 frames (20:41 @ 30fps).
 */

const TOTAL = 37230;

// [id, durationInFrames, globalStartFrame]
const TABLE: [keyof typeof V4_BEATS_NIF003, number, number][] = [
  ["B00v4", 311, 0],
  ["B01v4", 1064, 311],
  ["B02v4", 1549, 1375],
  ["B03v4", 1191, 2924],
  ["B04v4", 1679, 4115],
  ["B05v4", 1410, 5794],
  ["B06v4", 1710, 7204],
  ["B07v4", 1009, 8914],
  ["B08v4", 1045, 9923],
  ["B09v4", 1345, 10968],
  ["B10v4", 1672, 12313],
  ["B11v4", 1285, 13985],
  ["B12v4", 580, 15270],
  ["B13v4", 980, 15850],
  ["B14v4", 1134, 16830],
  ["B15v4", 887, 17964],
  ["B16v4", 1360, 18851],
  ["B17v4", 1861, 20211],
  ["B18v4", 899, 22072],
  ["B19v4", 1163, 22971],
  ["B20v4", 714, 24134],
  ["B21v4", 777, 24848],
  ["B22v4", 1218, 25625],
  ["B23v4", 926, 26843],
  ["B24v4", 928, 27769],
  ["B25v4", 1513, 28697],
  ["B26v4", 1012, 30210],
  ["B27v4", 829, 31222],
  ["B28v4", 1405, 32051],
  ["B29v4", 1542, 33456],
  ["B30v4", 892, 34998],
  ["B31v4", 705, 35890],
  ["B32v4", 635, 36595],
];

export const EpisodeV4: React.FC = () => (
  <AbsoluteFill>
    {TABLE.map(([id, dur, start]) => {
      const Beat = V4_BEATS_NIF003[id];
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
    {/* SFX now ride inside each beat comp (<BeatSfx> via V4Beat, 2026-09-06
        §22.7) so per-beat renders carry them — no top-level SFX track here or
        it would double. Music was removed from the render (creator: too loud,
        added in DaVinci Resolve). The standalone SFX-only stem for Resolve is
        the `NIF003-SFX` composition. */}
  </AbsoluteFill>
);

export const EPISODE_V4_TOTAL = TOTAL;
