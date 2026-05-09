# Finanzamt Onboarding Packet

## Boundary Notice

Preparation-only packet. Not legal, tax, accounting, immigration, employment, benefit, or company-law advice. Not submission-ready. This packet organizes the founder's inputs before ELSTER/Finanzamt onboarding and does not submit or complete the Fragebogen zur steuerlichen Erfassung.

## Assumptions

- Founder is a Berlin solo operator preparing a consulting side business.
- No invoices have been sent yet.
- Kleinunternehmer treatment is a planning assumption, not confirmed eligibility.
- UStVA period is not confirmed.
- Domestic B2B customers are planned; no EU or non-EU sales are planned in this fixture.

## User-Provided Inputs

- ELSTER status: private access available.
- Tax number status: pending.
- VAT ID status: not requested.
- Start date: 2026-06-01 in this public fixture.
- First invoice date: 2026-06-30 in this public fixture.
- Bookkeeping status: not started.
- Invoice tool: spreadsheet draft.

## Verified Source References

- `elster-fseeun`: ELSTER Fragebogen zur steuerlichen Erfassung fuer Einzelunternehmen.
- `elster-fseeun-help`: ELSTER help for the onboarding form.
- `berlin-tax-registration`: Berlin tax registration path.
- `ustg-18`: UStVA readiness and filing-period source reference.
- `ustg-19`: Kleinunternehmer source reference.
- `bmf-e-rechnung-faq`: e-invoice caution reference for domestic B2B invoice handling.

Verify current official pages and the user's ELSTER messages before using this packet externally.

## Responsible Authority

- Finanzamt and ELSTER for tax registration and follow-up correspondence.
- Steuerberater for tax treatment, Kleinunternehmer posture, UStVA period, and invoice wording.

## Required Documents

- Final classification decision or reviewer note.
- Gewerbeanmeldung confirmation if the activity is gewerblich.
- Activity description and expected revenue/profit basis.
- Planned customer geography and B2B/B2C mix.
- Draft invoice template.
- Bank account plan and bookkeeping tool plan.
- ELSTER access evidence and any Finanzamt letters.

## Workflow

1. Validate intake completeness:

   ```bash
   node scripts/validate-workflow.mjs operational_intake examples/golden-path/solo-consulting-side-business/intake.json
   ```

2. Run Kleinunternehmer monitoring on the planning numbers:

   ```bash
   node scripts/check-thresholds.mjs examples/golden-path/solo-consulting-side-business/threshold-monitoring.json
   ```

3. Generate candidate UStVA readiness dates:

   ```bash
   node scripts/generate-compliance-calendar.mjs examples/golden-path/solo-consulting-side-business/ustva-readiness-profile.json
   ```

4. Keep the UStVA output as a readiness packet. Do not convert candidate dates into filing reminders until ELSTER/Finanzamt correspondence confirms the period.
5. Prepare a Steuerberater question list before changing invoice wording or selecting a VAT posture.

## Review Gates

- Activity classification route.
- Kleinunternehmer posture and opt-out history.
- UStVA filing period after onboarding.
- Domestic B2B e-invoice handling before first invoice.
- Whether the founder's side-business status affects employment obligations.

## Next Steps

- Confirm whether Gewerbeanmeldung exists or is unnecessary.
- Prepare a concise revenue forecast and note the evidence quality.
- Ask the reviewer whether the first invoice can be issued under the planned tax posture.
- Save ELSTER/Finanzamt messages as evidence for the accountant handoff.
