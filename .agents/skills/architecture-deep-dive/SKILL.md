---
name: architecture-deep-dive
description: Use when asked to explain this project's architecture, where a new feature should live, or how the widget registry works internally (e.g. "explain this project's architecture", "where should I implement X"). Loads the full module-boundary writeup from references/architecture.md.
---

# Architecture deep dive

## When to use this

- The user asks to explain the architecture of `app/`.
- The user asks where a new feature or file should live in this codebase.
- The user asks how `register`/`create`/`listWidgets` work internally, or why
  widgets are structured the way they are.

## Instructions

Read `references/architecture.md` in this skill folder and answer from it —
it documents the real module boundaries, the registry's actual behavior, and
the widget folder pattern, verified against `app/src/core/registry.ts` and
`app/src/widgets/**`. Do not answer from general knowledge of "a registry
pattern" — cite the real function names and files this reference describes.

## Verify

- The answer names the real files (`app/src/core/registry.ts`,
  `app/src/widgets/index.ts`, `app/src/widgets/<name>/`) and real function
  signatures (`register(name, factory)`, `create(name, props)`,
  `listWidgets()`), not generic architecture-essay language.

## References

- `references/architecture.md` — module boundaries, registry internals
  (including its two thrown-error cases), the widget folder pattern, and the
  bundle entry point. Loaded only when this skill is invoked.
