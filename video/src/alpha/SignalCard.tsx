import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, arabic, latin } from "./theme";
import { GemLogo } from "./GemLogo";

export type Row = {
  label: string;
  value: string;
  tone: "white" | "red" | "green";
  checked?: boolean;
};

const toneColor = {
  white: colors.ink,
  red: colors.red,
  green: colors.green,
} as const;

// The trading-signal mock card (BUY / GOLD / entry-stop-targets).
export const SignalCard: React.FC<{
  symbol?: string;
  rows: Row[];
  hit?: boolean;
  startAt?: number;
}> = ({ symbol = "GOLD", rows, hit = false, startAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startAt;

  const enter = spring({
    frame: f,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.8 },
  });
  const cardY = interpolate(enter, [0, 1], [70, 0]);

  // Hit badge pops in late.
  const badge = spring({
    frame: f - 26,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.7 },
  });

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${cardY}px)`,
        width: 860,
        margin: "0 auto",
        position: "relative",
        background: `linear-gradient(165deg, ${colors.panel}, ${colors.panel2})`,
        border: `2px solid ${colors.cardLine}`,
        borderRadius: 34,
        padding: "40px 46px 34px",
        boxShadow: "0 30px 70px rgba(0,0,0,.45)",
      }}
    >
      {/* Header (LTR: BUY on the left, GOLD on the right) */}
      <div
        style={{
          direction: "ltr",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          position: "relative",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: `linear-gradient(135deg, ${colors.green}, ${colors.greenDeep})`,
              color: "#06281a",
              fontFamily: latin,
              fontWeight: 800,
              fontSize: 40,
              padding: "12px 34px",
              borderRadius: 999,
            }}
          >
            ▲ BUY
          </div>
          {hit && (
            <div
              style={{
                position: "absolute",
                top: -34,
                right: -10,
                transform: `scale(${badge}) rotate(-6deg)`,
                transformOrigin: "center",
                background: `linear-gradient(135deg, ${colors.green}, ${colors.greenDeep})`,
                color: "#06281a",
                fontFamily: arabic,
                fontWeight: 900,
                fontSize: 26,
                padding: "8px 18px",
                borderRadius: 14,
                whiteSpace: "nowrap",
                boxShadow: "0 10px 24px rgba(43,209,126,.35)",
              }}
            >
              ✅ الهدف الأول تحقّق
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: latin,
            fontWeight: 800,
            fontSize: 46,
            color: colors.ink,
          }}
        >
          {symbol}
          <GemLogo size={34} glow={false} />
        </div>
      </div>

      {/* Rows */}
      {rows.map((r, i) => {
        const rf = spring({
          frame: f - 12 - i * 5,
          fps,
          config: { damping: 20, stiffness: 120 },
        });
        return (
          <div
            key={r.label}
            style={{
              opacity: rf,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 6px",
              borderTop: i === 0 ? "none" : `1px solid ${colors.line}`,
            }}
          >
            <span
              style={{
                fontFamily: latin,
                fontWeight: 700,
                fontSize: 46,
                color: toneColor[r.tone],
              }}
            >
              {r.value}
            </span>
            <span
              style={{
                fontFamily: arabic,
                fontWeight: 700,
                fontSize: 40,
                color: r.checked ? colors.ink : colors.muted,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {r.label}
              {r.checked && <span style={{ color: colors.green }}>✅</span>}
            </span>
          </div>
        );
      })}

      {/* Footer */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 18,
          borderTop: `1px solid ${colors.line}`,
          textAlign: "center",
          fontFamily: latin,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 2,
          color: colors.gold,
        }}
      >
        ALPHA SIGNALS
      </div>
    </div>
  );
};

// Shared entrance helper for headings: fade + rise.
export const useRise = (start: number, len = 18) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [start, start + len], [40, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `translateY(${y}px)` };
};
