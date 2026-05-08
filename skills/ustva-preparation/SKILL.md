---
name: ustva-preparation
description: Prepare Umsatzsteuer-Voranmeldung workflows for German/Berlin founders and small businesses. Use for deadline candidates, data readiness, VAT ledger checks, accountant handoff, and ELSTER preparation without filing automation or tax advice.
---

# UStVA Preparation

## Purpose

Prepare Umsatzsteuer-Voranmeldung work without submitting it. The skill helps the user assemble records, identify candidate periods and deadlines, and route uncertain VAT treatment to a Steuerberater.

## Workflow

1. Collect legal form, tax number status, VAT ID status, business start date, Kleinunternehmer status, and UStVA frequency if known.
2. Ask whether any UStVA period is already late, already filed, corrected, or mentioned in Finanzamt correspondence.
3. Collect sales, expense, VAT, reverse charge, EU, non-EU, and import/export indicators.
4. Use `scripts/generate-compliance-calendar.mjs` for candidate deadlines when profile data is structured. If the UStVA period is not confirmed, generate scenario dates only and mark the output as review-gated.
5. Produce a data-readiness checklist and accountant handoff. When structured handoff JSON is available, run `node scripts/validate-workflow.mjs accountant_handoff <input.json>`.
6. If deadlines are missed, create a damage-control packet: missing periods, available ledgers, notices received, cash position, and adviser questions. Do not tell the user to file unsupervised.
7. Explicitly label candidate deadlines as unadjusted for weekends, holidays, Dauerfristverlaengerung, exemptions, and Finanzamt-specific decisions.

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
- Missed, filed, corrected, or unknown UStVA period status.
- Finanzamt notices, reminders, estimates, penalties, or late-payment communications.

## Outputs

- UStVA readiness report.
- Candidate deadline calendar or scenario calendar when the period is unconfirmed.
- Missing data list.
- Missed-deadline damage-control packet when relevant.
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
- The user received a Finanzamt notice, estimate, penalty, or reminder.
- The user is unsure about UStVA frequency or Kleinunternehmer status.

## Verify Before Submission Controls

- Confirm the UStVA period from Finanzamt correspondence or ELSTER before adding deadlines to an operational calendar.
- Verify whether the user has Dauerfristverlaengerung, exemptions, missed deadlines, or correction obligations.
- Reconcile sales, expenses, VAT rates, and input VAT against source documents before preparing figures.
- If a deadline was missed, preserve notices and payment records, collect the missing-period ledger, and route to Steuerberater before filing or correcting.
- Treat every generated deadline as a planning candidate until weekends, holidays, extensions, and user-specific authority messages are checked.

## Operational Reality Checks

- Do not turn a candidate deadline into a reminder until the filing frequency and authority correspondence are confirmed.
- If a deadline is already missed, stop calendar generation as the main task and build a damage-control packet first.
- Keep submitted, draft, corrected, estimated, reminded, and paid states separate for each period.
- Do not summarize VAT amounts until sales, expense, input VAT, VAT rates, and cross-border transactions are reconciled to records.

## Source Notes

Use `ustg-18` for filing procedure and deadline candidates. Use `ustg-19` when Kleinunternehmer assumptions affect whether or how VAT pre-returns apply. Do not submit through ELSTER.

## Examples

See `examples/ug-monthly-calendar.md` for a calendar preparation example.
