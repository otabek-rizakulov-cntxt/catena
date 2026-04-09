/**
 * Returns the argument unchanged. The identity function.
 *
 * Useful as a default transformation, or to verify Functor laws.
 *
 * @param a - Any value
 * @returns The same value, unchanged
 *
 * @example
 * ```ts
 * import { identity } from 'catena';
 *
 * identity(42);      // 42
 * identity('hello'); // 'hello'
 * ```
 *
 * @since 0.1.0
 */
export const identity = <A>(a: A): A => a;
