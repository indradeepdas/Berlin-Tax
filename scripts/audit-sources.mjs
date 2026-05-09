#!/usr/bin/env node
import {
  collectObjectsWithSourceIds,
  createReport,
  isPastDate,
  loadRules,
  loadSourceRegistry,
  printReport,
  readJsonFile,
  setStatus,
  sourceMap
} from "./lib/config.mjs";

const asOfArgIndex = process.argv.indexOf("--as-of");
const asOf = asOfArgIndex >= 0 && process.argv[asOfArgIndex + 1]
  ? new Date(`${process.argv[asOfArgIndex + 1]}T00:00:00Z`)
  : new Date();

const registry = loadSourceRegistry();
const sources = sourceMap(registry);
const rules = loadRules();
const workflowRules = readJsonFile("config/workflow-rules.json");
const report = createReport({
  title: "Source registry and rule freshness audit",
  source_ids: registry.sources.map((source) => source.id),
  user_input: {
    as_of: asOf.toISOString().slice(0, 10),
    registry_path: "sources/source-registry.json"
  }
});
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

function addFinding(level, code, message, sourceId) {
  report.findings.push({
    level,
    code,
    message,
    source_id: sourceId
  });
  if (level === "error") failures++;
}

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
      addFinding("error", "source_missing_metadata", `Source ${source.id || "(missing id)"} missing ${field}`, source.id);
    }
  }
  try {
    const host = new URL(source.source_url).host;
    if (!officialHosts.includes(host)) {
      addFinding("error", "source_host_not_whitelisted", `Source ${source.id} uses non-whitelisted host ${host}`, source.id);
    }
  } catch {
    addFinding("error", "source_invalid_url", `Source ${source.id} has invalid URL`, source.id);
  }
  if (isPastDate(source.review_by, asOf)) {
    addFinding("error", "source_stale", `Source ${source.id} is stale as of ${asOf.toISOString().slice(0, 10)}`, source.id);
  }
}

for (const rule of collectObjectsWithSourceIds(rules)) {
  if (!sources.has(rule.source_id)) {
    addFinding("error", "rule_unknown_source_id", `Rule ${rule.path} references unknown source_id ${rule.source_id}`, rule.source_id);
  }
  for (const field of ["last_verified", "review_by", "risk_level"]) {
    if (!rule[field]) {
      addFinding("error", "rule_missing_metadata", `Rule ${rule.path} missing ${field}`, rule.source_id);
    }
  }
  if (["high", "professional_review_required"].includes(rule.risk_level) && !rule.verification_checkpoint) {
    addFinding("error", "rule_missing_verification_checkpoint", `Rule ${rule.path} missing verification_checkpoint for ${rule.risk_level} risk`, rule.source_id);
  }
  if (isPastDate(rule.review_by, asOf)) {
    addFinding("error", "rule_stale", `Rule ${rule.path} is stale as of ${asOf.toISOString().slice(0, 10)}`, rule.source_id);
  }
}

for (const rule of collectWorkflowSourceIds(workflowRules)) {
  if (!sources.has(rule.source_id)) {
    addFinding("error", "workflow_rule_unknown_source_id", `Workflow rule ${rule.path} references unknown source_id ${rule.source_id}`, rule.source_id);
  }
}

report.verified_facts.push({
  fact: "Registry, deterministic rule metadata, and workflow source references were checked for required metadata, known official hosts, stale review dates, and unknown source IDs.",
  source: "scripts/audit-sources.mjs"
});
report.assumptions.push("This audit checks contributor-maintained source metadata. It does not fetch live official pages or certify that legal content is current.");
report.verification_checkpoints.push("Before beta release, run this audit and review docs/SOURCE_DASHBOARD.md for stale or approaching-stale high-risk sources.");
report.next_steps.push(failures > 0 ? "Fix source metadata, rule metadata, stale review dates, or unknown source IDs." : "Keep source review dates monitored before release.");
report.required_documents.push("Source registry entries and official-source review notes.");
report.responsible_authority.push("Berlin-Tax maintainers");

printReport(setStatus(report));

if (failures > 0) {
  process.exit(1);
}
