import { bench, describe } from 'vitest';
import { pipe, Either } from '../src';

describe('Either — construction', () => {
  bench('right', () => {
    Either.right(42);
  });

  bench('left', () => {
    Either.left('err');
  });

  bench('fromNullable — present', () => {
    Either.fromNullable('was null')(42);
  });

  bench('fromNullable — null', () => {
    Either.fromNullable('was null')(null);
  });

  bench('tryCatch — success', () => {
    Either.tryCatch(
      () => JSON.parse('{"a":1}') as unknown,
      () => 'fail',
    );
  });

  bench('tryCatch — failure', () => {
    Either.tryCatch(
      () => JSON.parse('{bad}') as unknown,
      () => 'fail',
    );
  });
});

describe('Either — pipeline', () => {
  bench('map chain fold — Right path', () => {
    pipe(
      Either.right(10),
      Either.map((x) => x + 1),
      Either.chain((x) => (x > 0 ? Either.right(x * 2) : Either.left('neg' as const))),
      Either.fold(
        (e) => `err: ${e}`,
        (x) => `ok: ${x}`,
      ),
    );
  });

  bench('map chain fold — Left path', () => {
    pipe(
      Either.left('initial') as Either.Either<string, number>,
      Either.map((x) => x + 1),
      Either.chain((x) => (x > 0 ? Either.right(x * 2) : Either.left('neg'))),
      Either.fold(
        (e) => `err: ${e}`,
        (x) => `ok: ${x}`,
      ),
    );
  });

  bench('bimap + swap', () => {
    pipe(
      Either.right(5) as Either.Either<string, number>,
      Either.bimap(
        (e) => e.toUpperCase(),
        (a) => a * 2,
      ),
      Either.swap,
    );
  });
});
