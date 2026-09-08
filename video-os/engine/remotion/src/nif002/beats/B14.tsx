import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { junkPage } from "../shapes";
import { Floor } from "../scene";
import { useStage, loop, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B14 — made for advertising. MEDIUM · 1007 f (33.6 s).
 * The page assembles as the VO describes it: frame draws → URL types → a fake
 * headline appears then is struck ("no real readers / no real articles") → ad
 * slots tile in and never stop → "≈ 1 IN 5 ADS" bar → a flame eats a coin →
 * "the advertiser's own money, burning quietly".
 * Peak: "burning quietly" — whisper "quietly" @ f988.
 */
export const B14: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="ANA Programmatic Transparency, Dec 2023 (made-for-advertising sites)">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 30, holdFrames: 14 });
  const vo = useBeatTiming("B14");

  const F = {
    frame0: vo.at("go", 71),
    url: vo.at("websites", 115),
    readers: vo.at("readers", 240),
    articles: vo.at("articles", 286),
    fill: vo.at("wrapped", 355),
    bar: vo.at("five", 551),
    cheapest: vo.at("cheapest", 710),
    flame: vo.at("burning", 970),
    peak: vo.at("quietly", 988),
  };

  const pageW = 760;
  const pageH = 720;
  const pageX = WIDTH * 0.07;
  const pageY = HEIGHT * 0.07;

  const cols = 3;
  const rows = 5;
  const sgap = 14;
  const slotTop = 180;
  const sw = (pageW - 44 - sgap * (cols - 1)) / cols;
  const sh = (pageH - slotTop - 40 - sgap * (rows - 1)) / rows;

  const barFrac = interpolate(frame, [F.bar, F.bar + 50], [0, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut });
  const burn = interpolate(frame, [F.flame, F.flame + 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const url = "best-deals-trending-24-7.example/top-10-you-wont-believe";
  const urlN = Math.max(0, Math.floor(((frame - F.url) / 30) * 24));

  return (
    <>
      <Floor stage={stage} at={4} heightFraction={0.24} kind="floor" />

      {/* ── the junk page ── */}
      <div style={{ position: "absolute", left: pageX, top: pageY, width: pageW, height: pageH, opacity: stage.present(frame, F.frame0 - 8, 16) }}>
        <FlatFigure shape={junkPage} w={pageW} h={pageH} />
        <svg width={pageW} height={pageH} viewBox={`0 0 ${pageW} ${pageH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* address bar types */}
          <text x={70} y={32} fontFamily={FONT.mono} fontSize={17} fill={COLOR.grey}>{url.slice(0, Math.min(url.length, urlN))}</text>

          {/* a fake headline — appears then gets struck */}
          {frame >= F.url + 30 && frame < F.fill + 40 && (
            <>
              <text x={26} y={110} fontFamily={FONT.hero} fontSize={40} fill={COLOR.ink} opacity={interpolate(frame, [F.url + 30, F.url + 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                10 THINGS YOU WON'T BELIEVE
              </text>
              {frame >= F.readers && <rect x={22} y={96} width={interpolate(frame, [F.readers, F.readers + 16], [0, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} height={6} fill={COLOR.orange} />}
              {frame >= F.readers + 6 && <text x={26} y={150} fontFamily={FONT.mono} fontSize={18} fill={COLOR.grey}>no real readers</text>}
              {frame >= F.articles && <text x={220} y={150} fontFamily={FONT.mono} fontSize={18} fill={COLOR.grey} opacity={interpolate(frame, [F.articles, F.articles + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>· no real articles</text>}
            </>
          )}

          {/* the ad slots — tile in and keep flickering */}
          {Array.from({ length: cols * rows }).map((_, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const at = F.fill + (row * cols + col) * 7;
            const on = springIn({ frame, fps: 30, delay: at, durationInFrames: 12 });
            if (on <= 0.02) return null;
            const flick = (i * 5 + Math.floor(frame / 5)) % 3 === 0;
            return <rect key={i} x={22 + col * (sw + sgap)} y={slotTop + row * (sh + sgap)} width={sw} height={sh} fill={flick ? COLOR.orange : COLOR.grey} opacity={Math.min(1, on) * 0.92} />;
          })}
          {frame >= F.fill + 50 && <text x={pageW / 2} y={pageH - 12} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} fill={COLOR.grey}>a page wrapped in ad slots</text>}
        </svg>
      </div>

      {/* ── 1-in-5 bar ── */}
      {frame >= F.bar - 6 && (
        <div style={{ position: "absolute", left: WIDTH * 0.58, top: HEIGHT * 0.22, width: WIDTH * 0.34, opacity: stage.present(frame, F.bar, 14) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 40, color: COLOR.ink, marginBottom: 12 }}>≈ 1 IN 5 ADS RAN ON A PAGE LIKE THIS</div>
          <div style={{ position: "relative", width: "100%", height: 54, border: `3px solid ${COLOR.ink}`, background: COLOR.cardWhite }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barFrac * 100}%`, background: COLOR.orange }} />
          </div>
          {frame >= F.cheapest && (
            <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 20, color: COLOR.grey, marginTop: 12, opacity: interpolate(frame, [F.cheapest, F.cheapest + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              the buying software chased the cheapest views — and the cheapest views are the fake ones
            </div>
          )}
        </div>
      )}

      {/* ── burning coin ── */}
      {frame >= F.flame - 8 && (
        <div style={{ position: "absolute", left: WIDTH * 0.62, top: HEIGHT * 0.48, opacity: safeRamp(frame, [F.flame, F.flame + 14, dur - 20, dur - 6]) }}>
          <Bloom window={[F.peak - 4, F.peak + 12, dur - 26, dur - 10]} radius={200} intensity={0.72} />
          <svg width={220} height={240} viewBox="0 0 220 240" style={{ overflow: "visible" }}>
            <circle cx={110} cy={150} r={70} fill={COLOR.tan} stroke={COLOR.ink} strokeWidth={4} opacity={1 - burn * 0.7} />
            <text x={110} y={172} textAnchor="middle" fontFamily={FONT.hero} fontSize={80} fill={COLOR.ink} opacity={1 - burn}>$</text>
            {[0, 1, 2].map((k) => (
              <path
                key={k}
                d={`M ${100 + k * 8} ${100 - burn * 10} C ${70 + k * 8} ${40}, ${140 + k * 8} ${40}, ${100 + k * 8} ${100 - burn * 10} Z`}
                fill={COLOR.orange}
                opacity={interpolate(frame, [F.flame, F.flame + 18], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (0.55 + Math.sin(loop(frame, 14) * Math.PI * 2 + k) * 0.4)}
                transform={`translate(${(k - 1) * 14} ${-burn * 24})`}
              />
            ))}
          </svg>
        </div>
      )}

      {/* peak line */}
      {frame >= F.peak - 6 && (
        <div style={{ position: "absolute", left: WIDTH * 0.5, top: HEIGHT * 0.82, fontFamily: FONT.hero, fontSize: 44, color: COLOR.ink, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 16, dur - 4]) }}>
          THE ADVERTISER'S OWN MONEY, <span style={{ color: COLOR.orange }}>BURNING QUIETLY.</span>
        </div>
      )}
    </>
  );
};
