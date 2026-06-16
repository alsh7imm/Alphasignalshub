import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, latin } from "../theme";
import { Heading } from "../Heading";
import { SignalCard, Row } from "../SignalCard";

const ROWS: Row[] = [
  { label: "الدخول", value: "2348.5", tone: "white" },
  { label: "وقف الخسارة", value: "2341.0", tone: "red" },
  { label: "الهدف الأول", value: "2355.0", tone: "green", checked: true },
  { label: "الهدف الثاني", value: "2362.5", tone: "green" },
  { label: "الهدف الثالث", value: "2371.0", tone: "green" },
];

const SYMBOLS = ["GOLD", "US500", "US100", "US30", "BTCUSD", "OIL", "SILVER"];

const Pill: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - 52 - index * 4,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.6 },
  });
  return (
    <span
      style={{
        opacity: enter,
        transform: `scale(${enter})`,
        fontFamily: latin,
        fontWeight: 700,
        fontSize: 34,
        color: colors.gold,
        border: `1px solid ${colors.cardLine}`,
        borderRadius: 999,
        padding: "12px 30px",
      }}
    >
      {text}
    </span>
  );
};

// Scene 5 — full live signal: 5-row card, target-hit badge, then symbol pills.
export const LiveSignal: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        direction: "rtl",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 44,
        padding: "90px 60px",
      }}
    >
      <Heading
        size={76}
        parts={[
          { text: "إشارات " },
          { text: "لحظية", gold: true },
          { text: " ومتابعة كاملة" },
        ]}
      />
      <SignalCard rows={ROWS} hit startAt={8} />

      <div
        style={{
          direction: "ltr",
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
          maxWidth: 860,
        }}
      >
        {SYMBOLS.map((s, i) => (
          <Pill key={s} text={s} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
