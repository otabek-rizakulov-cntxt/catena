import type { Semigroup } from './Semigroup';

/**
 * A Monoid extends Semigroup with an identity element `empty`.
 *
 * Laws:
 * - Right identity: `concat(a, empty) === a`
 * - Left identity:  `concat(empty, a) === a`
 *
 * @since 0.1.0
 */
export interface Monoid<A> extends Semigroup<A> {
  readonly empty: A;
}

/** Fold all values using a Monoid, starting from `empty`. @since 0.1.0 */
export const foldMap =
  <A, M>(M: Monoid<M>, f: (a: A) => M) =>
  (values: readonly A[]): M =>
    values.reduce((acc, a) => M.concat(acc, f(a)), M.empty);

/** Monoid under numeric addition with identity 0. @since 0.1.0 */
export const MonoidSum: Monoid<number> = { concat: (x, y) => x + y, empty: 0 };

/** Monoid under numeric multiplication with identity 1. @since 0.1.0 */
export const MonoidProduct: Monoid<number> = { concat: (x, y) => x * y, empty: 1 };

/** Monoid under string concatenation with identity `''`. @since 0.1.0 */
export const MonoidString: Monoid<string> = { concat: (x, y) => x + y, empty: '' };

/** Monoid under logical AND with identity `true`. @since 0.1.0 */
export const MonoidAll: Monoid<boolean> = { concat: (x, y) => x && y, empty: true };

/** Monoid under logical OR with identity `false`. @since 0.1.0 */
export const MonoidAny: Monoid<boolean> = { concat: (x, y) => x || y, empty: false };

/** Lift a Monoid to arrays with concatenation and empty `[]`. @since 0.1.0 */
export const getMonoidArray = <A>(): Monoid<A[]> => ({
  concat: (x, y) => [...x, ...y],
  empty: [],
});
