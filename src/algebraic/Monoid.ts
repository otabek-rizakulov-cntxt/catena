import type { Semigroup } from './Semigroup';

/**
 * A Monoid extends Semigroup with an identity element `empty`.
 *
 * Laws:
 * - Right identity: `concat(a, empty) === a`
 * - Left identity:  `concat(empty, a) === a`
 */
export interface Monoid<A> extends Semigroup<A> {
  readonly empty: A;
}

/** Fold all values using a Monoid, starting from `empty`. */
export const foldMap =
  <A, M>(M: Monoid<M>, f: (a: A) => M) =>
  (values: readonly A[]): M =>
    values.reduce((acc, a) => M.concat(acc, f(a)), M.empty);

export const MonoidSum: Monoid<number> = { concat: (x, y) => x + y, empty: 0 };

export const MonoidProduct: Monoid<number> = { concat: (x, y) => x * y, empty: 1 };

export const MonoidString: Monoid<string> = { concat: (x, y) => x + y, empty: '' };

export const MonoidAll: Monoid<boolean> = { concat: (x, y) => x && y, empty: true };

export const MonoidAny: Monoid<boolean> = { concat: (x, y) => x || y, empty: false };

export const getMonoidArray = <A>(): Monoid<A[]> => ({
  concat: (x, y) => [...x, ...y],
  empty: [],
});
