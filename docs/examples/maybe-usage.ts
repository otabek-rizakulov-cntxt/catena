/**
 * Maybe usage examples — safe handling of optional values.
 *
 * Run with: npx tsx docs/examples/maybe-usage.ts
 */
import { pipe, Maybe } from '../../src';

// 1. fromNullable — wrapping potentially null values
const lookup = (key: string): string | undefined => {
  const db: Record<string, string> = { name: 'catena', version: '0.1.0' };
  return db[key];
};

const name = pipe(
  Maybe.fromNullable(lookup('name')),
  Maybe.map((s) => s.toUpperCase()),
  Maybe.getOrElse(() => 'UNKNOWN'),
);
console.log('Name:', name); // Name: CATENA

const missing = pipe(
  Maybe.fromNullable(lookup('author')),
  Maybe.map((s) => s.toUpperCase()),
  Maybe.getOrElse(() => 'UNKNOWN'),
);
console.log('Author:', missing); // Author: UNKNOWN

// 2. fromPredicate — conditional lifting
const safeParseInt = (s: string): Maybe.Maybe<number> =>
  pipe(
    parseInt(s, 10),
    Maybe.fromPredicate((n) => !isNaN(n)),
  );

console.log('Parse "42":', Maybe.toNullable(safeParseInt('42'))); // 42
console.log('Parse "abc":', Maybe.toNullable(safeParseInt('abc'))); // null

// 3. chain — sequential optional operations
const safeSqrt = (n: number): Maybe.Maybe<number> =>
  n >= 0 ? Maybe.just(Math.sqrt(n)) : Maybe.nothing;

const result = pipe(
  safeParseInt('16'),
  Maybe.chain(safeSqrt),
  Maybe.fold(
    () => 'Could not compute',
    (n) => `Square root is ${n}`,
  ),
);
console.log(result); // Square root is 4
