import type { Setoid } from './Setoid';

export type Ordering = -1 | 0 | 1;

/**
 * An Ord provides a total ordering over values of type `A`.
 *
 * Laws:
 * - Totality: `compare(a, b)` always returns -1, 0, or 1
 * - Antisymmetry: if `compare(a, b) <= 0` and `compare(b, a) <= 0` then `equals(a, b)`
 * - Transitivity: if `compare(a, b) <= 0` and `compare(b, c) <= 0` then `compare(a, c) <= 0`
 */
export interface Ord<A> extends Setoid<A> {
  readonly compare: (x: A, y: A) => Ordering;
}

export const fromCompare = <A>(compare: (x: A, y: A) => Ordering): Ord<A> => ({
  equals: (x, y) => compare(x, y) === 0,
  compare,
});

export const OrdNumber: Ord<number> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0));

export const OrdString: Ord<string> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0));

export const OrdBoolean: Ord<boolean> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0));

export const min =
  <A>(O: Ord<A>) =>
  (x: A, y: A): A =>
    O.compare(x, y) <= 0 ? x : y;

export const max =
  <A>(O: Ord<A>) =>
  (x: A, y: A): A =>
    O.compare(x, y) >= 0 ? x : y;

export const clamp =
  <A>(O: Ord<A>) =>
  (low: A, high: A) =>
  (value: A): A =>
    max(O)(low, min(O)(high, value));
