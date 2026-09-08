import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { CountUp } from "../../parts/CountUp";
import { Bloom } from "../../parts/Bloom";
import { EASE } from "../../parts/motion";
import { Floor, TitleSlab } from "../scene";
import { useStage, loop, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B03 — the big rent. MEDIUM · 1132 f (37.7 s).
 * A dense one: every VO clause moves something. Hero $390B counts up → "/YEAR"
 * snaps → app glyphs scatter round it → the 80¢/$1 bar → the number SHATTERS
 * into a field of fraction-of-a-cent ticks that multiply while a rate counter
 * spins → the number shrinks to a chip, "you are a rounding error".
 * Peak: "$390 billion" — whisper "billion" @ f202.
 */
export const B03: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="In-app ad spend — industry estimate, 2025">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 34, holdFrames: 14 });
  const vo = useBeatTiming("B03");

  const F = {
    rent: vo.at("rent", 40),
    heroStart: vo.at("spend", 110),
    heroLand: vo.at("billion", 202),
    year: vo.at("year", 234),
    apps: vo.at("apps", 310),
    bar: vo.at("80", 390),
    barDone: vo.at("all", 560),
    noSale: vo.at("sale", 671),
    shatter: vo.at("auction", 770),
    multiply: vo.at("billion", 847, 1),
    fractions: vo.at("fractions", 910),
    shrink: vo.at("rounding", 1010),
  };

  const deskTop = Math.round(HEIGHT * 0.76);
  const heroHomeX = WIDTH * 0.1;
  const heroHomeY = deskTop - 300;

  const toChip = interpolate(frame, [F.shrink, F.shrink + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const heroX = interpolate(toChip, [0, 1], [heroHomeX, WIDTH * 0.8]);
  const heroY = interpolate(toChip, [0, 1], [heroHomeY, HEIGHT * 0.1]);
  const heroScale = interpolate(toChip, [0, 1], [1, 0.3]);
  const heroPulse = pulse(frame, F.heroLand, 0.1, 18) * pulse(frame, F.noSale, 0.05, 14);

  // the shatter: the number breaks into ~200 ticks that fly to a field
  const shatter = interpolate(frame, [F.shatter, F.shatter + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const heroVisible = 1 - shatter;

  const TCOLS = 34;
  const TROWS = 7;
  const gap = 36;
  const fieldW = TCOLS * gap;
  const fieldLeft = (WIDTH - fieldW) / 2;
  const fieldTop = HEIGHT * 0.14;

  // rate counter — spins fast once ticks appear
  const rate = Math.round(loop(frame, 6) * 9_999_999) + (frame > F.multiply ? 4_000_000_000 : 900_000_000);

  const barW = WIDTH * 0.42;
  const barX = WIDTH * 0.54;
  const barY = deskTop - 150;
  const barGrow = interpolate(frame, [F.bar, F.bar + 56], [0, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut });

  return (
    <>
      <Floor stage={stage} at={4} heightFraction={0.24} kind="desk" />
      <TitleSlab lines={["AND IT IS A BIG RENT."]} at={F.rent} outAt={F.heroLand - 16} />

      {/* ── the shatter / tick field ── */}
      {frame >= F.shatter - 4 && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: stage.exit(frame) }}>
          {Array.from({ length: TCOLS * TROWS }).map((_, i) => {
            const col = i % TCOLS;
            const row = Math.floor(i / TCOLS);
            const homeX = fieldLeft + col * gap;
            const homeY = fieldTop + row * gap;
            // fly from the hero position to the grid slot
            const t = Math.min(1, Math.max(0, (shatter - (i / (TCOLS * TROWS)) * 0.25) / 0.75));
            if (t <= 0) return null;
            const x = interpolate(t, [0, 1], [heroHomeX + 120, homeX]);
            const y = interpolate(t, [0, 1], [heroHomeY + 60, homeY]);
            const surged = frame >= F.multiply;
            const on = surged || i < TCOLS * TROWS * interpolate(frame, [F.shatter, F.multiply], [0.35, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            if (!on && t >= 1) return null;
            const flick = (i * 7 + Math.floor(frame / 3)) % (surged ? 9 : 19) === 0;
            return <rect key={i} x={x} y={y} width={10} height={22} fill={flick ? COLOR.orange : COLOR.grey} opacity={t * (surged ? 0.85 : 0.55)} />;
          })}
        </svg>
      )}

      {/* fractions-of-a-cent callout on one magnified tick */}
      {frame >= F.fractions && frame < F.shrink && (
        <div style={{ position: "absolute", left: WIDTH * 0.5 - 90, top: fieldTop + TROWS * gap + 30, fontFamily: FONT.mono, fontSize: 22, color: COLOR.ink, opacity: interpolate(frame, [F.fractions, F.fractions + 12, F.shrink - 20, F.shrink], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          each one ≈ <span style={{ color: COLOR.orange }}>0.001¢</span>
        </div>
      )}

      {/* rate counter — always spinning once the auction starts */}
      {frame >= F.shatter + 20 && (
        <div style={{ position: "absolute", left: WIDTH * 0.06, top: HEIGHT * 0.1, fontFamily: FONT.mono, fontSize: 20, color: COLOR.grey, opacity: safeRamp(frame, [F.shatter + 20, F.shatter + 34, dur - 24, dur - 8]) }}>
          AUCTIONS THIS HOUR: <span style={{ color: COLOR.ink, fontFamily: FONT.hero, fontSize: 30 }}>{rate.toLocaleString("en-US")}</span>
        </div>
      )}

      {/* ── hero number ── */}
      <div
        style={{
          position: "absolute",
          left: heroX,
          top: heroY,
          scale: String(heroScale * (toChip < 0.5 ? heroPulse : 1)),
          transformOrigin: "0% 100%",
          opacity: stage.present(frame, F.heroStart, 16) * (toChip > 0.5 ? 1 : heroVisible),
        }}
      >
        <Bloom window={[F.heroLand - 6, F.heroLand + 8, F.heroLand + 40, F.heroLand + 66]} radius={320} x="34%" y="46%" intensity={0.72} />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <CountUp from={0} to={390} start={F.heroStart} end={F.heroLand} format={(n) => `$${Math.round(n)}B`} size={240} style={{ fontFamily: FONT.hero, letterSpacing: "0.01em" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 26 }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 22, color: COLOR.cardWhite, background: COLOR.grey, padding: "2px 9px" }}>EST.</span>
            {frame >= F.year && <span style={{ fontFamily: FONT.mono, fontSize: 22, color: COLOR.ink, border: `2px solid ${COLOR.ink}`, padding: "2px 9px", opacity: interpolate(frame, [F.year, F.year + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: String(pulse(frame, F.year, 0.12, 14)) }}>/ YEAR</span>}
          </div>
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: COLOR.grey, marginTop: 4 }}>
          in-app ad spend
        </div>
        {/* app glyphs scattering around it */}
        {frame >= F.apps - 8 && frame < F.shatter && (
          <svg width={620} height={340} style={{ position: "absolute", left: -60, top: -110, overflow: "visible" }}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = interpolate(frame, [F.apps + i * 5, F.apps + i * 5 + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const ang = (i / 6) * Math.PI * 2;
              const r = 40 + a * 200;
              return <rect key={i} x={310 + Math.cos(ang) * r} y={170 + Math.sin(ang) * r * 0.6} width={26} height={26} rx={6} fill={i % 2 ? COLOR.grey : COLOR.orange} opacity={a * (1 - a * 0.4)} />;
            })}
          </svg>
        )}
      </div>

      {/* ── 80¢ / $1 bar ── */}
      <div style={{ position: "absolute", left: barX, top: barY, width: barW, opacity: stage.present(frame, F.bar, 16) }}>
        <div style={{ fontFamily: FONT.hero, fontSize: 30, color: COLOR.ink, marginBottom: 12, opacity: interpolate(frame, [F.barDone - 40, F.barDone - 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          &gt; 80¢ OF EVERY $1 ON MOBILE ADS
        </div>
        <div style={{ position: "relative", width: barW, height: 58, border: `3px solid ${COLOR.ink}`, background: COLOR.cardWhite }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barGrow * 100}%`, background: COLOR.orange }} />
          <div style={{ position: "absolute", left: "80%", top: -10, bottom: -10, width: 3, background: COLOR.ink }} />
          <div style={{ position: "absolute", left: "80%", top: -34, fontFamily: FONT.mono, fontSize: 16, color: COLOR.ink, translate: "-50% 0" }}>80¢</div>
        </div>
      </div>

      {/* "NOT ONE BIG SALE" */}
      {frame >= F.noSale - 6 && frame < F.shrink && (
        <div style={{ position: "absolute", left: WIDTH * 0.52, top: HEIGHT * 0.32, fontFamily: FONT.hero, fontSize: 42, color: COLOR.ink, opacity: interpolate(frame, [F.noSale, F.noSale + 12, F.shrink - 30, F.shrink - 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          NOT ONE BIG SALE —<br /><span style={{ color: COLOR.grey, fontSize: 32 }}>a few billion tiny ones an hour</span>
        </div>
      )}

      {/* ── rounding-error line ── */}
      {frame >= F.shrink - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.42, textAlign: "center", opacity: safeRamp(frame, [F.shrink + 6, F.shrink + 24, dur - 22, dur - 6]) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 92, letterSpacing: "0.02em", color: COLOR.ink }}>
            YOU ARE A <span style={{ color: COLOR.orange }}>ROUNDING ERROR</span>
          </div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 36, color: COLOR.grey, marginTop: 12 }}>that happens constantly</div>
        </div>
      )}
    </>
  );
};
