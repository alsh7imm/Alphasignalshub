import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Background } from "./Background";
import { AudioLayer } from "./AudioLayer";
import { Hook } from "./scenes/Hook";
import { SignalIntro } from "./scenes/SignalIntro";
import { BrandReveal } from "./scenes/BrandReveal";
import { Features } from "./scenes/Features";
import { LiveSignal } from "./scenes/LiveSignal";
import { Plans } from "./scenes/Plans";
import { CTA } from "./scenes/CTA";

// Scene lengths (frames @ 30fps). Generous holds so every scene is readable.
const D = {
  hook: 90,
  signalIntro: 126,
  brand: 102,
  features: 144,
  live: 174,
  plans: 138,
  cta: 138,
} as const;

const T = 11; // crossfade length
const SCENES = Object.values(D);

// Total = sum of scenes minus the overlap of each transition.
export const TOTAL_DURATION =
  SCENES.reduce((a, b) => a + b, 0) - (SCENES.length - 1) * T;

const timing = linearTiming({ durationInFrames: T });
const cut = () => (
  <TransitionSeries.Transition presentation={fade()} timing={timing} />
);

export const AlphaPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <AudioLayer total={TOTAL_DURATION} />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={D.hook}>
          <Hook />
        </TransitionSeries.Sequence>
        {cut()}
        <TransitionSeries.Sequence durationInFrames={D.signalIntro}>
          <SignalIntro />
        </TransitionSeries.Sequence>
        {cut()}
        <TransitionSeries.Sequence durationInFrames={D.brand}>
          <BrandReveal />
        </TransitionSeries.Sequence>
        {cut()}
        <TransitionSeries.Sequence durationInFrames={D.features}>
          <Features />
        </TransitionSeries.Sequence>
        {cut()}
        <TransitionSeries.Sequence durationInFrames={D.live}>
          <LiveSignal />
        </TransitionSeries.Sequence>
        {cut()}
        <TransitionSeries.Sequence durationInFrames={D.plans}>
          <Plans />
        </TransitionSeries.Sequence>
        {cut()}
        <TransitionSeries.Sequence durationInFrames={D.cta}>
          <CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
