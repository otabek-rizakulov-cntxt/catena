import type { Either } from '../core/Either/Either';
import { left, right } from '../core/Either/Either';

/** Wrap a throwing function into an Either. */
export const tryCatch = <A>(f: () => A): Either<unknown, A> => {
  try {
    return right(f());
  } catch (e: unknown) {
    return left(e);
  }
};

/** Wrap a throwing function into an Either with a mapped error. */
export const tryCatchK =
  <E>(onError: (error: unknown) => E) =>
  <A>(f: () => A): Either<E, A> => {
    try {
      return right(f());
    } catch (e: unknown) {
      return left(onError(e));
    }
  };
