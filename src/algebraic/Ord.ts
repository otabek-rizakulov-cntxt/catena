import type { Setoid } from './Setoid';

/** Comparison outcome: less than (-1), equal (0), or greater than (1). @since 0.1.0 */
export type Ordering = -1 | 0 | 1;

/**
 * An Ord provides a total ordering over values of type `A`.
 *
 * Laws:
 * - Totality: `compare(a, b)` always returns -1, 0, or 1
 * - Antisymmetry: if `compare(a, b) <= 0` and `compare(b, a) <= 0` then `equals(a, b)`
 * - Transitivity: if `compare(a, b) <= 0` and `compare(b, c) <= 0` then `compare(a, c) <= 0`
 *
 * @since 0.1.0
 */
export interface Ord<A> extends Setoid<A> {
  readonly compare: (x: A, y: A) => Ordering;
}

/** Build an Ord from a `compare` function (equality is `compare === 0`). @since 0.1.0 */
export const fromCompare = <A>(compare: (x: A, y: A) => Ordering): Ord<A> => ({
  equals: (x, y) => compare(x, y) === 0,
  compare,
});

/** Standard numeric ordering. @since 0.1.0 */
export const OrdNumber: Ord<number> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0));

/** Lexicographic string ordering. @since 0.1.0 */
export const OrdString: Ord<string> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0));

/** Boolean ordering (`false` < `true`). @since 0.1.0 */
export const OrdBoolean: Ord<boolean> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0));

/** Lesser of two values by the given Ord. @since 0.1.0 */
export const min =
  <A>(O: Ord<A>) =>
  (x: A, y: A): A =>
    O.compare(x, y) <= 0 ? x : y;

/** Greater of two values by the given Ord. @since 0.1.0 */
export const max =
  <A>(O: Ord<A>) =>
  (x: A, y: A): A =>
    O.compare(x, y) >= 0 ? x : y;

/** Clamp a value to the inclusive range `[low, high]` using the given Ord. @since 0.1.0 */
export const clamp =
  <A>(O: Ord<A>) =>
  (low: A, high: A) =>
  (value: A): A =>
    max(O)(low, min(O)(high, value));
