/**
 * Swap the first two arguments of a curried function.
 *
 * @param f - A curried binary function `(a) => (b) => c`
 * @returns A new function `(b) => (a) => c`
 *
 * @example
 * ```ts
 * import { flip } from 'catena';
 *
 * const prepend = (prefix: string) => (body: string) => prefix + body;
 * const append = flip(prepend);
 * append('world')('hello '); // 'hello world'
 * ```
 *
 * @since 0.1.0
 */
export const flip =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  (b: B) =>
  (a: A): C =>
    f(a)(b);
