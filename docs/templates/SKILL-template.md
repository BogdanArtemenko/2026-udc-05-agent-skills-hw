---
name: skill-name-here
description: One or two sentences — WHAT this skill does and WHEN an agent should reach for it. This is the only part the agent sees before deciding to load the skill (progressive disclosure) — make it specific enough to trigger correctly and skip incorrectly.
---

# Skill Name Here

<!--
Everything below this line only loads into context when the agent actually
invokes the skill — keep the frontmatter description tight (it's ALWAYS in
context for every skill you have installed), and put the real instructional
weight here.
-->

## When to use this

<!-- Concrete trigger scenarios. "When the user asks to X" beats "when relevant". -->

## Instructions

<!-- The actual step-by-step expertise. Be concrete: real file paths, real
     function names, real constraints from materials/architecture-brief.md.
     Avoid vague advice a generic model would already produce unprompted —
     a skill should encode something PROJECT-SPECIFIC. -->

## Verify

<!-- How the agent (or you) confirms the skill was followed correctly, e.g.
     "cd app && npm test", "grep for register( in the new file". -->

<!--
Optional, only if this skill has them (see the other two task templates):
## References
- references/<file>.md — <what it covers, when to open it>

## Scripts
- scripts/<file> — <what it does, how to invoke it>
-->
