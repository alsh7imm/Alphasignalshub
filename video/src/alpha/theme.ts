// ALPHA SIGNALS HUB — brand design tokens (matches the reference promo)
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Arabic display/body = Tajawal. Latin (numbers, BUY, ALPHA SIGNALS) = Montserrat.
// The "α" gem glyph uses Reem Kufi.
export const arabic = "Tajawal";
export const latin = "Montserrat";
export const alphaFont = "Reem Kufi";

loadFont({ family: alphaFont, url: staticFile("fonts/ReemKufi.ttf") });
loadFont({ family: arabic, url: staticFile("fonts/Tajawal-Regular.ttf"), weight: "400" });
loadFont({ family: arabic, url: staticFile("fonts/Tajawal-Bold.ttf"), weight: "700" });
loadFont({ family: arabic, url: staticFile("fonts/Tajawal-Black.ttf"), weight: "900" });
loadFont({ family: latin, url: staticFile("fonts/Montserrat.ttf") });

export const colors = {
  bg: "#060a12",
  bgDeep: "#04060c",
  navy: "#0e1d36",
  panel: "#0f1c33",
  panel2: "#0c1626",
  cardLine: "rgba(224,180,58,.45)",
  gold: "#e0b43a",
  goldBright: "#f5d066",
  blue: "#5b9bd5",
  ink: "#f4f7fb",
  muted: "#8ea3bf",
  line: "rgba(255,255,255,.07)",
  red: "#f0524b",
  green: "#2bd17e",
  greenDeep: "#19b069",
} as const;

export const goldGradient = `linear-gradient(135deg, ${colors.goldBright}, ${colors.gold})`;
