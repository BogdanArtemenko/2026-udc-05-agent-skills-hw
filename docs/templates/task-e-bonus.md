# Task E (bonus) — pick ONE path

> Copy to `docs/task-e-bonus.md`, delete the section you didn't do, fill in
> the one you did.

---

## Path 1 — cross-tool portability check

Verify the **same** skill works, unmodified, in a **second** tool (e.g.
Cursor + Claude Code, or copy `.agents/skills/creating-widget/` into
`.claude/skills/creating-widget/`).

**Tools compared:** <e.g. Cursor and Claude Code>
**Prompt (same in both):** <e.g. "add a `spinner` widget following the project's pattern">

| | Tool 1 (<name>) | Tool 2 (<name>) |
|---|---|---|
| Skill discovered/loaded? | <yes/no> | <yes/no> |
| Followed the golden path? | <yes/no + detail> | <yes/no + detail> |
| Discrepancies | <none / describe> | |

**Conclusion:** <1–3 sentences — is the skill genuinely portable as-is, or did it need tool-specific tweaks?>

---

## Path 2 — install a community skill

Install one skill from [github.com/anthropics/skills](https://github.com/anthropics/skills)
(or another public skill repo) into `.agents/skills/`, adapt its
`description` if needed so it triggers correctly in this repo, and try it once.

**Skill installed:** <name + source URL>
**What it did when invoked:** <describe the result>
**Adaptations needed (if any):** <e.g. tightened the trigger description, none>

**Conclusion:** <1–3 sentences — was it usable as-is, and what did installing a third-party skill teach you about writing your own?>
