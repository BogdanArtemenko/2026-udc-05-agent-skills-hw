# A/B validation (Task D)

> Copy to `docs/ab-validation.md` and fill in. Run the SAME prompt twice — once
> with your `creating-widget` skill available, once with it temporarily
> **moved entirely out of `.agents/skills/`** (e.g. to a repo-root scratch
> folder: `mv .agents/skills/creating-widget /tmp/creating-widget-disabled`,
> or just `git rm -r .agents/skills/creating-widget` and `git checkout --
> .agents/skills/creating-widget` afterward to restore it) — in a NEW chat
> each time. Just renaming the folder in place (e.g. adding a `.off` suffix)
> is NOT reliable: some tools discover any `SKILL.md` found anywhere under
> `.agents/skills/`, so a renamed-but-still-nested folder can still get
> picked up.

**Skill under test:** `creating-widget`
**Prompt (same for A and B):** the change request from `materials/ab-task.md`
(add an `alert` widget).
**Tool used:** <e.g. Cursor / Claude Code>

## Result A — skill available

<what the AI produced: which files, correct folder/naming, did it call
`register()`, did it add a colocated test, did it update `widgets/index.ts`?>

## Result B — skill removed

<what the AI produced without the skill: wrong location? missing test?
different registration mechanism? forgot to wire it into `widgets/index.ts`?>

## Difference table

| Aspect | A (skill available) | B (skill removed) |
|---|---|---|
| File location | <e.g. `widgets/alert/alert.ts`> | <e.g. `core/alert.ts`> |
| Registered via `register()` | <yes> | <e.g. no / different mechanism> |
| Colocated test added | <yes> | <e.g. no> |
| Wired into `widgets/index.ts` | <yes> | <e.g. forgotten, `create()` throws> |
| Named exports / no `any` | <yes> | <e.g. default export> |

## Conclusion

<1–3 sentences: did the skill actually change behaviour? was the difference
worth the effort of writing the skill? anything that surprised you?>
