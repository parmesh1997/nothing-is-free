import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, SUPPORT, WIDTH, HEIGHT, softShadow, tint } from "../../tokens";
import { SANS } from "./fonts4";
import { DUR, enterT, exitT } from "./language";

/**
 * PhoneTap — the "functionality" a tap beat needs (creator, 2026-09-03: "the
 * location is there but the functionality is not there… act like a storyteller…
 * you are making a tap"). A readable phone floats beside Lucky: an app screen,
 * a thumb comes in and presses a button, the button reacts, and the screen
 * turns over to what actually happens (an ad loads / a permission dialog).
 *
 *   <PhoneTap at={4} tapAt={vo.at("tap")} screen="app" x={WIDTH*0.6} />
 */
export const PhoneTap: React.FC<{
  at: number;
  tapAt: number;
  /** what the screen shows before the tap. */
  screen?: "app" | "allow" | "ad";
  x?: number;
  y?: number;
  /** total width of the phone in px. */
  w?: number;
  out?: number;
  label?: string;
}> = ({ at, tapAt, screen = "app", x = WIDTH * 0.62, y = HEIGHT * 0.36, w = 140, out }) => {
  const frame = useCurrentFrame();
  const inT = enterT(frame, at, DUR.big);
  const outT = out === undefined ? 1 : exitT(frame, out, DUR.enter);
  // once the tap is done, the phone shrinks + dims — it's "handled, set aside",
  // not a giant static element beside Lucky (creator 2026-09-04: the phone read
  // too big / clumsy).
  const rest = interpolate(frame, [tapAt + 44, tapAt + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const restScale = 1 - rest * 0.36;
  const vis = inT * outT * (1 - rest * 0.5);
  if (vis <= 0.01) return null;

  // "we go into it, and we come back" (creator 2026-09-03) — a quick push toward
  // the phone across the tap, then ease back, so the interaction has a beat.
  const pushIn = interpolate(
    frame,
    [tapAt - 22, tapAt - 4, tapAt + 14, tapAt + 40],
    [1, 1.16, 1.16, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  ) * restScale;

  const h = w * 2.02;
  const screenX = x - w / 2 + w * 0.06;
  const screenY = y - h / 2 + w * 0.09;
  const sw = w * 0.88;
  const sh = h - w * 0.18;

  // thumb: slides in from the lower-right, presses at tapAt, releases
  const thumbP = interpolate(frame, [tapAt - 26, tapAt - 2, tapAt + 6, tapAt + 22], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pressed = frame >= tapAt - 2 && frame < tapAt + 8;
  const ripple = interpolate(frame, [tapAt, tapAt + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flipped = frame > tapAt + 6; // screen turns over to "what happens"

  const btnY = screenY + sh * 0.72;
  const btnX = screenX + sw * 0.5;
  const btnW = sw * 0.66;
  const btnH = sh * 0.13;

  const preLabel = screen === "allow" ? "Allow tracking?" : screen === "ad" ? "Loading…" : "Continue";
  const postLabel = screen === "allow" ? "Sharing your data" : "Ad loaded";

  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, pointerEvents: "none", scale: pushIn.toFixed(3), transformOrigin: `${((x / WIDTH) * 100).toFixed(1)}% ${((y / HEIGHT) * 100).toFixed(1)}%` }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ overflow: "visible" }}>
        {/* body */}
        <g style={{ filter: softShadow(1.3, 0.22) }}>
          <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={w * 0.14} fill={COLOR.ink} />
          <rect x={screenX} y={screenY} width={sw} height={sh} rx={w * 0.05} fill={flipped ? tint(SUPPORT.teal, 0.82) : COLOR.cardWhite} />
        </g>

        {/* screen content */}
        {!flipped ? (
          <g>
            {/* status bar + app title */}
            <rect x={screenX} y={screenY} width={sw} height={sh * 0.09} fill={tint(SUPPORT.teal, 0.35)} />
            <circle cx={screenX + sw * 0.12} cy={screenY + sh * 0.19} r={sw * 0.07} fill={COLOR.orange} />
            <rect x={screenX + sw * 0.24} y={screenY + sh * 0.15} width={sw * 0.44} height={sh * 0.05} rx={3} fill={COLOR.ink} opacity={0.7} />
            <rect x={screenX + sw * 0.24} y={screenY + sh * 0.23} width={sw * 0.3} height={sh * 0.03} rx={3} fill={COLOR.grid} />
            {/* content rows */}
            <rect x={screenX + sw * 0.1} y={screenY + sh * 0.34} width={sw * 0.8} height={sh * 0.24} rx={8} fill={tint(SUPPORT.mustard, 0.45)} stroke={COLOR.grid} strokeWidth={2} />
            <rect x={screenX + sw * 0.1} y={screenY + sh * 0.62} width={sw * 0.55} height={sh * 0.04} rx={3} fill={COLOR.grid} />
            {/* the button */}
            <rect x={btnX - btnW / 2} y={btnY - btnH / 2 + (pressed ? 3 : 0)} width={btnW} height={btnH} rx={btnH / 2} fill={COLOR.orange} opacity={pressed ? 0.86 : 1} />
            <text x={btnX} y={btnY + btnH * 0.18 + (pressed ? 3 : 0)} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={btnH * 0.46} fill={COLOR.cardWhite}>
              {preLabel}
            </text>
            {ripple > 0 && ripple < 1 && (
              <circle cx={btnX} cy={btnY} r={ripple * btnW * 0.7} fill="none" stroke={COLOR.orange} strokeWidth={3} opacity={(1 - ripple) * 0.8} />
            )}
          </g>
        ) : (
          <g>
            <rect x={screenX + sw * 0.1} y={screenY + sh * 0.16} width={sw * 0.8} height={sh * 0.4} rx={8} fill="rgba(255,255,255,0.22)" />
            <text x={screenX + sw / 2} y={screenY + sh * 0.39} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={sh * 0.055} letterSpacing="0.04em" fill={COLOR.cardWhite}>
              {postLabel}
            </text>
            {/* data / an ad streaming out toward the world */}
            {[0, 1, 2, 3].map((i) => {
              const p = interpolate(frame, [tapAt + 8 + i * 6, tapAt + 46 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <rect
                  key={i}
                  x={screenX + sw * 0.5 - 9 + p * (w * 1.2)}
                  y={screenY + sh * 0.66 + i * 15 - p * 10}
                  width={18}
                  height={12}
                  rx={2}
                  fill={i === 0 ? COLOR.orange : COLOR.cardWhite}
                  stroke={COLOR.ink}
                  strokeWidth={1.5}
                  opacity={(1 - p) * 0.95}
                />
              );
            })}
          </g>
        )}

        {/* the thumb */}
        {thumbP > 0.02 && (
          <g transform={`translate(${btnX + (1 - thumbP) * 120}, ${btnY + (1 - thumbP) * 150 + (pressed ? -4 : 0)})`}>
            <path
              d="M 0 46 Q -6 4 22 -2 Q 40 -6 44 14 L 44 46 Q 44 74 22 78 Q -2 78 0 46 Z"
              fill={tint(COLOR.tan, 0.1)}
              stroke={COLOR.ink}
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path d="M 22 -2 Q 8 -18 20 -30 Q 34 -22 30 -2" fill={tint(COLOR.tan, 0.1)} stroke={COLOR.ink} strokeWidth={3} />
          </g>
        )}
      </svg>
    </div>
  );
};
