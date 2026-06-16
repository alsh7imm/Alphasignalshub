import React from "react";
import { AbsoluteFill } from "remotion";
import { colors, arabic } from "../theme";
import { useRise } from "../SignalCard";

// Scene 1 — the hook: eyebrow + bold two-line claim.
export const Hook: React.FC = () => {
  const eyebrow = useRise(2);
  const line1 = useRise(10);
  const line2 = useRise(18);

  return (
    <AbsoluteFill
      style={{
        direction: "rtl",
        alignItems: "center",
        justifyContent: "center",
        padding: 90,
        gap: 18,
      }}
    >
      <div
        style={{
          ...eyebrow,
          fontFamily: arabic,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: 2,
          color: colors.gold,
        }}
      >
        ✦ بدون تخمين ✦
      </div>

      <div
        style={{
          ...line1,
          fontFamily: arabic,
          fontWeight: 900,
          fontSize: 130,
          lineHeight: 1.08,
          color: colors.ink,
        }}
      >
        تداول <span style={{ color: colors.gold }}>بإشارة</span>
      </div>
      <div
        style={{
          ...line2,
          fontFamily: arabic,
          fontWeight: 900,
          fontSize: 130,
          lineHeight: 1.08,
          color: colors.ink,
        }}
      >
        مو بالحظ
      </div>
    </AbsoluteFill>
  );
};
