import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { ProfileCard } from "../ProfileCard";
import { Bloom } from "../../parts/Bloom";
import { EASE } from "../../parts/motion";
import { Floor } from "../scene";
import { useStage, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B09 — why the gap. MEDIUM · 987 f (32.9 s). ProfileCard debut.
 * Empty → two profile cards, one sparse ("someone / somewhere", cheap), one that
 * fills line by line (woman · 30s · near a pharmacy · baby-care app) with the
 * price meter climbing → "location exact, history long" → the vague card points
 * at YOU: "cheaper for the advertiser, better for you" → empty.
 * Peak: the rich meter maxing — whisper "long" @ f795.
 */
export const B09: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Targeted vs. contextual pricing — programmatic buying literature">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 30, holdFrames: 14 });
  const vo = useBeatTiming("B09");

  const F = {
    frames: vo.at("gap", 16),
    targeting: vo.at("target", 110),
    cards: vo.at("richer", 296) - 90,
    right: vo.at("richer", 296),
    left: vo.at("someone", 567),
    locexact: vo.at("location", 710),
    histlong: vo.at("history", 776),
    peak: vo.at("long", 795),
    better: vo.at("vague", 817),
  };

  const cardH = 560;
  const cardY = HEIGHT * 0.18;
  const leftX = WIDTH * 0.09;
  const rightX = WIDTH * 0.52;
  const cardW = 460;

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.24} kind="desk" />

      <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.08, textAlign: "center", fontFamily: FONT.hero, fontSize: 46, color: COLOR.ink, opacity: interpolate(frame, [F.frames, F.frames + 14, F.peak, F.peak + 30], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        SAME VIEW. DIFFERENT PRICE.
      </div>

      {/* TARGETING stamp between the cards */}
      {frame >= F.targeting - 4 && frame < F.left + 30 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.5, textAlign: "center", fontFamily: FONT.hero, fontSize: 40, color: COLOR.orange, letterSpacing: "0.06em", opacity: interpolate(frame, [F.targeting, F.targeting + 10, F.right, F.right + 20], [0, 1, 1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), scale: String(pulse(frame, F.targeting, 0.14, 16)) }}>
          ↕ TARGETING
          <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 20, color: COLOR.grey }}>a richer description costs the advertiser more</div>
        </div>
      )}

      <div style={{ opacity: stage.exit(frame) }}>
        <ProfileCard
          x={leftX}
          y={cardY}
          w={cardW}
          h={cardH}
          title="A VAGUE YOU"
          fields={["someone", "somewhere"]}
          meterFrom={0.06}
          meterTo={0.12}
          at={F.cards}
          perFieldFrames={70}
        />
        <ProfileCard
          x={rightX}
          y={cardY}
          w={cardW}
          h={cardH}
          title="A RICH YOU"
          fields={["a woman, 30s", "near a pharmacy", "opened a baby-care app", "…last week"]}
          meterFrom={0.1}
          meterTo={1.0}
          at={F.right}
          perFieldFrames={82}
          accent
        />
      </div>

      {/* "location exact · history long" — the two levers the buyers pull */}
      {frame >= F.locexact - 6 && frame < F.better + 10 && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: interpolate(frame, [F.locexact, F.locexact + 12, F.better, F.better + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {[
            { at: F.locexact, y: cardY + cardH * 0.42, tag: "LOCATION: EXACT" },
            { at: F.histlong, y: cardY + cardH * 0.6, tag: "HISTORY: LONG" },
          ].map((r, i) => {
            const on = interpolate(frame, [r.at, r.at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
            if (on <= 0.01) return null;
            return (
              <g key={i} opacity={Math.min(1, on)}>
                <line x1={rightX + cardW + 10} y1={r.y} x2={rightX + cardW + 40 + on * 30} y2={r.y} stroke={COLOR.orange} strokeWidth={3} />
                <rect x={rightX + cardW + 70} y={r.y - 20} width={260} height={40} fill={COLOR.ink} />
                <text x={rightX + cardW + 84} y={r.y + 6} fontFamily={FONT.mono} fontSize={17} letterSpacing="0.06em" fill={COLOR.cardWhite}>{r.tag}</text>
              </g>
            );
          })}
        </svg>
      )}

      <Bloom window={[F.peak - 6, F.peak + 10, F.peak + 60, F.peak + 90]} radius={230} x={`${((rightX + cardW - 40) / WIDTH) * 100}%`} y={`${((cardY + cardH * 0.5) / HEIGHT) * 100}%`} intensity={0.7} />

      {/* "better for you" — arrow from the vague card to YOU */}
      {frame >= F.better && (
        <>
          <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: safeRamp(frame, [F.better, F.better + 16, dur - 20, dur - 6]) }}>
            <path
              d={`M ${leftX + cardW * 0.5} ${cardY + cardH + 20} C ${leftX + cardW * 0.5} ${cardY + cardH + 120}, ${WIDTH * 0.34} ${HEIGHT * 0.86}, ${WIDTH * 0.42} ${HEIGHT * 0.86}`}
              fill="none"
              stroke={COLOR.orange}
              strokeWidth={4}
              strokeDashoffset={interpolate(frame, [F.better, F.better + 24], [400, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })}
              strokeDasharray="400 400"
              pathLength={400}
            />
          </svg>
          <div style={{ position: "absolute", left: WIDTH * 0.43, top: HEIGHT * 0.82, fontFamily: FONT.hero, fontSize: 44, color: COLOR.ink, opacity: safeRamp(frame, [F.better + 14, F.better + 28, dur - 18, dur - 6]) }}>
            CHEAPER FOR THEM.
            <br />
            <span style={{ color: COLOR.orange }}>BETTER FOR YOU.</span>
          </div>
        </>
      )}
    </>
  );
};
