import React from "react";
import { AbsoluteFill } from "remotion";
import { Grid } from "../field/Grid";
import { MM_COLOR } from "./tokens";

/**
 * MMField — the minimum viable Mass & Method background: the dark charcoal
 * field + a faint light grid. NOT the full parity kit NIF's `V4Field` has
 * (no progress rule, no source tag, no vignette yet) — this is the
 * identity-proof pass, not the finished channel bed. Extend when a real
 * episode is scoped.
 *
 * Reuses NIF's `Grid` component at `darkLawProgress=1` — that's the exact
 * "light lines on dark" mode `Grid` already has for NIF's own B25 reversal,
 * which is precisely what MM's dark-field default needs every frame.
 */
export const MMField: React.FC<{
  globalFrame?: number;
  children?: React.ReactNode;
}> = ({ globalFrame = 0, children }) => (
  <AbsoluteFill style={{ backgroundColor: MM_COLOR.field }}>
    <Grid globalFrame={globalFrame} darkLawProgress={1} />
    {children}
  </AbsoluteFill>
);
