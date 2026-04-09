import { bench, describe } from 'vitest';
import { pipe, Maybe } from '../src';

describe('Maybe — construction', () => {
  bench('just', () => {
    Maybe.just(42);
  });

  bench('fromNullable — present', () => {
    Maybe.fromNullable(42);
  });

  bench('fromNullable — null', () => {
    Maybe.fromNullable(null);
  });

  bench('fromPredicate — pass', () => {
    Maybe.fromPredicate((n: number) => n > 0)(5);
  });

  bench('fromPredicate — fail', () => {
    Maybe.fromPredicate((n: number) => n > 0)(-1);
  });
});

describe('Maybe — pipeline', () => {
  bench('map chain getOrElse — Just path', () => {
    pipe(
      Maybe.just(10),
      Maybe.map((x) => x + 1),
      Maybe.chain((x) => (x > 0 ? Maybe.just(x * 2) : Maybe.nothing)),
      Maybe.getOrElse(() => 0),
    );
  });

  bench('map chain getOrElse — Nothing path', () => {
    pipe(
      Maybe.nothing as Maybe.Maybe<number>,
      Maybe.map((x) => x + 1),
      Maybe.chain((x) => (x > 0 ? Maybe.just(x * 2) : Maybe.nothing)),
      Maybe.getOrElse(() => 0),
    );
  });

  bench('fold', () => {
    pipe(
      Maybe.just(42),
      Maybe.fold(
        () => 'none',
        (x) => `value: ${x}`,
      ),
    );
  });
});
