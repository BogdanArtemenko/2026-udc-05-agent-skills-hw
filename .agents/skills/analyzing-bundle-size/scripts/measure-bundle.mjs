#!/usr/bin/env node
// Runs the project's real `npm run build` (esbuild, see app/scripts/build.mjs)
// and reports the real byte size of the resulting app/dist/bundle.js.
// This exists because a language model estimating bundle size from reading
// source code is unreliable — this script does the one thing it should
// instead: run the real command, read the real file.

import { execSync } from "node:child_process";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
// scripts/ -> analyzing-bundle-size/ -> skills/ -> .agents/ -> repo root
const repoRoot = path.resolve(scriptDir, "..", "..", "..", "..");
const appDir = path.join(repoRoot, "app");
const bundlePath = path.join(appDir, "dist", "bundle.js");

// 1. Run the real build (no untrusted input is interpolated into this
// command, so a plain shell-executed string is fine here).
execSync("npm run build", { cwd: appDir, stdio: "inherit" });

// 2. Read the real output file.
const { size } = statSync(bundlePath);

// 3. Report it.
console.log(`app/dist/bundle.js — ${size} bytes`);
