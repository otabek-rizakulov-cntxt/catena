import { describe, it, expect, expectTypeOf } from 'vitest';
import { ifElse } from './ifElse';
import { when } from './when';
import { unless } from './unless';
import { safe } from './safe';
import { tryCatch, tryCatchK } from './tryCatch';
import { just, nothing } from '../core/Maybe/Maybe';
import type { Maybe } from '../core/Maybe/Maybe';
import { pipe } from '../combinators/pipe';

// ---------------------------------------------------------------------------
// ifElse
// ---------------------------------------------------------------------------

describe('ifElse', () => {
  const classify = ifElse(
    (n: number) => n > 0,
    () => 'positive',
    () => 'non-positive',
  );

  it('returns onTrue when predicate holds', () => {
    expect(classify(5)).toBe('positive');
  });

  it('returns onFalse when predicate fails', () => {
    expect(classify(-1)).toBe('non-positive');
    expect(classify(0)).toBe('non-positive');
  });

  it('passes the value to both branches', () => {
    const result = ifElse(
      (n: number) => n % 2 === 0,
      (n) => `${n} is even`,
      (n) => `${n} is odd`,
    );
    expect(result(4)).toBe('4 is even');
    expect(result(3)).toBe('3 is odd');
  });
});

// ---------------------------------------------------------------------------
// when
// ---------------------------------------------------------------------------

describe('when', () => {
  const doubleIfPositive = when(
    (n: number) => n > 0,
    (n) => n * 2,
  );

  it('applies f when predicate holds', () => {
    expect(doubleIfPositive(5)).toBe(10);
  });

  it('returns value unchanged when predicate fails', () => {
    expect(doubleIfPositive(-3)).toBe(-3);
    expect(doubleIfPositive(0)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// unless
// ---------------------------------------------------------------------------

describe('unless', () => {
  const doubleUnlessPositive = unless(
    (n: number) => n > 0,
    (n) => n * 2,
  );

  it('returns value unchanged when predicate holds', () => {
    expect(doubleUnlessPositive(5)).toBe(5);
  });

  it('applies f when predicate fails', () => {
    expect(doubleUnlessPositive(-3)).toBe(-6);
    expect(doubleUnlessPositive(0)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// safe
// ---------------------------------------------------------------------------

describe('safe', () => {
  it('returns Just when predicate holds', () => {
    const safePositive = safe((n: number) => n > 0);
    expect(safePositive(5)).toEqual(just(5));
  });

  it('returns Nothing when predicate fails', () => {
    const safePositive = safe((n: number) => n > 0);
    expect(safePositive(-1)).toEqual(nothing);
  });

  it('narrows types with a refinement', () => {
    const safeString = safe((x: unknown): x is string => typeof x === 'string');
    const result = safeString('hello');
    expectTypeOf(result).toEqualTypeOf<Maybe<string>>();
    expect(result).toEqual(just('hello'));
  });

  it('works in a pipe', () => {
    const result = pipe(
      42,
      safe((n: number) => n > 0),
    );
    expect(result).toEqual(just(42));
  });
});

// ---------------------------------------------------------------------------
// tryCatch
// ---------------------------------------------------------------------------

describe('tryCatch', () => {
  it('returns Right on success', () => {
    const result = tryCatch(() => 42);
    expect(result).toEqual({ _tag: 'Right', right: 42 });
  });

  it('returns Left on thrown error', () => {
    const result = tryCatch(() => {
      throw new Error('boom');
    });
    expect(result._tag).toBe('Left');
  });
});

describe('tryCatchK', () => {
  it('returns Right on success', () => {
    const safeParse = tryCatchK((e: unknown) => (e instanceof Error ? e.message : 'unknown'));
    const result = safeParse(() => JSON.parse('{"a":1}') as unknown);
    expect(result).toEqual({ _tag: 'Right', right: { a: 1 } });
  });

  it('maps the error on failure', () => {
    const safeParse = tryCatchK((e: unknown) => (e instanceof Error ? e.message : 'unknown'));
    const result = safeParse(() => JSON.parse('invalid') as unknown);
    expect(result._tag).toBe('Left');
  });
});
