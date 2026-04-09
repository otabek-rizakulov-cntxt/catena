# Architecture

This document orients contributors to catena's codebase structure and design decisions.

## Directory layout

```
catena/
├── src/
│   ├── types/              # Foundational type system
│   │   ├── hkt.ts          # Higher-Kinded Type encoding (URItoKind)
│   │   ├── typeclass.ts    # Typeclass interfaces (Functor, Monad, ...)
│   │   ├── utils.ts        # Utility types (Lazy, Predicate, ...)
│   │   └── index.ts        # Re-exports
│   ├── core/               # Algebraic Data Types
│   │   ├── Maybe/          # Optional values
│   │   ├── Either/         # Typed error handling
│   │   ├── IO/             # Lazy synchronous computation
│   │   ├── Reader/         # Environment-dependent computation
│   │   └── Async/          # Lazy async computation with typed errors
│   ├── algebraic/          # Algebraic structures
│   │   ├── Semigroup.ts    # Semigroup interface + instances
│   │   ├── Monoid.ts       # Monoid interface + instances
│   │   ├── Setoid.ts       # Equality interface + instances
│   │   └── Ord.ts          # Ordering interface + instances
│   ├── combinators/        # Function composition utilities
│   │   ├── pipe.ts         # Left-to-right pipeline
│   │   ├── compose.ts      # Right-to-left composition
│   │   ├── identity.ts     # Identity function
│   │   ├── curry.ts        # Function currying (2-4 args)
│   │   ├── flip.ts         # Argument swapping
│   │   ├── constant.ts     # K combinator
│   │   └── thrush.ts       # T combinator
│   ├── predicates/         # Type-narrowing predicate functions
│   ├── helpers/            # Utility functions (ifElse, when, safe, ...)
│   └── index.ts            # Public API barrel export
├── tests/
│   └── property/           # Property-based tests (fast-check)
├── benchmarks/             # Vitest benchmarks
├── scripts/                # Build & validation scripts
├── docs/                   # Documentation & examples
└── .github/                # CI, issue templates, community files
```

## Design principles

### 1. Pipe-first, curried functions

Every operation is a curried function designed for use with `pipe`:

```ts
// Pattern: operation(config)(data)
const map = <A, B>(f: (a: A) => B) => (ma: Maybe<A>): Maybe<B> => ...
```

### 2. HKT encoding

TypeScript lacks native higher-kinded types. catena uses a URI-indexed interface map:

```ts
// Each ADT registers itself:
declare module '../../types/hkt' {
  interface URItoKind<A> {
    readonly Maybe: Maybe<A>;
  }
}

// Typeclasses reference the map:
interface Functor<F extends URIS> {
  readonly map: <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B>;
}
```

This lets us write generic code over any registered type constructor.

### 3. Module structure for ADTs

Each ADT in `src/core/<Name>/` follows the same pattern:

1. **Model** — Tagged union type (discriminated by `_tag`)
2. **Constructors** — Smart constructors (`just`, `nothing`, `fromNullable`, ...)
3. **Guards** — Type narrowing (`isJust`, `isNothing`)
4. **Operations** — Curried functions (`map`, `chain`, `fold`, ...)
5. **Typeclass instances** — Objects implementing interfaces (`Functor`, `Monad`, ...)
6. **Export** — Named exports only, no default exports

### 4. Testing strategy

- **Unit tests** — Co-located as `*.test.ts`, covering every public function
- **Property tests** — In `tests/property/`, verifying algebraic laws (Functor identity/composition, Monad left/right identity/associativity, Semigroup associativity, etc.)
- **100% coverage** — Enforced by CI; no exceptions

### 5. Build output

tsup produces three artifacts:
- `dist/index.js` — ESM (tree-shakeable)
- `dist/index.cjs` — CommonJS
- `dist/index.d.ts` / `dist/index.d.cts` — Type declarations

The `sideEffects: false` flag in `package.json` enables bundlers to tree-shake unused modules.

## Adding a new module

### New ADT

1. Create `src/core/<Name>/<Name>.ts` following the pattern above
2. Register in `src/types/hkt.ts` (augment `URItoKind` or `URItoKind2`)
3. Write tests in `src/core/<Name>/<Name>.test.ts`
4. Write property tests in `tests/property/<Name>.prop.test.ts`
5. Create `src/core/<Name>/index.ts` barrel
6. Re-export from `src/index.ts`

### New algebraic structure

1. Add to `src/algebraic/<Name>.ts`
2. Define the interface, instances, and helpers
3. Write tests in `src/algebraic/<Name>.test.ts`
4. Export from `src/algebraic/index.ts` and `src/index.ts`

### New combinator

1. Create `src/combinators/<name>.ts` and `src/combinators/<name>.test.ts`
2. Export from `src/combinators/index.ts` and `src/index.ts`

## Dependency policy

catena has **zero runtime dependencies**. Dev dependencies are kept to a focused set:
- **TypeScript** — compiler and type checking
- **tsup** — bundling (ESM + CJS + DTS)
- **Vitest** — testing and benchmarking
- **fast-check** — property-based testing
- **ESLint + Prettier** — code quality
- **TypeDoc** — API documentation
