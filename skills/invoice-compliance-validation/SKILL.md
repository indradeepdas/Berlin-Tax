---
name: invoice-compliance-validation
description: Validate German invoice preparation inputs for Berlin founders, freelancers, Kleinunternehmer, and small businesses. Use for deterministic invoice field checks, e-invoice review flags, accountant handoff reports, and source-backed warnings without guaranteeing legal compliance.
---

# Invoice Compliance Validation

## Purpose

Validate whether an invoice draft contains required field candidates and obvious risk flags. The skill does not certify compliance. It prepares corrections and review questions.

## Workflow

1. Ask for the invoice JSON or enough invoice fields to create one.
2. Identify relationship type: domestic B2B, domestic B2C, EU B2B, EU B2C, non-EU, or unknown.
3. Identify tax regime: regular VAT, Kleinunternehmer, or unknown.
4. Identify whether the invoice comes from a restaurant, POS/cash register, marketplace, reverse-charge, credit-note, or correction context.
5. Run `scripts/validate-invoice.mjs` on structured invoice JSON.
6. Convert findings into an accountant handoff draft using the shared output standard. If the invoice belongs in a broader handoff, run `node scripts/validate-workflow.mjs accountant_handoff <input.json>` on the handoff package.
7. For domestic B2B cases, treat the validator output as e-invoice awareness only. It does not validate XRechnung, ZUGFeRD, XML syntax, transmission, or VAT ID validity.

## Required Inputs

- Supplier name and address.
- Customer name and address.
- Supplier tax number or VAT ID if regular invoice.
- Invoice number and issue date.
- Service date or delivery period.
- Line items.
- Net total, VAT breakdown, and gross total where applicable.
- Tax regime assumption.
- Customer relationship and country.
- Business sector and whether cash/POS receipts are involved.
- Whether this is an original invoice, correction, cancellation, credit note, receipt, or duplicate.
- Notes printed on the invoice.

## Outputs

- Deterministic validation report.
- Missing field list.
- Kleinunternehmer note warning if applicable.
- Domestic B2B e-invoice review flag.
- Explicit open verification item for XRechnung/ZUGFeRD, VAT ID, transmission, and tax-treatment limitations.
- Restaurant/POS/cash-handling review flag when relevant.
- Correction or cancellation packet when the invoice has already been issued.
- Accountant review items.
- Corrective next steps.

## Risks

- E-invoice obligations and transition rules can change.
- Cross-border invoices may need reverse charge, VAT ID validation, OSS, or local-country handling.
- Kleinunternehmer invoices require careful VAT wording and no unsupported VAT amount.
- A field-level validator cannot confirm the underlying tax treatment.
- Restaurant invoices can involve POS/cash register, food/beverage, voucher, tip, split-rate, and correction workflows that are outside field validation.
- Incorrect invoices already sent may require correction steps, not silent replacement.

## Escalation Conditions

Require professional review when:

- The invoice is domestic B2B and e-invoice requirements may apply.
- The customer is outside Germany.
- The invoice uses reverse charge, VAT exemption, or mixed VAT rates.
- The user is Kleinunternehmer but includes VAT amounts.
- The invoice corrects or cancels an earlier invoice.
- The business sector is restaurant, food service, alcohol, hospitality, or cash/POS-heavy retail.
- The invoice was already sent, paid, booked, or reported in a VAT period.

## Verify Before Submission Controls

- Confirm the user's tax regime and tax number/VAT ID/Kleinunternehmer identifier before issuing.
- Verify UStG 14, UStDV 33, UStDV 34a, and e-invoice obligations for the specific customer relationship.
- Treat non-domestic, reverse-charge, marketplace, exemption, and credit-note cases as review-gated even when field validation passes.
- For restaurant/POS cases, verify permit, cash-register, receipt, VAT-rate, and correction handling with a Steuerberater before reissuing documents.
- Keep validation reports labeled as field checks, not compliance certificates.
- For domestic B2B cases, keep PDF or spreadsheet drafts labeled as review material, not e-invoice validation evidence.

## Operational Reality Checks

- Ask for document state before proposing edits: draft, sent, paid, booked, reported, correction, cancellation, or credit note.
- Do not silently "fix" an invoice PDF that has already entered customer, bank, POS, bookkeeping, or VAT records.
- Treat copied template wording as untrusted until the relationship, tax regime, and source rule are verified.
- For restaurant/POS cases, require the cash/POS export or receipt context before deciding whether the problem is an invoice field issue or a records correction issue.

## Source Notes

Use `ustg-14` for regular invoice fields, `ustdv-33` for small invoices, `ustdv-34a` for Kleinunternehmer invoice fields, `ustg-19` for Kleinunternehmer status warnings, `bmf-e-rechnung-faq` for e-invoice review flags, and `berlin-gaststaette-permit` for restaurant/hospitality escalation context.

## Examples

See `examples/kleinunternehmer-invoice-report.md`, root `examples/invoices/`, and the founder golden path under `examples/golden-path/solo-consulting-side-business/`.
