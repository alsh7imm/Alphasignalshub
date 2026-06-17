import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile } from "remotion";
import { ORDER, STARTS, TOTAL_DURATION } from "./timeline";

// Background music + sound-effect cues, derived from the timeline so they stay
// in sync if scene lengths change. All assets are CC0 (FreePD music, Kenney SFX).

type Cue = { at: number; src: string; volume: number };

const CUES: Cue[] = [
  // A soft click as each scene opens.
  ...ORDER.map((k, i) => ({
    at: Math.max(STARTS[k], 2),
    src: "audio/pop.ogg",
    volume: i === 0 ? 0.38 : 0.4,
  })),
  // Card "whoosh in" when a signal card appears (card starts at scene+8).
  { at: STARTS.signalIntro + 8, src: "audio/card.ogg", volume: 0.5 },
  { at: STARTS.live + 8, src: "audio/card.ogg", volume: 0.5 },
  // Success chime when the first target is hit (badge pops at scene+34).
  { at: STARTS.live + 34, src: "audio/success.ogg", volume: 0.6 },
  // Positive cue when the subscribe button pops (button pops at scene+26).
  { at: STARTS.cta + 26, src: "audio/coin.ogg", volume: 0.6 },
];

export const AudioLayer: React.FC<{ total?: number }> = ({
  total = TOTAL_DURATION,
}) => {
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
