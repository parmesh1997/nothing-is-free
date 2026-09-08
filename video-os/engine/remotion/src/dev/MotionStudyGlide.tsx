import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
} from "remotion";
import { COLOR, WIDTH, HEIGHT } from "../tokens";
import { GlideScene, GlideCard, GlideIn, Layer } from "../motion/glide";

/**
 * MotionStudyGlide — a dev study of the **Glide** motion register (the
 * cinematic one), in NIF's own visual language: cream field, line-art, one
 * orange accent, the two fonts. Nothing here is a real beat — it exists so the
 * creator can sign off the *feel* (continuous camera, parallax, soft
 * transitions, held float) before Glide touches a NIF004 beat.
 *
 * 16s / 480f. Two scenes with a soft cross-dissolve, no hard cut:
 *   0–270   "the meter" on cream — push in, cards glide in over a parallax mid
 *           plane, a pin draws on, everything floats
 *   250–480 cross-dissolves to the ink field — the same pin, the reversal tone
 */

export const MOTION_STUDY_GLIDE_TOTAL = 480;

const SANS = '"Inter", system-ui, sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, monospace';

// ── shared line-art bits ─────────────────────────────────────────────────────

const FaintGrid: React.FC<{ tone?: "paper" | "ink" }> = ({ tone = "paper" }) => {
  const stroke = tone === "ink" ? "rgba(246,242,231,0.10)" : COLOR.grid;
  const lines: React.ReactNode[] = [];
  for (let x = 0; x <= WIDTH; x += 60)
    lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={HEIGHT} stroke={stroke} strokeWidth={1.2} />);
  for (let y = 0; y <= HEIGHT; y += 60)
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={WIDTH} y2={y} stroke={stroke} strokeWidth={1.2} />);
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
      {lines}
      <line x1={0} y1={HEIGHT * 0.66} x2={WIDTH} y2={HEIGHT * 0.66} stroke={tone === "ink" ? "rgba(246,242,231,0.18)" : COLOR.ground} strokeWidth={2} />
    </svg>
  );
};

const Skyline: React.FC = () => (
  <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    {[
      [180, 0.30, 0.20], [430, 0.44, 0.34], [1430, 0.38, 0.26], [1700, 0.52, 0.40],
    ].map(([x, h, o], i) => (
      <rect
        key={i}
        x={x}
        y={HEIGHT * 0.66 - HEIGHT * h}
        width={150}
        height={HEIGHT * h}
        fill="none"
        stroke={COLOR.ink}
        strokeOpacity={o}
        strokeWidth={2.5}
      />
    ))}
  </svg>
);

/** a line-art map pin that draws on, fills orange, then pulses. */
const Pin: React.FC<{ at: number; cx?: number; cy?: number; scale?: number }> = ({ at, cx = WIDTH / 2, cy = HEIGHT * 0.58, scale = 1 }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at, at + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const filled = draw > 0.99;
  const pulse = filled ? 1 + Math.sin((frame - at) / 11) * 0.05 : 1;
  const d = "M 0 90 C -84 -6 -84 -128 0 -128 C 84 -128 84 -6 0 90 Z";
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(${cx} ${cy}) scale(${scale * pulse})`} style={{ filter: "drop-shadow(0 18px 30px rgba(52,36,20,0.22))" }}>
        <path
          d={d}
          fill={filled ? COLOR.orange : "none"}
          stroke={COLOR.ink}
          strokeWidth={8}
          strokeDasharray={620}
          strokeDashoffset={620 * (1 - draw)}
        />
        {filled && <circle cx={0} cy={-74} r={30} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={7} />}
      </g>
    </svg>
  );
};

/** a meter dial with a ticking needle — "the meter is always running". */
const MeterDial: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const a = -120 + ((frame * 1.6) % 240);
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(${x} ${y})`} style={{ filter: "drop-shadow(0 14px 26px rgba(52,36,20,0.2))" }}>
        <circle r={96} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={6} />
        {Array.from({ length: 9 }).map((_, i) => {
          const t = (-120 + i * 30) * (Math.PI / 180);
          return <line key={i} x1={Math.cos(t) * 72} y1={Math.sin(t) * 72} x2={Math.cos(t) * 86} y2={Math.sin(t) * 86} stroke={COLOR.ink} strokeWidth={4} />;
        })}
        <line x1={0} y1={0} x2={Math.cos(a * (Math.PI / 180)) * 68} y2={Math.sin(a * (Math.PI / 180)) * 68} stroke={COLOR.orange} strokeWidth={6} strokeLinecap="round" />
        <circle r={8} fill={COLOR.ink} />
        <text y={132} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing="0.14em" fill={COLOR.grey}>METER</text>
      </g>
    </svg>
  );
};

const Card: React.FC<{ eyebrow: string; value: string; sub?: string; ink?: boolean }> = ({ eyebrow, value, sub, ink }) => (
  <div
    style={{
      background: ink ? "#1c1c1c" : COLOR.cardWhite,
      border: `5px solid ${ink ? COLOR.orange : COLOR.ink}`,
      borderRadius: 22,
      padding: "34px 42px",
      textAlign: "left",
    }}
  >
    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.1em", textTransform: "uppercase", color: ink ? "#F6F2E7" : COLOR.grey }}>{eyebrow}</div>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 128, lineHeight: 1, color: COLOR.orange, marginTop: 6 }}>{value}</div>
    {sub && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: ink ? "#cfc9bd" : COLOR.ink, marginTop: 10 }}>{sub}</div>}
  </div>
);

// ── the study ────────────────────────────────────────────────────────────────

const SceneMeter: React.FC = () => (
  <GlideScene push="in" spanFrames={280} tone="paper">
    <Layer plane="background"><FaintGrid /></Layer>
    <Layer plane="deepMid"><Skyline /></Layer>
    <Layer plane="midground">
      <GlideCard at={26} out={200} x={470} y={190} w={560} seed={0}>
        <Card eyebrow="every app pays" value="$7" sub="per 1,000 map loads" />
      </GlideCard>
      <GlideCard at={68} out={200} x={1420} y={430} w={600} seed={1.7} glow>
        <Card eyebrow="the map earns" value="$11B" sub="a year, no price tag" />
      </GlideCard>
      <GlideCard at={224} x={960} y={250} w={720} seed={0.9} glow>
        <Card eyebrow="one free map" value="3 meters" sub="apps  ·  businesses  ·  you" />
      </GlideCard>
    </Layer>
    <Layer plane="subject"><Pin at={112} cx={WIDTH / 2} cy={HEIGHT * 0.62} scale={0.82} /></Layer>
    <Layer plane="foreground">
      <GlideIn at={16}><MeterDial x={WIDTH - 230} y={HEIGHT - 250} /></GlideIn>
      <div style={{ position: "absolute", left: 44, bottom: 40, fontFamily: MONO, fontSize: 18, letterSpacing: "0.16em", color: COLOR.grey, opacity: 0.55 }}>
        MOTION STUDY · GLIDE
      </div>
    </Layer>
  </GlideScene>
);

const SceneInk: React.FC = () => (
  <AbsoluteFill style={{ background: "#141414" }}>
    <GlideScene push="out" spanFrames={236} tone="ink">
      <Layer plane="background"><FaintGrid tone="ink" /></Layer>
      <Layer plane="subject"><Pin at={6} cx={WIDTH / 2} cy={HEIGHT * 0.44} scale={0.9} /></Layer>
      <Layer plane="midground">
        <GlideCard at={22} x={960} y={620} w={780} seed={0.3} tone="ink" glow>
          <Card eyebrow="the reading" value="YOU" sub="nobody showed you the window" ink />
        </GlideCard>
      </Layer>
    </GlideScene>
  </AbsoluteFill>
);

export const MotionStudyGlide: React.FC = () => {
  const frame = useCurrentFrame();
  // soft cross-dissolve, 250 → 285 (no hard cut)
  const toInk = interpolate(frame, [250, 286], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: COLOR.paper }}>
      <AbsoluteFill style={{ opacity: 1 - toInk }}>
        <Sequence durationInFrames={300}><SceneMeter /></Sequence>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: toInk }}>
        <Sequence from={244}><SceneInk /></Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
