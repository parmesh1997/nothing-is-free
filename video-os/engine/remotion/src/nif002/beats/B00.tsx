import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, TYPE, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { CoffeeCup, Coins } from "../../print/props";
import { Bloom } from "../../parts/Bloom";
import { Desk, Notebook, phoneBody, phoneScreenRect } from "../shapes";
import { useStage, loop, pulse } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B00 — signature + the claim. OPENING · 277 f (9.25 s).
 * Empty → build → disperse → empty. Event frames sync to the whisper transcript
 * (`vo.at(word, fallback)`), Bloom on the "auction" landing (v2.0 §5.6).
 * VO: "Nothing is free." / "And the app that just charged you nothing" /
 *     "ran an auction" / "the second you opened it". Peak: "auction".
 */
export const B00: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props}>
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 16, holdFrames: 8 });
  const vo = useBeatTiming("B00");

  const groundY = Math.round(HEIGHT * 0.78);
  const deskH = HEIGHT - groundY;
  const phoneH = Math.round(HEIGHT * 0.52);
  const phoneW = Math.round(phoneH * 0.49);
  const phoneCx = Math.round(WIDTH * 0.7);
  const phoneTop = groundY - phoneH + 6;
  const scr = phoneScreenRect(phoneW, phoneH);

  // ── event timings — whisper word starts, with the hand-set frame as fallback ──
  const F_FIXED = 6; // "Nothing is free." (opens the beat)
  const F_DESK = 30; // desk + phone arrive
  const F_CLAUSE = vo.at("and", 58); // "And the app that just charged you nothing"
  const F_CUP = Math.round((F_CLAUSE + vo.at("auction", 156)) / 2) - 10;
  const F_COINS = F_CUP + 22;
  const F_AUCTION = vo.at("auction", 156); // the peak
  const F_TAIL = vo.at("second", 208, 1); // "the second you opened it"

  const fixedIn = interpolate(frame, [F_FIXED, F_FIXED + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clauseIn = stage.present(frame, F_CLAUSE, 44);
  const auctionPulse = pulse(frame, F_AUCTION, 0.14, 16);
  const tailPulse = pulse(frame, F_TAIL, 0.05, 12);

  const barT = loop(frame, 44); // looping loading bar

  return (
    <>
      {/* ── the desk (bottom-third anchor) ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: groundY,
          width: WIDTH,
          height: deskH,
          opacity: stage.present(frame, F_DESK, 16),
          translate: `0px ${(1 - Math.min(1, stage.enter(frame, F_DESK))) * 60 + stage.flyY(frame, 1, 260)}px`,
        }}
      >
        <FlatFigure shape={Desk} w={WIDTH} h={deskH} />
      </div>

      {/* notebook + coffee + coins — enter one at a time, fly right on disperse */}
      <DeskItem stage={stage} frame={frame} at={F_DESK + 10} x={WIDTH * 0.47} y={groundY - 150} w={280} h={168} shape={Notebook} dir={1} />
      <DeskItem stage={stage} frame={frame} at={F_CUP} x={WIDTH * 0.86} y={groundY - 226} w={160} h={226} shape={CoffeeCup} dir={1} />
      <DeskItem stage={stage} frame={frame} at={F_COINS} x={WIDTH * 0.945} y={groundY - 128} w={140} h={118} shape={Coins} dir={1} />

      {/* ── the phone (subject) ── */}
      <div
        style={{
          position: "absolute",
          left: phoneCx - phoneW / 2,
          top: phoneTop,
          width: phoneW,
          height: phoneH,
          rotate: "-5deg",
          transformOrigin: "50% 100%",
          opacity: stage.present(frame, F_DESK + 4, 18),
          translate: `${stage.fly(frame, 1, 700)}px ${(1 - Math.min(1, stage.enter(frame, F_DESK + 4))) * 40}px`,
          scale: String(auctionPulse * tailPulse),
        }}
      >
        {/* Bloom on the auction "landing" — the one accent glow (v2.0 §5.6) */}
        <Bloom window={[F_AUCTION - 4, F_AUCTION + 8, F_AUCTION + 34, F_AUCTION + 54]} radius={phoneW * 0.9} x="50%" y="40%" intensity={0.8} />
        <FlatFigure shape={phoneBody()} w={phoneW} h={phoneH} />
        <svg width={phoneW} height={phoneH} viewBox={`0 0 ${phoneW} ${phoneH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform={`translate(${scr.left + scr.width / 2} ${scr.top + scr.height * 0.36})`}>
            <rect x={-scr.width * 0.17} y={-scr.width * 0.17} width={scr.width * 0.34} height={scr.width * 0.34} rx={scr.width * 0.08} fill={COLOR.ink} />
            <rect x={-scr.width * 0.06} y={-scr.width * 0.08} width={scr.width * 0.12} height={scr.width * 0.16} rx={scr.width * 0.02} fill={COLOR.cardWhite} />
          </g>
          {/* looping loading bar */}
          <rect x={scr.left + scr.width * 0.16} y={scr.top + scr.height * 0.62} width={scr.width * 0.68} height={scr.height * 0.035} rx={scr.height * 0.02} fill={COLOR.grid} />
          <rect x={scr.left + scr.width * 0.16} y={scr.top + scr.height * 0.62} width={scr.width * 0.68 * barT} height={scr.height * 0.035} rx={scr.height * 0.02} fill={COLOR.ink} />
          <text x={scr.left + scr.width / 2} y={scr.top + scr.height * 0.76} textAnchor="middle" fontFamily={FONT.mono} fontSize={scr.width * 0.085} fill={COLOR.grey}>
            OPENING…
          </text>
          {/* the auction "tick" on the screen at the peak */}
          {frame >= F_AUCTION && frame < F_AUCTION + 30 && (
            <circle
              cx={scr.left + scr.width / 2}
              cy={scr.top + scr.height * 0.36}
              r={interpolate(frame, [F_AUCTION, F_AUCTION + 24], [scr.width * 0.2, scr.width * 0.5], { extrapolateRight: "clamp" })}
              fill="none"
              stroke={COLOR.orange}
              strokeWidth={4}
              opacity={interpolate(frame, [F_AUCTION, F_AUCTION + 28], [1, 0], { extrapolateRight: "clamp" })}
            />
          )}
        </svg>
      </div>

      {/* ── SIGNATURE type ── */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: HEIGHT * 0.14,
          width: WIDTH * 0.52,
          translate: `${stage.fly(frame, -1, 720)}px 0px`,
        }}
      >
        <div style={{ ...TYPE.hero, fontSize: 200, lineHeight: 0.9, color: COLOR.ink, opacity: fixedIn * stage.exit(frame) }}>
          NOTHING
          <br />
          IS FREE.
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: FONT.sans,
            fontWeight: 500,
            fontSize: 46,
            lineHeight: 1.3,
            color: COLOR.ink,
            opacity: clauseIn,
            translate: `0px ${(1 - Math.min(1, stage.enter(frame, F_CLAUSE, 44))) * 14}px`,
            maxWidth: 680,
          }}
        >
          And the app that just charged you nothing ran an{" "}
          <span style={{ color: COLOR.orange, display: "inline-block", scale: String(auctionPulse) }}>auction</span> the
          second you opened it.
        </div>
      </div>
    </>
  );
};

const DeskItem: React.FC<{
  stage: ReturnType<typeof useStage>;
  frame: number;
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: Parameters<typeof FlatFigure>[0]["shape"];
  dir: 1 | -1;
}> = ({ stage, frame, at, x, y, w, h, shape, dir }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      opacity: stage.present(frame, at, 16),
      translate: `${stage.fly(frame, dir, 640)}px ${(1 - Math.min(1, stage.enter(frame, at))) * 30}px`,
    }}
  >
    <FlatFigure shape={shape} w={w} h={h} />
  </div>
);
