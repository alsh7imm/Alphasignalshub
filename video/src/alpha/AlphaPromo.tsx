import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Background } from "./Background";
import { Intro } from "./scenes/Intro";
import { Services } from "./scenes/Services";
import { Plans } from "./scenes/Plans";
import { CTA } from "./scenes/CTA";

// Scene lengths (frames @ 30fps) and the crossfade length between them.
export const SCENES = {
  intro: 90,
  services: 240,
  plans: 240,
  cta: 180,
  transition: 18,
} as const;

// Total timeline = sum of scenes minus the overlap of each transition.
export const TOTAL_DURATION =
  SCENES.intro +
  SCENES.services +
  SCENES.plans +
  SCENES.cta -
  3 * SCENES.transition;

const timing = linearTiming({ durationInFrames: SCENES.transition });

export const AlphaPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES.intro}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={SCENES.services}>
          <Services />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={SCENES.plans}>
          <Plans />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={SCENES.cta}>
          <CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
