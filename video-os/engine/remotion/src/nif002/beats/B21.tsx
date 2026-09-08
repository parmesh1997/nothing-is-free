import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { CountUp } from "../../parts/CountUp";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { Floor, TitleSlab } from "../scene";
import { useStage, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B21 — the walled gardens. HIGH · 1407 f (46.9 s).
 * Empty → the whole toll chain, shown small, collapses into a box marked OPEN →
 * a huge WALLED block rises → a spend bar fills ~75% into it → Google / Meta /
 * Amazon values count up → one orange pulse on the block → empty.
 * Peak: "two hundred billion dollars" — whisper "200" @ f976.
 */
export const B21: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Alphabet, Meta, Amazon 10-K filings (2025)">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const VALUES = [
  { name: "GOOGLE ADS", to: 200, fmt: (n: number) => `$${Math.round(n)}B`, at: "200" },
  { name: "META ADS", to: 190, fmt: (n: number) => `$${Math.round(n)}B`, at: "190" },
  { name: "AMAZON ADS", to: 20, fmt: (n: number) => `$${Math.round(n)}B / qtr`, at: "20" },
];

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 38, holdFrames: 16 });
  const vo = useBeatTiming("B21");

  const F = {
    intro: vo.at("open", 48),
    collapse: vo.at("there", 196),
    rise: vo.at("quarters", 242),
    bar: vo.at("private", 473),
    names: vo.at("google", 526),
    merge: vo.at("chain", 690),
    owns: vo.at("owns", 783),
    share: vo.at("alone", 913),
    v0: vo.at("200", 976),
    v1: vo.at("190", 1120),
    v2: vo.at("20", 1322, 1),
    peak: vo.at("billion", 1001),
  };
  const valFrames = [F.v0, F.v1, F.v2];
  // stagger the three names off the first "Google Meta Amazon" so they don't all hit at once
  const nameFrames = [F.names, F.names + 52, F.names + 104];
  const NAMES = ["GOOGLE", "META", "AMAZON"];

  // 4 tolls slide together into 1 gate on "one company owns every step"
  const mergeT = interpolate(frame, [F.merge, F.owns], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  // OPEN box (small, left) vs WALLED block (big, right)
  const openX = WIDTH * 0.08;
  const openY = HEIGHT * 0.52;
  const openS = interpolate(frame, [F.collapse, F.collapse + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  const wallX = WIDTH * 0.34;
  const wallY = HEIGHT * 0.14;
  const wallW = WIDTH * 0.58;
  const wallH = HEIGHT * 0.66;
  const wallRise = springIn({ frame, fps: 30, delay: F.rise, durationInFrames: 24 });
  const barFrac = interpolate(frame, [F.bar, F.bar + 60], [0, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut });
  const wallPulse = pulse(frame, F.peak, 0.03, 26);

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.16} kind="floor" />
      <TitleSlab lines={["MOST OF THE MONEY ISN'T IN THE OPEN AUCTION"]} at={F.intro} outAt={F.rise + 10} />

      {/* ── OPEN box ── */}
      {openS > 0.01 && (
        <div style={{ position: "absolute", left: openX, top: openY, width: 220, height: 260, border: `3px solid ${COLOR.ink}`, background: COLOR.cardWhite, opacity: openS * stage.exit(frame), scale: String(0.5 + 0.5 * openS) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 34, color: COLOR.ink, textAlign: "center", marginTop: 14 }}>OPEN</div>
          <div style={{ fontFamily: FONT.mono, fontSize: 13, color: COLOR.grey, textAlign: "center", marginTop: 4 }}>the chain of tolls</div>
          {/* faint collapsed chain */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 8, background: COLOR.grey, opacity: 0.4, margin: "18px 24px 0" }} />
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", fontFamily: FONT.mono, fontSize: 12, color: COLOR.grey }}>~25% of the spend</div>
        </div>
      )}

      {/* ── WALLED block ── */}
      {wallRise > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: wallX,
            top: wallY,
            width: wallW,
            height: wallH,
            background: COLOR.ink,
            opacity: Math.min(1, wallRise) * stage.exit(frame),
            translate: `0px ${(1 - Math.min(1, wallRise)) * 120}px`,
            scale: `1 ${wallPulse}`,
            transformOrigin: "50% 100%",
          }}
        >
          <div style={{ fontFamily: FONT.hero, fontSize: 72, lineHeight: 1, color: COLOR.cardWhite, padding: "26px 0 0 34px" }}>THE WALLED GARDENS</div>
          <div style={{ fontFamily: FONT.mono, fontSize: 18, color: COLOR.cardWhite, opacity: 0.7, padding: "14px 0 0 36px" }}>the auction anyone can enter is the small half</div>

          {/* ── the three names stamp in ── */}
          <div style={{ position: "absolute", left: 36, right: 36, top: wallH * 0.2, display: "flex", justifyContent: "space-between", gap: 18 }}>
            {NAMES.map((n, i) => {
              const on = springIn({ frame, fps: 30, delay: nameFrames[i], durationInFrames: 12 });
              if (on <= 0.01) return null;
              return (
                <div
                  key={n}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "14px 0",
                    border: `3px solid ${COLOR.cardWhite}`,
                    fontFamily: FONT.hero,
                    fontSize: 44,
                    letterSpacing: "0.04em",
                    color: COLOR.cardWhite,
                    opacity: Math.min(1, on),
                    scale: String(Math.min(1.3, on) * pulse(frame, nameFrames[i] + 4, 0.12, 18)),
                  }}
                >
                  {n}
                </div>
              );
            })}
          </div>

          {/* ── 4 toll-gates slide together and stamp into 1: "one company owns every step" ── */}
          {frame >= F.merge - 6 && (
            <div style={{ position: "absolute", left: 36, right: 36, top: wallH * 0.4, opacity: interpolate(frame, [F.merge - 6, F.merge + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <svg width="100%" height={92} viewBox="0 0 900 92" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
                {["BUY", "EXCH", "SELL", "DATA"].map((lbl, i) => {
                  const spread = interpolate(mergeT, [0, 0.8], [(i - 1.5) * 210, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
                  const gone = mergeT > 0.82 && i !== 0;
                  const w = i === 0 ? interpolate(mergeT, [0.8, 1], [140, 240], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 140;
                  return (
                    <g key={i} opacity={gone ? interpolate(mergeT, [0.82, 0.95], [1, 0], { extrapolateRight: "clamp" }) : 1} transform={`translate(${450 + spread} 46)`}>
                      <rect x={-w / 2} y={-34} width={w} height={68} fill={mergeT > 0.78 ? COLOR.orange : COLOR.grey} stroke={COLOR.cardWhite} strokeWidth={2.5} />
                      {!(i === 0 && mergeT > 0.86) && <text x={0} y={6} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} fill={COLOR.cardWhite}>{lbl}</text>}
                    </g>
                  );
                })}
                {mergeT > 0.88 && (
                  <text x={450} y={7} textAnchor="middle" fontFamily={FONT.hero} fontSize={32} letterSpacing="0.04em" fill={COLOR.cardWhite} opacity={interpolate(mergeT, [0.88, 1], [0, 1], { extrapolateRight: "clamp" })} style={{ transform: `scale(${pulse(frame, F.owns, 0.1, 18)})`, transformOrigin: "450px 46px" }}>
                    ONE OWNER
                  </text>
                )}
              </svg>
              <div style={{ textAlign: "center", marginTop: 12, fontFamily: FONT.sans, fontWeight: 600, fontSize: 22, color: COLOR.cardWhite, opacity: interpolate(frame, [F.merge + 10, F.merge + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
                {frame >= F.owns ? "one company owns every step — no tolls to pay" : "no chain of tolls inside the walls…"}
              </div>
            </div>
          )}

          {/* bridge to the numbers: "Google's share alone →" */}
          {frame >= F.share - 6 && frame < F.v0 + 20 && (
            <div style={{ position: "absolute", left: 36, right: 36, bottom: 200, textAlign: "center", fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.08em", color: COLOR.orange, opacity: interpolate(frame, [F.share, F.share + 12, F.v0, F.v0 + 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              GOOGLE&apos;S SHARE OF THIS, ALONE ↓
            </div>
          )}

          {/* spend bar */}
          {frame >= F.bar && (
            <div style={{ position: "absolute", left: 36, right: 36, bottom: wallH * 0.28, height: 46, border: `3px solid ${COLOR.cardWhite}` }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barFrac * 100}%`, background: COLOR.orange }} />
              <div style={{ position: "absolute", left: `${barFrac * 100}%`, top: -30, translate: "-50% 0", fontFamily: FONT.mono, fontSize: 16, color: COLOR.cardWhite }}>≈ 75% of the spend</div>
            </div>
          )}

          {/* the three values */}
          <div style={{ position: "absolute", left: 36, right: 36, bottom: 30, display: "flex", justifyContent: "space-between" }}>
            {VALUES.map((v, i) => {
              const on = interpolate(frame, [valFrames[i] - 16, valFrames[i]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (on <= 0.01) return null;
              return (
                <div key={i} style={{ opacity: Math.min(1, on), textAlign: "left", scale: String(pulse(frame, valFrames[i] + 4, 0.06, 16)) }}>
                  <CountUp from={0} to={v.to} start={valFrames[i] - 16} end={valFrames[i] + 20} format={v.fmt} size={54} accent={i === 0} style={{ fontFamily: FONT.hero, color: i === 0 ? COLOR.orange : COLOR.cardWhite }} />
                  <div style={{ fontFamily: FONT.mono, fontSize: 15, color: COLOR.cardWhite, opacity: 0.7 }}>{v.name}</div>
                </div>
              );
            })}
          </div>

          {/* running combined total — ticks with every value that lands */}
          {frame >= F.v0 - 6 && (
            <div style={{ position: "absolute", left: 36, right: 36, bottom: 128, textAlign: "center", fontFamily: FONT.mono, fontSize: 17, letterSpacing: "0.1em", color: COLOR.cardWhite, opacity: interpolate(frame, [F.v0 - 6, F.v0 + 10], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              THREE COMPANIES, ONE YEAR:{" "}
              <span style={{ fontFamily: FONT.hero, fontSize: 30, color: COLOR.orange }}>
                ${Math.round(
                  interpolate(frame, [F.v0, F.v0 + 30], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut }) +
                    interpolate(frame, [F.v1, F.v1 + 30], [0, 190], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut }) +
                    interpolate(frame, [F.v2, F.v2 + 30], [0, 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut }),
                )}
                B+
              </span>
            </div>
          )}
        </div>
      )}

      <Bloom window={[F.peak - 4, F.peak + 12, F.peak + 60, F.peak + 90]} radius={300} x="62%" y="50%" intensity={0.6} />

      {/* closing line */}
      {frame >= F.v2 + 30 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.86, textAlign: "center", fontFamily: FONT.sans, fontWeight: 600, fontSize: 26, color: COLOR.grey, opacity: safeRamp(frame, [F.v2 + 30, F.v2 + 44, dur - 18, dur - 6]) }}>
          mostly from ads shown to people who paid nothing
        </div>
      )}
    </>
  );
};
