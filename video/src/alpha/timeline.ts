// Single source of truth for scene timing (frames @ 30fps).
// Both the composition and the audio layer derive from this so SFX stay in sync.

export const T = 11; // crossfade length between scenes

// Balanced holds — readable but not draggy.
export const D = {
  hook: 84,
  signalIntro: 108,
  brand: 96,
  features: 168,
  live: 126,
  tradeChart: 240,
  plans: 150,
  cta: 156,
} as const;

export const ORDER = [
  "hook",
  "signalIntro",
  "brand",
  "features",
  "live",
  "tradeChart",
  "plans",
  "cta",
] as const;

// Composition-frame at which each scene becomes the active one (accounts for
// the transition overlap).
export const STARTS: Record<(typeof ORDER)[number], number> = (() => {
  let s = 0;
  const out = {} as Record<(typeof ORDER)[number], number>;
  for (const k of ORDER) {
    out[k] = s;
    s += D[k] - T;
  }
  return out;
})();

export const TOTAL_DURATION = STARTS.cta + D.cta;
