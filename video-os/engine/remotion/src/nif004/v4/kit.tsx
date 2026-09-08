import { interpolate, spring, useCurrentFrame } from "remotion";
import { COLOR, HEIGHT, SUPPORT, WIDTH, shade, softShadow, tint } from "../../tokens";
import { SANS } from "../../nif002/v4/fonts4";

/**
 * kit.tsx — NIF004's shared beat vocabulary + the two remaining §22.8 assets
 * (PinAuction, AppTileWall) + the prop-locations (Road, DevDesk). The map bed
 * and the drive POV live in MapField.tsx; the three meters in Meter.tsx.
 *
 * House-consistent: cream field, one orange accent, Inter/Bebas, line art,
 * warm grounded shadows. Text that is PART OF A PROP (a card label, a chart
 * axis, a chip) stays here in code; running subtitles + kinetic deep text are
 * Resolve's (runbook §22.7).
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';
type Tone = "paper" | "ink";

// ── shared micro-helpers (same grammar as nif003) ───────────────────────────

/** a rotated boxed punch label that stamps in. */
export const Stamp: React.FC<{ at: number; x?: string | number; y: number; text: string; kind?: "ink" | "orange"; size?: number; rot?: number }> = ({ at, x = "c", y, text, kind = "ink", size = 40, rot = -2 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at - 6, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0.01) return null;
  const pop = interpolate(frame, [at - 6, at + 8], [1.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const centred = x === "c";
  return (
    <div style={{ position: "absolute", top: y, opacity: t, ...(centred ? { left: 0, right: 0, textAlign: "center" } : { left: x as number }) }}>
      <span style={{
        display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: "0.01em", color: "#fff",
        background: kind === "orange" ? COLOR.orange : COLOR.ink,
        border: `${Math.round(size / 12)}px solid ${kind === "orange" ? COLOR.ink : COLOR.orange}`,
        borderRadius: 12, padding: `${size * 0.22}px ${size * 0.7}px`, transform: `rotate(${rot}deg) scale(${pop})`,
      }}>{text}</span>
    </div>
  );
};

/** a huge held hero number. */
export const HeroNum: React.FC<{ at: number; value: string; label: string; align?: "left" | "right" | "center"; x?: number; y?: number; size?: number; tone?: Tone }> = ({ at, value, label, align = "center", x = 96, y = 150, size = 200, tone = "paper" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at - 8, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0.01) return null;
  const pos = align === "right" ? { right: x, textAlign: "right" as const } : align === "left" ? { left: x, textAlign: "left" as const } : { left: 0, right: 0, textAlign: "center" as const };
  return (
    <div style={{ position: "absolute", top: y, opacity: t, ...pos }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.08em", textTransform: "uppercase", color: tone === "ink" ? "#cfc9bd" : COLOR.grey }}>{label}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 0.95, color: COLOR.orange, transform: `scale(${0.92 + t * 0.08})`, transformOrigin: align }}>{value}</div>
    </div>
  );
};

/** the episode heading line, top-centre. */
export const Head: React.FC<{ text: string; at?: number; tone?: Tone }> = ({ text, at = 6, tone = "paper" }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", opacity: o, fontFamily: SANS, fontWeight: 800, fontSize: 42, color: tone === "ink" ? "#F6F2E7" : COLOR.ink }}>{text}</div>
  );
};

/** a company / product chip. */
export const Chip: React.FC<{ label: string; at: number; x: number; y: number; w?: number; dark?: boolean; solid?: boolean; big?: boolean }> = ({ label, at, x, y, w = 300, dark, solid, big }) => {
  const frame = useCurrentFrame();
  const t = spring({ frame: frame - at, fps: 30, config: { damping: 13 }, durationInFrames: 22 });
  if (t <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center",
      opacity: Math.min(1, t), transform: `scale(${(0.7 + t * 0.3).toFixed(3)})`,
      fontFamily: SANS, fontWeight: 800, fontSize: big ? 52 : 30,
      color: dark ? "#555" : solid ? "#fff" : COLOR.ink,
      background: dark ? COLOR.ink : solid ? COLOR.ink : COLOR.cardWhite,
      border: `${big ? 5 : 4}px solid ${COLOR.ink}`, borderRadius: 14, padding: big ? "16px 10px" : "12px 8px",
      filter: softShadow(0.9, 0.2),
    }}>{label}</div>
  );
};

// ── PinAuction — the §22.8 auction motif (B13 / B15 / B16) ───────────────────

/**
 * Bidder paddles raise numbers behind a UI slot; the highest snaps into place.
 * Used for: the promoted pin (B13), the lead-badge (B15), the booking button
 * (B16). `slotLabel` is the thing being auctioned.
 */
export const PinAuction: React.FC<{
  at: number;
  x: number;
  y: number;
  slotLabel: string;
  bids?: number[];
  tone?: Tone;
}> = ({ at, x, y, slotLabel, bids = [3, 7, 5], tone = "paper" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0.01) return null;
  const resolveT = interpolate(frame, [at + 40, at + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const winner = bids.indexOf(Math.max(...bids));
  return (
    <div style={{ position: "absolute", left: x - 300, top: y - 40, width: 600, opacity: t }}>
      {/* the bidder paddles */}
      <div style={{ position: "absolute", left: 0, right: 0, top: -180, display: "flex", justifyContent: "center", gap: 40 }}>
        {bids.map((b, i) => {
          const raise = interpolate(frame, [at + 8 + i * 6, at + 24 + i * 6], [40, i === winner ? -10 : 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const gone = i !== winner ? resolveT : 0;
          return (
            <div key={i} style={{ transform: `translateY(${raise + gone * 60}px)`, opacity: 1 - gone }}>
              <div style={{ width: 84, height: 60, background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.ink }}>${b}</div>
              <div style={{ width: 8, height: 30, background: COLOR.ink, margin: "0 auto" }} />
            </div>
          );
        })}
      </div>
      {/* the slot */}
      <div style={{
        background: tone === "ink" ? "#1e1e1e" : COLOR.cardWhite, border: `5px solid ${COLOR.ink}`, borderRadius: 16, padding: "22px 20px", textAlign: "center",
        filter: softShadow(1.1, 0.22),
      }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, letterSpacing: "0.08em", textTransform: "uppercase", color: COLOR.grey }}>{slotLabel}</div>
        <div style={{
          marginTop: 10, fontFamily: SANS, fontWeight: 800, fontSize: 34,
          color: "#fff", background: COLOR.orange, borderRadius: 10, padding: "12px 8px",
          transform: `scale(${1 + Math.sin(frame / 12) * 0.02 * (resolveT > 0.5 ? 1 : 0)})`,
        }}>
          {resolveT > 0.5 ? `HIGHEST BIDDER  ·  $${bids[winner]}` : "…"}
        </div>
      </div>
    </div>
  );
};

// ── AppTileWall — the §22.8 wall (B04 / B26) ────────────────────────────────

/** a grid of app tiles, each showing a tiny map, each piped to one platform
 *  box; a coin travels each pipe on every "load". */
export const AppTileWall: React.FC<{ at: number; tiles?: string[]; boxLabel?: string; stampDefault?: boolean }> = ({ at, tiles = ["RIDE", "DELIVERY", "LISTINGS", "“FIND US”", "RESERVE", "WEATHER"], boxLabel = "THE PLATFORM", stampDefault = false }) => {
  const frame = useCurrentFrame();
  const cols = 3;
  const boxY = 900;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {tiles.map((label, i) => {
        const t = spring({ frame: frame - at - i * 5, fps: 30, config: { damping: 13 }, durationInFrames: 22 });
        if (t <= 0.01) return null;
        const col = i % cols, row = Math.floor(i / cols);
        const tx = 400 + col * 380;
        const ty = 270 + row * 250;
        const coinP = ((frame - at - i * 5) % 70) / 70;
        return (
          <g key={i} opacity={Math.min(1, t)} transform={`translate(${tx} ${ty}) scale(${0.8 + t * 0.2})`}>
            <rect x={-125} y={-86} width={250} height={172} rx={14} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={4} style={{ filter: softShadow(0.8, 0.18) }} />
            {/* tiny map */}
            <rect x={-109} y={-70} width={218} height={98} fill={tint(SUPPORT.forest, 0.78)} />
            <line x1={-109} y1={-38} x2={109} y2={-22} stroke={COLOR.grey} strokeWidth={3} />
            <line x1={-56} y1={-70} x2={-38} y2={28} stroke={COLOR.grey} strokeWidth={3} />
            <circle cx={28} cy={-18} r={6} fill={COLOR.orange} />
            <text x={0} y={62} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={23} fill={COLOR.ink}>{label}</text>
            {stampDefault && <text x={0} y={-100} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={18} fill={COLOR.orange}>DEFAULT</text>}
            {/* pipe + travelling coin */}
            <line x1={0} y1={86} x2={0} y2={boxY - ty - 40} stroke={COLOR.grey} strokeWidth={3} strokeDasharray="3 8" />
            <circle cx={0} cy={86 + coinP * (boxY - ty - 126)} r={7} fill={COLOR.orange} />
          </g>
        );
      })}
      <g transform={`translate(${WIDTH / 2} ${boxY})`} opacity={interpolate(frame, [at + 20, at + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
        <rect x={-370} y={-44} width={740} height={88} rx={12} fill={COLOR.ink} />
        <text x={0} y={11} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill="#fff" letterSpacing="0.05em">{boxLabel}</text>
      </g>
    </svg>
  );
};

// ── RankedList — the map peels back to a list (B17) ─────────────────────────

export const RankedList: React.FC<{ at: number; rows?: { label: string; paid?: boolean }[] }> = ({ at, rows = [] }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 460, top: 300, width: 1000 }}>
      {rows.map((r, i) => {
        const t = interpolate(frame, [at + i * 8, at + 20 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (t <= 0) return null;
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 22, padding: "22px 28px", marginBottom: 16,
            background: COLOR.cardWhite, border: `4px solid ${COLOR.ink}`, borderRadius: 12, filter: softShadow(0.9, 0.18),
            opacity: t, transform: `translateX(${(1 - t) * -30}px)`,
          }}>
            <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: COLOR.grey }}>{i + 1}</span>
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: COLOR.ink, flex: 1 }}>{r.label}</span>
            {r.paid && <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 20, color: "#fff", background: COLOR.orange, borderRadius: 8, padding: "6px 16px" }}>PAID FOR THIS SPOT</span>}
          </div>
        );
      })}
    </div>
  );
};

// ── prop-locations (locked field + 2-4 props, never a built room) ───────────

/** on the road / walking — asphalt strip + lane dashes + a walking figure + a
 *  lamp post. `reveal` builds it in. */
export const Road: React.FC<{ reveal?: number }> = ({ reveal = 1 }) => {
  const frame = useCurrentFrame();
  const step = Math.sin(frame / 6) * 8;
  const walkX = 300 + ((frame * 2) % 1400);
  const dash = -((frame * 6) % 120);
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: reveal }}>
      <rect x={0} y={HEIGHT - 150} width={WIDTH} height={150} fill={shade(SUPPORT.clay, 0.42)} />
      <line x1={0} y1={HEIGHT - 76} x2={WIDTH} y2={HEIGHT - 76} stroke={COLOR.cardWhite} strokeWidth={6} strokeDasharray="60 60" strokeDashoffset={dash} opacity={0.7} />
      {/* lamp post */}
      <g transform={`translate(${WIDTH - 220} 0)`}>
        <line x1={0} y1={HEIGHT - 150} x2={0} y2={HEIGHT * 0.24} stroke={COLOR.ink} strokeWidth={9} />
        <path d={`M 0 ${HEIGHT * 0.24} q 0 -22 -44 -22`} fill="none" stroke={COLOR.ink} strokeWidth={9} />
        <ellipse cx={-44} cy={HEIGHT * 0.24 - 16} rx={16} ry={20} fill="#F6ECC9" stroke={COLOR.ink} strokeWidth={4} />
      </g>
      {/* walking figure */}
      <g transform={`translate(${walkX} ${HEIGHT - 150})`}>
        <circle cx={0} cy={-150} r={26} fill={COLOR.grey} stroke={COLOR.ink} strokeWidth={4} />
        <path d="M -28 -6 q 0 -100 28 -100 q 28 0 28 100 z" fill={COLOR.grey} stroke={COLOR.ink} strokeWidth={4} />
        <line x1={-10} y1={-6} x2={-10 - step} y2={44} stroke={COLOR.ink} strokeWidth={9} strokeLinecap="round" />
        <line x1={10} y1={-6} x2={10 + step} y2={44} stroke={COLOR.ink} strokeWidth={9} strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** the developer's desk — a monitor showing a "Contact" webpage + keyboard +
 *  mug + a chair; a figure reacting (B06). */
export const DevDesk: React.FC<{ reveal?: number; shock?: number }> = ({ reveal = 1, shock = 0 }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 40) * 3;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: reveal }}>
      {/* desk */}
      <rect x={120} y={HEIGHT - 300} width={WIDTH - 240} height={26} fill={SUPPORT.clay} stroke={COLOR.ink} strokeWidth={4} />
      <rect x={180} y={HEIGHT - 274} width={20} height={274} fill={COLOR.ink} />
      <rect x={WIDTH - 200} y={HEIGHT - 274} width={20} height={274} fill={COLOR.ink} />
      {/* monitor */}
      <g transform={`translate(360 ${HEIGHT - 620 + bob})`} style={{ filter: softShadow(1, 0.2) }}>
        <rect x={0} y={0} width={520} height={320} rx={12} fill={COLOR.ink} />
        <rect x={16} y={16} width={488} height={264} fill={COLOR.cardWhite} />
        <rect x={16} y={16} width={488} height={40} fill={tint(COLOR.grey, 0.5)} />
        <text x={40} y={100} fontFamily={SANS} fontWeight={800} fontSize={30} fill={COLOR.ink}>Contact us</text>
        <rect x={40} y={128} width={430} height={130} fill={tint(SUPPORT.forest, 0.78)} stroke={COLOR.ink} strokeWidth={3} />
        <circle cx={250} cy={193} r={9} fill={COLOR.orange} />
        <rect x={230} y={300} width={40} height={30} fill={COLOR.ink} />
      </g>
      {/* mug + keyboard */}
      <rect x={980} y={HEIGHT - 340} width={220} height={16} rx={4} fill={tint(COLOR.grey, 0.4)} stroke={COLOR.ink} strokeWidth={3} />
      <path d="M 1260 -0 m 0 0" />
      <g transform={`translate(1280 ${HEIGHT - 360})`}>
        <rect x={0} y={0} width={70} height={70} rx={8} fill={COLOR.cardWhite} stroke={COLOR.ink} strokeWidth={4} />
        <path d="M 70 18 q 24 0 24 18 q 0 18 -24 18" fill="none" stroke={COLOR.ink} strokeWidth={4} />
      </g>
      {/* figure in a chair, reacts */}
      <g transform={`translate(${WIDTH - 420} ${HEIGHT - 470})`}>
        <circle cx={0} cy={0} r={40} fill={tint(COLOR.tan, 0.14)} stroke={COLOR.ink} strokeWidth={5} />
        <path d="M -60 150 q 0 -110 60 -110 q 60 0 60 110 z" fill={SUPPORT.teal} stroke={COLOR.ink} strokeWidth={5} />
        {shock > 0.3 && (
          <text x={70} y={-30} fontFamily={SANS} fontWeight={800} fontSize={90} fill={COLOR.orange} stroke={COLOR.ink} strokeWidth={4}>!</text>
        )}
      </g>
    </svg>
  );
};

/** contender plates for "the alternatives" (B27). */
export const ContenderPlates: React.FC<{ at: number; pickAt: number }> = ({ at, pickAt }) => {
  const frame = useCurrentFrame();
  const plates = [
    { name: "OPENSTREETMAP", tag: "VOLUNTEER-MADE" },
    { name: "APPLE MAPS", tag: "YEARS + BILLIONS SPENT" },
    { name: "OVERTURE", tag: "NEW · SHARED" },
    { name: "GOOGLE MAPS", tag: "THE ONE EVERYONE REACHES FOR" },
  ];
  const reach = interpolate(frame, [pickAt, pickAt + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", gap: 30 }}>
      {plates.map((p, i) => {
        const t = spring({ frame: frame - at - i * 8, fps: 30, config: { damping: 13 }, durationInFrames: 22 });
        if (t <= 0.01) return null;
        const isG = i === 3;
        return (
          <div key={i} style={{
            width: 360, opacity: Math.min(1, t), transform: `translateY(${(1 - t) * 24}px) scale(${isG && reach > 0.5 ? 1.06 : 1})`,
            filter: isG && reach > 0.5 ? `drop-shadow(0 0 26px rgba(226,77,40,0.4))` : softShadow(1, 0.2),
          }}>
            <div style={{ background: isG ? tint(COLOR.orange, 0.34) : COLOR.cardWhite, border: `5px solid ${isG ? COLOR.orange : COLOR.ink}`, borderRadius: 16, padding: "28px 18px", textAlign: "center" }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COLOR.ink }}>{p.name}</div>
              <div style={{ marginTop: 10, fontFamily: SANS, fontWeight: 700, fontSize: 17, letterSpacing: "0.04em", textTransform: "uppercase", color: COLOR.grey }}>{p.tag}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── small line-art glyphs for concrete nouns ───────────────────────────────

const S = { stroke: COLOR.ink, strokeWidth: 4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconWarrant: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="20" y="12" width="60" height="76" rx="4" fill={COLOR.cardWhite} {...S} />
    <line x1="30" y1="30" x2="70" y2="30" {...S} strokeWidth={3} />
    <line x1="30" y1="44" x2="70" y2="44" {...S} strokeWidth={3} />
    <line x1="30" y1="58" x2="55" y2="58" {...S} strokeWidth={3} />
    <circle cx="62" cy="70" r="12" fill={tint(COLOR.orange, 0.3)} {...S} strokeWidth={3} />
    <path d="M 62 66 l 0 8 l 5 3" fill="none" {...S} strokeWidth={3} />
  </svg>
);

export const IconTimeline: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <line x1="26" y1="14" x2="26" y2="86" {...S} />
    {[24, 44, 64].map((y, i) => (
      <g key={i}>
        <circle cx="26" cy={y} r="6" fill={i === 1 ? COLOR.orange : COLOR.cardWhite} {...S} strokeWidth={3} />
        <line x1="38" y1={y} x2="78" y2={y} {...S} strokeWidth={3} />
      </g>
    ))}
  </svg>
);

export const IconBadge: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="38" fill={tint(SUPPORT.forest, 0.3)} {...S} />
    <path d="M 34 52 l 12 12 l 22 -26" fill="none" {...S} strokeWidth={6} />
  </svg>
);

export const IconPin: React.FC<{ size?: number; filled?: boolean }> = ({ size = 80, filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 50 92 C 20 54 20 20 50 20 C 80 20 80 54 50 92 Z" fill={filled ? COLOR.orange : "none"} {...S} strokeWidth={5} />
    <circle cx="50" cy="42" r="13" fill={COLOR.cardWhite} {...S} strokeWidth={4} />
  </svg>
);

void HEIGHT;
void MONO;
