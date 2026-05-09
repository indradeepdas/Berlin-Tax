#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { repoRoot } from "./lib/config.mjs";

const scenarioRoot = "examples/golden-path/solo-consulting-side-business";
const checks = [
  {
    name: "Operational intake",
    command: ["scripts/validate-workflow.mjs", "operational_intake", `${scenarioRoot}/intake.json`]
  },
  {
    name: "Draft invoice",
    command: ["scripts/validate-invoice.mjs", `${scenarioRoot}/invoice-draft.json`]
  },
  {
    name: "Kleinunternehmer monitoring",
    command: ["scripts/check-thresholds.mjs", `${scenarioRoot}/threshold-monitoring.json`]
  },
  {
    name: "UStVA readiness calendar",
    command: ["scripts/generate-compliance-calendar.mjs", `${scenarioRoot}/ustva-readiness-profile.json`]
  },
  {
    name: "Accountant handoff",
    command: ["scripts/validate-workflow.mjs", "accountant_handoff", `${scenarioRoot}/accountant-handoff.json`]
  }
];

function runCheck(check) {
  const result = spawnSync(process.execPath, check.command, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });

  if (result.status !== 0) {
    return {
      name: check.name,
      status: "fail",
      exit_code: result.status,
      stderr: result.stderr.trim()
    };
  }

  try {
    const parsed = JSON.parse(result.stdout);
    return {
      name: check.name,
      status: parsed.status,
      review_items: Array.isArray(parsed.professional_review_items) ? parsed.professional_review_items.length : 0,
      open_items: Array.isArray(parsed.open_verification_items) ? parsed.open_verification_items.length : 0,
      findings: Array.isArray(parsed.findings) ? parsed.findings.length : 0
    };
  } catch (error) {
    return {
      name: check.name,
      status: "fail",
      exit_code: 1,
      stderr: `Could not parse JSON output: ${error.message}`
    };
  }
}

const results = checks.map(runCheck);
const packetPaths = [
  `${scenarioRoot}/gewerbe-prep-packet.md`,
  `${scenarioRoot}/finanzamt-onboarding-packet.md`,
  `${scenarioRoot}/accountant-handoff-packet.md`
];

process.stdout.write("# Berlin-Tax Golden Path Check\n\n");
process.stdout.write("Scenario: Berlin solo founder starting a consulting side business.\n\n");
process.stdout.write("## Human-Readable Packets\n\n");
for (const packetPath of packetPaths) {
  process.stdout.write(`- ${path.join(repoRoot, packetPath)}\n`);
}

process.stdout.write("\n## Deterministic Checks\n\n");
process.stdout.write("| check | status | findings | review_items | open_items |\n");
process.stdout.write("| --- | --- | ---: | ---: | ---: |\n");
for (const result of results) {
  process.stdout.write(`| ${result.name} | ${result.status} | ${result.findings ?? "n/a"} | ${result.review_items ?? "n/a"} | ${result.open_items ?? "n/a"} |\n`);
}

process.stdout.write("\n## Remaining Review Gates\n\n");
process.stdout.write("- Freiberufler vs Gewerbe classification is unresolved by design.\n");
process.stdout.write("- Kleinunternehmer posture is a planning assumption, not an eligibility decision.\n");
process.stdout.write("- Domestic B2B invoicing requires e-invoice format review before issuance.\n");
process.stdout.write("- UStVA dates are readiness candidates and must be checked against ELSTER/Finanzamt correspondence.\n");
process.stdout.write("- Employer contract or side-business permission evidence remains missing in the fixture.\n");

if (results.some((result) => result.status === "fail")) {
  process.stdout.write("\nOne or more golden-path checks failed.\n");
  process.exit(1);
}
