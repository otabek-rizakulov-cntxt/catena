import { describe, it } from 'vitest';
import fc from 'fast-check';
import { just, nothing, map, chain, of } from '../../src/core/Maybe/Maybe';
import type { Maybe } from '../../src/core/Maybe/Maybe';
import {
  functorIdentity,
  functorComposition,
  monadLeftIdentity,
  monadRightIdentity,
} from './laws';

const arbMaybe = <A>(arb: fc.Arbitrary<A>): fc.Arbitrary<Maybe<A>> =>
  fc.oneof(arb.map(just), fc.constant(nothing));

const eqMaybe = <A>(a: Maybe<A>, b: Maybe<A>): boolean => {
  if (a._tag === 'Nothing' && b._tag === 'Nothing') return true;
  if (a._tag === 'Just' && b._tag === 'Just') return a.value === b.value;
  return false;
};

describe('Maybe property-based laws', () => {
  it('Functor identity', () => {
    functorIdentity(arbMaybe(fc.integer()), map, eqMaybe);
  });

  it('Functor composition', () => {
    functorComposition(arbMaybe(fc.integer()), map, eqMaybe);
  });

  it('Monad left identity', () => {
    const f = (x: number): Maybe<number> => (x > 0 ? just(x * 2) : nothing);
    monadLeftIdentity(fc.integer(), of, chain, f, eqMaybe);
  });

  it('Monad right identity', () => {
    monadRightIdentity(arbMaybe(fc.integer()), of, chain, eqMaybe);
  });
});
