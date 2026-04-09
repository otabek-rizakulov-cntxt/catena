/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

/** Curry a 2-argument function. */
export function curry<A, B, R>(f: (a: A, b: B) => R): (a: A) => (b: B) => R;
/** Curry a 3-argument function. */
export function curry<A, B, C, R>(f: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R;
/** Curry a 4-argument function. */
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
