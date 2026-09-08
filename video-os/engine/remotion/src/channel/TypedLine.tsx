import { useCurrentFrame } from "remotion";
import { FPS, TYPE } from "../tokens";

/**
 * TypedLine — §2.7 "The typed line": mono uppercase, 46px, letterspaced 0.06em,
 * typed character by character with a block cursor. The reversal uses this
 * (§2.9), and so does SignatureReturn.
 */
export const TypedLine: React.FC<{
  text: string;
  /** Frame typing starts. */
  start: number;
  /** Characters per second. */
  cps?: number;
  /** Keep the block cursor blinking after the line finishes. */
  cursorAfter?: boolean;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  start,
  cps = 22,
  cursorAfter = true,
  color = TYPE.typed.color,
  size = TYPE.typed.fontSize,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - start);
  const shown = Math.min(text.length, Math.floor((elapsed / FPS) * cps));
  const done = shown >= text.length;
  const blink = Math.floor((frame / (FPS / 2)) % 2) === 0;
  const showCursor = !done || (cursorAfter && blink);

  return (
    <span
      style={{
        fontFamily: TYPE.typed.fontFamily,
        fontSize: size,
        fontWeight: TYPE.typed.fontWeight,
        letterSpacing: TYPE.typed.letterSpacing,
        textTransform: TYPE.typed.textTransform,
        color,
        whiteSpace: "pre-wrap",
        ...style,
      }}
    >
      {text.slice(0, shown)}
      <span
        style={{
          display: "inline-block",
          width: "0.62em",
          height: "1.05em",
          marginLeft: "0.06em",
          transform: "translateY(0.16em)",
          backgroundColor: showCursor ? color : "transparent",
        }}
      />
    </span>
  );
};

/** Frames for a TypedLine of `len` chars at `cps` to finish. */
export const typedLineFrames = (len: number, cps = 22) =>
  Math.ceil((len / cps) * FPS);
