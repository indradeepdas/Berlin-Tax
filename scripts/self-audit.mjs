#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { resolveRepoPath } from "./lib/config.mjs";

const root = resolveRepoPath();
const unsafePatterns = [
  { pattern: /\bguaranteed\b/i, message: "Avoid guarantee language." },
  { pattern: /automatically file/i, message: "Avoid filing automation claims." },
  { pattern: /no review needed/i, message: "Avoid claims that professional review is unnecessary." },
  { pattern: /final legal conclusion/i, message: "Avoid final legal conclusion language." },
  { pattern: /replace(s|ment)?\s+(a\s+)?(steuerberater|lawyer|accountant)/i, message: "Avoid replacement claims." }
];
const hardcodedThresholdPattern = /\b(25000|25\s*000|100000|100\s*000|9000|9\s*000|2000|2\s*000|250)\b/;
const ignoredDirs = new Set([".git", "node_modules", ".cache", "dist", "coverage"]);
const textExtensions = new Set([".md", ".json", ".mjs", ".yml", ".yaml"]);
let failures = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) walk(path.join(dir, entry.name));
      continue;
    }
    const ext = path.extname(entry.name);
    if (!textExtensions.has(ext)) continue;
    const filePath = path.join(dir, entry.name);
    const relative = path.relative(root, filePath).replaceAll("\\", "/");
    const content = fs.readFileSync(filePath, "utf8");

    if (relative === "scripts/self-audit.mjs") continue;

    for (const check of unsafePatterns) {
      if (check.pattern.test(content)) {
        process.stderr.write(`${relative}: ${check.message}\n`);
        failures++;
      }
    }

    const thresholdAllowed =
      relative.startsWith("config/") ||
      relative.startsWith("sources/") ||
      relative.startsWith("examples/") ||
      relative === "package.json";

    if (!thresholdAllowed && hardcodedThresholdPattern.test(content)) {
      process.stderr.write(`${relative}: possible hardcoded legal threshold or statutory amount. Load from config or source registry instead.\n`);
      failures++;
    }
  }
}

walk(root);

const requiredRootFiles = [
  "README.md",
  "ARCHITECTURE.md",
  "LEGAL_DISCLAIMER.md",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
  "ROADMAP.md",
  "BRUTAL_HONESTY_REVIEW.md",
  "ISSUE_TEMPLATE.md",
  "PR_TEMPLATE.md"
];
for (const file of requiredRootFiles) {
  if (!fs.existsSync(resolveRepoPath(file))) {
    process.stderr.write(`Missing required root file ${file}\n`);
    failures++;
  }
}

const requiredMaintainerFiles = [
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/workflows/ci.yml",
  "docs/MAINTAINER_GUIDE.md",
  "docs/SOURCE_GOVERNANCE.md",
  "docs/VERSIONING.md",
  "docs/NAMING_CONVENTIONS.md",
  "config/README.md"
];
for (const file of requiredMaintainerFiles) {
  if (!fs.existsSync(resolveRepoPath(file))) {
    process.stderr.write(`Missing required maintainer file ${file}\n`);
    failures++;
  }
}

if (failures > 0) {
  process.stderr.write(`Self-audit failed with ${failures} issue(s).\n`);
  process.exit(1);
}

process.stdout.write("Self-audit passed.\n");
