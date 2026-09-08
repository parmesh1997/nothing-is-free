import { interpolate, useCurrentFrame } from "remotion";
import { BeatFrame } from "../../BeatFrame";
import { BeatProps, COLOR, FONT, HEIGHT, WIDTH, shade } from "../../tokens";
import { FlatFigure } from "../../print/FlatFigure";
import { Lucky } from "../../characters";
import { EASE } from "../../parts/motion";
import { Bloom } from "../../parts/Bloom";
import { appTile, studioDesk } from "../shapes";
import { useStage, pulse, safeRamp } from "../stage";
import { useBeatTiming } from "../timing";

/**
 * NIF002 B02 — the honest part (save-the-cat). MEDIUM · 1153 f (38.4 s).
 * Empty → build → disperse → empty. Lucky holds her phone and is on a loop.
 * Peak: "they all still made money off me" ~f1070.
 * VO: honest part / a free app (0–6s) · 97% free (6–11s) · nobody pays (11–17s) ·
 *     not the villain (17–22s) · this auction (22–29s) · I didn't click one
 *     (29–35.5s) · still made money off me (35.5–38.4s).
 */
export const B02: React.FC<BeatProps> = (props) => (
  <BeatFrame props={props} source="Statista / Google Play app distribution, 2024">
    <Content dur={props.durationInFrames} />
  </BeatFrame>
);

const COLS = 8;
const ROWS = 4;
const GLYPHS = ["letter", "controller", "bag", "cloud", "map", "dots"] as const;
const PAID = new Set([21]);

const Content: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const stage = useStage(dur, { disperseFrames: 12, holdFrames: 8 });
  const vo = useBeatTiming("B02");

  // event frames — whisper word starts, hand-set fallback
  const F = {
    kicker: 8,
    lucky: 24,
    hero: vo.at("app", 74),
    grid: vo.at("apps", 182) - 30, // "ninety-seven percent of the APPS you can install"
    wash: vo.at("nobody", 356),
    studio: vo.at("villain", 560),
    villain: vo.at("villain", 560) + 26,
    clicks: vo.at("click", 940),
    peak: vo.at("money", 1090),
  };

  const floorY = Math.round(HEIGHT * 0.79);
  const groundY = HEIGHT - 6;

  const gap = 22;
  const tile = Math.floor((WIDTH * 0.58 - gap * (COLS - 1)) / COLS);
  const gridW = COLS * tile + (COLS - 1) * gap;
  const gridLeft = Math.round(WIDTH * 0.38);
  const gridTop = Math.round(HEIGHT * 0.08);

  const luckyH = Math.round(HEIGHT * 0.56);
  const luckyCx = Math.round(WIDTH * 0.19);

  const adTint = [COLOR.orange, COLOR.ink, COLOR.grey][Math.floor(frame / 10) % 3];
  const peakPulse = pulse(frame, F.peak, 0.1, 22);

  return (
    <>
      {/* ── FLOOR ── */}
      <div style={{ position: "absolute", left: 0, top: floorY, width: WIDTH, height: HEIGHT - floorY, backgroundColor: shade(COLOR.grey, 0.22), opacity: stage.present(frame, F.lucky - 8, 16), translate: `0px ${stage.flyY(frame, 1, 220)}px` }} />
      <div style={{ position: "absolute", left: 0, top: floorY, width: WIDTH, height: 5, backgroundColor: COLOR.ink, opacity: stage.present(frame, F.lucky - 8, 16) }} />

      {/* kicker */}
      <Label
        text="FIRST — THE HONEST PART."
        x={120}
        y={HEIGHT * 0.13}
        size={62}
        opacity={interpolate(frame, [F.kicker, F.kicker + 14, F.grid - 26, F.grid], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        dx={stage.fly(frame, -1, 500)}
      />

      {/* one big app icon before it multiplies */}
      {frame >= F.hero && frame < F.grid + 44 && (
        <div
          style={{
            position: "absolute",
            left: WIDTH * 0.6,
            top: HEIGHT * 0.26,
            width: 210,
            height: 210,
            opacity: interpolate(frame, [F.hero, F.hero + 14, F.grid + 14, F.grid + 44], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            scale: String(interpolate(frame, [F.grid, F.grid + 22], [1, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })),
          }}
        >
          <FlatFigure shape={appTile({ glyph: "controller", color: COLOR.orange })} w={210} h={210} />
        </div>
      )}

      {/* ── the app-grid wall ── */}
      <div style={{ position: "absolute", left: gridLeft, top: gridTop, width: gridW, opacity: stage.exit(frame) }}>
        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const paid = PAID.has(i);
          const at = F.grid + i * 3;
          const inn = Math.min(1, stage.enter(frame, at, 11));
          if (inn <= 0.01) return null;
          const wash = interpolate(frame, [F.wash + i * 2, F.wash + 70 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const color = paid ? COLOR.orange : blend(GLYPH_COLOR(i), COLOR.grey, wash);
          const flyOut = stage.flyY(frame, -1, 720) * (0.5 + (i % 5) * 0.13);
          return (
            <div key={i} style={{ position: "absolute", left: col * (tile + gap), top: row * (tile + gap), width: tile, height: tile, opacity: inn, translate: `0px ${(1 - inn) * -22 + flyOut}px` }}>
              <FlatFigure shape={appTile({ glyph: GLYPHS[i % GLYPHS.length], color })} w={tile} h={tile} />
            </div>
          );
        })}
      </div>
      <Label text="97% ARE FREE" x={gridLeft} y={gridTop - 58} size={40} variant="ink" opacity={stage.present(frame, F.grid + 28, 14)} />

      {/* ── the studio (not the villain) — below the grid, right side ── */}
      <div
        style={{
          position: "absolute",
          left: WIDTH * 0.62,
          top: groundY - Math.round(HEIGHT * 0.3),
          width: Math.round(WIDTH * 0.3),
          height: Math.round(HEIGHT * 0.3),
          opacity: stage.present(frame, F.studio, 18),
          translate: `${stage.fly(frame, 1, 520) + (1 - Math.min(1, stage.enter(frame, F.studio))) * 100}px 0px`,
        }}
      >
        <FlatFigure shape={studioDesk()} w={Math.round(WIDTH * 0.3)} h={Math.round(HEIGHT * 0.3)} />
      </div>
      {stage.isUp(frame, F.villain) && (
        <Label text="NOT THE VILLAIN — THE AUCTION PAYS THE RENT" x={WIDTH * 0.58} y={groundY - Math.round(HEIGHT * 0.33)} size={26} variant="outline" opacity={stage.present(frame, F.villain, 14)} />
      )}
      {/* $ flows from Lucky's phone to the studio at the peak — despite 0 clicks.
          It LANDS on the studio with a Bloom (the beat's one accent glow).
          Rides through to the end — it's the peak, the last thing on screen. */}
      {frame >= F.peak - 6 && (
        <>
          <Bloom window={[F.peak + 14, F.peak + 24, dur - 9, dur - 3]} radius={130} x={WIDTH * 0.7} y={groundY - HEIGHT * 0.22} intensity={0.85} />
          <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <circle
              cx={interpolate(frame, [F.peak, F.peak + 20], [luckyCx + luckyH * 0.15, WIDTH * 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })}
              cy={interpolate(frame, [F.peak, F.peak + 20], [groundY - luckyH * 0.5, groundY - HEIGHT * 0.22], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut })}
              r={interpolate(frame, [F.peak + 16, F.peak + 26], [17, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              fill={COLOR.orange}
              stroke={COLOR.ink}
              strokeWidth={2}
              opacity={safeRamp(frame, [F.peak, F.peak + 6, dur - 10, dur - 3], [0, 1, 1, 0])}
            />
          </svg>
        </>
      )}

      {/* ── Lucky ── */}
      <div style={{ translate: `${stage.fly(frame, -1, 620)}px 0px`, opacity: stage.exit(frame), scale: String(peakPulse) }}>
        <Lucky
          pose="showPhone"
          expression={frame < F.villain ? "worried" : frame < F.peak ? "flat" : "worried"}
          height={luckyH}
          centerX={luckyCx}
          baseline={groundY}
          facing={1}
          entry="L"
          entryFrame={F.lucky}
          cycleSeconds={2.6}
          phoneScreen={frame >= F.clicks ? adTint : undefined}
        />
      </div>

      {/* MY CLICKS: 0 */}
      {stage.isUp(frame, F.clicks) && (
        <div
          style={{
            position: "absolute",
            left: luckyCx - 100,
            top: groundY - luckyH - 64,
            fontFamily: FONT.mono,
            fontSize: 30,
            color: COLOR.ink,
            whiteSpace: "nowrap",
            opacity: stage.present(frame, F.clicks, 14),
            scale: String(pulse(frame, F.clicks + 100, 0.12, 14)),
          }}
        >
          MY CLICKS: <span style={{ color: COLOR.orange }}>0</span>
        </div>
      )}

      {/* the peak line */}
      {frame >= F.peak - 14 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT * 0.87, display: "flex", justifyContent: "center", opacity: safeRamp(frame, [F.peak - 14, F.peak + 4, dur - 20, dur - 4]) }}>
          <div style={{ backgroundColor: COLOR.orange, color: COLOR.cardWhite, padding: "16px 40px", fontFamily: FONT.hero, fontSize: 46, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
            THEY ALL STILL MADE MONEY OFF ME.
          </div>
        </div>
      )}
    </>
  );
};

const Label: React.FC<{
  text: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  variant?: "plain" | "ink" | "outline";
  dx?: number;
}> = ({ text, x, y, size, opacity, variant = "plain", dx = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontFamily: FONT.hero,
      fontSize: size,
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
      color: variant === "ink" ? COLOR.cardWhite : COLOR.ink,
      backgroundColor: variant === "ink" ? COLOR.ink : "transparent",
      border: variant === "outline" ? `3px solid ${COLOR.ink}` : "none",
      padding: variant === "plain" ? 0 : "8px 18px",
      opacity,
      translate: `${dx}px 0px`,
    }}
  >
    {text}
  </div>
);

const GLYPH_COLOR = (i: number): string => [COLOR.orange, COLOR.grey, COLOR.ink, COLOR.grey, COLOR.orange][i % 5];

const blend = (a: string, b: string, t: number): string => {
  const pa = hex(a);
  const pb = hex(b);
  return `rgb(${Math.round(pa[0] + (pb[0] - pa[0]) * t)}, ${Math.round(pa[1] + (pb[1] - pa[1]) * t)}, ${Math.round(pa[2] + (pb[2] - pa[2]) * t)})`;
};
const hex = (c: string): [number, number, number] => {
  const n = parseInt(c.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
