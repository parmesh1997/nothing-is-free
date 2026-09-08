import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, HEIGHT, WIDTH } from "../tokens";
import { Grain } from "../field/Grain";
import { Grid } from "../field/Grid";
import { ProgressRule } from "../field/ProgressRule";
import { SourceTag } from "../field/SourceTag";
import { Vignette } from "../field/Vignette";
import { Ocean } from "../print/Ocean";
import { Tanker } from "../print/ship";
import { FlatFigure } from "../print/FlatFigure";
import { PaperEdge } from "../print/PaperEdge";
import { Callout, BarrelGlyph } from "../print/Callout";
import { CountUp, fmt } from "../parts/CountUp";
import { EASE } from "../parts/motion";

/**
 * ContinuousShotSample — ONE continuous shot (§2.1, §2.3). No cuts.
 *
 * A code-native tanker sails into a locked paper+grid frame over a procedural
 * ocean; the camera pushes in very slowly for the whole 18s; a data callout
 * appears and the barrel price ticks up. The background never changes — that
 * continuity is what makes it read as a documentary shot, not a slideshow.
 *
 * Everything here is drawn in code (SVG) — no photos, no black-box placeholders.
 */
export const ContinuousShotSample: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // one slow continuous camera push (§3.4 Push): scale 1.00 → 1.13, plus drift.
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.13], {
    easing: EASE.inOut,
  });
  const driftX = interpolate(frame, [0, durationInFrames], [0, -44], {
    easing: EASE.inOut,
  });

  // tanker sails in from the right over 3.5s, then holds with a gentle bob.
  const shipW = 1220;
  const shipH = 380;
  const enterEnd = 3.5 * 30;
  const ease = (f: number) =>
    interpolate(f, [0, enterEnd], [WIDTH + 240, WIDTH * 0.04], {
      extrapolateRight: "clamp",
      easing: EASE.inOut,
    });
  const shipX = ease(frame);
  const shipVel = shipX - ease(frame - 1);
  const shipBlur = Math.min(Math.abs(shipVel) * 0.45, 24);
  const bob = Math.sin(frame / 42) * 5 + Math.sin(frame / 17) * 1.5;
  // sits with the keel ~30px below the waterline (0.72 * HEIGHT).
  const shipTop = HEIGHT * 0.72 - shipH * 0.82 + bob;

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.paper }}>
      {/* the camera push — everything spatial scales together */}
      <AbsoluteFill style={{ scale: zoom }}>
        {/* background plane — grid barely moves (parallax 0.15) */}
        <AbsoluteFill style={{ translate: `${driftX * 0.15}px 0px` }}>
          <Grid globalFrame={frame} />
          <Vignette />
        </AbsoluteFill>

        {/* deep-mid plane — the procedural sea (behind the ship) */}
        <AbsoluteFill style={{ translate: `${driftX * 0.45}px 0px` }}>
          <Ocean yFraction={0.72} layer="back" />
        </AbsoluteFill>

        {/* subject plane — the tanker + its print stroke (parallax 1.0) */}
        <AbsoluteFill style={{ translate: `${driftX}px 0px` }}>
          <div
            style={{
              position: "absolute",
              left: shipX,
              top: shipTop,
              width: shipW,
              height: shipH,
              filter: shipBlur > 0.5 ? `blur(${shipBlur}px)` : undefined,
            }}
          >
            <PaperEdge shape={Tanker} w={shipW} h={shipH} entryFrame={0} noShadow />
            <FlatFigure shape={Tanker} w={shipW} h={shipH} />
          </div>
        </AbsoluteFill>

        {/* the nearest crests, IN FRONT of the hull — the ship sits in the water */}
        <AbsoluteFill style={{ translate: `${driftX * 0.6}px 0px` }}>
          <Ocean yFraction={0.72} layer="front" />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* frame furniture — NOT camera-affected (§2.3, §2.7, §2.8) */}
      <Grain />
      <ProgressRule
        progress={interpolate(frame, [0, durationInFrames], [0.28, 0.34])}
      />
      <SourceTag>EIA crude spot price</SourceTag>

      {/* the data callout — enters at 5s, price ticks $53 → $116 by 9s */}
      <Callout
        x={WIDTH * 0.6}
        y={HEIGHT * 0.19}
        entryFrame={5 * 30}
        icon={<BarrelGlyph />}
        label="PER BARREL"
        valueNode={
          <CountUp
            from={53}
            to={116}
            start={5 * 30 + 10}
            end={9 * 30}
            format={fmt.usdFull}
            size={188}
          />
        }
      />
    </AbsoluteFill>
  );
};
