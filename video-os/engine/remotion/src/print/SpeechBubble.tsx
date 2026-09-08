import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, FONT } from "../tokens";
import { springIn } from "../parts/motion";

/**
 * SpeechBubble — the boxed line from the sheet's scene composition:
 * "YOU PAID $12 FOR THIS TICKET. / BUT HERE'S THE STRANGE PART…"
 * A cream card with a dark outline and a small tail pointing at the speaker.
 * `accentFrom` renders the trailing lines in the orange accent.
 */
export const SpeechBubble: React.FC<{
  lines: string[];
  x: number;
  y: number;
  width?: number;
  /** Index from which lines render in the accent colour. */
  accentFrom?: number;
  /** Which side the tail points out of. */
  tail?: "left" | "right" | "none";
  entryFrame?: number;
  fontSize?: number;
}> = ({ lines, x, y, width = 460, accentFrom, tail = "left", entryFrame = 0, fontSize = 34 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springIn({ frame, fps, delay: entryFrame, durationInFrames: 16 });

  const padX = 30;
  const padY = 24;
  const lineH = fontSize * 1.28;
  const height = lines.length * lineH + padY * 2;
  const tailH = 22;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        opacity: p,
        scale: String(0.94 + 0.06 * p),
        transformOrigin: tail === "right" ? "100% 50%" : "0% 50%",
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path
          d={`M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`}
          fill={COLOR.cardWhite}
          stroke={COLOR.outline}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {tail !== "none" && (
          <path
            d={
              tail === "left"
                ? `M 0 ${height * 0.55} L ${-tailH} ${height * 0.62} L 0 ${height * 0.78} Z`
                : `M ${width} ${height * 0.55} L ${width + tailH} ${height * 0.62} L ${width} ${height * 0.78} Z`
            }
            fill={COLOR.cardWhite}
            stroke={COLOR.outline}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        )}
      </svg>
      <div style={{ position: "relative", padding: `${padY}px ${padX}px` }}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: FONT.hero,
              fontSize,
              lineHeight: `${lineH}px`,
              letterSpacing: "0.015em",
              color: accentFrom !== undefined && i >= accentFrom ? COLOR.orange : COLOR.ink,
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * LabelBox — the solid statement blocks from the sheet:
 * black box + cream text, or orange box + cream text.
 */
export const LabelBox: React.FC<{
  text: string;
  x: number;
  y: number;
  variant?: "ink" | "orange" | "outline";
  entryFrame?: number;
  fontSize?: number;
  rotate?: number;
}> = ({ text, x, y, variant = "ink", entryFrame = 0, fontSize = 40, rotate = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springIn({ frame, fps, delay: entryFrame, durationInFrames: 14 });

  const bg = variant === "ink" ? COLOR.ink : variant === "orange" ? COLOR.orange : "transparent";
  const fg = variant === "outline" ? COLOR.ink : COLOR.cardWhite;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        backgroundColor: bg,
        border: variant === "outline" ? `3px solid ${COLOR.outline}` : "none",
        padding: `${fontSize * 0.22}px ${fontSize * 0.44}px`,
        fontFamily: FONT.hero,
        fontSize,
        letterSpacing: "0.02em",
        color: fg,
        opacity: p,
        rotate: `${rotate}deg`,
        // wipe on from the left (motion #2)
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
      }}
    >
      {text}
    </div>
  );
};

/**
 * DataTable — the "WHERE THE MONEY GOES" block: a heading and rows of
 * label / value, rows landing one at a time.
 */
export const DataTable: React.FC<{
  title?: string;
  rows: { label: string; value: string; accent?: boolean }[];
  x: number;
  y: number;
  width?: number;
  entryFrame?: number;
  perRow?: number;
}> = ({ title, rows, x, y, width = 520, entryFrame = 0, perRow = 7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ position: "absolute", left: x, top: y, width }}>
      {title && (
        <div
          style={{
            fontFamily: FONT.hero,
            fontSize: 30,
            letterSpacing: "0.05em",
            color: COLOR.ink,
            marginBottom: 14,
            opacity: springIn({ frame, fps, delay: entryFrame, durationInFrames: 12 }),
          }}
        >
          {title}
        </div>
      )}
      {rows.map((r, i) => {
        const p = springIn({ frame, fps, delay: entryFrame + 6 + i * perRow, durationInFrames: 14 });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "9px 0",
              borderBottom: `1.5px solid ${COLOR.grid}`,
              opacity: p,
              translate: `${(1 - p) * -14}px 0px`,
            }}
          >
            <span style={{ fontFamily: FONT.sans, fontSize: 21, fontWeight: 500, letterSpacing: "0.06em", color: COLOR.grey, textTransform: "uppercase" }}>
              {r.label}
            </span>
            <span style={{ fontFamily: FONT.sans, fontSize: 23, fontWeight: 700, color: r.accent ? COLOR.orange : COLOR.ink, fontVariantNumeric: "tabular-nums" }}>
              {r.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
