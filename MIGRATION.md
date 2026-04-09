# Migration Guide

This guide helps users migrating from **crocks**, **sanctuary**, **fp-ts**, or similar functional programming libraries to **catena**.

## General principles

- catena uses a **pipe-first** style — data flows through `pipe()` left-to-right
- ADTs are namespaced modules: `Maybe.map(...)`, `Either.fold(...)`
- All functions are curried and designed for partial application
- TypeScript types are inferred automatically — explicit annotations are rarely needed

## From crocks

### Maybe

```ts
// crocks
const { Maybe, safe, isNumber } = require('crocks');
safe(isNumber)(42); // Just(42)

// catena
import { safe, isNumber, Maybe, pipe } from 'catena';
safe(isNumber)(42); // Maybe<number> — Just(42)
```

### Either / Result

```ts
// crocks
const { Result, tryCatch } = require('crocks');
tryCatch(() => JSON.parse(data));

// catena
import { Either } from 'catena';
Either.tryCatch(
  () => JSON.parse(data) as unknown,
  e => (e instanceof Error ? e.message : 'parse error'),
);
```

Key difference: catena's `Either.tryCatch` requires an explicit error mapper — no silent `toString()`.

### pipe / compose

```ts
// crocks
const { compose, pipe } = require('crocks');

// catena — identical API
import { pipe, compose } from 'catena';
pipe(5, x => x + 1, x => x * 2); // 12
```

## From fp-ts

### Namespace style

```ts
// fp-ts
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
pipe(O.some(42), O.map(x => x + 1));

// catena — similar pattern
import { pipe, Maybe } from 'catena';
pipe(Maybe.just(42), Maybe.map(x => x + 1));
```

### Naming differences

| fp-ts | catena | Notes |
|-------|--------|-------|
| `Option` | `Maybe` | `Some` → `Just`, `None` → `Nothing` |
| `Either` | `Either` | Same concept, same naming |
| `Task` | `Async` | catena's `Async` carries typed errors `Async<E, A>` |
| `IO` | `IO` | Identical concept |
| `Reader` | `Reader` | Identical concept |
| `Eq` | `Setoid` | Fantasy Land naming |
| `Ord` | `Ord` | Same |
| `Semigroup` | `Semigroup` | Same |
| `Monoid` | `Monoid` | Same |

### Key differences from fp-ts

1. **Simpler HKT encoding** — catena uses a minimal URI-indexed approach without requiring `HKT` wrappers
2. **Fewer layers** — no `pipeable` module, everything is already curried and pipe-ready
3. **Smaller bundle** — 3.1 KB gzipped for the full library, fully tree-shakeable
4. **Typed Async errors** — `Async<E, A>` carries the error type (fp-ts `Task` does not)

## From sanctuary

### Maybe / Either

```ts
// sanctuary
S.map(x => x + 1)(S.Just(42));

// catena
Maybe.map(x => x + 1)(Maybe.just(42));
// or with pipe:
pipe(Maybe.just(42), Maybe.map(x => x + 1));
```

### Predicates

```ts
// sanctuary
S.is(Number)(42);

// catena
isNumber(42);
```

## Versioning policy

catena follows [Semantic Versioning](https://semver.org/):

- **0.x.y** — Beta. API may change between minor versions.
- **1.0.0** — Stable release. Breaking changes only in major versions.

During the `0.x` series, pin your dependency to a specific minor version:

```json
"catena": "~0.1.0"
```
