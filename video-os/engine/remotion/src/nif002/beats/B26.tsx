import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { AuctionFan } from "../AuctionFan";
import { Bloom } from "../../parts/Bloom";
import { EASE } from "../../parts/motion";
import { phoneBody, phoneScreenRect } from "../shapes";
import { Floor } from "../scene";
import { useStage, loop, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B26 — you'll feel it now. MEDIUM · 1045 f (34.9 s). Paper returns.
 * A phone opens; on the half-beat a fast fan-burst fires → then it keeps
 * happening (open, burst, open, burst) as the VO says "every time" → pins
 * scatter with location tags → a small "Ask App Not to Track" prompt drops the
 * price chip 2¢ → 0.4¢ → "≈ 1 IN 7 turn it on".
 * Peak: "it just lowers your price" — whisper "price" @ f902.
 */
export const B26: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="ATT opt-in rate ≈ 14% (2024, Singular / Business of Apps)">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 30, holdFrames: 14 });
  const vo = useBeatTiming("B26");

  const F = {
    phone: vo.at("stutter", 75),
    burst: vo.at("pause", 233),
    every: vo.at("every", 307),
    note: vo.at("note", 512),
    vaguer: vo.at("vaguer", 588),
    prompt: vo.at("setting", 684),
    stop: vo.at("stop", 792),
    drop: vo.at("lowers", 872),
    oneIn7: vo.at("seven", 984),
  };
  const vague = interpolate(frame, [F.vaguer, F.vaguer + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  const phoneH = Math.round(HEIGHT * 0.5);
  const phoneW = Math.round(phoneH * 0.49);
  const phoneCx = WIDTH * 0.24;
  const groundY = HEIGHT * 0.86;
  const phoneCy = groundY - phoneH * 0.5;
  const scr = phoneScreenRect(phoneW, phoneH);
  const barT = loop(frame, 30);

  const priceDrop = interpolate(frame, [F.drop, F.drop + 30], [2, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  // recurring bursts: one every ~50 frames from F.every to F.note
  const bursts: number[] = [F.burst];
  for (let b = F.every; b < F.note; b += 52) bursts.push(b);
  const activeBurst = bursts.find((b) => frame >= b && frame < b + 26);

  return (
    <>
      <Floor stage={stage} at={4} heightFraction={0.22} kind="floor" />

      {/* ── phone ── */}
      <div style={{ position: "absolute", left: phoneCx - phoneW / 2, top: groundY - phoneH, width: phoneW, height: phoneH, opacity: stage.present(frame, F.phone, 16), translate: `${stage.fly(frame, -1, 500)}px 0px`, scale: String(activeBurst != null ? 1 + 0.02 * Math.sin((frame - activeBurst) * 0.6) : 1) }}>
        <FlatFigure shape={phoneBody()} w={phoneW} h={phoneH} />
        <svg width={phoneW} height={phoneH} viewBox={`0 0 ${phoneW} ${phoneH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <rect x={scr.left + scr.width * 0.16} y={scr.top + scr.height * 0.5} width={scr.width * 0.68} height={scr.height * 0.03} rx={3} fill={COLOR.grid} />
          <rect x={scr.left + scr.width * 0.16} y={scr.top + scr.height * 0.5} width={scr.width * 0.68 * barT} height={scr.height * 0.03} rx={3} fill={COLOR.ink} />
          <text x={scr.left + scr.width / 2} y={scr.top + scr.height * 0.64} textAnchor="middle" fontFamily={FONT.mono} fontSize={scr.width * 0.08} fill={COLOR.grey}>opening…</text>
        </svg>
      </div>

      {/* ── recurring fan bursts ── */}
      {activeBurst != null && (
        <div style={{ opacity: interpolate(frame - activeBurst, [0, 6, 16, 26], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <AuctionFan originX={phoneCx} originY={phoneCy} count={46} radius={260} spreadDeg={330} layout="ring" start={activeBurst} fanFrames={12} outcome="none" showNode={false} tileScale={0.62} />
        </div>
      )}
      {frame >= F.burst - 6 && frame < F.note && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.12, textAlign: "center", fontFamily: FONT.hero, fontSize: 46, color: COLOR.ink, opacity: interpolate(frame, [F.burst, F.burst + 12, F.note - 20, F.note], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {frame >= F.every ? "EVERY TIME. A FEW HUNDRED COMPANIES GET A NOTE." : "THAT PAUSE IS THE AUCTION."}
        </div>
      )}

      {/* ── pins scatter with location tags ── */}
      {frame >= F.note - 10 && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: safeRamp(frame, [F.note, F.note + 16, F.prompt + 40, F.prompt + 90]) }}>
          {Array.from({ length: 9 }).map((_, i) => {
            const t = loop(frame, 66, i * 0.11);
            const ang = (i / 9) * Math.PI * 2;
            const x = phoneCx + Math.cos(ang) * t * 460;
            const y = phoneCy + Math.sin(ang) * t * 260;
            return (
              <g key={i} opacity={(1 - t) * 0.85}>
                {/* precise dot blurs into a fuzzy blob once you ask for "vaguer" */}
                <circle cx={x} cy={y} r={6 + vague * 22} fill={COLOR.orange} opacity={interpolate(vague, [0, 1], [1, 0.28])} />
                {vague < 0.5 && i % 3 === 0 && <text x={x + 10} y={y + 4} fontFamily={FONT.mono} fontSize={13} fill={COLOR.grey}>37.77, -122.41</text>}
                {vague >= 0.5 && i % 3 === 0 && <text x={x + 10} y={y + 4} fontFamily={FONT.mono} fontSize={13} fill={COLOR.grey}>~ somewhere in the city</text>}
              </g>
            );
          })}
        </svg>
      )}

      {/* ── the price chip on the phone ── */}
      {frame >= F.note && (
        <div style={{ position: "absolute", left: phoneCx + phoneW * 0.6, top: groundY - phoneH * 0.85, fontFamily: FONT.mono, fontSize: 22, color: COLOR.ink, whiteSpace: "nowrap", opacity: stage.present(frame, F.note, 14) }}>
          your price:{" "}
          <span style={{ color: COLOR.orange, fontFamily: FONT.hero, fontSize: 44, display: "inline-block", scale: String(pulse(frame, F.drop + 6, 0.14, 22)) }}>
            {priceDrop.toFixed(priceDrop < 1 ? 1 : 0)}¢
          </span>
          {frame >= F.stop && frame < F.drop + 40 && <span style={{ color: COLOR.orange, fontFamily: FONT.hero, fontSize: 30, marginLeft: 8 }}>↓</span>}
        </div>
      )}

      {/* "it does NOT stop the auction" — a struck-through STOP */}
      {frame >= F.stop - 6 && frame < F.drop && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: interpolate(frame, [F.stop, F.stop + 10, F.drop - 16, F.drop], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <g transform={`translate(${WIDTH * 0.44} ${HEIGHT * 0.2})`}>
            <circle r={38} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={4} />
            <text y={8} textAnchor="middle" fontFamily={FONT.hero} fontSize={26} fill={COLOR.ink}>STOP</text>
            <line x1={-34} y1={34} x2={34} y2={-34} stroke={COLOR.orange} strokeWidth={5} />
          </g>
          <text x={WIDTH * 0.44} y={HEIGHT * 0.2 + 70} textAnchor="middle" fontFamily={FONT.mono} fontSize={15} fill={COLOR.grey}>the auction still runs</text>
        </svg>
      )}

      {/* ── the prompt — slides up as the VO names it ── */}
      {frame >= F.prompt - 8 && (
        <div style={{ position: "absolute", left: WIDTH * 0.52, top: HEIGHT * 0.3, width: 460, background: COLOR.cardWhite, border: `3px solid ${COLOR.ink}`, padding: "24px 28px", opacity: safeRamp(frame, [F.prompt, F.prompt + 16, dur - 18, dur - 6]), translate: `0px ${(1 - interpolate(frame, [F.prompt, F.prompt + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })) * 44}px` }}>
          <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 25, color: COLOR.ink }}>{frame >= vo.at("track", 770) ? "Ask app not to track" : "the setting is called…"}</div>
          <div style={{ fontFamily: FONT.sans, fontSize: 17, color: COLOR.grey, marginTop: 8 }}>doesn't stop the auction — it just lowers your price</div>
        </div>
      )}

      <Bloom window={[F.drop - 4, F.drop + 12, F.drop + 60, F.drop + 90]} radius={180} x="32%" y="42%" intensity={0.62} />

      {/* ── 1 in 7 ── */}
      {frame >= F.oneIn7 - 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.66, textAlign: "center", opacity: safeRamp(frame, [F.oneIn7, F.oneIn7 + 14, dur - 16, dur - 4]) }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ width: 40, height: 56, background: i === 0 ? COLOR.orange : COLOR.grey, opacity: i === 0 ? 1 : 0.4 }} />
            ))}
          </div>
          <div style={{ fontFamily: FONT.hero, fontSize: 40, color: COLOR.ink, marginTop: 14 }}>ABOUT 1 IN 7 TURN IT ON</div>
        </div>
      )}
    </>
  );
};
