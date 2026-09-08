import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { Bloom } from "../../parts/Bloom";
import { EASE } from "../../parts/motion";
import { appTile } from "../shapes";
import { Floor } from "../scene";
import { useStage, loop, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B16 — the app reshapes around the auction. MEDIUM · 781 f (26.0 s).
 * Delivered FAST — let each ARPDAU step land.
 * Empty → a plain game screen → a "WATCH 30s TO CONTINUE" panel grows out of it,
 * a countdown ring → ARPDAU steps up +30% then +60% → the panel re-labels
 * "A SEAT FOR THE AUCTION — WITH YOU IN IT" → empty.
 * Peak: "with you in it" — whisper "you" @ f746.
 */
export const B16: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Rewarded-video ARPDAU uplift — 2025 benchmarks">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 26, holdFrames: 12 });
  const vo = useBeatTiming("B16");

  const F = {
    screen: vo.at("shape", 92),
    panel: vo.at("reward", 223),
    step1: vo.at("30", 321),
    step2: vo.at("60", 337),
    slot: vo.at("grows", 400),
    favour: vo.at("favor", 611),
    seat: vo.at("seat", 660),
    peak: vo.at("you", 746, 3),
  };

  const gameX = WIDTH * 0.1;
  const gameY = HEIGHT * 0.14;
  const gameW = 520;
  const gameH = 520;

  const ring = loop(frame, 60);
  const bar1 = interpolate(frame, [F.step1, F.step1 + 30], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut });
  const bar2 = interpolate(frame, [F.step2 + 20, F.step2 + 60], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut });

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.22} kind="floor" />

      {/* ── game screen ── */}
      <div style={{ position: "absolute", left: gameX, top: gameY, width: gameW, height: gameH, opacity: stage.present(frame, F.screen - 12, 16) }}>
        <FlatFigure shape={appTile({ glyph: "controller", color: COLOR.grey })} w={gameW} h={gameH} />

        {/* the rewarded-video panel */}
        {frame >= F.panel && (
          <div
            style={{
              position: "absolute",
              left: gameW * 0.08,
              top: gameH * 0.62,
              width: gameW * 0.84,
              height: gameH * 0.3,
              background: COLOR.ink,
              color: COLOR.cardWhite,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: interpolate(frame, [F.panel, F.panel + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              scale: String(interpolate(frame, [F.panel, F.panel + 16, F.slot, F.slot + 30], [0.4, 1, 1, 1.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })),
              transformOrigin: "50% 100%",
            }}
          >
            <div style={{ fontFamily: FONT.hero, fontSize: 34, textAlign: "center", lineHeight: 1.05 }}>
              {frame >= F.seat ? "A SEAT FOR THE AUCTION" : frame >= F.favour ? "THANKS FOR WATCHING!" : "WATCH 30s TO CONTINUE"}
            </div>
            {frame < F.favour ? (
              <svg width={92} height={92} viewBox="0 0 92 92" style={{ marginTop: 6 }}>
                <circle cx={46} cy={46} r={38} fill="none" stroke={COLOR.grey} strokeWidth={7} />
                <circle cx={46} cy={46} r={38} fill="none" stroke={COLOR.orange} strokeWidth={7} strokeLinecap="round" strokeDasharray={2 * Math.PI * 38} strokeDashoffset={2 * Math.PI * 38 * ring} transform="rotate(-90 46 46)" />
                <text x={46} y={56} textAnchor="middle" fontFamily={FONT.hero} fontSize={38} fill={COLOR.cardWhite}>{Math.max(0, Math.ceil(30 - ring * 30))}</text>
              </svg>
            ) : (
              <svg width={120} height={92} viewBox="0 0 120 92" style={{ marginTop: 6, overflow: "visible" }}>
                {/* the "reward" that arrives — and a tiny you seated in the slot */}
                {frame < F.seat && (
                  <g opacity={interpolate(frame, [F.favour, F.favour + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    <circle cx={60} cy={40} r={22} fill={COLOR.orange} stroke={COLOR.cardWhite} strokeWidth={2} />
                    <text x={60} y={48} textAnchor="middle" fontFamily={FONT.hero} fontSize={22} fill={COLOR.cardWhite}>+50</text>
                  </g>
                )}
                {frame >= F.seat && (
                  <g opacity={interpolate(frame, [F.seat, F.seat + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                    <circle cx={60} cy={26} r={12} fill={COLOR.cardWhite} />
                    <rect x={48} y={40} width={24} height={30} rx={5} fill={COLOR.cardWhite} />
                    <text x={60} y={88} textAnchor="middle" fontFamily={FONT.mono} fontSize={13} fill={COLOR.orange}>YOU — SEATED</text>
                  </g>
                )}
              </svg>
            )}
          </div>
        )}
        {/* "grows a slot" — a callout as the panel expands */}
        {frame >= F.panel + 6 && frame < F.step1 && (
          <div style={{ position: "absolute", left: gameW + 24, top: gameH * 0.62, fontFamily: FONT.mono, fontSize: 18, color: COLOR.ink, opacity: interpolate(frame, [F.panel + 6, F.panel + 18, F.step1 - 10, F.step1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            ← the free game grows a slot
          </div>
        )}
      </div>

      {/* ── ARPDAU steps ── */}
      {frame >= F.step1 - 6 && (
        <div style={{ position: "absolute", left: WIDTH * 0.56, top: HEIGHT * 0.2, width: WIDTH * 0.36, opacity: stage.present(frame, F.step1, 14) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 40, color: COLOR.ink, marginBottom: 16 }}>REVENUE PER USER</div>
          <svg width={WIDTH * 0.36} height={280} style={{ overflow: "visible" }}>
            <line x1={0} y1={280} x2={WIDTH * 0.36} y2={280} stroke={COLOR.ink} strokeWidth={3} />
            <rect x={40} y={280 - 120} width={90} height={120} fill={COLOR.grey} stroke={COLOR.ink} strokeWidth={2.5} />
            <text x={85} y={280 + 26} textAnchor="middle" fontFamily={FONT.mono} fontSize={16} fill={COLOR.grey}>before</text>
            <rect x={200} y={280 - 120 * (1 + bar1 + bar2)} width={90} height={120 * (1 + bar1 + bar2)} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={2.5} scale={`1 ${pulse(frame, F.step2, 0.06, 16)}`} />
            <text x={245} y={280 + 26} textAnchor="middle" fontFamily={FONT.mono} fontSize={16} fill={COLOR.grey}>+ one video ad</text>
            <text x={245} y={280 - 120 * (1 + bar1 + bar2) - 14} textAnchor="middle" fontFamily={FONT.hero} fontSize={34} fill={COLOR.ink}>+30–60%</text>
          </svg>
        </div>
      )}

      <Bloom window={[F.peak - 4, F.peak + 12, F.peak + 60, F.peak + 90]} radius={220} x={`${((gameX + gameW * 0.5) / WIDTH) * 100}%`} y={`${((gameY + gameH * 0.78) / HEIGHT) * 100}%`} intensity={0.68} />

      {/* peak line */}
      {frame >= F.peak - 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.8, textAlign: "center", fontFamily: FONT.hero, fontSize: 50, color: COLOR.ink, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 16, dur - 4]) }}>
          A BETTER SEAT FOR THE AUCTION — <span style={{ color: COLOR.orange }}>WITH YOU IN IT.</span>
        </div>
      )}
    </>
  );
};
