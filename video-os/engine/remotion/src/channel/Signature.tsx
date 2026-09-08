import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLOR, FONT, FPS, SPACE, TYPE } from "../tokens";
import { springIn } from "../parts/motion";

/**
 * Signature — TIER 7 (§6.4). The channel signature, B00.
 *
 *   Fixed words "Nothing is free." at 0:00, then the variable clause carrying the
 *   counter-intuitive claim, landing by 0:03. Audio stamp on the accent
 *   completion.
 *
 * THE FIXED WORDS ARE NEVER TAGGED WITH AN EMOTION. Flat, every episode, forever
 * — that is what makes them a signature (§6.4). This component renders them flat:
 * no spring overshoot, no colour move, no flourish.
 *
 * The variable clause is where the episode's hook lives. One accent (orange) on
 * the word that carries the claim (§2.4).
 */
export const Signature: React.FC<{
  /** e.g. "And the ticket was the cheapest thing you bought." */
  clause: string;
  /** Word(s) in the clause to set in orange — the one accent (§2.4). */
  accentWord?: string;
  /** Frame the clause begins to appear. Must land (fully in) by 0:03. */
  clauseStart?: number;
  /** A short stamp SFX fired when the accent lands (§6.4). public/ path or URL. */
  stampSrc?: string;
}> = ({ clause, accentWord, clauseStart = 24, stampSrc }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fixed words: flat fade, no overshoot. In by ~0.5s.
  const fixedIn = interpolate(frame, [0, 0.5 * FPS], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Variable clause: lands by 0:03.
  const landBy = Math.min(3 * FPS, durationInFrames - 1);
  const clauseIn = springIn({
    frame,
    fps,
    delay: clauseStart,
    durationInFrames: Math.max(8, landBy - clauseStart),
  });

  const stampFrame = landBy - 2;

  const words = clause.split(" ");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: SPACE.titleSafe.x,
        paddingRight: SPACE.titleSafe.x,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Fixed words — flat, forever. */}
        <div
          style={{
            ...TYPE.hero,
            fontSize: 176,
            color: COLOR.ink,
            opacity: fixedIn,
          }}
        >
          Nothing is free.
        </div>

        {/* Variable clause — the hook. */}
        <div
          style={{
            fontFamily: FONT.sans,
            fontWeight: TYPE.caption.fontWeight,
            fontSize: TYPE.caption.maxSize,
            lineHeight: 1.25,
            color: COLOR.ink,
            opacity: clauseIn,
            translate: `0px ${(1 - clauseIn) * 14}px`,
            maxWidth: 1180,
          }}
        >
          {words.map((w, i) => {
            const clean = w.replace(/[.,]/g, "");
            const isAccent =
              accentWord &&
              clean.toLowerCase() === accentWord.toLowerCase();
            return (
              <span key={i} style={{ color: isAccent ? COLOR.orange : undefined }}>
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>
      </div>

      {stampSrc ? (
        <Sequence from={stampFrame} name="signature-stamp">
          <Audio
            src={stampSrc.startsWith("http") ? stampSrc : staticFile(stampSrc)}
            delayRenderTimeoutInMilliseconds={30_000}
          />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
