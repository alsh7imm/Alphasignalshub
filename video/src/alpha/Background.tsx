import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "./theme";

// Atmospheric background: deep navy base, animated glow blobs, and a grid overlay.
// All motion is driven by the frame (no CSS animations).
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow, organic drift for the two glow blobs.
  const driftA = Math.sin(frame / 70) * 40;
  const driftB = Math.cos(frame / 90) * 50;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      {/* Gold glow top-right */}
      <div
        style={{
          position: "absolute",
          top: `${-10 + driftA / 20}%`,
          right: `${-10 + driftA / 30}%`,
          width: 900,
          height: 900,
          background: `radial-gradient(circle, rgba(212,175,55,.22), transparent 62%)`,
          filter: "blur(20px)",
        }}
      />
      {/* Cyan glow bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: `${-15 + driftB / 25}%`,
          left: `${-12 + driftB / 30}%`,
          width: 820,
          height: 820,
          background: `radial-gradient(circle, rgba(56,214,200,.16), transparent 60%)`,
          filter: "blur(20px)",
        }}
      />
      {/* Grid overlay, masked to fade at edges */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${colors.line} 1px, transparent 1px), linear-gradient(90deg, ${colors.line} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          opacity: 0.55,
          WebkitMaskImage:
            "radial-gradient(circle at 50% 38%, #000 28%, transparent 78%)",
          maskImage:
            "radial-gradient(circle at 50% 38%, #000 28%, transparent 78%)",
        }}
      />
    </AbsoluteFill>
  );
};
