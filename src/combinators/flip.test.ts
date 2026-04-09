import { describe, it, expect } from 'vitest';
import { flip } from './flip';

describe('flip', () => {
  it('swaps the first two arguments', () => {
    const prepend = (prefix: string) => (body: string) => prefix + body;
    const append = flip(prepend);
    expect(append('world')('hello ')).toBe('hello world');
  });

  it('works with different types', () => {
    const gt = (a: number) => (b: number) => a > b;
    const lt = flip(gt);
    expect(gt(5)(3)).toBe(true);
    expect(lt(5)(3)).toBe(false);
  });
});
