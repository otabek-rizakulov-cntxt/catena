import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { pipe } from '../../src/combinators/pipe';
import { compose } from '../../src/combinators/compose';
import { identity } from '../../src/combinators/identity';
import { flip } from '../../src/combinators/flip';
import { constant } from '../../src/combinators/constant';
import { curry } from '../../src/combinators/curry';
import { ifElse } from '../../src/helpers/ifElse';
import { when } from '../../src/helpers/when';
import { unless } from '../../src/helpers/unless';
import { not } from '../../src/predicates/not';

describe('identity property', () => {
  it('identity(x) === x for all x', () => {
    fc.assert(
      fc.property(fc.anything(), (x) => {
        expect(identity(x)).toBe(x);
        return true;
      }),
    );
  });
});

describe('pipe properties', () => {
  it('pipe(x) === x', () => {
    fc.assert(
      fc.property(fc.integer(), (x) => {
        expect(pipe(x)).toBe(x);
        return true;
      }),
    );
  });

  it('pipe(x, f) === f(x)', () => {
    const f = (x: number) => x * 2;
    fc.assert(
      fc.property(fc.integer(), (x) => {
        expect(pipe(x, f)).toBe(f(x));
        return true;
      }),
    );
  });

  it('pipe is left-to-right', () => {
    fc.assert(
      fc.property(fc.integer(), (x) => {
        const result = pipe(
          x,
          (n) => n + 1,
          (n) => n * 10,
        );
        expect(result).toBe((x + 1) * 10);
        return true;
      }),
    );
  });
});

describe('compose properties', () => {
  it('compose(f, g)(x) === f(g(x))', () => {
    const f = (x: number) => x + 1;
    const g = (x: number) => x * 2;
    fc.assert(
      fc.property(fc.integer(), (x) => {
        expect(compose(f, g)(x)).toBe(f(g(x)));
        return true;
      }),
    );
  });

  it('compose with identity is neutral', () => {
    const f = (x: number) => x * 3;
    fc.assert(
      fc.property(fc.integer(), (x) => {
        expect(compose(identity, f)(x)).toBe(f(x));
        expect(compose(f, identity)(x)).toBe(f(x));
        return true;
      }),
    );
  });
});

describe('flip property', () => {
  it('flip(f)(b)(a) === f(a)(b)', () => {
    const sub = (a: number) => (b: number) => a - b;
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(flip(sub)(b)(a)).toBe(sub(a)(b));
        return true;
      }),
    );
  });
});

describe('constant property', () => {
  it('constant(a)(b) === a for all b', () => {
    fc.assert(
      fc.property(fc.integer(), fc.string(), (a, b) => {
        expect(constant(a)(b)).toBe(a);
        return true;
      }),
    );
  });
});

describe('curry property', () => {
  it('curry(f)(a)(b) === f(a, b)', () => {
    const add = (a: number, b: number) => a + b;
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(curry(add)(a)(b)).toBe(add(a, b));
        return true;
      }),
    );
  });
});

describe('ifElse / when / unless properties', () => {
  it('ifElse covers both branches exhaustively', () => {
    const abs = ifElse(
      (n: number) => n >= 0,
      (n) => n,
      (n) => -n,
    );
    fc.assert(
      fc.property(fc.integer(), (n) => {
        expect(abs(n)).toBe(Math.abs(n));
        return true;
      }),
    );
  });

  it('when + unless with same predicate covers both cases', () => {
    const isPos = (n: number) => n > 0;
    const negate = (n: number) => -n;
    fc.assert(
      fc.property(fc.integer(), (n) => {
        const wResult = when(isPos, negate)(n);
        const uResult = unless(isPos, negate)(n);
        if (n > 0) {
          expect(wResult).toBe(-n);
          expect(uResult).toBe(n);
        } else {
          expect(wResult).toBe(n);
          expect(uResult).toBe(-n);
        }
        return true;
      }),
    );
  });

  it('not inverts any predicate', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        const isPos = (x: number) => x > 0;
        expect(not(isPos)(n)).toBe(!isPos(n));
        return true;
      }),
    );
  });
});
