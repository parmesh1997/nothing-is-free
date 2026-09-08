import { AbsoluteFill } from "remotion";
import { StandaloneField } from "../field/LockedField";
import { BeatFrame } from "../BeatFrame";
import { BEAT_PROPS_DEFAULTS, FPS, RUNTIME } from "../tokens";
import { Lucky } from "../characters";
import { Signature, DarkLaw } from "../channel";

/** TIER 5 verification — Lucky at human scale, a few poses (§5.1). */
export const LuckyDemo: React.FC = () => (
  <StandaloneField progress={0.3} source="">
    <Lucky pose="walk" facing={1} centerX={430} baseline="ground" subject={false} height={620} />
    <Lucky
      pose="point"
      expression="curious"
      facing={1}
      centerX={960}
      baseline="ground"
      subject
      label="Lucky"
      height={Math.round(1080 * 0.64)}
    />
    <Lucky pose="sit" expression="worried" facing={-1} centerX={1500} baseline="ground" subject={false} height={520} />
  </StandaloneField>
);

/** TIER 7 verification — the signature, B00 (§6.4). */
export const SignatureDemo: React.FC = () => (
  <StandaloneField progress={0.01} source="">
    <Signature
      clause="And the ticket was the cheapest thing you bought."
      accentWord="cheapest"
    />
  </StandaloneField>
);

/** TIER 7 verification — the Dark Law reversal (§2.9). */
export const DarkLawDemo: React.FC = () => {
  const props = {
    ...BEAT_PROPS_DEFAULTS,
    beatId: "B-REVERSAL",
    durationInFrames: 8 * FPS,
    globalStartFrame: Math.round(RUNTIME.floorFrames * 0.72),
    episodeTotalFrames: RUNTIME.floorFrames,
  };
  const crossfadeAtLocal = 12;
  return (
    <BeatFrame
      props={props}
      source="Cinemark, Q1 2025"
      darkLawStartGlobalFrame={props.globalStartFrame + crossfadeAtLocal}
    >
      <AbsoluteFill>
        <DarkLaw
          reversalLine="The counter never sold you popcorn."
          crossfadeAt={crossfadeAtLocal}
        />
      </AbsoluteFill>
    </BeatFrame>
  );
};
