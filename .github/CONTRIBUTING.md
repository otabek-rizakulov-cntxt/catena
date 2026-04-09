# Contributing to petfp

Thanks for your interest in contributing! This guide will get you up and running.

## Setup

```bash
git clone <repo-url>
cd pet
npm install
```

Verify everything works:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Development workflow

1. Create a branch: `git checkout -b feat/my-feature`
2. Make changes in `src/`
3. Add or update tests (co-located as `*.test.ts`)
4. Run checks: `npm run typecheck && npm run lint && npm test`
5. Open a pull request against `main`

## Adding a new ADT module

Each ADT lives in `src/core/<Name>/` with this structure:

```
src/core/MyType/
├── MyType.ts       # Implementation
├── MyType.test.ts  # Unit tests
└── index.ts        # Barrel export
```

Checklist for a new ADT:

- [ ] Define the type and smart constructors
- [ ] Register in HKT map (`declare module '../../types/hkt'`)
- [ ] Implement typeclass instances (Functor, Monad, etc.)
- [ ] Write unit tests covering every public function
- [ ] Write property-based tests for algebraic laws
- [ ] Add TSDoc comments with `@example` and `@since` tags
- [ ] Re-export from `src/index.ts`

## Code style

- All code must pass `npm run lint` and `npm run format:check`
- Prefer `readonly` properties
- Prefer point-free function style
- No `any` or `as` casts in public API
- Use `type` imports for type-only imports

## Commit messages

Use conventional commits:

```
feat(Maybe): add fromNullable constructor
fix(pipe): correct inference for 9+ arguments
docs: add getting-started guide
test(Either): add Monad law property tests
chore: update dependencies
```

## Questions?

Open a GitHub Discussion — we're happy to help!
