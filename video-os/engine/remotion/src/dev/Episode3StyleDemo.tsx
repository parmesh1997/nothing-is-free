import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { COLOR, FONT, WIDTH, HEIGHT } from "../tokens";
import { V4Field } from "../nif002/v4/V4Field";
import { TRANSITION_HOLD, TRANSITION_RAMP } from "../nif002/v4/V4Beat";

/**
 * Episode3StyleDemo — a standalone proof of the three 2026-09-05 standards
 * before they're built into a real episode:
 *   1. motion cadence ≤3s + "a process keeps running" (nif-house-style v1.4.0)
 *   2. the beat-to-beat black push (V4Beat's TRANSITION_HOLD/RAMP)
 *   3. Three.js via @remotion/three, in the same palette/restraint
 *
 * Not a real beat — no VO file, so it reuses V4Field + the exact transition
 * math directly rather than the production V4Beat wrapper (which requires a
 * per-beat mp3). Verification only; never episode output (see dev/ in
 * engine/remotion/CLAUDE.md).
 */

const DemoBeat: React.FC<{ children: React.ReactNode; durationInFrames: number }> = ({ children, durationInFrames: dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <V4Field progress={0.12}>
        {children}
        <AbsoluteFill
          style={{
            background: "#111111",
            opacity: interpolate(
              frame,
              [
                0,
                TRANSITION_HOLD,
                TRANSITION_HOLD + TRANSITION_RAMP,
                dur - TRANSITION_HOLD - TRANSITION_RAMP,
                dur - TRANSITION_HOLD,
                dur - 1,
              ],
              [1, 1, 0, 0, 1, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
            pointerEvents: "none",
          }}
        />
      </V4Field>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ eyebrow: string; children: string }> = ({ eyebrow, children }) => (
  <div style={{ position: "absolute", left: 132, right: 132, bottom: HEIGHT * 0.09 }}>
    <div
      style={{
        fontFamily: FONT.mono,
        fontSize: 22,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: COLOR.orange,
        marginBottom: 10,
      }}
    >
      {eyebrow}
    </div>
    <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 42, color: COLOR.ink, maxWidth: WIDTH * 0.72 }}>{children}</div>
  </div>
);

// ── Beat 1 — motion cadence + "a process keeps running" ─────────────────────
const ProcessBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const railY = HEIGHT * 0.4;
  const cx = [WIDTH * 0.32, WIDTH * 0.5, WIDTH * 0.68];
  const period = 84;
  const packets = [0, 1, 2].map((k) => (((frame / period - k / 3) % 1) + 1) % 1);

  // a live counter that never stops climbing while it's on screen — the
  // point of "if it IS a process, it keeps running."
  const count = 14_384_206 + Math.floor(frame * 137.4);

  // three staggered build-ins inside the first 3s — proves the ≤3s cadence.
  const counterIn = spring({ frame, fps: 30, config: { damping: 200 } });
  const railIn = spring({ frame: frame - 18, fps: 30, config: { damping: 200 } });
  const pipIn = spring({ frame: frame - 42, fps: 30, config: { damping: 200 } });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: WIDTH * 0.5,
          top: HEIGHT * 0.18,
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: counterIn,
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: "0.16em", textTransform: "uppercase", color: COLOR.grey }}>
          AUCTIONS RUN SO FAR
        </div>
        <div
          style={{
            fontFamily: FONT.sans,
            fontWeight: 700,
            fontSize: 96,
            color: COLOR.ink,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {count.toLocaleString("en-US")}
        </div>
      </div>

      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity: railIn }}>
        <line x1={cx[0]} y1={railY} x2={cx[2]} y2={railY} stroke={COLOR.grey} strokeWidth={3} opacity={0.5} />
        {cx.map((x, i) => (
          <rect key={i} x={x - 62} y={railY - 36} width={124} height={72} rx={10} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={2} />
        ))}
        {["BUYER", "EXCHANGE", "SELLER"].map((label, i) => (
          <text
            key={label}
            x={cx[i]}
            y={railY + 6}
            textAnchor="middle"
            fontFamily={FONT.mono}
            fontSize={16}
            letterSpacing="0.06em"
            fill={COLOR.ink}
          >
            {label}
          </text>
        ))}
        {packets.map((p, i) => {
          const x = cx[0] + (cx[2] - cx[0]) * p;
          return (
            <React.Fragment key={i}>
              <circle cx={x} cy={railY} r={18} fill={COLOR.orange} opacity={0.16} />
              <circle cx={x} cy={railY} r={8} fill={COLOR.orange} />
            </React.Fragment>
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: cx[2] + 92,
          top: railY - 66,
          opacity: pipIn,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: 5, background: COLOR.orange }} />
        <div style={{ fontFamily: FONT.mono, fontSize: 16, letterSpacing: "0.12em", color: COLOR.grey, textTransform: "uppercase" }}>
          LIVE
        </div>
      </div>

      <Caption eyebrow="RULE 1 — CADENCE + PROCESS">
        A motion event every ≤3 seconds — and anything that IS a process (the counter, the packets) keeps running the whole hold, never freezes.
      </Caption>
    </>
  );
};

// ── Beat 2 — Three.js, same palette, same restraint ──────────────────────────
const ThreeDBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const targetH = [1.3, 2.7, 1.9];
  const barColor = [COLOR.grey, COLOR.orange, COLOR.ink];
  const labels = ["EXCHANGE", "AUCTION", "PUBLISHER"];
  const heights = targetH.map((h, i) => h * spring({ frame: Math.max(0, frame - i * 6), fps, config: { damping: 14, mass: 0.6 } }));
  const rotation = interpolate(frame, [0, 300], [0.55, 0.55 + Math.PI / 4.5], { extrapolateRight: "clamp" });
  const labelIn = spring({ frame: frame - 26, fps, config: { damping: 200 } });

  return (
    <>
      <div style={{ position: "absolute", inset: 0 }}>
        <ThreeCanvas width={WIDTH} height={HEIGHT} orthographic camera={{ zoom: 92, position: [10, 8.5, 10] }}>
          <ambientLight intensity={1.15} />
          <directionalLight position={[6, 9, 4]} intensity={0.35} />
          <group rotation={[0, rotation, 0]}>
            {heights.map((h, i) => (
              <mesh key={i} position={[(i - 1) * 2.5, h / 2, 0]}>
                <boxGeometry args={[1.7, Math.max(0.01, h), 1.7]} />
                <meshLambertMaterial color={barColor[i]} />
              </mesh>
            ))}
          </group>
        </ThreeCanvas>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: HEIGHT * 0.71,
          display: "flex",
          justifyContent: "center",
          gap: 150,
          opacity: labelIn,
        }}
      >
        {labels.map((l) => (
          <div key={l} style={{ fontFamily: FONT.mono, fontSize: 20, letterSpacing: "0.12em", color: COLOR.grey, textTransform: "uppercase" }}>
            {l}
          </div>
        ))}
      </div>

      <Caption eyebrow="RULE 2 — NEW FROM EPISODE 3">
        Real 3D, via Three.js — only for a shot 2D can't sell, same cream/ink/orange, same restraint.
      </Caption>
    </>
  );
};

const BEAT_1_DUR = 300; // 10.0s
const BEAT_2_DUR = 320; // 10.67s
export const EPISODE3_STYLE_DEMO_TOTAL = BEAT_1_DUR + BEAT_2_DUR; // ~20.7s

export const Episode3StyleDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLOR.paper }}>
    <Sequence from={0} durationInFrames={BEAT_1_DUR} name="process-demo">
      <DemoBeat durationInFrames={BEAT_1_DUR}>
        <ProcessBeat />
      </DemoBeat>
    </Sequence>
    <Sequence from={BEAT_1_DUR} durationInFrames={BEAT_2_DUR} name="three-d-demo">
      <DemoBeat durationInFrames={BEAT_2_DUR}>
        <ThreeDBeat />
      </DemoBeat>
    </Sequence>
  </AbsoluteFill>
);
