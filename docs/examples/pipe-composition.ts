/**
 * Pipe & composition examples — building data pipelines.
 *
 * Run with: npx tsx docs/examples/pipe-composition.ts
 */
import { pipe, compose, curry, Either } from '../../src';

// 1. pipe — left-to-right data transformation
const processName = (raw: string) =>
  pipe(
    raw,
    (s) => s.trim(),
    (s) => s.toLowerCase(),
    (s) => s.replace(/\s+/g, '-'),
    (s) => s.slice(0, 20),
  );

console.log(processName('  Hello  World  ')); // hello--world

// 2. compose — build reusable transformations
const double = (x: number) => x * 2;
const inc = (x: number) => x + 1;
const square = (x: number) => x * x;

const transform = compose(square, inc, double);
console.log(transform(3)); // (3*2 + 1)^2 = 49

// 3. curry — partial application
const formatPrice = curry((currency: string, decimals: number, amount: number) =>
  `${currency}${amount.toFixed(decimals)}`,
);

const formatUSD = formatPrice('$')(2);
const formatEUR = formatPrice('€')(2);

console.log(formatUSD(19.99)); // $19.99
console.log(formatEUR(24.5)); // €24.50

// 4. Either + pipe — error handling pipeline
const validateAge = (age: number): Either.Either<string, number> =>
  age >= 0 && age <= 150 ? Either.right(age) : Either.left(`Invalid age: ${age}`);

const validateName = (name: string): Either.Either<string, string> =>
  name.trim().length > 0 ? Either.right(name.trim()) : Either.left('Name is required');

const createUser = (name: string, age: number) =>
  pipe(
    validateName(name),
    Either.chain((validName) =>
      pipe(
        validateAge(age),
        Either.map((validAge) => ({ name: validName, age: validAge })),
      ),
    ),
  );

console.log(createUser('Alice', 30)); // { _tag: 'Right', right: { name: 'Alice', age: 30 } }
console.log(createUser('', 30)); // { _tag: 'Left', left: 'Name is required' }
console.log(createUser('Bob', -5)); // { _tag: 'Left', left: 'Invalid age: -5' }
