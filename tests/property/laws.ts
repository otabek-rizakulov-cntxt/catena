import fc from 'fast-check';
import { expect } from 'vitest';
import type { Semigroup } from '../../src/algebraic/Semigroup';
import type { Monoid } from '../../src/algebraic/Monoid';
import type { Setoid } from '../../src/algebraic/Setoid';
import type { Ord } from '../../src/algebraic/Ord';

// ---------------------------------------------------------------------------
// Equality helpers
// ---------------------------------------------------------------------------

type Eq<A> = (a: A, b: A) => boolean;

const strictEq: Eq<unknown> = (a, b) => {
  expect(a).toEqual(b);
  return true;
};

// ---------------------------------------------------------------------------
// Functor laws (generic — caller provides map & arb)
// ---------------------------------------------------------------------------

export const functorIdentity = <F>(
  arb: fc.Arbitrary<F>,
  map: (f: (a: unknown) => unknown) => (fa: F) => F,
  eq: Eq<F> = strictEq,
) =>
  fc.assert(
    fc.property(arb, (fa) => eq(map((x) => x)(fa), fa)),
  );

export const functorComposition = <F>(
  arb: fc.Arbitrary<F>,
  map: (f: (a: number) => number) => (fa: F) => F,
  eq: Eq<F> = strictEq,
) => {
  const f = (x: number) => x + 1;
  const g = (x: number) => x * 2;
  fc.assert(
    fc.property(arb, (fa) => {
      const left = map((x: number) => f(g(x)))(fa);
      const right = map(f)(map(g)(fa));
      return eq(left, right);
    }),
  );
};

// ---------------------------------------------------------------------------
// Monad laws (generic — caller provides of, chain, map & arbs)
// ---------------------------------------------------------------------------

export const monadLeftIdentity = <M>(
  arbA: fc.Arbitrary<number>,
  of: (a: number) => M,
  chain: (f: (a: number) => M) => (ma: M) => M,
  f: (a: number) => M,
  eq: Eq<M> = strictEq,
) =>
  fc.assert(
    fc.property(arbA, (a) => eq(chain(f)(of(a)), f(a))),
  );

export const monadRightIdentity = <M>(
  arb: fc.Arbitrary<M>,
  of: (a: unknown) => M,
  chain: (f: (a: unknown) => M) => (ma: M) => M,
  eq: Eq<M> = strictEq,
) =>
  fc.assert(
    fc.property(arb, (ma) => eq(chain(of)(ma), ma)),
  );

// ---------------------------------------------------------------------------
// Semigroup laws
// ---------------------------------------------------------------------------

export const semigroupAssociativity = <A>(
  S: Semigroup<A>,
  arb: fc.Arbitrary<A>,
  eq: Eq<A> = strictEq,
) =>
  fc.assert(
    fc.property(arb, arb, arb, (a, b, c) =>
      eq(S.concat(S.concat(a, b), c), S.concat(a, S.concat(b, c))),
    ),
  );

// ---------------------------------------------------------------------------
// Monoid laws
// ---------------------------------------------------------------------------

export const monoidLeftIdentity = <A>(M: Monoid<A>, arb: fc.Arbitrary<A>, eq: Eq<A> = strictEq) =>
  fc.assert(
    fc.property(arb, (a) => eq(M.concat(M.empty, a), a)),
  );

export const monoidRightIdentity = <A>(M: Monoid<A>, arb: fc.Arbitrary<A>, eq: Eq<A> = strictEq) =>
  fc.assert(
    fc.property(arb, (a) => eq(M.concat(a, M.empty), a)),
  );

// ---------------------------------------------------------------------------
// Setoid laws
// ---------------------------------------------------------------------------

export const setoidReflexivity = <A>(S: Setoid<A>, arb: fc.Arbitrary<A>) =>
  fc.assert(
    fc.property(arb, (a) => S.equals(a, a)),
  );

export const setoidSymmetry = <A>(S: Setoid<A>, arb: fc.Arbitrary<A>) =>
  fc.assert(
    fc.property(arb, arb, (a, b) => S.equals(a, b) === S.equals(b, a)),
  );

// ---------------------------------------------------------------------------
// Ord laws
// ---------------------------------------------------------------------------

export const ordTotality = <A>(O: Ord<A>, arb: fc.Arbitrary<A>) =>
  fc.assert(
    fc.property(arb, arb, (a, b) => {
      const c = O.compare(a, b);
      return c === -1 || c === 0 || c === 1;
    }),
  );

export const ordAntisymmetry = <A>(O: Ord<A>, arb: fc.Arbitrary<A>) =>
  fc.assert(
    fc.property(arb, arb, (a, b) => {
      if (O.compare(a, b) <= 0 && O.compare(b, a) <= 0) {
        return O.equals(a, b);
      }
      return true;
    }),
  );

export const ordTransitivity = <A>(O: Ord<A>, arb: fc.Arbitrary<A>) =>
  fc.assert(
    fc.property(arb, arb, arb, (a, b, c) => {
      if (O.compare(a, b) <= 0 && O.compare(b, c) <= 0) {
        return O.compare(a, c) <= 0;
      }
      return true;
    }),
  );
