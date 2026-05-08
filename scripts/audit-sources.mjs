#!/usr/bin/env node
import { collectObjectsWithSourceIds, isPastDate, loadRules, loadSourceRegistry, readJsonFile, sourceMap } from "./lib/config.mjs";

const asOfArgIndex = process.argv.indexOf("--as-of");
const asOf = asOfArgIndex >= 0 && process.argv[asOfArgIndex + 1]
  ? new Date(`${process.argv[asOfArgIndex + 1]}T00:00:00Z`)
  : new Date();

const registry = loadSourceRegistry();
const sources = sourceMap(registry);
const rules = loadRules();
const workflowRules = readJsonFile("config/workflow-rules.json");
const officialHosts = [
  "service.berlin.de",
  "www.berlin.de",
  "www.gesetze-im-internet.de",
  "www.elster.de",
  "www.faq.elster.de",
  "www.bundesfinanzministerium.de",
  "www.arbeitsagentur.de",
  "www.existenzgruendungsportal.de"
];

let failures = 0;

function collectWorkflowSourceIds(value, pathParts = [], found = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectWorkflowSourceIds(item, [...pathParts, String(index)], found));
    return found;
  }

  if (!value || typeof value !== "object") return found;

  if (typeof value.source_id === "string") {
    found.push({
      path: pathParts.join("."),
      source_id: value.source_id
    });
  }

  for (const [key, child] of Object.entries(value)) {
    collectWorkflowSourceIds(child, [...pathParts, key], found);
  }

  return found;
}

for (const source of registry.sources) {
  for (const field of ["id", "title", "authority", "jurisdiction", "source_url", "last_verified", "review_by", "risk_level"]) {
    if (!source[field]) {
      process.stderr.write(`Source ${source.id || "(missing id)"} missing ${field}\n`);
      failures++;
    }
  }
  try {
    const host = new URL(source.source_url).host;
    if (!officialHosts.includes(host)) {
      process.stderr.write(`Source ${source.id} uses non-whitelisted host ${host}\n`);
      failures++;
    }
  } catch {
    process.stderr.write(`Source ${source.id} has invalid URL\n`);
    failures++;
  }
  if (isPastDate(source.review_by, asOf)) {
    process.stderr.write(`Source ${source.id} is stale as of ${asOf.toISOString().slice(0, 10)}\n`);
    failures++;
  }
}

for (const rule of collectObjectsWithSourceIds(rules)) {
  if (!sources.has(rule.source_id)) {
    process.stderr.write(`Rule ${rule.path} references unknown source_id ${rule.source_id}\n`);
    failures++;
  }
  for (const field of ["last_verified", "review_by", "risk_level"]) {
    if (!rule[field]) {
      process.stderr.write(`Rule ${rule.path} missing ${field}\n`);
      failures++;
    }
  }
  if (["high", "professional_review_required"].includes(rule.risk_level) && !rule.verification_checkpoint) {
    process.stderr.write(`Rule ${rule.path} missing verification_checkpoint for ${rule.risk_level} risk\n`);
    failures++;
  }
  if (isPastDate(rule.review_by, asOf)) {
    process.stderr.write(`Rule ${rule.path} is stale as of ${asOf.toISOString().slice(0, 10)}\n`);
    failures++;
  }
}

for (const rule of collectWorkflowSourceIds(workflowRules)) {
  if (!sources.has(rule.source_id)) {
    process.stderr.write(`Workflow rule ${rule.path} references unknown source_id ${rule.source_id}\n`);
    failures++;
  }
}

if (failures > 0) {
  process.stderr.write(`Source audit failed with ${failures} issue(s).\n`);
  process.exit(1);
}

process.stdout.write("Source audit passed.\n");
