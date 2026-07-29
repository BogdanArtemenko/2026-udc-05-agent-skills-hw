# A/B validation (Task D)

**Skill under test:** `creating-widget`
**Prompt (identical for every run):** the change request from `materials/ab-task.md`
(add an `alert` widget). Copied verbatim, unchanged across runs:

> Add a new alert widget to the library:
> - Renders as `<div class="alert alert--{tone}">{message}</div>`.
> - `tone` is optional, one of `"info" | "warn" | "error"`, defaulting to
>   `"info"` (mirror the badge widget's tone handling).
> - Make it discoverable the same way every other widget is.

**Tool used:** Claude Code (Agent tool — a fresh subagent per run, no memory of
prior runs, only the prompt above plus a neutral instruction to check
`.agents/skills/` for a matching `SKILL.md` before starting, since this
environment does not auto-load `.agents/skills/` the way a configured
Claude/Cursor project might — see "Methodology note" below).

This write-up documents **three** runs, not two, because the second run
surfaced a real problem with the walkthrough's own disable mechanism (see
Run B1). Run B2 is the "true" removed-skill control used for the official
comparison.

## Result A — skill available

`.agents/skills/creating-widget/SKILL.md` was present and matched by its
frontmatter `description`. The agent explicitly reported reading it and
followed it point for point:

- Created `app/src/widgets/alert/alert.ts` — pure `createAlert(props): string`,
  `AlertProps extends WidgetProps`, `tone` defaulted via `props.tone ?? "info"`.
- Called `register("alert", createAlert)` at module top level.
- Created colocated `app/src/widgets/alert/alert.test.ts` (default-tone case +
  explicit-tone case), mirroring `badge.test.ts`.
- Added `import "./alert/alert.js";` to `app/src/widgets/index.ts`.
- Named exports only, no `any`, did not touch `core/registry.ts`.
- `npm test`: 2 files / 4 tests, all passing.

## Result B1 — skill "removed" per the walkthrough's own instructions (informational)

Followed Task D step 3 literally: renamed
`.agents/skills/creating-widget` → `.agents/skills/creating-widget.off` and
reran with an identical fresh agent and identical prompt.

**The agent found and used it anyway.** It globbed `.agents/skills/*/SKILL.md`
and matched `creating-widget.off/SKILL.md` by its frontmatter `description`
alone — the directory name never entered the matching logic, so the `.off`
suffix did nothing. The produced code was functionally identical to Result A
(same file layout, `register()` call, colocated test, `widgets/index.ts`
wiring).

**This is a real finding about the walkthrough, not about the skill itself:**
renaming a skill's directory to `<name>.off` inside `.agents/skills/` is not a
reliable way to disable it for a tool/agent that discovers skills by scanning
`.agents/skills/*/SKILL.md` and matching on `description` content rather than
on an explicit enable/disable list. A student following Task D step 3 exactly
as written could easily produce a false "no difference" result and conclude
their skill "doesn't matter" — when actually their disable step silently
failed. Worth a maintainer note in the walkthrough (e.g. instruct moving the
skill folder fully outside `.agents/skills/`, or renaming the file inside it
so it's no longer named `SKILL.md`, rather than renaming the directory).

## Result B2 — skill genuinely absent (the actual "B" used for comparison)

To get a clean control, the whole `creating-widget` (`.off`) directory was
moved **outside** `.agents/skills/` entirely (out of the repo), leaving only
`architecture-deep-dive` and `analyzing-bundle-size` in place. Fresh agent,
identical prompt.

The agent explicitly reported that `.agents/skills/creating-widget` does not
exist, noted that `app/AGENTS.md` references it but it's missing on disk, and
fell back to:
1. `architecture-deep-dive`'s `references/architecture.md` (matched loosely,
   via its "where should a new feature live" framing) — which documents the
   same widget-folder pattern, since that's what it's about.
2. `app/AGENTS.md`'s own "Conventions" section ("One widget = one folder:
   `src/widgets/<name>/<name>.ts` + `<name>.test.ts`").
3. Direct inspection of `app/src/widgets/badge/badge.ts` and
   `badge.test.ts` as a worked example.

Result: **functionally the same golden-path output as Result A** — correct
folder, `register()` called, colocated test with both tone cases, named
exports, no `any`, `widgets/index.ts` updated, `registry.ts` untouched.
`npm test`: 2 files / 4 tests, all passing.

## Difference table

| Aspect | A (skill available) | B2 (skill genuinely absent) |
|---|---|---|
| File location | `widgets/alert/alert.ts` | `widgets/alert/alert.ts` (same) |
| Registered via `register()` | yes | yes |
| Colocated test added | yes (2 cases) | yes (2 cases) |
| Wired into `widgets/index.ts` | yes | yes |
| Named exports / no `any` | yes | yes |
| **Source(s) consulted** | 1 file: `creating-widget/SKILL.md` (single, direct, exact-match lookup) | 3 sources: `architecture-deep-dive` reference (indirect match), `app/AGENTS.md` prose, direct read of `badge.ts`/`badge.test.ts` |
| **Tool calls spent orienting** | fewer (one targeted read) | more (had to synthesize across three places) |
| **None of the walkthrough's predicted failure modes occurred** | n/a | correct — did not put it in `core/`, did not forget `register()`, did not skip the test, did not use a default export |

## Conclusion

In this repo, the skill did **not** change the final code output — both A and
B2 landed on the identical golden path. It changed the **process**: with the
skill, one exact-match file lookup was sufficient; without it, the agent had
to reconstruct the same answer by triangulating `app/AGENTS.md`'s prose, a
loosely-related second skill's reference doc, and manual inspection of the
`badge` example. That's a genuine, if less dramatic than expected, result —
this starter repo's `AGENTS.md` is unusually thorough for a "no skill"
baseline (by design, per the repo's own docs), so the walkthrough's predicted
failure modes ("put it in `core/`, forgot to register", etc.) didn't surface
here. A skill's value is more visible in a *less-documented* real codebase, or
under time/context-window pressure where an agent might not bother doing that
three-source reconstruction; here it mainly saved lookups, not correctness.
Separately, the disable mechanism itself (Result B1) turned out to be the
more surprising and higher-value finding of this exercise — see above.
