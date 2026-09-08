import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT, HEIGHT, WIDTH } from "../tokens";
import { Grain } from "../field/Grain";
import { Grid } from "../field/Grid";
import { Lucky } from "../characters";
import { FlatFigure } from "../print/FlatFigure";
import { PaperEdge } from "../print/PaperEdge";
import { Tub, Ticket, Coins } from "../print";
import { SpeechBubble, LabelBox, DataTable } from "../print/SpeechBubble";
import { PieChart, FlowDiagram } from "../print/diagrams";
import { TextureDefs, BrushArrow, HalftoneDot } from "../print/textures";
import { EASE, springIn } from "../parts/motion";
import { useVideoConfig } from "remotion";

/**
 * SceneComposition — the sheet's SCENE COMPOSITION EXAMPLE, built for real:
 * Lucky + speech bubble, hero type, the giant popcorn bucket, the money table,
 * pie + flow diagrams, statement labels, a rising arrow. One continuous shot
 * with a slow push (§2.1, §3.4). Development reference / style proof.
 */
export const SceneComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // one slow continuous push across the whole shot
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.05], { easing: EASE.inOut });

  const typeIn = springIn({ frame, fps, delay: 14, durationInFrames: 18 });
  const tubIn = springIn({ frame, fps, delay: 26, durationInFrames: 22 });

  const tubW = 520;
  const tubH = 560;
  const groundY = HEIGHT * 0.82;

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.paper }}>
      <TextureDefs />

      <AbsoluteFill style={{ scale: zoom }}>
        <Grid globalFrame={frame} />

        {/* decorative halftone disc behind the hero prop */}
        <HalftoneDot x={WIDTH * 0.5} y={HEIGHT * 0.4} r={230} density={0.55} opacity={0.1} />

        {/* ── LEFT: Lucky + speech bubble ── */}
        <Lucky pose="point" expression="curious" height={Math.round(HEIGHT * 0.4)} centerX={185} baseline={groundY} entry="L" entryFrame={0} />
        <SpeechBubble
          x={300}
          y={HEIGHT * 0.3}
          width={430}
          entryFrame={12}
          accentFrom={2}
          lines={["YOU PAID $12", "FOR THIS TICKET.", "BUT HERE'S THE", "STRANGE PART…"]}
        />

        {/* ── hero type ── */}
        <div
          style={{
            position: "absolute",
            left: 300,
            top: HEIGHT * 0.56,
            fontFamily: FONT.hero,
            fontSize: 130,
            lineHeight: 0.86,
            letterSpacing: "0.01em",
            color: COLOR.ink,
            opacity: typeIn,
            translate: `0px ${(1 - typeIn) * 18}px`,
          }}
        >
          REAL
          <br />
          PRODUCT
        </div>

        {/* ticket under the type */}
        <div style={{ position: "absolute", left: 300, top: HEIGHT * 0.83, width: 250, height: 118, opacity: springIn({ frame, fps, delay: 34, durationInFrames: 16 }) }}>
          <PaperEdge shape={Ticket} w={250} h={118} entryFrame={34} />
          <FlatFigure shape={Ticket} w={250} h={118} />
        </div>

        {/* ── CENTRE: the hero popcorn bucket ── */}
        <div
          style={{
            position: "absolute",
            left: WIDTH * 0.44,
            top: groundY - tubH,
            width: tubW,
            height: tubH,
            opacity: tubIn,
            scale: String(0.9 + 0.1 * tubIn),
            transformOrigin: "50% 100%",
          }}
        >
          <PaperEdge shape={Tub} w={tubW} h={tubH} entryFrame={26} />
          <FlatFigure shape={Tub} w={tubW} h={tubH} />
        </div>

        {/* small Lucky beside it, reacting */}
        <Lucky pose="stand" expression="surprised" height={Math.round(HEIGHT * 0.26)} centerX={WIDTH * 0.62} baseline={groundY} facing={-1} entry="up" entryFrame={40} />

        {/* ── RIGHT: the money table + pie ── */}
        <DataTable
          x={WIDTH * 0.7}
          y={HEIGHT * 0.12}
          width={480}
          entryFrame={46}
          title="WHERE THE MONEY GOES"
          rows={[
            { label: "Theater share", value: "50–55%" },
            { label: "Distributor share", value: "35–40%" },
            { label: "Operating costs", value: "10–15%" },
          ]}
        />
        <PieChart
          cx={WIDTH * 0.9}
          cy={HEIGHT * 0.42}
          r={92}
          start={62}
          end={86}
          legend={false}
          slices={[
            { label: "concessions", value: 60, color: COLOR.orange },
            { label: "tickets", value: 25, color: COLOR.ink },
            { label: "other", value: 15, color: COLOR.grey },
          ]}
        />

        {/* flow diagram, lower right */}
        <FlowDiagram
          nodes={["You", "Theater", "Distributor", "Studio"]}
          x={WIDTH * 0.68}
          y={HEIGHT * 0.58}
          boxW={128}
          boxH={50}
          gap={28}
          start={76}
          perStep={6}
        />

        {/* statement labels */}
        <LabelBox text="TICKETS FILL SEATS." x={WIDTH * 0.68} y={HEIGHT * 0.75} variant="ink" entryFrame={96} fontSize={34} />
        <LabelBox text="CONCESSIONS FILL POCKETS." x={WIDTH * 0.68} y={HEIGHT * 0.83} variant="orange" entryFrame={104} fontSize={34} />

        {/* rising accent arrow + coins */}
        <BrushArrow
          x={WIDTH * 0.9}
          y={HEIGHT * 0.72}
          w={150}
          h={22}
          progress={interpolate(frame, [110, 128], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })}
        />
        <div style={{ position: "absolute", left: WIDTH * 0.92, top: groundY - 130, width: 110, height: 130, opacity: springIn({ frame, fps, delay: 118, durationInFrames: 16 }) }}>
          <FlatFigure shape={Coins} w={110} h={130} />
        </div>
      </AbsoluteFill>

      {/* source tag + grain sit outside the camera */}
      <div style={{ position: "absolute", left: 60, bottom: 42, fontFamily: FONT.mono, fontSize: 16, color: COLOR.grey, opacity: 0.65 }}>
        CINEMARK HOLDINGS — FY2024 10-K
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
