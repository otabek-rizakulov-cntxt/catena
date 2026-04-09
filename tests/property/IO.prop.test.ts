import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { of, map, chain, run } from '../../src/core/IO/IO';
import type { IO } from '../../src/core/IO/IO';

const arbIO = (arb: fc.Arbitrary<number>): fc.Arbitrary<IO<number>> => arb.map((n) => of(n));

const eqIO = (a: IO<number>, b: IO<number>): boolean => {
  const va = run(a);
  const vb = run(b);
  expect(va).toBe(vb);
  return va === vb;
};

describe('IO property-based laws', () => {
  it('Functor identity: map(id)(io) === io', () => {
    fc.assert(
      fc.property(arbIO(fc.integer()), (io) => eqIO(map((x: number) => x)(io), io)),
    );
  });

  it('Functor composition: map(f.g) === map(f).map(g)', () => {
    const f = (x: number) => x + 1;
    const g = (x: number) => x * 2;
    fc.assert(
      fc.property(arbIO(fc.integer()), (io) =>
        eqIO(map((x: number) => f(g(x)))(io), map(f)(map(g)(io))),
      ),
    );
  });

  it('Monad left identity: chain(f)(of(a)) === f(a)', () => {
    const f = (x: number): IO<number> => of(x * 3);
    fc.assert(
      fc.property(fc.integer(), (a) => eqIO(chain(f)(of(a)), f(a))),
    );
  });

  it('Monad right identity: chain(of)(m) === m', () => {
    fc.assert(
      fc.property(arbIO(fc.integer()), (io) => eqIO(chain(of)(io), io)),
    );
  });
});
