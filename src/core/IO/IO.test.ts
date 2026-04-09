import { describe, it, expect, expectTypeOf } from 'vitest';
import { of, fromIO, map, ap, chain, flatten, run } from './IO';
import type { IO } from './IO';
import { pipe } from '../../combinators/pipe';
import { identity } from '../../combinators/identity';

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

describe('IO constructors', () => {
  it('of wraps a pure value', () => {
    expect(run(of(42))).toBe(42);
  });

  it('fromIO returns the same IO', () => {
    const io: IO<number> = () => 99;
    expect(run(fromIO(io))).toBe(99);
  });
});

// ---------------------------------------------------------------------------
// Functor
// ---------------------------------------------------------------------------

describe('IO.map', () => {
  it('transforms the result', () => {
    const io = of(5);
    expect(run(pipe(io, map((x) => x * 2)))).toBe(10);
  });

  it('satisfies identity law', () => {
    const io = of(42);
    expect(run(pipe(io, map(identity)))).toBe(run(io));
  });

  it('satisfies composition law', () => {
    const f = (x: number) => x + 1;
    const g = (x: number) => x * 2;
    const io = of(5);
    expect(run(pipe(io, map((x) => f(g(x)))))).toBe(run(pipe(io, map(g), map(f))));
  });
});

// ---------------------------------------------------------------------------
// Applicative
// ---------------------------------------------------------------------------

describe('IO.ap', () => {
  it('applies a wrapped function to a wrapped value', () => {
    const fab = of((x: number) => x + 10);
    const fa = of(5);
    expect(run(pipe(fa, ap(fab)))).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// Monad
// ---------------------------------------------------------------------------

describe('IO.chain', () => {
  it('chains computations', () => {
    let counter = 0;
    const inc: IO<number> = () => ++counter;
    const doubled = pipe(
      inc,
      chain((n) => of(n * 2)),
    );
    expect(run(doubled)).toBe(2);
    expect(counter).toBe(1);
  });

  it('satisfies left identity', () => {
    const f = (x: number): IO<string> => of(String(x));
    expect(run(pipe(of(42), chain(f)))).toBe(run(f(42)));
  });

  it('satisfies right identity', () => {
    const io = of(42);
    expect(run(pipe(io, chain(of)))).toBe(run(io));
  });
});

describe('IO.flatten', () => {
  it('unwraps a nested IO', () => {
    const nested = of(of(42));
    expect(run(flatten(nested))).toBe(42);
  });
});

// ---------------------------------------------------------------------------
// Laziness
// ---------------------------------------------------------------------------

describe('IO laziness', () => {
  it('defers execution until run', () => {
    let executed = false;
    const io = pipe(
      of(1),
      map((x) => {
        executed = true;
        return x + 1;
      }),
    );
    expect(executed).toBe(false);
    run(io);
    expect(executed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Type-level tests
// ---------------------------------------------------------------------------

describe('IO type inference', () => {
  it('map infers correct output type', () => {
    const result = pipe(of(5), map(String));
    expectTypeOf(result).toEqualTypeOf<IO<string>>();
  });

  it('chain infers correct output type', () => {
    const result = pipe(
      of(5),
      chain((x) => of(String(x))),
    );
    expectTypeOf(result).toEqualTypeOf<IO<string>>();
  });
});
