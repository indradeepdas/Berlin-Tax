---
name: ustva-preparation
description: Prepare Umsatzsteuer-Voranmeldung workflows for German/Berlin founders and small businesses. Use for deadline candidates, data readiness, VAT ledger checks, accountant handoff, and ELSTER preparation without filing automation or tax advice.
---

# UStVA Preparation

## Purpose

Prepare Umsatzsteuer-Voranmeldung work without submitting it. The skill helps the user assemble records, identify candidate periods and deadlines, and route uncertain VAT treatment to a Steuerberater.

## Workflow

1. Collect legal form, tax number status, VAT ID status, business start date, Kleinunternehmer status, and UStVA frequency if known.
2. Collect sales, expense, VAT, reverse charge, EU, non-EU, and import/export indicators.
3. Use `scripts/generate-compliance-calendar.mjs` for candidate deadlines when profile data is structured.
4. Produce a data-readiness checklist and accountant handoff.
5. Explicitly label candidate deadlines as unadjusted for weekends, holidays, Dauerfristverlaengerung, exemptions, and Finanzamt-specific decisions.

## Required Inputs

- Business start date.
- Tax number and VAT ID status.
- Current UStVA period or Finanzamt letter if available.
- Sales ledger by period.
- Expense ledger by period.
- VAT rates used.
- Cross-border transactions.
- Kleinunternehmer assumption or waiver status.
- Prior-year VAT due, if not a new business.

## Outputs

- UStVA readiness report.
- Candidate deadline calendar.
- Missing data list.
- VAT treatment review flags.
- Accountant handoff questions.
- Next steps, required documents, responsible authority, assumptions, and source notes.

## Risks

- Filing frequency can depend on individual facts and Finanzamt handling.
- Cross-border, reverse charge, OSS, imports, and exports are high-risk for unsupervised workflows.
- Kleinunternehmer treatment may mean UStVA is not prepared the same way, but exceptions and changes require review.
- Calendar dates from scripts are candidates only.

## Escalation Conditions

Require professional review when:

- VAT has already been charged incorrectly.
- The user has EU or non-EU transactions.
- The user uses reverse charge, OSS, marketplace, import, export, or platform revenue.
- Deadlines were missed.
- The user is unsure about UStVA frequency or Kleinunternehmer status.

## Source Notes

Use `ustg-18` for filing procedure and deadline candidates. Use `ustg-19` when Kleinunternehmer assumptions affect whether or how VAT pre-returns apply. Do not submit through ELSTER.

## Examples

See `examples/ug-monthly-calendar.md` for a calendar preparation example.

