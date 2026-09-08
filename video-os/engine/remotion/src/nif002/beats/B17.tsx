import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { EASE, springIn } from "../../parts/motion";
import { Floor } from "../scene";
import { useStage, loop, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B17 — mid-tease. REST · 553 f (18.4 s).
 * The chain lights, each box a verb → each verb box ticks "✓ does something" →
 * a fourth box drops below, dashed to all, staying dark → its "?" pulses → an
 * eye opens on it, everything dims toward it.
 * Peak: "not who you would think to blame" — whisper "blame" @ f530.
 */
export const B17: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Programmatic auction participants — mechanism">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const VERBS = ["BUYS", "SELLS", "ROUTES"];
const DOES = ["✓ places the bid", "✓ lists the space", "✓ moves the request"];

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 22, holdFrames: 10 });
  const vo = useBeatTiming("B17");

  const F = {
    chain: vo.at("chain", 61),
    buys: vo.at("buys", 160),
    sells: vo.at("sells", 186),
    routes: vo.at("routes", 208),
    group: vo.at("group", 266),
    notbuy: vo.at("buying", 342),
    eye: vo.at("reading", 434),
    peak: vo.at("blame", 530),
  };
  const verbAt = [F.buys, F.sells, F.routes];

  const boxW = 300;
  const boxH = 120;
  const gap = 70;
  const chainW = VERBS.length * boxW + (VERBS.length - 1) * gap;
  const chainX = (WIDTH - chainW) / 2;
  const chainY = HEIGHT * 0.22;
  const hubX = WIDTH / 2 - boxW / 2;
  const hubY = HEIGHT * 0.56;

  const eyeOpen = interpolate(frame, [F.eye, F.eye + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const dimAll = interpolate(frame, [F.eye, F.eye + 26], [1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <Floor stage={stage} at={4} heightFraction={0.24} kind="floor" />

      <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: stage.exit(frame) }}>
        {VERBS.map((v, i) => {
          const bx = chainX + i * (boxW + gap);
          const at = verbAt[i];
          const on = springIn({ frame, fps: 30, delay: at, durationInFrames: 14 });
          if (on <= 0.02) return null;
          const tick = interpolate(frame, [at + 18, at + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g key={i} opacity={Math.min(1, on) * dimAll}>
              <rect x={bx} y={chainY} width={boxW} height={boxH} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={3} />
              <text x={bx + boxW / 2} y={chainY + boxH / 2 + 4} textAnchor="middle" fontFamily={FONT.hero} fontSize={46} fill={COLOR.ink}>{v}</text>
              {tick > 0 && <text x={bx + boxW / 2} y={chainY + boxH - 14} textAnchor="middle" fontFamily={FONT.mono} fontSize={15} fill={COLOR.grey} opacity={tick}>{DOES[i]}</text>}
              {i < VERBS.length - 1 && <line x1={bx + boxW} y1={chainY + boxH / 2} x2={bx + boxW + gap} y2={chainY + boxH / 2} stroke={COLOR.ink} strokeWidth={3} opacity={interpolate(frame, [at + 10, at + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
              {frame >= F.group && (
                <line x1={bx + boxW / 2} y1={chainY + boxH} x2={hubX + boxW / 2} y2={hubY} stroke={COLOR.grey} strokeWidth={2} strokeDasharray="7 7" opacity={interpolate(frame, [F.group + i * 8, F.group + i * 8 + 16], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * dimAll} />
              )}
            </g>
          );
        })}

        {/* the hidden hub */}
        {frame >= F.group && (
          <g opacity={springIn({ frame, fps: 30, delay: F.group, durationInFrames: 16 })}>
            <rect x={hubX} y={hubY} width={boxW} height={boxH} fill={COLOR.ink} scale={String(pulse(frame, F.peak, 0.05, 20))} />
            {frame >= F.notbuy && frame < F.eye && (
              <text x={hubX + boxW / 2} y={hubY + boxH / 2 + 6} textAnchor="middle" fontFamily={FONT.mono} fontSize={17} fill={COLOR.cardWhite} opacity={interpolate(frame, [F.notbuy, F.notbuy + 12], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                doesn't buy · doesn't sell
              </text>
            )}
            {eyeOpen > 0 && (
              <g transform={`translate(${hubX + boxW / 2} ${hubY + boxH / 2})`}>
                <ellipse cx={0} cy={0} rx={42} ry={22 * eyeOpen} fill={COLOR.cardWhite} />
                <circle cx={0} cy={0} r={13 * eyeOpen} fill={COLOR.orange} />
                {/* the pupil drifts — always alive */}
                <circle cx={Math.sin(loop(frame, 90) * Math.PI * 2) * 8} cy={0} r={6 * eyeOpen} fill={COLOR.ink} />
              </g>
            )}
            <text x={hubX + boxW / 2} y={hubY - 18} textAnchor="middle" fontFamily={FONT.hero} fontSize={46} fill={COLOR.ink} opacity={interpolate(frame, [F.group + 12, F.group + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (frame < F.eye ? 1 : 0.3)}>?</text>
          </g>
        )}
      </svg>

      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.8, textAlign: "center", fontFamily: FONT.hero, fontSize: 44, color: COLOR.ink, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 12, dur - 4]) }}>
          NOT BUYING AN AD. ONLY <span style={{ color: COLOR.orange }}>READING.</span>
        </div>
      )}
    </>
  );
};
