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
 * NIF002 B08 — you, priced. HIGH · 1105 f (36.8 s).
 * Three eCPM cards deal in, each value counting up on its VO cue (banner $1.20 /
 * full-screen $10 / rewarded $20) → they slide together → "÷ 1,000" stamps →
 * the hero "0.1¢ – 2¢" slams → a world map greys outside ~5 regions ("less
 * outside the richest countries") → "that is you, priced".
 * Peak: "that is you, priced" — whisper "priced" @ f1090.
 */
export const B08: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Mobile eCPM benchmarks, US, 2025 (Appodeal / Playio)">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const CARDS = [
  { title: "PLAIN BANNER", to: 1.2, fmt: (n: number) => `$${n.toFixed(2)}` },
  { title: "FULL-SCREEN AD", to: 10, fmt: (n: number) => `$${Math.round(n)}` },
  { title: "REWARDED VIDEO · US", to: 20, fmt: (n: number) => `$${Math.round(n)}`, accent: true },
];

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 32, holdFrames: 14 });
  const vo = useBeatTiming("B08");

  const F = {
    intro: vo.at("price", 44),
    c1: vo.at("banner", 127),
    c2: vo.at("screen", 282),
    c3: vo.at("video", 383),
    c3land: vo.at("20", 513, 1),
    divide: vo.at("divide", 623),
    hero: vo.at("tenth", 810),
    map: vo.at("less", 908),
    peak: vo.at("priced", 1090),
  };
  const cardAt = [F.c1, F.c2, F.c3];

  const cardW = 500;
  const gap = 46;
  const cardsW = 3 * cardW + 2 * gap;
  const cardsLeft = (WIDTH - cardsW) / 2;
  const cardsY = HEIGHT * 0.16;

  const toStrip = interpolate(frame, [F.divide - 30, F.hero - 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const heroPulse = pulse(frame, F.hero, 0.12, 20);

  const mapDim = interpolate(frame, [F.map + 20, F.map + 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <Floor stage={stage} at={4} heightFraction={0.24} kind="desk" />
      <TitleSlab lines={["WHAT ONE LOOK AT YOU COSTS"]} at={F.intro} outAt={F.c1 + 26} />

      {/* ── the three cards ── */}
      <div style={{ opacity: stage.exit(frame), translate: `0px ${toStrip * -HEIGHT * 0.04}px`, scale: String(1 - 0.46 * toStrip), transformOrigin: "50% 0%" }}>
        {CARDS.map((c, i) => {
          const at = cardAt[i];
          const on = springIn({ frame, fps: 30, delay: at, durationInFrames: 16 });
          if (on <= 0.01) return null;
          const landAt = i === 2 ? F.c3land : at + 26;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cardsLeft + i * (cardW + gap),
                top: cardsY,
                width: cardW,
                padding: "26px 34px",
                background: COLOR.cardWhite,
                border: `3px solid ${COLOR.ink}`,
                opacity: Math.min(1, on),
                translate: `0px ${(1 - Math.min(1, on)) * 22}px`,
                scale: String(i === 2 ? pulse(frame, F.c3land, 0.06, 16) : 1),
              }}
            >
              <div style={{ fontFamily: FONT.mono, fontSize: 17, letterSpacing: "0.1em", color: COLOR.grey }}>{c.title}</div>
              <div style={{ fontFamily: FONT.hero, fontSize: 96, lineHeight: 1, color: c.accent ? COLOR.orange : COLOR.ink, marginTop: 6 }}>
                <CountUp from={0} to={c.to} start={at + 4} end={landAt} format={c.fmt} size={96} accent={!!c.accent} style={{ fontFamily: FONT.hero }} />
              </div>
              <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 18, color: COLOR.grey, marginTop: 4 }}>per 1,000 views</div>
            </div>
          );
        })}
      </div>

      {/* ── ÷ 1,000 ── */}
      {frame >= F.divide - 6 && frame < F.hero + 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.3, textAlign: "center", fontFamily: FONT.hero, fontSize: 72, color: COLOR.ink, opacity: interpolate(frame, [F.divide, F.divide + 12, F.hero - 8, F.hero], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: String(pulse(frame, F.divide, 0.1, 16)) }}>
          ÷ 1,000 VIEWS
        </div>
      )}

      {/* ── world map dim ── */}
      {frame >= F.map - 6 && frame < F.peak + 20 && (
        <svg style={{ position: "absolute", left: WIDTH * 0.12, top: HEIGHT * 0.58, width: WIDTH * 0.76, height: HEIGHT * 0.22, overflow: "visible", opacity: interpolate(frame, [F.map, F.map + 16, F.peak, F.peak + 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {Array.from({ length: 40 }).map((_, i) => {
            const col = i % 10;
            const row = Math.floor(i / 10);
            const rich = [3, 4, 13, 14, 22].includes(i);
            const on = interpolate(frame, [F.map + col * 2, F.map + col * 2 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <rect
                key={i}
                x={col * (WIDTH * 0.076)}
                y={row * (HEIGHT * 0.055)}
                width={WIDTH * 0.066}
                height={HEIGHT * 0.045}
                fill={rich ? COLOR.orange : COLOR.grey}
                opacity={on * (rich ? 0.9 : 0.9 - mapDim * 0.55)}
              />
            );
          })}
          <text x={0} y={-14} fontFamily={FONT.mono} fontSize={18} fill={COLOR.ink}>less, outside the richest countries</text>
        </svg>
      )}

      {/* ── hero result ── */}
      {frame >= F.hero - 24 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.38, textAlign: "center", opacity: safeRamp(frame, [F.hero - 16, F.hero, dur - 20, dur - 6]), scale: String(heroPulse) }}>
          <Bloom window={[F.hero - 6, F.hero + 10, F.peak + 30, F.peak + 60]} radius={300} intensity={0.66} />
          <div style={{ fontFamily: FONT.hero, fontSize: 210, lineHeight: 0.88, color: COLOR.ink }}>
            0.1¢ <span style={{ color: COLOR.grey, fontSize: 120 }}>–</span> <span style={{ color: COLOR.orange }}>2¢</span>
          </div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 30, letterSpacing: "0.12em", textTransform: "uppercase", color: COLOR.grey, marginTop: 6 }}>
            {frame >= F.peak ? "that is you, priced" : "one view of you"}
          </div>
        </div>
      )}
    </>
  );
};
