import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { Lucky } from "../../characters";
import { Bloom } from "../../parts/Bloom";
import { EASE } from "../../parts/motion";
import { Floor } from "../scene";
import { useStage, loop, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B10 — not a rare event. MEDIUM · 1129 f (37.6 s). Delivered SLOW —
 * keep the counter churning the whole beat so nothing reads static.
 * Empty → a hero count tearing toward 14,000,000,000,000 that never settles →
 * "1,000,000 / SEC" → a small Lucky-on-couch vignette, a tally to ~3,000 →
 * location pings leave her → empty.
 * Peak: "fourteen trillion" — whisper "trillion" @ f280.
 */
export const B10: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="RTB request volume + DSP throughput — industry estimate, 2026">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 32, holdFrames: 14 });
  const vo = useBeatTiming("B10");

  const F = {
    rare: vo.at("rare", 32),
    hero: vo.at("exchanges", 128),
    trillion: vo.at("trillion", 280),
    day: vo.at("day", 382),
    perSec: vo.at("machines", 401),
    wall: vo.at("bid", 445),
    lucky: vo.at("traffic", 665),
    tally: vo.at("thousand", 909),
    pings: vo.at("shipped", 1018),
  };

  // the churning hero — counts to 14e12 by `trillion`, then keeps the low digits rolling
  const base = interpolate(frame, [F.hero, F.trillion], [0, 14_000_000_000_000], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut });
  const churn = frame > F.trillion ? Math.floor(loop(frame, 8) * 900_000 + Math.sin(frame * 0.7) * 40_000) : 0;
  const heroValue = Math.max(0, Math.round(base + (frame > F.trillion ? churn : 0)));
  const heroStr = heroValue.toLocaleString("en-US");

  const luckyH = Math.round(HEIGHT * 0.34);
  const luckyCx = WIDTH * 0.8;
  const groundY = HEIGHT * 0.82;

  const tallyN = Math.round(interpolate(frame, [F.tally, F.tally + 160], [0, 3120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut }));

  // per-sec box number races 0 → 1,000,000 on a fast loop
  const perSecN = Math.floor(loop(frame, 20) * 1_000_000);

  return (
    <>
      <Floor stage={stage} at={4} heightFraction={0.24} kind="floor" />

      {/* opening kicker */}
      {frame < F.trillion && (
        <div style={{ position: "absolute", left: WIDTH * 0.06, top: HEIGHT * 0.1, padding: "12px 24px", background: COLOR.ink, color: COLOR.cardWhite, fontFamily: FONT.hero, fontSize: 44, letterSpacing: "0.02em", opacity: interpolate(frame, [F.rare, F.rare + 12, F.hero + 20, F.hero + 40], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), clipPath: `inset(0 ${100 - interpolate(frame, [F.rare, F.rare + 12], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}% 0 0)` }}>
          THIS IS NOT A RARE EVENT.
        </div>
      )}

      {/* ── the churning hero — in a heavy frame ── */}
      <div
        style={{
          position: "absolute",
          left: WIDTH * 0.06,
          top: HEIGHT * 0.16,
          width: WIDTH * 0.62,
          padding: "34px 40px",
          border: `4px solid ${COLOR.ink}`,
          background: COLOR.cardWhite,
          opacity: stage.present(frame, F.hero - 10, 16),
        }}
      >
        <Bloom window={[F.trillion - 6, F.trillion + 10, F.trillion + 44, F.trillion + 72]} radius={340} x="40%" y="46%" intensity={0.66} />
        <div style={{ fontFamily: FONT.mono, fontSize: 20, letterSpacing: "0.12em", color: COLOR.grey }}>THESE AUCTIONS · EVERY DAY</div>
        <div style={{ fontFamily: FONT.hero, fontSize: heroStr.length > 16 ? 116 : 138, lineHeight: 0.92, color: COLOR.ink, fontVariantNumeric: "tabular-nums", scale: String(pulse(frame, F.trillion, 0.06, 20)), marginTop: 4 }}>
          {heroStr}
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 24, color: COLOR.orange, marginTop: 6 }}>
          and rising every frame you watch
        </div>
      </div>

      {/* ── 1,000,000 / SEC ── */}
      {frame >= F.perSec - 6 && (
        <div
          style={{
            position: "absolute",
            left: WIDTH * 0.06,
            top: HEIGHT * 0.56,
            padding: "18px 30px",
            background: COLOR.ink,
            color: COLOR.cardWhite,
            fontFamily: FONT.mono,
            fontSize: 28,
            opacity: stage.present(frame, F.perSec, 14),
            scale: String(1 + 0.03 * Math.abs(Math.sin(loop(frame, 24) * Math.PI))),
          }}
        >
          EACH BIDDER: <span style={{ fontFamily: FONT.hero, fontSize: 34 }}>{perSecN.toLocaleString("en-US")}</span> / SEC
        </div>
      )}

      {/* ── a wall of bidder machines, each pulsing per "second" ── */}
      {frame >= F.wall - 6 && frame < F.lucky + 40 && (
        <div style={{ position: "absolute", left: WIDTH * 0.06, top: HEIGHT * 0.66, opacity: interpolate(frame, [F.wall, F.wall + 16, F.lucky + 20, F.lucky + 40], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 16, color: COLOR.grey, marginBottom: 8 }}>you are not special traffic</div>
          <svg width={WIDTH * 0.5} height={HEIGHT * 0.16} style={{ overflow: "visible" }}>
            {Array.from({ length: 60 }).map((_, i) => {
              const col = i % 20;
              const row = Math.floor(i / 20);
              const at = F.wall + i * 1.5;
              if (frame < at) return null;
              const beat = (Math.floor(frame / 4) + i) % 7 === 0;
              return <rect key={i} x={col * (WIDTH * 0.024)} y={row * (HEIGHT * 0.045)} width={WIDTH * 0.018} height={HEIGHT * 0.032} fill={beat ? COLOR.orange : COLOR.ink} opacity={beat ? 1 : 0.75} />;
            })}
          </svg>
        </div>
      )}

      {/* ── Lucky vignette — she scrolls on a stool ── */}
      {frame >= F.lucky - 10 && (
        <div style={{ opacity: safeRamp(frame, [F.lucky, F.lucky + 16, dur - 20, dur - 6]) }}>
          {/* a plain stool under her */}
          <div style={{ position: "absolute", left: luckyCx - 70, top: groundY - luckyH * 0.42, width: 140, height: luckyH * 0.42, background: COLOR.grey, border: `3px solid ${COLOR.ink}` }} />
          <div style={{ position: "absolute", left: luckyCx - 82, top: groundY - luckyH * 0.42 - 8, width: 164, height: 14, background: COLOR.ink }} />
          <Lucky pose="sit" expression="flat" facing={-1} height={luckyH} centerX={luckyCx} baseline={groundY} cycleSeconds={3.2} phoneScreen={[COLOR.orange, COLOR.grey, COLOR.ink][Math.floor(frame / 12) % 3]} />
          <div style={{ position: "absolute", left: luckyCx - 170, top: groundY - luckyH - 70, fontFamily: FONT.mono, fontSize: 22, color: COLOR.ink }}>
            YOU, TODAY: <span style={{ color: COLOR.orange, fontFamily: FONT.hero, fontSize: 40 }}>{tallyN.toLocaleString("en-US")}</span> auctions
          </div>
          <div style={{ position: "absolute", left: luckyCx - 170, top: groundY - luckyH - 34, fontFamily: FONT.mono, fontSize: 16, color: COLOR.grey }}>
            ~3.5 hrs of app time
          </div>
        </div>
      )}

      {/* location pings leaving her */}
      {frame >= F.pings && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: stage.exit(frame) }}>
          {[0, 1, 2, 3].map((i) => {
            const t = loop(frame, 42, i * 0.25);
            return (
              <circle
                key={i}
                cx={luckyCx - 40 - t * 260}
                cy={groundY - luckyH * 0.5 - Math.sin(t * Math.PI) * 40}
                r={6 + t * 4}
                fill="none"
                stroke={COLOR.orange}
                strokeWidth={2}
                opacity={(1 - t) * 0.8}
              />
            );
          })}
        </svg>
      )}
    </>
  );
};
