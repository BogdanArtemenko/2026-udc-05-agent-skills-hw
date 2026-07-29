---
name: creating-widget
description: Use when asked to add a new widget/component to this widget-registry library (app/), e.g. "add a spinner widget" or "create a new alert component". Encodes the project's golden path for widget folders, registration, and colocated tests.
---

# Creating a widget

<!--
Everything below this line only loads into context when the agent actually
invokes the skill — keep the frontmatter description tight (it's ALWAYS in
context for every skill you have installed), and put the real instructional
weight here.
-->

## When to use this

- The user asks to add a new widget to `app/src/widgets/`.
- The user asks to add a new "component" to this library (this project's only
  unit of UI is a "widget", so treat that request the same way).
- The user asks how a widget should be structured in this repo.

## Instructions

Follow the golden path from `materials/architecture-brief.md` exactly — do not
invent a different file layout or registration mechanism.

1. Create `app/src/widgets/<name>/<name>.ts`:
   - Export a pure function `create<Name>(props): string` that returns an HTML
     string. No DOM access, no side effects other than the `register()` call
     below.
   - Define a `<Name>Props extends WidgetProps` interface for its props if the
     widget takes props beyond a single string.
   - At module load (top level, not inside the function), call
     `register("<name>", create<Name>)`, importing `register` (and
     `WidgetProps` as a type) from `"../../core/registry.js"`.
   - Use named exports only — no default export.
   - No `any`, no `@ts-ignore`.
   - Mirror `app/src/widgets/badge/badge.ts` as the canonical example.

2. Create the colocated `app/src/widgets/<name>/<name>.test.ts`:
   - Use `vitest` (`describe`/`expect`/`it`), importing the factory from
     `./<name>.js`.
   - At minimum, test the default behavior and one explicit-variant behavior
     (mirror `app/src/widgets/badge/badge.test.ts`).

3. Add `import "./<name>/<name>.js";` to `app/src/widgets/index.ts` so the
   widget's `register()` call actually runs when the library loads. Without
   this line the widget exists but `create("<name>", ...)` will throw
   `Unknown widget "<name>"`.

4. Do not touch `app/src/core/registry.ts` — its public API (`register`,
   `create`, `listWidgets`) is a stable, shared contract used by every widget.

## Verify

- `cd app && npm test` — must stay green (new test included).
- `cd app && npm run typecheck` — no type errors.
- `grep -n "register(" app/src/widgets/<name>/<name>.ts` — confirms the
  module actually registers itself.
- `grep -n "<name>" app/src/widgets/index.ts` — confirms the widget is wired
  into the bundle entry point (otherwise `create()` throws at runtime).
