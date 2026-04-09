import { describe, it, expect, expectTypeOf } from 'vitest';
import { pipe } from './pipe';

describe('pipe', () => {
  it('returns the value unchanged with no functions', () => {
    expect(pipe(42)).toBe(42);
  });

  it('applies a single function', () => {
    expect(pipe(5, (x) => x * 2)).toBe(10);
  });

  it('applies multiple functions left to right', () => {
    expect(
      pipe(
        1,
        (x) => x + 1,
        (x) => x * 3,
        (x) => `result: ${x}`,
      ),
    ).toBe('result: 6');
  });

  it('infers the correct return type', () => {
    const result = pipe(
      10,
      (x) => x + 1,
      (x) => String(x),
    );
    expectTypeOf(result).toEqualTypeOf<string>();
  });
});
