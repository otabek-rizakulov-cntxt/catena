import { describe, it, expect, expectTypeOf } from 'vitest';
import { compose } from './compose';

describe('compose', () => {
  it('composes a single function', () => {
    const double = (x: number) => x * 2;
    expect(compose(double)(5)).toBe(10);
  });

  it('composes two functions right to left', () => {
    const double = (x: number) => x * 2;
    const inc = (x: number) => x + 1;
    expect(compose(inc, double)(5)).toBe(11);
  });

  it('composes three functions right to left', () => {
    const toString = (x: number) => `${x}`;
    const double = (x: number) => x * 2;
    const inc = (x: number) => x + 1;
    expect(compose(toString, double, inc)(4)).toBe('10');
  });

  it('infers the correct return type', () => {
    const fn = compose(
      (x: number) => String(x),
      (x: number) => x + 1,
    );
    expectTypeOf(fn).toEqualTypeOf<(a: number) => string>();
  });
});
