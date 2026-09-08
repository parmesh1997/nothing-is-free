import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { Lucky } from "../../characters";
import { EASE } from "../../parts/motion";
import { Floor } from "../scene";
import { useStage, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B18 — engagement beat. REST · 673 f (22.4 s).
 * Empty → Lucky lowers her phone, looks up → a comment field slides in
 * "ADS BEFORE I PUT IT DOWN: ___", cursor blinking → she shrugs →
 * "most people are low by about half" → empty.
 * Peak: "low by about half" — whisper "half" @ f656.
 */
export const B18: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Ad-load perception — audience research">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 24, holdFrames: 12 });
  const vo = useBeatTiming("B18");

  const F = {
    lucky: vo.at("question", 16),
    count: vo.at("today", 150),
    field: vo.at("many", 240),
    shrug: vo.at("hold", 443),
    peak: vo.at("half", 656),
  };

  const luckyH = Math.round(HEIGHT * 0.56);
  const groundY = HEIGHT * 0.88;

  const cursorBlink = Math.floor(frame / 14) % 2 === 0;

  // little ad rectangles pop up over her phone as the VO asks you to count them
  const adPop = Math.max(0, Math.min(7, Math.floor((frame - F.count) / 16)));

  return (
    <>
      <Floor stage={stage} at={6} heightFraction={0.22} kind="floor" />

      {/* ── Lucky ── */}
      <div style={{ opacity: stage.exit(frame) }}>
        <Lucky
          pose={frame >= F.shrug ? "shrug" : "showPhone"}
          expression="curious"
          facing={1}
          height={luckyH}
          centerX={WIDTH * 0.28}
          baseline={groundY}
          entry="L"
          entryFrame={F.lucky}
          cycleSeconds={3}
        />
      </div>

      {/* ── ads she's already seen today, piling up in the air beside her ── */}
      {frame >= F.count - 4 && frame < F.field + 30 && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: interpolate(frame, [F.count - 4, F.count + 8, F.field + 6, F.field + 26], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {Array.from({ length: adPop }).map((_, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const bx = WIDTH * 0.42 + col * 92;
            const by = groundY - luckyH * 0.7 - row * 58 + Math.sin((frame + i * 20) * 0.05) * 3;
            const pop = interpolate(frame, [F.count + i * 15, F.count + i * 15 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
            if (pop <= 0.01) return null;
            return (
              <g key={i} transform={`translate(${bx} ${by}) rotate(${(i % 2 ? 1 : -1) * 4}) scale(${pop})`} opacity={pop}>
                <rect x={0} y={0} width={80} height={50} fill={i % 3 === 0 ? COLOR.orange : COLOR.grey} stroke={COLOR.ink} strokeWidth={2} />
                <text x={40} y={31} textAnchor="middle" fontFamily={FONT.mono} fontSize={13} fill={COLOR.cardWhite}>AD</text>
              </g>
            );
          })}
        </svg>
      )}

      {/* ── the comment field ── */}
      {frame >= F.field - 8 && (
        <div
          style={{
            position: "absolute",
            left: WIDTH * 0.5,
            top: HEIGHT * 0.34,
            width: WIDTH * 0.4,
            background: COLOR.cardWhite,
            border: `3px solid ${COLOR.ink}`,
            padding: "26px 30px",
            opacity: safeRamp(frame, [F.field, F.field + 16, dur - 20, dur - 6]),
            translate: `${(1 - Math.min(1, interpolate(frame, [F.field, F.field + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut }))) * 40}px 0px`,
          }}
        >
          <div style={{ fontFamily: FONT.mono, fontSize: 20, letterSpacing: "0.06em", color: COLOR.grey }}>ADD A COMMENT</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 34, color: COLOR.ink, marginTop: 12 }}>
            ads before I put the phone down:{" "}
            <span style={{ color: COLOR.orange }}>___</span>
            <span style={{ opacity: cursorBlink ? 1 : 0.15 }}>▍</span>
          </div>
        </div>
      )}

      {/* peak line */}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.72, textAlign: "center", fontFamily: FONT.hero, fontSize: 52, color: COLOR.ink, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 14, dur - 4]) }}>
          MOST PEOPLE ARE LOW <span style={{ color: COLOR.orange }}>BY ABOUT HALF.</span>
        </div>
      )}
    </>
  );
};
