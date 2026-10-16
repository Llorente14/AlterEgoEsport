import { describe, expect, it } from 'vitest';
import {
  CARDS_DRIFT,
  LOGO_LIFT,
  LOGO_OPACITY_C,
  LOGO_SCALE_C,
  LOGO_SIDE,
  MAX_TILT,
  pinProgress,
  SCENES,
  smoothProgress,
  storyFrame,
} from './story-scroll';

const steps = (n = 400) => Array.from({ length: n + 1 }, (_, i) => i / n);

describe('pinProgress', () => {
  it('runs from 0 to 1 over the extra height of the pinned section', () => {
    expect(pinProgress(0, 3000, 1000)).toBe(0);
    expect(pinProgress(-1000, 3000, 1000)).toBe(0.5);
    expect(pinProgress(-2000, 3000, 1000)).toBe(1);
  });

  it('clamps outside the section and stays 0 when it is not taller than the stage', () => {
    expect(pinProgress(500, 3000, 1000)).toBe(0);
    expect(pinProgress(-5000, 3000, 1000)).toBe(1);
    expect(pinProgress(-100, 800, 1000)).toBe(0);
  });
});

describe('smoothProgress', () => {
  it('moves toward the target without overshooting', () => {
    let value = 0;
    for (let i = 0; i < 200; i++) {
      value = smoothProgress(value, 1, 1 / 60);
      expect(value).toBeLessThanOrEqual(1);
    }
    expect(value).toBe(1);
  });

  it('works in both directions and holds still at the target', () => {
    expect(smoothProgress(1, 0, 1 / 60)).toBeLessThan(1);
    expect(smoothProgress(0.4, 0.4, 1 / 60)).toBe(0.4);
  });

  it('does not depend on the frame rate', () => {
    const oneStep = smoothProgress(0, 1, 1 / 30);
    const twoSteps = smoothProgress(smoothProgress(0, 1, 1 / 60), 1, 1 / 60);
    expect(twoSteps).toBeCloseTo(oneStep, 6);
  });

  it('catches up in about a third of a second', () => {
    let value = 0;
    for (let i = 0; i < 20; i++) value = smoothProgress(value, 1, 1 / 60); // 0.33 s
    expect(value).toBeGreaterThan(0.9);
  });
});

describe('storyFrame: logo', () => {
  it('rests right in scene A, left in scene B, centred (bigger, dimmer, facing front) in scene C', () => {
    const a = storyFrame(SCENES.aEnd / 2);
    const b = storyFrame((SCENES.abEnd + SCENES.bEnd) / 2);
    const c = storyFrame(1);

    expect(a).toMatchObject({ scene: 'A', logoX: LOGO_SIDE, logoRotate: 0, logoFlip: 0, logoScale: 1, logoOpacity: 1 });
    expect(b).toMatchObject({ scene: 'B', logoX: -LOGO_SIDE, logoRotate: 0, logoFlip: 0, logoScale: 1, logoOpacity: 1 });
    expect(c).toMatchObject({
      scene: 'C',
      logoX: 0,
      logoRotate: 0,
      logoFlip: 360,
      logoLift: 0,
      logoScale: LOGO_SCALE_C,
      logoOpacity: LOGO_OPACITY_C,
    });
  });

  it('moves right to left from A to B, then back to the centre for C, never overshooting', () => {
    let previous = LOGO_SIDE;
    for (const p of steps().filter((p) => p <= SCENES.abEnd)) {
      const { logoX } = storyFrame(p);
      expect(logoX).toBeLessThanOrEqual(previous + 1e-9);
      previous = logoX;
    }
    previous = -LOGO_SIDE;
    for (const p of steps().filter((p) => p >= SCENES.abEnd)) {
      const { logoX } = storyFrame(p);
      expect(logoX).toBeGreaterThanOrEqual(previous - 1e-9);
      expect(logoX).toBeLessThanOrEqual(1e-9);
      previous = logoX;
    }
  });

  it('tilts only while it slides from A to B, by at most MAX_TILT', () => {
    for (const p of steps()) {
      expect(Math.abs(storyFrame(p).logoRotate)).toBeLessThanOrEqual(MAX_TILT + 1e-9);
      if (p > SCENES.abEnd) expect(storyFrame(p).logoRotate).toBe(0);
    }
    expect(Math.abs(storyFrame((SCENES.aEnd + SCENES.abEnd) / 2).logoRotate)).toBeCloseTo(MAX_TILT, 1);
  });

  it('flips from B to C: front at rest, back in the middle, front again, lifted toward the viewer in between', () => {
    const mid = (SCENES.bEnd + SCENES.bcEnd) / 2;
    expect(storyFrame(SCENES.bEnd)).toMatchObject({ logoFlip: 0, logoLift: 0 });
    expect(storyFrame(mid).logoFlip).toBeCloseTo(180, 3);
    expect(storyFrame(mid).logoLift).toBeCloseTo(1, 3);
    expect(storyFrame(SCENES.bcEnd)).toMatchObject({ logoFlip: 360, logoLift: 0 });

    let flip = 0;
    for (const p of steps()) {
      const f = storyFrame(p);
      expect(f.logoFlip).toBeGreaterThanOrEqual(flip - 1e-9); // always turns the same way
      expect(f.logoLift).toBeGreaterThanOrEqual(0);
      expect(f.logoLift).toBeLessThanOrEqual(1);
      flip = f.logoFlip;
    }
    expect(LOGO_LIFT).toBeGreaterThan(0);
  });

  it('does not flip while sliding from A to B', () => {
    for (const p of steps().filter((p) => p <= SCENES.bEnd)) expect(storyFrame(p).logoFlip).toBe(0);
  });
});

describe('storyFrame: text', () => {
  it('shows the headline in A, the description in B and the founder title in C', () => {
    expect(storyFrame(0.05).headline.opacity).toBe(1);
    expect(storyFrame(0.05).description.opacity).toBe(0);

    const b = storyFrame(0.48);
    expect(b.headline.opacity).toBe(0);
    expect(b.description.opacity).toBe(1);
    expect(b.founderTitle.opacity).toBe(0);

    const c = storyFrame(0.9);
    expect(c.description.opacity).toBe(0);
    expect(c.founderTitle.opacity).toBe(1);
  });

  it('never shows two text layers at once beyond a faint crossover', () => {
    for (const p of steps()) {
      const f = storyFrame(p);
      const o = [f.headline.opacity, f.description.opacity, f.founderTitle.opacity];
      const visible = o.filter((x) => x > 0.15).length;
      expect(visible, `progress ${p}`).toBeLessThanOrEqual(1);
    }
  });
});

describe('storyFrame: cards', () => {
  it('keeps cards below the stage through A and B, then raises them left to right', () => {
    expect(storyFrame(0.5).cardRise).toEqual([0, 0, 0, 0, 0]);

    const rising = storyFrame(SCENES.bcEnd).cardRise;
    for (let i = 1; i < rising.length; i++) expect(rising[i]!).toBeLessThanOrEqual(rising[i - 1]! + 1e-9);

    expect(storyFrame(1).cardRise).toEqual([1, 1, 1, 1, 1]);
  });

  it('starts scene C slightly right of centre, drifts left and ends exactly centred', () => {
    expect(storyFrame(SCENES.bcEnd).cardsShift).toBeCloseTo(CARDS_DRIFT);
    expect(storyFrame(1).cardsShift).toBe(0);
    let previous = Infinity;
    for (const p of steps().filter((p) => p >= SCENES.bcEnd)) {
      const { cardsShift } = storyFrame(p);
      expect(cardsShift).toBeGreaterThanOrEqual(0);
      expect(cardsShift).toBeLessThanOrEqual(previous + 1e-9);
      previous = cardsShift;
    }
  });

  it('supports any number of cards', () => {
    expect(storyFrame(1, 3).cardRise).toHaveLength(3);
    expect(storyFrame(1, 1).cardRise).toEqual([1]);
  });
});
