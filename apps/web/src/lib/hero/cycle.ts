// Timing of the hero particle cycle (DESIGN.md → Motion → Hero Particle Flow).
// Bound particles gather into the logo, hold, then a released share drifts off with the wind and returns.

export const GATHER_SECONDS = 1.6;
export const HOLD_SECONDS = 6;
export const RELEASE_SECONDS = 1.2;
export const DRIFT_SECONDS = 1.6;
export const RETURN_SECONDS = 1.6;

const LOOP_START = GATHER_SECONDS;
const RELEASE_AT = GATHER_SECONDS + HOLD_SECONDS;
const RETURN_AT = RELEASE_AT + RELEASE_SECONDS + DRIFT_SECONDS;
const LOOP_END = RETURN_AT + RETURN_SECONDS;

export const easeInOut = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1);
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
};

/** Time inside the repeating part of the cycle; the first gather only happens once. */
export function cycleTime(seconds: number): number {
  if (seconds < LOOP_START) return seconds;
  return LOOP_START + ((seconds - LOOP_START) % (LOOP_END - LOOP_START));
}

/**
 * How strongly a bound particle sits on its logo target (0 = free in the wind, 1 = on the logo).
 * `released` particles leave during the release window and come back afterwards.
 */
export function attraction(seconds: number, released: boolean): number {
  const t = cycleTime(seconds);
  if (t < GATHER_SECONDS) return easeInOut(t / GATHER_SECONDS);
  if (!released || t < RELEASE_AT) return 1;
  if (t < RELEASE_AT + RELEASE_SECONDS) return 1 - easeInOut((t - RELEASE_AT) / RELEASE_SECONDS);
  if (t < RETURN_AT) return 0;
  return easeInOut((t - RETURN_AT) / RETURN_SECONDS);
}

/** Solid logo opacity: fades in over the last 0.8 s of the first gather, then stays. */
export function logoOpacity(seconds: number): number {
  return easeInOut((seconds - (GATHER_SECONDS - 0.8)) / 0.8);
}

/** Wrap a leftward-flowing coordinate back to the right edge. */
export function wrapLeft(x: number, minX: number, maxX: number): number {
  const span = maxX - minX;
  return x < minX ? x + span * Math.ceil((minX - x) / span) : x;
}

/** Scroll through the hero slows the wind to 30% and turns the logo up to 25°. */
export function scrollEffect(progress: number): { flowScale: number; logoTurn: number } {
  const p = Math.min(Math.max(progress, 0), 1);
  return { flowScale: 1 - 0.7 * p, logoTurn: (25 * Math.PI * p) / 180 };
}
