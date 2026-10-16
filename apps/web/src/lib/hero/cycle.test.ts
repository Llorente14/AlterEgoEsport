import { describe, expect, it } from 'vitest';
import {
  attraction,
  cycleTime,
  GATHER_SECONDS,
  HOLD_SECONDS,
  logoOpacity,
  RELEASE_SECONDS,
  scrollEffect,
  wrapLeft,
} from './cycle';

describe('attraction', () => {
  it('gathers every bound particle from free (0) to the logo (1)', () => {
    expect(attraction(0, false)).toBe(0);
    expect(attraction(GATHER_SECONDS / 2, true)).toBeCloseTo(0.5);
    expect(attraction(GATHER_SECONDS, false)).toBe(1);
  });

  it('keeps unreleased particles on the logo for the whole loop', () => {
    for (let t = GATHER_SECONDS; t < 40; t += 0.37) expect(attraction(t, false)).toBe(1);
  });

  it('lets released particles drift away and come back', () => {
    const releaseAt = GATHER_SECONDS + HOLD_SECONDS;
    expect(attraction(releaseAt - 0.01, true)).toBe(1);
    expect(attraction(releaseAt + RELEASE_SECONDS + 0.5, true)).toBe(0);
    const loopEnd = releaseAt + RELEASE_SECONDS + 1.6 + 1.6;
    expect(attraction(loopEnd - 0.001, true)).toBeCloseTo(1, 2);
  });

  it('repeats without re-running the first gather', () => {
    const loop = HOLD_SECONDS + RELEASE_SECONDS + 1.6 + 1.6;
    expect(cycleTime(GATHER_SECONDS + loop + 1)).toBeCloseTo(GATHER_SECONDS + 1);
    expect(attraction(GATHER_SECONDS + loop + 1, true)).toBe(1);
  });
});

describe('logoOpacity', () => {
  it('fades the solid logo in at the end of the first gather and keeps it', () => {
    expect(logoOpacity(0)).toBe(0);
    expect(logoOpacity(GATHER_SECONDS)).toBe(1);
    expect(logoOpacity(60)).toBe(1);
  });
});

describe('wrapLeft', () => {
  it('moves particles that leave the left edge back to the right', () => {
    expect(wrapLeft(-5.5, -5, 5)).toBeCloseTo(4.5);
    expect(wrapLeft(0, -5, 5)).toBe(0);
  });
});

describe('scrollEffect', () => {
  it('slows the wind to 30% and turns the logo 25° at the end of the hero', () => {
    expect(scrollEffect(0)).toEqual({ flowScale: 1, logoTurn: 0 });
    const end = scrollEffect(2);
    expect(end.flowScale).toBeCloseTo(0.3);
    expect(end.logoTurn).toBeCloseTo((25 * Math.PI) / 180);
  });
});
