import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, arabic, latin } from "../theme";
import { Heading } from "../Heading";

// ---- Trade data (GOLD BUY) — kept consistent with the signal cards ----
const ENTRY = 2348.5;
const SL = 2341.0;
const TPS = [2355.0, 2362.5, 2371.0];

// Deterministic close prices: small dip near entry, then a climb that
// crosses TP1, TP2, TP3 in turn (never breaking the stop).
const CLOSES = [
  2347.0, 2346.2, 2345.0, 2344.6, 2345.8, 2347.2, 2346.5, 2348.0, 2349.5,
  2351.0, 2350.3, 2352.4, 2353.6, 2354.2, 2355.4, 2356.8, 2357.5, 2359.0,
  2360.2, 2361.0, 2362.0, 2362.8, 2363.5, 2364.8, 2366.0, 2367.2, 2368.5,
  2369.4, 2370.6, 2371.4, 2372.2, 2371.8,
];
const N = CLOSES.length;
// First candle index whose close reaches each TP.
const TP_INDICES = TPS.map((tp) => CLOSES.findIndex((c) => c >= tp));

// ---- Reveal timing (local scene frames) — exported for audio sync ----
export const REVEAL_START = 14;
export const FRAMES_PER_CANDLE = 5;
export const TP_HIT_FRAMES = TP_INDICES.map(
  (i) => REVEAL_START + i * FRAMES_PER_CANDLE,
);

// ---- Chart geometry (panel-local pixels) ----
const W = 940;
const H = 1010;
const PLOT_L = 34;
const PLOT_R = W - 132; // room for price axis + tags
const PLOT_T = 70;
const PLOT_B = H - 58; // room for time axis
const PLOT_W = PLOT_R - PLOT_L;
const PLOT_H = PLOT_B - PLOT_T;
const P_MIN = 2336;
const P_MAX = 2376;
const SPACING = PLOT_W / (N + 1);
const CANDLE_W = SPACING * 0.62;

const yOf = (p: number) => PLOT_T + ((P_MAX - p) / (P_MAX - P_MIN)) * PLOT_H;
const xOf = (i: number) => PLOT_L + (i + 1) * SPACING;

const CANDLES = CLOSES.map((c, i) => {
  const open = i === 0 ? ENTRY : CLOSES[i - 1];
  const up = c >= open;
  const wick = 0.3 + ((i * 37) % 7) / 10;
  return {
    open,
    close: c,
    up,
    high: Math.max(open, c) + wick,
    low: Math.min(open, c) - wick,
  };
});

const GRID = [2340, 2345, 2350, 2355, 2360, 2365, 2370, 2375];
const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

type Level = { price: number; label: string; color: string; tp?: number };
const LEVELS: Level[] = [
  { price: TPS[2], label: "هدف 3", color: colors.green, tp: 2 },
  { price: TPS[1], label: "هدف 2", color: colors.green, tp: 1 },
  { price: TPS[0], label: "هدف 1", color: colors.green, tp: 0 },
  { price: ENTRY, label: "دخول", color: colors.gold },
  { price: SL, label: "وقف", color: colors.red },
];

export const TradeChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visible = Math.max(
    0,
    Math.min(N, Math.floor((frame - REVEAL_START) / FRAMES_PER_CANDLE) + 1),
  );
  const lastClose = visible > 0 ? CANDLES[visible - 1].close : ENTRY;
  const pips = Math.round((lastClose - ENTRY) * 10);
  const hitCount = TP_INDICES.filter((i) => i >= 0 && visible > i).length;

  const panelEnter = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 100, mass: 0.8 },
  });

  return (
    <AbsoluteFill
      style={{
        direction: "rtl",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
        padding: "70px 0",
      }}
    >
      <Heading
        size={70}
        parts={[{ text: "الصفقة " }, { text: "مباشرة على الشارت", gold: true }]}
      />

      <div
        style={{
          opacity: panelEnter,
          transform: `translateY(${interpolate(panelEnter, [0, 1], [50, 0])}px)`,
          position: "relative",
          width: W,
          height: H,
          background: "linear-gradient(170deg, #0c1626, #0a121f)",
          border: `1px solid ${colors.cardLine}`,
          borderRadius: 26,
          boxShadow: "0 30px 70px rgba(0,0,0,.5)",
          overflow: "hidden",
        }}
      >
        {/* Symbol header bar */}
        <div
          style={{
            direction: "ltr",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 22px",
            borderBottom: `1px solid ${colors.line}`,
            background: "rgba(255,255,255,.02)",
          }}
        >
          <span style={{ fontFamily: latin, fontWeight: 800, fontSize: 30, color: colors.ink }}>
            GOLD<span style={{ color: colors.muted, fontSize: 22 }}> · 15m</span>
          </span>
          <span style={{ fontFamily: latin, fontWeight: 800, fontSize: 30, color: colors.green }}>
            {lastClose.toFixed(1)} ▲
          </span>
        </div>

        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {/* Horizontal grid */}
          {GRID.map((p) => (
            <g key={`h${p}`}>
              <line
                x1={PLOT_L}
                y1={yOf(p)}
                x2={PLOT_R}
                y2={yOf(p)}
                stroke="rgba(255,255,255,.05)"
                strokeWidth={1}
              />
            </g>
          ))}
          {/* Vertical grid */}
          {TIMES.map((_, k) => {
            const x = PLOT_L + (k * PLOT_W) / (TIMES.length - 1);
            return (
              <line
                key={`v${k}`}
                x1={x}
                y1={PLOT_T}
                x2={x}
                y2={PLOT_B}
                stroke="rgba(255,255,255,.04)"
                strokeWidth={1}
              />
            );
          })}

          {/* Level lines (dashed) */}
          {LEVELS.map((lv) => {
            const hit = lv.tp !== undefined && TP_INDICES[lv.tp] >= 0 && visible > TP_INDICES[lv.tp];
            return (
              <line
                key={lv.label}
                x1={PLOT_L}
                y1={yOf(lv.price)}
                x2={PLOT_R}
                y2={yOf(lv.price)}
                stroke={lv.color}
                strokeWidth={hit ? 2.5 : 1.5}
                strokeDasharray="9 7"
                opacity={hit ? 1 : 0.7}
              />
            );
          })}

          {/* Candles */}
          {CANDLES.slice(0, visible).map((c, i) => {
            const x = xOf(i);
            const col = c.up ? colors.green : colors.red;
            const bodyTop = yOf(Math.max(c.open, c.close));
            const bodyBottom = yOf(Math.min(c.open, c.close));
            return (
              <g key={i}>
                <line x1={x} y1={yOf(c.high)} x2={x} y2={yOf(c.low)} stroke={col} strokeWidth={2} />
                <rect
                  x={x - CANDLE_W / 2}
                  y={bodyTop}
                  width={CANDLE_W}
                  height={Math.max(bodyBottom - bodyTop, 2)}
                  fill={col}
                  rx={1.5}
                />
              </g>
            );
          })}

          {/* Current price marker line */}
          {visible > 0 && (
            <line
              x1={PLOT_L}
              y1={yOf(lastClose)}
              x2={PLOT_R}
              y2={yOf(lastClose)}
              stroke={colors.goldBright}
              strokeWidth={1.5}
              strokeDasharray="2 4"
              opacity={0.8}
            />
          )}
        </svg>

        {/* Price-axis numbers (right) */}
        {GRID.map((p) => (
          <div
            key={`pl${p}`}
            style={{
              position: "absolute",
              top: yOf(p) - 13,
              right: 8,
              width: 116,
              textAlign: "center",
              fontFamily: latin,
              fontWeight: 600,
              fontSize: 19,
              color: "rgba(142,163,191,.6)",
            }}
          >
            {p}
          </div>
        ))}

        {/* Price-axis level tags (right) */}
        {LEVELS.map((lv) => {
          const hit = lv.tp !== undefined && TP_INDICES[lv.tp] >= 0 && visible > TP_INDICES[lv.tp];
          return (
            <div
              key={lv.label}
              style={{
                position: "absolute",
                top: yOf(lv.price) - 17,
                right: 8,
                width: 116,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                borderRadius: 8,
                background: hit ? lv.color : "rgba(0,0,0,.35)",
                border: `1px solid ${lv.color}`,
                fontFamily: arabic,
                fontWeight: 900,
                fontSize: 22,
                color: hit ? "#06121d" : lv.color,
              }}
            >
              {hit && <span>✅</span>}
              {lv.label}
            </div>
          );
        })}

        {/* Time axis */}
        {TIMES.map((t, k) => (
          <div
            key={t}
            style={{
              direction: "ltr",
              position: "absolute",
              top: PLOT_B + 12,
              left: PLOT_L + (k * PLOT_W) / (TIMES.length - 1) - 26,
              width: 52,
              textAlign: "center",
              fontFamily: latin,
              fontWeight: 600,
              fontSize: 20,
              color: colors.muted,
            }}
          >
            {t}
          </div>
        ))}

        {/* Live P/L + targets-hit counter (top-left, clear of the price axis) */}
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 18,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: latin,
              fontWeight: 800,
              fontSize: 40,
              color: colors.green,
              textShadow: "0 0 18px rgba(43,209,126,.4)",
            }}
          >
            +{pips} <span style={{ fontFamily: arabic, fontSize: 26 }}>نقطة</span>
          </div>
          <div
            style={{
              fontFamily: arabic,
              fontWeight: 900,
              fontSize: 26,
              color: colors.gold,
              background: "rgba(224,180,58,.12)",
              border: `1px solid ${colors.cardLine}`,
              borderRadius: 999,
              padding: "5px 16px",
            }}
          >
            {hitCount}/3 أهداف ✅
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
