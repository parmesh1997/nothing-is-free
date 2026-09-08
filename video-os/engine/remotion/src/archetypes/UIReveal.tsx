import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT } from "../tokens";
import { springIn } from "../parts/motion";
import { CountUp } from "../parts/CountUp";
import { Bloom } from "../parts/Bloom";

/**
 * UIReveal — the interface is the performer (v2.0 §5.6, §Step 6 archetype).
 *
 *   skeleton fills fade in → rows populate (typewriter / count-up)
 *     → cursor enters, moves to a target → interaction pulse (click)
 *       → a value lands, held
 *
 * NIF's workhorse for platform/checkout/fee-page beats. All code, plane-rule
 * legal at any plane. Composable from <UICard> / <UIRow> / <UICursor> /
 * <UIButton>, or driven declaratively from a spec via <UIReveal>.
 *
 * The card is drawn in the channel `card` colour with an `ink` outline; content
 * is `ink` / `grey`; the ONE accent per frame is reserved for the landing value.
 */

// ─────────────────────────────────────────────────────────────────────────────

export const UICard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  /** Frame the skeleton appears; it fills to solid over ~14f. */
  at?: number;
  title?: string;
  titleAt?: number;
  rounded?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, at = 0, title, titleAt, rounded = 18, children }) => {
  const frame = useCurrentFrame();
  const build = springIn({ frame, fps: 30, delay: at, durationInFrames: 14 });
  const solid = interpolate(frame, [at + 6, at + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (build <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: rounded,
        border: `${2.5}px solid ${COLOR.ink}`,
        background: interpolateBg(solid),
        opacity: Math.min(1, build),
        scale: String(0.96 + 0.04 * Math.min(1, build)),
        transformOrigin: "50% 60%",
        overflow: "hidden",
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: Math.round(w * 0.05),
            letterSpacing: "0.08em",
            color: COLOR.ink,
            padding: `${rounded}px ${rounded * 1.2}px 0`,
            opacity: interpolate(frame, [(titleAt ?? at + 10), (titleAt ?? at + 10) + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export type UIRowSpec = {
  at: number;
  label: string;
  /** static string (types on) or a number (counts up) */
  value: string | number;
  /** for a numeric value */
  to?: number;
  landAt?: number;
  format?: (n: number) => string;
  /** land with an accent + a Bloom pulse (the ONE accent) */
  accent?: boolean;
};

export const UIRow: React.FC<
  UIRowSpec & { x: number; y: number; w: number; rowH: number }
> = ({ at, label, value, to, landAt, format, accent, x, y, w, rowH }) => {
  const frame = useCurrentFrame();
  const skel = interpolate(frame, [at, at + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fill = interpolate(frame, [at + 6, at + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (skel <= 0.01) return null;

  const numeric = typeof value === "number";
  const land = landAt ?? at + 16;
  const valColor = accent ? COLOR.orange : COLOR.ink;

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: rowH, opacity: skel }}>
      <div
        style={{
          fontFamily: FONT.mono,
          fontSize: rowH * 0.34,
          letterSpacing: "0.06em",
          color: COLOR.grey,
        }}
      >
        {label}
      </div>
      {/* skeleton bar under the value, fades as the value fills */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: rowH * 0.5,
          width: w * 0.72,
          height: rowH * 0.3,
          borderRadius: 4,
          background: COLOR.grey,
          opacity: 0.5 * (1 - fill),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: rowH * 0.44,
          fontFamily: numeric ? FONT.sans : FONT.mono,
          fontWeight: numeric ? 700 : 500,
          fontSize: rowH * (numeric ? 0.5 : 0.4),
          color: valColor,
          opacity: fill,
        }}
      >
        {numeric ? (
          <>
            {accent && (
              <Bloom
                window={[land - 8, land + 4, land + 44, land + 66]}
                radius={rowH * 1.1}
                x={rowH * 1.6}
                y={rowH * 0.28}
                intensity={0.7}
              />
            )}
            <CountUp
              from={0}
              to={to ?? (value as number)}
              start={at + 4}
              end={land}
              format={format ?? ((n) => n.toFixed(2))}
              size={rowH * 0.5}
              accent={!!accent}
            />
          </>
        ) : (
          <>
            {typewrite(String(value), frame, at + 6, 26)}
            {frame >= at + 6 &&
              typewrite(String(value), frame, at + 6, 26).length < String(value).length && (
                <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2 }}>▍</span>
              )}
          </>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const UICursor: React.FC<{
  enterAt: number;
  /** entry corner */
  from?: "br" | "bl" | "tr" | "tl";
  /** where it settles */
  to: { x: number; y: number };
  /** frame it "clicks" — a tap ring pulses */
  clickAt?: number;
  size?: number;
}> = ({ enterAt, from = "br", to, clickAt, size = 30 }) => {
  const frame = useCurrentFrame();
  const p = springIn({ frame, fps: 30, delay: enterAt, durationInFrames: 24 });
  if (p <= 0.01) return null;

  const off = { br: [220, 220], bl: [-220, 220], tr: [220, -220], tl: [-220, -220] }[from];
  const x = to.x + off[0] * (1 - Math.min(1, p));
  const y = to.y + off[1] * (1 - Math.min(1, p));
  const click = clickAt != null
    ? interpolate(frame, [clickAt, clickAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const press = clickAt != null && frame >= clickAt && frame < clickAt + 6 ? 0.85 : 1;

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      {click > 0 && click < 1 && (
        <circle cx={x} cy={y} r={size * (0.6 + click * 1.8)} fill="none" stroke={COLOR.ink} strokeWidth={2} opacity={1 - click} />
      )}
      <g transform={`translate(${x} ${y}) scale(${press})`} opacity={Math.min(1, p)}>
        <path d={`M 0 0 L 0 ${size} L ${size * 0.28} ${size * 0.74} L ${size * 0.46} ${size * 1.06} L ${size * 0.62} ${size * 0.98} L ${size * 0.44} ${size * 0.66} L ${size * 0.8} ${size * 0.66} Z`} fill={COLOR.ink} stroke={COLOR.cardWhite} strokeWidth={1.5} strokeLinejoin="round" />
      </g>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const UIButton: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  at: number;
  pulseAt?: number;
  variant?: "primary" | "ghost";
}> = ({ x, y, w, h, label, at, pulseAt, variant = "primary" }) => {
  const frame = useCurrentFrame();
  const p = springIn({ frame, fps: 30, delay: at, durationInFrames: 14 });
  if (p <= 0.01) return null;
  const pulse =
    pulseAt != null
      ? 1 + 0.06 * interpolate(frame, [pulseAt, pulseAt + 5, pulseAt + 12], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: h * 0.24,
        background: variant === "primary" ? COLOR.ink : "transparent",
        border: `2px solid ${COLOR.ink}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT.sans,
        fontWeight: 600,
        fontSize: h * 0.4,
        color: variant === "primary" ? COLOR.cardWhite : COLOR.ink,
        opacity: Math.min(1, p),
        scale: String(pulse),
      }}
    >
      {label}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/** Declarative orchestrator — a card + rows + optional cursor + button. */
export const UIReveal: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at?: number;
  title?: string;
  rows: UIRowSpec[];
  button?: { label: string; at: number; pulseAt?: number };
  cursor?: { enterAt: number; from?: "br" | "bl" | "tr" | "tl"; clickAt?: number; toRow?: number };
}> = ({ x, y, w, h, at = 0, title, rows, button, cursor }) => {
  const pad = w * 0.08;
  const rowH = Math.min(h * 0.13, 58);
  const rowGap = rowH * 1.5;
  const rowsTop = y + (title ? h * 0.2 : h * 0.1);

  const btn = button && { x: x + pad, y: y + h - rowH * 1.7, w: w - pad * 2, h: rowH * 1.2 };
  const cursorTo = cursor
    ? cursor.toRow != null
      ? { x: x + pad + w * 0.4, y: rowsTop + cursor.toRow * rowGap + rowH * 0.5 }
      : btn
        ? { x: btn.x + btn.w / 2, y: btn.y + btn.h / 2 }
        : { x: x + w / 2, y: y + h / 2 }
    : null;

  const rowTopInCard = (title ? h * 0.2 : h * 0.1);

  return (
    <>
      <UICard x={x} y={y} w={w} h={h} at={at} title={title}>
        {rows.map((r, i) => (
          <UIRow key={i} {...r} x={pad} y={rowTopInCard + i * rowGap} w={w - pad * 2} rowH={rowH} />
        ))}
      </UICard>
      {btn && button && <UIButton {...btn} label={button.label} at={button.at} pulseAt={button.pulseAt} />}
      {cursor && cursorTo && <UICursor enterAt={cursor.enterAt} from={cursor.from} to={cursorTo} clickAt={cursor.clickAt} />}
    </>
  );
};

// ── helpers ──────────────────────────────────────────────────────────────────

const interpolateBg = (solid: number): string => {
  // grey skeleton → card colour
  const s = parseInt((COLOR.grey ?? "#6D6A63").replace("#", ""), 16);
  const c = parseInt((COLOR.cardWhite).replace("#", ""), 16);
  const mix = (a: number, b: number) => Math.round(a + (b - a) * solid);
  return `rgb(${mix((s >> 16) & 255, (c >> 16) & 255)}, ${mix((s >> 8) & 255, (c >> 8) & 255)}, ${mix(s & 255, c & 255)})`;
};

/** chars shown of `text`, typing at `cps` characters per second from `start`. */
const typewrite = (text: string, frame: number, start: number, cps: number): string => {
  const shown = Math.max(0, Math.floor(((frame - start) / 30) * cps));
  return text.slice(0, Math.min(text.length, shown));
};
