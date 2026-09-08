import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { AuctionFan } from "../AuctionFan";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { Floor } from "../scene";
import { useStage, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B19 — the losers keep the file. HIGH · 1547 f (51.6 s). AuctionFan
 * (harvest). Empty → the arc re-forms → one wins → the other ~120 keep a
 * redacted copy that settles into the lower frame → "US SENATE, 2021" letter →
 * "REGULATOR ORDER, DEC 2024" with an orange seal → empty.
 * Peak: "the first order of its kind" — whisper "kind" @ f1510.
 */
export const B19: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="US Senate (Wyden–Cassidy) 2021; FTC v. Mobilewalla order, Dec 2024">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 40, holdFrames: 16 });
  const vo = useBeatTiming("B19");

  const F = {
    arc: vo.at("losers", 86),
    buyers: vo.at("buyers", 194),
    win: vo.at("wins", 230),
    received: vo.at("received", 300),
    detail: vo.at("location", 400),
    keep: vo.at("systems", 553),
    business: vo.at("business", 835),
    senate: vo.at("2021", 893),
    order: vo.at("2024", 1166, 1),
    stop: vo.at("stop", 1290),
    notwin: vo.at("winning", 1385),
    seal: vo.at("first", 1457),
    peak: vo.at("kind", 1510),
  };
  const DETAILS = ["ROUGH LOCATION", "DEVICE + OS", "APP OPEN RIGHT NOW"];

  const nodeX = WIDTH * 0.5;
  const nodeY = HEIGHT * 0.26;
  const radius = Math.round(HEIGHT * 0.19);

  const counterN = Math.max(0, Math.min(119, Math.round(interpolate(frame, [F.keep, F.keep + 240], [0, 119], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut }))));

  // the ~119 redacted mini-cards raining down + settling across the lower frame
  const MINIS = 44; // representative, not literally 119
  const settleTop = HEIGHT * 0.5;
  const settleBot = HEIGHT * 0.74;

  return (
    <>
      <Floor stage={stage} at={10} heightFraction={0.24} kind="floor" />

      <div style={{ opacity: stage.exit(frame) * interpolate(frame, [F.received, F.received + 20, F.keep - 10, F.keep + 20], [1, 0.32, 0.32, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: String(interpolate(frame, [F.arc, F.arc + 40, F.senate - 30, F.senate + 40], [0.85, 1, 1, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })), transformOrigin: `${nodeX}px ${nodeY}px` }}>
        <AuctionFan
          originX={nodeX}
          originY={nodeY}
          count={120}
          radius={radius}
          spreadDeg={190}
          layout="arc"
          start={F.buyers}
          fanFrames={120}
          outcome="winner"
          winnerIndex={54}
          nodeLabel="THE EXCHANGE"
          tileScale={1.0}
        />
      </div>

      {/* ── "one wins — the other few hundred still received it" ── */}
      {frame >= F.win - 4 && frame < F.keep + 20 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.02, textAlign: "center", fontFamily: FONT.hero, fontSize: 40, letterSpacing: "0.02em", color: COLOR.ink, opacity: interpolate(frame, [F.win, F.win + 12, F.keep, F.keep + 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          ONE WINS. <span style={{ color: COLOR.orange }}>~200 LOSE — AND KEEP THE COPY.</span>
        </div>
      )}

      {/* three representative loser files peel off, data rows typing in */}
      {frame >= F.received - 6 && frame < F.keep + 30 && (
        <div style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [F.received, F.received + 16, F.keep + 10, F.keep + 30], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {[0, 1, 2].map((i) => {
            const at = F.received + i * 14;
            const on = springIn({ frame, fps: 30, delay: at, durationInFrames: 16 });
            if (on <= 0.01) return null;
            const cx = WIDTH * (0.2 + i * 0.3);
            return (
              <div key={i} style={{ position: "absolute", left: cx - 150, top: HEIGHT * 0.44, width: 300, background: COLOR.cardWhite, border: `3px solid ${COLOR.ink}`, opacity: Math.min(1, on), translate: `0px ${(1 - Math.min(1, on)) * 30}px` }}>
                <div style={{ background: COLOR.ink, color: COLOR.cardWhite, fontFamily: FONT.mono, fontSize: 13, letterSpacing: "0.1em", padding: "6px 12px" }}>LOSING BIDDER #{i + 1} · RECEIVED</div>
                <div style={{ padding: "12px 14px" }}>
                  {DETAILS.map((d, k) => {
                    const rowAt = F.detail + k * 26;
                    const rv = interpolate(frame, [rowAt, rowAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                    return (
                      <div key={k} style={{ fontFamily: FONT.mono, fontSize: 14, color: rv > 0.5 ? COLOR.ink : COLOR.grey, marginTop: k ? 7 : 0, opacity: 0.35 + rv * 0.65 }}>
                        {rv > 0.05 ? `• ${d}` : "• …"}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── the harvested files raining into the lower frame ── */}
      {frame >= F.keep - 10 && frame < F.senate + 60 && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: interpolate(frame, [F.keep, F.keep + 20, F.senate, F.senate + 50], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {Array.from({ length: MINIS }).map((_, i) => {
            const col = i % 11;
            const row = Math.floor(i / 11);
            const at = F.keep + i * 5;
            const t = springIn({ frame, fps: 30, delay: at, durationInFrames: 22 });
            if (t <= 0.01) return null;
            const tx = WIDTH * 0.09 + col * ((WIDTH * 0.82) / 11);
            const ty = interpolate(Math.min(1, t), [0, 1], [nodeY, settleTop + row * ((settleBot - settleTop) / 4)]);
            return (
              <g key={i} transform={`translate(${tx} ${ty})`} opacity={Math.min(1, t)}>
                <rect width={116} height={72} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={2} />
                <rect x={0} y={0} width={116} height={18} fill={COLOR.ink} />
                {[26, 40, 54].map((yy, k) => (
                  <rect key={k} x={8} y={yy} width={[80, 58, 68][k]} height={6} fill={COLOR.grey} />
                ))}
              </g>
            );
          })}
        </svg>
      )}

      {/* running counter */}
      {frame >= F.keep && frame < F.senate && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.42, textAlign: "center", fontFamily: FONT.mono, fontSize: 24, color: COLOR.ink, opacity: stage.present(frame, F.keep, 14) }}>
          <span style={{ color: COLOR.orange, fontFamily: FONT.hero, fontSize: 48 }}>{counterN}</span> LOSERS · ALL KEEP THE FILE · PAID NOTHING
        </div>
      )}
      {frame >= F.business - 6 && frame < F.senate && (
        <div style={{ position: "absolute", left: WIDTH * 0.07, top: HEIGHT * 0.16, fontFamily: FONT.sans, fontWeight: 600, fontSize: 26, color: COLOR.ink, opacity: interpolate(frame, [F.business, F.business + 12, F.senate - 12, F.senate], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          for some, keeping it <span style={{ color: COLOR.orange }}>is the whole business</span>
        </div>
      )}

      {/* ── the two documents ── */}
      {frame >= F.senate - 8 && (
        <Doc x={WIDTH * 0.08} y={HEIGHT * 0.34} title="US SENATE" sub="2021 — asked the government to investigate" at={F.senate} sealed={false} stage={stage} />
      )}
      {frame >= F.order - 8 && (
        <Doc x={WIDTH * 0.5} y={HEIGHT * 0.34} title="REGULATOR ORDER" sub="December 2024" at={F.order} sealed={frame >= F.seal} sealAt={F.seal} stage={stage} />
      )}

      {/* the order's teeth type in, then a kept file is clawed back and shredded */}
      {frame >= F.stop - 6 && frame < dur - 30 && (
        <div style={{ position: "absolute", left: WIDTH * 0.5, top: HEIGHT * 0.53, width: WIDTH * 0.42, opacity: safeRamp(frame, [F.stop, F.stop + 12, dur - 24, dur - 8]) }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 19, lineHeight: 1.45, color: COLOR.ink }}>
            {"› STOP KEEPING DATA FROM AUCTIONS YOU DID NOT WIN".slice(0, Math.max(0, Math.floor((frame - F.stop) / 1.4)))}
            <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2 }}>▍</span>
          </div>
        </div>
      )}
      {frame >= F.notwin - 4 && (() => {
        const t = interpolate(frame, [F.notwin, F.notwin + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
        const startX = WIDTH * 0.2;
        const endX = WIDTH * 0.62;
        const cx = startX + (endX - startX) * t;
        const cy = HEIGHT * 0.66 - Math.sin(t * Math.PI) * 40;
        return (
          <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: safeRamp(frame, [F.notwin, F.notwin + 10, dur - 24, dur - 8]) }}>
            <g transform={`translate(${cx} ${cy}) scale(${1 - t * 0.5})`} opacity={1 - t * 0.7}>
              <rect x={-58} y={-36} width={116} height={72} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={2} />
              <rect x={-58} y={-36} width={116} height={16} fill={COLOR.ink} />
              {[0, 1, 2].map((k) => (
                <rect key={k} x={-46} y={-10 + k * 14} width={[80, 54, 66][k]} height={6} fill={COLOR.grey} />
              ))}
              {t > 0.55 && <line x1={-58} y1={-36} x2={58} y2={36} stroke={COLOR.orange} strokeWidth={4} />}
            </g>
            {t > 0.9 && <text x={endX} y={HEIGHT * 0.66} textAnchor="middle" fontFamily={FONT.mono} fontSize={16} fill={COLOR.grey}>1 file returned. the first ever.</text>}
          </svg>
        );
      })()}

      <Bloom window={[F.seal - 4, F.seal + 12, F.peak + 40, F.peak + 70]} radius={220} x="66%" y="62%" intensity={0.72} />

      {/* peak line */}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.86, textAlign: "center", fontFamily: FONT.hero, fontSize: 46, color: COLOR.ink, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 20, dur - 6]) }}>
          THE <span style={{ color: COLOR.orange }}>FIRST</span> ORDER OF ITS KIND.
        </div>
      )}
    </>
  );
};

const Doc: React.FC<{
  x: number;
  y: number;
  title: string;
  sub: string;
  at: number;
  sealed: boolean;
  sealAt?: number;
  stage: ReturnType<typeof useStage>;
}> = ({ x, y, title, sub, at, sealed, sealAt, stage }) => {
  const frame = useCurrentFrame();
  const on = springIn({ frame, fps: 30, delay: at, durationInFrames: 16 });
  if (on <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: WIDTH * 0.38, background: COLOR.cardWhite, border: `3px solid ${COLOR.ink}`, padding: "24px 28px", opacity: Math.min(1, on) * stage.exit(frame), translate: `0px ${(1 - Math.min(1, on)) * 24}px` }}>
      <div style={{ fontFamily: FONT.hero, fontSize: 40, color: COLOR.ink }}>{title}</div>
      <div style={{ fontFamily: FONT.mono, fontSize: 18, color: COLOR.grey, marginTop: 6 }}>{sub}</div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 4, background: COLOR.grid, marginTop: 14, width: `${90 - i * 18}%` }} />
      ))}
      {sealed && sealAt != null && (
        <div style={{ position: "absolute", right: -18, bottom: -18, width: 90, height: 90, borderRadius: "50%", border: `4px solid ${COLOR.orange}`, color: COLOR.orange, fontFamily: FONT.hero, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: COLOR.cardWhite, scale: String(pulse(frame, sealAt, 0.2, 16)) }}>
          FIRST EVER
        </div>
      )}
    </div>
  );
};
