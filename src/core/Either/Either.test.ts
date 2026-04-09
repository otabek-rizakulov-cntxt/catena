import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  left,
  right,
  of,
  fromNullable,
  tryCatch,
  isLeft,
  isRight,
  map,
  mapLeft,
  bimap,
  ap,
  chain,
  fold,
  getOrElse,
  reduce,
  swap,
} from './Either';
import type { Either } from './Either';
import { pipe } from '../../combinators/pipe';
import { identity } from '../../combinators/identity';

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

describe('Either constructors', () => {
  it('left creates a Left', () => {
    expect(left('err')).toEqual({ _tag: 'Left', left: 'err' });
  });

  it('right creates a Right', () => {
    expect(right(42)).toEqual({ _tag: 'Right', right: 42 });
  });

  it('of is an alias for right', () => {
    expect(of(1)).toEqual(right(1));
  });

  it('fromNullable returns Right for non-null values', () => {
    const parse = fromNullable(() => 'was null');
    expect(parse(42)).toEqual(right(42));
    expect(parse(0)).toEqual(right(0));
    expect(parse('')).toEqual(right(''));
    expect(parse(false)).toEqual(right(false));
  });

  it('fromNullable returns Left for null/undefined', () => {
    const parse = fromNullable(() => 'was null');
    expect(parse(null)).toEqual(left('was null'));
    expect(parse(undefined)).toEqual(left('was null'));
  });

  it('tryCatch returns Right on success', () => {
    expect(tryCatch(() => 42, String)).toEqual(right(42));
  });

  it('tryCatch returns Left on thrown error', () => {
    expect(
      tryCatch(
        () => {
          throw new Error('boom');
        },
        (e) => (e instanceof Error ? e.message : 'unknown'),
      ),
    ).toEqual(left('boom'));
  });
});

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

describe('Either guards', () => {
  it('isLeft returns true for Left', () => {
    expect(isLeft(left('err'))).toBe(true);
  });

  it('isLeft returns false for Right', () => {
    expect(isLeft(right(1))).toBe(false);
  });

  it('isRight returns true for Right', () => {
    expect(isRight(right(1))).toBe(true);
  });

  it('isRight returns false for Left', () => {
    expect(isRight(left('err'))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Functor
// ---------------------------------------------------------------------------

describe('Either.map', () => {
  it('applies f to Right value', () => {
    expect(
      pipe(
        right(5),
        map((x) => x * 2),
      ),
    ).toEqual(right(10));
  });

  it('passes through Left unchanged', () => {
    expect(
      pipe(
        left('err') as Either<string, number>,
        map((x) => x * 2),
      ),
    ).toEqual(left('err'));
  });

  it('satisfies identity law', () => {
    const r = right(42);
    expect(pipe(r, map(identity))).toEqual(r);
  });

  it('satisfies composition law', () => {
    const f = (x: number) => x + 1;
    const g = (x: number) => x * 2;
    const r = right(5);
    expect(
      pipe(
        r,
        map((x) => f(g(x))),
      ),
    ).toEqual(pipe(r, map(g), map(f)));
  });
});

describe('Either.mapLeft', () => {
  it('applies f to Left value', () => {
    expect(
      pipe(
        left('err'),
        mapLeft((s) => s.toUpperCase()),
      ),
    ).toEqual(left('ERR'));
  });

  it('passes through Right unchanged', () => {
    expect(
      pipe(
        right(42) as Either<string, number>,
        mapLeft((s) => s.toUpperCase()),
      ),
    ).toEqual(right(42));
  });
});

// ---------------------------------------------------------------------------
// Bifunctor
// ---------------------------------------------------------------------------

describe('Either.bimap', () => {
  it('applies left function to Left', () => {
    expect(
      pipe(
        left('err') as Either<string, number>,
        bimap(
          (e) => e.toUpperCase(),
          (a) => a * 2,
        ),
      ),
    ).toEqual(left('ERR'));
  });

  it('applies right function to Right', () => {
    expect(
      pipe(
        right(5) as Either<string, number>,
        bimap(
          (e) => e.toUpperCase(),
          (a) => a * 2,
        ),
      ),
    ).toEqual(right(10));
  });
});

// ---------------------------------------------------------------------------
// Applicative
// ---------------------------------------------------------------------------

describe('Either.ap', () => {
  it('applies Right function to Right value', () => {
    expect(pipe(right(5) as Either<string, number>, ap(right((x: number) => x + 1)))).toEqual(
      right(6),
    );
  });

  it('returns Left when function is Left', () => {
    expect(
      pipe(
        right(5) as Either<string, number>,
        ap(left('err') as Either<string, (x: number) => number>),
      ),
    ).toEqual(left('err'));
  });

  it('returns Left when value is Left', () => {
    expect(pipe(left('err') as Either<string, number>, ap(right((x: number) => x + 1)))).toEqual(
      left('err'),
    );
  });
});

// ---------------------------------------------------------------------------
// Monad
// ---------------------------------------------------------------------------

describe('Either.chain', () => {
  const safeDivide =
    (b: number) =>
    (a: number): Either<string, number> =>
      b === 0 ? left('division by zero') : right(a / b);

  it('chains Right values', () => {
    expect(pipe(right(10), chain(safeDivide(2)))).toEqual(right(5));
  });

  it('short-circuits on Left', () => {
    expect(pipe(left('err') as Either<string, number>, chain(safeDivide(2)))).toEqual(left('err'));
  });

  it('produces Left from chain function', () => {
    expect(pipe(right(10), chain(safeDivide(0)))).toEqual(left('division by zero'));
  });

  it('satisfies left identity', () => {
    const f = (x: number): Either<string, string> => right(String(x));
    expect(pipe(of(42), chain(f))).toEqual(f(42));
  });

  it('satisfies right identity', () => {
    const m = right(42) as Either<string, number>;
    expect(pipe(m, chain(of))).toEqual(m);
  });
});

// ---------------------------------------------------------------------------
// Folding & extraction
// ---------------------------------------------------------------------------

describe('Either.fold', () => {
  it('calls onRight for Right', () => {
    expect(
      pipe(
        right(5) as Either<string, number>,
        fold(
          (e) => `error: ${e}`,
          (a) => `value: ${a}`,
        ),
      ),
    ).toBe('value: 5');
  });

  it('calls onLeft for Left', () => {
    expect(
      pipe(
        left('err') as Either<string, number>,
        fold(
          (e) => `error: ${e}`,
          (a) => `value: ${a}`,
        ),
      ),
    ).toBe('error: err');
  });
});

describe('Either.getOrElse', () => {
  it('returns Right value', () => {
    expect(
      pipe(
        right(42) as Either<string, number>,
        getOrElse(() => 0),
      ),
    ).toBe(42);
  });

  it('returns fallback for Left', () => {
    expect(
      pipe(
        left('err') as Either<string, number>,
        getOrElse(() => 0),
      ),
    ).toBe(0);
  });
});

describe('Either.reduce', () => {
  it('applies reducer for Right', () => {
    expect(
      pipe(
        right(5),
        reduce((acc: number, x) => acc + x, 10),
      ),
    ).toBe(15);
  });

  it('returns seed for Left', () => {
    expect(
      pipe(
        left('err') as Either<string, number>,
        reduce((acc: number, x) => acc + x, 10),
      ),
    ).toBe(10);
  });
});

describe('Either.swap', () => {
  it('swaps Right to Left', () => {
    expect(swap(right(42))).toEqual(left(42));
  });

  it('swaps Left to Right', () => {
    expect(swap(left('err'))).toEqual(right('err'));
  });
});

// ---------------------------------------------------------------------------
// Type-level tests
// ---------------------------------------------------------------------------

describe('Either type inference', () => {
  it('map infers correct types', () => {
    const result = pipe(right(5) as Either<string, number>, map(String));
    expectTypeOf(result).toEqualTypeOf<Either<string, string>>();
  });

  it('chain infers correct types', () => {
    const result = pipe(
      right(5) as Either<string, number>,
      chain((x) => right(String(x)) as Either<string, string>),
    );
    expectTypeOf(result).toEqualTypeOf<Either<string, string>>();
  });

  it('fold infers the merged return type', () => {
    const result = pipe(
      right(5) as Either<string, number>,
      fold(
        () => 'nope',
        (n) => `val:${n}`,
      ),
    );
    expectTypeOf(result).toEqualTypeOf<string>();
  });
});
