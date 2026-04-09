import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  just,
  nothing,
  fromNullable,
  fromPredicate,
  isJust,
  isNothing,
  map,
  ap,
  of,
  chain,
  alt,
  fold,
  getOrElse,
  reduce,
  toNullable,
  toUndefined,
} from './Maybe';
import type { Maybe } from './Maybe';
import { pipe } from '../../combinators/pipe';
import { identity } from '../../combinators/identity';

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

describe('Maybe constructors', () => {
  it('just wraps a value', () => {
    expect(just(42)).toEqual({ _tag: 'Just', value: 42 });
  });

  it('nothing is a singleton', () => {
    expect(nothing).toEqual({ _tag: 'Nothing' });
  });

  it('of is an alias for just', () => {
    expect(of(1)).toEqual(just(1));
  });

  it('fromNullable returns Just for non-null values', () => {
    expect(fromNullable(42)).toEqual(just(42));
    expect(fromNullable('hello')).toEqual(just('hello'));
    expect(fromNullable(0)).toEqual(just(0));
    expect(fromNullable('')).toEqual(just(''));
    expect(fromNullable(false)).toEqual(just(false));
  });

  it('fromNullable returns Nothing for null and undefined', () => {
    expect(fromNullable(null)).toEqual(nothing);
    expect(fromNullable(undefined)).toEqual(nothing);
  });

  it('fromPredicate returns Just when predicate holds', () => {
    const positive = fromPredicate((n: number) => n > 0);
    expect(positive(5)).toEqual(just(5));
  });

  it('fromPredicate returns Nothing when predicate fails', () => {
    const positive = fromPredicate((n: number) => n > 0);
    expect(positive(-1)).toEqual(nothing);
  });

  it('fromPredicate narrows types with a refinement', () => {
    const isString = fromPredicate(
      (x: string | number): x is string => typeof x === 'string',
    );
    const result = isString('hello');
    expectTypeOf(result).toEqualTypeOf<Maybe<string>>();
  });
});

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

describe('Maybe guards', () => {
  it('isJust returns true for Just', () => {
    expect(isJust(just(1))).toBe(true);
  });

  it('isJust returns false for Nothing', () => {
    expect(isJust(nothing)).toBe(false);
  });

  it('isNothing returns true for Nothing', () => {
    expect(isNothing(nothing)).toBe(true);
  });

  it('isNothing returns false for Just', () => {
    expect(isNothing(just(1))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Functor
// ---------------------------------------------------------------------------

describe('Maybe.map', () => {
  it('applies f to Just value', () => {
    expect(pipe(just(5), map((x) => x * 2))).toEqual(just(10));
  });

  it('returns Nothing unchanged', () => {
    expect(pipe(nothing, map((x: number) => x * 2))).toEqual(nothing);
  });

  it('satisfies identity law: map(id) === id', () => {
    const j = just(42);
    expect(pipe(j, map(identity))).toEqual(j);
  });

  it('satisfies composition law: map(f . g) === map(f) . map(g)', () => {
    const f = (x: number) => x + 1;
    const g = (x: number) => x * 2;
    const j = just(5);
    expect(pipe(j, map((x) => f(g(x))))).toEqual(pipe(j, map(g), map(f)));
  });
});

// ---------------------------------------------------------------------------
// Applicative
// ---------------------------------------------------------------------------

describe('Maybe.ap', () => {
  it('applies Just function to Just value', () => {
    expect(pipe(just(5), ap(just((x: number) => x + 1)))).toEqual(just(6));
  });

  it('returns Nothing when function is Nothing', () => {
    expect(pipe(just(5), ap(nothing as Maybe<(x: number) => number>))).toEqual(nothing);
  });

  it('returns Nothing when value is Nothing', () => {
    expect(pipe(nothing, ap(just((x: number) => x + 1)))).toEqual(nothing);
  });
});

// ---------------------------------------------------------------------------
// Monad
// ---------------------------------------------------------------------------

describe('Maybe.chain', () => {
  it('chains Just values', () => {
    const safeSqrt = (x: number): Maybe<number> => (x >= 0 ? just(Math.sqrt(x)) : nothing);
    expect(pipe(just(9), chain(safeSqrt))).toEqual(just(3));
  });

  it('short-circuits on Nothing', () => {
    const safeSqrt = (x: number): Maybe<number> => (x >= 0 ? just(Math.sqrt(x)) : nothing);
    expect(pipe(nothing, chain(safeSqrt))).toEqual(nothing);
  });

  it('chains to Nothing', () => {
    expect(pipe(just(-1), chain((x: number) => (x >= 0 ? just(x) : nothing)))).toEqual(nothing);
  });

  it('satisfies left identity: chain(f)(of(a)) === f(a)', () => {
    const f = (x: number): Maybe<string> => just(String(x));
    expect(pipe(of(42), chain(f))).toEqual(f(42));
  });

  it('satisfies right identity: chain(of)(m) === m', () => {
    const m = just(42);
    expect(pipe(m, chain(of))).toEqual(m);
  });
});

// ---------------------------------------------------------------------------
// Alt
// ---------------------------------------------------------------------------

describe('Maybe.alt', () => {
  it('returns first when it is Just', () => {
    expect(pipe(just(1), alt(() => just(2)))).toEqual(just(1));
  });

  it('returns second when first is Nothing', () => {
    expect(pipe(nothing, alt(() => just(2)))).toEqual(just(2));
  });
});

// ---------------------------------------------------------------------------
// Folding & Extraction
// ---------------------------------------------------------------------------

describe('Maybe.fold', () => {
  it('calls onJust for Just', () => {
    expect(
      pipe(
        just(5),
        fold(
          () => 'empty',
          (x) => `value: ${x}`,
        ),
      ),
    ).toBe('value: 5');
  });

  it('calls onNothing for Nothing', () => {
    expect(
      pipe(
        nothing,
        fold(
          () => 'empty',
          (x: number) => `value: ${x}`,
        ),
      ),
    ).toBe('empty');
  });
});

describe('Maybe.getOrElse', () => {
  it('returns the value for Just', () => {
    expect(pipe(just(42), getOrElse(() => 0))).toBe(42);
  });

  it('returns fallback for Nothing', () => {
    expect(pipe(nothing as Maybe<number>, getOrElse(() => 0))).toBe(0);
  });
});

describe('Maybe.reduce', () => {
  it('applies reducer for Just', () => {
    expect(pipe(just(5), reduce((acc: number, x) => acc + x, 10))).toBe(15);
  });

  it('returns seed for Nothing', () => {
    expect(pipe(nothing as Maybe<number>, reduce((acc: number, x) => acc + x, 10))).toBe(10);
  });
});

describe('Maybe.toNullable', () => {
  it('returns value for Just', () => {
    expect(toNullable(just(42))).toBe(42);
  });

  it('returns null for Nothing', () => {
    expect(toNullable(nothing)).toBeNull();
  });
});

describe('Maybe.toUndefined', () => {
  it('returns value for Just', () => {
    expect(toUndefined(just(42))).toBe(42);
  });

  it('returns undefined for Nothing', () => {
    expect(toUndefined(nothing)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Type-level tests
// ---------------------------------------------------------------------------

describe('Maybe type inference', () => {
  it('map infers correct output type', () => {
    const result = pipe(just(5), map(String));
    expectTypeOf(result).toEqualTypeOf<Maybe<string>>();
  });

  it('chain infers correct output type', () => {
    const result = pipe(
      just(5),
      chain((x) => just(String(x))),
    );
    expectTypeOf(result).toEqualTypeOf<Maybe<string>>();
  });

  it('fold infers correct output type', () => {
    const result = pipe(
      just(5),
      fold(
        () => 'none',
        (x) => `val:${x}`,
      ),
    );
    expectTypeOf(result).toEqualTypeOf<string>();
  });
});
