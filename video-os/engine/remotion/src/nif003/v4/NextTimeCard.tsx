import { useCurrentFrame } from "remotion";
import { COLOR, shade } from "../../tokens";
import { Typewriter } from "../../nif002/v4/KineticText";
import { SANS } from "../../nif002/v4/fonts4";
import { enterT, DUR } from "../../nif002/v4/language";

/**
 * NextTimeCard — the episode-ending "next time" reveal (creator, 2026-09-05:
 * "instead of fading out, make sure that we are having the black […] orange
 * black with the orange prints and tell that this is the next topic […]
 * what exactly that sub topic" — not a vague cinematic sting, the actual
 * next episode's subject typeset on screen). Scope, confirmed same session:
 * "just the ending" of the beat that bridges to it, and "from now on,
 * shared" — this component, not a one-off, is what every future NIF episode
 * reaches for at its own bridge beat.
 *
 * Black, NOT flat — a black-to-orange gradient ("black grades, orange
 * grades") sweeping in from one corner. Holds on screen long enough to
 * actually be read (the creator's own complaint about the old plan: "not
 * just a music and that cinematic release").
 */
export const NextTimeCard: React.FC<{
  /** 0..1 — drive this from the beat's own tail interpolation. */
  show: number;
  /** the next episode's real subject, e.g. "GOOGLE MAPS". */
  topic: string;
  kicker?: string;
  /** local frame the topic starts typing (only meaningful once `show` > 0). */
  typeAt: number;
}> = ({ show, topic, kicker = "NEXT TIME", typeAt }) => {
  const frame = useCurrentFrame();
  const breathe = 1 + 0.012 * Math.sin(frame / 28);
  const light = "#F4EFE2";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: show,
        pointerEvents: "none",
        background: `linear-gradient(128deg, #0b0704 0%, #1c0f07 38%, ${shade(COLOR.orange, 0.28)} 78%, ${COLOR.orange} 132%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: "0.4em",
          color: COLOR.orange,
          opacity: enterT(frame, typeAt - 20, DUR.enter),
        }}
      >
        {kicker}
      </div>
      <div style={{ marginTop: 20, transform: `scale(${breathe})` }}>
        <Typewriter text={topic} at={typeAt} cps={16} size={112} mono={false} color={light} />
      </div>
    </div>
  );
};
