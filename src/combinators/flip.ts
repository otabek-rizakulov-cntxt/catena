/** Swap the first two arguments of a function. */
export const flip =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  (b: B) =>
  (a: A): C =>
    f(a)(b);
