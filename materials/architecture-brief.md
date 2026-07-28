# Architecture brief — the widget-registry library

This is the **source of truth** for the skills you build in Tasks A–C. It
describes how the seeded `app/` is *intended* to work, so your skills encode
real, verifiable expertise (not generic "write good code" fluff).

Read the actual code alongside this brief: `app/src/`.

## Domain

A tiny, framework-free **widget-registry library**. A "widget" is a pure
function that returns an HTML string; widgets self-register under a name so
callers can create them by string ID (`create("badge", { label: "New" })`)
without importing the widget module directly.

## Architecture

- `app/src/core/registry.ts` — the registry itself: `register(name, factory)`
  and `create(name, props)`. This is the **shared contract** every widget
  depends on. Its public API (`register`, `create`, `listWidgets`) is stable;
  do not change its signatures.
- `app/src/widgets/<name>/` — one folder per widget, containing exactly two
  files: `<name>.ts` (the pure factory function + its `register(...)` call)
  and `<name>.test.ts` (colocated vitest tests). See `app/src/widgets/badge/`
  for the canonical example.
- `app/src/widgets/index.ts` — imports every widget module (so its
  `register()` call runs) and re-exports `create`/`listWidgets`.
- `app/src/index.ts` — the library's bundle entry point, used by `npm run
  build` (Task C's bundle-size exercise).

**The golden path to add a new widget:**
1. Create `app/src/widgets/<name>/<name>.ts` — a pure function
   `create<Name>(props): string` returning an HTML string, calling
   `register("<name>", create<Name>)` at module load.
2. Create the colocated `app/src/widgets/<name>/<name>.test.ts`.
3. Add `import "./<name>/<name>.js";` to `app/src/widgets/index.ts`.

## Conventions

- TypeScript strict — no `any`, no `@ts-ignore`.
- Named exports only (no default exports).
- Widget factories are **pure**: no DOM access, no side effects beyond the
  module-load-time `register()` call.
- Files: kebab-case; types/interfaces PascalCase.
- Tests are colocated `*.test.ts` using vitest; `cd app && npm test`.

## Build (for the Task C bundle-size skill)

```bash
cd app
npm run build   # esbuild bundles src/index.ts -> dist/bundle.js (minified), prints its byte size
```

## Commands available

```bash
cd app
npm test            # vitest run
npm run typecheck   # tsc --noEmit
npm run build        # esbuild bundle -> dist/bundle.js
# lint: NOT configured in this sample (say so rather than inventing one)
```
