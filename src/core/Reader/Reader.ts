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

/** A computation that reads from an environment `R` and produces `A`. */
interface Reader<R, A> {
  (r: R): A;
}

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

const of =
  <R = unknown, A = never>(a: A): Reader<R, A> =>
  () =>
    a;

/** A Reader that returns the environment itself. */
const ask = <R>(): Reader<R, R> => (r) => r;

/** A Reader that applies a projection to the environment. */
const asks = <R, A>(f: (r: R) => A): Reader<R, A> => f;

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

const map =
  <A, B>(f: (a: A) => B) =>
  <R>(fa: Reader<R, A>): Reader<R, B> =>
  (r) =>
    f(fa(r));

const ap =
  <R, A, B>(fab: Reader<R, (a: A) => B>) =>
  (fa: Reader<R, A>): Reader<R, B> =>
  (r) =>
    fab(r)(fa(r));

const chain =
  <A, R, B>(f: (a: A) => Reader<R, B>) =>
  (fa: Reader<R, A>): Reader<R, B> =>
  (r) =>
    f(fa(r))(r);

const local =
  <R, R2>(f: (r2: R2) => R) =>
  <A>(fa: Reader<R, A>): Reader<R2, A> =>
  (r2) =>
    fa(f(r2));

/** Execute the Reader with a given environment. */
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
