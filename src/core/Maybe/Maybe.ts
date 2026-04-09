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

interface Just<A> {
  readonly _tag: 'Just';
  readonly value: A;
}

interface Nothing {
  readonly _tag: 'Nothing';
}

type Maybe<A> = Just<A> | Nothing;

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

const just = <A>(value: A): Maybe<A> => ({ _tag: 'Just', value });

const nothing: Maybe<never> = { _tag: 'Nothing' };

const fromNullable = <A>(value: A | null | undefined): Maybe<NonNullable<A>> =>
  value == null ? nothing : just(value);

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

const isJust = <A>(ma: Maybe<A>): ma is Just<A> => ma._tag === 'Just';

const isNothing = <A>(ma: Maybe<A>): ma is Nothing => ma._tag === 'Nothing';

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

const map =
  <A, B>(f: (a: A) => B) =>
  (ma: Maybe<A>): Maybe<B> =>
    isJust(ma) ? just(f(ma.value)) : nothing;

const ap =
  <A, B>(fab: Maybe<(a: A) => B>) =>
  (ma: Maybe<A>): Maybe<B> =>
    isJust(fab) ? map(fab.value)(ma) : nothing;

const of = just;

const chain =
  <A, B>(f: (a: A) => Maybe<B>) =>
  (ma: Maybe<A>): Maybe<B> =>
    isJust(ma) ? f(ma.value) : nothing;

const alt =
  <A>(second: Lazy<Maybe<A>>) =>
  (first: Maybe<A>): Maybe<A> =>
    isJust(first) ? first : second();

const fold =
  <A, B>(onNothing: Lazy<B>, onJust: (a: A) => B) =>
  (ma: Maybe<A>): B =>
    isJust(ma) ? onJust(ma.value) : onNothing();

const getOrElse =
  <A>(fallback: Lazy<A>) =>
  (ma: Maybe<A>): A =>
    isJust(ma) ? ma.value : fallback();

const reduce =
  <A, B>(f: (acc: B, a: A) => B, seed: B) =>
  (ma: Maybe<A>): B =>
    isJust(ma) ? f(seed, ma.value) : seed;

const toNullable = <A>(ma: Maybe<A>): A | null => (isJust(ma) ? ma.value : null);

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
