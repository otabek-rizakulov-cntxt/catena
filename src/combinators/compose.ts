/**
 * Right-to-left function composition.
 *
 * Creates a new function by composing the given functions from right to left.
 * The rightmost function is applied first.
 *
 * @returns A new function that is the composition of all arguments
 *
 * @example
 * ```ts
 * import { compose } from 'catena';
 *
 * const double = (x: number) => x * 2;
 * const inc = (x: number) => x + 1;
 * const doubleThenInc = compose(inc, double);
 *
 * doubleThenInc(5); // 11
 * ```
 *
 * @since 0.1.0
 */
export function compose<A, B>(ab: (a: A) => B): (a: A) => B;
export function compose<A, B, C>(bc: (b: B) => C, ab: (a: A) => B): (a: A) => C;
export function compose<A, B, C, D>(cd: (c: C) => D, bc: (b: B) => C, ab: (a: A) => B): (a: A) => D;
export function compose<A, B, C, D, E>(
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
): (a: A) => E;
export function compose<A, B, C, D, E, F>(
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
): (a: A) => F;
export function compose<A, B, C, D, E, F, G>(
  fg: (f: F) => G,
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
): (a: A) => G;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compose(...fns: Array<(a: any) => any>): (a: unknown) => unknown {
  return (a) => fns.reduceRight((acc, fn) => fn(acc), a);
}
