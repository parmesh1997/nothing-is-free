import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { MM_COLOR, MM_FONT, WIDTH, HEIGHT } from "../mm/tokens";
import { MMField } from "../mm/MMField";
import { ScaleFigure } from "../mm/ScaleFigure";

/**
 * MassMethodDemo — the Mass & Method identity proof, built on the actual
 * chosen topic (episode 1: "the pyramids weren't a mystery, they were a
 * logistics problem") rather than a generic tech test. Proves: the dark
 * charcoal field + amber/force / cyan/measurement / ivory/structure palette
 * reads well, the faceless ScaleFigure does its scale job, and the channel
 * inherits the same standing rules as NIF (≤3s cadence, a process keeps
 * running) even though the visual identity is entirely different.
 *
 * The mechanism shown is real and sourced: wetting the sand ahead of a
 * sledge measurably cut friction (Univ. of Amsterdam, 2014, on the actual
 * tomb painting at Deir el-Bersha showing a worker pouring water).
 *
 * Not a real beat — no VO, no BeatFrame — a standalone verification comp
 * (see dev/ in engine/remotion/CLAUDE.md).
 */

const GROUND_Y = HEIGHT * 0.72;
const FIGURE_H = 92; // the ScaleFigure's real height in px at this staging depth

const Caption: React.FC<{ eyebrow: string; children: string }> = ({ eyebrow, children }) => (
  <div style={{ position: "absolute", left: 132, right: 132, bottom: HEIGHT * 0.09 }}>
    <div
      style={{
        fontFamily: MM_FONT.mono,
        fontSize: 20,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: MM_COLOR.cyan,
        marginBottom: 10,
      }}
    >
      {eyebrow}
    </div>
    <div style={{ fontFamily: MM_FONT.sans, fontWeight: 600, fontSize: 38, color: MM_COLOR.ivory, maxWidth: WIDTH * 0.72 }}>
      {children}
    </div>
  </div>
);

const Scene: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneIn = spring({ frame, fps: 30, config: { damping: 200 } });
  const wetAt = 168; // ~5.6s — the water lands
  const wetProgress = interpolate(frame, [wetAt, wetAt + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const puddle = interpolate(frame, [wetAt, wetAt + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // the sledge nudges forward once friction drops — the mechanism's payoff.
  const slideX = interpolate(frame, [wetAt + 10, wetAt + 70], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  // friction arrow: long (dry) -> short (wet), amber = force.
  const frictionLen = interpolate(wetProgress, [0, 1], [230, 108]);
  const readoutIn = spring({ frame: Math.max(0, frame - wetAt - 30), fps: 30, config: { damping: 200 } });

  // an ongoing statistic — "if it IS a process, it keeps running" — ticks the
  // whole clip, tied to the real "~1 block every 5 minutes for 20 years" rate.
  const blocks = 1_812_400 + Math.floor(frame * 3.1);

  const sledgeX = WIDTH * 0.42 + slideX;
  const blockW = 300;
  const blockH = 150;
  const sledgeTopY = GROUND_Y - 26;

  return (
    <>
      {/* ground line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: GROUND_Y, height: 2, background: MM_COLOR.ivoryDim, opacity: 0.35 * sceneIn }} />

      {/* live counter — top, ongoing the whole clip */}
      <div style={{ position: "absolute", left: WIDTH * 0.5, top: HEIGHT * 0.1, transform: "translateX(-50%)", textAlign: "center", opacity: sceneIn }}>
        <div style={{ fontFamily: MM_FONT.mono, fontSize: 20, letterSpacing: "0.16em", textTransform: "uppercase", color: MM_COLOR.cyan }}>
          BLOCKS PLACED — GIZA, C. 2560 BC
        </div>
        <div style={{ fontFamily: MM_FONT.sans, fontWeight: 700, fontSize: 84, color: MM_COLOR.ivory, fontVariantNumeric: "tabular-nums" }}>
          {blocks.toLocaleString("en-US")}
        </div>
      </div>

      {/* sledge + block, sliding once friction drops */}
      <g />
      <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT, opacity: sceneIn }}>
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* puddle ahead of the sledge */}
          <ellipse cx={sledgeX - 40} cy={GROUND_Y + 6} rx={90 * puddle} ry={10 * puddle} fill={MM_COLOR.cyan} opacity={0.22 * puddle} />
          {/* sledge runners */}
          <path
            d={`M ${sledgeX - blockW / 2 - 18} ${sledgeTopY + 26} L ${sledgeX + blockW / 2 + 18} ${sledgeTopY + 26} L ${sledgeX + blockW / 2} ${GROUND_Y} L ${sledgeX - blockW / 2} ${GROUND_Y} Z`}
            fill={MM_COLOR.ivoryDim}
            opacity={0.5}
          />
          {/* the block */}
          <rect x={sledgeX - blockW / 2} y={sledgeTopY - blockH} width={blockW} height={blockH} fill={MM_COLOR.ivory} />
          <line x1={sledgeX - blockW / 2} y1={sledgeTopY - blockH * 0.5} x2={sledgeX + blockW / 2} y2={sledgeTopY - blockH * 0.5} stroke={MM_COLOR.field} strokeWidth={2} opacity={0.3} />

          {/* rope to the pulling team */}
          <line x1={sledgeX - blockW / 2 - 18} y1={sledgeTopY + 10} x2={sledgeX - blockW / 2 - 220} y2={sledgeTopY + 10} stroke={MM_COLOR.ivoryDim} strokeWidth={3} />

          {/* friction force arrow — amber = force, shrinks once wet */}
          <g opacity={0.95}>
            <line
              x1={sledgeX + blockW / 2 + 30}
              y1={GROUND_Y - 10}
              x2={sledgeX + blockW / 2 + 30 + frictionLen}
              y2={GROUND_Y - 10}
              stroke={MM_COLOR.amber}
              strokeWidth={6}
            />
            <path
              d={`M ${sledgeX + blockW / 2 + 30 + frictionLen} ${GROUND_Y - 10} l -18 -9 l 0 18 Z`}
              fill={MM_COLOR.amber}
            />
          </g>
          <text
            x={sledgeX + blockW / 2 + 30}
            y={GROUND_Y - 24}
            fontFamily={MM_FONT.mono}
            fontSize={16}
            letterSpacing="0.08em"
            fill={MM_COLOR.amber}
          >
            FRICTION
          </text>

          {/* cyan measurement readout, pops in once the arrow has shrunk */}
          <g opacity={readoutIn}>
            <text
              x={sledgeX + blockW / 2 + 30 + frictionLen + 26}
              y={GROUND_Y - 6}
              fontFamily={MM_FONT.mono}
              fontSize={22}
              fill={MM_COLOR.cyan}
            >
              ≈50% LESS DRAG, WET SAND
            </text>
          </g>
        </svg>

        {/* the hero ScaleFigure — human-scale reference, fixed at the right so
            it never collides with the friction readout as the sledge moves */}
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <ScaleFigure x={WIDTH * 0.86} y={GROUND_Y} heightPx={FIGURE_H} color={MM_COLOR.ivory} facing={-1} />
          {/* pulling team */}
          <ScaleFigure x={sledgeX - blockW / 2 - 260} y={GROUND_Y} heightPx={FIGURE_H * 0.94} color={MM_COLOR.ivory} facing={1} />
          <ScaleFigure x={sledgeX - blockW / 2 - 330} y={GROUND_Y} heightPx={FIGURE_H * 0.9} color={MM_COLOR.ivoryDim} facing={1} />
          {/* the figure pouring water, faces the sledge, times to the wet event */}
          <ScaleFigure x={sledgeX - blockW / 2 - 60} y={GROUND_Y} heightPx={FIGURE_H * 0.92} color={MM_COLOR.ivory} facing={-1} />
        </svg>
      </div>

      <Caption eyebrow="MASS &amp; METHOD — EP.01 IDENTITY PROOF">
        A 2014 University of Amsterdam study measured it directly: wetting the sand ahead of the sledge cut friction by up to half.
      </Caption>
    </>
  );
};

export const MASS_METHOD_DEMO_TOTAL = 480; // 16s

export const MassMethodDemo: React.FC = () => (
  <AbsoluteFill>
    <MMField>
      <Scene />
    </MMField>
  </AbsoluteFill>
);
