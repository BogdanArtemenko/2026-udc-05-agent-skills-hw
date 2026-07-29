# Reference: widget-registry architecture

> Loaded only when `architecture-deep-dive` is invoked (progressive
> disclosure, tier 2). Verified against `app/src/core/registry.ts` and
> `app/src/widgets/**` as of this writing — re-check against the code if it
> ever looks stale, this file is documentation, not the source of truth.

## Overview

`app/` is a tiny, framework-free widget-registry library: widgets are pure
functions that render an HTML string, and they self-register under a string
name so callers can instantiate them without importing the widget module
directly (`create("badge", { label: "New" })`). This file explains the three
module boundaries and exactly how the registry behaves, including its error
paths, so an agent can reason about where new code belongs without re-reading
the source every time.

## Deep dive

### `app/src/core/registry.ts` — the shared contract

This is the only file that knows about widgets in general (as opposed to any
specific widget). It exposes exactly three exports, and their signatures are
protected — do not change them:

- `type WidgetProps = Record<string, unknown>` — the base shape every widget's
  props type extends.
- `type WidgetFactory<P extends WidgetProps = WidgetProps> = (props: P) => string`
  — the shape every widget factory function matches.
- `register<P extends WidgetProps>(name: string, factory: WidgetFactory<P>): void`
  — stores `factory` in an internal `Map<string, WidgetFactory>` keyed by
  `name`. **Throws** `Error('Widget "<name>" is already registered')` if that
  name is already taken — registration is a one-shot operation per name, not
  an upsert.
- `create(name: string, props: WidgetProps = {}): string` — looks up `name` in
  the map and calls the factory with `props`. **Throws**
  `Error('Unknown widget "<name>". Registered: <comma-separated names>')` if
  the name was never registered. This is the failure mode you get when a
  widget file exists but was never imported anywhere (see below).
- `listWidgets(): string[]` — returns the currently registered names as an
  array (`[...map.keys()]`), in registration order.

The registry itself has no knowledge of `badge`, `alert`, or any other widget
— it is purely a name → factory map with lookup and duplicate-guard logic.

### `app/src/widgets/<name>/` — one folder per widget

Each widget is exactly two colocated files, e.g. `app/src/widgets/badge/`:

- `<name>.ts` — the pure factory. It imports `register` (and the `WidgetProps`
  type) from `"../../core/registry.js"`, defines a `<Name>Props` interface
  extending `WidgetProps`, exports `create<Name>(props: <Name>Props): string`,
  and calls `register("<name>", create<Name>)` once at module top level (not
  inside the function — registration happens as a side effect of the module
  being loaded, exactly once).
- `<name>.test.ts` — colocated vitest tests importing the factory from
  `./<name>.js`.

The only seeded example, `app/src/widgets/badge/badge.ts`, follows this
exactly: `BadgeProps` adds `label: string` and an optional
`tone?: "info" | "warn" | "error"` (defaulted to `"info"` via
`props.tone ?? "info"` inside the factory, not in the type), and renders
`<span class="badge badge--${tone}">${props.label}</span>`.

**Why the module-load-time `register()` call matters:** a widget's factory
function is never registered just by existing in the `widgets/` folder — the
module has to actually be imported somewhere for its top-level `register()`
call to execute. That's the job of the next file.

### `app/src/widgets/index.ts` — the registration root

This file has two jobs, in order:

1. Side-effect-import every widget module (currently just
   `import "./badge/badge.js";`) purely to trigger each module's top-level
   `register()` call. Adding a new widget file does **nothing** on its own
   until it's imported here — this is the single most common way a widget
   silently fails (`create()` throws "Unknown widget").
2. Re-export `create` and `listWidgets` from `../core/registry.js` as the
   public surface consumers of `app/src/widgets/index.ts` use.

### `app/src/index.ts` — the bundle entry point

Re-exports `create` and `listWidgets` from `./widgets/index.js`. This is the
file `npm run build` (esbuild, see `app/scripts/build.mjs`) bundles into
`app/dist/bundle.js` — it's also why registering a widget in `widgets/index.ts`
is what makes it reachable from the built bundle, not just from tests.

### Why this shape

Widgets don't import each other and never import `core/registry.ts` directly
except through the `register`/`WidgetProps` re-export path — the registry is
the only coupling point, which keeps each widget folder independently
addable/removable. The self-registration pattern (rather than, say, a static
`WIDGETS` array someone edits) means the "did I forget a step" failure mode is
narrow and diagnosable: either the factory never called `register()`, or
`widgets/index.ts` never imported the file.

## Related

- `materials/architecture-brief.md` — the source-of-truth brief this
  reference expands on; written for humans building the skills, this file is
  written for an agent already told to load it.
- `.agents/skills/creating-widget/SKILL.md` — the Task A skill that applies
  this architecture when adding a *new* widget (step-by-step instructions,
  not architecture explanation).
