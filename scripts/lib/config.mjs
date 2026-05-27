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

export function readCliJsonFileOrExit(filePath, label = "input") {
  if (!filePath) {
    process.stderr.write(`Missing ${label} file path.\n`);
    process.exit(2);
  }

  const absolute = path.isAbsolute(filePath) ? filePath : resolveRepoPath(filePath);

  if (!fs.existsSync(absolute)) {
    process.stderr.write(`Could not find ${label} file: ${absolute}\n`);
    process.exit(2);
  }

  let raw;
  try {
    raw = fs.readFileSync(absolute, "utf8");
  } catch (error) {
    process.stderr.write(`Could not read ${label} file: ${absolute}\n`);
    if (error?.message) process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    process.stderr.write(`Invalid JSON in ${label} file: ${absolute}\n`);
    if (error?.message) process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
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

const DEFAULT_BOUNDARY_NOTICE =
  "Preparation-only output. This is not legal, tax, accounting, immigration, employment, benefit, or company-law advice and is not submission-ready.";

const DEFAULT_PROFESSIONAL_REVIEW_REQUIRED = [
  "Professional or authority review is required for every item listed in professional_review_items and before any external submission, filing, invoice issuance, correction, or authority response."
];

const DEFAULT_VERIFICATION_BEFORE_SUBMISSION = [
  "Verify every cited source against the current official source before real-world use.",
  "Reconcile user-provided facts to source documents and evidence before external use.",
  "Resolve open verification items and professional-review items before submission or issuance."
];

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function collectSourceIds(value, found = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectSourceIds(item, found));
    return found;
  }

  if (!value || typeof value !== "object") return found;

  if (typeof value.source_id === "string") found.add(value.source_id);
  if (Array.isArray(value.source_notes)) {
    value.source_notes.filter((item) => typeof item === "string").forEach((item) => found.add(item));
  }

  for (const child of Object.values(value)) collectSourceIds(child, found);
  return found;
}

function buildSourceReferences(report) {
  let sources = new Map();
  try {
    sources = sourceMap(loadSourceRegistry());
  } catch {
    sources = new Map();
  }

  const existing = asArray(report.verified_source_references).map((reference) => {
    if (!reference?.source_id) return reference;
    const source = sources.get(reference.source_id);
    return {
      source_id: reference.source_id,
      title: reference.title ?? source?.title,
      authority: reference.authority ?? source?.authority,
      source_url: reference.source_url ?? source?.source_url,
      registry_last_verified: reference.registry_last_verified ?? source?.last_verified,
      registry_review_by: reference.registry_review_by ?? source?.review_by,
      status: reference.status ?? "registry_reference_requires_current_verification"
    };
  });
  const existingIds = new Set(existing.map((item) => item.source_id).filter(Boolean));
  const collectedIds = collectSourceIds(report);
  for (const sourceId of collectedIds) {
    if (existingIds.has(sourceId)) continue;
    const source = sources.get(sourceId);
    existing.push({
      source_id: sourceId,
      title: source?.title,
      authority: source?.authority,
      source_url: source?.source_url,
      registry_last_verified: source?.last_verified,
      registry_review_by: source?.review_by,
      status: "registry_reference_requires_current_verification"
    });
  }
  return existing;
}

function uniqueStrings(values) {
  return [...new Set(values.filter((item) => typeof item === "string" && item.trim() !== ""))];
}

export function normalizeReportForOutput(report) {
  const normalized = {
    ...report,
    boundary_notice: report.boundary_notice || DEFAULT_BOUNDARY_NOTICE,
    assumptions: asArray(report.assumptions),
    user_provided_inputs: asArray(report.user_provided_inputs),
    verified_facts: asArray(report.verified_facts),
    verified_source_references: buildSourceReferences(report),
    professional_review_required: asArray(report.professional_review_required).length
      ? asArray(report.professional_review_required)
      : DEFAULT_PROFESSIONAL_REVIEW_REQUIRED,
    professional_review_items: asArray(report.professional_review_items),
    verification_before_submission: uniqueStrings([
      ...DEFAULT_VERIFICATION_BEFORE_SUBMISSION,
      ...asArray(report.verification_before_submission)
    ]),
    open_verification_items: asArray(report.open_verification_items),
    verification_checkpoints: asArray(report.verification_checkpoints),
    findings: asArray(report.findings),
    next_steps: asArray(report.next_steps),
    required_documents: asArray(report.required_documents),
    responsible_authority: asArray(report.responsible_authority),
    source_notes: asArray(report.source_notes)
  };

  const orderedKeys = [
    "status",
    "title",
    "boundary_notice",
    "assumptions",
    "user_provided_inputs",
    "verified_facts",
    "verified_source_references",
    "professional_review_required",
    "professional_review_items",
    "verification_before_submission",
    "open_verification_items",
    "verification_checkpoints",
    "findings",
    "next_steps",
    "required_documents",
    "responsible_authority",
    "source_notes"
  ];
  const ordered = {};
  for (const key of orderedKeys) {
    if (key in normalized) ordered[key] = normalized[key];
  }
  for (const [key, value] of Object.entries(normalized)) {
    if (!(key in ordered)) ordered[key] = value;
  }
  return ordered;
}

export function createReport({ status = "pass", title, source_ids = [], user_input = {} }) {
  return {
    status,
    title,
    boundary_notice: DEFAULT_BOUNDARY_NOTICE,
    assumptions: [],
    user_provided_inputs: Object.entries(user_input)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => ({ key, value })),
    verified_facts: [],
    verified_source_references: source_ids.map((source_id) => ({ source_id, status: "registry_reference_requires_current_verification" })),
    professional_review_required: [...DEFAULT_PROFESSIONAL_REVIEW_REQUIRED],
    professional_review_items: [],
    verification_before_submission: [...DEFAULT_VERIFICATION_BEFORE_SUBMISSION],
    open_verification_items: [],
    verification_checkpoints: [],
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
  process.stdout.write(`${JSON.stringify(normalizeReportForOutput(report), null, 2)}\n`);
}
