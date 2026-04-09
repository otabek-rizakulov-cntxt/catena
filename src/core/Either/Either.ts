import type { Lazy } from '../../types/utils';

const EitherURI = 'Either' as const;
type EitherURI = typeof EitherURI;

declare module '../../types/hkt' {
  interface URItoKind2<E, A> {
    readonly [EitherURI]: Either<E, A>;
  }
}

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/**
 * The failure branch of an `Either`, tagged with `'Left'` and holding an error or context value `E`.
 * @since 0.1.0
 */
interface Left<E> {
  readonly _tag: 'Left';
  readonly left: E;
}

/**
 * The success branch of an `Either`, tagged with `'Right'` and holding the computed value `A`.
 * @since 0.1.0
 */
interface Right<A> {
  readonly _tag: 'Right';
  readonly right: A;
}

/**
 * A discriminated union for values that may fail: either a left `E` or a right `A`.
 * Use `left` / `right` to construct, guards to narrow, and `map` / `chain` / `fold` to transform or consume.
 *
 * @example
 * ```ts
 * import { pipe, Either } from 'catena';
 *
 * const doubled = pipe(
 *   Either.right(21),
 *   Either.map((n) => n * 2),
 * );
 * ```
 * @since 0.1.0
 */
type Either<E, A> = Left<E> | Right<A>;

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

/**
 * Construct a `Left` value, representing failure or the absence of a successful result.
 * @since 0.1.0
 */
const left = <E, A = never>(e: E): Either<E, A> => ({ _tag: 'Left', left: e });

/**
 * Construct a `Right` value, representing success.
 * @example
 * ```ts
 * const ok: Either<string, number> = Either.right(42);
 * ```
 * @since 0.1.0
 */
const right = <A, E = never>(a: A): Either<E, A> => ({ _tag: 'Right', right: a });

/**
 * Wrap a value in `Right`; the `Applicative` / `Monad` unit (`pure`).
 * @since 0.1.0
 */
const of = right;

/**
 * Map `null` or `undefined` to `Left` using `onNullable`, otherwise wrap the value in `Right`.
 * @example
 * ```ts
 * const parse = Either.fromNullable(() => 'missing')('hello');
 * // Right<'hello'>
 * ```
 * @since 0.1.0
 */
const fromNullable =
  <E>(onNullable: Lazy<E>) =>
  <A>(value: A | null | undefined): Either<E, NonNullable<A>> =>
    value == null ? left(onNullable()) : right(value);

/**
 * Run a thunk; return `Right` with its result, or `Left` with `onError` if it throws.
 * @example
 * ```ts
 * const parsed = Either.tryCatch(
 *   () => JSON.parse('{}'),
 *   () => 'invalid json',
 * );
 * ```
 * @since 0.1.0
 */
const tryCatch = <E, A>(f: Lazy<A>, onError: (error: unknown) => E): Either<E, A> => {
  try {
    return right(f());
  } catch (e) {
    return left(onError(e));
  }
};

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

/**
 * `true` when `ea` is `Left`.
 * @since 0.1.0
 */
const isLeft = <E, A>(ea: Either<E, A>): ea is Left<E> => ea._tag === 'Left';

/**
 * `true` when `ea` is `Right`.
 * @since 0.1.0
 */
const isRight = <E, A>(ea: Either<E, A>): ea is Right<A> => ea._tag === 'Right';

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

/**
 * Map over the `Right` value; `Left` is unchanged.
 * @since 0.1.0
 */
const map =
  <A, B>(f: (a: A) => B) =>
  <E>(ea: Either<E, A>): Either<E, B> =>
    isRight(ea) ? right(f(ea.right)) : ea;

/**
 * Map over the `Left` value; `Right` is unchanged.
 * @since 0.1.0
 */
const mapLeft =
  <E, G>(f: (e: E) => G) =>
  <A>(ea: Either<E, A>): Either<G, A> =>
    isLeft(ea) ? left(f(ea.left)) : ea;

/**
 * Map both branches: `f` on `Left`, `g` on `Right`.
 * @since 0.1.0
 */
const bimap =
  <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) =>
  (ea: Either<E, A>): Either<G, B> =>
    isLeft(ea) ? left(f(ea.left)) : right(g(ea.right));

/**
 * Apply a function inside `Right` to the `Right` value of `ea`; short-circuit on the first `Left`.
 * @since 0.1.0
 */
const ap =
  <E, A, B>(fab: Either<E, (a: A) => B>) =>
  (ea: Either<E, A>): Either<E, B> =>
    isLeft(fab) ? fab : map(fab.right)(ea);

/**
 * Monadic bind: if `Right`, run `f` and return its result; if `Left`, pass it through.
 * @since 0.1.0
 */
const chain =
  <A, E, B>(f: (a: A) => Either<E, B>) =>
  (ea: Either<E, A>): Either<E, B> =>
    isRight(ea) ? f(ea.right) : ea;

/**
 * Collapse an `Either` to a single type using `onLeft` or `onRight`.
 * @since 0.1.0
 */
const fold =
  <E, A, B>(onLeft: (e: E) => B, onRight: (a: A) => B) =>
  (ea: Either<E, A>): B =>
    isLeft(ea) ? onLeft(ea.left) : onRight(ea.right);

/**
 * Return the `Right` value, or `fallback(left)` if `Left`.
 * @since 0.1.0
 */
const getOrElse =
  <E, A>(fallback: (e: E) => A) =>
  (ea: Either<E, A>): A =>
    isRight(ea) ? ea.right : fallback(ea.left);

/**
 * If `Right`, combine `seed` with the value using `f`; otherwise return `seed`.
 * @since 0.1.0
 */
const reduce =
  <A, B>(f: (acc: B, a: A) => B, seed: B) =>
  <E>(ea: Either<E, A>): B =>
    isRight(ea) ? f(seed, ea.right) : seed;

/**
 * Exchange `Left` and `Right`: `Left(e)` becomes `Right(e)` and `Right(a)` becomes `Left(a)`.
 * @since 0.1.0
 */
const swap = <E, A>(ea: Either<E, A>): Either<A, E> =>
  isLeft(ea) ? right(ea.left) : left(ea.right);

// ---------------------------------------------------------------------------
// Typeclass instances
// ---------------------------------------------------------------------------

const URI = EitherURI;

const Functor = { URI, map } as const;
const Applicative = { URI, map, ap, of } as const;
const Monad = { URI, map, ap, of, chain } as const;
const Bifunctor = { URI, map, bimap } as const;

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export {
  type Either,
  type Left,
  type Right,
  EitherURI as URI,
  left,
  right,
  of,
  fromNullable,
  tryCatch,
  isLeft,
  isRight,
  map,
  mapLeft,
  bimap,
  ap,
  chain,
  fold,
  getOrElse,
  reduce,
  swap,
  Functor,
  Applicative,
  Monad,
  Bifunctor,
};
