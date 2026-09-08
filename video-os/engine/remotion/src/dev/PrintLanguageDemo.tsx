import { AbsoluteFill } from "remotion";
import { StandaloneField } from "../field/LockedField";
import { COLOR, FIELD, WIDTH } from "../tokens";
import { DataCard, FigureBlock, Building, Tub } from "../print";

/**
 * PrintLanguageDemo — TIER 2 verification. Offset stroke + halftone figures on
 * the locked field, plus a flat data card. Composed to pass the occupancy law
 * (§2.2): three planes, big figures on the ground, mass in the bottom third.
 * NOT a channel asset.
 */
export const PrintLanguageDemo: React.FC = () => (
  <StandaloneField progress={0.4} source="Demo data, 2026">
    {/* Midground terrace + foreground floor — mass through the bottom third so
        the frame reads as a scene, not a slide (§2.2). */}
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: FIELD.groundRule.y - Math.round(1080 * 0.26),
          width: WIDTH,
          height: Math.round(1080 * 0.26),
          backgroundColor: COLOR.graphite,
          opacity: 0.16,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: FIELD.groundRule.y,
          width: WIDTH,
          height: 1080 - FIELD.groundRule.y,
          backgroundColor: COLOR.graphite,
          opacity: 0.24,
        }}
      />
    </AbsoluteFill>

    {/* Midground building. */}
    <FigureBlock
      shape={Building}
      width={460}
      height={640}
      centerX={410}
      baseline="ground"
      entry="none"
    />

    {/* Foreground subject: the tub, ~64% frame height, offset stroke prints on. */}
    <FigureBlock
      shape={Tub}
      width={560}
      height={690}
      centerX={1170}
      baseline="ground"
      label="one popcorn tub"
      entry="R"
      entryFrame={6}
      subject
    />

    {/* Flat data card, bottom third (§2.6 never halftoned, §2.5 no offset stroke). */}
    <DataCard
      title="Cinemark · Q1 2025"
      rows={[
        { label: "Concessions revenue", value: "$210.4M" },
        { label: "Concession supplies", value: "$44.3M", accent: true },
        { label: "Kept by the counter", value: "≈ 4 / 5" },
      ]}
      x={150}
      y={706}
      entryFrame={30}
    />
  </StandaloneField>
);
