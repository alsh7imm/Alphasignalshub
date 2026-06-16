// ALPHA SIGNALS HUB — brand design tokens (mirrors the website identity)
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Local Arabic fonts (bundled in public/fonts). Loaded at module import so they
// are ready before the first frame renders.
export const display = "Reem Kufi";
export const body = "Tajawal";

loadFont({ family: display, url: staticFile("fonts/ReemKufi.ttf") });
loadFont({
  family: body,
  url: staticFile("fonts/Tajawal-Regular.ttf"),
  weight: "400",
});
loadFont({
  family: body,
  url: staticFile("fonts/Tajawal-Bold.ttf"),
  weight: "700",
});
loadFont({
  family: body,
  url: staticFile("fonts/Tajawal-Black.ttf"),
  weight: "900",
});

export const colors = {
  bg: "#070b14",
  bg2: "#0c1322",
  panel: "#101a2e",
  panel2: "#0e1626",
  gold: "#d4af37",
  goldBright: "#f5d878",
  cyan: "#38d6c8",
  ink: "#eef3fb",
  muted: "#8ea0bd",
  line: "rgba(255,255,255,.08)",
  red: "#ef4444",
  green: "#22c55e",
} as const;

export const goldGradient = `linear-gradient(135deg, ${colors.goldBright}, ${colors.gold})`;
