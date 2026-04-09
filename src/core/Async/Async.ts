import type { Lazy } from '../../types/utils';

const AsyncURI = 'Async' as const;
type AsyncURI = typeof AsyncURI;

declare module '../../types/hkt' {
  interface URItoKind2<E, A> {
    readonly [AsyncURI]: Async<E, A>;
  }
}

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/**
 * An asynchronous computation that can fail with `E` or succeed with `A`.
 *
 * Unlike raw Promise, the error channel is typed and execution is lazy —
 * nothing runs until {@link run} is called.
 *
 * @example
 * ```ts
 * import { Async } from 'catena';
 *
 * const computation = Async.succeed(42);
 * ```
 *
 * @since 0.1.0
 */
interface Async<E, A> {
  (): Promise<Either<E, A>>;
}

type Either<E, A> =
  | { readonly _tag: 'Left'; readonly value: E }
  | { readonly _tag: 'Right'; readonly value: A };

const _left = <E>(e: E): Either<E, never> => ({ _tag: 'Left', value: e });
const _right = <A>(a: A): Either<never, A> => ({ _tag: 'Right', value: a });
const _isRight = <E, A>(ea: Either<E, A>): ea is Extract<Either<E, A>, { _tag: 'Right' }> =>
  ea._tag === 'Right';

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

/**
 * An Async that succeeds with the given value.
 *
 * @since 0.1.0
 */
const succeed =
  <A, E = never>(a: A): Async<E, A> =>
  () =>
    Promise.resolve(_right(a));

/**
 * An Async that fails with the given error.
 *
 * @since 0.1.0
 */
const fail =
  <E, A = never>(e: E): Async<E, A> =>
  () =>
    Promise.resolve(_left(e));

/**
 * Alias for {@link succeed}.
 *
 * @since 0.1.0
 */
const of = succeed;

/**
 * Lifts a lazy Promise into Async, mapping rejections with `onRejected`.
 *
 * @since 0.1.0
 */
const fromPromise =
  <E>(onRejected: (reason: unknown) => E) =>
  <A>(promise: Lazy<Promise<A>>): Async<E, A> =>
  () =>
    promise().then(_right<A>, (reason: unknown) => _left(onRejected(reason)));

/**
 * Runs a lazy Promise in Async, using `onRejected` when it rejects.
 *
 * @since 0.1.0
 */
const tryCatch = <E, A>(f: Lazy<Promise<A>>, onRejected: (reason: unknown) => E): Async<E, A> =>
  fromPromise(onRejected)(f);

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

/**
 * Maps the success value of an Async with `f`.
 *
 * @since 0.1.0
 */
const map =
  <A, B>(f: (a: A) => B) =>
  <E>(fa: Async<E, A>): Async<E, B> =>
  () =>
    fa().then((ea): Either<E, B> => (_isRight(ea) ? _right(f(ea.value)) : ea));

/**
 * Maps the error channel of an Async with `f`.
 *
 * @since 0.1.0
 */
const mapError =
  <E, G>(f: (e: E) => G) =>
  <A>(fa: Async<E, A>): Async<G, A> =>
  () =>
    fa().then((ea): Either<G, A> => (_isRight(ea) ? ea : _left(f(ea.value))));

/**
 * Maps both the error and success sides of an Async.
 *
 * @since 0.1.0
 */
const bimap =
  <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) =>
  (fa: Async<E, A>): Async<G, B> =>
  () =>
    fa().then((ea) => (_isRight(ea) ? _right(g(ea.value)) : _left(f(ea.value))));

/**
 * Applies the function inside `fab` to the success value of `fa` (applicative apply).
 *
 * @since 0.1.0
 */
const ap =
  <E, A, B>(fab: Async<E, (a: A) => B>) =>
  (fa: Async<E, A>): Async<E, B> =>
  async (): Promise<Either<E, B>> => {
    const [eab, ea] = await Promise.all([fab(), fa()]);
    if (!_isRight(eab)) return eab;
    if (!_isRight(ea)) return ea;
    return _right(eab.value(ea.value));
  };

/**
 * Sequences Asyncs: runs `f` on success to produce the next Async (monadic bind).
 *
 * @since 0.1.0
 */
const chain =
  <A, E, B>(f: (a: A) => Async<E, B>) =>
  (fa: Async<E, A>): Async<E, B> =>
  (): Promise<Either<E, B>> =>
    fa().then((ea) => (_isRight(ea) ? f(ea.value)() : ea));

/**
 * Folds failure or success into a single success value inside Async.
 *
 * @since 0.1.0
 */
const fold =
  <E, A, B>(onFailure: (e: E) => B, onSuccess: (a: A) => B) =>
  (fa: Async<E, A>): Async<never, B> =>
  () =>
    fa().then((ea) => (_isRight(ea) ? _right(onSuccess(ea.value)) : _right(onFailure(ea.value))));

/**
 * Execute the Async and return a Promise of the internal Either.
 *
 * @since 0.1.0
 */
const run = <E, A>(fa: Async<E, A>): Promise<Either<E, A>> => fa();

/**
 * Execute the Async — resolve on success, reject on failure.
 *
 * @since 0.1.0
 */
const runPromise = <E, A>(fa: Async<E, A>): Promise<A> =>
  fa().then((ea) => {
    if (_isRight(ea)) return ea.value;
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- intentional: E is the user-defined error channel, not necessarily an Error instance
    throw ea.value;
  });

// ---------------------------------------------------------------------------
// Typeclass instances
// ---------------------------------------------------------------------------

const URI = AsyncURI;

const Functor = { URI, map } as const;
const Applicative = { URI, map, ap, of } as const;
const Monad = { URI, map, ap, of, chain } as const;
const Bifunctor = { URI, map, bimap } as const;

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export {
  type Async,
  AsyncURI as URI,
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
  Functor,
  Applicative,
  Monad,
  Bifunctor,
};
