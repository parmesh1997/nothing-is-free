import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { Bloom } from "../../parts/Bloom";
import { EASE } from "../../parts/motion";
import { Floor } from "../scene";
import { useStage, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B15 — the named toll. MEDIUM · 836 f (27.9 s).
 * Empty → a named card "THE TRADE DESK" → a bar with a ~20% wedge sliced out
 * ("fee to run the software") → the wedge pulses → 3 receding gates light
 * behind it ("only one of several steps") → empty.
 * Peak: "one fifth of the money" — whisper "fifth" @ f660.
 */
export const B15: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="The Trade Desk — investor filings (take rate ≈ 20% of gross spend)">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 28, holdFrames: 14 });
  const vo = useBeatTiming("B15");

  const F = {
    card: vo.at("name", 40),
    named: vo.at("trade", 126),
    biggest: vo.at("biggest", 153),
    bar: vo.at("charges", 279),
    fee: vo.at("fee", 466),
    peak: vo.at("fifth", 660),
    gates: vo.at("steps", 774),
  };

  const barW = WIDTH * 0.6;
  const barX = (WIDTH - barW) / 2;
  const barY = HEIGHT * 0.5;
  const wedge = interpolate(frame, [F.bar, F.bar + 50], [0, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut });
  const wedgePulse = pulse(frame, F.peak, 0.1, 22);

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.22} kind="desk" />

      {/* ── the named card — types its name, then a #1 badge ── */}
      <div
        style={{
          position: "absolute",
          left: WIDTH * 0.5 - 360,
          top: HEIGHT * 0.14,
          width: 720,
          padding: "30px 40px",
          background: COLOR.ink,
          color: COLOR.cardWhite,
          opacity: stage.present(frame, F.card, 16),
          translate: `0px ${(1 - Math.min(1, stage.enter(frame, F.card))) * 24}px`,
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 16, letterSpacing: "0.1em", opacity: 0.6 }}>ONE TOLL · A REAL NAME · A REAL NUMBER</div>
        <div style={{ fontFamily: FONT.hero, fontSize: 68, letterSpacing: "0.02em", marginTop: 4 }}>
          {"THE TRADE DESK".slice(0, Math.max(0, Math.floor(((frame - F.named) / 30) * 26)))}
          {frame < F.named + 20 && frame >= F.named && <span style={{ opacity: Math.floor(frame / 6) % 2 ? 1 : 0.2 }}>▍</span>}
        </div>
        {frame >= F.biggest && (
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 22, letterSpacing: "0.08em", textTransform: "uppercase", opacity: interpolate(frame, [F.biggest, F.biggest + 12], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), marginTop: 8 }}>
            the biggest independent buying platform in the world
          </div>
        )}
        {frame >= F.biggest + 20 && (
          <div style={{ position: "absolute", right: -24, top: -24, width: 80, height: 80, borderRadius: "50%", background: COLOR.orange, color: COLOR.cardWhite, fontFamily: FONT.hero, fontSize: 42, display: "flex", alignItems: "center", justifyContent: "center", scale: String(pulse(frame, F.biggest + 20, 0.2, 14)) }}>#1</div>
        )}
      </div>

      {/* the fee-fact bridging line while the bar waits */}
      {frame >= F.biggest + 40 && frame < F.bar && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.42, textAlign: "center", fontFamily: FONT.sans, fontWeight: 500, fontSize: 26, color: COLOR.grey, opacity: interpolate(frame, [F.biggest + 40, F.biggest + 54, F.bar - 10, F.bar], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          it charges advertisers on <span style={{ color: COLOR.ink }}>everything</span> they spend through it…
        </div>
      )}

      {/* ── the bar with a wedge ── */}
      {frame >= F.bar - 6 && (
        <div style={{ position: "absolute", left: barX, top: barY, width: barW, opacity: stage.exit(frame) }}>
          <div style={{ position: "relative", width: barW, height: 90, border: `3px solid ${COLOR.ink}`, background: COLOR.cardWhite }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(1 - wedge) * 100}%`, background: COLOR.grey }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${wedge * 100}%`, background: COLOR.orange, scale: `1 ${wedgePulse}`, transformOrigin: "center" }} />
            <div style={{ position: "absolute", left: `${(1 - wedge) * 100}%`, top: -34, translate: "-50% 0", fontFamily: FONT.mono, fontSize: 18, color: COLOR.ink }}>
              ≈ 20%
            </div>
          </div>
          <div style={{ fontFamily: FONT.hero, fontSize: 34, color: COLOR.ink, marginTop: 16, textAlign: "right" }}>
            THE FEE JUST TO RUN THE BIDDING SOFTWARE
          </div>
        </div>
      )}

      <Bloom window={[F.peak - 6, F.peak + 10, F.peak + 50, F.peak + 80]} radius={200} x="82%" y={`${((barY + 45) / HEIGHT) * 100}%`} intensity={0.7} />

      {/* peak line */}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.66, textAlign: "center", fontFamily: FONT.hero, fontSize: 56, color: COLOR.ink, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 18, dur - 5]) }}>
          ONE COMPANY · ONE STEP · <span style={{ color: COLOR.orange }}>ONE FIFTH</span>
        </div>
      )}

      {/* ── receding gates ── */}
      {frame >= F.gates - 6 && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: safeRamp(frame, [F.gates, F.gates + 14, dur - 16, dur - 4]) }}>
          {[0, 1, 2].map((i) => {
            const on = interpolate(frame, [F.gates + i * 16, F.gates + i * 16 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const scale = 1 - i * 0.16;
            return (
              <g key={i} opacity={on * (0.9 - i * 0.2)} transform={`translate(${WIDTH * 0.5 + (i - 1) * 200} ${HEIGHT * 0.78}) scale(${scale})`}>
                <rect x={-16} y={-70} width={32} height={140} fill={COLOR.ink} />
                <text x={0} y={-84} textAnchor="middle" fontFamily={FONT.mono} fontSize={14} fill={COLOR.grey}>step {i + 2}</text>
              </g>
            );
          })}
        </svg>
      )}
    </>
  );
};
