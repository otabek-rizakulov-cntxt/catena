import { describe, it, expect, expectTypeOf } from 'vitest';
import { of, ask, asks, map, ap, chain, local, run } from './Reader';
import type { Reader } from './Reader';
import { pipe } from '../../combinators/pipe';
import { identity } from '../../combinators/identity';

interface Env {
  readonly multiplier: number;
  readonly prefix: string;
}

const env: Env = { multiplier: 3, prefix: 'val' };

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

describe('Reader constructors', () => {
  it('of ignores the environment and returns the value', () => {
    expect(pipe(of<Env, number>(42), run(env))).toBe(42);
  });

  it('ask returns the full environment', () => {
    expect(pipe(ask<Env>(), run(env))).toEqual(env);
  });

  it('asks applies a projection to the environment', () => {
    expect(
      pipe(
        asks<Env, number>((e) => e.multiplier),
        run(env),
      ),
    ).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// Functor
// ---------------------------------------------------------------------------

describe('Reader.map', () => {
  it('transforms the result', () => {
    const reader = asks<Env, number>((e) => e.multiplier);
    expect(
      pipe(
        reader,
        map((x) => x * 10),
        run(env),
      ),
    ).toBe(30);
  });

  it('satisfies identity law', () => {
    const reader = of<Env, number>(42);
    expect(pipe(reader, map(identity), run(env))).toBe(pipe(reader, run(env)));
  });

  it('satisfies composition law', () => {
    const f = (x: number) => x + 1;
    const g = (x: number) => x * 2;
    const reader = of<Env, number>(5);
    expect(
      pipe(
        reader,
        map((x) => f(g(x))),
        run(env),
      ),
    ).toBe(pipe(reader, map(g), map(f), run(env)));
  });
});

// ---------------------------------------------------------------------------
// Applicative
// ---------------------------------------------------------------------------

describe('Reader.ap', () => {
  it('applies a wrapped function within the same environment', () => {
    const fab: Reader<Env, (x: number) => string> = (e) => (x) => `${e.prefix}:${x}`;
    const fa: Reader<Env, number> = (e) => e.multiplier;
    expect(pipe(fa, ap(fab), run(env))).toBe('val:3');
  });
});

// ---------------------------------------------------------------------------
// Monad
// ---------------------------------------------------------------------------

describe('Reader.chain', () => {
  it('chains computations sharing the same environment', () => {
    const reader = pipe(
      asks<Env, number>((e) => e.multiplier),
      chain((m) => asks((e: Env) => `${e.prefix}:${m}`)),
    );
    expect(pipe(reader, run(env))).toBe('val:3');
  });

  it('satisfies left identity', () => {
    const f = (x: number): Reader<Env, string> => of(`${x}`);
    expect(pipe(of<Env, number>(42), chain(f), run(env))).toBe(pipe(f(42), run(env)));
  });

  it('satisfies right identity', () => {
    const m = of<Env, number>(42);
    expect(pipe(m, chain(of), run(env))).toBe(pipe(m, run(env)));
  });
});

// ---------------------------------------------------------------------------
// local
// ---------------------------------------------------------------------------

describe('Reader.local', () => {
  it('modifies the environment before passing it in', () => {
    const reader = asks<Env, number>((e) => e.multiplier);
    const localReader = pipe(
      reader,
      local((bigger: Env) => ({ ...bigger, multiplier: bigger.multiplier * 10 })),
    );
    expect(pipe(localReader, run(env))).toBe(30);
  });
});

// ---------------------------------------------------------------------------
// Type-level tests
// ---------------------------------------------------------------------------

describe('Reader type inference', () => {
  it('map infers correct output type', () => {
    const result = pipe(of<Env, number>(5), map(String));
    expectTypeOf(result).toEqualTypeOf<Reader<Env, string>>();
  });

  it('chain infers correct output type', () => {
    const result = pipe(
      of<Env, number>(5),
      chain((x) => of<Env, string>(String(x))),
    );
    expectTypeOf(result).toEqualTypeOf<Reader<Env, string>>();
  });
});
