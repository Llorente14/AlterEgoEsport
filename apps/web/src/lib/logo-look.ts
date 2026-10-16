// Cursor-follow for the 3D logo: it turns to look at the pointer, with a little parallax.

/** Largest turn toward the pointer, in degrees (left/right and up/down). */
export const MAX_YAW = 24;
export const MAX_PITCH = 16;
/** Sideways drift toward the pointer, as a fraction of the logo height. */
export const MAX_DRIFT = 0.06;
/** How quickly the logo follows the pointer (1/s) and how quickly it relaxes back when the pointer leaves. */
export const FOLLOW_RATE = 7;

const clamp = (x: number, lo: number, hi: number) => Math.min(Math.max(x, lo), hi);

export interface Look {
  /** Degrees around the vertical axis (positive turns the face toward the right). */
  yaw: number;
  /** Degrees around the horizontal axis (positive tips the top toward the viewer's up). */
  pitch: number;
  /** Sideways and vertical drift as fractions of the logo height. */
  driftX: number;
  driftY: number;
}

/**
 * Where the logo should look for a pointer at (nx, ny), each −1 … 1 across the stage (ny positive = down).
 * `motion` (0–1, from the choreography) fades the look out while the logo is mid-flip, so the flip stays clean.
 */
export function cursorLook(nx: number, ny: number, motion = 0): Look {
  const x = clamp(nx, -1, 1);
  const y = clamp(ny, -1, 1);
  const rest = 1 - clamp(motion, 0, 1);
  return {
    yaw: x * MAX_YAW * rest,
    pitch: y * MAX_PITCH * rest,
    driftX: x * MAX_DRIFT * rest,
    driftY: -y * MAX_DRIFT * rest * 0.6,
  };
}

/** Exponential approach of `current` to `target`; frame-rate independent and never overshoots. */
export function damp(current: number, target: number, rate: number, dtSeconds: number): number {
  return current + (target - current) * (1 - Math.exp(-rate * Math.max(dtSeconds, 0)));
}
