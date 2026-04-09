/**
 * Typeclass interfaces following the Fantasy Land specification.
 *
 * Each interface is parameterized by a URI that maps to a concrete
 * type constructor via the HKT encoding in {@link ./hkt}.
 */

import type { Kind, Kind2, URIS, URIS2 } from './hkt';

// ---------------------------------------------------------------------------
// 1-parameter type constructors (Kind1)
// ---------------------------------------------------------------------------

export interface Functor<F extends URIS> {
  readonly URI: F;
  readonly map: <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>;
}

export interface Apply<F extends URIS> extends Functor<F> {
  readonly ap: <A, B>(fab: Kind<F, (a: A) => B>) => (fa: Kind<F, A>) => Kind<F, B>;
}

export interface Applicative<F extends URIS> extends Apply<F> {
  readonly of: <A>(a: A) => Kind<F, A>;
}

export interface Chain<F extends URIS> extends Apply<F> {
  readonly chain: <A, B>(f: (a: A) => Kind<F, B>) => (fa: Kind<F, A>) => Kind<F, B>;
}

export interface Monad<F extends URIS> extends Applicative<F>, Chain<F> {}

export interface Foldable<F extends URIS> {
  readonly reduce: <A, B>(f: (acc: B, a: A) => B, seed: B) => (fa: Kind<F, A>) => B;
}

export interface Alt<F extends URIS> extends Functor<F> {
  readonly alt: <A>(second: () => Kind<F, A>) => (first: Kind<F, A>) => Kind<F, A>;
}

// ---------------------------------------------------------------------------
// 2-parameter type constructors (Kind2)
// ---------------------------------------------------------------------------

export interface Functor2<F extends URIS2> {
  readonly URI: F;
  readonly map: <E, A, B>(f: (a: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>;
}

export interface Applicative2<F extends URIS2> extends Functor2<F> {
  readonly of: <E = never, A = never>(a: A) => Kind2<F, E, A>;
  readonly ap: <E, A, B>(
    fab: Kind2<F, E, (a: A) => B>,
  ) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>;
}

export interface Monad2<F extends URIS2> extends Applicative2<F> {
  readonly chain: <E, A, B>(
    f: (a: A) => Kind2<F, E, B>,
  ) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>;
}

export interface Bifunctor<F extends URIS2> extends Functor2<F> {
  readonly bimap: <E, A, G, B>(
    f: (e: E) => G,
    g: (a: A) => B,
  ) => (fa: Kind2<F, E, A>) => Kind2<F, G, B>;
}
