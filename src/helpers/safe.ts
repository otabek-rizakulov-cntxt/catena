import type { Predicate, Refinement } from '../types/utils';
import type { Maybe } from '../core/Maybe/Maybe';
import { just, nothing } from '../core/Maybe/Maybe';

/** Lift a value into Maybe based on a predicate. @since 0.1.0 */
export const safe: {
  <A, B extends A>(refinement: Refinement<A, B>): (a: A) => Maybe<B>;
  <A>(predicate: Predicate<A>): (a: A) => Maybe<A>;
} =
  <A>(predicate: Predicate<A>) =>
  (a: A): Maybe<A> =>
    predicate(a) ? just(a) : nothing;
