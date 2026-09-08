import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { Lucky } from "../../characters";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { useBeatTiming } from "../timing";
import { V3Beat } from "../v3/V3Beat";
import { Street, Walker, STREET_HORIZON, STREET_GROUND } from "../v3/sets";
import { cyc } from "../v3/stage3";
import { V3 } from "../v3/palette";

/**
 * NIF002 B01 — v3. The half-second, played out on the street. Lucky taps a free
 * app; a description of her ejects and races up the street to the AD EXCHANGE at
 * the end; the buildings light window by window (a few hundred companies read
 * it); one window flashes and drops a 1¢ coin; an ad snaps onto her phone —
 * "all of it finishes before you notice." Then the promise card: this episode
 * prices that half-second.
 */
export const B01v3: React.FC<BeatProps> = (props) => {
  const dur = props.durationInFrames;
  const vo = useBeatTiming("B01");
  const F = {
    kicker: 8,
    tap: vo.at("tap", 139),
    sends: vo.at("sends", 266),
    hundred: vo.at("hundred", 405),
    cent: vo.at("cent", 514),
    finishes: vo.at("notice", 578),
    prices: vo.at("prices", 761),
    promise: vo.at("order", 953),
    p2: vo.at("costs", 1035),
    peak: vo.at("price", 1123, 1),
  };
  return (
    <V3Beat
      props={props}
      beat="B01"
      set={<Street />}
      cam={[
        { at: 0, zoom: 1.06, y: 18 },
        { at: F.sends, zoom: 1.0, y: -4 },
        { at: F.hundred, zoom: 1.04, y: -8 },
        { at: F.prices, zoom: 1.12, y: 14 },
        { at: dur, zoom: 1.16, y: 18 },
      ]}
    >
      <Content dur={dur} F={F} />
    </V3Beat>
  );
};

const Content: React.FC<{ dur: number; F: Record<string, number> }> = ({ dur, F }) => {
  const frame = useCurrentFrame();
  const ground = STREET_GROUND;
  const luckyH = Math.round(HEIGHT * 0.42);
  const luckyX = WIDTH * 0.32;

  // the description packet: from her phone → up the street to the exchange marquee
  const vpX = WIDTH * 0.5;
  const exY = STREET_HORIZON - 60;
  const flyT = interpolate(frame, [F.sends, F.sends + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const pkX = interpolate(flyT, [0, 1], [luckyX + luckyH * 0.22, vpX]);
  const pkY = interpolate(flyT, [0, 1], [ground - luckyH * 0.55, exY + 34]);
  const pkS = interpolate(flyT, [0, 1], [1, 0.35]);

  // windows lighting: a running count of companies
  const companies = Math.min(340, Math.max(0, Math.floor(interpolate(frame, [F.hundred, F.hundred + 140], [0, 340], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut }))));

  const coinT = interpolate(frame, [F.cent, F.cent + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  return (
    <>
      {/* background walkers */}
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
        <Walker x={WIDTH * 0.14 + cyc(frame, 900) * WIDTH * 0.22} baseline={STREET_HORIZON + 70} h={HEIGHT * 0.14} facing={1} stride={30} tone={V3.bldgB} />
        <Walker x={WIDTH * 0.88 - cyc(frame, 1000) * WIDTH * 0.24} baseline={STREET_HORIZON + 96} h={HEIGHT * 0.16} facing={-1} stride={34} tone="#5e5346" phase={0.5} />
      </svg>

      {/* ── the AD EXCHANGE marquee at the end of the street ── */}
      {frame >= F.sends - 20 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: exY - 46, textAlign: "center", opacity: interpolate(frame, [F.sends - 20, F.sends], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: FONT.hero, fontSize: 34, letterSpacing: "0.16em", color: V3.paperLight, background: V3.ink, padding: "4px 18px", boxShadow: "0 0 24px rgba(226,77,40,0.4)" }}>AD EXCHANGE</span>
        </div>
      )}

      {/* ── Lucky taps her phone ── */}
      <Lucky
        pose={frame < F.tap + 8 ? "showPhone" : frame < F.finishes ? "showPhone" : "stand"}
        expression={frame >= F.cent ? "worried" : "curious"}
        facing={1}
        height={luckyH}
        centerX={luckyX}
        baseline={ground}
        cycleSeconds={3}
        phoneScreen={frame >= F.cent ? COLOR.orange : "#2f6b6a"}
      />
      {frame >= F.tap - 2 && frame < F.tap + 14 && (
        <Bloom window={[F.tap, F.tap + 6, F.tap + 16, F.tap + 26]} radius={luckyH * 0.5} x={`${((luckyX + luckyH * 0.2) / WIDTH) * 100}%`} y={`${((ground - luckyH * 0.55) / HEIGHT) * 100}%`} intensity={0.7} />
      )}

      {/* ── the description packet flying up the street ── */}
      {frame >= F.sends && frame < F.hundred + 20 && (
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1={luckyX + luckyH * 0.22} y1={ground - luckyH * 0.55} x2={pkX} y2={pkY} stroke={V3.accent} strokeWidth={2} strokeDasharray="5 7" opacity={0.5} />
          <g transform={`translate(${pkX} ${pkY}) scale(${pkS})`}>
            <rect x={-44} y={-30} width={88} height={60} rx={5} fill={COLOR.cardWhite} stroke={V3.ink} strokeWidth={3} />
            {[-14, 0, 14].map((yy, k) => <rect key={k} x={-30} y={yy} width={[54, 40, 48][k]} height={5} fill={V3.muted} />)}
          </g>
          {flyT < 0.4 && <text x={pkX + 60} y={pkY} fontFamily={FONT.mono} fontSize={16} fill={V3.ink}>a description of you</text>}
        </svg>
      )}

      {/* ── windows lighting: a few hundred companies read it ── */}
      {frame >= F.hundred - 10 && frame < F.finishes + 20 && (
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {Array.from({ length: 40 }).map((_, i) => {
            const on = i / 40 < companies / 340;
            if (!on) return null;
            const side = i % 2 ? 1 : -1;
            const row = Math.floor(i / 2);
            const bx = WIDTH * 0.5 + side * (WIDTH * 0.12 + (row % 4) * WIDTH * 0.05);
            const by = STREET_HORIZON - 40 - (row % 5) * 46;
            const flick = (Math.floor(frame / 4) + i) % 3 === 0;
            return <rect key={i} x={bx} y={by} width={22} height={30} fill={flick ? V3.accent : V3.window} opacity={0.9} />;
          })}
        </svg>
      )}
      {frame >= F.hundred && frame < F.prices && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.1, textAlign: "center", fontFamily: FONT.mono, fontSize: 24, color: V3.paperLight, opacity: interpolate(frame, [F.hundred, F.hundred + 14, F.prices - 20, F.prices], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          COMPANIES READING YOU: <span style={{ color: V3.accent, fontFamily: FONT.hero, fontSize: 40 }}>{companies}</span>
        </div>
      )}

      {/* ── one pays 1¢ — a coin drops to Lucky's phone, an ad snaps on ── */}
      {frame >= F.cent && frame < F.prices && (
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform={`translate(${interpolate(coinT, [0, 1], [vpX, luckyX + luckyH * 0.24])} ${interpolate(coinT, [0, 1], [exY + 20, ground - luckyH * 0.5])})`}>
            <circle r={20} fill={V3.accent} stroke={V3.ink} strokeWidth={3} />
            <text y={7} textAnchor="middle" fontFamily={FONT.hero} fontSize={22} fill={COLOR.cardWhite}>1¢</text>
          </g>
          {coinT > 0.85 && (
            <rect x={luckyX - luckyH * 0.1} y={ground - luckyH * 0.72} width={luckyH * 0.42} height={luckyH * 0.16} fill={V3.accent} stroke={V3.ink} strokeWidth={2} opacity={(coinT - 0.85) / 0.15} />
          )}
        </svg>
      )}

      {/* ── "all of it finishes before you notice" ── */}
      {frame >= F.finishes - 6 && frame < F.prices && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.8, textAlign: "center", fontFamily: FONT.hero, fontSize: 48, color: COLOR.cardWhite, letterSpacing: "0.02em", opacity: interpolate(frame, [F.finishes, F.finishes + 12, F.prices - 16, F.prices], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 4px 18px rgba(0,0,0,0.5)" }}>
          ALL OF IT FINISHED <span style={{ color: V3.accent }}>BEFORE YOU NOTICED.</span>
        </div>
      )}

      {/* ── the promise ── */}
      {frame >= F.prices - 8 && (
        <div style={{ position: "absolute", left: WIDTH * 0.5 - 620, top: HEIGHT * 0.24, width: 1240, padding: "34px 44px", background: "rgba(20,18,16,0.82)", opacity: interpolate(frame, [F.prices, F.prices + 16, dur - 22, dur - 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), translate: `0px ${(1 - Math.min(1, springIn({ frame, fps: 30, delay: F.prices, durationInFrames: 20 }))) * 60}px` }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 56, color: COLOR.cardWhite, letterSpacing: "0.02em" }}>THIS EPISODE PRICES THAT HALF-SECOND.</div>
          {[
            ["every company that gets paid", F.promise],
            ["what your attention costs — to the cent", F.p2],
            ["and who set that price", F.peak],
          ].map(([t, at], i) => (
            <div key={i} style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 30, color: i === 2 ? V3.accent : "#D8D2C4", marginTop: i ? 12 : 22, opacity: interpolate(frame, [at as number, (at as number) + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), translate: `${(1 - interpolate(frame, [at as number, (at as number) + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })) * -20}px 0px` }}>
              {`› ${t}`}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
