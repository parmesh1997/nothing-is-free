import { AbsoluteFill } from "remotion";
import { COLOR, SPACE } from "../tokens";
import { TypedLine } from "./TypedLine";

/**
 * SignatureReturn — TIER 7 (§2.9, §6.4). The signature words return once, at the
 * reversal — "typeset, silent." No audio. On the inked Dark Law field the type
 * is light.
 */
export const SignatureReturn: React.FC<{
  /** Frame the words start typing (local to the beat). */
  start: number;
  onInk?: boolean;
  /** Render inline (caller positions it) rather than as a centered fill. */
  inline?: boolean;
}> = ({ start, onInk = true, inline = false }) => {
  const color = onInk ? "#E9E9E3" : COLOR.ink;

  const line = (
    <TypedLine
      text="NOTHING IS FREE."
      start={start}
      cps={16}
      color={color}
      size={92}
      cursorAfter
    />
  );

  if (inline) return line;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: SPACE.titleSafe.x,
        paddingRight: SPACE.titleSafe.x,
      }}
    >
      {line}
    </AbsoluteFill>
  );
};
