import type { Predicate } from '../types/utils';

/** Negates a predicate. @since 0.1.0 */
export const not =
  <A>(predicate: Predicate<A>): Predicate<A> =>
  (a) =>
    !predicate(a);
