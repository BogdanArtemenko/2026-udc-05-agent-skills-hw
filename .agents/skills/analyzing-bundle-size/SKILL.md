---
name: analyzing-bundle-size
description: Use when asked to check, report, or estimate the bundle size of this library, or to assess whether a change affects bundle size (e.g. "how big is the bundle?", "did that change bloat the bundle?"). Runs the real build and reads the real dist/bundle.js size instead of guessing.
---

# Analyzing bundle size

## When to use this

- The user asks how big the bundle/output is.
- The user asks whether a recent change grew or shrank the bundle.
- Before/after comparisons where a real byte count is needed, not an estimate.

## Instructions

Do not estimate or guess a bundle size from reading source code — a language
model is unreliable at that and this library already has a real build step.
Instead, run the script in this skill's `scripts/` folder, which invokes the
project's actual `npm run build` (esbuild, see `app/scripts/build.mjs`) and
reads the resulting `app/dist/bundle.js` file size from disk.

```bash
node .agents/skills/analyzing-bundle-size/scripts/measure-bundle.mjs
```

Report the number the script prints, verbatim. If comparing before/after a
code change, run it once per state (e.g. `git stash` the change, run, unstash,
run again) rather than trusting a single run plus mental arithmetic.

## Verify

- The script actually shell out to `npm run build` inside `app/` (check for
  an `execSync`/`spawnSync` call, not a hardcoded number).
- The reported byte count matches `app/dist/bundle.js`'s real size (e.g.
  cross-check with a plain `ls -l app/dist/bundle.js` after running it).

## Scripts

- `scripts/measure-bundle.mjs` — runs `npm run build` in `app/`, reads
  `app/dist/bundle.js` with `statSync`, and prints its byte size.
