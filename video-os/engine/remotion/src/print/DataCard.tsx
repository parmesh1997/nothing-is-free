import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, FONT, TYPE } from "../tokens";
import { springIn } from "../parts/motion";

type Row = { label: string; value: string; accent?: boolean };

/**
 * DataCard — TIER 2 (§1.1, §2.4). "Identical, and code does this better than any
 * generator." Card white #F7F4EB, mono labels, FLAT — never halftoned, never an
 * offset stroke (§2.5, §2.6).
 *
 * One accent value per card max, and only if this card carries the frame's
 * accent (§2.4).
 */
export const DataCard: React.FC<{
  title?: string;
  rows: Row[];
  x: number;
  y: number;
  width?: number;
  entryFrame?: number;
  entryDurationInFrames?: number;
}> = ({
  title,
  rows,
  x,
  y,
  width = 620,
  entryFrame = 0,
  entryDurationInFrames = 18,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springIn({
    frame,
    fps,
    delay: entryFrame,
    durationInFrames: entryDurationInFrames,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        opacity: p,
        translate: `0px ${16 * (1 - p)}px`,
        backgroundColor: COLOR.cardWhite,
        borderLeft: `6px solid ${COLOR.ink}`,
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: "0 2px 0 rgba(26,26,24,0.12)",
      }}
    >
      {title ? (
        <div
          style={{
            ...TYPE.cardLabel,
            fontSize: TYPE.cardLabel.maxSize,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: COLOR.ink,
            paddingBottom: 6,
            borderBottom: `1px solid rgba(26,26,24,0.18)`,
          }}
        >
          {title}
        </div>
      ) : null}

      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 24,
          }}
        >
          <span style={{ ...TYPE.cardLabel, fontSize: TYPE.cardLabel.minSize }}>
            {r.label}
          </span>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 30,
              fontWeight: 500,
              color: r.accent ? COLOR.orange : COLOR.ink,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
};
