import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { TollStack } from "../TollStack";
import { Floor, TitleSlab } from "../scene";
import { useStage, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B12 — walk one real ad down the chain. BUILD · 1143 f (38.1 s).
 * TollStack debut. $2.00 → −20% buy → −15% exchange → −15% sell → −10% data
 * → ≈ $1.00 → ÷ 1,000 views → the app keeps ≈ 0.05¢.
 * Peak: "the app kept about half of that" — whisper "half" @ f1102.
 */
export const B12: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Programmatic fee ranges — ISBA/PwC; The Trade Desk filings">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 34, holdFrames: 14 });
  const vo = useBeatTiming("B12");

  const F = {
    intro: vo.at("walk", 3),
    top: vo.at("agrees", 144),
    rows: vo.at("buying", 225),
    lands: vo.at("lands", 728),
    divide: vo.at("were", 928),
    peak: vo.at("half", 1102),
  };

  const perRow = Math.round((F.lands - F.rows) / 4);

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.22} kind="desk" />
      <TitleSlab lines={["ONE REAL AD, DOWN THE CHAIN"]} at={F.intro} outAt={F.top + 20} />

      <div style={{ opacity: stage.exit(frame), translate: `0px ${(1 - Math.min(1, stage.enter(frame, F.top))) * 24}px` }}>
        <TollStack
          x={WIDTH * 0.12}
          y={HEIGHT * 0.16}
          w={WIDTH * 0.76}
          startValue={2.0}
          rows={[
            { label: "buying software", pct: 20 },
            { label: "the exchange", pct: 15 },
            { label: "selling software", pct: 15 },
            { label: "data targeting", pct: 10 },
          ]}
          start={F.rows}
          perRowFrames={perRow}
          tail={[
            { label: "÷ 1,000 people who saw it", value: "≈ 0.10¢" },
            { label: "the app keeps about half", value: "≈ 0.05¢" },
          ]}
          finalAt={F.divide}
        />
      </div>

      {/* peak line */}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.84, textAlign: "center", fontFamily: FONT.hero, fontSize: 46, letterSpacing: "0.02em", color: COLOR.ink, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 18, dur - 5]) }}>
          YOU WERE WORTH <span style={{ color: COLOR.orange }}>A TENTH OF A CENT</span>. THE APP KEPT HALF.
        </div>
      )}

      {/* a faint reminder that the advertiser is upstream */}
      <div style={{ position: "absolute", left: WIDTH * 0.12, top: HEIGHT * 0.1, fontFamily: FONT.mono, fontSize: 18, color: COLOR.grey, opacity: interpolate(frame, [F.top, F.top + 14, F.divide, F.divide + 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        one advertiser · one thousand views
      </div>
    </>
  );
};
