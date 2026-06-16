import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, arabic, latin } from "../theme";
import { Heading } from "../Heading";

type Plan = {
  name: string;
  price: string;
  per: string;
  note?: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  { name: "الماسية", price: "300", per: "درهم / شهر" },
  { name: "الذهبية", price: "500", per: "درهم / شهرين", featured: true },
  { name: "البلاتينيوم", price: "900", per: "درهم / ٣ شهور", note: "★ يشمل المؤشر" },
];

const PlanRow: React.FC<{ plan: Plan; index: number }> = ({ plan, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - 16 - index * 8,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.7 },
  });
  const y = interpolate(enter, [0, 1], [50, 0]);

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${y}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: `linear-gradient(160deg, ${colors.panel}, ${colors.panel2})`,
        border: plan.featured
          ? `2px solid ${colors.gold}`
          : `1px solid ${colors.line}`,
        boxShadow: plan.featured ? "0 0 36px rgba(224,180,58,.28)" : "none",
        borderRadius: 26,
        padding: "32px 40px",
      }}
    >
      {/* Right: name + note */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span
          style={{
            fontFamily: arabic,
            fontWeight: 900,
            fontSize: 54,
            color: colors.gold,
          }}
        >
          💎 {plan.name}
        </span>
        {plan.note && (
          <span
            style={{
              fontFamily: arabic,
              fontWeight: 700,
              fontSize: 30,
              color: colors.green,
            }}
          >
            {plan.note}
          </span>
        )}
      </div>

      {/* Left: price */}
      <div style={{ textAlign: "left" }}>
        <div
          style={{
            fontFamily: latin,
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1,
            color: colors.ink,
          }}
        >
          {plan.price}
        </div>
        <div style={{ fontFamily: arabic, fontSize: 30, color: colors.muted }}>
          {plan.per}
        </div>
      </div>
    </div>
  );
};

// Scene 6 — subscription plans.
export const Plans: React.FC = () => {
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
      <div style={{ marginBottom: 28 }}>
        <Heading
          size={84}
          parts={[{ text: "اختر " }, { text: "باقتك", gold: true }]}
        />
      </div>
      {PLANS.map((p, i) => (
        <PlanRow key={p.name} plan={p} index={i} />
      ))}
    </AbsoluteFill>
  );
};
