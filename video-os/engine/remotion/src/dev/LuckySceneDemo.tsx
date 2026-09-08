import { AbsoluteFill } from "remotion";
import { COLOR, FIELD, HEIGHT, SPACE, WIDTH } from "../tokens";
import { StandaloneField } from "../field/LockedField";
import { Lucky } from "../characters";
import { FigureBlock } from "../print/FigureBlock";
import { Cinema, Ticket } from "../print";
import { Tag } from "../print/Tag";

/**
 * LuckySceneDemo — Lucky in context with props, echoing the creator's reference
 * frame 1: Lucky (small presenter figure) holding a ticket, a cinema across the
 * frame. Line-art character + torn-paper props on warm paper. NOT a channel asset.
 */
export const LuckySceneDemo: React.FC = () => {
  const luckyH = Math.round(HEIGHT * 0.42);
  const groundY = FIELD.groundRule.y;

  return (
    <StandaloneField progress={0.15} source="Illustrative example">
      {/* Lucky, presenting, facing the cinema */}
      <Lucky pose="reach" facing={1} height={luckyH} centerX={WIDTH * 0.24} baseline="ground" />

      {/* the ticket she's holding — near her outstretched hand */}
      <FigureBlock
        shape={Ticket}
        width={300}
        height={150}
        centerX={WIDTH * 0.24 + luckyH * 0.42}
        baseline={groundY - luckyH * 0.42}
      />

      {/* the cinema across the frame */}
      <FigureBlock shape={Cinema} width={480} height={420} centerX={WIDTH * 0.76} baseline={HEIGHT * 0.4} />
      <Tag text="THE VENUE" x={WIDTH * 0.76 + 200} y={HEIGHT * 0.14} color={COLOR.cardWhite} rotate={4} entryFrame={30} />

      {/* a caption line, lower third */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: SPACE.safe.x,
            bottom: SPACE.safe.y + 30,
            fontFamily: '"Barlow", system-ui, sans-serif',
            fontSize: 46,
            fontWeight: 500,
            color: COLOR.ink,
            maxWidth: 900,
          }}
        >
          You think you paid for a seat.
        </div>
      </AbsoluteFill>
    </StandaloneField>
  );
};
