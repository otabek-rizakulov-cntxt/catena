const IOURI = 'IO' as const;
type IOURI = typeof IOURI;

declare module '../../types/hkt' {
  interface URItoKind<A> {
    readonly [IOURI]: IO<A>;
  }
}

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/**
 * A lazy synchronous computation that produces a value of type `A`. The
 * effect runs only when the thunk is invoked (for example via {@link run}).
 *
 * @example
 * ```ts
 * import { IO } from 'catena'
 * ```
 *
 * @since 0.1.0
 */
interface IO<A> {
  (): A;
}

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

/**
 * Lift a plain value into an `IO` that returns it when run.
 * @since 0.1.0
 */
const of =
  <A>(a: A): IO<A> =>
  () =>
    a;

/**
 * Return the same `IO` (identity on `IO`).
 * @since 0.1.0
 */
const fromIO = <A>(io: IO<A>): IO<A> => io;

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

/**
 * Map the result of an `IO` with a pure function.
 * @since 0.1.0
 */
const map =
  <A, B>(f: (a: A) => B) =>
  (fa: IO<A>): IO<B> =>
  () =>
    f(fa());

/**
 * Apply a function inside `IO` to a value inside `IO`.
 * @since 0.1.0
 */
const ap =
  <A, B>(fab: IO<(a: A) => B>) =>
  (fa: IO<A>): IO<B> =>
  () =>
    fab()(fa());

/**
 * Sequence computations: run the first `IO`, then run the `IO` returned by `f`.
 * @since 0.1.0
 */
const chain =
  <A, B>(f: (a: A) => IO<B>) =>
  (fa: IO<A>): IO<B> =>
  () =>
    f(fa())();

/**
 * Collapse nested `IO` into a single `IO`.
 * @since 0.1.0
 */
const flatten =
  <A>(mma: IO<IO<A>>): IO<A> =>
  () =>
    mma()();

/**
 * Execute the IO and return its result.
 * @since 0.1.0
 */
const run = <A>(io: IO<A>): A => io();

// ---------------------------------------------------------------------------
// Typeclass instances
// ---------------------------------------------------------------------------

const URI = IOURI;

const Functor = { URI, map } as const;
const Applicative = { URI, map, ap, of } as const;
const Monad = { URI, map, ap, of, chain } as const;

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export {
  type IO,
  IOURI as URI,
  of,
  fromIO,
  map,
  ap,
  chain,
  flatten,
  run,
  Functor,
  Applicative,
  Monad,
};
