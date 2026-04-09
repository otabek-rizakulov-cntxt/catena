import { describe, it, expect, expectTypeOf } from 'vitest';
import { curry } from './curry';

describe('curry', () => {
  it('curries a 2-argument function', () => {
    const add = (a: number, b: number) => a + b;
    const curried = curry(add);
    expect(curried(1)(2)).toBe(3);
  });

  it('curries a 3-argument function', () => {
    const add3 = (a: number, b: number, c: number) => a + b + c;
    const curried = curry(add3);
    expect(curried(1)(2)(3)).toBe(6);
  });

  it('curries a 4-argument function', () => {
    const add4 = (a: number, b: number, c: number, d: number) => a + b + c + d;
    const curried = curry(add4);
    expect(curried(1)(2)(3)(4)).toBe(10);
  });

  it('infers the correct return type for 2-arg', () => {
    const add = (a: number, b: number) => `${a}+${b}`;
    const curried = curry(add);
    expectTypeOf(curried).toEqualTypeOf<(a: number) => (b: number) => string>();
  });

  it('allows partial application', () => {
    const multiply = curry((a: number, b: number) => a * b);
    const double = multiply(2);
    expect(double(5)).toBe(10);
    expect(double(3)).toBe(6);
  });
});
