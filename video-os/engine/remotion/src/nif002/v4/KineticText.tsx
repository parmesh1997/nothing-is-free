import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, FONT, HEIGHT, WIDTH } from "../../tokens";
import { SANS, PUNCH } from "./fonts4";
import { DUR, STAGGER, enterT, exitT, focusPull, landPop, lifeT } from "./language";

/**
 * KineticText.tsx — the v4 text language.
 *
 *   <KineticLine>  narration: words SETTLE IN one at a time (rise + fade, 2f
 *                  stagger, eased OUT), synced to the VO. Floats on the cream —
 *                  no lower-third band. Hanken Grotesk, sentence case.
 *   <Typewriter>   in-world typed text ONLY (a search field, a form, a screen).
 *   <PunchWord>    a single hero word — ORANGE, Bebas Neue, focus-pull entrance,
 *                  ≤2% pop (creator 2026-09-03: "the deep text… make it orange…
 *                  everything [punch] in Bebas Neue"). The copper metal is gone.
 *   <PunchBlock>   the punch + its label, stacked with real clearance and its
 *                  own soft plate so NOTHING overlaps it (creator: "some are
 *                  overlapping on each other").
 */

/** a soft warm halo so text stays legible on the cream — not a slab. */
const halo = (r = 26): React.CSSProperties => ({
  textShadow: `0 0 ${r}px rgba(246,242,231,0.95), 0 0 ${r * 0.4}px rgba(246,242,231,0.98), 0 1px 2px rgba(38,30,22,0.16)`,
});

const punchStyle = (size: number): React.CSSProperties => ({
  fontFamily: PUNCH,
  fontWeight: 400,
  fontSize: size,
  lineHeight: 0.98,
  letterSpacing: "0.01em",
  textTransform: "uppercase",
  color: COLOR.orange,
});

// ─────────────────────────────────────────────────────────────────────────────

export const PunchWord: React.FC<{
  children: string;
  at: number;
  out?: number;
  size?: number;
  /** kept for call-site compat; ignored (no more metal). */
  metal?: boolean;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, at, out, size = 150, color = COLOR.orange, style }) => {
  const frame = useCurrentFrame();
  const fp = focusPull(frame, at, DUR.hero);
  const settleOut = out === undefined ? 1 : exitT(frame, out, DUR.enter);
  const pop = landPop(frame, at);

  return (
    <span
      style={{
        ...punchStyle(size),
        color,
        display: "inline-block",
        opacity: fp.opacity * settleOut,
        scale: String(pop),
        filter: `blur(${fp.blur}px)`,
        ...halo(size * 0.42),
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * PunchBlock — the deep-text moment, anchored in the reserved BOTTOM TEXT LANE
 * (creator: "the deep text… in the bottom 20%… never interacts with the images").
 * A small kicker, the orange Bebas punch, an optional sub — stacked over a soft
 * cream plate that stays inside the lane. `y` is ignored now (kept for compat).
 */
export const PunchBlock: React.FC<{
  punch: string;
  at: number;
  out?: number;
  kicker?: string;
  sub?: string;
  size?: number;
  y?: number;
  color?: string;
}> = ({ punch, at, out, kicker, sub, size = 132, color = COLOR.orange }) => {
  const frame = useCurrentFrame();
  const fp = focusPull(frame, at, DUR.hero);
  const settleOut = out === undefined ? 1 : exitT(frame, out, DUR.enter);
  const pop = landPop(frame, at);
  const kIn = lifeT(frame, at - 8, out, DUR.enter, DUR.enter);
  const sIn = lifeT(frame, at + 8, out, DUR.enter, DUR.enter);
  // the punch stays INSIDE the reserved bottom lane (creator 2026-09-04:
  // "the text … doesn't need to overlap … readable"). The real cap is the
  // lane height — a kicker and/or a sub each buy a smaller punch — and long
  // punches still shrink to fit one line.
  const extras = (kicker ? 1 : 0) + (sub ? 1 : 0);
  const laneCap = extras >= 2 ? HEIGHT * 0.098 : extras === 1 ? HEIGHT * 0.12 : HEIGHT * 0.145;
  const fs = Math.min(size, laneCap, Math.max(60, (WIDTH * 0.9) / (punch.length * 0.6)));
  const kfs = Math.max(17, fs * 0.16);
  const sfs = Math.max(19, fs * 0.2);
  const vis = fp.opacity * settleOut;

  // each element bottom-anchored independently, so the sub can NEVER push the
  // punch off the frame edge (creator 2026-09-04: "AUCTION" was clipping).
  // The parent V4Beat "push" scales this lane about origin 50%/42%, so a tight
  // 1–2% margin scaled up to ~1.04 dropped the sub off the bottom edge (B27
  // "and the next one finds you." was clipping). Keep the sub at title-safe.
  const subBottom = sub ? HEIGHT * 0.045 : 14;
  const punchBottom = sub ? subBottom + sfs * 1.5 + 8 : HEIGHT * 0.05;
  const kickerBottom = punchBottom + fs + 8;
  const at0: React.CSSProperties = { position: "absolute", left: 0, right: 0, textAlign: "center", pointerEvents: "none" };

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: HEIGHT * 0.26,
          background: "linear-gradient(0deg, rgba(246,242,231,0.97) 0%, rgba(246,242,231,0.9) 52%, rgba(246,242,231,0) 100%)",
          opacity: vis ** 0.5,
          pointerEvents: "none",
        }}
      />
      {kicker && (
        <div style={{ ...at0, bottom: kickerBottom, fontFamily: SANS, fontWeight: 700, fontSize: kfs, letterSpacing: "0.2em", textTransform: "uppercase", color: COLOR.grey, opacity: kIn }}>
          {kicker}
        </div>
      )}
      <div style={{ ...at0, bottom: punchBottom, ...punchStyle(fs), color, opacity: vis, scale: String(pop), filter: `blur(${fp.blur}px)`, whiteSpace: "nowrap", ...halo(fs * 0.36) }}>
        {punch}
      </div>
      {sub && (
        <div style={{ ...at0, bottom: subBottom, fontFamily: SANS, fontWeight: 600, fontSize: sfs, color: COLOR.ink, opacity: sIn, ...halo(sfs) }}>
          {sub}
        </div>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

type LinePart = string | { punch: string; metal?: boolean };

export const KineticLine: React.FC<{
  text: string | LinePart[];
  at: number;
  stagger?: number;
  out?: number;
  size?: number;
  color?: string;
  align?: "left" | "center" | "right";
  maxWidth?: number;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ text, at, stagger = STAGGER, out, size = 44, color = COLOR.ink, align = "left", maxWidth, glow = true, style }) => {
  const frame = useCurrentFrame();

  const parts: LinePart[] = typeof text === "string" ? [text] : text;
  const words: { w: string; punch: boolean }[] = [];
  for (const part of parts) {
    if (typeof part === "string") {
      for (const w of part.split(/\s+/).filter(Boolean)) words.push({ w, punch: false });
    } else {
      words.push({ w: part.punch, punch: true });
    }
  }

  const settleOut = out === undefined ? 1 : exitT(frame, out, DUR.enter);

  return (
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.3,
        letterSpacing: "-0.005em",
        color,
        textAlign: align,
        maxWidth,
        opacity: settleOut,
        ...(glow ? halo(size * 0.5) : null),
        ...style,
      }}
    >
      {words.map((it, i) => {
        const wordAt = at + i * stagger;
        const t = enterT(frame, wordAt, DUR.enter);
        if (it.punch) {
          return (
            <span
              key={i}
              style={{
                fontFamily: PUNCH,
                fontWeight: 400,
                fontSize: size * 1.22,
                letterSpacing: "0.01em",
                textTransform: "uppercase",
                color: COLOR.orange,
                display: "inline-block",
                margin: "0 0.14em",
                opacity: t,
                translate: `0px ${(1 - t) * 12}px`,
              }}
            >
              {it.w}
            </span>
          );
        }
        return (
          <span key={i} style={{ display: "inline-block", margin: "0 0.14em", opacity: t, translate: `0px ${(1 - t) * 10}px` }}>
            {it.w}
          </span>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const Typewriter: React.FC<{
  text: string;
  at: number;
  cps?: number;
  size?: number;
  color?: string;
  mono?: boolean;
  caret?: boolean;
  style?: React.CSSProperties;
}> = ({ text, at, cps = 32, size = 30, color = COLOR.ink, mono = true, caret = true, style }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor(((frame - at) / 30) * cps));
  const shown = text.slice(0, Math.min(text.length, n));
  const done = n >= text.length;
  const blink = caret && (!done || Math.floor(frame / 16) % 2 === 0);
  return (
    <span
      style={{
        fontFamily: mono ? FONT.mono : SANS,
        fontSize: size,
        letterSpacing: mono ? "0.02em" : "0.01em",
        color,
        whiteSpace: "pre",
        ...style,
      }}
    >
      {shown}
      {blink ? <span style={{ opacity: 0.7 }}>▍</span> : null}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

type LineText = Parameters<typeof KineticLine>[0]["text"];

export type LaneItem = {
  /** a narration caption … */
  text?: LineText;
  /** … OR a punch (orange Bebas, its own kicker/sub). */
  punch?: string;
  /** the frame it should appear (word time from `vo.at`). */
  at: number;
  kicker?: string;
  sub?: string;
  size?: number;
  color?: string;
};

/**
 * Lane — owns the reserved BOTTOM TEXT LANE for a whole beat (creator 2026-09-04:
 * "the text doesn't need to overlap … make sure it is readable"). Give it the
 * beat's narration + punches, in order, with only each item's `at`. It then:
 *
 *   · shows EXACTLY ONE item at a time — each runs until the next item's `at`
 *     (minus a short handoff), so a wrong word-time can shift an item early or
 *     late but can NEVER stack two lines on top of each other;
 *   · clears the LAST item `tail` frames before the cut, so every beat ends on
 *     clean space (creator: "at the end … we have the white space also");
 *   · crossfades ≤ ~8f at each handoff so items don't hard-pop.
 *
 * A beat: `<Lane items={[{text:"…", at:…}, {punch:"YOU", kicker:"…", at:…}]} />`.
 */
export const Lane: React.FC<{
  items: LaneItem[];
  /** clean frames to leave before the cut. default 30 (≈ 1.0 s). */
  tail?: number;
  /** gap between one item ending and the next starting. default 8. */
  handoff?: number;
  /** force the last item to clear by this frame (default durationInFrames − tail).
   *  use when a bespoke visual takes over the frame before the beat ends. */
  endAt?: number;
}> = ({ items, tail = 30, handoff = 8, endAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const sorted = items.filter((it) => it && (it.text !== undefined || it.punch)).sort((a, b) => a.at - b.at);
  if (!sorted.length) return null;

  const lastOut = endAt ?? durationInFrames - tail;
  const spans = sorted.map((it, i) => {
    const next = sorted[i + 1];
    const rawOut = next ? next.at - handoff : lastOut;
    return { it, inF: it.at, outF: Math.max(it.at + 14, rawOut) };
  });

  // active = the last item that has started; the one before it lingers only for
  // a brief crossfade. never more than two on screen, never two at full opacity.
  let active = -1;
  for (let i = 0; i < spans.length; i++) if (frame >= spans[i].inF - 6) active = i;
  if (active < 0) return null;

  return (
    <>
      {spans.map(({ it, inF, outF }, idx) => {
        const isActive = idx === active;
        const isTail = idx === active - 1 && frame < outF + 12;
        if (!isActive && !isTail) return null;

        if (it.punch) {
          return (
            <PunchBlock
              key={idx}
              punch={it.punch}
              kicker={it.kicker}
              sub={it.sub}
              size={it.size ?? 132}
              color={it.color}
              at={inF}
              out={outF}
            />
          );
        }
        return (
          <KineticLine
            key={idx}
            text={it.text as LineText}
            at={inF}
            out={outF}
            size={it.size ?? 38}
            color={it.color ?? COLOR.ink}
            align="left"
            maxWidth={WIDTH * 0.66}
            glow={!it.color}
            style={{ position: "absolute", left: 132, right: 132, bottom: HEIGHT * 0.052 }}
          />
        );
      })}
    </>
  );
};
