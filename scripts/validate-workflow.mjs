#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { createReport, loadSourceRegistry, printReport, readJsonFile, setStatus, sourceMap } from "./lib/config.mjs";

const [workflow, inputPath] = process.argv.slice(2);
if (!workflow || !inputPath) {
  process.stderr.write("Usage: node scripts/validate-workflow.mjs <operational_intake|accountant_handoff|contradictory_advice> <input.json>\n");
  process.exit(2);
}

const rules = readJsonFile("config/workflow-rules.json");
const sources = sourceMap(loadSourceRegistry());
const workflowRules = rules[workflow];
if (!workflowRules) {
  process.stderr.write(`Unknown workflow "${workflow}".\n`);
  process.exit(2);
}

const input = JSON.parse(readFileSync(inputPath, "utf8"));
const report = createReport({
  title: `${workflow} deterministic workflow validation`,
  source_ids: [],
  user_input: {
    workflow,
    input_path: inputPath
  }
});
const configSource = "config/workflow-rules.json";

function getPath(obj, dottedPath) {
  return dottedPath.split(".").reduce((cursor, part) => (cursor == null ? undefined : cursor[part]), obj);
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0);
}

function normalizeStatus(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
}

function addMissingField(field, scope = "input") {
  report.findings.push({
    level: "error",
    code: "missing_required_field",
    message: `Missing required ${scope} field: ${field}`,
    source: configSource
  });
}

function addUnknownSource(field, sourceId) {
  report.findings.push({
    level: "error",
    code: "unknown_source_id",
    message: `${field} references unknown source_id: ${sourceId}`,
    source: "sources/source-registry.json"
  });
}

for (const field of workflowRules.required_fields || []) {
  if (!hasValue(getPath(input, field))) addMissingField(field);
}

for (const rule of workflowRules.review_rules || []) {
  const value = getPath(input, rule.path);
  const matchesEquals = "equals" in rule && value === rule.equals;
  const matchesIn = Array.isArray(rule.in) && rule.in.includes(value);
  if (matchesEquals || matchesIn) {
    report.professional_review_items.push({
      item: rule.message,
      source_id: rule.source_id
    });
    report.verification_checkpoints.push(`Resolve ${rule.code} before treating the workflow as complete.`);
    if (!report.source_notes.includes(rule.source_id)) report.source_notes.push(rule.source_id);
  }
}

if (workflow === "contradictory_advice") {
  const claims = Array.isArray(input.claims) ? input.claims : [];
  claims.forEach((claim, index) => {
    for (const field of workflowRules.claim_required_fields || []) {
      if (!hasValue(claim[field])) addMissingField(`claims.${index}.${field}`, "claim");
    }
    if ((workflowRules.blocking_statuses || []).includes(claim.status)) {
      report.professional_review_items.push({
        item: `Claim ${index + 1} is ${claim.status}; do not use it to choose a filing, invoice, or registration action.`,
        source_id: claim.official_source_to_check || undefined
      });
      report.verification_checkpoints.push(`Resolve claim ${index + 1} against ${claim.official_source_to_check || "an official source"} before action.`);
      if (claim.official_source_to_check && !report.source_notes.includes(claim.official_source_to_check)) {
        report.source_notes.push(claim.official_source_to_check);
      }
    }
    if (claim.official_source_to_check && !sources.has(claim.official_source_to_check)) {
      addUnknownSource(`claims.${index}.official_source_to_check`, claim.official_source_to_check);
    }
  });
}

if (workflow === "accountant_handoff") {
  const reviewValues = new Set((workflowRules.review_status_values || []).map(normalizeStatus));
  for (const field of workflowRules.review_status_paths || []) {
    const value = getPath(input, field);
    if (hasValue(value) && reviewValues.has(normalizeStatus(value))) {
      report.open_verification_items.push(`${field} is ${value}`);
      report.verification_checkpoints.push(`Resolve or document ${field} before treating the handoff as externally usable.`);
    }
  }

  for (const sourceId of input.source_notes || []) {
    if (!report.source_notes.includes(sourceId)) report.source_notes.push(sourceId);
    if (!sources.has(sourceId)) addUnknownSource("source_notes", sourceId);
  }

  for (const question of input.open_questions || []) {
    report.open_verification_items.push(question);
  }

  for (const item of input.professional_review_items || []) {
    report.professional_review_items.push(item);
  }

  if ((input.open_questions || []).length > 0 || (input.professional_review_items || []).length > 0) {
    report.verification_checkpoints.push("Assign each open accountant handoff question to a qualified reviewer before treating the package as complete.");
  }
}

report.verified_facts.push({
  fact: "Workflow completeness and branch checks were evaluated from config/workflow-rules.json.",
  source: configSource
});
report.assumptions.push("This validator checks completeness and routing signals only; it does not decide the underlying legal, tax, benefit, immigration, or company-law issue.");
report.next_steps.push("Fill missing required fields and resolve review items before using the workflow externally.");
report.required_documents.push("Source documents supporting every user-provided field.");
report.responsible_authority.push("User/operator");
report.responsible_authority.push("Qualified reviewer for professional-review items");

printReport(setStatus(report));
