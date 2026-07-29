# AGENTS.md

## Stack

TypeScript 5, Node 22, Vitest, esbuild — plain library, no framework.

## Commands

- Install: `npm install`
- Test: `npm test`
- Typecheck: `npm run typecheck`
- Build (bundle): `npm run build` → `dist/bundle.js`
- Lint: not configured

## Architecture

A tiny widget registry (`src/core/registry.ts`): `register(name, factory)` /
`create(name, props)`. Each widget is a **pure function** returning an HTML
string, colocated under `src/widgets/<name>/` with its own `*.test.ts`, and
self-registers via a top-level `register(...)` call in its module. The bundle
entry point is `src/index.ts`.

## Conventions

- Named exports only (no default exports).
- No `any`, no `@ts-ignore`.
- One widget = one folder: `src/widgets/<name>/<name>.ts` + `<name>.test.ts`.
- Widget factories are pure — no DOM access, no side effects beyond
  `register()` at module load.

## Guardrails

- Do not add a UI framework (React/Vue/etc.) — this library stays framework-free.
- Do not add new npm dependencies without a documented reason.
- `src/core/registry.ts` is the shared contract every widget depends on —
  changes there affect all widgets; keep its public API (`register`, `create`,
  `listWidgets`) stable.

## Skills

Agent Skills for this repo live in `.agents/skills/` (cross-tool convention —
`SKILL.md` per skill):

- **`creating-widget`** — the golden path for adding a new widget: pure
  factory in `src/widgets/<name>/<name>.ts`, `register()` call, colocated
  `<name>.test.ts`, import in `src/widgets/index.ts`. Load when asked to add
  a widget/component.
- **`architecture-deep-dive`** — short SKILL.md + a `references/architecture.md`
  deep-dive on `core/registry.ts` and the widget module boundaries. Load when
  asked to explain this project's architecture or where a feature belongs.
- **`analyzing-bundle-size`** — short SKILL.md + an executable
  `scripts/measure-bundle.mjs` that runs `npm run build` and reads the real
  `dist/bundle.js` size. Load when asked about bundle size instead of
  estimating it from source.
