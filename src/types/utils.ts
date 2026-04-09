/** A deferred computation that produces `A`. @since 0.1.0 */
export type Lazy<A> = () => A;

/** A function that tests a value of type `A`. @since 0.1.0 */
export type Predicate<A> = (a: A) => boolean;

/** A narrowing predicate that refines `A` to `B`. @since 0.1.0 */
export type Refinement<A, B extends A> = (a: A) => a is B;

/** A function from `A` to `A`. @since 0.1.0 */
export type Endomorphism<A> = (a: A) => A;

/** A generic N-ary function type. @since 0.1.0 */
export type FunctionN<Args extends readonly unknown[], R> = (...args: Args) => R;
