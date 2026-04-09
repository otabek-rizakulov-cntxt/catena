# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-beta.1] — 2026-04-09

### Added

**Core ADTs**
- `Maybe<A>` — `Just` / `Nothing` with `map`, `chain`, `ap`, `fold`, `alt`, `getOrElse`, `fromNullable`, `fromPredicate`, `toNullable`, `toUndefined`
- `Either<E, A>` — `Left` / `Right` with `map`, `mapLeft`, `bimap`, `chain`, `ap`, `fold`, `getOrElse`, `swap`, `fromNullable`, `tryCatch`
- `IO<A>` — lazy synchronous computation with `map`, `chain`, `ap`, `flatten`, `run`
- `Reader<R, A>` — environment-dependent computation with `map`, `chain`, `ap`, `ask`, `asks`, `local`, `run`
- `Async<E, A>` — lazy asynchronous computation with `map`, `mapError`, `bimap`, `chain`, `ap`, `fold`, `run`, `runPromise`, `fromPromise`, `tryCatch`

**Typeclass hierarchy**
- HKT encoding via URI-indexed interfaces (`URItoKind`, `URItoKind2`)
- `Functor`, `Apply`, `Applicative`, `Chain`, `Monad`, `Foldable`, `Alt`, `Bifunctor`

**Combinators**
- `pipe` (up to 9 functions), `compose` (up to 6 functions)
- `identity`, `curry` (2–4 args), `flip`, `constant`, `thrush`

**Algebraic structures**
- `Semigroup` + instances: `SemigroupSum`, `SemigroupProduct`, `SemigroupString`, `SemigroupAll`, `SemigroupAny`, `getSemigroupArray`
- `Monoid` + instances: `MonoidSum`, `MonoidProduct`, `MonoidString`, `MonoidAll`, `MonoidAny`, `getMonoidArray`
- `Setoid` + instances: `SetoidStrict`, `SetoidNumber`, `SetoidString`, `SetoidBoolean`, `getSetoidArray`
- `Ord` + instances: `OrdNumber`, `OrdString`, `OrdBoolean`, `min`, `max`, `clamp`, `fromCompare`
- Utilities: `concatAll`, `foldMap`

**Predicates**
- `isNil`, `isString`, `isNumber`, `isBoolean`, `isFunction`, `isArray`, `isObject`, `not`

**Helpers**
- `ifElse`, `when`, `unless`, `safe`, `tryCatch`, `tryCatchK`

**Infrastructure**
- TypeScript strict mode with ESM + CJS dual output via tsup
- 303 unit + property-based tests at 100% coverage
- TSDoc on every public export, TypeDoc API generation
- GitHub Actions CI (lint, typecheck, test, build)
- Benchmarks, bundle analysis (12 KB ESM / 3.1 KB gzip), tree-shaking validation
