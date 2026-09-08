import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DARK_LAW } from "../tokens";
import { Grain } from "./Grain";
import { Grid } from "./Grid";
import { GroundRule } from "./GroundRule";
import { Paper } from "./Paper";
import { ProgressRule } from "./ProgressRule";
import { SourceTag } from "./SourceTag";
import { Vignette } from "./Vignette";

/**
 * LockedField — the three-plane background stack that never cuts (§2.1, §2.3).
 *
 * Plane order, bottom → top (§2.1):
 *   Paper · Grid · Vignette · GroundRule    ← background
 *   {children}                              ← midground + foreground go here
 *   Grain · ProgressRule · SourceTag        ← locked frame furniture, "over everything"
 *
 * A frame with fewer than three planes is a gate failure (§2.1). This component
 * guarantees the background plane; the caller supplies midground + foreground.
 *
 * DRIVEN BY GLOBAL FRAME (§11.3): grid drift, vignette phase and the progress
 * rule are functions of (globalStartFrame + local frame), so nothing jumps at a
 * beat boundary when Resolve assembles the separately-rendered pieces (§0.1 C2).
 */
export const LockedField: React.FC<{
  /** globalStartFrame + local frame. */
  globalFrame: number;
  /** 0 → 1 across the whole episode (episodeProgress). */
  progress: number;
  /** Citation for the figure on screen, e.g. "Cinemark, Q1 2025". */
  source?: React.ReactNode;
  /**
   * The reversal (§2.9). Pass the GLOBAL frame at which the Dark Law begins;
   * the field crossfades to ink over 20 frames. Omit for every other beat.
   */
  darkLawStartGlobalFrame?: number;
  children?: React.ReactNode;
}> = ({
  globalFrame,
  progress,
  source,
  darkLawStartGlobalFrame,
  children,
}) => {
  const darkLawProgress =
    darkLawStartGlobalFrame === undefined
      ? 0
      : clamp01(
          (globalFrame - darkLawStartGlobalFrame) / DARK_LAW.crossfadeFrames,
        );

  return (
    <AbsoluteFill>
      <Paper darkLawProgress={darkLawProgress} />
      <Grid globalFrame={globalFrame} darkLawProgress={darkLawProgress} />
      <Vignette />
      <GroundRule />

      {children}

      <Grain />
      <ProgressRule progress={progress} />
      <SourceTag>{source}</SourceTag>
    </AbsoluteFill>
  );
};

/**
 * StandaloneField — convenience wrapper for previewing the field on its own in
 * Studio, where there is no BeatProps. Uses the real current frame as the global
 * frame and a fixed progress value.
 */
export const StandaloneField: React.FC<{
  progress?: number;
  source?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ progress = 0.33, source, children }) => {
  const frame = useCurrentFrame();
  return (
    <LockedField globalFrame={frame} progress={progress} source={source}>
      {children}
    </LockedField>
  );
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
