import type { Predicate } from '../types/utils';

/** Apply `onTrue` or `onFalse` depending on the predicate result. @since 0.1.0 */
export const ifElse =
  <A, B>(predicate: Predicate<A>, onTrue: (a: A) => B, onFalse: (a: A) => B) =>
  (a: A): B =>
    predicate(a) ? onTrue(a) : onFalse(a);
