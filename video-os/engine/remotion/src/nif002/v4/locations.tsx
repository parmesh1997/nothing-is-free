import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, HEIGHT, SUPPORT, WIDTH, shade, softShadow, tint } from "../../tokens";

/**
 * locations.tsx — SET DRESSING, not built scenes (creator, 2026-09-03: "we don't
 * go with the locations… only if we will have one big background… if we want to
 * feel like it is the location, add drops or assets or a little bit of location
 * like a tree coming here and there").
 *
 * So each "location" is now 2–4 sparse props on the cream field, each grounded
 * with a warm shadow for depth, pulling saturated colour from the SUPPORT
 * palette. A few ambient touches (sway, a glow, one small pass-by) keep a held
 * frame alive without a full environment.
 *
 * `LOC_GROUND` is the y a (now small) figure's feet sit on.
 */

// figures stand here — lifted so a full figure + its shadow stay clear of the
// reserved text lane (creator: visuals in the top 80%, text in the bottom 20%).
export const LOC_GROUND = Math.round(HEIGHT * 0.74);

// a soft warm pool of shadow under the standing area — depth, not a floor
const GroundWash: React.FC<{ cx?: number; w?: number; reveal?: number }> = ({ cx = WIDTH * 0.5, w = WIDTH * 0.8, reveal = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: cx - w / 2,
      top: LOC_GROUND - 34,
      width: w,
      height: 120,
      background: `radial-gradient(62% 100% at 50% 0%, rgba(74,52,32,0.17) 0%, rgba(74,52,32,0.05) 46%, rgba(74,52,32,0) 74%)`,
      opacity: reveal,
      pointerEvents: "none",
    }}
  />
);

// warm key-light haze, top-left (the v4 light law), kept subtle
const KeyHaze: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(80% 70% at 12% -8%, rgba(255,244,216,0.55) 0%, rgba(255,244,216,0.12) 40%, rgba(255,244,216,0) 66%)`,
      pointerEvents: "none",
    }}
  />
);

const groundShadow = (cx: number, w: number, y = LOC_GROUND + 4) => (
  <ellipse cx={cx} cy={y} rx={w / 2} ry={Math.max(8, w * 0.06)} fill="rgba(58,40,24,0.18)" />
);

// ── a single tree, sitting a little off the frame edge but a real presence ────
const Tree: React.FC<{ x: number; scale?: number; seed?: number; reveal?: number }> = ({ x, scale = 1, seed = 0, reveal = 1 }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 44 + seed) * 2.2;
  const trunkH = 210 * scale;
  const top = LOC_GROUND - trunkH;
  return (
    <g opacity={reveal}>
      {groundShadow(x, 210 * scale)}
      <rect x={x - 16 * scale} y={top} width={32 * scale} height={trunkH} rx={7} fill={SUPPORT.clay} stroke={COLOR.ink} strokeWidth={3} />
      <g transform={`rotate(${sway} ${x} ${top})`}>
        <circle cx={x} cy={top - 128 * scale} r={140 * scale} fill={SUPPORT.forest} stroke={COLOR.ink} strokeWidth={3} />
        <circle cx={x - 92 * scale} cy={top - 76 * scale} r={96 * scale} fill={shade(SUPPORT.forest, 0.12)} stroke={COLOR.ink} strokeWidth={3} />
        <circle cx={x + 90 * scale} cy={top - 80 * scale} r={100 * scale} fill={tint(SUPPORT.forest, 0.1)} stroke={COLOR.ink} strokeWidth={3} />
      </g>
    </g>
  );
};

// ── a slab of building, a real presence at the frame edge ───────────────────
const BuildingEdge: React.FC<{ side: "l" | "r"; w: number; h: number; tone: string; reveal?: number }> = ({ side, w, h, tone, reveal = 1 }) => {
  const x = side === "l" ? -20 : WIDTH - w + 20;
  const top = LOC_GROUND - h;
  const cols = 3;
  const rows = Math.max(2, Math.floor(h / 165));
  const cw = (w - 40) / cols;
  return (
    <g opacity={reveal}>
      {groundShadow(x + w / 2, w * 1.05)}
      <rect x={x} y={top} width={w} height={h} fill={tone} stroke={COLOR.ink} strokeWidth={3} />
      <rect x={x - 8} y={top - 16} width={w + 16} height={18} fill={shade(tone, 0.16)} stroke={COLOR.ink} strokeWidth={3} />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const lit = (r * 2 + c + (side === "l" ? 0 : 1)) % 3 === 0;
          return (
            <rect
              key={`${r}-${c}`}
              x={x + 20 + c * (cw + 4)}
              y={top + 30 + r * 165}
              width={cw - 8}
              height={100}
              rx={4}
              fill={lit ? "#F8EFCC" : tint(tone, 0.5)}
              stroke={shade(tone, 0.2)}
              strokeWidth={2}
            />
          );
        }),
      )}
    </g>
  );
};

// ── Park — two trees + a bench + a low shrub mid-ground, grounded ────────────
export const Park: React.FC<{ reveal?: number }> = ({ reveal = 1 }) => {
  const frame = useCurrentFrame();
  const leaf = (frame % 240) / 240;
  const bird = (frame % 620) / 620;
  const shrubSway = Math.sin(frame / 50) * 1.4;
  return (
    <AbsoluteFill>
      <KeyHaze />
      {/* a soft grass band low in frame — a hint, not a full field */}
      <div style={{ position: "absolute", left: 0, right: 0, top: LOC_GROUND - 30, bottom: 0, background: `linear-gradient(180deg, ${tint(SUPPORT.forest, 0.72)} 0%, ${tint(SUPPORT.forest, 0.58)} 100%)`, opacity: reveal * 0.55 }} />
      <GroundWash reveal={reveal} />
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <Tree x={WIDTH * 0.11} scale={1.15} seed={0} reveal={reveal} />
        <Tree x={WIDTH * 0.9} scale={1.35} seed={2} reveal={reveal} />
        {/* bench, side-on, left of centre */}
        {(() => {
          const bx = WIDTH * 0.17;
          const seatY = LOC_GROUND - 66;
          return (
            <g opacity={reveal} style={{ filter: softShadow(1, 0.16) }}>
              {groundShadow(bx + 130, 320)}
              <rect x={bx} y={seatY} width={252} height={15} fill={SUPPORT.mustard} stroke={COLOR.ink} strokeWidth={3} />
              <rect x={bx + 8} y={seatY - 56} width={236} height={13} fill={SUPPORT.mustard} stroke={COLOR.ink} strokeWidth={3} />
              {[bx + 16, bx + 224].map((lx, i) => (
                <rect key={i} x={lx} y={seatY + 13} width={13} height={58} fill={COLOR.ink} />
              ))}
              {[bx + 16, bx + 224].map((lx, i) => (
                <rect key={`b${i}`} x={lx} y={seatY - 58} width={11} height={62} fill={COLOR.ink} />
              ))}
            </g>
          );
        })()}
        {/* a low shrub, mid-ground right — breaks the empty centre */}
        <g transform={`translate(${WIDTH * 0.62}, ${LOC_GROUND}) rotate(${shrubSway})`} opacity={reveal}>
          {groundShadow(0, 200, 6)}
          <path d="M -96 4 Q -104 -70 -44 -84 Q -20 -128 26 -104 Q 92 -112 96 -40 Q 108 6 40 6 Z" fill={SUPPORT.forest} stroke={COLOR.ink} strokeWidth={3} />
        </g>
        {/* one drifting leaf + a distant bird */}
        <circle cx={WIDTH * 0.5 + leaf * 140} cy={HEIGHT * 0.28 + leaf * 400 + Math.sin(leaf * 12) * 20} r={8} fill={SUPPORT.mustard} opacity={reveal * (1 - leaf) * 0.85} />
        <path d={`M ${WIDTH * (0.1 + bird * 0.8)} ${HEIGHT * 0.16 + Math.sin(bird * 20) * 10} q 12 -12 24 0 q 12 -12 24 0`} fill="none" stroke={COLOR.ink} strokeWidth={3} strokeLinecap="round" opacity={reveal * 0.5} />
      </svg>
    </AbsoluteFill>
  );
};

// ── Street — two building edges + a lamp + a bin, a distant car up the block ─
export const Street: React.FC<{ reveal?: number }> = ({ reveal = 1 }) => {
  const frame = useCurrentFrame();
  // the car passes on the road, low — in the Env layer, so it sits BEHIND the
  // figures and never collides with a title or a caption.
  const carY = LOC_GROUND - 24;
  const car = interpolate((frame % 420) / 420, [0, 1], [-WIDTH * 0.1, WIDTH * 1.1]);
  const carShow = frame % 420 < 260;
  return (
    <AbsoluteFill>
      <KeyHaze />
      {/* a warm pavement tone in the lower third — a hint, not a full road */}
      <div style={{ position: "absolute", left: 0, right: 0, top: LOC_GROUND - 6, bottom: 0, background: `linear-gradient(180deg, ${tint(SUPPORT.clay, 0.66)} 0%, ${tint(SUPPORT.clay, 0.52)} 100%)`, opacity: reveal * 0.55 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: LOC_GROUND - 8, height: 4, background: shade(SUPPORT.clay, 0.24), opacity: reveal * 0.4 }} />
      <GroundWash reveal={reveal} />
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <BuildingEdge side="l" w={430} h={HEIGHT * 0.46} tone={SUPPORT.clay} reveal={reveal} />
        <BuildingEdge side="r" w={470} h={HEIGHT * 0.54} tone="#C08F3A" reveal={reveal} />
        {/* a small car crossing the gap up the block, far back */}
        {carShow && (
          <g transform={`translate(${car}, ${carY})`} opacity={reveal * 0.85}>
            <path d="M 0 16 Q 5 3 24 1 L 60 1 Q 74 5 88 15 L 96 16 Q 100 21 94 28 L 5 28 Q -3 23 0 16 Z" fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={2.5} />
            <path d="M 22 3 L 55 3 L 63 15 L 18 15 Z" fill={tint(SUPPORT.sky, 0.4)} stroke={COLOR.ink} strokeWidth={2} />
            <circle cx={21} cy={28} r={7} fill={COLOR.ink} />
            <circle cx={75} cy={28} r={7} fill={COLOR.ink} />
          </g>
        )}
        {/* a trash bin, mid-ground left of centre — breaks the empty centre */}
        <g transform={`translate(${WIDTH * 0.4}, ${LOC_GROUND})`} opacity={reveal}>
          {groundShadow(0, 130, 4)}
          <path d="M -34 -96 L 34 -96 L 28 2 L -28 2 Z" fill={SUPPORT.teal} stroke={COLOR.ink} strokeWidth={3} />
          <rect x={-40} y={-108} width={80} height={16} rx={4} fill={shade(SUPPORT.teal, 0.16)} stroke={COLOR.ink} strokeWidth={3} />
          <line x1={-18} y1={-84} x2={-14} y2={-8} stroke={shade(SUPPORT.teal, 0.2)} strokeWidth={3} />
          <line x1={14} y1={-84} x2={10} y2={-8} stroke={shade(SUPPORT.teal, 0.2)} strokeWidth={3} />
        </g>
        {/* streetlamp, right foreground */}
        <g opacity={reveal} style={{ filter: softShadow(1, 0.14) }}>
          <line x1={WIDTH * 0.93} y1={LOC_GROUND + 16} x2={WIDTH * 0.93} y2={HEIGHT * 0.2} stroke={COLOR.ink} strokeWidth={9} strokeLinecap="round" />
          <path d={`M ${WIDTH * 0.93} ${HEIGHT * 0.2} q 0 -24 -40 -24`} fill="none" stroke={COLOR.ink} strokeWidth={9} />
          <ellipse cx={WIDTH * 0.93 - 46} cy={HEIGHT * 0.2 - 16} rx={16} ry={20} fill="#F6ECC9" stroke={COLOR.ink} strokeWidth={4} />
          <ellipse cx={WIDTH * 0.93 - 46} cy={HEIGHT * 0.2 + 30} rx={130} ry={100} fill="rgba(255,240,198,0.16)" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── Interior — a window + one key piece of furniture, grounded. `decor` picks it
export const Interior: React.FC<{
  decor?: "living" | "bedroom" | "dining" | "office" | "bare";
  reveal?: number;
}> = ({ decor = "bare", reveal = 1 }) => {
  const frame = useCurrentFrame();
  const curtain = Math.sin(frame / 52) * 6;
  const lamp = 0.84 + 0.16 * Math.abs(Math.sin(frame / 90));
  const winX = decor === "office" ? WIDTH * 0.1 : WIDTH * 0.68;
  const seatY = LOC_GROUND - 66;

  return (
    <AbsoluteFill>
      <KeyHaze />
      {/* a low warm floor wash + baseboard hint — the cream stays the wall */}
      <div style={{ position: "absolute", left: 0, right: 0, top: LOC_GROUND - 8, bottom: 0, background: `linear-gradient(180deg, ${tint(SUPPORT.mustard, 0.7)} 0%, ${tint(SUPPORT.mustard, 0.55)} 100%)`, opacity: reveal * 0.6 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: LOC_GROUND - 10, height: 4, background: shade(SUPPORT.clay, 0.2), opacity: reveal * 0.5 }} />
      <GroundWash reveal={reveal} />

      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* window with a soft daylight spill + one breathing curtain */}
        <defs>
          <linearGradient id="daylt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF3D2" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#FFF3D2" stopOpacity={0} />
          </linearGradient>
        </defs>
        {(() => {
          const wy = HEIGHT * 0.16;
          const ww = 236;
          const wh = 176;
          return (
            <g opacity={reveal}>
              {/* soft daylight spill onto the floor */}
              <path d={`M ${winX + 10} ${wy + wh} L ${winX + ww - 10} ${wy + wh} L ${winX + ww + 80} ${LOC_GROUND + 60} L ${winX - 96} ${LOC_GROUND + 60} Z`} fill="url(#daylt)" />
              {/* warm morning-light pane — not blue */}
              <rect x={winX} y={wy} width={ww} height={wh} rx={4} fill="#F3E7C2" stroke={COLOR.ink} strokeWidth={5} />
              <rect x={winX} y={wy} width={ww} height={wh * 0.5} rx={4} fill="#FBF3D8" opacity={0.7} />
              <line x1={winX + ww / 2} y1={wy} x2={winX + ww / 2} y2={wy + wh} stroke={COLOR.ink} strokeWidth={4} />
              <line x1={winX} y1={wy + wh / 2} x2={winX + ww} y2={wy + wh / 2} stroke={COLOR.ink} strokeWidth={4} />
              {/* a curtain rod + two simple drapes, gently breathing */}
              <line x1={winX - 30} y1={wy - 14} x2={winX + ww + 30} y2={wy - 14} stroke={COLOR.ink} strokeWidth={5} strokeLinecap="round" />
              {([-1, 1] as const).map((dir) => {
                const edge = dir < 0 ? winX - 18 : winX + ww + 18;
                const w = 46 + dir * curtain;
                return (
                  <path
                    key={dir}
                    d={`M ${edge} ${wy - 12} q ${dir * w} 20 ${dir * w * 0.5} ${wh * 0.55} q ${-dir * w * 0.3} ${wh * 0.5} ${dir * 8} ${wh * 0.5} l ${-dir * 30} 0 q ${dir * 6} ${-wh * 0.5} ${-dir * 6} ${-wh} Z`}
                    fill={SUPPORT.clay}
                    stroke={COLOR.ink}
                    strokeWidth={3}
                    opacity={0.92}
                  />
                );
              })}
            </g>
          );
        })()}

        {decor === "living" && (() => {
          const sx = WIDTH * 0.26;
          return (
            <g opacity={reveal} style={{ filter: softShadow(1.1, 0.18) }}>
              {groundShadow(sx + 210, 520)}
              <ellipse cx={sx + 200} cy={LOC_GROUND + 20} rx={300} ry={26} fill={tint(SUPPORT.clay, 0.28)} />
              <rect x={sx} y={seatY} width={420} height={LOC_GROUND - seatY + 6} rx={14} fill={shade(SUPPORT.teal, 0.04)} stroke={COLOR.ink} strokeWidth={3} />
              <rect x={sx - 4} y={seatY - 70} width={78} height={LOC_GROUND - seatY + 76} rx={14} fill={SUPPORT.teal} stroke={COLOR.ink} strokeWidth={3} />
              <rect x={sx + 54} y={seatY - 70} width={366} height={78} rx={12} fill={SUPPORT.teal} stroke={COLOR.ink} strokeWidth={3} />
              {[0, 1].map((i) => (
                <rect key={i} x={sx + 82 + i * 168} y={seatY - 14} width={156} height={34} rx={10} fill={tint(SUPPORT.teal, 0.14)} stroke={COLOR.ink} strokeWidth={2} />
              ))}
              {/* a small plant */}
              <g transform={`translate(${sx + 470}, ${LOC_GROUND})`}>
                <path d="M 0 0 L -14 -70 M 0 0 L 0 -86 M 0 0 L 14 -66" stroke={SUPPORT.forest} strokeWidth={7} strokeLinecap="round" fill="none" />
                <path d="M -22 0 L 22 0 L 16 -34 L -16 -34 Z" fill={SUPPORT.clay} stroke={COLOR.ink} strokeWidth={3} />
              </g>
            </g>
          );
        })()}

        {decor === "bedroom" && (() => {
          const bx = WIDTH * 0.2;
          const bw = 540;
          const mattY = LOC_GROUND - 62;
          return (
            <g opacity={reveal} style={{ filter: softShadow(1.1, 0.18) }}>
              {groundShadow(bx + bw / 2, bw + 80)}
              <rect x={bx - 24} y={mattY - 96} width={40} height={96 + (LOC_GROUND - mattY)} rx={8} fill={shade(SUPPORT.clay, 0.05)} stroke={COLOR.ink} strokeWidth={3} />
              <rect x={bx} y={mattY + 34} width={bw} height={LOC_GROUND - mattY - 30} fill={shade(SUPPORT.clay, 0.02)} stroke={COLOR.ink} strokeWidth={3} />
              <rect x={bx} y={mattY} width={bw} height={44} rx={12} fill={tint(COLOR.cardWhite, 0.3)} stroke={COLOR.ink} strokeWidth={3} />
              <path d={`M ${bx - 4} ${mattY + 3} L ${bx + bw * 0.46} ${mattY + 3} L ${bx + bw * 0.46} ${mattY + 41} L ${bx - 4} ${mattY + 41} Q ${bx - 22} ${mattY + 30} ${bx - 16} ${mattY + 96} L ${bx - 4} ${mattY + 96} Z`} fill={SUPPORT.teal} stroke={COLOR.ink} strokeWidth={3} />
              <rect x={bx + 12} y={mattY - 24} width={120} height={42} rx={16} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={3} />
              {/* nightstand + lamp glow */}
              <ellipse cx={bx - 92} cy={LOC_GROUND - 96} rx={150} ry={116} fill="rgba(255,240,198,0.3)" opacity={lamp} />
              <rect x={bx - 150} y={LOC_GROUND - 96} width={104} height={100} rx={8} fill={shade(SUPPORT.mustard, 0.1)} stroke={COLOR.ink} strokeWidth={3} />
            </g>
          );
        })()}

        {decor === "dining" && (() => {
          const tx = WIDTH * 0.3;
          const topY = LOC_GROUND - 96;
          return (
            <g opacity={reveal} style={{ filter: softShadow(1.1, 0.18) }}>
              {groundShadow(tx + 210, 500)}
              <line x1={tx + 200} y1={HEIGHT * 0.1} x2={tx + 200} y2={HEIGHT * 0.24} stroke={COLOR.ink} strokeWidth={4} />
              <path d={`M ${tx + 164} ${HEIGHT * 0.24} l 72 0 l -14 40 l -44 0 Z`} fill={SUPPORT.mustard} stroke={COLOR.ink} strokeWidth={4} />
              <ellipse cx={tx + 200} cy={topY - 24} rx={210} ry={130} fill="rgba(255,240,198,0.24)" opacity={lamp} />
              <rect x={tx} y={topY} width={410} height={22} rx={4} fill={SUPPORT.clay} stroke={COLOR.ink} strokeWidth={3} />
              {[tx + 16, tx + 372].map((lx, i) => <rect key={i} x={lx} y={topY + 22} width={16} height={LOC_GROUND - topY - 22} fill={COLOR.ink} />)}
              <ellipse cx={tx + 110} cy={topY - 4} rx={42} ry={11} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={2} />
              <ellipse cx={tx + 300} cy={topY - 4} rx={42} ry={11} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={2} />
              {[tx - 28, tx + 420].map((cx0, i) => (
                <g key={i}>
                  <rect x={cx0} y={topY + 30} width={14} height={LOC_GROUND - topY - 30} fill={COLOR.ink} />
                  <rect x={cx0 + (i ? -34 : 0)} y={topY - 56} width={14} height={92} fill={COLOR.ink} />
                </g>
              ))}
            </g>
          );
        })()}

        {decor === "office" && (() => {
          const dx = WIDTH * 0.34;
          const topY = LOC_GROUND - 92;
          return (
            <g opacity={reveal} style={{ filter: softShadow(1.1, 0.18) }}>
              {groundShadow(dx + 200, 480)}
              <rect x={dx} y={topY} width={400} height={20} fill={SUPPORT.clay} stroke={COLOR.ink} strokeWidth={3} />
              <rect x={dx + 12} y={topY + 20} width={16} height={LOC_GROUND - topY - 20} fill={COLOR.ink} />
              <rect x={dx + 372} y={topY + 20} width={16} height={LOC_GROUND - topY - 20} fill={COLOR.ink} />
              <rect x={dx + 232} y={topY - 118} width={158} height={104} rx={8} fill={COLOR.ink} />
              <rect x={dx + 240} y={topY - 110} width={142} height={88} rx={4} fill={tint(SUPPORT.teal, 0.35)} />
              <rect x={dx + 60} y={topY - 84} width={84} height={136} rx={16} fill={SUPPORT.teal} stroke={COLOR.ink} strokeWidth={3} />
            </g>
          );
        })()}
      </svg>
    </AbsoluteFill>
  );
};

// (Generated-still helpers BgPlate / PropPlate removed — NIF002 is 100% code.
//  Creator 2026-09-03: "I don't need the image option anymore.")
