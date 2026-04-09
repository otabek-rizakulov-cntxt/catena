/**
 * Returns a function that always returns `a`, ignoring its argument.
 *
 * Also known as the K combinator.
 *
 * @param a - The value to always return
 * @returns A function that ignores its argument and returns `a`
 *
 * @example
 * ```ts
 * import { constant } from 'catena';
 *
 * [1, 2, 3].map(constant('x')); // ['x', 'x', 'x']
 * ```
 *
 * @since 0.1.0
 */
export const constant =
  <A>(a: A) =>
  (_b: unknown): A =>
    a;
