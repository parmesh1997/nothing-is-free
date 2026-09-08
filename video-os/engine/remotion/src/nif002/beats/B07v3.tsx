import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { AuctionFan } from "../AuctionFan";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { useBeatTiming } from "../timing";
import { V3Beat } from "../v3/V3Beat";
import { Exchange } from "../v3/sets";
import { useStage3, bump, cyc } from "../v3/stage3";
import { V3 } from "../v3/palette";

/**
 * NIF002 B07 — v3. THE EXCHANGE as a built trading floor. Your description
 * slides in from the left, lands on the rostrum as a LOT; the fan fires to ~120
 * desks; one slides forward for inspection; a 100 ms clock sweeps and the slow
 * desks go dark → "REMEMBER THE LOSERS". Camera pushes in the whole beat.
 * Peak: "one hundred milliseconds".
 */
const CAMPAIGNS = ["sneakers", "a car loan", "a mobile game", "vitamins", "a dating app", "flights"];

export const B07v3: React.FC<BeatProps> = (props) => {
  const dur = props.durationInFrames;
  const vo = useBeatTiming("B07");
  const F = {
    node: vo.at("exchange", 6),
    lot: vo.at("lot", 88),
    fan: vo.at("sends", 148),
    hundreds: vo.at("hundreds", 282),
    buyer: vo.at("buyer", 412),
    campaign: vo.at("campaign", 579),
    worth: vo.at("worth", 671),
    sweep: vo.at("100", 862),
    tenth: vo.at("tenth", 969),
    thrown: vo.at("thrown", 1108),
    losers: vo.at("losers", 1182),
  };
  return (
    <V3Beat
      props={props}
      beat="B07"
      source="OpenRTB spec (IAB); RTB request volume — industry estimate"
      set={<Exchange deskRows={5} />}
      cam={[
        { at: 0, zoom: 1.02, y: -6 },
        { at: F.fan, zoom: 1.06, y: 6 },
        { at: F.sweep, zoom: 1.13, y: 14 },
        { at: dur, zoom: 1.18, y: 20 },
      ]}
    >
      <Content dur={dur} F={F} />
    </V3Beat>
  );
};

const Content: React.FC<{ dur: number; F: Record<string, number> }> = ({ dur, F }) => {
  const frame = useCurrentFrame();
  const s = useStage3(dur, { disperseFrames: 34, holdFrames: 14 });

  const nodeX = WIDTH * 0.5;
  const nodeY = HEIGHT * 0.44;
  const radius = Math.round(HEIGHT * 0.32);
  const sweepFrames = Math.max(30, F.tenth - F.sweep);

  const shownCount = Math.round(28 + interpolate(frame, [F.fan, F.hundreds + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * 92);

  const pkt = interpolate(frame, [F.node + 6, F.lot], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const pktX = interpolate(pkt, [0, 1], [-WIDTH * 0.12, nodeX]);
  const pktY = interpolate(pkt, [0, 1], [HEIGHT * 0.4, nodeY + 6]);

  const inspect = frame >= F.buyer && frame < F.sweep - 16;
  const inspectT = interpolate(frame, [F.buyer, F.buyer + 16, F.sweep - 36, F.sweep - 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      {/* rostrum under the node */}
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`translate(${nodeX} ${nodeY + 66})`} opacity={s.body(frame)}>
          <path d={`M -96 0 L 96 0 L 68 100 L -68 100 Z`} fill="#5a5044" />
          <path d={`M -96 0 L 96 0 L 92 10 L -92 10 Z`} fill="#7a6f5e" />
        </g>
      </svg>

      {/* THE EXCHANGE sign */}
      <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.05, textAlign: "center", opacity: interpolate(frame, [F.node, F.node + 16, F.fan + 30, F.fan + 60], [0, 1, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), translate: `0px ${(1 - Math.min(1, springIn({ frame, fps: 30, delay: F.node, durationInFrames: 16 }))) * -50}px` }}>
        <span style={{ fontFamily: FONT.hero, fontSize: 56, letterSpacing: "0.14em", color: V3.paperLight, background: V3.ink, padding: "5px 26px" }}>THE EXCHANGE</span>
      </div>

      {/* description packet → LOT (slides in from the left) */}
      {frame < F.fan + 50 && (
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform={`translate(${pktX} ${pktY}) scale(${interpolate(pkt, [0, 1], [1, 0.7])})`} opacity={interpolate(frame, [F.node, F.node + 10, F.lot + 24, F.lot + 40], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <rect x={-70} y={-46} width={140} height={92} rx={8} fill={COLOR.cardWhite} stroke={V3.ink} strokeWidth={3} />
            {[-24, -6, 12, 28].map((yy, k) => <rect key={k} x={-52} y={yy} width={[92, 66, 84, 40][k]} height={7} fill={V3.muted} />)}
            {pkt < 0.5 && <text x={0} y={-58} textAnchor="middle" fontFamily={FONT.mono} fontSize={15} fill={V3.paperLight}>your description</text>}
          </g>
        </svg>
      )}

      {/* the fan */}
      <div style={{ opacity: s.body(frame) }}>
        <AuctionFan
          originX={nodeX}
          originY={nodeY}
          count={shownCount}
          radius={radius}
          spreadDeg={196}
          layout="arc"
          start={F.fan}
          fanFrames={130}
          outcome="sweep"
          sweepStart={F.sweep}
          sweepFrames={sweepFrames}
          clockLabel="≈ 100 MS · A TENTH OF A SECOND"
          winnerIndex={Math.round(shownCount * 0.32)}
          nodeLabel="LOT · YOU"
          tileScale={1.1}
        />
      </div>

      <Bloom window={[F.lot - 4, F.lot + 10, F.lot + 40, F.lot + 60]} radius={radius * 0.8} x="50%" y="44%" intensity={0.7} />

      {/* buyer counter — slides down from the top */}
      {frame >= F.fan && (
        <div style={{ position: "absolute", left: WIDTH * 0.5 - 280, top: HEIGHT * 0.16, width: 560, textAlign: "center", fontFamily: FONT.mono, fontSize: 24, color: V3.paperLight, translate: `0px ${(1 - Math.min(1, springIn({ frame, fps: 30, delay: F.fan, durationInFrames: 16 }))) * -60}px`, opacity: s.body(frame) }}>
          BUYERS READING YOU:{" "}
          <span style={{ color: V3.accent, fontFamily: FONT.hero, fontSize: 40, display: "inline-block", scale: String(bump(frame, F.hundreds, 0.1, 18)) }}>{shownCount}</span>
          {frame >= F.hundreds && frame < F.sweep && <span style={{ color: V3.muted, fontSize: 17 }}> · {["reading", "bidding", "checking"][Math.floor(cyc(frame, 30) * 3)]}…</span>}
        </div>
      )}

      {/* one desk slides forward for inspection */}
      {inspect && (
        <div style={{ position: "absolute", left: WIDTH * 0.07, top: HEIGHT * 0.58, width: WIDTH * 0.44, opacity: inspectT, translate: `${(1 - inspectT) * -120}px 0px` }}>
          <div style={{ background: V3.ink, color: COLOR.cardWhite, padding: "20px 26px", fontFamily: FONT.mono, fontSize: 19, lineHeight: 1.7, borderLeft: `5px solid ${V3.accent}` }}>
            <div style={{ letterSpacing: "0.08em" }}>ONE BUYER = SOFTWARE</div>
            <div style={{ color: frame >= F.buyer + 20 ? COLOR.cardWhite : V3.muted }}>› reads you</div>
            {frame >= F.campaign - 40 && <div>› checks every campaign: <span style={{ color: V3.accent }}>{CAMPAIGNS[Math.floor(cyc(frame, 14) * CAMPAIGNS.length)]}</span></div>}
            {frame >= F.worth && <div>› decides what you&apos;re worth <span style={{ color: V3.accent }}>right now</span></div>}
          </div>
        </div>
      )}

      {/* "thrown out" + "remember the losers" */}
      {frame >= F.tenth + 8 && frame < F.losers + 20 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.12, textAlign: "center", fontFamily: FONT.mono, fontSize: 24, letterSpacing: "0.06em", color: V3.paperLight, opacity: interpolate(frame, [F.tenth + 8, F.tenth + 24, F.losers, F.losers + 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          SLOWER THAN 100 MS → <span style={{ color: V3.accent, fontFamily: FONT.hero, fontSize: 34 }}>{frame >= F.thrown ? "THROWN OUT" : "…"}</span>
        </div>
      )}
      {frame >= F.losers - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.8, textAlign: "center", opacity: interpolate(frame, [F.losers, F.losers + 12, dur - 16, dur - 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: FONT.hero, fontSize: 56, color: COLOR.cardWhite, letterSpacing: "0.03em", borderBottom: `5px solid ${V3.accent}`, paddingBottom: 6, display: "inline-block", scale: String(bump(frame, F.losers + 6, 0.05, 18)) }}>
            REMEMBER THE LOSERS.
          </span>
        </div>
      )}
    </>
  );
};
