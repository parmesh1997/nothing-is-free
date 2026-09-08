/**
 * fonts.ts — Google Fonts for the Nothing Is Free visual system.
 *
 * Per the creator's ASSETS LIBRARY sheet (2026-09-01):
 *   HEADING → Bebas Neue   (tall condensed all-caps display)
 *   BODY    → Inter         (regular)
 *
 * The mono role (source tags, typed lines, small labels) keeps IBM Plex Mono.
 */

import { loadFont as loadDisplay } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

export const display = loadDisplay(); // Bebas Neue ships one weight (400)
export const body = loadBody("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});
export const mono = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

/** Await this in calculateMetadata so renders never race the font load. */
export const fontsReady = Promise.all([
  display.waitUntilDone(),
  body.waitUntilDone(),
  mono.waitUntilDone(),
]);
