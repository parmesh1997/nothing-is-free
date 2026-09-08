import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, FONT, HEIGHT, WIDTH } from "../tokens";
import { Grid } from "../field/Grid";
import { Grain } from "../field/Grain";
import { Bloom } from "../parts/Bloom";
import { CountUp } from "../parts/CountUp";
import { UIReveal } from "../archetypes/UIReveal";

/**
 * V2PrimitivesDemo — verification of Bloom + UIReveal (v2.0 §5.6). dev only.
 */
export const V2PrimitivesDemo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.paper }}>
      <Grid globalFrame={frame} />

      {/* UIReveal — a bid request building, cursor clicks ALLOW, a value lands */}
      <UIReveal
        x={140}
        y={180}
        w={620}
        h={720}
        at={6}
        title="BID REQUEST"
        rows={[
          { at: 24, label: "DEVICE", value: "iPhone 15" },
          { at: 44, label: "LOCATION", value: "37.77, -122.41" },
          { at: 64, label: "APP", value: "the word game" },
          { at: 150, label: "PAID TO REACH YOU", value: 0.014, to: 0.014, landAt: 210, format: (n) => `${(n * 100).toFixed(1)}¢`, accent: true },
        ]}
        button={{ label: "ALLOW", at: 90, pulseAt: 175 }}
        cursor={{ enterAt: 130, from: "br", clickAt: 175 }}
      />

      {/* Bloom — standalone pulse on a big counted value */}
      <div style={{ position: "absolute", left: WIDTH * 0.62, top: HEIGHT * 0.36, width: 620, textAlign: "center" }}>
        <Bloom window={[120, 150, 240, 280]} radius={220} x="50%" y="46%" />
        <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 180, color: COLOR.ink }}>
          <CountUp from={0} to={390} start={20} end={150} format={(n) => `$${Math.round(n)}B`} size={180} />
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 26, letterSpacing: "0.14em", color: COLOR.grey, marginTop: 8 }}>
          IN-APP AD SPEND / YEAR
        </div>
      </div>

      <Grain />
    </AbsoluteFill>
  );
};
