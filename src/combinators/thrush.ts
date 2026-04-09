/**
 * Apply a value to a function. Also known as the T combinator (thrush).
 *
 * @param a - The value to apply
 * @returns A function that accepts a unary function and applies `a` to it
 *
 * @example
 * ```ts
 * import { thrush } from 'catena';
 *
 * const applyTo5 = thrush(5);
 * applyTo5(x => x * 2); // 10
 * applyTo5(x => x + 1); // 6
 * ```
 *
 * @since 0.1.0
 */
export const thrush =
  <A>(a: A) =>
  <B>(f: (a: A) => B): B =>
    f(a);
