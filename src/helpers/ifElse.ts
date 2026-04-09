import type { Predicate } from '../types/utils';

/** Apply `onTrue` or `onFalse` depending on the predicate result. */
export const ifElse =
  <A, B>(predicate: Predicate<A>, onTrue: (a: A) => B, onFalse: (a: A) => B) =>
  (a: A): B =>
    predicate(a) ? onTrue(a) : onFalse(a);
