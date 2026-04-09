# petfp

A strongly-typed functional programming library for TypeScript.

[![CI](https://github.com/otabek-rizakulov-cntxt/petfp/actions/workflows/ci.yml/badge.svg)](https://github.com/otabek-rizakulov-cntxt/petfp/actions)
[![npm](https://img.shields.io/npm/v/petfp)](https://www.npmjs.com/package/petfp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- Algebraic data types: `Maybe`, `Either`, `IO`, `Reader`, `Async`
- Typeclass hierarchy: `Functor`, `Applicative`, `Monad`, and more
- Type-safe `pipe` and `compose` with full inference
- Tree-shakeable ESM + CJS dual output
- Zero dependencies

## Install

```bash
npm install petfp
```

## Quick start

```ts
import { pipe } from 'petfp';

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
| 📋 | Core ADTs | Maybe, Either, IO, Reader, Async |
| 📋 | Algebra | Semigroup, Monoid, Traversable |
| 📋 | Testing | Property-based tests, law verification |
| 📋 | Docs | API docs, guides, examples |
| 📋 | Optimize | Bundle size, tree-shaking, benchmarks |
| 📋 | v1.0 | Stable release |

Legend: ✅ Done · 🚧 In Progress · 📋 Planned

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for setup instructions and guidelines.

## License

[MIT](LICENSE)
