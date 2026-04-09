import type { Either } from '../core/Either/Either';
import { left, right } from '../core/Either/Either';

/** Wrap a throwing function into an Either. @since 0.1.0 */
export const tryCatch = <A>(f: () => A): Either<unknown, A> => {
  try {
    return right(f());
  } catch (e: unknown) {
    return left(e);
  }
};

/** Wrap a throwing function into an Either with a mapped error. @since 0.1.0 */
export const tryCatchK =
  <E>(onError: (error: unknown) => E) =>
  <A>(f: () => A): Either<E, A> => {
    try {
      return right(f());
    } catch (e: unknown) {
      return left(onError(e));
    }
  };
