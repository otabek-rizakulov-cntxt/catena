/**
 * A Semigroup defines an associative binary operation `concat`.
 *
 * Laws:
 * - Associativity: `concat(concat(a, b), c) === concat(a, concat(b, c))`
 */
export interface Semigroup<A> {
  readonly concat: (x: A, y: A) => A;
}

/** Concatenate all values in a non-empty array using the given Semigroup. */
export const concatAll =
  <A>(S: Semigroup<A>) =>
  (startWith: A) =>
  (values: readonly A[]): A =>
    values.reduce(S.concat, startWith);

export const SemigroupSum: Semigroup<number> = { concat: (x, y) => x + y };

export const SemigroupProduct: Semigroup<number> = { concat: (x, y) => x * y };

export const SemigroupString: Semigroup<string> = { concat: (x, y) => x + y };

export const SemigroupAll: Semigroup<boolean> = { concat: (x, y) => x && y };

export const SemigroupAny: Semigroup<boolean> = { concat: (x, y) => x || y };

export const getSemigroupArray = <A>(): Semigroup<A[]> => ({
  concat: (x, y) => [...x, ...y],
});
