import { describe, it, expect } from 'vitest';
import { identity } from './identity';

describe('identity', () => {
  it('returns the same value', () => {
    expect(identity(42)).toBe(42);
    expect(identity('hello')).toBe('hello');
    expect(identity(null)).toBe(null);
  });

  it('preserves reference identity for objects', () => {
    const obj = { a: 1 };
    expect(identity(obj)).toBe(obj);
  });
});
