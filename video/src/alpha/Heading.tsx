import React from "react";
import { colors, arabic } from "./theme";
import { useRise } from "./SignalCard";

// Two-tone Arabic heading (some words gold, some white) used across scenes.
export const Heading: React.FC<{
  parts: { text: string; gold?: boolean }[];
  size?: number;
  start?: number;
  align?: "center" | "flex-start";
}> = ({ parts, size = 78, start = 4, align = "center" }) => {
  const rise = useRise(start);
  return (
    <h2
      style={{
        ...rise,
        fontFamily: arabic,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.2,
        margin: 0,
        textAlign: align === "center" ? "center" : "right",
        color: colors.ink,
      }}
    >
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.gold ? colors.gold : colors.ink }}>
          {p.text}
        </span>
      ))}
    </h2>
  );
};
