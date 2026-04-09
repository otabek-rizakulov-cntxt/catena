# Getting Started with catena

## Installation

```bash
npm install catena
```

catena ships ESM, CommonJS, and full TypeScript declarations — no extra setup needed.

## Core concept: `pipe`

Everything in catena is designed around **pipe** — threading a value through a sequence of functions:

```ts
import { pipe } from 'catena';

const result = pipe(
  '  Hello, World!  ',
  s => s.trim(),
  s => s.toLowerCase(),
  s => s.replace(/\s+/g, '-'),
);
// 'hello,-world!'
```

Each function receives the output of the previous one. Types flow automatically.

## Working with Maybe

`Maybe<A>` replaces `null`/`undefined` with a composable type:

```ts
import { pipe, Maybe } from 'catena';

// Wrap a nullable value
const name = Maybe.fromNullable(getUserName()); // Maybe<string>

// Transform if present
const greeting = pipe(
  name,
  Maybe.map(n => `Hello, ${n}!`),
  Maybe.getOrElse(() => 'Hello, stranger!'),
);
```

### Chaining Maybe operations

```ts
const safeDivide = (a: number, b: number): Maybe.Maybe<number> =>
  b === 0 ? Maybe.nothing : Maybe.just(a / b);

const result = pipe(
  Maybe.just(100),
  Maybe.chain(x => safeDivide(x, 4)),
  Maybe.chain(x => safeDivide(x, 5)),
  Maybe.getOrElse(() => 0),
);
// 5
```

## Working with Either

`Either<E, A>` represents a computation that can fail with a typed error:

```ts
import { pipe, Either } from 'catena';

const parseJSON = (s: string): Either.Either<string, unknown> =>
  Either.tryCatch(
    () => JSON.parse(s) as unknown,
    e => (e instanceof Error ? e.message : 'Parse error'),
  );

const result = pipe(
  parseJSON('{"name":"catena"}'),
  Either.map(obj => obj),
  Either.fold(
    err => `Error: ${err}`,
    val => `Parsed: ${JSON.stringify(val)}`,
  ),
);
```

## Composition utilities

```ts
import { compose, curry, flip, constant } from 'catena';

// compose: right-to-left
const shout = compose(
  (s: string) => s + '!',
  (s: string) => s.toUpperCase(),
);
shout('hello'); // 'HELLO!'

// curry: make a multi-arg function chainable
const add = curry((a: number, b: number) => a + b);
const inc = add(1);
inc(5); // 6

// constant: always return the same value
[1, 2, 3].map(constant(0)); // [0, 0, 0]
```

## Predicates

```ts
import { isNil, isNumber, isString, not } from 'catena';

isNil(null);       // true
isNil(0);          // false
isNumber(42);      // true
isNumber(NaN);     // false (only finite numbers)

const isDefined = not(isNil);
isDefined('hello'); // true
```

## Next steps

- Browse the [API reference](./api/) for all available functions
- Check out the [example files](./examples/) for real-world patterns
- Read the [CONTRIBUTING guide](../.github/CONTRIBUTING.md) to get involved
