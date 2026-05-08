#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { createReport, loadRules, printReport, setStatus } from "./lib/config.mjs";

const inputPath = process.argv[2];
if (!inputPath) {
  process.stderr.write("Usage: node scripts/check-thresholds.mjs <threshold-input.json>\n");
  process.exit(2);
}

const input = JSON.parse(readFileSync(inputPath, "utf8"));
const rules = loadRules();
const priorLimit = rules.kleinunternehmer.prior_calendar_year_total_revenue_limit_eur.value;
const currentLimit = rules.kleinunternehmer.current_calendar_year_total_revenue_limit_eur.value;
const warningRatio = rules.kleinunternehmer.monitoring_warning_ratio.value;

const report = createReport({
  title: "Kleinunternehmer threshold monitoring",
  source_ids: ["ustg-19"],
  user_input: input
});

const priorRevenue = Number(input.prior_calendar_year_revenue_eur);
const currentRevenue = Number(input.current_year_revenue_to_date_eur);
const forecastRevenue = Number(input.forecast_current_year_revenue_eur);

report.verified_facts.push({
  fact: "Threshold values were loaded from config/rules.de.berlin.json, not hardcoded in the script.",
  source_id: "ustg-19"
});

if (!Number.isFinite(priorRevenue)) {
  report.findings.push({
    level: "error",
    code: "missing_prior_year_revenue",
    message: "prior_calendar_year_revenue_eur must be numeric.",
    source_id: "ustg-19"
  });
} else if (priorRevenue > priorLimit) {
  report.findings.push({
    level: "review",
    code: "prior_year_limit_exceeded",
    message: "Prior calendar year revenue exceeds the configured Kleinunternehmer prior-year limit candidate.",
    source_id: "ustg-19"
  });
} else if (priorRevenue >= priorLimit * warningRatio) {
  report.findings.push({
    level: "warning",
    code: "near_prior_year_limit",
    message: "Prior calendar year revenue is near the configured limit. Confirm calculations with an accountant.",
    source_id: "ustg-19"
  });
}

if (Number.isFinite(currentRevenue) && currentRevenue > currentLimit) {
  report.findings.push({
    level: "review",
    code: "current_year_limit_exceeded",
    message: "Current-year revenue to date exceeds the configured current-year limit candidate.",
    source_id: "ustg-19"
  });
}

if (Number.isFinite(forecastRevenue) && forecastRevenue >= currentLimit * warningRatio) {
  report.findings.push({
    level: "warning",
    code: "current_year_forecast_near_limit",
    message: "Forecast revenue is near the configured current-year limit. Recheck before issuing more invoices under assumed Kleinunternehmer treatment.",
    source_id: "ustg-19"
  });
}

report.assumptions.push("Revenue inputs are total revenue figures relevant to the cited Kleinunternehmer rule, not profit.");
report.assumptions.push("The script does not decide eligibility, option exercises, cross-border treatment, or special cases.");
report.professional_review_items.push({
  item: "Confirm eligibility, opt-out history, and VAT treatment with a Steuerberater before relying on the result.",
  source_id: "ustg-19"
});
report.next_steps.push("Attach revenue calculation detail to the accountant handoff.");
report.next_steps.push("Update the monitoring input after each invoice batch.");
report.required_documents.push("Sales ledger for prior calendar year.");
report.required_documents.push("Current-year sales ledger and forecast basis.");
report.responsible_authority.push("Steuerberater");
report.responsible_authority.push("Finanzamt for binding case handling");

printReport(setStatus(report));

