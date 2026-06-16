import React from "react";
import { colors, alphaFont } from "./theme";

// Gold faceted gem (diamond) with an "α" in the table — the brand mark.
export const GemLogo: React.FC<{ size?: number; glow?: boolean }> = ({
  size = 150,
  glow = true,
}) => {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 120 145"
      style={{
        filter: glow
          ? "drop-shadow(0 0 24px rgba(224,180,58,.55))"
          : "none",
      }}
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.goldBright} />
          <stop offset="55%" stopColor={colors.gold} />
          <stop offset="100%" stopColor="#9c7a22" />
        </linearGradient>
      </defs>

      {/* Gem silhouette: table on top, point at the bottom */}
      <polygon
        points="60,143 3,47 21,14 99,14 117,47"
        fill={`url(#g-${id})`}
        stroke="rgba(10,15,26,.35)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {/* Facet lines */}
      <g stroke="rgba(10,15,26,.4)" strokeWidth={1.5} fill="none">
        <line x1="3" y1="47" x2="117" y2="47" />
        <line x1="21" y1="14" x2="40" y2="47" />
        <line x1="99" y1="14" x2="80" y2="47" />
        <line x1="40" y1="47" x2="60" y2="143" />
        <line x1="80" y1="47" x2="60" y2="143" />
      </g>
      {/* α glyph sitting in the table */}
      <text
        x="60"
        y="40"
        textAnchor="middle"
        fontFamily={alphaFont}
        fontSize="30"
        fontWeight={700}
        fill="#0a0f1a"
      >
        α
      </text>
    </svg>
  );
};
