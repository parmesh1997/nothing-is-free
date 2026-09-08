import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONT } from "../tokens";
import { EASE } from "../parts/motion";
import { Bloom } from "../parts/Bloom";

/**
 * TollStack — NIF002 (B12 ledger, B15 named toll). One real ad dollar walked down
 * the chain: a start value, then rows that each shave a %, a running total that
 * re-counts each step, and a shrink-bar on the right. The final line lands in
 * the accent colour with a Bloom — the ONE accent per frame.
 *
 * All frames LOCAL. Drives its own row cadence from `start` + `perRowFrames`.
 */
export type TollRow = { label: string; pct?: number; note?: string };

export const TollStack: React.FC<{
  x: number;
  y: number;
  w?: number;
  startValue: number;
  rows: TollRow[];
  start: number;
  perRowFrames?: number;
  /** unit for the running value, e.g. "$" prefix */
  format?: (n: number) => string;
  /** extra tail lines after the chain: a divide + a final "app keeps" */
  tail?: { label: string; value: string }[];
  finalAt?: number;
}> = ({
  x,
  y,
  w = 900,
  startValue,
  rows,
  start,
  perRowFrames = 70,
  format = (n) => `$${n.toFixed(2)}`,
  tail = [],
  finalAt,
}) => {
  const frame = useCurrentFrame();

  const rowH = 66;
  const barW = 90;
  const listW = w - barW - 30;

  // running value after k shaves
  const valueAfter = (k: number) => {
    let v = startValue;
    for (let i = 0; i < k; i++) v *= 1 - (rows[i].pct ?? 0) / 100;
    return v;
  };
  // how many rows have landed
  const landed = Math.max(0, Math.min(rows.length, Math.floor((frame - start) / perRowFrames) + 1));
  const rowProgress = (frame - start) / perRowFrames - (landed - 1);
  const runningValue = interpolate(
    Math.max(0, Math.min(1, rowProgress)),
    [0, 1],
    [valueAfter(Math.max(0, landed - 1)), valueAfter(landed)],
  );

  const tailStart = finalAt ?? start + rows.length * perRowFrames + 20;

  const totalH = (rows.length + 1) * rowH + tail.length * rowH + 40;
  const barFillFrac = frame < start ? 1 : Math.max(0.04, runningValue / startValue);

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      {/* header row — the start value */}
      <Row label="ADVERTISER PAYS" value={format(startValue)} on={frame >= start - 10} w={listW} rowH={rowH} bold />

      {/* toll rows */}
      {rows.map((r, i) => {
        const at = start + i * perRowFrames;
        const on = interpolate(frame, [at, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
        if (on <= 0.01) return null;
        return (
          <div key={i} style={{ opacity: Math.min(1, on), translate: `${(1 - Math.min(1, on)) * -14}px 0px` }}>
            <Row
              label={r.label}
              sub={r.pct != null ? `− ${r.pct}%` : r.note}
              value={format(valueAfter(i + 1))}
              running={i === landed - 1 ? format(runningValue) : undefined}
              on
              w={listW}
              rowH={rowH}
            />
          </div>
        );
      })}

      {/* tail (÷ 1,000, app keeps …) */}
      {tail.map((t, i) => {
        const at = tailStart + i * 46;
        const on = interpolate(frame, [at, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.inOut });
        if (on <= 0.01) return null;
        const isFinal = i === tail.length - 1;
        return (
          <div key={`tail${i}`} style={{ opacity: Math.min(1, on), position: "relative" }}>
            {isFinal && <Bloom window={[at + 4, at + 16, at + 60, at + 84]} radius={110} x={listW * 0.78} y={rowH * 0.5} intensity={0.7} />}
            <Row label={t.label} value={t.value} on w={listW} rowH={rowH} bold={isFinal} accent={isFinal} />
          </div>
        );
      })}

      {/* shrink bar on the right */}
      <div style={{ position: "absolute", left: listW + 30, top: rowH * 0.4, width: barW, height: totalH, border: `3px solid ${COLOR.ink}`, background: COLOR.cardWhite }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: `${barFillFrac * 100}%`,
            background: frame >= tailStart ? COLOR.orange : COLOR.ink,
          }}
        />
        <div style={{ position: "absolute", left: 0, right: 0, top: -26, textAlign: "center", fontFamily: FONT.mono, fontSize: 13, color: COLOR.grey }}>value left</div>
      </div>
    </div>
  );
};

const Row: React.FC<{
  label: string;
  sub?: string;
  value: string;
  running?: string;
  on: boolean;
  w: number;
  rowH: number;
  bold?: boolean;
  accent?: boolean;
}> = ({ label, sub, value, running, on, w, rowH, bold, accent }) => {
  if (!on) return null;
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", width: w, height: rowH, borderBottom: `1.5px solid ${COLOR.grid}` }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: FONT.mono, fontSize: bold ? 24 : 20, letterSpacing: "0.04em", textTransform: "uppercase", color: accent ? COLOR.orange : COLOR.ink }}>{label}</span>
        {sub && <span style={{ fontFamily: FONT.mono, fontSize: 15, color: COLOR.grey }}>{sub}</span>}
      </div>
      <span style={{ fontFamily: FONT.hero, fontSize: bold ? 44 : 34, color: accent ? COLOR.orange : COLOR.ink, fontVariantNumeric: "tabular-nums" }}>
        {running ?? value}
      </span>
    </div>
  );
};
