import { describe, expect, it } from 'vitest';
import { ENTER_END, EXIT_START, logoSlide, MAX_TILT, pinProgress } from './logo-slide';

describe('pinProgress', () => {
  it('runs from 0 to 1 over the extra height of the pinned section', () => {
    expect(pinProgress(0, 3000, 1000)).toBe(0);
    expect(pinProgress(-1000, 3000, 1000)).toBe(0.5);
    expect(pinProgress(-2000, 3000, 1000)).toBe(1);
  });

  it('clamps before and after the section', () => {
    expect(pinProgress(500, 3000, 1000)).toBe(0);
    expect(pinProgress(-5000, 3000, 1000)).toBe(1);
  });

  it('stays at 0 when the section is not taller than the viewport', () => {
    expect(pinProgress(-100, 800, 1000)).toBe(0);
  });
});

describe('logoSlide', () => {
  const vw = 1440;
  const logo = 560;
  const offscreen = vw / 2 + logo * 0.6 + 24;

  it('starts fully off screen on the right, tilted, even counting the tilt', () => {
    const f = logoSlide(0, vw, logo);
    const tiltedHalf = (logo / 2) * (Math.cos((MAX_TILT * Math.PI) / 180) + Math.sin((MAX_TILT * Math.PI) / 180));
    expect(f.x).toBe(offscreen);
    expect(f.x - tiltedHalf).toBeGreaterThan(vw / 2);
    expect(f.rotate).toBe(MAX_TILT);
  });

  it('rests in the centre, upright, through the middle of the scroll', () => {
    for (const p of [ENTER_END, 0.5, EXIT_START]) {
      expect(logoSlide(p, vw, logo)).toMatchObject({ x: 0, rotate: 0 });
    }
  });

  it('ends fully off screen on the left', () => {
    const f = logoSlide(1, vw, logo);
    expect(f.x).toBeCloseTo(-offscreen);
    const tiltedHalf = (logo / 2) * (Math.cos((MAX_TILT * Math.PI) / 180) + Math.sin((MAX_TILT * Math.PI) / 180));
    expect(f.x + tiltedHalf).toBeLessThan(-vw / 2);
    expect(f.rotate).toBeCloseTo(-MAX_TILT);
  });

  it('only ever moves right to left', () => {
    let previous = Infinity;
    for (let p = 0; p <= 1; p += 0.01) {
      const { x } = logoSlide(p, vw, logo);
      expect(x).toBeLessThanOrEqual(previous + 1e-9);
      previous = x;
    }
  });

  it('shifts the background wordmark leftwards as the page scrolls', () => {
    expect(logoSlide(1, vw, logo).trackShift).toBeLessThan(logoSlide(0, vw, logo).trackShift);
  });
});
