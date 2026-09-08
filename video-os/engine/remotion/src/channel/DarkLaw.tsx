import { AbsoluteFill } from "remotion";
import { COLOR, DARK_LAW, SPACE } from "../tokens";
import { TypedLine, typedLineFrames } from "./TypedLine";
import { SignatureReturn } from "./SignatureReturn";

/**
 * DarkLaw — TIER 7 (§2.9). Once per episode, at the reversal.
 *
 *   The paper field crossfades to ink #1A1A18 over 20 frames. The grid stays at
 *   8% white. The progress rule stays orange. Music stops. The reversal line
 *   types on in mono. The signature words return here — typeset, silent.
 *
 * The field crossfade + grid + progress rule are handled by <LockedField> /
 * <BeatFrame> when you pass `darkLawStartGlobalFrame`. This component is the
 * FOREGROUND of the reversal beat: the typed reversal line, then the signature
 * return. Music-stop / duck is a Resolve mix decision (§12.2), not done here.
 */
export const DarkLaw: React.FC<{
  /** The reversal sentence, e.g. "The counter never sold you popcorn." */
  reversalLine: string;
  /** Local frame the crossfade to ink begins (match darkLawStartGlobalFrame). */
  crossfadeAt?: number;
  /** Chars per second for the reversal line. */
  cps?: number;
}> = ({ reversalLine, crossfadeAt = 0, cps = 18 }) => {
  const lineStart = crossfadeAt + DARK_LAW.crossfadeFrames + 6;
  const lineDone = lineStart + typedLineFrames(reversalLine.length, cps);
  const signatureStart = lineDone + 18;

  return (
    <AbsoluteFill>
      {/* The reversal line types on in mono, upper third of the safe area. */}
      <div
        style={{
          position: "absolute",
          left: SPACE.titleSafe.x,
          right: SPACE.titleSafe.x,
          top: "34%",
        }}
      >
        <TypedLine
          text={reversalLine.toUpperCase()}
          start={lineStart}
          cps={cps}
          color="#E9E9E3"
          size={56}
          cursorAfter={false}
        />
      </div>

      {/* The signature words return below it — typeset, silent (§2.9, §6.4). */}
      <div
        style={{
          position: "absolute",
          left: SPACE.titleSafe.x,
          right: SPACE.titleSafe.x,
          top: "56%",
        }}
      >
        <SignatureReturn start={signatureStart} onInk inline />
      </div>

      {/* Keep the dark frame intentional even though Dark Law frames are exempt
          from occupancy (§11.5). */}
      <div
        style={{
          position: "absolute",
          left: SPACE.safe.x,
          bottom: SPACE.safe.y + 8,
          width: 3,
          height: 120,
          backgroundColor: COLOR.orange,
        }}
      />
    </AbsoluteFill>
  );
};
