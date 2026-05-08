# Sample Output: UG Calendar Scenario Candidate

Fixture status: fictional public example, intentionally `review`.

## Verified Facts

- UStVA scenario dates are generated from config-backed `ustg-18` values.

## User-Provided Inputs

- UG is newly formed.
- Calendar starts 2026-05-01.
- No confirmed Dauerfristverlaengerung.
- Tax number status: pending.
- VAT ledger: not reconciled.

## Assumptions

- New-business period is not selected until Finanzamt/ELSTER period is confirmed.
- Dates are not adjusted for weekends, holidays, or individual Finanzamt handling.
- No missed-period letter has been received; this must be rechecked against ELSTER and mail.

## Open Verification Items

- Confirm UStVA period in Finanzamt correspondence.
- Confirm whether Dauerfristverlaengerung exists.
- Confirm whether Kleinunternehmer treatment applies or was waived.
- Confirm whether any invoice has already been issued with VAT.
- Confirm who owns bookkeeping before the first reporting period closes.

## Verification Checkpoints

- Confirm UStVA frequency before turning scenario dates into reminders.
- Adjust dates for weekends, holidays, and extensions before use.
- Reconcile VAT figures to ledgers and source documents.

## Professional Review Items

- Any cross-border sales, reverse charge, or import/export transactions.

## Next Steps

- Run `node scripts/generate-compliance-calendar.mjs examples/profiles/ug-founder-berlin.json`.
- Send scenario calendar and ledgers to Steuerberater before adding reminders as operational deadlines.
- Do not add recurring calendar reminders until the filing frequency is confirmed.

## Required Documents

- Sales ledger.
- Expense ledger.
- Finanzamt letters.

## Responsible Authority

- Finanzamt.
- Steuerberater.

## Source Notes

- `ustg-18`.
