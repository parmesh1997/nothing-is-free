import { Audio, staticFile, useCurrentFrame } from "remotion";
import { BeatProps, HEIGHT, WIDTH, episodeProgress } from "../../tokens";
import { V3Frame } from "./Frame";
import { CameraPush, CamKey } from "./Camera";

/**
 * V3Beat — the wrapper every v3 beat renders inside (replaces BeatFrame).
 *
 *   <V3Beat props={props} beat="B04" source="…" set={<Room .../>} cam={[…]}>
 *     …elements…
 *   </V3Beat>
 *
 * It draws the Vox frame furniture, mounts the VO (the real B##.mp3 — the
 * composition id may carry a "v3" suffix the audio file does not), puts the set
 * BEHIND the elements inside the camera push, and keeps a bleed margin so the
 * push never reveals the frame edge.
 */
export const V3Beat: React.FC<{
  props: BeatProps;
  /** Real beat id for the audio file, e.g. "B04". Defaults to props.beatId sans "v3". */
  beat?: string;
  source?: React.ReactNode;
  /** The environment. Rendered behind everything, inside the camera. */
  set?: React.ReactNode;
  /** Camera keyframes. Omit for the default gentle push. */
  cam?: CamKey[];
  bare?: boolean;
  children?: React.ReactNode;
}> = ({ props, beat, source, set, cam, bare, children }) => {
  const frame = useCurrentFrame();
  const id = (beat ?? props.beatId ?? "B00").replace(/v3$/i, "");
  const dur = props.durationInFrames;

  return (
    <V3Frame progress={episodeProgress(frame, props)} source={source} bare={bare}>
      <CameraPush dur={dur} moves={cam}>
        {/* the set, over-scaled a touch so the camera push never bares an edge */}
        <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT, transformOrigin: "50% 50%", transform: "scale(1.08)" }}>
          {set}
        </div>
        {children}
      </CameraPush>
      <Audio src={staticFile(`audio/nif002/${id}.mp3`)} delayRenderTimeoutInMilliseconds={60_000} />
    </V3Frame>
  );
};
