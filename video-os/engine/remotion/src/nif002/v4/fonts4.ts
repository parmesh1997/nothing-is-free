/**
 * fonts4.ts — the v4 typography pair.
 *
 *   SANS  → Hanken Grotesk — the workhorse. Narration, labels, sentence-case
 *           captions. A warm professional grotesque, legible small and big.
 *   PUNCH → Bebas Neue — the emphasis hits only, one word/phrase at a time, in
 *           ORANGE (creator, 2026-09-03: "whenever the deep text… the brown
 *           colour is there, make it orange… everything [punch] will be in
 *           Bebas Neue"). Replaces the Playfair-italic + copper-metal treatment.
 *
 * IBM Plex Mono stays for the source tag + in-world typed text.
 * Two visible families. Nothing else.
 */
import { loadFont as loadSans } from "@remotion/google-fonts/HankenGrotesk";
import { loadFont as loadPunch } from "@remotion/google-fonts/BebasNeue";

export const sans = loadSans("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export const punch = loadPunch("normal", {
  weights: ["400"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

/** font-family strings. */
export const SANS = '"Hanken Grotesk", "Inter", system-ui, sans-serif';
export const PUNCH = '"Bebas Neue", "Oswald", "Arial Narrow", sans-serif';
/** @deprecated the Playfair punch is retired — alias so stale imports still build. */
export const SERIF = PUNCH;

/** Await in calculateMetadata so a render never races the fonts. */
export const serifReady = Promise.all([sans.waitUntilDone(), punch.waitUntilDone()]);
