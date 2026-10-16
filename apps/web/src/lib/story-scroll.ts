// Scroll mechanics of the story section (DESIGN.md → Story Scroll).
// One pinned stage, three scenes, one logo that travels between them:
//   A  headline left, logo right
//   B  logo left, manifesto text right
//   C  FOUNDER title, staggered cards, logo centred behind them

/** Scene boundaries as scroll progress (0–1). */
export const SCENES = {
  aEnd: 0.22,
  abEnd: 0.38,
  bEnd: 0.58,
  bcEnd: 0.76,
} as const;

/** Logo centre, as a fraction of the viewport width away from the middle. */
export const LOGO_SIDE = 0.25;
export const MAX_TILT = 8;
/** In scene C the logo grows and dims so the cards in front stay readable. */
export const LOGO_SCALE_C = 1.15;
export const LOGO_OPACITY_C = 0.45;
/**
 * Where the card row starts in scene C, as a fraction of the viewport width to the right of its resting place.
 * It drifts left and ends exactly centred. The five cards leave 0.1·vw − 48px free on each side, so 0.04
 * keeps every card on screen from 1024px up.
 */
export const CARDS_DRIFT = 0.04;
/** How far the logo comes out of the screen at the middle of its flip, as a fraction of the viewport width. */
export const LOGO_LIFT = 0.32;
/** Speed of the scroll smoothing (1/s). The logo catches up with the scroll in about 3/rate seconds. */
export const SMOOTHING_RATE = 9;

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
/** Exact at both ends (t = 0 gives a, t = 1 gives b). */
const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;
/** Rounds float noise (sin(π) ≈ 1e-16) and turns -0 into 0, so values at rest are exactly 0. */
const plain = (n: number) => Math.round(n * 1e6) / 1e6 + 0;
/** Progress of `p` inside [from, to], clamped to 0–1. */
const within = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));

/**
 * One step of exponential smoothing toward the scroll position. Frame-rate independent, never overshoots,
 * and snaps once it is within a hair of the target so the animation can stop.
 */
export function smoothProgress(current: number, target: number, dtSeconds: number, rate = SMOOTHING_RATE): number {
  const next = current + (target - current) * (1 - Math.exp(-rate * Math.max(dtSeconds, 0)));
  return Math.abs(target - next) < 0.0003 ? target : next;
}

/** Scroll progress through a pinned section: 0 when its top meets the pin line, 1 when its bottom does. */
export function pinProgress(sectionTop: number, sectionHeight: number, pinnedHeight: number): number {
  const travel = sectionHeight - pinnedHeight;
  return travel <= 0 ? 0 : clamp01(-sectionTop / travel);
}

export type Scene = 'A' | 'B' | 'C';

export interface StoryFrame {
  scene: Scene;
  /** Logo centre offset in fractions of the viewport width (+ = right of centre). */
  logoX: number;
  /** Tilt in degrees while the logo slides from A to B; 0 at rest. */
  logoRotate: number;
  /**
   * Turn around the vertical axis in degrees. From B to C the logo spins 0 → 360: at 180 it shows its back,
   * and it ends facing front again. 0 in A and B, 360 in C.
   */
  logoFlip: number;
  /** 0–1: how far the logo is lifted toward the viewer (peaks at the middle of the flip). */
  logoLift: number;
  /**
   * Full 3D pose for the WebGL logo, in degrees (apply as Euler order YXZ). Each move has its own flip:
   *  A → B  turntable: a full spin around the vertical axis (y 0 → 360) with a pitch and the slide's tilt
   *  B → C  somersault: a full vertical flip (x 0 → 360, back visible at 180) with a sway and a roll
   * At rest the logo faces front: x and y are multiples of 360 and z is 0.
   */
  logoPose: { x: number; y: number; z: number };
  /** 0 at rest, up to 1 in the middle of a move; the cursor-follow fades out while the logo is flipping. */
  logoMotion: number;
  logoScale: number;
  logoOpacity: number;
  /** Text layers: opacity 0–1 and horizontal drift in fractions of the viewport width. */
  headline: { opacity: number; x: number };
  description: { opacity: number; x: number };
  founderTitle: { opacity: number };
  /** Per-card rise (0 = below the stage, 1 = in place), staggered left to right. */
  cardRise: number[];
  /** Horizontal offset of the whole card row, fraction of the viewport width; eases to 0 so it ends centred. */
  cardsShift: number;
}

export function storyFrame(progress: number, cardCount = 5): StoryFrame {
  const p = clamp01(progress);
  const ab = ease(within(p, SCENES.aEnd, SCENES.abEnd));
  const bc = ease(within(p, SCENES.bEnd, SCENES.bcEnd));
  const abRaw = within(p, SCENES.aEnd, SCENES.abEnd);
  const bcRaw = within(p, SCENES.bEnd, SCENES.bcEnd);

  // Logo: right → left → centre. A → B it slides with a tilt; B → C it flips around its vertical axis
  // (showing its back at the middle) while it comes out of the screen, then settles facing front.
  const logoX = p < SCENES.abEnd ? lerp(LOGO_SIDE, -LOGO_SIDE, ab) : lerp(-LOGO_SIDE, 0, bc);
  const logoRotate = plain(p < SCENES.abEnd ? -MAX_TILT * Math.sin(Math.PI * abRaw) : 0);
  const logoFlip = plain(360 * bc);
  const logoLift = plain(Math.sin(Math.PI * bc));

  // 3D choreography: two different flips, one per move.
  const turntable = p < SCENES.abEnd; // A → B (and at rest in A)
  const logoPose = {
    x: plain(turntable ? 12 * Math.sin(Math.PI * abRaw) : 360 * bc),
    y: plain(turntable ? 360 * ab : 360 + 25 * Math.sin(2 * Math.PI * bcRaw)),
    z: plain(turntable ? -MAX_TILT * Math.sin(Math.PI * abRaw) : -12 * Math.sin(Math.PI * bc)),
  };
  const logoMotion = plain(Math.sin(Math.PI * (turntable ? abRaw : bcRaw)));

  // Texts hand over to each other: the outgoing one fades in the first half of a transition, the next in the second.
  const out = (raw: number) => 1 - ease(within(raw, 0, 0.5));
  const into = (raw: number) => ease(within(raw, 0.5, 1));

  const headlineOpacity = out(abRaw);
  const descriptionOpacity = Math.min(into(abRaw), out(bcRaw));
  const founderOpacity = into(bcRaw);

  const cardsP = within(p, SCENES.bEnd + (SCENES.bcEnd - SCENES.bEnd) * 0.4, SCENES.bcEnd + 0.06);
  const stagger = 0.5; // fraction of the rise during which cards start one after another
  const cardRise = Array.from({ length: cardCount }, (_, i) => {
    const start = cardCount > 1 ? (i / (cardCount - 1)) * stagger : 0;
    return ease(within(cardsP, start, start + (1 - stagger)));
  });

  return {
    scene: p < SCENES.abEnd ? 'A' : p < SCENES.bcEnd ? 'B' : 'C',
    logoX,
    logoRotate,
    logoFlip,
    logoLift,
    logoPose,
    logoMotion,
    logoScale: lerp(1, LOGO_SCALE_C, bc),
    logoOpacity: lerp(1, LOGO_OPACITY_C, bc),
    headline: { opacity: headlineOpacity, x: plain(-0.12 * (1 - headlineOpacity)) },
    description: { opacity: descriptionOpacity, x: 0.08 * (1 - descriptionOpacity) },
    founderTitle: { opacity: founderOpacity },
    cardRise,
    cardsShift: plain(CARDS_DRIFT * (1 - ease(within(p, SCENES.bcEnd, 1)))),
  };
}

/** Which of the three scenes a progress value rests in (transitions count for the scene they lead to). */
export function sceneAt(progress: number): Scene {
  return storyFrame(progress).scene;
}
