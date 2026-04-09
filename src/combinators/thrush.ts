/** Apply a value to a function (the T combinator / thrush). */
export const thrush =
  <A>(a: A) =>
  <B>(f: (a: A) => B): B =>
    f(a);
