# Sample Output: Revenue Monitoring

Fixture status: fictional public example, intentionally `review`.

## Verified Facts

- The threshold check used `scripts/check-thresholds.mjs`.
- Threshold values came from `config/rules.de.berlin.json`.

## User-Provided Inputs

- Prior-year revenue: provided by user.
- Current-year revenue to date: provided by user.
- Forecast: provided by user.
- Invoice sequence: incomplete.
- Bank reconciliation: not done.

## Assumptions

- Revenue means total relevant revenue, not profit.
- User has not opted out of Kleinunternehmer treatment.
- No correction invoices or credit notes have been omitted from the user's numbers.

## Open Verification Items

- Confirm opt-out history.
- Confirm no EU/non-EU VAT complications.
- Confirm whether any invoices charged VAT.
- Identify the invoice that would cross the monitoring limit if current-year growth continues.
- Reconcile invoice totals to bank/payment records before changing invoice templates.

## Verification Checkpoints

- Reconcile revenue to sales ledger, invoice records, and bank data.
- Confirm the figures are Gesamtumsatz under the cited rule.
- Keep the output as monitoring until a Steuerberater or Finanzamt confirms the position.

## Professional Review Items

- Eligibility and forward-looking VAT treatment.

## Next Steps

- Attach sales ledger to accountant handoff.
- Re-run threshold monitoring after each invoice batch.
- Validate sample invoices.
- Freeze invoice wording if a crossing event is suspected until the dated invoice sequence is reviewed.

## Required Documents

- Prior-year sales ledger.
- Current-year sales ledger.
- Invoice samples.

## Responsible Authority

- Steuerberater.
- Finanzamt for case-specific handling.

## Source Notes

- `ustg-19`.
