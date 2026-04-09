const ReaderURI = 'Reader' as const;
type ReaderURI = typeof ReaderURI;

declare module '../../types/hkt' {
  interface URItoKind2<E, A> {
    readonly [ReaderURI]: Reader<E, A>;
  }
}

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/**
 * A computation that reads from an environment `R` and produces `A`.
 *
 * @example
 * ```ts
 * import { Reader } from 'catena'
 *
 * const readName: Reader<{ name: string }, string> = (env) => env.name
 * ```
 *
 * @since 0.1.0
 */
interface Reader<R, A> {
  (r: R): A;
}

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

/**
 * Lifts a pure value into a Reader that ignores the environment.
 *
 * @since 0.1.0
 */
const of =
  <R = unknown, A = never>(a: A): Reader<R, A> =>
  () =>
    a;

/**
 * A Reader that returns the environment itself.
 *
 * @since 0.1.0
 */
const ask =
  <R>(): Reader<R, R> =>
  (r) =>
    r;

/**
 * A Reader that applies a projection to the environment.
 *
 * @since 0.1.0
 */
const asks = <R, A>(f: (r: R) => A): Reader<R, A> => f;

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

/**
 * Maps the result of a Reader with a function.
 *
 * @since 0.1.0
 */
const map =
  <A, B>(f: (a: A) => B) =>
  <R>(fa: Reader<R, A>): Reader<R, B> =>
  (r) =>
    f(fa(r));

/**
 * Applies a Reader of functions to a Reader of values.
 *
 * @since 0.1.0
 */
const ap =
  <R, A, B>(fab: Reader<R, (a: A) => B>) =>
  (fa: Reader<R, A>): Reader<R, B> =>
  (r) =>
    fab(r)(fa(r));

/**
 * Sequences Readers, using the result of the first to choose the next.
 *
 * @since 0.1.0
 */
const chain =
  <A, R, B>(f: (a: A) => Reader<R, B>) =>
  (fa: Reader<R, A>): Reader<R, B> =>
  (r) =>
    f(fa(r))(r);

/**
 * Runs a Reader in a modified environment.
 *
 * @since 0.1.0
 */
const local =
  <R, R2>(f: (r2: R2) => R) =>
  <A>(fa: Reader<R, A>): Reader<R2, A> =>
  (r2) =>
    fa(f(r2));

/**
 * Execute the Reader with a given environment.
 *
 * @since 0.1.0
 */
const run =
  <R>(r: R) =>
  <A>(fa: Reader<R, A>): A =>
    fa(r);

// ---------------------------------------------------------------------------
// Typeclass instances
// ---------------------------------------------------------------------------

const URI = ReaderURI;

const Functor = { URI, map } as const;
const Applicative = { URI, map, ap, of } as const;
const Monad = { URI, map, ap, of, chain } as const;

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export {
  type Reader,
  ReaderURI as URI,
  of,
  ask,
  asks,
  map,
  ap,
  chain,
  local,
  run,
  Functor,
  Applicative,
  Monad,
};
