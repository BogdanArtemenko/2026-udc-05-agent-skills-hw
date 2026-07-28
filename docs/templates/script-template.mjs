#!/usr/bin/env node
// Copy into .agents/skills/<your-skill>/scripts/<name>.mjs
//
// A skill script is TIER 3 of progressive disclosure — it only runs when the
// agent (or you) actually invokes it, and it should do something a language
// model is bad at doing reliably from first principles: run a real command,
// parse real output, compute a real number. Don't write a script that just
// prints advice — that belongs in SKILL.md or a reference file instead.
//
// Example shape for the Task C "analyzing-bundle-size" skill: run the real
// build, read the real file size, print a real report. Keep it short — this
// is a workshop exercise script, not a production tool.

import { execSync } from "node:child_process";
import { statSync } from "node:fs";

// 1. Run the real command this script wraps.
// execSync("npm run build", { cwd: "app", stdio: "inherit" });

// 2. Read real output / measure something real.
// const { size } = statSync("app/dist/bundle.js");

// 3. Report it in a way a human or the calling agent can act on.
// console.log(`dist/bundle.js: ${size} bytes`);
