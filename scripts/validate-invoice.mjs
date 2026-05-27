#!/usr/bin/env node
import { createReport, loadRules, printReport, readCliJsonFileOrExit, setStatus } from "./lib/config.mjs";

const inputPath = process.argv[2];
if (!inputPath) {
  process.stderr.write("Usage: node scripts/validate-invoice.mjs <invoice.json>\n");
  process.exit(2);
}

const invoice = readCliJsonFileOrExit(inputPath, "invoice");
const rules = loadRules();
const smallLimit = rules.invoice.small_invoice_gross_limit_eur.value;
const isSmallInvoice = Number(invoice.gross_total_eur) <= smallLimit;
const domesticRelationships = new Set(["domestic_b2b", "domestic_b2c"]);
const smallInvoiceReliefCandidate = isSmallInvoice && domesticRelationships.has(invoice.relationship) && !invoice.special_vat_case;
const ruleSet = invoice.tax_regime === "kleinunternehmer"
  ? rules.invoice.kleinunternehmer_required_fields
  : smallInvoiceReliefCandidate
    ? rules.invoice.small_invoice_required_fields
    : rules.invoice.regular_required_fields;
const required = ruleSet.value;

const report = createReport({
  title: "Invoice compliance validation",
  source_ids: [
    rules.invoice.regular_required_fields.source_id,
    rules.invoice.small_invoice_required_fields.source_id,
    rules.invoice.kleinunternehmer_required_fields.source_id,
    "ustg-19",
    rules.invoice.e_invoice_review_required_for_domestic_b2b.source_id
  ],
  user_input: {
    invoice_number: invoice.invoice_number,
    issue_date: invoice.issue_date,
    gross_total_eur: invoice.gross_total_eur,
    tax_regime: invoice.tax_regime,
    relationship: invoice.relationship,
    business_sector: invoice.business_sector,
    document_format: invoice.document_format,
    document_state: invoice.document_state,
    special_vat_case: Boolean(invoice.special_vat_case)
  }
});

report.verified_facts.push({
  fact: isSmallInvoice
    ? "Based on the user-provided gross total, the invoice is at or below the configured small-invoice amount candidate."
    : "Based on the user-provided gross total, the invoice exceeds the configured small-invoice amount candidate.",
  source_id: rules.invoice.small_invoice_gross_limit_eur.source_id
});
report.verified_facts.push({
  fact: `The validator selected the ${invoice.tax_regime === "kleinunternehmer" ? "Kleinunternehmer" : smallInvoiceReliefCandidate ? "small-invoice" : "regular invoice"} field checklist. This is a validation path, not a legal conclusion.`,
  source_id: ruleSet.source_id
});
report.verification_checkpoints.push(rules.invoice.small_invoice_gross_limit_eur.verification_checkpoint);
report.verification_checkpoints.push(ruleSet.verification_checkpoint);
report.open_verification_items.push("This validator does not validate XRechnung/ZUGFeRD XML, VAT ID validity, e-invoice transmission, or the user's actual VAT treatment.");

function hasPath(obj, dottedPath) {
  if (dottedPath === "supplier.tax_number_or_vat_id") {
    return Boolean(obj?.supplier?.tax_number || obj?.supplier?.vat_id);
  }
  if (dottedPath === "vat_rate_or_exemption_note") {
    return Boolean(obj?.vat_breakdown?.length || obj?.notes);
  }
  if (dottedPath === "kleinunternehmer_exemption_note") {
    const notes = String(obj?.notes || "").toLowerCase();
    return notes.includes("kleinunternehmer") || notes.includes("ustg 19");
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
      source_id: ruleSet.source_id
    });
  }
}

if (isSmallInvoice && !smallInvoiceReliefCandidate && invoice.tax_regime !== "kleinunternehmer") {
  report.findings.push({
    level: "review",
    code: "small_invoice_relief_not_selected",
    message: "Invoice amount is within the small-invoice range, but relationship or special VAT indicators require review before using relaxed small-invoice fields.",
    source_id: rules.invoice.small_invoice_required_fields.source_id
  });
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
  report.verification_before_submission.push("For domestic B2B invoices, verify whether the invoice must be a structured e-invoice and use a dedicated XRechnung/ZUGFeRD-capable tool or professional review before issuance.");
  const format = String(invoice.document_format || "").toLowerCase();
  report.findings.push({
    level: "review",
    code: "e_invoice_format_review_required",
    message: "Domestic B2B context detected. This validator checks field completeness only and does not validate XRechnung, ZUGFeRD, XML syntax, or e-invoice transmission readiness.",
    source_id: rules.invoice.e_invoice_review_required_for_domestic_b2b.source_id
  });
  if (!format || ["pdf", "pdf_draft", "spreadsheet", "word_processor"].includes(format)) {
    report.findings.push({
      level: "warning",
      code: "e_invoice_format_not_structured",
      message: "Input document format is missing or appears unstructured. Treat PDF/spreadsheet invoice drafts as review material, not as e-invoice validation evidence.",
      source_id: rules.invoice.e_invoice_review_required_for_domestic_b2b.source_id
    });
  }
  report.professional_review_items.push({
    item: invoice.tax_regime === "kleinunternehmer"
      ? "Domestic B2B Kleinunternehmer invoice detected. Check current e-invoice obligations, UStDV 34a relief, and transition rules before issuing."
      : "Domestic B2B invoice detected. Check current e-invoice obligations and transition rules before issuing.",
    source_id: rules.invoice.e_invoice_review_required_for_domestic_b2b.source_id
  });
  report.verification_checkpoints.push(rules.invoice.e_invoice_review_required_for_domestic_b2b.verification_checkpoint);
}

if (!domesticRelationships.has(invoice.relationship)) {
  report.professional_review_items.push({
    item: "Non-domestic or unknown customer relationship detected. Review VAT place-of-supply, reverse charge, VAT ID, OSS, and local invoicing rules before issuing.",
    source_id: rules.invoice.regular_required_fields.source_id
  });
}

const sector = String(invoice.business_sector || "").toLowerCase();
if (["restaurant", "hospitality", "food_service", "alcohol", "pos_retail"].includes(sector)) {
  if (!report.source_notes.includes("berlin-gaststaette-permit")) {
    report.source_notes.push("berlin-gaststaette-permit");
  }
  report.professional_review_items.push({
    item: "Restaurant, hospitality, food service, alcohol, or POS/cash-register context detected. Review receipt, cash-register, VAT-rate, permit, and correction handling before issuing or replacing documents.",
    source_id: "berlin-gaststaette-permit"
  });
  report.verification_checkpoints.push("For restaurant/POS cases, reconcile invoice data to cash register/POS exports, Z-reports, menus, payment provider records, and booking records before correction.");
}

const state = String(invoice.document_state || "draft").toLowerCase();
if (["sent", "paid", "booked", "reported", "correction", "credit_note", "cancellation"].includes(state)) {
  report.professional_review_items.push({
    item: "Invoice appears to be sent, paid, booked, reported, or a correction. Do not silently replace it; prepare a correction packet for professional review.",
    source_id: rules.invoice.regular_required_fields.source_id
  });
  report.verification_checkpoints.push("Before changing an issued document, identify the original invoice, customer delivery state, payment state, booking state, and VAT reporting period.");
}

report.next_steps.push("Correct missing fields before issuing or booking the invoice.");
report.next_steps.push("Attach the invoice and validation report to the accountant handoff if any warning or review item remains.");
report.required_documents.push("Invoice draft or export from billing tool.");
report.required_documents.push("Evidence for service date or delivery period.");
report.responsible_authority.push("User billing process");
report.responsible_authority.push("Steuerberater for review items");

printReport(setStatus(report));
