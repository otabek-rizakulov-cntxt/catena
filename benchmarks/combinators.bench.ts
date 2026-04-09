import { bench, describe } from 'vitest';
import { pipe, compose, identity, curry, flip, constant, thrush } from '../src';

describe('pipe', () => {
  const inc = (x: number) => x + 1;
  const dbl = (x: number) => x * 2;

  bench('pipe(value) — identity', () => {
    pipe(1);
  });

  bench('pipe(value, f, f) — 2 fns', () => {
    pipe(1, inc, dbl);
  });

  bench('pipe(value, f, f, f, f, f) — 5 fns', () => {
    pipe(1, inc, dbl, inc, dbl, inc);
  });
});

describe('compose', () => {
  const inc = (x: number) => x + 1;
  const dbl = (x: number) => x * 2;

  const composed2 = compose(dbl, inc);
  const composed5 = compose(inc, dbl, inc, dbl, inc);

  bench('composed(2 fns) — call', () => {
    composed2(1);
  });

  bench('composed(5 fns) — call', () => {
    composed5(1);
  });
});

describe('curry', () => {
  const add3 = curry((a: number, b: number, c: number) => a + b + c);

  bench('curried full application', () => {
    add3(1)(2)(3);
  });

  bench('curried partial + apply', () => {
    const partial = add3(1);
    partial(2)(3);
  });
});

describe('misc combinators', () => {
  bench('identity', () => {
    identity(42);
  });

  bench('constant', () => {
    constant(42)('ignored');
  });

  bench('flip', () => {
    const f = (a: number) => (b: string) => `${b}:${a}`;
    flip(f)('hello')(1);
  });

  bench('thrush', () => {
    thrush(5)((x: number) => x * 2);
  });
});
