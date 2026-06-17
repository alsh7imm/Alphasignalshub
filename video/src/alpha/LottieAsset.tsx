import React, { useEffect, useState } from "react";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import {
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";

// Loads a local Lottie JSON (from public/) and renders it.
export const LottieAsset: React.FC<{
  src: string;
  style?: React.CSSProperties;
  loop?: boolean;
}> = ({ src, style, loop = false }) => {
  const [handle] = useState(() => delayRender("Loading Lottie"));
  const [data, setData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(staticFile(src))
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle]);

  if (!data) return null;
  return <Lottie animationData={data} style={style} loop={loop} />;
};
