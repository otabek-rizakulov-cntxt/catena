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
import { pipe } from 'catena';

const result = pipe(
  5,
  (x) => x + 1,
  (x) => x * 2,
);
// result = 12
```

## Roadmap

| Status | Phase | Description |
|--------|-------|-------------|
| ✅ | Foundation | TypeScript setup, CI, HKT encoding |
| ✅ | Core Types | HKT, typeclasses, pipe, compose, identity |
| ✅ | Core ADTs | Maybe, Either, IO, Reader, Async |
| 🚧 | Algebra & Helpers | Semigroup, Monoid, curry, predicates, helpers |
| 📋 | Testing | Property-based tests, law verification |
| 📋 | Docs | API docs, guides, examples |
| 📋 | Optimize | Bundle size, tree-shaking, benchmarks |
| 📋 | Release | Versioning, migration guide, npm publish |
| 📋 | Community | Contributor guidelines, good first issues |

Legend: ✅ Done · 🚧 In Progress · 📋 Planned

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for setup instructions and guidelines.

## License

[MIT](LICENSE)
