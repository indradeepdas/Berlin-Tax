---
name: invoice-compliance-validation
description: Validate German invoice preparation inputs for Berlin founders, freelancers, Kleinunternehmer, and small businesses. Use for deterministic invoice field checks, e-invoice review flags, accountant-ready reports, and source-backed warnings without guaranteeing legal compliance.
---

# Invoice Compliance Validation

## Purpose

Validate whether an invoice draft contains required field candidates and obvious risk flags. The skill does not certify compliance. It prepares corrections and review questions.

## Workflow

1. Ask for the invoice JSON or enough invoice fields to create one.
2. Identify relationship type: domestic B2B, domestic B2C, EU B2B, EU B2C, non-EU, or unknown.
3. Identify tax regime: regular VAT, Kleinunternehmer, or unknown.
4. Run `scripts/validate-invoice.mjs` on structured invoice JSON.
5. Convert findings into an accountant-ready output using the shared output standard.

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
- Notes printed on the invoice.

## Outputs

- Deterministic validation report.
- Missing field list.
- Kleinunternehmer note warning if applicable.
- Domestic B2B e-invoice review flag.
- Accountant review items.
- Corrective next steps.

## Risks

- E-invoice obligations and transition rules can change.
- Cross-border invoices may need reverse charge, VAT ID validation, OSS, or local-country handling.
- Kleinunternehmer invoices require careful VAT wording and no unsupported VAT amount.
- A field-level validator cannot confirm the underlying tax treatment.

## Escalation Conditions

Require professional review when:

- The invoice is domestic B2B and e-invoice requirements may apply.
- The customer is outside Germany.
- The invoice uses reverse charge, VAT exemption, or mixed VAT rates.
- The user is Kleinunternehmer but includes VAT amounts.
- The invoice corrects or cancels an earlier invoice.

## Source Notes

Use `ustg-14` for regular invoice fields, `ustdv-33` for small invoices, `ustg-19` for Kleinunternehmer warnings, and `bmf-e-rechnung-faq` for e-invoice review flags.

## Examples

See `examples/kleinunternehmer-invoice-report.md` and root `examples/invoices/`.

