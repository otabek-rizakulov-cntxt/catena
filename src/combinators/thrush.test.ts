import { describe, it, expect } from 'vitest';
import { thrush } from './thrush';

describe('thrush', () => {
  it('applies a value to a function', () => {
    expect(thrush(5)((x: number) => x * 2)).toBe(10);
  });

  it('can be used for point-free application', () => {
    const applyTo5 = thrush(5);
    expect(applyTo5((x: number) => x + 1)).toBe(6);
    expect(applyTo5((x: number) => x * 10)).toBe(50);
  });
});
