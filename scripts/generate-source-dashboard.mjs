#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { isPastDate, loadSourceRegistry, resolveRepoPath } from "./lib/config.mjs";

const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

const outPath = argValue("--out");
const asOfArg = argValue("--as-of");
const asOf = asOfArg ? new Date(`${asOfArg}T00:00:00Z`) : new Date();
const asOfDate = asOf.toISOString().slice(0, 10);
const reviewSoonDays = Number(argValue("--review-soon-days") || 30);
const registry = loadSourceRegistry();

function daysUntil(dateString) {
  if (!dateString) return null;
  const reviewDate = new Date(`${dateString}T23:59:59Z`);
  if (Number.isNaN(reviewDate.getTime())) return null;
  return Math.ceil((reviewDate.getTime() - asOf.getTime()) / 86400000);
}

function freshnessStatus(source) {
  const required = ["id", "title", "authority", "source_url", "last_verified", "review_by", "risk_level"];
  if (required.some((field) => !source[field])) return "missing_metadata";
  if (isPastDate(source.review_by, asOf)) return "stale";
  const remaining = daysUntil(source.review_by);
  if (remaining !== null && remaining <= reviewSoonDays) return "review_due_soon";
  return "current";
}

function escapeCell(value) {
  return String(value ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|");
}

function sourceRow(source) {
  const remaining = daysUntil(source.review_by);
  const remainingText = remaining === null ? "unknown" : String(remaining);
  const usedFor = Array.isArray(source.used_for) ? source.used_for.join("; ") : "";
  return [
    source.id,
    source.authority,
    source.risk_level,
    source.last_verified,
    source.review_by,
    remainingText,
    freshnessStatus(source),
    usedFor,
    source.source_url
  ].map(escapeCell);
}

const rows = registry.sources.map(sourceRow);
const statusCounts = rows.reduce((counts, row) => {
  const status = row[6];
  counts[status] = (counts[status] || 0) + 1;
  return counts;
}, {});

const lines = [
  "# Source Freshness Dashboard",
  "",
  "This dashboard is generated from `sources/source-registry.json`. It does not fetch live official pages and does not certify that legal or tax content is current.",
  "",
  `Generated as of: \`${asOfDate}\``,
  "",
  "## Status Summary",
  "",
  `- \`current\`: ${statusCounts.current || 0}`,
  `- \`review_due_soon\`: ${statusCounts.review_due_soon || 0}`,
  `- \`stale\`: ${statusCounts.stale || 0}`,
  `- \`missing_metadata\`: ${statusCounts.missing_metadata || 0}`,
  "",
  "## Sources",
  "",
  "| source_id | authority | risk | last_verified | review_by | days_until_review | status | used_for | url |",
  "| --- | --- | --- | --- | --- | ---: | --- | --- | --- |",
  ...rows.map((row) => `| ${row.join(" | ")} |`),
  "",
  "## Maintainer Use",
  "",
  "- Treat `stale` as a release blocker for high-risk or professional-review sources.",
  "- Treat `review_due_soon` as a beta-readiness warning and schedule source review before release notes are finalized.",
  "- Update `last_verified` only after checking the cited official page and recording any rule or workflow changes.",
  "- Keep live source checking out of this dashboard until network behavior, authority-page redirects, and failure handling are explicitly designed.",
  ""
];

const markdown = `${lines.join("\n")}`;

if (outPath) {
  const absolute = path.isAbsolute(outPath) ? outPath : resolveRepoPath(outPath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, markdown);
  process.stderr.write(`Wrote source dashboard to ${absolute}\n`);
} else {
  process.stdout.write(markdown);
}
