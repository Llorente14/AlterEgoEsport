// Scroll mechanics of the logo section (DESIGN.md → Logo Slide).
// While the section is pinned, the logo enters from the right, rests in the centre, then leaves to the left.

/** Share of the scroll spent entering, and where the exit starts. The middle 30% is the rest. */
export const ENTER_END = 0.35;
export const EXIT_START = 0.65;
/** Tilt while moving, in degrees; zero at rest. */
export const MAX_TILT = 8;

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeIn = (t: number) => t ** 3;

/** Scroll progress through a pinned section: 0 when its top meets the pin line, 1 when its bottom does. */
export function pinProgress(sectionTop: number, sectionHeight: number, pinnedHeight: number): number {
  const travel = sectionHeight - pinnedHeight;
  return travel <= 0 ? 0 : clamp01(-sectionTop / travel);
}

export interface SlideFrame {
  /** Horizontal offset of the logo centre from the viewport centre, in px. */
  x: number;
  /** Rotation in degrees. */
  rotate: number;
  /** Offset of the background wordmark, as a fraction of its own width. */
  trackShift: number;
}

/**
 * Logo position for a scroll progress.
 * `viewportWidth` and `logoWidth` set the off-screen distance, so the logo starts and ends fully outside.
 */
export function logoSlide(progress: number, viewportWidth: number, logoWidth: number): SlideFrame {
  const p = clamp01(progress);
  // A tilted square reaches cos(8°)/2 + sin(8°)/2 ≈ 0.57 of its width from its centre; 0.6 leaves room.
  const offscreen = viewportWidth / 2 + logoWidth * 0.6 + 24;

  let x = 0;
  let rotate = 0;
  if (p < ENTER_END) {
    const t = easeOut(p / ENTER_END);
    x = offscreen * (1 - t);
    rotate = MAX_TILT * (1 - t);
  } else if (p > EXIT_START) {
    const t = easeIn((p - EXIT_START) / (1 - EXIT_START));
    x = -offscreen * t;
    rotate = -MAX_TILT * t;
  }

  return { x, rotate, trackShift: 0.15 - 0.6 * p };
}
