# Sample Output: UG Monthly Calendar Candidate

## Verified Facts

- UStVA candidate deadlines are generated from config-backed `ustg-18` values.

## User-Provided Inputs

- UG is newly formed.
- Calendar starts 2026-05-01.
- No confirmed Dauerfristverlaengerung.

## Assumptions

- New-business monthly candidate applies until confirmed otherwise.
- Dates are not adjusted for weekends, holidays, or individual Finanzamt handling.

## Open Verification Items

- Confirm UStVA period in Finanzamt correspondence.
- Confirm whether Dauerfristverlaengerung exists.
- Confirm whether Kleinunternehmer treatment applies or was waived.

## Professional Review Items

- Any cross-border sales, reverse charge, or import/export transactions.

## Next Steps

- Run `node scripts/generate-compliance-calendar.mjs examples/profiles/ug-founder-berlin.json`.
- Send candidate calendar and ledgers to Steuerberater.

## Required Documents

- Sales ledger.
- Expense ledger.
- Finanzamt letters.

## Responsible Authority

- Finanzamt.
- Steuerberater.

## Source Notes

- `ustg-18`.

