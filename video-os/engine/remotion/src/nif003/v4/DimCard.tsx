import { COLOR, shade, softShadow, tint } from "../../tokens";

/**
 * DimCard.tsx — the NIF003 "premium data card" (creator, 2026-09-05: cards and
 * icons get real dimensional depth; characters and locations stay in the flat
 * house style, untouched). Cheap CSS 3D — no WebGL, no new dependency, no
 * render-cost risk (per Master Runbook §18's own caution to benchmark 3D
 * before using it broadly): a slight rotateX tilt + per-edge shading (top
 * lightest, bottom/right darkest — the isometric-animation skill's "single
 * most important trick for believable depth") + a grounded warm drop shadow.
 *
 * Reserved for CARDS / ICONS / DATA elements only. Never on Figure or a
 * location — those keep the existing flat + shadow language.
 *
 *   <DimCard x y w h fill tilt> …content… </DimCard>
 */
export const DimCard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  /** rotateX degrees — how much the card leans back. 5-9 reads as premium
   *  without breaking the flat-illustration world (higher looks gimmicky). */
  tilt?: number;
  opacity?: number;
  scale?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, fill = COLOR.cardWhite, tilt = 7, opacity = 1, scale = 1, children }) => {
  const edgeT = Math.max(3, h * 0.035);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        opacity,
        transform: `perspective(1400px) rotateX(${tilt}deg) scale(${scale})`,
        transformStyle: "preserve-3d",
        filter: softShadow(1.1, 0.22),
      }}
    >
      {/* the card body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: `linear-gradient(180deg, ${tint(fill, 0.35)} 0%, ${fill} 18%, ${fill} 82%, ${shade(fill, 0.08)} 100%)`,
          border: `3px solid ${COLOR.ink}`,
        }}
      />
      {/* top light edge — the "lit" face of the extrusion */}
      <div
        style={{
          position: "absolute",
          left: 3,
          right: 3,
          top: 3,
          height: edgeT,
          borderRadius: "13px 13px 0 0",
          background: `linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)`,
          pointerEvents: "none",
        }}
      />
      {/* bottom/right shade edge — the "away from light" face */}
      <div
        style={{
          position: "absolute",
          left: 3,
          right: 3,
          bottom: 3,
          height: edgeT * 1.4,
          borderRadius: "0 0 13px 13px",
          background: `linear-gradient(0deg, ${shade(fill, 0.22)} 0%, rgba(0,0,0,0) 100%)`,
          pointerEvents: "none",
        }}
      />
      {/* content, kept flat (un-rotated) so text stays crisp and legible —
          only the card shell reads as dimensional */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateZ(1px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};
