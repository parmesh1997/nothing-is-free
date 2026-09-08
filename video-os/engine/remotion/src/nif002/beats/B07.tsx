import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { AuctionFan } from "../AuctionFan";
import { Bloom } from "../../parts/Bloom";
import { EASE } from "../../parts/motion";
import { Floor } from "../scene";
import { useStage, loop, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B07 — the exchange fans it out. HIGH · 1266 f (42.2 s). AuctionFan debut.
 * The description flies to THE EXCHANGE → becomes a lot → fans to ~120 buyers,
 * each blinking a bid → one buyer zooms: "reads you · checks every campaign ·
 * decides what you're worth" → a 100 ms clock sweeps, the slow bidders grey out
 * → "REMEMBER THE LOSERS".
 * Peak: "one hundred milliseconds" — whisper "100" @ f862.
 */
export const B07: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="OpenRTB spec (IAB); RTB request volume — industry estimate">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 34, holdFrames: 14 });
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

  const nodeX = WIDTH * 0.5;
  const nodeY = HEIGHT * 0.5;
  const radius = Math.round(HEIGHT * 0.38);
  const sweepFrames = Math.max(30, F.tenth - F.sweep);

  const cam = interpolate(frame, [F.node, F.node + 40, F.sweep - 40, F.sweep + 90], [0.9, 1, 1, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const buyerCount = interpolate(frame, [F.fan, F.hundreds + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shownCount = Math.round(28 + buyerCount * 92);

  // the description packet flies to the node
  const pkt = interpolate(frame, [F.node + 10, F.lot], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  // one buyer zooms out for inspection
  const inspect = frame >= F.buyer && frame < F.sweep - 20;
  const inspectT = interpolate(frame, [F.buyer, F.buyer + 16, F.sweep - 40, F.sweep - 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const CAMPAIGNS = ["sneakers", "a car loan", "a mobile game", "vitamins", "a dating app", "flights"];

  return (
    <>
      <Floor stage={stage} at={4} heightFraction={0.22} kind="floor" tone={COLOR.grey} />

      <div style={{ position: "absolute", inset: 0, scale: String(cam), transformOrigin: `${nodeX}px ${nodeY}px`, opacity: stage.exit(frame) }}>
        <AuctionFan
          originX={nodeX}
          originY={nodeY}
          count={shownCount}
          radius={radius}
          spreadDeg={200}
          layout="arc"
          start={F.fan}
          fanFrames={130}
          outcome="sweep"
          sweepStart={F.sweep}
          sweepFrames={sweepFrames}
          clockLabel="≈ 100 MS  ·  A TENTH OF A SECOND"
          winnerIndex={Math.round(shownCount * 0.32)}
          nodeLabel="THE EXCHANGE"
          tileScale={1.2}
        />
        {/* the description packet → lot */}
        {frame < F.fan + 40 && (
          <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <rect
              x={interpolate(pkt, [0, 1], [WIDTH * 0.06, nodeX - 26])}
              y={interpolate(pkt, [0, 1], [HEIGHT * 0.2, nodeY - 18])}
              width={interpolate(pkt, [0, 1], [120, 52])}
              height={interpolate(pkt, [0, 1], [70, 36])}
              rx={6}
              fill={COLOR.cardWhite}
              stroke={COLOR.ink}
              strokeWidth={2.5}
              opacity={interpolate(frame, [F.node + 6, F.node + 16, F.lot + 20, F.lot + 34], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            />
            {pkt < 0.6 && <text x={WIDTH * 0.06} y={HEIGHT * 0.2 - 10} fontFamily={FONT.mono} fontSize={16} fill={COLOR.grey}>your description</text>}
          </svg>
        )}
      </div>

      {/* running buyer counter — always ticking */}
      {frame >= F.fan && (
        <div style={{ position: "absolute", left: WIDTH * 0.06, top: HEIGHT * 0.08, fontFamily: FONT.mono, fontSize: 24, color: COLOR.ink, opacity: stage.present(frame, F.fan, 14) }}>
          BUYERS READING YOU: <span style={{ color: COLOR.orange, fontFamily: FONT.hero, fontSize: 36 }}>{shownCount}</span>
          {frame >= F.hundreds && frame < F.sweep && <span style={{ color: COLOR.grey, fontSize: 18 }}> · {["reading", "bidding", "checking"][Math.floor(loop(frame, 30) * 3)]}…</span>}
        </div>
      )}

      {/* ── one buyer, zoomed: what it does ── */}
      {inspect && (
        <div style={{ position: "absolute", left: WIDTH * 0.06, top: HEIGHT * 0.56, width: WIDTH * 0.42, opacity: inspectT }}>
          <div style={{ background: COLOR.ink, color: COLOR.cardWhite, padding: "18px 24px", fontFamily: FONT.mono, fontSize: 18, lineHeight: 1.7 }}>
            <div>ONE BUYER = SOFTWARE</div>
            <div style={{ color: frame >= F.buyer + 20 ? COLOR.cardWhite : COLOR.grey }}>› reads you</div>
            {frame >= F.campaign - 40 && <div>› checks every campaign: <span style={{ color: COLOR.orange }}>{CAMPAIGNS[Math.floor(loop(frame, 14) * CAMPAIGNS.length)]}</span></div>}
            {frame >= F.worth && <div>› decides what you're worth <span style={{ color: COLOR.orange }}>right now</span></div>}
          </div>
        </div>
      )}

      <Bloom window={[F.sweep + sweepFrames - 6, F.sweep + sweepFrames + 10, F.tenth + 50, F.tenth + 80]} radius={radius * 1.1} x={`${(nodeX / WIDTH) * 100}%`} y={`${(nodeY / HEIGHT) * 100}%`} intensity={0.7} />

      {/* "answer any slower and the bid is thrown out" — the slow ones drop */}
      {frame >= F.tenth + 10 && frame < F.losers && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.12, textAlign: "center", fontFamily: FONT.mono, fontSize: 24, letterSpacing: "0.06em", color: COLOR.ink, opacity: interpolate(frame, [F.tenth + 10, F.tenth + 26, F.losers - 20, F.losers], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          SLOWER THAN 100 MS →{" "}
          <span style={{ color: COLOR.orange, fontFamily: FONT.hero, fontSize: 34 }}>{frame >= F.thrown ? "THROWN OUT" : "…"}</span>
        </div>
      )}
      {frame >= F.thrown - 2 && frame < F.losers + 20 && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: interpolate(frame, [F.thrown, F.thrown + 10, F.losers, F.losers + 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const fall = interpolate(frame, [F.thrown + i * 3, F.thrown + i * 3 + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
            return (
              <rect
                key={i}
                x={nodeX + Math.cos(a) * radius * 0.8 - 12}
                y={nodeY + Math.sin(a) * radius * 0.8 - 12 + fall * HEIGHT * 0.6}
                width={24}
                height={24}
                fill={COLOR.grey}
                stroke={COLOR.ink}
                strokeWidth={2}
                opacity={(1 - fall) * 0.8}
                transform={`rotate(${fall * 90} ${nodeX + Math.cos(a) * radius * 0.8} ${nodeY + Math.sin(a) * radius * 0.8 + fall * HEIGHT * 0.6})`}
              />
            );
          })}
        </svg>
      )}

      {/* the losers caption */}
      {frame >= F.losers - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.9, textAlign: "center", opacity: safeRamp(frame, [F.losers, F.losers + 12, dur - 20, dur - 6]) }}>
          <span style={{ fontFamily: FONT.hero, fontSize: 54, color: COLOR.cardWhite, letterSpacing: "0.03em", borderBottom: `5px solid ${COLOR.orange}`, paddingBottom: 6, scale: String(pulse(frame, F.losers + 6, 0.05, 18)), display: "inline-block" }}>
            REMEMBER THE LOSERS.
          </span>
        </div>
      )}
    </>
  );
};
