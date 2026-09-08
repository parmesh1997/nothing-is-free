import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { Gavel } from "../shapes";
import { Floor } from "../scene";
import { useStage, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B23 — the ruling. MEDIUM · 935 f (31.2 s).
 * Empty → a gavel drops, "APRIL 2025" → "PUBLISHER AD SERVER" takes a MONOPOLY
 * stamp → "AD EXCHANGE" takes a MONOPOLY stamp → a MARKETPLACE / SELLER / BUYER
 * triangle collapses onto one name → "against the law" → empty.
 * Peak: "against the law" — whisper "law" @ f924.
 */
export const B23: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="US v. Google (EDVA) — liability ruling, 17 Apr 2025">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 28, holdFrames: 14 });
  const vo = useBeatTiming("B23");

  const F = {
    gavel: vo.at("sued", 80),
    date: vo.at("april", 123),
    judge: vo.at("judge", 238),
    ruled: vo.at("ruled", 258),
    monopoly: vo.at("monopoly", 344),
    twoParts: vo.at("two", 374),
    box1: vo.at("publishers", 482),
    box2: vo.at("exchange", 592),
    triangle: vo.at("marketplace", 711),
    threeAtOnce: vo.at("time", 836),
    peak: vo.at("law", 924),
  };

  const gavelDrop = springIn({ frame, fps: 30, delay: F.gavel, durationInFrames: 18 });
  const gavelBounce = pulse(frame, F.date, 0.08, 14);

  const box = (bx: number, at: number, label: string) => {
    const on = springIn({ frame, fps: 30, delay: at, durationInFrames: 16 });
    if (on <= 0.01) return null;
    const stamp = interpolate(frame, [at + 24, at + 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <div style={{ position: "absolute", left: bx, top: HEIGHT * 0.34, width: 480, height: 180, background: COLOR.cardWhite, border: `3px solid ${COLOR.ink}`, opacity: Math.min(1, on) * stage.exit(frame), translate: `${(1 - Math.min(1, on)) * (bx < WIDTH / 2 ? -60 : 60)}px 0px` }}>
        <span style={{ position: "absolute", left: 26, top: 22, fontFamily: FONT.mono, fontSize: 16, letterSpacing: "0.08em", color: COLOR.grey }}>GOOGLE OWNS</span>
        <span style={{ position: "absolute", left: 26, top: 54, fontFamily: FONT.hero, fontSize: 40, color: COLOR.ink }}>{label}</span>
        {stamp > 0 && (
          <div style={{ position: "absolute", right: -30, bottom: -24, scale: String(interpolate(stamp, [0, 1], [2.4, 1])), rotate: "-11deg", opacity: stamp }}>
            <span style={{ fontFamily: FONT.hero, fontSize: 52, color: COLOR.orange, border: `5px solid ${COLOR.orange}`, padding: "4px 18px", background: COLOR.cardWhite }}>MONOPOLY</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.24} kind="floor" />

      {/* ── the gavel ── */}
      <div style={{ position: "absolute", left: WIDTH * 0.5 - 165, top: HEIGHT * 0.015, width: 330, height: 232, opacity: stage.present(frame, F.gavel, 16), translate: `0px ${(1 - Math.min(1, gavelDrop)) * -140}px`, scale: String(gavelBounce), transformOrigin: "50% 100%" }}>
        <FlatFigure shape={Gavel} w={330} h={232} />
      </div>
      {frame >= F.date - 6 && frame < F.monopoly && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.28, textAlign: "center", fontFamily: FONT.hero, fontSize: 40, color: COLOR.ink, opacity: interpolate(frame, [F.date, F.date + 12, F.monopoly - 14, F.monopoly - 2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: String(gavelBounce) }}>
          <span>APRIL 2025</span>
          {frame >= F.judge && <span style={{ opacity: interpolate(frame, [F.judge, F.judge + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}> · A US FEDERAL JUDGE</span>}
          {frame >= F.ruled && <span style={{ color: COLOR.orange, opacity: interpolate(frame, [F.ruled, F.ruled + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}> RULED:</span>}
        </div>
      )}

      {/* the ruling: "ILLEGAL MONOPOLY" slams, then "over two parts" */}
      {frame >= F.monopoly - 6 && frame < F.box1 + 20 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.28, textAlign: "center", opacity: interpolate(frame, [F.monopoly, F.monopoly + 10, F.box1, F.box1 + 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 96, color: COLOR.orange, letterSpacing: "0.02em", scale: String(interpolate(frame, [F.monopoly, F.monopoly + 10], [2.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })) }}>
            ILLEGAL MONOPOLY
          </div>
          {frame >= F.twoParts && (
            <div style={{ fontFamily: FONT.hero, fontSize: 40, color: COLOR.ink, marginTop: 8, opacity: interpolate(frame, [F.twoParts, F.twoParts + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              OVER TWO PARTS OF THE MACHINE — AT ONCE
            </div>
          )}
        </div>
      )}

      {box(WIDTH * 0.06, F.box1, "PUBLISHER AD SERVER")}
      {box(WIDTH * 0.55, F.box2, "AD EXCHANGE")}

      {/* ── the triangle collapsing ── */}
      {frame >= F.triangle - 6 && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: safeRamp(frame, [F.triangle, F.triangle + 16, dur - 16, dur - 4]) }}>
          {(() => {
            const cx = WIDTH * 0.5;
            const cy = HEIGHT * 0.62;
            const collapse = interpolate(frame, [F.triangle + 40, F.triangle + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
            const pts = [
              { x: cx, y: cy - 120, l: "MARKETPLACE" },
              { x: cx - 160, y: cy + 90, l: "BIGGEST SELLER" },
              { x: cx + 160, y: cy + 90, l: "BIGGEST BUYER" },
            ];
            return (
              <>
                {pts.map((p, i) => {
                  const px = p.x + (cx - p.x) * collapse;
                  const py = p.y + (cy - p.y) * collapse;
                  const next = pts[(i + 1) % 3];
                  const nx = next.x + (cx - next.x) * collapse;
                  const ny = next.y + (cy - next.y) * collapse;
                  return (
                    <g key={i}>
                      <line x1={px} y1={py} x2={nx} y2={ny} stroke={COLOR.ink} strokeWidth={3} />
                      <circle cx={px} cy={py} r={8} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={2} />
                      {collapse < 0.4 && <text x={p.x} y={p.y + (i === 0 ? -18 : 30)} textAnchor="middle" fontFamily={FONT.mono} fontSize={16} fill={COLOR.ink} opacity={1 - collapse * 2.5}>{p.l}</text>}
                    </g>
                  );
                })}
                {collapse > 0.7 && (
                  <text x={cx} y={cy + 8} textAnchor="middle" fontFamily={FONT.hero} fontSize={52} fill={COLOR.ink} opacity={(collapse - 0.7) / 0.3} style={{ transform: `scale(${pulse(frame, F.threeAtOnce, 0.06, 20)})`, transformOrigin: `${cx}px ${cy}px` }}>GOOGLE</text>
                )}
                {/* the three roles keep circling the one name */}
                {collapse >= 1 && ["MARKETPLACE", "BIGGEST SELLER", "BIGGEST BUYER"].map((l, k) => {
                  const a = (frame * 0.02) + (k / 3) * Math.PI * 2;
                  return (
                    <text key={k} x={cx + Math.cos(a) * 190} y={cy + Math.sin(a) * 92 + 5} textAnchor="middle" fontFamily={FONT.mono} fontSize={15} fill={COLOR.grey} opacity={0.9}>
                      {l}
                    </text>
                  );
                })}
              </>
            );
          })()}
        </svg>
      )}

      <Bloom window={[F.peak - 4, F.peak + 12, dur - 24, dur - 8]} radius={280} x="50%" y="60%" intensity={0.6} />

      {/* peak line */}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.84, textAlign: "center", fontFamily: FONT.hero, fontSize: 52, color: COLOR.ink, opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 14, dur - 4]) }}>
          ALL THREE AT ONCE — <span style={{ color: COLOR.orange }}>AGAINST THE LAW.</span>
        </div>
      )}
    </>
  );
};
