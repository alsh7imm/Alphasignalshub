import React from "react";
import { AbsoluteFill } from "remotion";
import { Heading } from "../Heading";
import { SignalCard, Row } from "../SignalCard";

const ROWS: Row[] = [
  { label: "الدخول", value: "2348.5", tone: "white" },
  { label: "وقف الخسارة", value: "2341.0", tone: "red" },
  { label: "الهدف الأول", value: "2355.0", tone: "green" },
];

// Scene 2 — claim headline with a 3-row signal card sliding up.
export const SignalIntro: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        direction: "rtl",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
        padding: "90px 60px",
      }}
    >
      <Heading
        size={92}
        parts={[
          { text: "تداول " },
          { text: "بإشارة", gold: true },
          { text: " مو بالحظ" },
        ]}
      />
      <SignalCard rows={ROWS} startAt={8} />
    </AbsoluteFill>
  );
};
