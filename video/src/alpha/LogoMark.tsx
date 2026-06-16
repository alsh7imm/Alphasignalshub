import React from "react";
import { colors, display } from "./theme";

// The square gold "α" badge used in the website nav/footer.
export const LogoMark: React.FC<{ size?: number }> = ({ size = 96 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        display: "grid",
        placeItems: "center",
        background: `linear-gradient(140deg, ${colors.gold}, #9a7b1e)`,
        color: "#0a0f1a",
        fontWeight: 900,
        fontFamily: display,
        fontSize: size * 0.58,
        boxShadow: "0 18px 40px rgba(212,175,55,.35)",
      }}
    >
      α
    </div>
  );
};
