import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { Bloom } from "../../parts/Bloom";
import { EASE } from "../../parts/motion";
import { phoneBody, phoneScreenRect } from "../shapes";
import { Floor } from "../scene";
import { useStage, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B11 — the money flows back. HIGH · 992 f (33.1 s).
 * Empty → the winning bid lights, the ad paints on a phone → a full $ coin
 * appears at the right → it travels R→L through four gates, a sliver shaved at
 * each, shrinking → it reaches the app, small → "each one keeps a slice" → empty.
 * Peak: "each one keeps a slice" — whisper "slice" @ f944.
 */
export const B11: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Programmatic supply chain — mechanism">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const GATES = ["BUYER'S SOFTWARE", "THE EXCHANGE", "SELLER'S SOFTWARE", "DATA COMPANY"];

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 30, holdFrames: 14 });
  const vo = useBeatTiming("B11");

  const F = {
    win: vo.at("wins", 41),
    paint: vo.at("drawn", 92),
    loaded: vo.at("loading", 254),
    charged: vo.at("charged", 350),
    flow: vo.at("flows", 448),
    g0: vo.at("buyer", 567),
    g1: vo.at("exchange", 628),
    g2: vo.at("sell", 736),
    g3: vo.at("data", 809),
    peak: vo.at("slice", 944),
  };

  const laneY = HEIGHT * 0.44;
  const rightX = WIDTH * 0.92;
  const appX = WIDTH * 0.16;
  const groundY = HEIGHT * 0.86;

  const gateFrames = [F.g0, F.g1, F.g2, F.g3];
  const gateX = [0.74, 0.58, 0.42, 0.28].map((f) => f * WIDTH);

  // coin travels a chain of waypoints: right edge → gate0 → gate1 → gate2 → gate3 → app
  // it starts moving at "flows back" so the middle of the beat is never static
  const wpX = [rightX, ...gateX, appX];
  const wpF = [F.flow, ...gateFrames, F.peak];
  let coinX = rightX;
  for (let i = 0; i < wpX.length - 1; i++) {
    if (frame >= wpF[i]) {
      coinX = interpolate(frame, [wpF[i], wpF[i + 1]], [wpX[i], wpX[i + 1]], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
    }
  }
  const shaves = gateFrames.filter((gf) => frame >= gf).length;
  const coinR = interpolate(shaves, [0, 4], [58, 22], { extrapolateRight: "clamp" });

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.24} kind="floor" />

      {/* the app (left) receiving the shrunk coin */}
      {(() => {
        const pw = 150;
        const ph = 300;
        const scr = phoneScreenRect(pw, ph);
        return (
          <div style={{ position: "absolute", left: appX - pw / 2, top: groundY - ph, width: pw, height: ph, opacity: stage.present(frame, F.win, 16), rotate: "-3deg", transformOrigin: "50% 100%" }}>
            <FlatFigure shape={phoneBody()} w={pw} h={ph} />
            <svg width={pw} height={ph} viewBox={`0 0 ${pw} ${ph}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <rect x={scr.left} y={scr.top} width={scr.width} height={scr.height} fill={frame >= F.paint ? [COLOR.orange, COLOR.ink, COLOR.grey][Math.floor(frame / 14) % 3] : COLOR.cardWhite} opacity={frame >= F.paint ? 0.92 : 1} />
              <text x={pw / 2} y={scr.top + scr.height * 0.5} textAnchor="middle" fontFamily={FONT.hero} fontSize={24} fill={COLOR.cardWhite}>{frame >= F.paint ? "AD" : ""}</text>
              {frame >= F.loaded && <text x={pw / 2} y={scr.top + scr.height * 0.86} textAnchor="middle" fontFamily={FONT.mono} fontSize={13} fill={COLOR.cardWhite}>loaded before you noticed</text>}
            </svg>
            <div style={{ position: "absolute", left: -10, top: ph + 12, width: pw + 20, textAlign: "center", fontFamily: FONT.mono, fontSize: 15, color: COLOR.grey }}>the app that showed you the ad</div>
          </div>
        );
      })()}

      {/* the winning tile lights first */}
      {frame < F.flow && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: interpolate(frame, [F.win - 10, F.win, F.charged, F.flow], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <rect x={rightX - 40} y={laneY - 100} width={80} height={54} rx={5} fill={COLOR.cardWhite} stroke={COLOR.orange} strokeWidth={4} />
          <rect x={rightX - 40} y={laneY - 100} width={80} height={18} fill={COLOR.ink} />
          <circle cx={rightX + 22} cy={laneY - 65} r={9} fill={COLOR.orange} />
          <text x={rightX} y={laneY - 118} textAnchor="middle" fontFamily={FONT.mono} fontSize={15} fill={COLOR.ink}>HIGHEST BID WINS</text>
        </svg>
      )}

      {/* the gates */}
      <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: stage.exit(frame) }}>
        <line x1={appX} y1={laneY} x2={rightX} y2={laneY} stroke={COLOR.ink} strokeWidth={2.5} strokeDasharray="3 12" opacity={0.5} />
        {GATES.map((g, i) => {
          const on = interpolate(frame, [gateFrames[i] - 30, gateFrames[i]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (on <= 0.01) return null;
          const passed = frame >= gateFrames[i];
          return (
            <g key={i} opacity={Math.min(1, on)}>
              <rect x={gateX[i] - 16} y={laneY - 96} width={32} height={192} fill={passed ? COLOR.orange : COLOR.ink} />
              <text x={gateX[i]} y={laneY - 112} textAnchor="middle" fontFamily={FONT.mono} fontSize={16} fill={COLOR.ink}>{g}</text>
              {passed && <text x={gateX[i]} y={laneY + 128} textAnchor="middle" fontFamily={FONT.mono} fontSize={15} fill={COLOR.grey}>− a slice</text>}
            </g>
          );
        })}
      </svg>

      {/* the charged label at the right */}
      {frame >= F.charged - 8 && frame < F.g0 && (
        <div style={{ position: "absolute", left: rightX - 150, top: laneY - 150, width: 300, textAlign: "center", fontFamily: FONT.hero, fontSize: 30, color: COLOR.ink, opacity: interpolate(frame, [F.charged, F.charged + 12, F.flow + 20, F.flow + 40], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          ADVERTISER CHARGED <span style={{ color: COLOR.orange }}>$2.00</span>
          <div style={{ fontFamily: FONT.mono, fontSize: 16, color: COLOR.grey }}>now it flows back down the chain</div>
        </div>
      )}

      {/* the coin */}
      {frame >= F.charged - 4 && (
        <div style={{ position: "absolute", left: coinX - coinR, top: laneY - coinR, width: coinR * 2, height: coinR * 2, opacity: stage.exit(frame), scale: String(pulse(frame, gateFrames.find((gf) => Math.abs(frame - gf) < 3) ?? -99, 0.14, 12)) }}>
          <svg width={coinR * 2} height={coinR * 2} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={46} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={4} />
            <text x={50} y={68} textAnchor="middle" fontFamily={FONT.hero} fontSize={52} fill={COLOR.cardWhite}>$</text>
          </svg>
        </div>
      )}

      {/* peak line */}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.72, textAlign: "center", fontFamily: FONT.hero, fontSize: 60, letterSpacing: "0.02em", color: COLOR.ink, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 18, dur - 5]) }}>
          EACH ONE KEEPS <span style={{ color: COLOR.orange }}>A SLICE</span> ON THE WAY PAST.
          <Bloom window={[F.peak + 4, F.peak + 18, dur - 26, dur - 10]} radius={240} x="50%" y="0%" intensity={0.62} />
        </div>
      )}
    </>
  );
};
