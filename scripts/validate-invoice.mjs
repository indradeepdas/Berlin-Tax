#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { createReport, loadRules, printReport, setStatus } from "./lib/config.mjs";

const inputPath = process.argv[2];
if (!inputPath) {
  process.stderr.write("Usage: node scripts/validate-invoice.mjs <invoice.json>\n");
  process.exit(2);
}

const invoice = JSON.parse(readFileSync(inputPath, "utf8"));
const rules = loadRules();
const smallLimit = rules.invoice.small_invoice_gross_limit_eur.value;
const isSmallInvoice = Number(invoice.gross_total_eur) <= smallLimit;
const required = isSmallInvoice
  ? rules.invoice.small_invoice_required_fields.value
  : rules.invoice.regular_required_fields.value;

const report = createReport({
  title: "Invoice compliance validation",
  source_ids: [
    rules.invoice.regular_required_fields.source_id,
    rules.invoice.small_invoice_required_fields.source_id,
    rules.invoice.e_invoice_review_required_for_domestic_b2b.source_id
  ],
  user_input: {
    invoice_number: invoice.invoice_number,
    issue_date: invoice.issue_date,
    gross_total_eur: invoice.gross_total_eur,
    tax_regime: invoice.tax_regime,
    relationship: invoice.relationship
  }
});

report.verified_facts.push({
  fact: isSmallInvoice ? "Input is at or below the configured small-invoice gross threshold." : "Input exceeds the configured small-invoice gross threshold.",
  source_id: rules.invoice.small_invoice_gross_limit_eur.source_id
});

function hasPath(obj, dottedPath) {
  if (dottedPath === "supplier.tax_number_or_vat_id") {
    return Boolean(obj?.supplier?.tax_number || obj?.supplier?.vat_id);
  }
  if (dottedPath === "vat_rate_or_exemption_note") {
    return Boolean(obj?.vat_breakdown?.length || obj?.notes);
  }
  let cursor = obj;
  for (const part of dottedPath.split(".")) {
    if (cursor === undefined || cursor === null || !(part in cursor)) return false;
    cursor = cursor[part];
  }
  return cursor !== undefined && cursor !== null && cursor !== "";
}

for (const field of required) {
  if (!hasPath(invoice, field)) {
    report.findings.push({
      level: "error",
      code: "missing_required_field",
      message: `Missing required invoice field candidate: ${field}`,
      source_id: isSmallInvoice ? rules.invoice.small_invoice_required_fields.source_id : rules.invoice.regular_required_fields.source_id
    });
  }
}

if (!Array.isArray(invoice.line_items) || invoice.line_items.length === 0) {
  report.findings.push({
    level: "error",
    code: "missing_line_items",
    message: "Invoice has no line items.",
    source_id: rules.invoice.regular_required_fields.source_id
  });
}

if (invoice.currency !== "EUR") {
  report.findings.push({
    level: "warning",
    code: "non_eur_currency",
    message: "Currency is not EUR. Add review for FX conversion, VAT display, and accountant handling.",
    source_id: rules.invoice.regular_required_fields.source_id
  });
}

if (invoice.tax_regime === "kleinunternehmer") {
  const notes = String(invoice.notes || "").toLowerCase();
  if (!notes.includes("19") && !notes.includes("kleinunternehmer")) {
    report.findings.push({
      level: "warning",
      code: "missing_kleinunternehmer_note",
      message: "Kleinunternehmer invoice lacks an obvious UStG 19 or Kleinunternehmer note.",
      source_id: "ustg-19"
    });
  }
  if (Array.isArray(invoice.vat_breakdown) && invoice.vat_breakdown.some((item) => Number(item.vat_amount_eur) > 0)) {
    report.findings.push({
      level: "review",
      code: "kleinunternehmer_with_vat_amount",
      message: "Input claims Kleinunternehmer treatment but includes VAT amounts. Send to tax adviser before use.",
      source_id: "ustg-19"
    });
  }
}

if (invoice.relationship === "domestic_b2b" && rules.invoice.e_invoice_review_required_for_domestic_b2b.value) {
  report.professional_review_items.push({
    item: "Domestic B2B invoice detected. Check current e-invoice obligations and transition rules before issuing.",
    source_id: rules.invoice.e_invoice_review_required_for_domestic_b2b.source_id
  });
}

report.next_steps.push("Correct missing fields before issuing or booking the invoice.");
report.next_steps.push("Attach the invoice and validation report to the accountant handoff if any warning or review item remains.");
report.required_documents.push("Invoice draft or export from billing tool.");
report.required_documents.push("Evidence for service date or delivery period.");
report.responsible_authority.push("User billing process");
report.responsible_authority.push("Steuerberater for review items");

printReport(setStatus(report));
