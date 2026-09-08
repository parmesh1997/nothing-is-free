import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { Lucky } from "../../characters";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { useBeatTiming } from "../timing";
import { V3Beat } from "../v3/V3Beat";
import { Street, Walker, STREET_HORIZON, STREET_GROUND } from "../v3/sets";
import { useStage3, bump, cyc } from "../v3/stage3";
import { V3 } from "../v3/palette";

/**
 * NIF002 B00 — v3 (2026-09-03 pivot: Infographics Show + Vox).
 * The street where free apps live. Lucky walks in with her phone; "NOTHING IS
 * FREE." drops from the top; the claim slides up; on "auction" the whole street
 * fires a rack of bid-paddles. Camera pushes in. No fades — everything slides.
 * Peak: "auction".
 */
export const B00v3: React.FC<BeatProps> = (props) => {
  const dur = props.durationInFrames;
  const vo = useBeatTiming("B00");
  const F = {
    title: 6,
    walkIn: 12,
    clause: vo.at("and", 62),
    charged: vo.at("charged", 121),
    auction: vo.at("auction", 204),
    tail: vo.at("second", 239),
  };
  return (
    <V3Beat
      props={props}
      beat="B00"
      set={<Street />}
      cam={[
        { at: 0, zoom: 1.0, y: -8 },
        { at: F.auction, zoom: 1.1, y: 16 },
        { at: dur, zoom: 1.16, y: 22 },
      ]}
    >
      <Content dur={dur} F={F} />
    </V3Beat>
  );
};

const Content: React.FC<{ dur: number; F: Record<string, number> }> = ({ dur, F }) => {
  const frame = useCurrentFrame();
  const s = useStage3(dur, { disperseFrames: 22, holdFrames: 6 });

  const ground = STREET_GROUND;
  const luckyH = Math.round(HEIGHT * 0.44);
  // Lucky enters from the left, walks to just left of centre, then keeps going on the cut
  const luckyX = interpolate(frame, [F.walkIn, F.walkIn + 116, s.disperseAt, dur], [WIDTH * 0.02, WIDTH * 0.36, WIDTH * 0.36, WIDTH * 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  const walking = (frame < F.walkIn + 112 || frame >= s.disperseAt) && !s.dispersed(frame);

  const titleY = interpolate(springIn({ frame, fps: 30, delay: F.title, durationInFrames: 20 }), [0, 1], [-360, 0], { extrapolateRight: "clamp" });
  const titleOut = interpolate(frame, [s.disperseAt, s.disperseAt + 26], [0, -420], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });

  const claim = s.slide(frame, F.clause, "bottom", 20);

  return (
    <>
      {/* background pedestrians on the pavement behind Lucky */}
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
        <Walker x={WIDTH * 0.12 + cyc(frame, 700) * WIDTH * 0.28} baseline={STREET_HORIZON + 66} h={HEIGHT * 0.15} facing={1} stride={28} tone={V3.bldgB} phase={0.1} />
        <Walker x={WIDTH * 0.9 - cyc(frame, 820) * WIDTH * 0.3} baseline={STREET_HORIZON + 92} h={HEIGHT * 0.17} facing={-1} stride={32} tone="#5e5346" phase={0.55} />
      </svg>

      {/* ── Lucky on the pavement ── */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Lucky
          pose={walking ? "walk" : "showPhone"}
          expression="curious"
          facing={1}
          height={luckyH}
          centerX={luckyX}
          baseline={ground}
          cycleSeconds={walking ? 0.9 : 3}
          phoneScreen={COLOR.orange}
        />
        {/* "$0.00" charged — pops from her phone on the word */}
        {frame >= F.charged - 6 && frame < F.auction + 10 && (
          <div
            style={{
              position: "absolute",
              left: luckyX + luckyH * 0.28,
              top: ground - luckyH * 0.72,
              padding: "8px 16px",
              background: COLOR.cardWhite,
              border: `3px solid ${V3.ink}`,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 26,
              color: V3.ink,
              opacity: interpolate(frame, [F.charged, F.charged + 10, F.auction, F.auction + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: `0px ${(1 - Math.min(1, springIn({ frame, fps: 30, delay: F.charged, durationInFrames: 14 }))) * 24}px`,
              scale: String(bump(frame, F.charged + 4, 0.14, 18)),
            }}
          >
            CHARGED: <span style={{ color: V3.accent }}>$0.00</span>
          </div>
        )}
        {/* phone flare on the auction peak */}
        {frame >= F.auction - 6 && (
          <Bloom window={[F.auction - 4, F.auction + 10, F.auction + 40, F.auction + 64]} radius={luckyH * 0.8} x={`${((luckyX + luckyH * 0.18) / WIDTH) * 100}%`} y={`${((ground - luckyH * 0.5) / HEIGHT) * 100}%`} intensity={0.9} />
        )}
      </div>

      {/* ── the rack of bid-paddles firing along the street on "auction" ── */}
      {frame >= F.auction - 8 && (
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* dust burst behind the paddles */}
          {Array.from({ length: 28 }).map((_, i) => {
            const a = (i / 28) * Math.PI * 2;
            const t = interpolate(frame, [F.auction, F.auction + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const r = t * (160 + (i % 5) * 40);
            return <rect key={`d${i}`} x={WIDTH * 0.5 + Math.cos(a) * r} y={STREET_HORIZON - 20 + Math.sin(a) * r * 0.5} width={7} height={7} fill={i % 3 === 0 ? V3.accent : COLOR.cardWhite} opacity={(1 - t) * 0.7} transform={`rotate(${t * 120} ${WIDTH * 0.5} ${STREET_HORIZON})`} />;
          })}
          {Array.from({ length: 11 }).map((_, i) => {
            const x = WIDTH * (0.12 + (i / 10) * 0.76);
            const at = F.auction + i * 2;
            const rise = springIn({ frame, fps: 30, delay: at, durationInFrames: 16 });
            if (rise <= 0.02) return null;
            const baseY = STREET_HORIZON - 10 + Math.sin(i * 1.7) * 18;
            const up = Math.min(1.1, rise) * (150 + Math.sin(i) * 30);
            const wob = Math.sin((frame - at) * 0.28) * 6 * Math.max(0, 1 - (frame - at) / 60);
            const retract = s.dispersed(frame) ? 1 : interpolate(frame, [s.disperseAt, s.disperseAt + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const win = i === 5;
            return (
              <g key={i} transform={`translate(${x} ${baseY - up + retract * up}) rotate(${wob})`} opacity={Math.min(1, rise)}>
                <rect x={-4} y={0} width={9} height={86} fill={V3.ink} />
                <rect x={-30} y={-40} width={60} height={46} rx={7} fill={win ? V3.accent : COLOR.cardWhite} stroke={V3.ink} strokeWidth={3.5} />
                <text x={0} y={-10} textAnchor="middle" fontFamily={FONT.mono} fontWeight={700} fontSize={17} fill={win ? COLOR.cardWhite : V3.ink}>BID</text>
              </g>
            );
          })}
        </svg>
      )}

      {/* ── NOTHING IS FREE. — drops from the top ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: HEIGHT * 0.05,
          transform: `translateY(${titleY + titleOut}px)`,
        }}
      >
        {/* soft scrim so the type reads over the skyline */}
        <div style={{ position: "absolute", left: 0, right: 0, top: -60, height: 420, background: "linear-gradient(180deg, rgba(20,18,16,0.5), rgba(20,18,16,0))" }} />
        <div style={{ position: "relative", paddingLeft: WIDTH * 0.08, fontFamily: FONT.hero, fontSize: 216, lineHeight: 0.84, color: COLOR.cardWhite, letterSpacing: "0.01em", textShadow: "0 8px 26px rgba(0,0,0,0.45)" }}>
          NOTHING
          <br />
          IS FREE.
        </div>
      </div>

      {/* ── the claim — slides up from the bottom band ── */}
      {frame >= F.clause - 8 && (
        <div
          style={{
            position: "absolute",
            left: WIDTH * 0.5 - 640,
            top: HEIGHT * 0.72,
            width: 1280,
            padding: "22px 34px",
            background: "rgba(20,18,16,0.72)",
            backdropFilter: "blur(2px)",
            opacity: claim.opacity,
            translate: claim.translate,
          }}
        >
          <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 42, lineHeight: 1.28, color: COLOR.cardWhite, textAlign: "center" }}>
            And the app that just charged you nothing ran an{" "}
            <span style={{ color: V3.accent, display: "inline-block", scale: String(bump(frame, F.auction, 0.16, 20)) }}>auction</span>{" "}
            the second you opened it.
          </div>
        </div>
      )}
    </>
  );
};
