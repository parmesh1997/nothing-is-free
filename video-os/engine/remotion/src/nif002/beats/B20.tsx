import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { Bloom } from "../../parts/Bloom";
import { EASE, springIn } from "../../parts/motion";
import { dataCrate, govBuilding, streetGrid } from "../shapes";
import { Floor } from "../scene";
import { useStage, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B20 — where the data actually goes. HIGH · 1266 f (42.2 s). §14.4
 * sensitive — plain, sourced, no drama. Empty → a plain street grid, scattered
 * pins → the pins connect into a labelled path (HOME · WORK · A CLINIC · A
 * COURTHOUSE · A PLACE OF WORSHIP) → a crate "HUNDREDS OF MILLIONS OF DEVICES"
 * → a government building receives one, "NO WARRANT" → "an auction is a public
 * address system" → empty.
 * Peak: "a record of where people go" — whisper "go" @ f1016.
 */
export const B20: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="FTC v. Kochava; FTC v. Gravy Analytics / Venntel, Dec 2024">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const STOPS = [
  { label: "HOME", fx: 0.12, fy: 0.28 },
  { label: "WORK", fx: 0.34, fy: 0.62 },
  { label: "A CLINIC", fx: 0.55, fy: 0.34 },
  { label: "A COURTHOUSE", fx: 0.72, fy: 0.7 },
  { label: "A PLACE OF WORSHIP", fx: 0.88, fy: 0.4 },
];

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 34, holdFrames: 14 });
  const vo = useBeatTiming("B20");

  const F = {
    dots: vo.at("dots", 113),
    path: vo.at("sleep", 220),
    bulk: vo.at("bulk", 498),
    gov: vo.at("government", 677),
    wanted: vo.at("audience", 856),
    peak: vo.at("go", 1016),
    system: vo.at("public", 1222),
  };

  const mapX = WIDTH * 0.06;
  const mapY = HEIGHT * 0.08;
  const mapW = WIDTH * 0.62;
  const mapH = HEIGHT * 0.6;
  const px = (fx: number) => mapX + fx * mapW;
  const py = (fy: number) => mapY + fy * mapH;

  const pathDrawn = interpolate(frame, [F.path, F.path + 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
  const shownStops = Math.min(STOPS.length, Math.floor(pathDrawn * STOPS.length) + 1);

  return (
    <>
      <Floor stage={stage} at={8} heightFraction={0.18} kind="floor" />

      {/* ── the map ── */}
      <div style={{ position: "absolute", left: mapX, top: mapY, width: mapW, height: mapH, opacity: stage.present(frame, F.dots - 12, 16), border: `2px solid ${COLOR.ink}` }}>
        <FlatFigure shape={streetGrid} w={mapW} h={mapH} />
      </div>

      {/* ── pins + path ── */}
      <svg style={{ position: "absolute", inset: 0, overflow: "visible", opacity: stage.exit(frame) }}>
        {/* path segments */}
        {STOPS.slice(0, -1).map((s, i) => {
          const seg = interpolate(pathDrawn, [i / (STOPS.length - 1), (i + 1) / (STOPS.length - 1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (seg <= 0) return null;
          const a = { x: px(s.fx), y: py(s.fy) };
          const b = { x: px(STOPS[i + 1].fx), y: py(STOPS[i + 1].fy) };
          return <line key={i} x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * seg} y2={a.y + (b.y - a.y) * seg} stroke={COLOR.orange} strokeWidth={3} />;
        })}
        {STOPS.map((s, i) => {
          const on = springIn({ frame, fps: 30, delay: F.dots + i * 8, durationInFrames: 12 });
          if (on <= 0.02) return null;
          const labelled = i < shownStops && frame >= F.path;
          return (
            <g key={i} opacity={Math.min(1, on)}>
              <circle cx={px(s.fx)} cy={py(s.fy)} r={9} fill={COLOR.ink} stroke={COLOR.cardWhite} strokeWidth={2} />
              {labelled && (
                <text x={px(s.fx)} y={py(s.fy) - 18} textAnchor="middle" fontFamily={FONT.mono} fontSize={17} fill={COLOR.ink} opacity={interpolate(frame, [F.path + i * 40, F.path + i * 40 + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                  {s.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* "dots → a life" caption */}
      {frame >= F.dots && frame < F.bulk && (
        <div style={{ position: "absolute", left: mapX, top: mapY + mapH + 20, fontFamily: FONT.hero, fontSize: 36, color: COLOR.ink, opacity: interpolate(frame, [F.path, F.path + 14, F.bulk - 20, F.bulk], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          STITCHED TOGETHER, THE DOTS BECOME A LIFE
        </div>
      )}

      {/* ── the crate ── */}
      {frame >= F.bulk - 8 && (
        <div style={{ position: "absolute", left: WIDTH * 0.7, top: HEIGHT * 0.12, width: 240, height: 240, opacity: safeRamp(frame, [F.bulk, F.bulk + 16, dur - 20, dur - 6]) }}>
          <FlatFigure shape={dataCrate} w={240} h={240} />
          <div style={{ position: "absolute", left: -20, top: 250, width: 280, textAlign: "center", fontFamily: FONT.mono, fontSize: 18, color: COLOR.ink }}>
            SOLD IN BULK — hundreds of millions of devices
          </div>
        </div>
      )}

      {/* ── gov building + the crate handing it a box ── */}
      {frame >= F.gov - 8 && (
        <div style={{ position: "absolute", left: WIDTH * 0.7, top: HEIGHT * 0.44, width: 260, height: 220, opacity: safeRamp(frame, [F.gov, F.gov + 16, dur - 20, dur - 6]) }}>
          <FlatFigure shape={govBuilding} w={260} h={220} />
          <div style={{ position: "absolute", left: 0, top: 228, width: 260, textAlign: "center", fontFamily: FONT.hero, fontSize: 26, color: COLOR.orange }}>
            NO WARRANT
          </div>
        </div>
      )}
      {frame >= F.gov && frame < F.wanted && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {[0, 1, 2].map((i) => {
            const t = interpolate(frame, [F.gov + i * 22, F.gov + i * 22 + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
            if (t <= 0 || t >= 1) return null;
            return <rect key={i} x={interpolate(t, [0, 1], [WIDTH * 0.74, WIDTH * 0.8])} y={interpolate(t, [0, 1], [HEIGHT * 0.34, HEIGHT * 0.5])} width={22} height={22} fill={COLOR.grey} stroke={COLOR.ink} strokeWidth={2} />;
          })}
        </svg>
      )}

      {/* ── advertiser wanted vs what came out ── */}
      {frame >= F.wanted - 6 && frame < F.peak + 10 && (
        <div style={{ position: "absolute", left: WIDTH * 0.08, top: HEIGHT * 0.72, opacity: interpolate(frame, [F.wanted, F.wanted + 14, F.peak, F.peak + 14], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 22, color: COLOR.grey }}>the advertiser wanted </span>
          <span style={{ fontFamily: FONT.hero, fontSize: 32, color: COLOR.ink }}>AN AUDIENCE</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 22, color: COLOR.grey }}>  ·  what changed hands was </span>
          <span style={{ fontFamily: FONT.hero, fontSize: 32, color: COLOR.orange }}>A LIFE</span>
        </div>
      )}

      <Bloom window={[F.peak - 6, F.peak + 10, F.peak + 50, F.peak + 80]} radius={300} x="34%" y="40%" intensity={0.6} />

      {/* peak + system line */}
      {frame >= F.peak - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.78, textAlign: "center", opacity: safeRamp(frame, [F.peak, F.peak + 12, dur - 16, dur - 4]) }}>
          <div style={{ fontFamily: FONT.hero, fontSize: 44, color: COLOR.ink }}>WHAT CHANGED HANDS WAS A RECORD OF WHERE PEOPLE GO.</div>
          {frame >= F.system && (
            <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 28, color: COLOR.grey, marginTop: 12, opacity: interpolate(frame, [F.system, F.system + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              an auction is a public address system
            </div>
          )}
        </div>
      )}
    </>
  );
};
