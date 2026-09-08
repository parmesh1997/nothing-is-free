import { AbsoluteFill, Sequence } from "remotion";
import { BEAT_PROPS_DEFAULTS, BeatProps, FPS } from "../../../tokens";
import { V4_BEATS } from "../beats";

/**
 * OpenerDemo — the v4 style-lock clip (creator, 2026-09-03: "fix the auction
 * clip"). It is no longer a bespoke scene: it just plays the real B00 + B01
 * beats back to back, so what the creator signs off on here is exactly what the
 * episode ships. B00 (277f) then the first stretch of B01, to ~650f total.
 */

const DEMO: [keyof typeof V4_BEATS, number, number][] = [
  ["B00v4", 277, 0],
  ["B01v4", 1134, 277],
];

export const OpenerDemo: React.FC = () => (
  <AbsoluteFill>
    {DEMO.map(([id, dur, start]) => {
      const Beat = V4_BEATS[id];
      const props: BeatProps = {
        ...BEAT_PROPS_DEFAULTS,
        beatId: id,
        durationInFrames: dur,
        fps: FPS,
        globalStartFrame: start,
        episodeTotalFrames: 30393,
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
