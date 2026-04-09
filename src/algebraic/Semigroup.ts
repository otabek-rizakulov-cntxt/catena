/**
 * A Semigroup defines an associative binary operation `concat`.
 *
 * Laws:
 * - Associativity: `concat(concat(a, b), c) === concat(a, concat(b, c))`
 *
 * @since 0.1.0
 */
export interface Semigroup<A> {
  readonly concat: (x: A, y: A) => A;
}

/** Concatenate all values in a non-empty array using the given Semigroup. @since 0.1.0 */
export const concatAll =
  <A>(S: Semigroup<A>) =>
  (startWith: A) =>
  (values: readonly A[]): A =>
    values.reduce(S.concat, startWith);

/** Semigroup under numeric addition. @since 0.1.0 */
export const SemigroupSum: Semigroup<number> = { concat: (x, y) => x + y };

/** Semigroup under numeric multiplication. @since 0.1.0 */
export const SemigroupProduct: Semigroup<number> = { concat: (x, y) => x * y };

/** Semigroup under string concatenation. @since 0.1.0 */
export const SemigroupString: Semigroup<string> = { concat: (x, y) => x + y };

/** Semigroup under logical AND. @since 0.1.0 */
export const SemigroupAll: Semigroup<boolean> = { concat: (x, y) => x && y };

/** Semigroup under logical OR. @since 0.1.0 */
export const SemigroupAny: Semigroup<boolean> = { concat: (x, y) => x || y };

/** Lift a Semigroup to arrays by concatenation. @since 0.1.0 */
export const getSemigroupArray = <A>(): Semigroup<A[]> => ({
  concat: (x, y) => [...x, ...y],
});
