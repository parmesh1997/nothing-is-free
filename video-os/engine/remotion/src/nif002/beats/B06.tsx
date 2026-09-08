import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { appTile } from "../shapes";
import { Floor } from "../scene";
import { useStage, pulse, loop, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B06 — the ID spine. MEDIUM · 841 f (28.0 s).
 * Empty → a vertical ID code draws up → every kit fires an arrow into it →
 * two apps snap to the same code (one person) → a Settings row with a RESET
 * toggle nobody touches → empty.
 * Peak: "Almost nobody ever does." — whisper "does" @ f795.
 */
export const B06: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Device advertising identifiers — platform documentation">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 30, holdFrames: 12 });
  const vo = useBeatTiming("B06");

  const F = {
    spine: vo.at("number", 46),
    name: vo.at("name", 200),
    arrows: vo.at("reports", 284),
    monday: vo.at("monday", 398),
    thursday: vo.at("thursday", 470),
    oneperson: vo.at("person", 540),
    settings: vo.at("reset", 600),
    peak: vo.at("does", 795),
  };

  const groundY = Math.round(HEIGHT * 0.82);
  const spineX = WIDTH * 0.5;
  const spineW = 150;
  const spineTop = HEIGHT * 0.08;
  const spineBottom = HEIGHT * 0.6; // ends clear of the lower-third UI
  const spineH = spineBottom - spineTop;

  const spineDraw = interpolate(frame, [F.spine, F.spine + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const thick = interpolate(frame, [F.arrows, F.arrows + 90], [1, 1.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // barcode stripes (top → down)
  const stripes: Array<{ y: number; h: number }> = [];
  let yy = 0;
  let seed = 91;
  while (yy < spineH * 0.94) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const sh = 6 + (seed % 5) * 5;
    if ((seed >> 4) % 3 !== 0) stripes.push({ y: yy, h: sh });
    yy += sh + 6;
  }

  const chipCount = 6;
  const settingsPulse = pulse(frame, F.peak, 0.05, 18);

  return (
    <>
      <Floor stage={stage} at={6} heightFraction={0.22} kind="floor" />

      {/* ── the ID spine ── */}
      <div
        style={{
          position: "absolute",
          left: spineX - (spineW * thick) / 2,
          top: spineTop,
          width: spineW * thick,
          height: spineH,
          opacity: stage.present(frame, F.spine, 14),
          transformOrigin: "50% 100%",
        }}
      >
        <svg width={spineW * thick} height={spineH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <rect x={0} y={spineH * (1 - spineDraw)} width={spineW * thick} height={spineH * spineDraw} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={2.5} />
          {stripes.map((s, i) => {
            const sy = spineH - s.y - s.h;
            if (sy < spineH * (1 - spineDraw)) return null;
            return <rect key={i} x={spineW * thick * 0.12} y={sy} width={spineW * thick * 0.76} height={s.h} fill={COLOR.ink} />;
          })}
        </svg>
        <Bloom window={[F.arrows + 70, F.arrows + 88, F.arrows + 130, F.arrows + 156]} radius={200} x="50%" y="50%" intensity={0.7} />
      </div>
      <div style={{ position: "absolute", left: spineX - 200, top: spineTop - 52, width: 400, textAlign: "center", fontFamily: FONT.hero, fontSize: 34, letterSpacing: "0.04em", color: COLOR.ink, opacity: stage.present(frame, F.spine + 8, 14) }}>
        YOUR ADVERTISING ID
      </div>
      {stage.isUp(frame, F.name) && (
        <div style={{ position: "absolute", left: spineX + spineW, top: HEIGHT * 0.24, fontFamily: FONT.mono, fontSize: 22, color: COLOR.grey, opacity: stage.present(frame, F.name, 14) }}>
          ← the industry treats this as your name
        </div>
      )}

      {/* ── kits firing arrows into the spine — first volley, then a steady drip ── */}
      <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: stage.exit(frame) }}>
        {Array.from({ length: chipCount }).map((_, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const tier = Math.floor(i / 2); // 0,1,2 down the spine
          const fromX = spineX + side * (300 + tier * 30);
          const fromY = HEIGHT * (0.2 + tier * 0.18);
          const at = F.arrows + i * 16;
          const t = interpolate(frame, [at, at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
          if (t <= 0.01) return null;
          const hitX = spineX + side * (spineW * thick) / 2;
          const hitY = HEIGHT * (0.22 + tier * 0.18);
          const tipX = fromX + (hitX - fromX) * t;
          const tipY = fromY + (hitY - fromY) * t;
          // after the first hit, keep sending a faint pulse down the same line
          const pulseT = frame > at + 20 ? loop(frame, 36 + i * 7) : -1;
          return (
            <g key={i}>
              <circle cx={fromX} cy={fromY} r={11} fill={i % 2 ? COLOR.grey : COLOR.orange} stroke={COLOR.ink} strokeWidth={2} opacity={0.95} />
              <line x1={fromX} y1={fromY} x2={tipX} y2={tipY} stroke={i % 2 ? COLOR.grey : COLOR.orange} strokeWidth={2.5} opacity={0.8} />
              {t > 0.92 && <circle cx={hitX} cy={hitY} r={interpolate(frame, [at + 14, at + 26], [3, 13], { extrapolateRight: "clamp" })} fill="none" stroke={COLOR.orange} strokeWidth={2.5} opacity={interpolate(frame, [at + 14, at + 30], [1, 0], { extrapolateRight: "clamp" })} />}
              {pulseT >= 0 && pulseT < 1 && (
                <circle cx={fromX + (hitX - fromX) * pulseT} cy={fromY + (hitY - fromY) * pulseT} r={4} fill={i % 2 ? COLOR.grey : COLOR.orange} opacity={0.5 * (1 - pulseT)} />
              )}
            </g>
          );
        })}
      </svg>

      {/* ── two apps snap to the same spine ── */}
      {[F.monday, F.thursday].map((at, i) => {
        const side = i === 0 ? -1 : 1;
        const inn = springIn({ frame, fps: 30, delay: at, durationInFrames: 18 });
        if (inn <= 0.01) return null;
        const size = 120;
        const restX = spineX + side * (spineW + 30);
        const x = interpolate(Math.min(1, inn), [0, 1], [spineX + side * 520, restX]);
        return (
          <div key={i} style={{ position: "absolute", left: side < 0 ? x - size : x, top: HEIGHT * 0.4, width: size, height: size, opacity: stage.exit(frame), scale: String(frame >= F.oneperson ? pulse(frame, F.oneperson + i * 6, 0.08, 18) : 1) }}>
            <FlatFigure shape={appTile({ glyph: i === 0 ? "bag" : "letter", color: i === 0 ? COLOR.grey : COLOR.orange })} w={size} h={size} />
            <div style={{ position: "absolute", left: 0, right: 0, top: size + 8, textAlign: "center", fontFamily: FONT.mono, fontSize: 15, color: COLOR.grey }}>{i === 0 ? "MON · shopping" : "THU · word game"}</div>
          </div>
        );
      })}
      {stage.isUp(frame, F.oneperson) && (
        <div style={{ position: "absolute", left: WIDTH * 0.5 - 260, top: HEIGHT * 0.62, width: 520, textAlign: "center", background: COLOR.paper, padding: "10px 0", fontFamily: FONT.hero, fontSize: 34, color: COLOR.ink, opacity: stage.present(frame, F.oneperson, 14), scale: String(pulse(frame, F.oneperson + 4, 0.06, 18)) }}>
          KNOWN TO BE ONE PERSON
        </div>
      )}

      {/* ── the Settings row + RESET toggle ── */}
      {frame >= F.settings - 6 && (
        <div
          style={{
            position: "absolute",
            left: WIDTH * 0.5 - 300,
            top: groundY - 6,
            width: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 26px",
            background: COLOR.cardWhite,
            border: `2px solid ${COLOR.ink}`,
            fontFamily: FONT.mono,
            fontSize: 22,
            color: COLOR.ink,
            opacity: safeRamp(frame, [F.settings, F.settings + 16, dur - 22, dur - 6]),
            scale: String(settingsPulse),
          }}
        >
          <span>Reset advertising identifier</span>
          <div style={{ width: 64, height: 34, borderRadius: 17, background: COLOR.grid, border: `2px solid ${COLOR.grey}`, position: "relative" }}>
            <div style={{ position: "absolute", left: 3, top: 3, width: 24, height: 24, borderRadius: "50%", background: COLOR.grey }} />
          </div>
        </div>
      )}

      {/* a cursor drifts toward the toggle, hesitates, and pulls away */}
      {frame >= F.settings + 24 && frame < F.peak + 20 && (() => {
        const cyc = loop(frame, 140);
        // near the toggle only briefly at cyc≈0.35, parked away otherwise
        const approach = interpolate(cyc, [0, 0.3, 0.42, 0.62, 1], [1, 0.05, 0.05, 1, 1], { easing: EASE.inOut });
        const cx = WIDTH * 0.5 + 224 + approach * 170;
        const cy = groundY + 10 - Math.sin(cyc * Math.PI) * 12;
        return (
          <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: safeRamp(frame, [F.settings + 24, F.settings + 40, dur - 22, dur - 8]) }}>
            <path d={`M ${cx} ${cy} l 0 24 l 6 -6 l 5 10 l 4 -2 l -5 -10 l 9 0 z`} fill={COLOR.ink} stroke={COLOR.cardWhite} strokeWidth={1.5} />
          </svg>
        );
      })()}

      {/* the counter that never moves */}
      {frame >= F.settings + 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: groundY - 70, textAlign: "center", fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.08em", color: COLOR.grey, opacity: safeRamp(frame, [F.settings + 10, F.settings + 26, dur - 22, dur - 8]) }}>
          TIMES YOU&apos;VE RESET IT: <span style={{ fontFamily: FONT.hero, fontSize: 34, color: COLOR.ink }}>0</span>
        </div>
      )}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: groundY + 58, textAlign: "center", fontFamily: FONT.sans, fontWeight: 600, fontSize: 30, color: COLOR.orange, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 18, dur - 5]) }}>
          almost nobody ever does
        </div>
      )}
    </>
  );
};
