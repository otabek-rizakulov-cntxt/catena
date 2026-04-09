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

interface Left<E> {
  readonly _tag: 'Left';
  readonly left: E;
}

interface Right<A> {
  readonly _tag: 'Right';
  readonly right: A;
}

type Either<E, A> = Left<E> | Right<A>;

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

const left = <E, A = never>(e: E): Either<E, A> => ({ _tag: 'Left', left: e });

const right = <A, E = never>(a: A): Either<E, A> => ({ _tag: 'Right', right: a });

const of = right;

const fromNullable =
  <E>(onNullable: Lazy<E>) =>
  <A>(value: A | null | undefined): Either<E, NonNullable<A>> =>
    value == null ? left(onNullable()) : right(value);

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

const isLeft = <E, A>(ea: Either<E, A>): ea is Left<E> => ea._tag === 'Left';

const isRight = <E, A>(ea: Either<E, A>): ea is Right<A> => ea._tag === 'Right';

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

const map =
  <A, B>(f: (a: A) => B) =>
  <E>(ea: Either<E, A>): Either<E, B> =>
    isRight(ea) ? right(f(ea.right)) : ea;

const mapLeft =
  <E, G>(f: (e: E) => G) =>
  <A>(ea: Either<E, A>): Either<G, A> =>
    isLeft(ea) ? left(f(ea.left)) : ea;

const bimap =
  <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) =>
  (ea: Either<E, A>): Either<G, B> =>
    isLeft(ea) ? left(f(ea.left)) : right(g(ea.right));

const ap =
  <E, A, B>(fab: Either<E, (a: A) => B>) =>
  (ea: Either<E, A>): Either<E, B> =>
    isLeft(fab) ? fab : map(fab.right)(ea);

const chain =
  <A, E, B>(f: (a: A) => Either<E, B>) =>
  (ea: Either<E, A>): Either<E, B> =>
    isRight(ea) ? f(ea.right) : ea;

const fold =
  <E, A, B>(onLeft: (e: E) => B, onRight: (a: A) => B) =>
  (ea: Either<E, A>): B =>
    isLeft(ea) ? onLeft(ea.left) : onRight(ea.right);

const getOrElse =
  <E, A>(fallback: (e: E) => A) =>
  (ea: Either<E, A>): A =>
    isRight(ea) ? ea.right : fallback(ea.left);

const reduce =
  <A, B>(f: (acc: B, a: A) => B, seed: B) =>
  <E>(ea: Either<E, A>): B =>
    isRight(ea) ? f(seed, ea.right) : seed;

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
