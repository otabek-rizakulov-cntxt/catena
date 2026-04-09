import { describe, it } from 'vitest';
import fc from 'fast-check';
import { left, right, map, chain, of } from '../../src/core/Either/Either';
import type { Either } from '../../src/core/Either/Either';
import {
  functorIdentity,
  functorComposition,
  monadLeftIdentity,
  monadRightIdentity,
} from './laws';

const arbEither = <E, A>(
  arbE: fc.Arbitrary<E>,
  arbA: fc.Arbitrary<A>,
): fc.Arbitrary<Either<E, A>> =>
  fc.oneof(arbA.map((a) => right<A, E>(a)), arbE.map((e) => left<E, A>(e)));

const eqEither = <E, A>(a: Either<E, A>, b: Either<E, A>): boolean => {
  if (a._tag === 'Left' && b._tag === 'Left') return a.left === b.left;
  if (a._tag === 'Right' && b._tag === 'Right') return a.right === b.right;
  return false;
};

describe('Either property-based laws', () => {
  it('Functor identity', () => {
    functorIdentity(arbEither(fc.string(), fc.integer()), map, eqEither);
  });

  it('Functor composition', () => {
    functorComposition(arbEither(fc.string(), fc.integer()), map, eqEither);
  });

  it('Monad left identity', () => {
    const f = (x: number): Either<string, number> =>
      x > 0 ? right(x * 2) : left('negative');
    monadLeftIdentity(fc.integer(), of, chain, f, eqEither);
  });

  it('Monad right identity', () => {
    monadRightIdentity(arbEither(fc.string(), fc.integer()), of, chain, eqEither);
  });
});
