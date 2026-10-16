import { describe, expect, it } from 'vitest';
import { cursorLook, damp, MAX_DRIFT, MAX_PITCH, MAX_YAW } from './logo-look';

describe('cursorLook', () => {
  it('looks straight ahead with the pointer in the middle', () => {
    expect(cursorLook(0, 0)).toEqual({ yaw: 0, pitch: 0, driftX: 0, driftY: -0 });
  });

  it('turns toward the pointer: right of centre yaws right, below centre tips down', () => {
    const right = cursorLook(1, 0);
    const left = cursorLook(-1, 0);
    expect(right.yaw).toBe(MAX_YAW);
    expect(left.yaw).toBe(-MAX_YAW);
    expect(right.driftX).toBe(MAX_DRIFT);
    expect(cursorLook(0, 1).pitch).toBe(MAX_PITCH);
    expect(cursorLook(0, -1).pitch).toBe(-MAX_PITCH);
  });

  it('never turns past its limits, even with a pointer far outside the stage', () => {
    const wild = cursorLook(40, -40);
    expect(wild.yaw).toBe(MAX_YAW);
    expect(wild.pitch).toBe(-MAX_PITCH);
  });

  it('fades out while the logo is mid-flip and is back at full strength at rest', () => {
    expect(cursorLook(1, 1, 1)).toMatchObject({ yaw: 0, pitch: 0, driftX: 0 });
    expect(cursorLook(1, 0, 0.5).yaw).toBeCloseTo(MAX_YAW / 2);
    expect(cursorLook(1, 0, 0).yaw).toBe(MAX_YAW);
  });
});

describe('damp', () => {
  it('approaches the target without overshooting', () => {
    let value = 0;
    for (let i = 0; i < 120; i++) {
      value = damp(value, 10, 7, 1 / 60);
      expect(value).toBeLessThanOrEqual(10);
    }
    expect(value).toBeGreaterThan(9.9);
  });

  it('does not depend on the frame rate', () => {
    const one = damp(0, 1, 7, 1 / 30);
    const two = damp(damp(0, 1, 7, 1 / 60), 1, 7, 1 / 60);
    expect(two).toBeCloseTo(one, 9);
  });
});
