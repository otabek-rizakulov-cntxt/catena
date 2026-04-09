/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */

/**
 * Pipes a value through a sequence of functions left-to-right.
 *
 * This is the primary composition tool in catena. Pass an initial value
 * followed by up to 9 unary functions — each receives the output of the
 * previous one. All types are inferred automatically.
 *
 * @param a - The initial value
 * @returns The result of threading `a` through every function
 *
 * @example
 * ```ts
 * import { pipe, Maybe } from 'catena';
 *
 * // Simple value transformation
 * pipe(5, x => x + 1, x => x * 2); // 12
 *
 * // Composing ADT operations
 * pipe(
 *   Maybe.fromNullable(user.name),
 *   Maybe.map(s => s.trim()),
 *   Maybe.getOrElse(() => 'Anonymous'),
 * );
 * ```
 *
 * @since 0.1.0
 */
export function pipe<A>(a: A): A;
export function pipe<A, B>(a: A, ab: (a: A) => B): B;
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
export function pipe<A, B, C, D>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D;
export function pipe<A, B, C, D, E>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): E;
export function pipe<A, B, C, D, E, F>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): F;
export function pipe<A, B, C, D, E, F, G>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): G;
export function pipe<A, B, C, D, E, F, G, H>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
): H;
export function pipe<A, B, C, D, E, F, G, H, I>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
): I;
export function pipe(a: any, ...fns: Array<(a: any) => any>): any {
  return fns.reduce((acc, fn) => fn(acc), a);
}
