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

/** A lazy synchronous computation that produces `A`. */
interface IO<A> {
  (): A;
}

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

const of =
  <A>(a: A): IO<A> =>
  () =>
    a;

const fromIO = <A>(io: IO<A>): IO<A> => io;

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

const map =
  <A, B>(f: (a: A) => B) =>
  (fa: IO<A>): IO<B> =>
  () =>
    f(fa());

const ap =
  <A, B>(fab: IO<(a: A) => B>) =>
  (fa: IO<A>): IO<B> =>
  () =>
    fab()(fa());

const chain =
  <A, B>(f: (a: A) => IO<B>) =>
  (fa: IO<A>): IO<B> =>
  () =>
    f(fa())();

const flatten =
  <A>(mma: IO<IO<A>>): IO<A> =>
  () =>
    mma()();

/** Execute the IO and return its result. */
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
