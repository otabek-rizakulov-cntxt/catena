/**
 * A Setoid provides equality testing between values of the same type.
 *
 * Laws:
 * - Reflexivity:  `equals(a, a) === true`
 * - Symmetry:     `equals(a, b) === equals(b, a)`
 * - Transitivity: if `equals(a, b)` and `equals(b, c)` then `equals(a, c)`
 *
 * @since 0.1.0
 */
export interface Setoid<A> {
  readonly equals: (x: A, y: A) => boolean;
}

/** Setoid using JavaScript strict equality (`===`). @since 0.1.0 */
export const SetoidStrict: Setoid<unknown> = { equals: (x, y) => x === y };

/** Setoid for numbers via strict equality. @since 0.1.0 */
export const SetoidNumber: Setoid<number> = { equals: (x, y) => x === y };

/** Setoid for strings via strict equality. @since 0.1.0 */
export const SetoidString: Setoid<string> = { equals: (x, y) => x === y };

/** Setoid for booleans via strict equality. @since 0.1.0 */
export const SetoidBoolean: Setoid<boolean> = { equals: (x, y) => x === y };

/** Pointwise Setoid for arrays from an element Setoid. @since 0.1.0 */
export const getSetoidArray = <A>(S: Setoid<A>): Setoid<A[]> => ({
  equals: (x, y) => {
    if (x.length !== y.length) return false;
    for (let i = 0; i < x.length; i++) {
      if (!S.equals(x[i] as A, y[i] as A)) return false;
    }
    return true;
  },
});
