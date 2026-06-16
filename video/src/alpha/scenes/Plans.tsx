import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, display, body, goldGradient } from "../theme";

type Plan = {
  emoji: string;
  name: string;
  dur: string;
  price: string;
  save?: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  { emoji: "💎", name: "الماسية", dur: "شهر واحد", price: "300" },
  {
    emoji: "🏆",
    name: "الذهبية",
    dur: "شهرين",
    price: "500",
    save: "توفير 100 درهم",
  },
  {
    emoji: "⭐",
    name: "البلاتينيوم",
    dur: "3 شهور",
    price: "900",
    save: "يشمل المؤشر مجاناً",
    featured: true,
  },
];

const PlanRow: React.FC<{ plan: Plan; index: number }> = ({ plan, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = 16 + index * 10;

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.7 },
  });
  const x = interpolate(enter, [0, 1], [80, 0]);

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateX(${x}px)`,
        position: "relative",
        background: `linear-gradient(165deg, ${colors.panel}, ${colors.panel2})`,
        border: plan.featured
          ? `2px solid ${colors.gold}`
          : `1px solid ${colors.line}`,
        boxShadow: plan.featured
          ? "0 24px 60px rgba(212,175,55,.22)"
          : "none",
        borderRadius: 28,
        padding: "30px 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
      }}
    >
      {plan.featured && (
        <span
          style={{
            position: "absolute",
            top: -18,
            right: 36,
            fontFamily: body,
            fontWeight: 700,
            fontSize: 24,
            background: goldGradient,
            color: "#0a0f1a",
            padding: "6px 20px",
            borderRadius: 999,
          }}
        >
          🔥 الأفضل قيمة
        </span>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 46,
            color: colors.ink,
          }}
        >
          {plan.emoji} {plan.name}
        </span>
        <span style={{ fontFamily: body, fontSize: 28, color: colors.muted }}>
          اشتراك {plan.dur}
        </span>
        {plan.save && (
          <span
            style={{
              fontFamily: body,
              fontWeight: 700,
              fontSize: 26,
              color: colors.green,
            }}
          >
            {plan.save}
          </span>
        )}
      </div>

      <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
        <span
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 72,
            background: goldGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {plan.price}
        </span>
        <span style={{ fontFamily: body, fontSize: 28, color: colors.muted }}>
          {" "}
          درهم
        </span>
      </div>
    </div>
  );
};

// Scene 3 — the three subscription plans, sliding in from the side.
export const Plans: React.FC = () => {
  const frame = useCurrentFrame();
  const headOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        direction: "rtl",
        padding: "100px 70px",
        justifyContent: "center",
      }}
    >
      <div style={{ opacity: headOpacity, textAlign: "center", marginBottom: 50 }}>
        <h2
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 72,
            margin: 0,
            color: colors.ink,
          }}
        >
          الباقات
        </h2>
        <div
          style={{
            width: 90,
            height: 5,
            borderRadius: 3,
            margin: "20px auto 0",
            background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan})`,
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {PLANS.map((p, i) => (
          <PlanRow key={p.name} plan={p} index={i} />
        ))}
      </div>

      <p
        style={{
          fontFamily: body,
          fontSize: 26,
          color: colors.cyan,
          textAlign: "center",
          marginTop: 40,
        }}
      >
        ✨ مؤشر ALPHA SIGNALS متوفّر على TradingView
      </p>
    </AbsoluteFill>
  );
};
