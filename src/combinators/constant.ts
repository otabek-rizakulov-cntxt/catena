/** Returns a function that always returns `a`, ignoring its argument. */
export const constant =
  <A>(a: A) =>
  (_b: unknown): A =>
    a;
