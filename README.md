# catena

A strongly-typed functional programming library for TypeScript.

[![CI](https://github.com/<owner>/catena/actions/workflows/ci.yml/badge.svg)](https://github.com/<owner>/catena/actions)
[![npm](https://img.shields.io/npm/v/catena)](https://www.npmjs.com/package/catena)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- Algebraic data types: `Maybe`, `Either`, `IO`, `Reader`, `Async`
- Typeclass hierarchy: `Functor`, `Applicative`, `Monad`, and more
- Type-safe `pipe` and `compose` with full inference
- Tree-shakeable ESM + CJS dual output
- Zero dependencies

## Install

```bash
npm install catena
```

## Quick start

```ts
import { pipe, Maybe, Either } from 'catena';

// Thread a value through transformations
pipe(5, x => x + 1, x => x * 2); // 12

// Handle optional values safely
pipe(
  Maybe.fromNullable(process.env.PORT),
  Maybe.map(Number),
  Maybe.getOrElse(() => 3000),
);

// Typed error handling
const parseJSON = (s: string) =>
  Either.tryCatch(
    () => JSON.parse(s) as unknown,
    e => (e instanceof Error ? e.message : 'Parse error'),
  );

pipe(
  parseJSON('{"ok":true}'),
  Either.map(val => val),
  Either.fold(err => `Error: ${err}`, val => `Parsed: ${JSON.stringify(val)}`),
);
```

### Algebraic structures

```ts
import { SemigroupSum, MonoidString, foldMap } from 'catena';

SemigroupSum.concat(3, 4); // 7

foldMap(MonoidString)(String)([1, 2, 3]); // '123'
```

### Predicates & helpers

```ts
import { isNil, not, safe, pipe, Maybe } from 'catena';

const isDefined = not(isNil);
isDefined('hello'); // true

pipe(
  safe((n: number) => n > 0)(-5),
  Maybe.getOrElse(() => 0),
); // 0
```

## Documentation

- [Getting Started](docs/getting-started.md) — installation, core concepts, first examples
- [API Reference](docs/api/) — auto-generated from TSDoc (`npm run docs`)
- [Example files](docs/examples/) — runnable TypeScript scripts

## Roadmap

| Status | Phase | Description |
|--------|-------|-------------|
| ✅ | Foundation | TypeScript setup, CI, HKT encoding |
| ✅ | Core Types | HKT, typeclasses, pipe, compose, identity |
| ✅ | Core ADTs | Maybe, Either, IO, Reader, Async |
| ✅ | Algebra & Helpers | Semigroup, Monoid, curry, predicates, helpers |
| ✅ | Testing | Property-based tests, law verification (303 tests) |
| ✅ | Docs | TSDoc on all exports, TypeDoc, guides & examples |
| 📋 | Optimize | Bundle size, tree-shaking, benchmarks |
| 📋 | Release | Versioning, migration guide, npm publish |
| 📋 | Community | Contributor guidelines, good first issues |

Legend: ✅ Done · 🚧 In Progress · 📋 Planned

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for setup instructions and guidelines.

## License

[MIT](LICENSE)
