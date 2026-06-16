import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "./theme";

// Deterministic rising candlestick chart, drawn faintly in the lower area.
// Heights trend upward left -> right to suggest a bullish market.
type Candle = { up: boolean; bodyTop: number; bodyH: number; wick: number };

const CANDLES: Candle[] = Array.from({ length: 16 }, (_, i) => {
  const base = 560 - i * 26; // rising baseline
  const swing = ((i * 37) % 11) - 5; // pseudo-random jitter
  const up = (i * 7) % 3 !== 0;
  return {
    up,
    bodyTop: base + swing * 4,
    bodyH: 46 + ((i * 53) % 60),
    wick: 28 + ((i * 29) % 34),
  };
});

const Candles: React.FC = () => {
  const frame = useCurrentFrame();
  // One-time grow-in over the first ~40 frames of the whole timeline.
  const grow = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, opacity: 0.5 }}
    >
      <g transform="translate(40, 1140)">
        {CANDLES.map((c, i) => {
          const x = i * 64;
          const color = c.up ? "rgba(43,150,110,.55)" : "rgba(70,90,120,.5)";
          const h = c.bodyH * grow;
          const w = c.wick * grow;
          return (
            <g key={i}>
              <line
                x1={x + 16}
                y1={c.bodyTop - w}
                x2={x + 16}
                y2={c.bodyTop + h + w}
                stroke={color}
                strokeWidth={3}
              />
              <rect
                x={x}
                y={c.bodyTop}
                width={32}
                height={Math.max(h, 2)}
                rx={4}
                fill={color}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

// Full background: deep navy gradient + soft glows + candlestick chart.
export const Background: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bgDeep, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 50% 18%, ${colors.navy}, ${colors.bg} 55%, ${colors.bgDeep} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 760,
          height: 520,
          background: "radial-gradient(circle, rgba(91,155,213,.16), transparent 65%)",
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          right: "-8%",
          width: 620,
          height: 620,
          background: "radial-gradient(circle, rgba(224,180,58,.10), transparent 62%)",
          filter: "blur(20px)",
        }}
      />
      <Candles />
    </AbsoluteFill>
  );
};
