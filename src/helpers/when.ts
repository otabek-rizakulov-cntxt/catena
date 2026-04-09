import type { Endomorphism, Predicate } from '../types/utils';

/** Apply `f` only when the predicate holds, otherwise return the value unchanged. @since 0.1.0 */
export const when =
  <A>(predicate: Predicate<A>, f: Endomorphism<A>) =>
  (a: A): A =>
    predicate(a) ? f(a) : a;
