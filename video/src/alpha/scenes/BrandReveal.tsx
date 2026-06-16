import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, arabic, latin } from "../theme";
import { GemLogo } from "../GemLogo";
import { useRise } from "../SignalCard";

// Scene 3 — brand reveal: gem logo + ALPHA SIGNALS wordmark + tagline.
export const BrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gem = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120, mass: 0.8 },
  });
  const word = useRise(16);
  const tag = useRise(28);

  return (
    <AbsoluteFill
      style={{
        direction: "rtl",
        alignItems: "center",
        justifyContent: "center",
        gap: 44,
        padding: 90,
      }}
    >
      <div style={{ transform: `scale(${gem})` }}>
        <GemLogo size={190} />
      </div>

      <div
        style={{
          ...word,
          fontFamily: latin,
          fontWeight: 800,
          fontSize: 86,
          letterSpacing: 3,
          whiteSpace: "nowrap",
          textAlign: "center",
          color: colors.gold,
          textShadow: "0 0 34px rgba(224,180,58,.45)",
        }}
      >
        ALPHA SIGNALS
      </div>

      <div
        style={{
          ...tag,
          fontFamily: arabic,
          fontWeight: 700,
          fontSize: 46,
          textAlign: "center",
          color: colors.ink,
        }}
      >
        إشاراتك للأسواق العالمية
      </div>
    </AbsoluteFill>
  );
};
