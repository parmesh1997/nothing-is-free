import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, HEIGHT, WIDTH, shade, tint } from "../tokens";

/**
 * Ocean — a procedural code-native sea (§1.1: "Ocean plate with alpha →
 * Procedural SVG wave bands with parallax").
 *
 * Layered sine bands scrolling at their own linear rates — grid drift and wave
 * bands are the ONLY things allowed to move linearly (§4.1). Toned to sit in the
 * print world: graphite + ink with a few light crests.
 *
 * `layer="back"` draws the full sea; `layer="front"` draws only the nearest
 * crest bands, to be rendered IN FRONT of a ship so it sits in the water.
 */
export const Ocean: React.FC<{
  yFraction?: number;
  layer?: "back" | "front";
}> = ({ yFraction = 0.72, layer = "back" }) => {
  const frame = useCurrentFrame();
  const waterline = HEIGHT * yFraction;

  const allBands = [
    { amp: 9, len: 560, speed: 0.7, y: -8, fill: tint(COLOR.teal, 0.35), opacity: 1, near: false },
    { amp: 14, len: 720, speed: 1.3, y: 20, fill: tint(COLOR.teal, 0.15), opacity: 1, near: false },
    { amp: 20, len: 900, speed: 2.2, y: 58, fill: COLOR.teal, opacity: 1, near: false },
    { amp: 28, len: 1150, speed: 3.4, y: 112, fill: shade(COLOR.teal, 0.22), opacity: 1, near: true },
    { amp: 40, len: 1500, speed: 4.8, y: 190, fill: shade(COLOR.teal, 0.42), opacity: 1, near: true },
  ];
  const bands = allBands.filter((b) => (layer === "front" ? b.near : true));

  const wavePath = (amp: number, len: number, phase: number, baseY: number) => {
    const pts: string[] = [`M ${-260} ${HEIGHT + 300}`, `L ${-260} ${baseY}`];
    for (let x = -260; x <= WIDTH + 260; x += 18) {
      const y = baseY + Math.sin(((x + phase) / len) * Math.PI * 2) * amp;
      pts.push(`L ${x} ${y}`);
    }
    pts.push(`L ${WIDTH + 260} ${HEIGHT + 300} Z`);
    return pts.join(" ");
  };

  return (
    <AbsoluteFill>
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        {bands.map((b, i) => (
          <g key={i}>
            <path d={wavePath(b.amp, b.len, frame * b.speed, waterline + b.y)} fill={b.fill} />
            {/* light crest line riding the same curve */}
            <path
              d={wavePath(b.amp, b.len, frame * b.speed, waterline + b.y - 3)}
              fill="none"
              stroke={tint(COLOR.teal, 0.55)}
              strokeWidth={2}
              opacity={0.5}
            />
          </g>
        ))}
        {layer === "back" && (
          <rect x={0} y={waterline + 210} width={WIDTH} height={HEIGHT} fill={shade(COLOR.teal, 0.5)} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
