#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { resolveRepoPath } from "./lib/config.mjs";

const skillsRoot = resolveRepoPath("skills");
const requiredHeadings = [
  "Purpose",
  "Workflow",
  "Required Inputs",
  "Outputs",
  "Risks",
  "Escalation Conditions",
  "Verify Before Submission Controls",
  "Operational Reality Checks",
  "Source Notes",
  "Examples"
];

let failures = 0;

if (!fs.existsSync(skillsRoot)) {
  process.stderr.write("Missing skills directory.\n");
  process.exit(1);
}

for (const entry of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const skillPath = path.join(skillsRoot, entry.name, "SKILL.md");
  if (!fs.existsSync(skillPath)) {
    process.stderr.write(`Missing SKILL.md for ${entry.name}\n`);
    failures++;
    continue;
  }
  const content = fs.readFileSync(skillPath, "utf8");
  if (!content.startsWith("---\n")) {
    process.stderr.write(`Missing YAML frontmatter in ${entry.name}\n`);
    failures++;
  }
  for (const heading of requiredHeadings) {
    const pattern = new RegExp(`^##\\s+${heading}\\s*$`, "mi");
    if (!pattern.test(content)) {
      process.stderr.write(`Missing heading "${heading}" in ${entry.name}\n`);
      failures++;
    }
  }
  if (!/professional review/i.test(content)) {
    process.stderr.write(`Missing professional review language in ${entry.name}\n`);
    failures++;
  }
}

if (failures > 0) {
  process.stderr.write(`Skill validation failed with ${failures} issue(s).\n`);
  process.exit(1);
}

process.stdout.write("Skill validation passed.\n");
