import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  succeed,
  fail,
  of,
  fromPromise,
  tryCatch,
  map,
  mapError,
  bimap,
  ap,
  chain,
  fold,
  run,
  runPromise,
} from './Async';
import type { Async } from './Async';
import { pipe } from '../../combinators/pipe';
import { identity } from '../../combinators/identity';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const unwrap = async <E, A>(fa: Async<E, A>) => {
  const result = await run(fa);
  return result;
};

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

describe('Async constructors', () => {
  it('succeed creates a successful Async', async () => {
    const result = await unwrap(succeed(42));
    expect(result).toEqual({ _tag: 'Right', value: 42 });
  });

  it('fail creates a failed Async', async () => {
    const result = await unwrap(fail('err'));
    expect(result).toEqual({ _tag: 'Left', value: 'err' });
  });

  it('of is an alias for succeed', async () => {
    const result = await unwrap(of(42));
    expect(result).toEqual({ _tag: 'Right', value: 42 });
  });

  it('fromPromise wraps a resolving promise', async () => {
    const fa = fromPromise(String)(() => Promise.resolve(42));
    const result = await unwrap(fa);
    expect(result).toEqual({ _tag: 'Right', value: 42 });
  });

  it('fromPromise wraps a rejecting promise', async () => {
    const fa = fromPromise((e) => `caught: ${e as string}`)(() => Promise.reject('boom'));
    const result = await unwrap(fa);
    expect(result).toEqual({ _tag: 'Left', value: 'caught: boom' });
  });

  it('tryCatch resolves on success', async () => {
    const result = await unwrap(tryCatch(() => Promise.resolve(1), String));
    expect(result).toEqual({ _tag: 'Right', value: 1 });
  });

  it('tryCatch catches rejection', async () => {
    const result = await unwrap(tryCatch(() => Promise.reject('fail'), String));
    expect(result).toEqual({ _tag: 'Left', value: 'fail' });
  });
});

// ---------------------------------------------------------------------------
// Functor
// ---------------------------------------------------------------------------

describe('Async.map', () => {
  it('transforms a successful value', async () => {
    const result = await unwrap(
      pipe(
        succeed(5),
        map((x) => x * 2),
      ),
    );
    expect(result).toEqual({ _tag: 'Right', value: 10 });
  });

  it('passes through failure', async () => {
    const result = await unwrap(
      pipe(
        fail('err') as Async<string, number>,
        map((x) => x * 2),
      ),
    );
    expect(result).toEqual({ _tag: 'Left', value: 'err' });
  });

  it('satisfies identity law', async () => {
    const fa = succeed(42);
    const a = await unwrap(fa);
    const b = await unwrap(pipe(fa, map(identity)));
    expect(a).toEqual(b);
  });

  it('satisfies composition law', async () => {
    const f = (x: number) => x + 1;
    const g = (x: number) => x * 2;
    const fa = succeed(5);
    const a = await unwrap(
      pipe(
        fa,
        map((x) => f(g(x))),
      ),
    );
    const b = await unwrap(pipe(fa, map(g), map(f)));
    expect(a).toEqual(b);
  });
});

describe('Async.mapError', () => {
  it('transforms the error channel', async () => {
    const result = await unwrap(
      pipe(
        fail('err') as Async<string, number>,
        mapError((e) => e.toUpperCase()),
      ),
    );
    expect(result).toEqual({ _tag: 'Left', value: 'ERR' });
  });

  it('passes through success', async () => {
    const result = await unwrap(
      pipe(
        succeed(42) as Async<string, number>,
        mapError((e) => e.toUpperCase()),
      ),
    );
    expect(result).toEqual({ _tag: 'Right', value: 42 });
  });
});

// ---------------------------------------------------------------------------
// Bifunctor
// ---------------------------------------------------------------------------

describe('Async.bimap', () => {
  it('applies error function on failure', async () => {
    const result = await unwrap(
      pipe(
        fail('err') as Async<string, number>,
        bimap(
          (e) => e.toUpperCase(),
          (a) => a * 2,
        ),
      ),
    );
    expect(result).toEqual({ _tag: 'Left', value: 'ERR' });
  });

  it('applies success function on success', async () => {
    const result = await unwrap(
      pipe(
        succeed(5) as Async<string, number>,
        bimap(
          (e) => e.toUpperCase(),
          (a) => a * 2,
        ),
      ),
    );
    expect(result).toEqual({ _tag: 'Right', value: 10 });
  });
});

// ---------------------------------------------------------------------------
// Applicative
// ---------------------------------------------------------------------------

describe('Async.ap', () => {
  it('applies a successful function to a successful value', async () => {
    const result = await unwrap(
      pipe(succeed(5) as Async<string, number>, ap(succeed((x: number) => x + 1))),
    );
    expect(result).toEqual({ _tag: 'Right', value: 6 });
  });

  it('returns failure when function fails', async () => {
    const result = await unwrap(
      pipe(
        succeed(5) as Async<string, number>,
        ap(fail('err') as Async<string, (x: number) => number>),
      ),
    );
    expect(result).toEqual({ _tag: 'Left', value: 'err' });
  });

  it('returns failure when value fails', async () => {
    const result = await unwrap(
      pipe(
        fail('err') as Async<string, number>,
        ap(succeed((x: number) => x + 1) as Async<string, (x: number) => number>),
      ),
    );
    expect(result).toEqual({ _tag: 'Left', value: 'err' });
  });
});

// ---------------------------------------------------------------------------
// Monad
// ---------------------------------------------------------------------------

describe('Async.chain', () => {
  it('chains successful computations', async () => {
    const result = await unwrap(
      pipe(
        succeed(10),
        chain((x) => succeed(x * 2)),
      ),
    );
    expect(result).toEqual({ _tag: 'Right', value: 20 });
  });

  it('short-circuits on failure', async () => {
    const result = await unwrap(
      pipe(
        fail('err') as Async<string, number>,
        chain((x) => succeed(x * 2)),
      ),
    );
    expect(result).toEqual({ _tag: 'Left', value: 'err' });
  });

  it('chains to a failure', async () => {
    const result = await unwrap(
      pipe(
        succeed(0),
        chain((x) => (x === 0 ? fail('zero') : succeed(10 / x))),
      ),
    );
    expect(result).toEqual({ _tag: 'Left', value: 'zero' });
  });

  it('satisfies left identity', async () => {
    const f = (x: number) => succeed(String(x));
    const a = await unwrap(pipe(of(42), chain(f)));
    const b = await unwrap(f(42));
    expect(a).toEqual(b);
  });

  it('satisfies right identity', async () => {
    const m = succeed(42) as Async<string, number>;
    const a = await unwrap(pipe(m, chain(of)));
    const b = await unwrap(m);
    expect(a).toEqual(b);
  });
});

// ---------------------------------------------------------------------------
// Fold
// ---------------------------------------------------------------------------

describe('Async.fold', () => {
  it('folds a success', async () => {
    const result = await unwrap(
      pipe(
        succeed(5) as Async<string, number>,
        fold(
          (e) => `error: ${e}`,
          (a) => `value: ${a}`,
        ),
      ),
    );
    expect(result).toEqual({ _tag: 'Right', value: 'value: 5' });
  });

  it('folds a failure', async () => {
    const result = await unwrap(
      pipe(
        fail('err') as Async<string, number>,
        fold(
          (e) => `error: ${e}`,
          (a) => `value: ${a}`,
        ),
      ),
    );
    expect(result).toEqual({ _tag: 'Right', value: 'error: err' });
  });
});

// ---------------------------------------------------------------------------
// runPromise
// ---------------------------------------------------------------------------

describe('Async.runPromise', () => {
  it('resolves on success', async () => {
    await expect(runPromise(succeed(42))).resolves.toBe(42);
  });

  it('rejects on failure', async () => {
    await expect(runPromise(fail('err'))).rejects.toBe('err');
  });
});

// ---------------------------------------------------------------------------
// Laziness
// ---------------------------------------------------------------------------

describe('Async laziness', () => {
  it('does not execute until run is called', async () => {
    let executed = false;
    const fa = pipe(
      succeed(1),
      map((x) => {
        executed = true;
        return x + 1;
      }),
    );
    expect(executed).toBe(false);
    await run(fa);
    expect(executed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Type-level tests
// ---------------------------------------------------------------------------

describe('Async type inference', () => {
  it('map infers correct output type', () => {
    const result = pipe(succeed(5) as Async<string, number>, map(String));
    expectTypeOf(result).toEqualTypeOf<Async<string, string>>();
  });

  it('chain infers correct output type', () => {
    const result = pipe(
      succeed(5) as Async<string, number>,
      chain((x) => succeed(String(x)) as Async<string, string>),
    );
    expectTypeOf(result).toEqualTypeOf<Async<string, string>>();
  });
});
