# Contributing to catena

Thanks for your interest in contributing! Whether it's a bug fix, a new ADT, better docs, or a performance tweak — all contributions are welcome.

## Getting started

### Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- **Git**

### Setup

```bash
git clone <repo-url>
cd catena
npm install
```

Verify everything works:

```bash
npm run typecheck   # Type-check all source files
npm run lint        # ESLint (strict TypeScript rules)
npm run format:check # Prettier formatting check
npm test            # 303+ unit & property tests
npm run build       # ESM + CJS + DTS via tsup
```

## Development workflow

1. **Fork & branch** — `git checkout -b feat/my-feature`
2. **Make changes** in `src/`
3. **Add or update tests** — co-located as `*.test.ts` next to the source
4. **Run checks** — `npm run typecheck && npm run lint && npm test`
5. **Commit** with a [conventional commit message](#commit-messages)
6. **Open a pull request** against `main`

### Quick script reference

| Script | What it does |
|--------|-------------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Re-run tests on file changes |
| `npm run test:coverage` | Run tests with 100% coverage enforcement |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Auto-format with Prettier |
| `npm run build` | Build ESM + CJS + DTS |
| `npm run bench` | Run performance benchmarks |
| `npm run docs` | Generate TypeDoc API reference |
| `npm run bundle-size` | Report dist file sizes |
| `npm run check-treeshake` | Validate tree-shaking |

## Adding a new ADT module

Each ADT lives in `src/core/<Name>/` with this structure:

```
src/core/MyType/
├── MyType.ts       # Implementation
├── MyType.test.ts  # Unit tests
└── index.ts        # Barrel export
```

**Checklist for a new ADT:**

- [ ] Define the type and smart constructors
- [ ] Register in HKT map (`declare module '../../types/hkt'`)
- [ ] Implement typeclass instances (Functor, Monad, etc.)
- [ ] Write unit tests covering every public function
- [ ] Write property-based tests for algebraic laws in `tests/property/`
- [ ] Add TSDoc comments with `@example` and `@since` tags
- [ ] Re-export from `src/index.ts`
- [ ] Ensure 100% code coverage is maintained

## Adding a combinator or helper

1. Create `src/combinators/<name>.ts` (or `src/helpers/<name>.ts`)
2. Create `src/combinators/<name>.test.ts` alongside it
3. Export from the directory's `index.ts`
4. Re-export from `src/index.ts`
5. Add TSDoc with `@example` and `@since` tags

## Code style

- All code must pass `npm run lint` and `npm run format:check`
- Prefer `readonly` properties on all interfaces
- Prefer point-free / curried function style
- No `any` or `as` casts in public API (internal `eslint-disable` is acceptable with justification)
- Use `type` imports for type-only imports (`import type { ... }`)
- Keep functions small and focused — one function, one responsibility

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(Maybe): add fromNullable constructor
fix(pipe): correct inference for 9+ arguments
docs: add getting-started guide
test(Either): add Monad law property tests
perf(compose): optimize reduceRight allocation
chore: update dependencies
```

**Scopes**: `Maybe`, `Either`, `IO`, `Reader`, `Async`, `pipe`, `compose`, `curry`, `Semigroup`, `Monoid`, `Setoid`, `Ord`, `predicates`, `helpers`, `ci`, `docs`

## Pull request guidelines

- Keep PRs focused — one feature or fix per PR
- Fill out the PR template completely
- All CI checks must pass before review
- Squash commits on merge (maintainers will handle this)
- Link to a related issue if one exists

## Finding things to work on

Look for issues labeled:

- **`good first issue`** — Small, well-scoped tasks ideal for newcomers
- **`help wanted`** — Larger tasks where maintainer guidance is available
- **`type:feature`** — New functionality
- **`type:docs`** — Documentation improvements

## Code of conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## Questions?

Open a [GitHub Discussion](../../discussions) — we're happy to help!
