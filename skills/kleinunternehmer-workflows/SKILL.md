---
name: kleinunternehmer-workflows
description: Prepare Kleinunternehmerregelung workflows for German founders, freelancers, side businesses, and small companies. Use for source-backed threshold monitoring, invoice wording checks, assumptions, accountant handoff, and review routing without deciding eligibility or giving tax advice.
---

# Kleinunternehmer Workflows

## Purpose

Help users monitor and document a Kleinunternehmer assumption. The skill prepares threshold checks, invoice warnings, and review questions; it does not decide eligibility or optimize tax choices.

## Workflow

1. Collect prior-year revenue, current-year revenue to date, current-year forecast, legal form, business start date, and whether the user opted out of Kleinunternehmer treatment.
2. Ask whether there are EU, non-EU, reverse charge, marketplace, import/export, or platform transactions.
3. Run `scripts/check-thresholds.mjs` on structured revenue inputs.
4. Run `scripts/validate-invoice.mjs` on sample invoices when invoice assumptions matter.
5. Produce an assumption log and accountant handoff.

## Required Inputs

- Prior calendar year total revenue.
- Current calendar year revenue to date.
- Current calendar year forecast.
- Business start date.
- Tax regime currently used on invoices.
- Whether VAT has ever been charged.
- Whether the user opted out of Kleinunternehmer treatment.
- Customer geography and B2B/B2C mix.
- Sample invoices.

## Outputs

- Threshold monitoring report.
- Kleinunternehmer assumption log.
- Invoice wording review flags.
- Accountant questions.
- Next steps, required documents, responsible authority, assumptions, and source notes.

## Risks

- Revenue thresholds are legal values and can change.
- Revenue is not profit; users often confuse the two.
- Cross-border activity can create VAT obligations that this skill does not resolve.
- Opt-out history and prior filings matter.
- Incorrect invoices may require corrections.

## Escalation Conditions

Require professional review when:

- Revenue is near or over configured limits.
- The user has EU or non-EU customers.
- The user has charged VAT while claiming Kleinunternehmer treatment.
- The user wants to opt out, opt back in, or compare tax outcomes.
- There is any missed registration, correction, or retroactive issue.

## Source Notes

Use `ustg-19` for threshold monitoring. Load threshold values from `config/rules.de.berlin.json`; do not restate them as permanent prose. Use `ustg-14`, `ustdv-33`, and `bmf-e-rechnung-faq` when invoices are involved.

## Examples

See `examples/revenue-monitoring-output.md` and root `examples/thresholds/`.

