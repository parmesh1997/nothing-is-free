/**
 * Mass & Method — channel palette + type, sourced directly from
 * `channels/mass-and-method/identity.json` (the channel pack). Kept as its
 * own small module rather than wired into the shared `tokens.ts`, the same
 * way `nif002/v4` sits beside the shared engine instead of inside it —
 * `tokens.ts` stays NIF's, this is MM's. First real use: the topic-2 demo
 * (`src/dev/MassMethodDemo.tsx`), proving the identity before any script.
 */
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;

export const MM_COLOR = {
  /** the dark field — everything sits on this, never white. */
  field: "#1C1C1A",
  /** force — vectors, load paths, anything mechanical pushing or pulling. */
  amber: "#E8A33D",
  /** measurement — ticks, dimensions, readouts, anything counted or timed. */
  cyan: "#5FC8D6",
  /** structure — the object itself, labels, the ScaleFigure. */
  ivory: "#EDE7DA",
  /** a dimmer ivory for secondary/caption text. */
  ivoryDim: "#A6A399",
} as const;

export const MM_FONT = {
  /** headings — same condensed-display family as NIF for now; revisit once
   *  a script exists and the identity needs its own display face. */
  hero: '"Bebas Neue", "Oswald", "Arial Narrow", sans-serif',
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  mono: '"IBM Plex Mono", "SFMono-Regular", ui-monospace, monospace',
} as const;
