#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  createReport,
  loadSourceRegistry,
  printReport,
  readCliJsonFileOrExit,
  resolveRepoPath,
  setStatus,
  sourceMap
} from "./lib/config.mjs";

const asOf = new Date().toISOString().slice(0, 10);
const sourceRegistry = loadSourceRegistry();
const sources = sourceMap(sourceRegistry);
const rules = readCliJsonFileOrExit("config/beta-readiness.json", "beta-readiness config");
const report = createReport({
  title: "Public beta readiness check",
  source_ids: sourceRegistry.sources.map((source) => source.id),
  user_input: {
    as_of: asOf,
    config_path: "config/beta-readiness.json"
  }
});

function addFinding(level, code, message, sourceId) {
  report.findings.push({
    level,
    code,
    message,
    source_id: sourceId
  });
}

function addCheckpoint(message) {
  if (!report.verification_checkpoints.includes(message)) {
    report.verification_checkpoints.push(message);
  }
}

function addNextStep(message) {
  if (!report.next_steps.includes(message)) {
    report.next_steps.push(message);
  }
}

function runCommand(name, command, args) {
  const result = spawnSync(command, args, {
    cwd: resolveRepoPath(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 10 * 1024 * 1024
  });

  if (result.error) {
    addFinding("error", "command_execution_error", `${name} could not be executed: ${result.error.message}`, undefined);
    addNextStep(`Fix ${name} execution before calling the repo public beta-ready.`);
    return null;
  }

  if (result.status !== 0) {
    addFinding("error", "command_failed", `${name} failed with exit code ${result.status}.`, undefined);
    addNextStep(`Fix ${name} before calling the repo public beta-ready.`);
    return null;
  }

  report.verified_facts.push({
    fact: `${name} passed during the public beta gate.`,
    source: `${command} ${args.join(" ")}`
  });
  return result;
}

function readText(filePath, label) {
  const absolute = resolveRepoPath(filePath);
  if (!fs.existsSync(absolute)) {
    addFinding("error", "missing_file", `Missing required ${label}: ${filePath}`, undefined);
    return null;
  }
  return fs.readFileSync(absolute, "utf8");
}

function requirePatterns() {
  for (const doc of rules.required_docs || []) {
    const content = readText(doc.path, "documentation file");
    if (content === null) continue;
    for (const pattern of doc.required_patterns || []) {
      if (!content.includes(pattern)) {
        addFinding("error", "missing_required_pattern", `${doc.path} is missing required public-beta text: ${pattern}`, undefined);
      }
    }
  }
}

function requirePacketHeadings() {
  for (const packet of rules.required_packets || []) {
    const content = readText(packet.path, "golden-path packet");
    if (content === null) continue;
    for (const heading of packet.required_headings || []) {
      if (!content.includes(heading)) {
        addFinding("error", "missing_packet_heading", `${packet.path} is missing required heading: ${heading}`, undefined);
      }
    }
  }
}

function checkDashboardFreshness() {
  const dashboard = readText("docs/SOURCE_DASHBOARD.md", "source dashboard");
  if (dashboard === null) return;

  const generatedMatch = dashboard.match(/Generated as of: `(\d{4}-\d{2}-\d{2})`/);
  if (!generatedMatch) {
    addFinding("error", "dashboard_missing_generated_date", "docs/SOURCE_DASHBOARD.md is missing a generated date.", undefined);
    return;
  }

  if (generatedMatch[1] !== asOf) {
    addFinding("error", "dashboard_not_current", `docs/SOURCE_DASHBOARD.md is dated ${generatedMatch[1]} instead of ${asOf}.`, undefined);
    addNextStep("Regenerate docs/SOURCE_DASHBOARD.md on the release day.");
  } else {
    report.verified_facts.push({
      fact: `docs/SOURCE_DASHBOARD.md is current for ${asOf}.`,
      source: "docs/SOURCE_DASHBOARD.md"
    });
  }

  const staleMatch = dashboard.match(/- `stale`: (\d+)/);
  const missingMetadataMatch = dashboard.match(/- `missing_metadata`: (\d+)/);
  if (!staleMatch || Number(staleMatch[1]) > 0) {
    addFinding("error", "stale_sources_present", "Source dashboard shows one or more stale sources.", undefined);
  }
  if (!missingMetadataMatch || Number(missingMetadataMatch[1]) > 0) {
    addFinding("error", "dashboard_missing_metadata", "Source dashboard shows missing source metadata.", undefined);
  }
}

function checkFriendlyCliFailures() {
  const missingWorkflow = spawnSync(process.execPath, ["scripts/validate-workflow.mjs", "operational_intake", "missing-file.json"], {
    cwd: resolveRepoPath(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (missingWorkflow.status === 0 || !missingWorkflow.stderr.includes("Could not find workflow input file")) {
    addFinding("error", "workflow_missing_file_error_unfriendly", "Workflow validator missing-file path is not returning the expected human-readable error.", undefined);
  } else {
    report.verified_facts.push({
      fact: "Workflow validator returns a human-readable missing-file error.",
      source: "scripts/validate-workflow.mjs"
    });
  }

  const invalidInvoicePath = path.join(os.tmpdir(), `berlin-tax-invalid-invoice-${process.pid}.json`);
  fs.writeFileSync(invalidInvoicePath, "{ invalid json");
  const invalidInvoice = spawnSync(process.execPath, ["scripts/validate-invoice.mjs", invalidInvoicePath], {
    cwd: resolveRepoPath(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  fs.unlinkSync(invalidInvoicePath);
  if (invalidInvoice.status === 0 || !invalidInvoice.stderr.includes("Invalid JSON in invoice file")) {
    addFinding("error", "invoice_invalid_json_error_unfriendly", "Invoice validator invalid-JSON path is not returning the expected human-readable error.", undefined);
  } else {
    report.verified_facts.push({
      fact: "Invoice validator returns a human-readable invalid-JSON error.",
      source: "scripts/validate-invoice.mjs"
    });
  }
}

function checkGoldenPathIntent() {
  const content = readText("scripts/run-golden-path.mjs", "golden-path runner");
  if (content === null) return;
  const requiredReviewGates = [
    "Freiberufler vs Gewerbe classification is unresolved by design.",
    "Kleinunternehmer posture is a planning assumption, not an eligibility decision.",
    "Domestic B2B invoicing requires e-invoice format review before issuance.",
    "UStVA dates are readiness candidates and must be checked against ELSTER/Finanzamt correspondence."
  ];
  for (const line of requiredReviewGates) {
    if (!content.includes(line)) {
      addFinding("error", "golden_path_missing_review_gate", `Golden-path runner is missing required review-gate output: ${line}`, undefined);
    }
  }
}

const commandChecks = [
  ["skill validation", process.execPath, ["scripts/validate-skill.mjs"]],
  ["source audit", process.execPath, ["scripts/audit-sources.mjs"]],
  ["self audit", process.execPath, ["scripts/self-audit.mjs"]],
  ["sample invoice validation", process.execPath, ["scripts/validate-invoice.mjs", "examples/invoices/kleinunternehmer-b2b-review.json"]],
  ["threshold monitoring sample", process.execPath, ["scripts/check-thresholds.mjs", "examples/thresholds/kleinunternehmer-monitoring.json"]],
  ["calendar sample", process.execPath, ["scripts/generate-compliance-calendar.mjs", "examples/profiles/ug-founder-berlin.json"]],
  ["workflow intake sample", process.execPath, ["scripts/validate-workflow.mjs", "operational_intake", "examples/intake/non-eu-gewerbe-intake.json"]],
  ["workflow handoff sample", process.execPath, ["scripts/validate-workflow.mjs", "accountant_handoff", "examples/handoffs/solo-founder-handoff.json"]],
  ["workflow contradictory-advice sample", process.execPath, ["scripts/validate-workflow.mjs", "contradictory_advice", "examples/advice/contradictory-online-advice.json"]],
  ["stress restaurant invoice", process.execPath, ["scripts/validate-invoice.mjs", "examples/invoices/restaurant-incorrect.json"]],
  ["stress EU invoice", process.execPath, ["scripts/validate-invoice.mjs", "examples/invoices/eu-contractor-review.json"]],
  ["stress threshold crossing", process.execPath, ["scripts/check-thresholds.mjs", "examples/thresholds/kleinunternehmer-crossed-midyear.json"]],
  ["stress missed UStVA", process.execPath, ["scripts/generate-compliance-calendar.mjs", "examples/profiles/missed-vat-deadlines.json"]],
  ["golden-path runner", process.execPath, ["scripts/run-golden-path.mjs"]]
];

for (const [name, command, args] of commandChecks) {
  runCommand(name, command, args);
}

requirePatterns();
requirePacketHeadings();
checkDashboardFreshness();
checkFriendlyCliFailures();
checkGoldenPathIntent();

report.assumptions.push("This gate checks repository quality, deterministic behavior, and public documentation consistency. It does not prove legal correctness or replace expert review.");
report.assumptions.push("Public beta does not remove professional-review boundaries around invoice tax treatment, activity classification, immigration, benefits, payroll, or authority-specific instructions.");
addCheckpoint("Before announcing public beta, regenerate the source dashboard and rerun this check on the same day.");
addCheckpoint("Before announcing public beta, verify that README, BETA_READINESS, and the golden-path packets still match the current deterministic behavior.");
addNextStep("Publish only if this check returns pass and has no error findings.");
report.required_documents.push("Current source dashboard.");
report.required_documents.push("Golden-path packets.");
report.required_documents.push("Latest README and beta-readiness docs.");
report.responsible_authority.push("Berlin-Tax maintainers");

printReport(setStatus(report));

if (report.findings.some((finding) => finding.level === "error")) {
  process.exit(1);
}
