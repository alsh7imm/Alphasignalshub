import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, display, body } from "../theme";
import { LogoMark } from "../LogoMark";

// Scene 1 — Brand intro: logo pops in, title and tagline rise up.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const titleY = interpolate(frame, [12, 34], [60, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [12, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subY = interpolate(frame, [28, 50], [40, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(frame, [28, 50], [0, 1], {
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
        padding: 80,
      }}
    >
      <div style={{ transform: `scale(${logoScale})` }}>
        <LogoMark size={180} />
      </div>

      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.1,
            margin: 0,
            background: "linear-gradient(180deg, #fff, #a9bcd9)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          ALPHA
        </h1>
        <h1
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.05,
            margin: 0,
            background: `linear-gradient(120deg, ${colors.goldBright}, ${colors.gold})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          SIGNALS HUB
        </h1>
      </div>

      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          fontFamily: body,
          fontWeight: 700,
          fontSize: 34,
          color: colors.goldBright,
          background: "rgba(212,175,55,.1)",
          border: "1px solid rgba(212,175,55,.28)",
          padding: "16px 32px",
          borderRadius: 999,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: colors.green,
            boxShadow: `0 0 16px ${colors.green}`,
          }}
        />
        بوت تعليمي وتحليلي · بث آلي ٢٤ ساعة
      </div>
    </AbsoluteFill>
  );
};
