import type { Predicate } from '../types/utils';

/** Negates a predicate. */
export const not =
  <A>(predicate: Predicate<A>): Predicate<A> =>
  (a) =>
    !predicate(a);
