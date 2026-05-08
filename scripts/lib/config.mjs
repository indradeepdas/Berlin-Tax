import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = path.resolve(fileURLToPath(new URL("../../", import.meta.url)));

export function resolveRepoPath(...parts) {
  return path.join(repoRoot, ...parts);
}

export function readJsonFile(filePath) {
  const absolute = path.isAbsolute(filePath) ? filePath : resolveRepoPath(filePath);
  return JSON.parse(fs.readFileSync(absolute, "utf8"));
}

export function loadRules() {
  return readJsonFile("config/rules.de.berlin.json");
}

export function loadOutputStandard() {
  return readJsonFile("config/output-standard.json");
}

export function loadSourceRegistry() {
  return readJsonFile("sources/source-registry.json");
}

export function sourceMap(registry = loadSourceRegistry()) {
  return new Map(registry.sources.map((source) => [source.id, source]));
}

export function collectObjectsWithSourceIds(value, pathParts = [], found = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectObjectsWithSourceIds(item, [...pathParts, String(index)], found));
    return found;
  }

  if (!value || typeof value !== "object") return found;

  if (typeof value.source_id === "string") {
    found.push({
      path: pathParts.join("."),
      source_id: value.source_id,
      review_by: value.review_by,
      last_verified: value.last_verified,
      risk_level: value.risk_level,
      verification_checkpoint: value.verification_checkpoint
    });
  }

  for (const [key, child] of Object.entries(value)) {
    collectObjectsWithSourceIds(child, [...pathParts, key], found);
  }

  return found;
}

export function isPastDate(dateString, asOf = new Date()) {
  if (!dateString) return true;
  const date = new Date(`${dateString}T23:59:59Z`);
  return Number.isNaN(date.getTime()) || date < asOf;
}

export function createReport({ status = "pass", title, source_ids = [], user_input = {} }) {
  return {
    status,
    title,
    verified_facts: [],
    user_provided_inputs: Object.entries(user_input)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => ({ key, value })),
    assumptions: [],
    open_verification_items: [],
    verification_checkpoints: [],
    professional_review_items: [],
    findings: [],
    next_steps: [],
    required_documents: [],
    responsible_authority: [],
    source_notes: source_ids
  };
}

export function setStatus(report) {
  if (report.findings.some((finding) => finding.level === "error")) {
    report.status = "fail";
  } else if (
    report.findings.some((finding) => finding.level === "warning" || finding.level === "review") ||
    report.professional_review_items.length > 0 ||
    report.open_verification_items.length > 0
  ) {
    report.status = "review";
  } else {
    report.status = "pass";
  }
  return report;
}

export function printReport(report) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}
