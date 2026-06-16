import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, display, body } from "../theme";

const SERVICES = [
  { ico: "🔔", title: "الإشارات", desc: "بث تلقائي ٢٤ ساعة" },
  { ico: "📊", title: "التحليلات", desc: "تحليل فني لأي رمز" },
  { ico: "☁️", title: "السحابة", desc: "دعوم ومقاومات يومية" },
  { ico: "📅", title: "التقويم الاقتصادي", desc: "أحداث الدولار لحظياً" },
  { ico: "📰", title: "الأخبار", desc: "أهم الأخبار فور صدورها" },
  { ico: "📚", title: "الأكاديمية", desc: "دروس تعليمية مختارة" },
];

const Card: React.FC<{
  ico: string;
  title: string;
  desc: string;
  index: number;
}> = ({ ico, title, desc, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = 14 + index * 6;

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 110, mass: 0.7 },
  });
  const y = interpolate(enter, [0, 1], [50, 0]);

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${y}px)`,
        background: `linear-gradient(160deg, ${colors.panel}, ${colors.panel2})`,
        border: `1px solid ${colors.line}`,
        borderRadius: 28,
        padding: "34px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <span style={{ fontSize: 64, lineHeight: 1 }}>{ico}</span>
      <h3
        style={{
          fontFamily: display,
          fontWeight: 600,
          fontSize: 40,
          margin: 0,
          color: colors.ink,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: body,
          fontSize: 28,
          margin: 0,
          color: colors.muted,
        }}
      >
        {desc}
      </p>
    </div>
  );
};

// Scene 2 — the six services in a 2-column grid with a staggered entrance.
export const Services: React.FC = () => {
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
      <div style={{ opacity: headOpacity, textAlign: "center", marginBottom: 56 }}>
        <h2
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 72,
            margin: 0,
            color: colors.ink,
          }}
        >
          ما يقدّمه البوت
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {SERVICES.map((s, i) => (
          <Card key={s.title} {...s} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
