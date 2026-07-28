#!/usr/bin/env node
// Bundles src/index.ts -> dist/bundle.js (minified). Kept deliberately small —
// this is the build step the Task C "analyzing-bundle-size" skill's script
// wraps and reports on, not a production bundler setup.
import { build } from "esbuild";
import { statSync } from "node:fs";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  format: "esm",
  outfile: "dist/bundle.js",
  platform: "neutral",
});

const { size } = statSync("dist/bundle.js");
console.log(`dist/bundle.js — ${size} bytes`);
