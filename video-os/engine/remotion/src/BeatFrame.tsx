import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { LockedField } from "./field/LockedField";
import { BeatProps, episodeProgress, globalFrame } from "./tokens";

/**
 * BeatFrame — the wrapper every per-beat composition renders inside.
 *
 * It is the concrete implementation of the props contract in §11.3: the beat is
 * told where it sits in the assembled episode, so the locked background and the
 * progress rule stay continuous when Resolve stitches the pieces (§0.1 C2).
 *
 * Responsibilities:
 *   - draw the LockedField at the correct GLOBAL phase
 *   - mount the beat's voiceover at the right offset
 *   - expose helpers (globalFrame, progress) to the beat's content via a hook arg
 *
 * V1 pieces render opaque — they carry the locked field themselves (§11.6).
 * V2 overlap pieces should render <BeatContent> WITHOUT this wrapper and export
 * with alpha.
 */
export const BeatFrame: React.FC<{
  props: BeatProps;
  /** Citation for the figure on screen (§2.7). */
  source?: React.ReactNode;
  /** Global frame at which the Dark Law begins, if this is the reversal beat. */
  darkLawStartGlobalFrame?: number;
  children?: React.ReactNode;
}> = ({ props, source, darkLawStartGlobalFrame, children }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <LockedField
        globalFrame={globalFrame(frame, props)}
        progress={episodeProgress(frame, props)}
        source={source}
        darkLawStartGlobalFrame={darkLawStartGlobalFrame}
      >
        {children}
      </LockedField>

      {props.audioSrc ? (
        <Audio
          src={
            props.audioSrc.startsWith("http")
              ? props.audioSrc
              : staticFile(props.audioSrc)
          }
          // audioOffsetMs positions the VO within the beat (§11.3).
          trimBefore={
            props.audioOffsetMs < 0
              ? Math.round((-props.audioOffsetMs / 1000) * props.fps)
              : undefined
          }
          delayRenderTimeoutInMilliseconds={60_000}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * useBeat — helpers for a beat's content component.
 * `frame` here is LOCAL; everything episode-wide comes from the props.
 */
export const useBeat = (props: BeatProps) => {
  const frame = useCurrentFrame();
  return {
    frame,
    global: globalFrame(frame, props),
    progress: episodeProgress(frame, props),
  };
};
