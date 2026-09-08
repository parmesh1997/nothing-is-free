import { COLOR, shade, tint } from "../../tokens";

/**
 * icons.tsx — small flat glyphs for concrete nouns named in the NIF003
 * script (creator, 2026-09-05: "check the transcript and create those
 * SVGs" — a caption alone isn't enough when the line names a drawable
 * thing; §9.2 already requires this, this file is what actually does it).
 *
 * Each icon is a self-contained <g>, sized to a 1x1 box (scale via a
 * transform at the call site) so it drops cleanly into a DimCard or a
 * bare scene at any size.
 *
 * Colour (creator, 2026-09-05, second pass: "only one color" — the SUPPORT
 * rainbow used per-icon in the first draft read as clutter, not variety):
 * every icon fill is `COLOR.orange` — the house's one accent — tinted for
 * the fill and full-strength for a small highlight, same as everywhere
 * else in the show. Ink outlines and cardWhite/cream neutrals are not "a
 * colour" in this sense; they're the structural palette every beat uses.
 */

const S = (w = 3) => ({ stroke: COLOR.ink, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

/** a broadcast tower — THE NETWORK. */
export const IconTower: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 8 L74 92 L62 92 L50 44 L38 92 L26 92 Z" fill={tint(COLOR.orange, 0.35)} {...S(4)} />
    <line x1="34" y1="46" x2="66" y2="46" {...S(4)} />
    <line x1="40" y1="66" x2="60" y2="66" {...S(4)} />
    {[-1, 0, 1].map((i) => (
      <path key={i} d={`M ${50 + i * 14} 8 q ${i * 6} -10 0 -18`} fill="none" {...S(3)} opacity={0.7} />
    ))}
    <circle cx="50" cy="8" r="5" fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={3} />
  </svg>
);

/** a local station — a small building with an antenna. */
export const IconStationBuilding: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="20" y="38" width="60" height="54" fill={tint(COLOR.orange, 0.35)} {...S(4)} />
    <rect x="32" y="54" width="14" height="14" fill={COLOR.cardWhite} {...S(3)} />
    <rect x="54" y="54" width="14" height="14" fill={COLOR.cardWhite} {...S(3)} />
    <rect x="42" y="76" width="16" height="16" fill={shade(COLOR.orange, 0.05)} {...S(3)} />
    <line x1="50" y1="38" x2="50" y2="14" {...S(4)} />
    <line x1="38" y1="24" x2="62" y2="24" {...S(3)} />
  </svg>
);

/** a ratings company — a star in a badge (the "score" idea). */
export const IconRatingStar: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="42" fill={tint(COLOR.orange, 0.4)} {...S(4)} />
    <path d="M50 24 L58 42 L78 44 L63 57 L67 77 L50 66 L33 77 L37 57 L22 44 L42 42 Z" fill={COLOR.cardWhite} {...S(3)} />
  </svg>
);

/** an advertiser — a megaphone. */
export const IconMegaphone: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M18 46 L46 34 L46 66 L18 54 Z" fill={tint(COLOR.orange, 0.35)} {...S(4)} />
    <path d="M46 34 L80 20 L80 80 L46 66 Z" fill={tint(COLOR.orange, 0.5)} {...S(4)} />
    <rect x="14" y="46" width="8" height="8" fill={COLOR.ink} />
    <path d="M26 54 L32 78 L22 78 Z" fill={shade(COLOR.orange, 0.05)} {...S(3)} />
  </svg>
);

/** live sports — a bat and ball (B02's "live sports rights"). */
export const IconSports: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <line x1="20" y1="82" x2="58" y2="30" stroke={tint(COLOR.orange, 0.15)} strokeWidth={13} strokeLinecap="round" />
    <line x1="20" y1="82" x2="58" y2="30" {...S(3)} fill="none" />
    <circle cx="72" cy="26" r="16" fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={3} />
    <path d="M62 20 Q72 26 62 32 M82 20 Q72 26 82 32" fill="none" stroke={COLOR.orange} strokeWidth={2.5} />
  </svg>
);

/** "cartoon villain twirling a mustache" — drawn, then crossed out (paired
 *  with the "NOT A VILLAIN" punch). */
export const IconVillainMustache: React.FC<{ size?: number; crossed?: number }> = ({ size = 64, crossed = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="44" fill={tint(COLOR.orange, 0.45)} {...S(4)} />
    <path
      d="M18 56 Q30 40 40 52 Q46 44 50 52 Q54 44 60 52 Q70 40 82 56 Q72 50 62 58 Q56 50 50 58 Q44 50 38 58 Q28 50 18 56 Z"
      fill={COLOR.ink}
    />
    {crossed > 0.02 && (
      <line x1="16" y1="16" x2="84" y2="84" stroke={COLOR.orange} strokeWidth={7} strokeLinecap="round" opacity={crossed} />
    )}
  </svg>
);

/** a notification bell — the closing "subscribe" card (B32). */
export const IconBell: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 14 C33 14 26 28 26 44 L26 60 L18 72 L82 72 L74 60 L74 44 C74 28 67 14 50 14 Z" fill={tint(COLOR.orange, 0.4)} {...S(4)} />
    <path d="M40 76 Q50 90 60 76" fill="none" {...S(4)} />
    <circle cx="50" cy="14" r="6" fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={3} />
  </svg>
);

/** the closing "football" line — a simple ball. */
export const IconFootball: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <ellipse cx="50" cy="50" rx="46" ry="30" fill={tint(COLOR.orange, 0.2)} stroke={COLOR.ink} strokeWidth={4} transform="rotate(-18 50 50)" />
    <g transform="rotate(-18 50 50)">
      <line x1="14" y1="50" x2="86" y2="50" {...S(3)} />
      {[-24, -12, 0, 12, 24].map((x) => (
        <line key={x} x1={50 + x} y1="42" x2={50 + x} y2="58" {...S(2.5)} />
      ))}
    </g>
  </svg>
);

/** a map pin — "the map on your phone" (B31's bridge to Episode 4). A
 *  teardrop + dot, the universal pin glyph — not a real map, that's Ep4's
 *  own job. */
export const IconMapPin: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 10 C30 10 16 26 16 44 C16 66 50 92 50 92 C50 92 84 66 84 44 C84 26 70 10 50 10 Z" fill={tint(COLOR.orange, 0.15)} {...S(4)} />
    <circle cx="50" cy="42" r="15" fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={3} />
  </svg>
);

/** a credit card + a lock — "never once asked for a card number or a
 *  password," drawn, then crossed out. */
export const IconCardLock: React.FC<{ size?: number; crossed?: number }> = ({ size = 64, crossed = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="8" y="30" width="62" height="42" rx="6" fill={tint(COLOR.orange, 0.3)} {...S(4)} />
    <rect x="8" y="40" width="62" height="10" fill={COLOR.ink} />
    <rect x="16" y="58" width="22" height="6" rx="3" fill={COLOR.cardWhite} />
    <g transform="translate(62 52)">
      <rect x="0" y="10" width="30" height="24" rx="5" fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={3.5} />
      <path d="M6 10 V2 a9 9 0 0 1 18 0 V10" fill="none" stroke={COLOR.ink} strokeWidth={3.5} />
      <circle cx="15" cy="22" r="3.5" fill={COLOR.ink} />
    </g>
    {crossed > 0.02 && (
      <line x1="10" y1="14" x2="90" y2="88" stroke={COLOR.orange} strokeWidth={7} strokeLinecap="round" opacity={crossed} />
    )}
  </svg>
);

const S2 = (w = 3) => ({ stroke: COLOR.ink, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

/** a rooftop TV antenna — "buy an antenna once" (B03). */
export const IconAntenna: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <line x1="50" y1="18" x2="50" y2="90" {...S2(5)} />
    {[28, 42, 56].map((y, i) => (
      <line key={i} x1={50 - (18 - i * 4)} y1={y} x2={50 + (18 - i * 4)} y2={y} {...S2(4)} />
    ))}
    <circle cx="50" cy="14" r="6" fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={3} />
    <line x1="30" y1="90" x2="70" y2="90" {...S2(5)} />
  </svg>
);

/** a small TV set — the receiving end of a signal (B03, B07's blackout frame). */
export const IconTVSet: React.FC<{ size?: number; dark?: number }> = ({ size = 64, dark = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="10" y="20" width="80" height="56" rx="8" fill={tint(COLOR.orange, dark > 0.5 ? 0 : 0.35)} {...S2(4)} />
    <rect x="18" y="28" width="64" height="40" fill={dark > 0.5 ? COLOR.ink : COLOR.cardWhite} />
    <line x1="38" y1="84" x2="62" y2="84" {...S2(5)} />
    <line x1="50" y1="76" x2="50" y2="84" {...S2(5)} />
  </svg>
);

/** a calendar page with a stamped date — the three blackout case studies
 *  (B08/B09/B10). */
export const IconCalendar: React.FC<{ size?: number; label: string }> = ({ size = 64, label }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="12" y="18" width="76" height="70" rx="8" fill={COLOR.cardWhite} {...S2(4)} />
    <rect x="12" y="18" width="76" height="22" rx="8" fill={tint(COLOR.orange, 0.25)} {...S2(4)} />
    <line x1="30" y1="10" x2="30" y2="26" {...S2(5)} />
    <line x1="70" y1="10" x2="70" y2="26" {...S2(5)} />
    <text x="50" y="64" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={800} fontSize="15" fill={COLOR.ink}>
      {label}
    </text>
  </svg>
);

/** a satellite dish — DirecTV's own pipe (B09). */
export const IconSatelliteDish: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M10 60 A42 30 0 0 1 88 46" fill={tint(COLOR.orange, 0.3)} {...S2(4)} />
    <line x1="49" y1="53" x2="80" y2="22" {...S2(4)} />
    <circle cx="80" cy="22" r="6" fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={3} />
    <line x1="30" y1="70" x2="30" y2="90" {...S2(5)} />
    <line x1="18" y1="90" x2="42" y2="90" {...S2(5)} />
  </svg>
);

/** a streaming play button — the third pipe (B10, B11). */
export const IconStreamPlay: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="10" y="10" width="80" height="80" rx="20" fill={tint(COLOR.orange, 0.3)} {...S2(4)} />
    <path d="M40 32 L68 50 L40 68 Z" fill={COLOR.ink} />
  </svg>
);

/** a padlock — the one locked, fair-priced row (B25). */
export const IconPadlock: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="24" y="46" width="52" height="42" rx="8" fill={tint(COLOR.orange, 0.3)} {...S2(4)} />
    <path d="M34 46 V32 a16 16 0 0 1 32 0 V46" fill="none" {...S2(5)} />
    <circle cx="50" cy="64" r="6" fill={COLOR.ink} />
    <line x1="50" y1="68" x2="50" y2="78" {...S2(4)} />
  </svg>
);

/** a local newsroom desk — the honest-cost side of the argument (B02, B23, B26). */
export const IconNewsDesk: React.FC<{ size?: number; staffed?: number }> = ({ size = 64, staffed = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="10" y="62" width="80" height="14" fill={tint(COLOR.orange, 0.15)} {...S2(3)} />
    <rect x="24" y="18" width="52" height="46" rx="4" fill={COLOR.ink} opacity={0.9} />
    <rect x="30" y="24" width="40" height="28" fill={tint(COLOR.orange, 0.3 + staffed * 0.15)} />
    <rect x="16" y="76" width="8" height="14" fill={COLOR.ink} />
    <rect x="76" y="76" width="8" height="14" fill={COLOR.ink} />
    {staffed > 0.5 && <circle cx="50" cy="12" r="7" fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={3} />}
  </svg>
);

/** a jersey — a captive sports fan (B13, B22). */
export const IconJersey: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M30 14 L14 30 L26 42 L30 38 V88 H70 V38 L74 42 L86 30 L70 14 L60 22 H40 Z" fill={tint(COLOR.orange, 0.3)} {...S2(4)} />
  </svg>
);

