import type { Endomorphism, Predicate } from '../types/utils';

/** Apply `f` only when the predicate does NOT hold, otherwise return the value unchanged. @since 0.1.0 */
export const unless =
  <A>(predicate: Predicate<A>, f: Endomorphism<A>) =>
  (a: A): A =>
    predicate(a) ? a : f(a);
