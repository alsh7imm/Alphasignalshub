import "./index.css";
import { Composition } from "remotion";
import { AlphaPromo, TOTAL_DURATION } from "./alpha/AlphaPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AlphaPromo"
        component={AlphaPromo}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
