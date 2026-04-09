/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

/**
 * Transform a multi-argument function into a sequence of unary functions.
 *
 * Supports functions with 2–4 parameters. Each call returns a new function
 * that accepts the next argument until all arguments are collected.
 *
 * @param f - A function with 2–4 parameters
 * @returns A curried version of `f`
 *
 * @example
 * ```ts
 * import { curry } from 'catena';
 *
 * const add = curry((a: number, b: number) => a + b);
 * const inc = add(1);
 * inc(5); // 6
 * ```
 *
 * @since 0.1.0
 */
export function curry<A, B, R>(f: (a: A, b: B) => R): (a: A) => (b: B) => R;
export function curry<A, B, C, R>(f: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R;
export function curry<A, B, C, D, R>(
  f: (a: A, b: B, c: C, d: D) => R,
): (a: A) => (b: B) => (c: C) => (d: D) => R;
export function curry(f: (...args: any[]) => any): any {
  const arity = f.length;
  const go =
    (collected: any[]): any =>
    (next: any): any => {
      const args = [...collected, next];
      return args.length >= arity ? f(...args) : go(args);
    };
  return go([]);
}
