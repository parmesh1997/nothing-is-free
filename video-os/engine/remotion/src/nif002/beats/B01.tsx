import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, TYPE, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { EASE, springIn } from "../../parts/motion";
import { Bloom } from "../../parts/Bloom";
import { UICard, UIRow } from "../../archetypes/UIReveal";
import { AuctionFan } from "../AuctionFan";
import { Desk, phoneBody, phoneScreenRect, stopwatch } from "../shapes";
import { useStage, loop, pulse } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B01 — the half second you never see + the promise. OPENING · 1134 f.
 * Empty → build (VO-synced) → the auction ring PARKS (throughline for B07/B11/
 * B19/B26, hybrid model) → the promise → tail. Motion event every ≤3.5 s.
 *
 * VO: half second you never look at / you tap a free app / the app SENDS a small
 *     description of you to an ad EXCHANGE / a few HUNDRED companies read it /
 *     one of them pays about a CENT / all of it FINISHES before you notice /
 *     this episode PRICES that half second / EVERY company that gets paid /
 *     what your ATTENTION costs / and WHO set that price.
 */
export const B01: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props}>
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const PROMISE: Array<[string, string, "ink" | "orange" | "outline"]> = [
  ["EVERY COMPANY", "THAT GETS PAID.", "ink"],
  ["WHAT YOUR ATTENTION", "COSTS. TO THE CENT.", "outline"],
  ["WHO SET", "THAT PRICE.", "orange"],
];

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 12, holdFrames: 8 });
  const vo = useBeatTiming("B01");

  // ── event frames — whisper word starts, hand-set fallback ──
  const F = {
    kicker: 8,
    clock: vo.at("half", 30),
    phone: vo.at("tap", 128),
    reqStart: vo.at("sends", 214),
    reqRow: [0, 1, 2, 3].map((i) => vo.at("sends", 214) + 16 + i * 20),
    node: vo.at("exchange", 402),
    packet: vo.at("exchange", 402) + 58,
    ring: vo.at("hundred", 470),
    flare: vo.at("them", 560, 1),
    coin: vo.at("cent", 588),
    snap: vo.at("finishes", 704, 1),
    handoff: vo.at("prices", 792),
    monoLine: vo.at("prices", 792) + 24,
    promise: [vo.at("every", 862), vo.at("attention", 956), vo.at("who", 1058, 1)],
  };

  const groundY = Math.round(HEIGHT * 0.74);
  const deskH = HEIGHT - groundY;
  const phoneH = Math.round(HEIGHT * 0.44);
  const phoneW = Math.round(phoneH * 0.49);
  const phoneCx = Math.round(WIDTH * 0.2);
  const phoneTop = groundY - phoneH + 6;
  const scr = phoneScreenRect(phoneW, phoneH);

  const nodeX = WIDTH * 0.6;
  const nodeY = HEIGHT * 0.4;
  const ringR = Math.round(HEIGHT * 0.29);

  // the bid-request CARD — floats beside the phone, populates, then shrinks to a packet
  const cardX = phoneCx + phoneW * 0.7;
  const cardY = HEIGHT * 0.16;
  const cardW = 460;
  const cardH = 330;
  const toPacket = interpolate(frame, [F.packet, F.packet + 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const cardScale = 1 - 0.86 * toPacket;
  const cardCurX = interpolate(toPacket, [0, 1], [cardX, nodeX - 40]);
  const cardCurY = interpolate(toPacket, [0, 1], [cardY, nodeY - 20]);

  // phone exits LEFT at the handoff (beat-specific)
  const phoneGone = interpolate(frame, [F.handoff, F.handoff + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  const winAng = (38 / 150) * 2 * Math.PI - Math.PI / 2;
  const winX = nodeX + Math.cos(winAng) * ringR;
  const winY = nodeY + Math.sin(winAng) * ringR;

  const coinT = springIn({ frame, fps: 30, delay: F.coin, durationInFrames: 24 });
  const coinX = interpolate(Math.min(1, coinT), [0, 1], [winX, nodeX - ringR * 0.15]);
  const coinY = interpolate(Math.min(1, coinT), [0, 1], [winY, nodeY + ringR + 24]);

  const snapPulse = pulse(frame, F.snap, 0.12, 20);
  const barT = loop(frame, 40);

  // ── the auction ring: THROUGHLINE. It never disperses — after the handoff it
  //    RETIRES: shrinks, drifts to the top-right, fades to a faint watermark.
  //    A consistent parked pose B07 resumes from, and clear of SCENE B's promise
  //    text (which lives dead-centre).
  const ringRetire = interpolate(frame, [F.handoff, F.handoff + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const ringCarry = frame >= F.node ? stage.carry(frame, F.node, 16, 0.3) : 0;
  const ringOpacity = ringCarry * (1 - 0.85 * ringRetire);
  const ringScale = 1 - 0.66 * ringRetire; // 1 → 0.34
  const parkX = WIDTH * 0.84;
  const parkY = HEIGHT * 0.22;

  return (
    <>
      {/* desk — beat-specific, drops out */}
      <div style={{ position: "absolute", left: 0, top: groundY, width: WIDTH, height: deskH, opacity: stage.present(frame, F.phone - 10, 16), translate: `0px ${stage.flyY(frame, 1, 240)}px` }}>
        <FlatFigure shape={Desk} w={WIDTH} h={deskH} />
      </div>

      {/* kicker */}
      <div
        style={{
          position: "absolute", left: 120, top: HEIGHT * 0.1, ...TYPE.hero, fontSize: 114, lineHeight: 0.9,
          color: COLOR.ink, maxWidth: WIDTH * 0.5,
          opacity: interpolate(frame, [F.kicker, F.kicker + 14, F.clock + 24, F.clock + 48], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        THE HALF SECOND
        <br />
        YOU NEVER SEE
      </div>

      {/* stopwatch — "the half second" */}
      {frame >= F.clock && frame < F.phone + 46 && (
        <div
          style={{
            position: "absolute", left: WIDTH * 0.5 - 190, top: HEIGHT * 0.2, width: 380, height: 430,
            opacity: interpolate(frame, [F.clock, F.clock + 16, F.phone + 14, F.phone + 46], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: `0px ${interpolate(frame, [F.phone + 14, F.phone + 46], [0, -260], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })}px`,
          }}
        >
          <FlatFigure shape={stopwatch({ handAngle: interpolate(frame, [F.clock, F.clock + 96], [0, 340], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut }), label: "0.5 SEC" })} w={380} h={430} />
        </div>
      )}

      {/* ── the exchange ring — throughline: carries, then retires to a corner ── */}
      {frame >= F.node && ringOpacity > 0.003 && (
        <div
          style={{
            opacity: ringOpacity,
            scale: String(ringScale),
            translate: `${ringRetire * (parkX - nodeX)}px ${ringRetire * (parkY - nodeY)}px`,
            transformOrigin: `${nodeX}px ${nodeY}px`,
          }}
        >
          <AuctionFan originX={nodeX} originY={nodeY} count={150} radius={ringR} layout="ring" start={F.ring} fanFrames={120} outcome="none" winnerIndex={38} nodeLabel={ringRetire < 0.25 ? "THE EXCHANGE" : ""} />
        </div>
      )}

      {/* winner flare + Bloom */}
      {frame >= F.flare && frame < F.handoff && (
        <>
          <Bloom window={[F.coin - 4, F.coin + 8, F.coin + 40, F.coin + 64]} radius={70} x={coinX} y={coinY} intensity={0.85} />
          <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <circle cx={winX} cy={winY} r={interpolate(frame, [F.flare, F.flare + 22], [10, 36], { extrapolateRight: "clamp" })} fill={COLOR.orange} opacity={interpolate(frame, [F.flare, F.flare + 24, F.flare + 90], [0.9, 0.4, 0.25], { extrapolateRight: "clamp" })} />
            <circle cx={winX} cy={winY} r={36} fill="none" stroke={COLOR.orange} strokeWidth={4} />
          </svg>
        </>
      )}

      {/* ── the phone (beat-specific) — a "sending" state, the card does the detail ── */}
      {frame >= F.phone && phoneGone < 1 && (
        <div
          style={{
            position: "absolute", left: phoneCx - phoneW / 2, top: phoneTop, width: phoneW, height: phoneH,
            rotate: "-3deg", transformOrigin: "50% 100%",
            opacity: Math.min(1, stage.enter(frame, F.phone, 18)) * (1 - phoneGone),
            translate: `${-900 * phoneGone + (1 - Math.min(1, stage.enter(frame, F.phone))) * -40}px ${(1 - Math.min(1, stage.enter(frame, F.phone))) * 50}px`,
            scale: String(snapPulse),
          }}
        >
          <FlatFigure shape={phoneBody()} w={phoneW} h={phoneH} />
          <svg width={phoneW} height={phoneH} viewBox={`0 0 ${phoneW} ${phoneH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={scr.left + scr.width * (0.14 + (i % 3) * 0.28)} y={scr.top + scr.height * (0.14 + Math.floor(i / 3) * 0.22)} width={scr.width * 0.2} height={scr.width * 0.2} rx={scr.width * 0.05} fill={i === 1 ? COLOR.orange : COLOR.grey} opacity={i === 1 ? 1 : 0.55} />
            ))}
            <rect x={scr.left + scr.width * 0.14} y={scr.top + scr.height * 0.74} width={scr.width * 0.72 * (frame >= F.snap ? 1 : barT)} height={scr.height * 0.03} rx={3} fill={frame >= F.snap ? COLOR.orange : COLOR.ink} />
            <text x={scr.left + scr.width / 2} y={scr.top + scr.height * 0.9} textAnchor="middle" fontFamily={FONT.mono} fontSize={scr.width * 0.08} fill={frame >= F.snap ? COLOR.orange : COLOR.grey}>
              {frame >= F.snap ? "AD LOADED" : frame >= F.reqStart ? "SENDING…" : "OPENING…"}
            </text>
          </svg>
        </div>
      )}

      {/* ── the BID REQUEST card (UIReveal) — populates, then shrinks to a packet ── */}
      {frame >= F.reqStart && toPacket < 0.98 && (
        <div style={{ position: "absolute", left: cardCurX, top: cardCurY, scale: String(cardScale), transformOrigin: "0 0", opacity: 1 - Math.max(0, (toPacket - 0.7) / 0.3) }}>
          <UICard x={0} y={0} w={cardW} h={cardH} at={F.reqStart} title="BID REQUEST">
            {[
              { at: F.reqRow[0], label: "DEVICE + ID", value: "iPhone · a1f9-…-c2" },
              { at: F.reqRow[1], label: "LOCATION", value: "37.77, -122.41" },
              { at: F.reqRow[2], label: "APP", value: "the word game" },
              { at: F.reqRow[3], label: "+ WHAT THE KIT KNOWS", value: "………" },
            ].map((r, i) => (
              <UIRow key={i} {...r} x={cardW * 0.08} y={cardH * 0.22 + i * (cardH * 0.19)} w={cardW * 0.84} rowH={38} />
            ))}
          </UICard>
        </div>
      )}

      {/* the 1¢ coin */}
      {frame >= F.coin && frame < F.handoff && (
        <>
          <div style={{ position: "absolute", left: coinX - 44, top: coinY - 44, width: 88, height: 88, opacity: Math.min(1, coinT) }}>
            <svg width={88} height={88} viewBox="0 0 100 100">
              <circle cx={50} cy={50} r={46} fill={COLOR.orange} stroke={COLOR.outline} strokeWidth={3} />
              <text x={50} y={68} textAnchor="middle" fontFamily={FONT.hero} fontSize={50} fill={COLOR.cardWhite}>1¢</text>
            </svg>
          </div>
          {frame >= F.coin + 16 && (
            <div style={{ position: "absolute", left: coinX + 54, top: coinY - 14, fontFamily: FONT.mono, fontSize: 24, color: COLOR.ink, opacity: interpolate(frame, [F.coin + 16, F.coin + 30], [0, 1], { extrapolateRight: "clamp" }) }}>
              PAID TO REACH YOU
            </div>
          )}
        </>
      )}

      {/* "all in 0.4 seconds" — the peak */}
      {frame >= F.snap && frame < F.handoff && (
        <div style={{ position: "absolute", left: nodeX - 100, top: nodeY - ringR - 58, textAlign: "center", width: 200, fontFamily: FONT.mono, fontSize: 26, color: COLOR.ink, opacity: interpolate(frame, [F.snap, F.snap + 14], [0, 1], { extrapolateRight: "clamp" }) }}>
          ALL IN 0.4 SECONDS
        </div>
      )}

      {/* ── SCENE B — the promise (beat-specific) ── */}
      {frame >= F.monoLine && (
        <div
          style={{
            position: "absolute", left: 0, right: 0, top: HEIGHT * 0.22, textAlign: "center",
            fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.16em", color: COLOR.grey,
            opacity: interpolate(frame, [F.monoLine, F.monoLine + 16, F.promise[0] + 20, F.promise[0] + 40], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          THIS EPISODE PRICES THAT HALF SECOND
        </div>
      )}
      {PROMISE.map(([l1, l2, variant], i) => {
        const at = F.promise[i];
        const end = Math.max(at + 40, (F.promise[i + 1] ?? dur - 8) - 6);
        const inD = Math.min(14, (end - at) / 3);
        const vis = interpolate(frame, [at, at + inD, end - inD, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (vis <= 0.01) return null;
        const bg = variant === "ink" ? COLOR.ink : variant === "orange" ? COLOR.orange : "transparent";
        const fg = variant === "outline" ? COLOR.ink : COLOR.cardWhite;
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.4, display: "flex", justifyContent: "center", opacity: vis }}>
            <div style={{ backgroundColor: bg, color: fg, border: variant === "outline" ? `4px solid ${COLOR.ink}` : "none", padding: "20px 46px", fontFamily: FONT.hero, fontSize: 64, lineHeight: 1.0, letterSpacing: "0.02em", textAlign: "center", translate: `0px ${(1 - vis) * 16}px` }}>
              {l1}
              <br />
              {l2}
            </div>
          </div>
        );
      })}
    </>
  );
};
