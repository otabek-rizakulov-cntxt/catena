/** A deferred computation that produces `A`. */
export type Lazy<A> = () => A;

/** A function that tests a value of type `A`. */
export type Predicate<A> = (a: A) => boolean;

/** A narrowing predicate that refines `A` to `B`. */
export type Refinement<A, B extends A> = (a: A) => a is B;

/** A function from `A` to `A`. */
export type Endomorphism<A> = (a: A) => A;

/** A generic N-ary function type. */
export type FunctionN<Args extends readonly unknown[], R> = (...args: Args) => R;
