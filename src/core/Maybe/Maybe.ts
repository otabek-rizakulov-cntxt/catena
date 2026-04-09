import type { Lazy, Predicate, Refinement } from '../../types/utils';

const MaybeURI = 'Maybe' as const;
type MaybeURI = typeof MaybeURI;

declare module '../../types/hkt' {
  interface URItoKind<A> {
    readonly [MaybeURI]: Maybe<A>;
  }
}

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/** The `Just` case of {@link Maybe}, containing a value of type `A`. */
interface Just<A> {
  readonly _tag: 'Just';
  readonly value: A;
}

/** The `Nothing` case of {@link Maybe}, representing absence. */
interface Nothing {
  readonly _tag: 'Nothing';
}

/**
 * A type that represents an optional value. A `Maybe<A>` is either
 * `Just<A>` (a value is present) or `Nothing` (no value).
 *
 * Use Maybe instead of `null`/`undefined` to make optionality explicit
 * and composable via `map`, `chain`, and `fold`.
 *
 * @example
 * ```ts
 * import { pipe, Maybe } from 'catena';
 *
 * const safeDivide = (a: number, b: number): Maybe.Maybe<number> =>
 *   b === 0 ? Maybe.nothing : Maybe.just(a / b);
 *
 * pipe(
 *   safeDivide(10, 2),
 *   Maybe.map(x => x + 1),
 *   Maybe.getOrElse(() => 0),
 * ); // 6
 * ```
 *
 * @since 0.1.0
 */
type Maybe<A> = Just<A> | Nothing;

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

/**
 * Wrap a value in a `Just`.
 * @since 0.1.0
 */
const just = <A>(value: A): Maybe<A> => ({ _tag: 'Just', value });

/**
 * The singleton `Nothing` value.
 * @since 0.1.0
 */
const nothing: Maybe<never> = { _tag: 'Nothing' };

/**
 * Create a `Maybe` from a nullable value. Returns `Nothing` for `null`/`undefined`.
 *
 * @example
 * ```ts
 * Maybe.fromNullable(42);        // Just(42)
 * Maybe.fromNullable(null);      // Nothing
 * Maybe.fromNullable(undefined); // Nothing
 * ```
 *
 * @since 0.1.0
 */
const fromNullable = <A>(value: A | null | undefined): Maybe<NonNullable<A>> =>
  value == null ? nothing : just(value);

/**
 * Create a `Maybe` from a predicate. Returns `Just(a)` if the predicate
 * holds, `Nothing` otherwise. Supports type-narrowing refinements.
 *
 * @example
 * ```ts
 * const positive = Maybe.fromPredicate((n: number) => n > 0);
 * positive(5);  // Just(5)
 * positive(-1); // Nothing
 * ```
 *
 * @since 0.1.0
 */
const fromPredicate: {
  <A, B extends A>(refinement: Refinement<A, B>): (a: A) => Maybe<B>;
  <A>(predicate: Predicate<A>): (a: A) => Maybe<A>;
} =
  <A>(predicate: Predicate<A>) =>
  (a: A): Maybe<A> =>
    predicate(a) ? just(a) : nothing;

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

/**
 * Type guard that returns `true` if the Maybe is a `Just`.
 * @since 0.1.0
 */
const isJust = <A>(ma: Maybe<A>): ma is Just<A> => ma._tag === 'Just';

/**
 * Type guard that returns `true` if the Maybe is `Nothing`.
 * @since 0.1.0
 */
const isNothing = <A>(ma: Maybe<A>): ma is Nothing => ma._tag === 'Nothing';

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

/**
 * Transform the value inside a `Just`, or pass `Nothing` through.
 * @since 0.1.0
 */
const map =
  <A, B>(f: (a: A) => B) =>
  (ma: Maybe<A>): Maybe<B> =>
    isJust(ma) ? just(f(ma.value)) : nothing;

/**
 * Apply a function inside a `Just` to a value inside another `Just`.
 * @since 0.1.0
 */
const ap =
  <A, B>(fab: Maybe<(a: A) => B>) =>
  (ma: Maybe<A>): Maybe<B> =>
    isJust(fab) ? map(fab.value)(ma) : nothing;

/**
 * Alias for {@link just}. Lifts a pure value into `Maybe`.
 * @since 0.1.0
 */
const of = just;

/**
 * Sequence a Maybe-producing function over a Maybe value.
 * Returns `Nothing` if the input is `Nothing`, or applies `f` to the inner value.
 * @since 0.1.0
 */
const chain =
  <A, B>(f: (a: A) => Maybe<B>) =>
  (ma: Maybe<A>): Maybe<B> =>
    isJust(ma) ? f(ma.value) : nothing;

/**
 * Return the first `Maybe` if it is `Just`, otherwise evaluate and return the second.
 * @since 0.1.0
 */
const alt =
  <A>(second: Lazy<Maybe<A>>) =>
  (first: Maybe<A>): Maybe<A> =>
    isJust(first) ? first : second();

/**
 * Eliminate a `Maybe` by providing handlers for both cases.
 *
 * @example
 * ```ts
 * pipe(Maybe.just(5), Maybe.fold(() => 'none', x => `got ${x}`)); // 'got 5'
 * ```
 *
 * @since 0.1.0
 */
const fold =
  <A, B>(onNothing: Lazy<B>, onJust: (a: A) => B) =>
  (ma: Maybe<A>): B =>
    isJust(ma) ? onJust(ma.value) : onNothing();

/**
 * Extract the value from a `Just`, or return a fallback for `Nothing`.
 * @since 0.1.0
 */
const getOrElse =
  <A>(fallback: Lazy<A>) =>
  (ma: Maybe<A>): A =>
    isJust(ma) ? ma.value : fallback();

/**
 * Reduce a `Maybe` to a single value.
 * @since 0.1.0
 */
const reduce =
  <A, B>(f: (acc: B, a: A) => B, seed: B) =>
  (ma: Maybe<A>): B =>
    isJust(ma) ? f(seed, ma.value) : seed;

/**
 * Convert a `Maybe` to a nullable value (`null` for `Nothing`).
 * @since 0.1.0
 */
const toNullable = <A>(ma: Maybe<A>): A | null => (isJust(ma) ? ma.value : null);

/**
 * Convert a `Maybe` to an optional value (`undefined` for `Nothing`).
 * @since 0.1.0
 */
const toUndefined = <A>(ma: Maybe<A>): A | undefined => (isJust(ma) ? ma.value : undefined);

// ---------------------------------------------------------------------------
// Typeclass instances
// ---------------------------------------------------------------------------

const URI = MaybeURI;

const Functor = { URI, map } as const;
const Applicative = { URI, map, ap, of } as const;
const Monad = { URI, map, ap, of, chain } as const;
const Foldable = { reduce } as const;
const Alt = { URI, map, alt } as const;

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export {
  type Maybe,
  type Just,
  type Nothing,
  MaybeURI as URI,
  just,
  nothing,
  fromNullable,
  fromPredicate,
  isJust,
  isNothing,
  map,
  ap,
  of,
  chain,
  alt,
  fold,
  getOrElse,
  reduce,
  toNullable,
  toUndefined,
  Functor,
  Applicative,
  Monad,
  Foldable,
  Alt,
};
