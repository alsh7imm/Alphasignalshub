import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "./theme";

// Gold text with a bright glint that sweeps across on a loop.
export const ShimmerText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  period?: number; // frames per sweep
}> = ({ children, style, period = 70 }) => {
  const frame = useCurrentFrame();
  const pos = interpolate(frame % period, [0, period], [200, -100]);

  return (
    <span
      style={{
        ...style,
        backgroundImage: `linear-gradient(110deg, ${colors.gold} 0%, ${colors.gold} 35%, #fff6da 50%, ${colors.gold} 65%, ${colors.gold} 100%)`,
        backgroundSize: "250% 100%",
        backgroundPositionX: `${pos}%`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
};
