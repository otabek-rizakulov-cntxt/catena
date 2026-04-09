import { describe, it, expect } from 'vitest';
import { constant } from './constant';

describe('constant', () => {
  it('always returns the first value', () => {
    const always42 = constant(42);
    expect(always42('ignored')).toBe(42);
    expect(always42(null)).toBe(42);
  });

  it('works as a callback', () => {
    const result = [1, 2, 3].map(constant('x'));
    expect(result).toEqual(['x', 'x', 'x']);
  });
});
