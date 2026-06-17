import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LightLeak } from "@remotion/light-leaks";
import { colors, arabic, latin, goldGradient } from "../theme";
import { GemLogo } from "../GemLogo";
import { useRise } from "../SignalCard";

// Scene 7 — call to action: bot handle + free public channel.
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gem = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120, mass: 0.8 },
  });
  const title = useRise(14);
  const btn = spring({
    frame: frame - 26,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });
  const free = useRise(48);

  // Gentle breathing glow on the bot button.
  const glow = 24 + Math.sin(frame / 7) * 10;

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
      <div style={{ transform: `scale(${gem})` }}>
        <GemLogo size={150} />
      </div>

      <div
        style={{
          ...title,
          fontFamily: arabic,
          fontWeight: 900,
          fontSize: 96,
          color: colors.ink,
        }}
      >
        اشترك <span style={{ color: colors.gold }}>الحين</span>
      </div>

      <div
        style={{
          opacity: btn,
          transform: `scale(${btn})`,
          direction: "ltr",
          fontFamily: latin,
          fontWeight: 800,
          fontSize: 60,
          color: "#1a1407",
          background: goldGradient,
          padding: "26px 64px",
          borderRadius: 999,
          boxShadow: `0 0 ${glow}px rgba(224,180,58,.6)`,
        }}
      >
        @AlphaSignalS7Bot
      </div>

      <div
        style={{
          ...free,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: 10,
        }}
      >
        <span style={{ fontFamily: arabic, fontWeight: 700, fontSize: 42, color: colors.ink }}>
          جرّب مجاناً في القناة العامة
        </span>
        <span style={{ direction: "ltr", fontFamily: latin, fontWeight: 800, fontSize: 46, color: colors.gold }}>
          @AlphaSignalsHubFree
        </span>
      </div>

      <AbsoluteFill style={{ opacity: 0.26, mixBlendMode: "screen" }}>
        <LightLeak durationInFrames={36} seed={6} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
