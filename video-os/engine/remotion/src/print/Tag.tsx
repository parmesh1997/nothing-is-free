import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, EDGE, FONT, shade } from "../tokens";
import { springIn } from "../parts/motion";

/**
 * Tag — a hand-torn price / label tag connected to an object by a thin line
 * (the "$1.ce" pattern from the reference). Flat colour, sticker edge, a
 * little rotation for the pinned-on feel.
 *
 * `to` is the point on the object the leader line runs to (composition space);
 * the tag sits at (x, y).
 */
export const Tag: React.FC<{
  text: string;
  x: number;
  y: number;
  to?: { x: number; y: number };
  color?: string;
  rotate?: number;
  entryFrame?: number;
  size?: number;
}> = ({ text, x, y, to, color = COLOR.cardWhite, rotate = -4, entryFrame = 0, size = 34 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springIn({ frame, fps, delay: entryFrame, durationInFrames: 16 });

  const padX = size * 0.7;
  const w = text.length * size * 0.62 + padX * 2 + size * 0.9;
  const h = size * 1.9;
  const notch = h * 0.5;

  return (
    <>
      {to ? (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line
            x1={x}
            y1={y + h / 2}
            x2={to.x}
            y2={to.y}
            stroke={COLOR.ink}
            strokeWidth={2}
            strokeDasharray="1 0"
            opacity={p}
          />
          <circle cx={to.x} cy={to.y} r={5} fill={COLOR.ink} opacity={p} />
        </svg>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          opacity: p,
          rotate: `${rotate}deg`,
          scale: String(0.9 + 0.1 * p),
        }}
      >
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
          {/* sticker edge */}
          <path d={tagPath(w, h, notch, EDGE.color, 3)} fill={EDGE.color} />
          {/* tag body */}
          <path d={tagPath(w, h, notch, color, 0)} fill={color} stroke={shade(color, 0.25)} strokeWidth={1.5} />
          {/* string hole */}
          <circle cx={notch * 0.55} cy={h / 2} r={h * 0.09} fill={COLOR.paper} stroke={shade(color, 0.3)} strokeWidth={1.5} />
          <text
            x={notch + padX * 0.6}
            y={h / 2}
            dominantBaseline="central"
            fontFamily={FONT.hero}
            fontWeight={700}
            fontSize={size}
            fill={COLOR.ink}
          >
            {text}
          </text>
        </svg>
      </div>
    </>
  );
};

const tagPath = (w: number, h: number, notch: number, _c: string, grow: number) =>
  `M ${notch - grow} ${-grow}
   L ${w + grow} ${-grow}
   L ${w + grow} ${h + grow}
   L ${notch - grow} ${h + grow}
   L ${-grow} ${h / 2}
   Z`;
