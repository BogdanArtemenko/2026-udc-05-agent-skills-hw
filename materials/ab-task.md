# A/B task — add an `alert` widget

This is the **change request** you run for the A/B validation (Task D). It is
written the way a small ticket would be, so you can paste the **same exact
prompt** into the AI twice — once with your `creating-widget` skill available,
once without it — and compare how the AI behaves.

> **Do not reword it between the two runs.** Same prompt, new chat each time.
> That is what makes the comparison "apples to apples".

## The request

Add a new **alert** widget to the library:

- Renders as `<div class="alert alert--{tone}">{message}</div>`.
- `tone` is optional, one of `"info" | "warn" | "error"`, defaulting to `"info"`
  (mirror the `badge` widget's tone handling).
- Make it discoverable the same way every other widget is.

That's the whole prompt. Deliberately, it does **not** say *where* the files
should go, *how* the widget should be structured, or *that* it needs a test —
that's exactly what a good `creating-widget` skill should supply on its own.

## What "correct" looks like (for grading your own A/B write-up)

With the skill available and actually used, the AI should follow the
project's golden path from `materials/architecture-brief.md`:

1. `app/src/widgets/alert/alert.ts` — a pure `createAlert(props): string`
   function, calling `register("alert", createAlert)` at module load.
2. `app/src/widgets/alert/alert.test.ts` — colocated tests (default tone +
   explicit tone, mirroring `badge.test.ts`).
3. `app/src/widgets/index.ts` updated to import the new widget module.
4. `cd app && npm test` stays green; no changes to `core/registry.ts`'s public
   API; named exports; no `any`.

## What to watch for without the skill

Common "no skill" behaviours to capture in your write-up: putting the widget
directly in `core/`, forgetting to register it (so `create("alert", ...)`
throws), skipping the test, exporting a default, or inventing a different
registration mechanism than `register()`. The bigger the gap, the more the
skill is earning its keep.

## Keeping the repo green

If you keep the **skill-assisted** result as a real change, make sure `cd app
&& npm test` passes. If you'd rather not commit code changes, you can `git
checkout -- app/src/widgets/` (and revert `widgets/index.ts`) after capturing
both results — the seeded tests stay green either way. The graded deliverable
for Task D is `docs/ab-validation.md`, not the code change itself.
