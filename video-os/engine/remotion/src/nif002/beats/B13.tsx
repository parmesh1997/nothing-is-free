import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { Floor } from "../scene";
import { useStage, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B13 — the correction. HIGH · 1643 f (54.8 s) — longest body beat.
 * Empty → "THE MYTH: HALF VANISHES", struck → a 2020 / 2022 / 2023 timeline, one
 * dated study card at a time (the last ones shrink to markers) → the 2023 figure
 * blows up to a "36¢" hero → "not one giant — a dozen small tolls, plus waste".
 * Peak: "thirty-six cents" — whisper "cents" @ f1230.
 */
export const B13: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="ISBA/PwC 2020 & 2022; ANA Programmatic Transparency, Dec 2023">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const CARDS = [
  {
    year: "2020",
    title: "ISBA / PwC · UK",
    unit: "£1",
    reached: 65,
    reachedLabel: "reached the publisher",
    chunks: [
      { label: "known tolls", pct: 20 },
      { label: "couldn't account for it at all", pct: 15, accent: true },
    ],
  },
  {
    year: "2022",
    title: "ISBA / PwC · UK — FOLLOW-UP",
    unit: "£1",
    reached: 65,
    reachedLabel: "reached the publisher — 65p",
    chunks: [
      { label: "known tolls", pct: 32 },
      { label: "now unaccounted — just 3p", pct: 3, accent: true },
    ],
  },
  {
    year: "2023",
    title: "ANA · US — COUNTING THE JUNK",
    unit: "$1",
    reached: 36,
    reachedLabel: "reached a real person — 36¢",
    chunks: [
      { label: "tolls + fees", pct: 29 },
      { label: "made-for-advertising junk sites", pct: 21 },
      { label: "ads no human ever saw", pct: 14, accent: true },
    ],
  },
];

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 40, holdFrames: 16 });
  const vo = useBeatTiming("B13");

  const F = {
    myth: vo.at("middle", 142),
    strike: vo.at("right", 211),
    c2020: vo.at("2020", 236),
    c2022: vo.at("2022", 525),
    c2023: vo.at("2023", 885),
    hero: vo.at("36", 1202),
    peak: vo.at("cents", 1230),
    recede: vo.at("middle", 1390, 1),
    giant: vo.at("giant", 1434),
    tolls: vo.at("dozen", 1523),
  };
  const cardFrames = [F.c2020, F.c2022, F.c2023];

  const railY = HEIGHT * 0.3;
  const railX0 = WIDTH * 0.14;
  const railX1 = WIDTH * 0.86;
  const railDraw = interpolate(frame, [F.c2020 - 20, F.c2023 + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  const toHero = interpolate(frame, [F.hero - 16, F.hero + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const heroPulse = pulse(frame, F.peak, 0.12, 22);
  const mythOff = interpolate(frame, [F.c2020 - 20, F.c2020], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.24} kind="floor" />

      {/* ── the myth block (only before the timeline) ── */}
      {frame < F.c2020 + 4 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.32, textAlign: "center", opacity: interpolate(frame, [F.myth, F.myth + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * mythOff }}>
          <span style={{ position: "relative", fontFamily: FONT.hero, fontSize: 76, letterSpacing: "0.02em", color: COLOR.ink }}>
            HALF OF EVERY AD DOLLAR VANISHES
            {frame >= F.strike && (
              <span style={{ position: "absolute", left: 0, right: `${interpolate(frame, [F.strike, F.strike + 16], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`, top: "48%", height: 6, background: COLOR.orange }} />
            )}
          </span>
          <div style={{ fontFamily: FONT.mono, fontSize: 22, color: COLOR.grey, marginTop: 12, opacity: interpolate(frame, [F.strike + 10, F.strike + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            the number people repeat. for years, roughly right. then people measured.
          </div>
        </div>
      )}

      {/* ── the timeline rail ── */}
      <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: (1 - toHero) * stage.exit(frame) }}>
        <line x1={railX0} y1={railY} x2={railX0 + (railX1 - railX0) * railDraw} y2={railY} stroke={COLOR.ink} strokeWidth={3} />
        {CARDS.map((c, i) => {
          const cx = railX0 + (i / (CARDS.length - 1)) * (railX1 - railX0);
          const on = interpolate(frame, [cardFrames[i] - 16, cardFrames[i]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (on <= 0.01) return null;
          const active = i === CARDS.length - 1 || frame < cardFrames[i + 1];
          return (
            <g key={i} opacity={Math.min(1, on)}>
              <circle cx={cx} cy={railY} r={active ? 12 : 8} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={2.5} />
              <text x={cx} y={railY - 24} textAnchor="middle" fontFamily={FONT.hero} fontSize={38} fill={COLOR.ink}>{c.year}</text>
            </g>
          );
        })}
      </svg>

      {/* ── one card at a time: the advertiser's £1/$1, losing labelled chunks ── */}
      {(() => {
        const idx = frame >= F.c2023 ? 2 : frame >= F.c2022 ? 1 : 0;
        const c = CARDS[idx];
        const at = cardFrames[idx];
        const cardEnd = idx < 2 ? cardFrames[idx + 1] : F.hero;
        const on = springIn({ frame, fps: 30, delay: at, durationInFrames: 16 });
        if (on <= 0.01 || toHero > 0.5) return null;
        const cx = railX0 + (idx / (CARDS.length - 1)) * (railX1 - railX0);
        // chunk k reveals spread evenly across the card's on-screen life
        const span = cardEnd - at - 56;
        const chunkAt = (k: number) => at + 30 + (span * (k + 0.5)) / c.chunks.length;
        const barW = 556;
        let acc = 0;
        return (
          <div style={{ position: "absolute", left: Math.max(WIDTH * 0.08, Math.min(WIDTH * 0.92 - 620, cx - 310)), top: railY + 56, width: 620, background: COLOR.cardWhite, border: `3px solid ${COLOR.ink}`, padding: "24px 32px 28px", opacity: Math.min(1, on) * (1 - toHero) * stage.exit(frame), translate: `0px ${(1 - Math.min(1, on)) * 24}px` }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.1em", color: COLOR.grey, borderBottom: `1px solid ${COLOR.grid}`, paddingBottom: 8 }}>{c.title}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 16 }}>
              <span style={{ fontFamily: FONT.hero, fontSize: 40, color: COLOR.ink }}>{c.unit}</span>
              <span style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 18, color: COLOR.grey }}>of advertiser spend →</span>
            </div>
            {/* the bar */}
            <svg width={barW} height={116} style={{ marginTop: 12, overflow: "visible" }}>
              {/* the whole pound/dollar */}
              <rect x={0} y={0} width={barW} height={46} fill={COLOR.tan} />
              {/* reached portion (orange), grows in once the last chunk is down */}
              {(() => {
                const lastAt = chunkAt(c.chunks.length - 1);
                const reachedW = interpolate(frame, [lastAt + 6, lastAt + 28], [0, (c.reached / 100) * barW], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
                return (
                  <>
                    {reachedW > 1 && <rect x={0} y={0} width={reachedW} height={46} fill={COLOR.orange} />}
                    {reachedW > 40 && (
                      <text x={reachedW / 2} y={30} textAnchor="middle" fontFamily={FONT.hero} fontSize={24} fill={COLOR.cardWhite}>
                        {c.reached}
                        {c.unit === "£1" ? "p" : "¢"}
                      </text>
                    )}
                    <rect x={0} y={0} width={barW} height={46} fill="none" stroke={COLOR.ink} strokeWidth={2.5} />
                  </>
                );
              })()}
              {/* labelled deduction chunks */}
              {c.chunks.map((ch, k) => {
                const x0 = (acc / 100) * barW;
                acc += ch.pct;
                const rv = interpolate(frame, [chunkAt(k), chunkAt(k) + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
                if (rv <= 0.01) return null;
                const w = (ch.pct / 100) * barW * rv;
                return (
                  <g key={k} opacity={rv}>
                    <rect x={barW - x0 - w} y={0} width={w} height={46} fill={ch.accent ? COLOR.ink : COLOR.grey} />
                    <line x1={barW - x0 - w / 2} y1={46} x2={barW - x0 - w / 2} y2={58 + k * 16} stroke={COLOR.grey} strokeWidth={1.5} />
                    <text x={barW - x0 - w / 2} y={72 + k * 16} textAnchor="middle" fontFamily={FONT.mono} fontSize={13} fill={ch.accent ? COLOR.ink : COLOR.grey}>
                      −{ch.pct}
                      {c.unit === "£1" ? "p" : "¢"} {ch.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 20, color: COLOR.ink, marginTop: 8, opacity: interpolate(frame, [chunkAt(c.chunks.length - 1) + 10, chunkAt(c.chunks.length - 1) + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              {c.reachedLabel}
            </div>
          </div>
        );
      })()}

      {/* ── the 36¢ hero — recedes to a top marker as "so the middle is…" arrives ── */}
      {(() => {
        const shrink = interpolate(frame, [F.recede, F.recede + 34], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
        if (frame < F.hero - 20) return null;
        // big centred hero → tiny top-left marker
        const top = interpolate(shrink, [0, 1], [HEIGHT * 0.12, HEIGHT * 0.24]);
        const big = interpolate(shrink, [0, 1], [34, 260]);
        const sub = interpolate(shrink, [0, 1], [0, 1]);
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", opacity: safeRamp(frame, [F.hero - 14, F.hero, dur - 18, dur - 6]), scale: String(shrink > 0.98 ? heroPulse : 1) }}>
            {shrink > 0.5 && <Bloom window={[F.peak - 6, F.peak + 10, F.peak + 50, F.peak + 80]} radius={340} intensity={0.7} />}
            <div style={{ fontFamily: FONT.hero, fontSize: big, lineHeight: 0.86, color: COLOR.orange }}>
              36¢{sub < 0.5 ? <span style={{ fontFamily: FONT.mono, fontSize: 20, color: COLOR.grey }}>{"  "}reached a person</span> : null}
            </div>
            {sub > 0.5 && (
              <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 30, letterSpacing: "0.1em", textTransform: "uppercase", color: COLOR.grey, opacity: sub }}>
                {frame >= vo.at("reached", 1308) ? "of the advertiser's $1 reached a real person" : "of the advertiser's $1…"}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── "not one giant — a dozen small tolls, plus a lot of waste" ── */}
      {frame >= F.giant - 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.42, textAlign: "center", opacity: safeRamp(frame, [F.giant, F.giant + 14, dur - 20, dur - 6]) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 52, color: COLOR.ink }}>NOT ONE GIANT TAKING HALF.</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 22 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ width: 30, height: 52, background: i < 8 ? COLOR.ink : COLOR.grey, opacity: springIn({ frame, fps: 30, delay: F.giant + 16 + i * 4, durationInFrames: 10 }), scale: `1 ${pulse(frame, F.tolls + i * 3, 0.08, 14)}`, transformOrigin: "50% 100%" }} />
            ))}
          </div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 28, color: COLOR.grey, marginTop: 18, opacity: interpolate(frame, [F.tolls, F.tolls + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            a dozen small tolls{frame >= vo.at("waste", 1619) ? " · plus a lot of waste" : ""}
          </div>
        </div>
      )}
    </>
  );
};
