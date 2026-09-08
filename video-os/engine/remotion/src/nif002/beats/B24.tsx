import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { EASE, springIn } from "../../parts/motion";
import { appTile, balanceScale, studioDesk } from "../shapes";
import { Floor } from "../scene";
import { useStage, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B24 — the counter-argument. HIGH · 1331 f (44.4 s). The one [dry].
 * Empty → the 97% app grid washes back → the two-person studio works → a click
 * tally runs 1,000 impressions, 1 click → a balance drops: INVASIVE vs POINTLESS,
 * wobbles, settles LEVEL → hold on the level scale.
 * Peak: "invasive and pointless at the same time" — whisper "time" @ f1275.
 */
export const B24: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Google Play distribution 2024; display click-through benchmarks">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 34, holdFrames: 16 });
  const vo = useBeatTiming("B24");

  const F = {
    scam: vo.at("scam", 110),
    grid: vo.at("every", 202),
    nopay: vo.at("nobody", 300),
    studio: vo.at("studio", 455),
    eat: vo.at("eat", 542),
    waste: vo.at("wastes", 636),
    tally: vo.at("clicked", 743),
    sold: vo.at("sold", 884),
    nothing: vo.at("nothing", 1010),
    scale: vo.at("invasive", 1208),
    peak: vo.at("time", 1275),
  };

  const gridCols = 10;
  const gridRows = 4;
  const gridTile = 100;
  const gridGap = 18;
  const gridW = gridCols * gridTile + (gridCols - 1) * gridGap;
  const gridLeft = (WIDTH - gridW) / 2;
  const gridTop = HEIGHT * 0.08;

  const impressions = Math.min(1000, Math.max(0, Math.floor(interpolate(frame, [F.tally, F.tally + 200], [0, 1000], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.countOut }))));

  // scale tilt: wobble then settle level
  const wob = frame < F.scale ? 0 : interpolate(frame, [F.scale, F.scale + 30, F.scale + 55, F.scale + 80, F.scale + 110], [0, -14, 10, -4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  return (
    <>
      <Floor stage={stage} at={4} heightFraction={0.24} kind="floor" />

      {/* opening: "it would be clean to call it a scam. it isn't." */}
      {frame < F.grid + 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.3, textAlign: "center", fontFamily: FONT.hero, fontSize: 54, color: COLOR.ink, opacity: interpolate(frame, [F.scam, F.scam + 12, F.grid - 10, F.grid + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          CLEAN TO CALL IT A SCAM.
          <br />
          <span style={{ color: COLOR.orange }}>IT ISN'T THAT SIMPLE.</span>
        </div>
      )}

      {/* "$0" — almost nobody will pay */}
      {frame >= F.nopay - 6 && frame < F.studio && (
        <div style={{ position: "absolute", left: WIDTH * 0.5 - 180, top: HEIGHT * 0.44, fontFamily: FONT.hero, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [F.nopay, F.nopay + 12, F.studio - 12, F.studio], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          almost nobody will pay <span style={{ color: COLOR.orange }}>$0</span> → so it's free
        </div>
      )}

      {/* ── the 97% grid ── */}
      <div style={{ opacity: interpolate(frame, [F.grid, F.grid + 20, F.tally, F.sold], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * stage.exit(frame) }}>
        {Array.from({ length: gridCols * gridRows }).map((_, i) => {
          const col = i % gridCols;
          const row = Math.floor(i / gridCols);
          const on = springIn({ frame, fps: 30, delay: F.grid + (col + row) * 2, durationInFrames: 12 });
          if (on <= 0.02) return null;
          const paid = i === 23;
          return (
            <div key={i} style={{ position: "absolute", left: gridLeft + col * (gridTile + gridGap), top: gridTop + row * (gridTile + gridGap), width: gridTile, height: gridTile, opacity: Math.min(1, on) }}>
              <FlatFigure shape={appTile({ glyph: (["letter", "controller", "bag", "cloud", "map", "dots"] as const)[i % 6], color: paid ? COLOR.orange : COLOR.grey })} w={gridTile} h={gridTile} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: gridLeft, top: gridTop - 44, fontFamily: FONT.hero, fontSize: 34, color: COLOR.ink }}>97% FREE — BECAUSE ALMOST NOBODY WILL PAY</div>
      </div>

      {/* ── the studio ── */}
      {frame >= F.studio - 8 && (
        <div style={{ position: "absolute", left: WIDTH * 0.05, top: HEIGHT * 0.46, width: WIDTH * 0.28, height: HEIGHT * 0.32, opacity: safeRamp(frame, [F.studio, F.studio + 16, F.scale - 30, F.scale]) }}>
          <FlatFigure shape={studioDesk()} w={WIDTH * 0.28} h={HEIGHT * 0.32} />
        </div>
      )}
      {frame >= F.studio - 6 && frame < F.sold && (
        <div style={{ position: "absolute", left: WIDTH * 0.05, top: HEIGHT * 0.38, width: WIDTH * 0.34, fontFamily: FONT.sans, fontWeight: 600, fontSize: 24, color: COLOR.ink, opacity: interpolate(frame, [F.studio, F.studio + 14, F.tally + 30, F.sold], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          the auction lets a <span style={{ color: COLOR.orange }}>two-person studio</span> give a game away{frame >= F.eat ? " — and still eat" : "…"}
        </div>
      )}

      {/* ── the click tally ── */}
      {frame >= F.tally - 8 && frame < F.sold && (
        <div style={{ position: "absolute", left: WIDTH * 0.52, top: HEIGHT * 0.46, opacity: interpolate(frame, [F.tally, F.tally + 14, F.sold - 14, F.sold], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 24, color: COLOR.ink }}>IMPRESSIONS: <span style={{ fontFamily: FONT.hero, fontSize: 44 }}>{impressions.toLocaleString("en-US")}</span></div>
          <div style={{ fontFamily: FONT.mono, fontSize: 24, color: COLOR.ink, marginTop: 8 }}>CLICKS: <span style={{ fontFamily: FONT.hero, fontSize: 44, color: COLOR.orange }}>{impressions >= 1000 ? 1 : 0}</span></div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 20, color: COLOR.grey, marginTop: 10 }}>the average banner ad: ~1 click per 1,000</div>
        </div>
      )}

      {/* ── "sold for a tenth of a cent — to someone who gets nothing back" ── */}
      {frame >= F.sold - 6 && frame < F.scale && (
        <div style={{ position: "absolute", left: WIDTH * 0.5 - 470, top: HEIGHT * 0.42, width: 940, textAlign: "center", background: COLOR.paper, padding: "24px 0", opacity: interpolate(frame, [F.sold, F.sold + 14, F.scale - 24, F.scale], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 46, color: COLOR.ink, letterSpacing: "0.02em" }}>
            YOU, SOLD FOR <span style={{ color: COLOR.orange, display: "inline-block", scale: String(pulse(frame, F.sold + 6, 0.12, 20)) }}>0.1¢</span>
            {frame >= F.nothing && (
              <span style={{ opacity: interpolate(frame, [F.nothing, F.nothing + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
                {" "}
                <span style={{ fontFamily: FONT.mono, fontSize: 28, color: COLOR.grey }}>→</span> THEY GET <span style={{ color: COLOR.orange, display: "inline-block", scale: String(pulse(frame, F.nothing + 6, 0.12, 20)) }}>NOTHING BACK</span>
              </span>
            )}
          </div>
          {/* a coin that shrinks to a sliver on the "tenth of a cent" */}
          <svg width={220} height={40} style={{ marginTop: 14, overflow: "visible" }}>
            <rect x={110 - interpolate(frame, [F.sold, F.sold + 40], [100, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })} y={8} width={interpolate(frame, [F.sold, F.sold + 40], [200, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })} height={24} fill={COLOR.orange} />
            <rect x={10} y={8} width={200} height={24} fill="none" stroke={COLOR.ink} strokeWidth={2} />
          </svg>
        </div>
      )}

      {/* ── the balance scale ── */}
      {frame >= F.scale - 6 && (
        <div style={{ position: "absolute", left: WIDTH * 0.5 - 260, top: HEIGHT * 0.16, width: 520, height: 460, opacity: safeRamp(frame, [F.scale, F.scale + 16, dur - 20, dur - 6]) }}>
          <FlatFigure shape={balanceScale({ tiltDeg: wob })} w={520} h={460} />
          <div style={{ position: "absolute", left: -20, top: 120 + wob * 3, fontFamily: FONT.hero, fontSize: 32, color: COLOR.ink }}>INVASIVE</div>
          <div style={{ position: "absolute", right: -30, top: 120 - wob * 3, fontFamily: FONT.hero, fontSize: 32, color: COLOR.ink }}>POINTLESS</div>
        </div>
      )}

      {/* the dry line */}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.82, textAlign: "center", fontFamily: FONT.hero, fontSize: 44, color: COLOR.ink, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 16, dur - 4]) }}>
          INVASIVE AND POINTLESS <span style={{ color: COLOR.orange }}>AT THE SAME TIME.</span>
        </div>
      )}
    </>
  );
};
