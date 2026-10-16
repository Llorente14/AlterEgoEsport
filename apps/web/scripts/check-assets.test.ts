import { describe, expect, it } from 'vitest';
import { findViolations } from './check-assets.mjs';

const MB = 1024 * 1024;

describe('findViolations', () => {
  it('accepts assets within budget', () => {
    expect(
      findViolations([
        { path: 'models/logo.glb', size: 1.5 * MB },
        { path: 'video/showreel.mp4', size: 7 * MB },
        { path: 'logo/logo.webp', size: 50 * MB },
      ]),
    ).toEqual([]);
  });

  it('flags an oversized model and video', () => {
    const violations = findViolations([
      { path: 'models/logo.glb', size: 127 * MB },
      { path: 'video/showreel.webm', size: 9.5 * MB },
    ]);
    expect(violations).toHaveLength(2);
    expect(violations[0]).toContain('models/logo.glb');
    expect(violations[1]).toContain('video/showreel.webm');
  });
});
