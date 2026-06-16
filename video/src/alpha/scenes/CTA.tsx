import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, display, body, goldGradient } from "../theme";
import { LogoMark } from "../LogoMark";

const SOCIALS = [
  "💬 تيليجرام · @ALPHA_SIGNALS7",
  "📸 إنستقرام · @ALPHASIGNALSBOT",
  "✖️ X · @ALPHASIGNALSBOT",
];

// Scene 4 — call to action with the Telegram handle and socials.
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [10, 30], [40, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gentle pulse on the CTA button.
  const pulse = 1 + Math.sin(frame / 8) * 0.025;
  const btnOpacity = interpolate(frame, [26, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        direction: "rtl",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: 90,
      }}
    >
      <div style={{ transform: `scale(${logoScale})` }}>
        <LogoMark size={130} />
      </div>

      <h2
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 80,
          textAlign: "center",
          margin: 0,
          color: colors.ink,
          lineHeight: 1.2,
        }}
      >
        ابدأ رحلتك مع
        <br />
        <span
          style={{
            background: goldGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          ALPHA SIGNALS
        </span>
      </h2>

      <div
        style={{
          opacity: btnOpacity,
          transform: `scale(${pulse})`,
          fontFamily: body,
          fontWeight: 700,
          fontSize: 44,
          color: "#0a0f1a",
          background: goldGradient,
          padding: "22px 60px",
          borderRadius: 18,
          boxShadow: "0 18px 44px rgba(212,175,55,.4)",
        }}
      >
        🚀 اشترك الآن
      </div>

      <div
        style={{
          opacity: btnOpacity,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        {SOCIALS.map((s) => (
          <span
            key={s}
            style={{
              fontFamily: body,
              fontWeight: 700,
              fontSize: 30,
              color: colors.ink,
              background: colors.panel,
              border: `1px solid ${colors.line}`,
              padding: "14px 30px",
              borderRadius: 14,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
