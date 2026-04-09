/**
 * A Setoid provides equality testing between values of the same type.
 *
 * Laws:
 * - Reflexivity:  `equals(a, a) === true`
 * - Symmetry:     `equals(a, b) === equals(b, a)`
 * - Transitivity: if `equals(a, b)` and `equals(b, c)` then `equals(a, c)`
 */
export interface Setoid<A> {
  readonly equals: (x: A, y: A) => boolean;
}

export const SetoidStrict: Setoid<unknown> = { equals: (x, y) => x === y };

export const SetoidNumber: Setoid<number> = { equals: (x, y) => x === y };

export const SetoidString: Setoid<string> = { equals: (x, y) => x === y };

export const SetoidBoolean: Setoid<boolean> = { equals: (x, y) => x === y };

export const getSetoidArray = <A>(S: Setoid<A>): Setoid<A[]> => ({
  equals: (x, y) => {
    if (x.length !== y.length) return false;
    for (let i = 0; i < x.length; i++) {
      if (!S.equals(x[i] as A, y[i] as A)) return false;
    }
    return true;
  },
});
