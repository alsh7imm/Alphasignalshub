import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile } from "remotion";
import { ORDER, STARTS, TOTAL_DURATION } from "./timeline";
import { TP_HIT_FRAMES } from "./scenes/TradeChart";

// Background music + sound-effect cues, derived from the timeline so they stay
// in sync if scene lengths change. All assets are CC0 (FreePD music, Kenney SFX).

type Cue = { at: number; src: string; volume: number };

const CUES: Cue[] = [
  // Soft click as each scene opens.
  ...ORDER.map((k, i) => ({
    at: Math.max(STARTS[k], 2),
    src: "audio/click2.ogg",
    volume: i === 0 ? 0.34 : 0.36,
  })),
  // Panel "appear" when signal cards / the chart show up.
  { at: STARTS.signalIntro + 8, src: "audio/panel.ogg", volume: 0.5 },
  { at: STARTS.live + 8, src: "audio/panel.ogg", volume: 0.5 },
  { at: STARTS.tradeChart + 6, src: "audio/panel.ogg", volume: 0.5 },
  // Live-signal first-target badge.
  { at: STARTS.live + 34, src: "audio/coin2.ogg", volume: 0.5 },
  // Chart: a ding as each target is hit (escalating), plus a win sting on TP3.
  ...TP_HIT_FRAMES.map((f, i) => ({
    at: STARTS.tradeChart + f,
    src: "audio/tp.ogg",
    volume: 0.5 + i * 0.07,
  })),
  { at: STARTS.tradeChart + TP_HIT_FRAMES[2] + 4, src: "audio/win.ogg", volume: 0.5 },
  // Subscribe.
  { at: STARTS.cta + 26, src: "audio/win.ogg", volume: 0.55 },
  { at: STARTS.cta + 30, src: "audio/coin2.ogg", volume: 0.5 },
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
          interpolate(f, [0, 20, total - 55, total], [0, 0.28, 0.28, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
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
