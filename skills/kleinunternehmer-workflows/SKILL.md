---
name: kleinunternehmer-workflows
description: Prepare Kleinunternehmerregelung workflows for German founders, freelancers, side businesses, and small companies. Use for source-backed threshold monitoring, invoice wording checks, assumptions, accountant handoff, and review routing without deciding eligibility or giving tax advice.
---

# Kleinunternehmer Workflows

## Purpose

Help users monitor and document a Kleinunternehmer assumption. The skill prepares threshold checks, invoice warnings, and review questions; it does not decide eligibility or optimize tax choices.

## Workflow

1. Collect prior-year revenue, current-year revenue to date, current-year forecast, legal form, business start date, and whether the user opted out of Kleinunternehmer treatment.
2. Ask whether the current-year threshold was already crossed, which invoice crossed it, and whether any invoices were issued after crossing.
3. Ask whether there are EU, non-EU, reverse charge, marketplace, import/export, or platform transactions.
4. Run `scripts/check-thresholds.mjs` on structured revenue inputs.
5. Run `scripts/validate-invoice.mjs` on sample invoices when invoice assumptions matter.
6. Produce an assumption log and accountant handoff.
7. If threshold crossing or VAT-charged invoices are present, add a "freeze invoice template until review" next step instead of giving new invoice wording.

## Required Inputs

- Prior calendar year total revenue.
- Current calendar year revenue to date.
- Current calendar year forecast.
- Business start date.
- Tax regime currently used on invoices.
- Whether VAT has ever been charged.
- Invoice number and date that appears to cross the current-year monitoring threshold, if known.
- Invoice numbers issued after the suspected crossing date.
- Whether the user opted out of Kleinunternehmer treatment.
- Customer geography and B2B/B2C mix.
- Sample invoices.

## Outputs

- Threshold monitoring report.
- Kleinunternehmer assumption log.
- Suspected threshold-crossing event log.
- Invoice wording review flags.
- Accountant questions.
- Next steps, required documents, responsible authority, assumptions, and source notes.

## Risks

- Revenue thresholds are legal values and can change.
- Revenue is not profit; users often confuse the two.
- Cross-border activity can create VAT obligations that this skill does not resolve.
- Opt-out history and prior filings matter.
- Incorrect invoices may require corrections.
- Mid-year crossing creates operational sequencing questions: last safe invoice, first review-gated invoice, client communication, bookkeeping, and future template state.

## Escalation Conditions

Require professional review when:

- Revenue is near or over configured limits.
- The user believes the threshold was crossed mid-year.
- The user has EU or non-EU customers.
- The user has charged VAT while claiming Kleinunternehmer treatment.
- The user issued more invoices after a suspected crossing event.
- The user wants to opt out, opt back in, or compare tax outcomes.
- There is any missed registration, correction, or retroactive issue.

## Verify Before Submission Controls

- Reconcile revenue inputs to sales ledgers, invoice records, and bank data before relying on threshold monitoring.
- Confirm whether figures are Gesamtumsatz under the cited rule, not profit or cash balance.
- Confirm opt-out history, prior filings, cross-border activity, and VAT charged on invoices before using a Kleinunternehmer assumption.
- If crossing is suspected, freeze invoice templates and prepare a dated invoice sequence for Steuerberater review before issuing more invoices.
- Keep outputs labeled as monitoring and preparation unless a Steuerberater or Finanzamt confirms the user's position.

## Source Notes

Use `ustg-19` for threshold monitoring. Load threshold values from `config/rules.de.berlin.json`; do not restate them as permanent prose. Use `ustg-14`, `ustdv-33`, `ustdv-34a`, and `bmf-e-rechnung-faq` when invoices are involved.

## Examples

See `examples/revenue-monitoring-output.md` and root `examples/thresholds/`.
