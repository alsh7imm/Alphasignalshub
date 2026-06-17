import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, arabic } from "../theme";
import { Heading } from "../Heading";

const FEATURES = [
  "إشارات بيع وشراء بدخول ووقف و٣ أهداف",
  "متابعة لحظية للأهداف + تنبيه تأمين الأرباح",
  "تقارير يومية وأسبوعية + تقويم اقتصادي",
  "تطبيق iOS فيه شارت مباشر وأكاديمية",
];

const FeatureRow: React.FC<{ text: string; index: number }> = ({
  text,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - 16 - index * 7,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.7 },
  });
  const x = interpolate(enter, [0, 1], [70, 0]);

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "center",
        gap: 24,
        background: `linear-gradient(160deg, ${colors.panel}, ${colors.panel2})`,
        border: `1px solid ${colors.line}`,
        borderRadius: 24,
        padding: "30px 34px",
      }}
    >
      <span
        style={{
          width: 56,
          height: 56,
          flexShrink: 0,
          borderRadius: "50%",
          border: `3px solid ${colors.gold}`,
          color: colors.gold,
          display: "grid",
          placeItems: "center",
          fontSize: 34,
          fontWeight: 900,
        }}
      >
        ✓
      </span>
      <span
        style={{
          flex: 1,
          fontFamily: arabic,
          fontWeight: 700,
          fontSize: 44,
          color: colors.ink,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Scene 4 — "what you get" benefit list.
export const Features: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        direction: "rtl",
        flexDirection: "column",
        justifyContent: "center",
        gap: 28,
        padding: "100px 70px",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Heading
          size={80}
          parts={[{ text: "شو اللي " }, { text: "بتحصل عليه", gold: true }]}
        />
      </div>
      {FEATURES.map((t, i) => (
        <FeatureRow key={t} text={t} index={i} />
      ))}
    </AbsoluteFill>
  );
};
