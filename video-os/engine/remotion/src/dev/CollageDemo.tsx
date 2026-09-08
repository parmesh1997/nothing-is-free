import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT, HEIGHT, SPACE, WIDTH } from "../tokens";
import { StandaloneField } from "../field/LockedField";
import { FigureBlock } from "../print/FigureBlock";
import { Tub, Crown } from "../print";
import { Tag } from "../print/Tag";
import { InkSplat } from "../print/InkSplat";
import { CircleDoodle, ArrowDoodle } from "../print/Doodle";
import { DoodlePie } from "../print/DoodleChart";
import { springIn } from "../parts/motion";
import { useVideoConfig } from "remotion";

/**
 * CollageDemo — TIER 2 verification of the flat-colour collage layer (creator
 * direction): hero type + a subject with a price tag + ink splats + a hand-drawn
 * circle + a doodled pie, echoing the "$1.ce" / "NOT EXPENSIVE" reference frame.
 * NOT a channel asset.
 */
export const CollageDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typeIn = springIn({ frame, fps, delay: 0, durationInFrames: 16 });

  return (
    <StandaloneField progress={0.22} source="Illustrative example">
      {/* ink splats behind */}
      <InkSplat x={WIDTH * 0.34} y={HEIGHT * 0.2} size={220} seed={3} entryFrame={30} rotate={-12} opacity={0.9} />
      <InkSplat x={WIDTH * 0.7} y={HEIGHT * 0.62} size={150} seed={9} entryFrame={44} rotate={20} opacity={0.8} />

      {/* hero type */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: SPACE.titleSafe.x,
            top: HEIGHT * 0.12,
            fontFamily: FONT.hero,
            fontWeight: 700,
            fontSize: 240,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            color: COLOR.ink,
            opacity: typeIn,
            translate: `0px ${(1 - typeIn) * 20}px`,
          }}
        >
          NOT
          <br />
          FREE
        </div>
      </AbsoluteFill>

      {/* subject: the popcorn tub, with a torn price tag */}
      <FigureBlock shape={Tub} width={430} height={560} centerX={WIDTH * 0.62} baseline="ground" entry="up" entryFrame={12} subject />
      <Tag
        text="+ ₹2,000"
        x={WIDTH * 0.78}
        y={HEIGHT * 0.28}
        to={{ x: WIDTH * 0.62 + 120, y: HEIGHT * 0.42 }}
        color={COLOR.gold}
        rotate={5}
        entryFrame={40}
      />

      {/* a crown, small, pinned top-right of the tub */}
      <FigureBlock shape={Crown} width={150} height={110} centerX={WIDTH * 0.62} baseline={HEIGHT * 0.3} noEdge />

      {/* hand-drawn circle round the whole thing + an arrow from the type */}
      <CircleDoodle cx={WIDTH * 0.62} cy={HEIGHT * 0.55} rx={340} ry={380} start={58} end={82} />
      <ArrowDoodle from={{ x: SPACE.titleSafe.x + 520, y: HEIGHT * 0.3 }} to={{ x: WIDTH * 0.5, y: HEIGHT * 0.5 }} start={70} end={90} />

      {/* a doodled pie callout, lower left */}
      <DoodlePie
        slices={[
          { label: "ticket", value: 1, color: COLOR.teal },
          { label: "everything else", value: 4 },
        ]}
        cx={SPACE.safe.x + 180}
        cy={HEIGHT * 0.74}
        r={110}
        start={80}
        end={110}
      />
      <div
        style={{
          position: "absolute",
          left: SPACE.safe.x,
          top: HEIGHT * 0.74 + 130,
          fontFamily: FONT.mono,
          fontSize: 20,
          color: COLOR.graphite,
          opacity: interpolate(frame, [100, 116], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        the ticket is 1/5 of what you pay
      </div>
    </StandaloneField>
  );
};
