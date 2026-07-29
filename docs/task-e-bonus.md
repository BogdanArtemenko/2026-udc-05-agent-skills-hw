# Task E (bonus) — Path 1: cross-tool portability check

**Tools compared:** Claude Code, two discovery mechanisms —
`.agents/skills/creating-widget/` (this repo's primary convention) vs. an
unmodified copy at `.claude/skills/creating-widget/` (Claude Code's
tool-specific convention).
**Prompt (same in both):** the `alert`-widget change request from
`materials/ab-task.md` (same prompt used for Task D).

## What I actually did

1. Copied `.agents/skills/creating-widget/` → `.claude/skills/creating-widget/`
   byte-for-byte (`diff -r` confirms zero differences — no adaptation).
2. Confirmed the copy isn't accidentally gitignored: `.gitignore` has
   `.claude/*` followed by `!.claude/skills/`, and
   `git check-ignore -v .claude/skills/creating-widget/SKILL.md` exits 1
   (not ignored) — it shows up as a trackable, untracked path in
   `git status`.
3. Ran a fresh Claude Code subagent in this repo and, before giving it any
   task, asked it to report **only what its harness told it natively** was
   available (its own "Available skills" system listing) — no filesystem
   search, just what it was told.

## Result — the natively-listed skill set contained neither

The agent's native "Available skills" listing (the mechanism the built-in
`Skill` tool uses to decide what it can invoke) contained ~40 generic
Anthropic/plugin skills (`engineering:*`, `design:*`, `anthropic-skills:*`,
etc.) and **none** of the three project-local skills — not
`.agents/skills/creating-widget`, and not the freshly-copied
`.claude/skills/creating-widget` either. Neither path auto-populates the
native skill listing in this environment/version.

What *did* work, in an earlier A/B run (Task D, Result B2): when the agent
was told nothing about skills at all and just worked the ticket normally, it
still found and used the golden path by reading `app/AGENTS.md` (which
explicitly documents "Load when asked to add a widget/component" next to
`.agents/skills/creating-widget`) and then opening that file manually. That
is: discovery in this environment currently happens through an agent's
normal habit of reading `AGENTS.md`/`CLAUDE.md` and following a pointer, not
through native `SKILL.md` auto-loading — for **either** `.agents/skills/` or
`.claude/skills/`. From that angle the two locations are equally portable
(equally *not* auto-wired), which answers the "did it work unmodified in a
second location" question directly: yes, exactly as unmodified/portable as
the original — because portability here is carried by `AGENTS.md`'s prose
pointer, not by either directory being specially recognized.

| | `.agents/skills/` (original) | `.claude/skills/` (copy) |
|---|---|---|
| Skill discovered/loaded via native `Skill` tool listing? | No | No |
| Skill discoverable by an agent reading `AGENTS.md` and following the pointer? | Yes | Yes (same file, same pointer text works for either path in principle) |
| Content required adaptation to work in the second location? | n/a | No — `diff -r` shows zero differences |
| Gitignored / lost on copy? | n/a | No — `!.claude/skills/` exception confirmed working |

## Caveat on method

This test used the `Agent` tool to spawn subagents, not a literal fresh
top-level `claude` CLI process `cd`'d into this repo — it's possible a real
top-level session scans a target directory's `.claude/skills/` more eagerly
than a subagent inherits. I could not verify that distinction from inside
this single session; flagging it rather than claiming more than I observed.

## Conclusion

The skill file itself is fully portable — copying it unmodified into
`.claude/skills/` required zero adaptation and wasn't silently dropped by
`.gitignore`. What's *not* portable (or rather, not yet automatic) in this
specific environment is native, zero-instruction auto-loading via the
`Skill` tool for **either** convention — both currently rely on an agent
independently reading `AGENTS.md` and opening the referenced file, which
worked reliably in testing but is a weaker guarantee than "the tool sees the
skill's description ambiently and decides to load it," which is the premise
`docs/walkthrough.md` §0 describes. Worth flagging to the maintainer: the
walkthrough's claim that "Claude Code... reads them directly" may not (yet)
hold for arbitrary `.agents/skills/` in every Claude Code configuration —
worth a caveat or a pointer to whatever project setting/plugin actually wires
that up, if one exists.
