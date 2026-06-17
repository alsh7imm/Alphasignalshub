import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile } from "remotion";

// Background music + sound-effect cues, timed to the scene beats.
// All assets are CC0 (FreePD music, Kenney SFX).

type Cue = { at: number; src: string; volume: number };

const CUES: Cue[] = [
  { at: 2, src: "audio/pop.ogg", volume: 0.4 }, // opening
  { at: 79, src: "audio/pop.ogg", volume: 0.4 }, // -> signal
  { at: 87, src: "audio/card.ogg", volume: 0.5 }, // card appears
  { at: 194, src: "audio/pop.ogg", volume: 0.42 }, // -> brand
  { at: 285, src: "audio/pop.ogg", volume: 0.4 }, // -> features
  { at: 418, src: "audio/pop.ogg", volume: 0.42 }, // -> live signal
  { at: 426, src: "audio/card.ogg", volume: 0.5 }, // live card
  { at: 452, src: "audio/success.ogg", volume: 0.6 }, // target hit
  { at: 581, src: "audio/pop.ogg", volume: 0.4 }, // -> plans
  { at: 708, src: "audio/pop.ogg", volume: 0.42 }, // -> CTA
  { at: 734, src: "audio/coin.ogg", volume: 0.6 }, // subscribe
];

export const AudioLayer: React.FC<{ total: number }> = ({ total }) => {
  return (
    <>
      <Audio
        src={staticFile("audio/music.mp3")}
        trimAfter={total}
        volume={(f) =>
          interpolate(
            f,
            [0, 20, total - 55, total],
            [0, 0.28, 0.28, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {CUES.map((c, i) => (
        <Sequence key={i} from={c.at}>
          <Audio src={staticFile(c.src)} volume={c.volume} />
        </Sequence>
      ))}
    </>
  );
};
