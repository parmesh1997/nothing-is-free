import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, FONT, TYPE } from "../tokens";
import { springIn } from "../parts/motion";

/**
 * Callout — a data callout: an orange icon chip + a big value + a small label
 * beneath (the "$116 PER BARREL" pattern from the reference). Flat — never
 * halftoned, never an offset stroke (§2.5, §2.6).
 *
 * Pass `value` as a string, or `valueNode` (e.g. a <CountUp/>) for a ticking
 * figure.
 */
export const Callout: React.FC<{
  value?: string;
  valueNode?: React.ReactNode;
  label: string;
  x: number;
  y: number;
  icon?: React.ReactNode;
  entryFrame?: number;
  valueSize?: number;
}> = ({ value, valueNode, label, x, y, icon, entryFrame = 0, valueSize = 108 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springIn({ frame, fps, delay: entryFrame, durationInFrames: 18 });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: p,
        translate: `${-20 * (1 - p)}px 0px`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {icon ? (
          <div
            style={{
              width: 66,
              height: 66,
              backgroundColor: COLOR.orange,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        ) : null}
        {valueNode ?? (
          <span
            style={{
              fontFamily: FONT.hero,
              fontWeight: 700,
              fontSize: valueSize,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: COLOR.ink,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </span>
        )}
      </div>
      <span style={{ ...TYPE.unit, fontSize: 26, marginLeft: icon ? 86 : 0 }}>
        {label}
      </span>
    </div>
  );
};

/** A simple oil-barrel glyph for the callout chip. */
export const BarrelGlyph: React.FC = () => (
  <svg width={34} height={40} viewBox="0 0 34 40">
    <rect x={4} y={2} width={26} height={36} rx={3} fill={COLOR.cardWhite} />
    <rect x={4} y={10} width={26} height={4} fill={COLOR.orange} />
    <rect x={4} y={26} width={26} height={4} fill={COLOR.orange} />
    <circle cx={17} cy={20} r={5} fill={COLOR.ink} />
  </svg>
);
