# Sample Output: Freelancer ELSTER Preparation

Fixture status: fictional public example, intentionally `review`.

## Verified Facts

- ELSTER source references are tracked as `elster-fseeun` and `elster-fseeun-help`.
- Classification context is tracked separately from the onboarding form path.

## User-Provided Inputs

- User plans to start consulting from Berlin.
- User has private ELSTER access but has not confirmed whether it is sufficient for the intended filing.
- User expects German clients first and possible EU business clients later.
- User received conflicting online advice about whether software consulting is freiberuflich.
- User has one draft invoice but no tax number yet.

## Assumptions

- The user is preparing steuerliche Erfassung but has not submitted it.
- EU business clients create VAT review risk.
- Revenue and profit estimates are user estimates, not reconciled to signed contracts.

## Open Verification Items

- Confirm whether the activity is freiberuflich, gewerblich, or mixed.
- Confirm correct ELSTER form for the user's legal form.
- Confirm whether a VAT ID should be requested before EU B2B work.
- Confirm whether the draft invoice should wait for tax-number, VAT ID, or Kleinunternehmer posture review.
- Resolve the contradictory advice log before selecting a registration posture.

## Verification Checkpoints

- Compare all ELSTER inputs against user documents before entry.
- Confirm cross-border and Kleinunternehmer assumptions with a Steuerberater.
- Keep the output in preparation status until Finanzamt/ELSTER form path is confirmed.
- Do not copy online invoice wording into the ELSTER posture without source or adviser review.

## Professional Review Items

- EU B2B services and VAT treatment.
- Kleinunternehmer decision if the user wants simplified invoicing.
- Classification if the work mixes software development, product consulting, implementation, and training.

## Evidence Inventory

| Evidence | Status |
| --- | --- |
| ELSTER access | available, scope unclear |
| Gewerbeanmeldung or freiberuflich rationale | unresolved |
| Revenue/profit forecast | estimate only |
| Draft invoice | available, not issued |
| EU customer evidence | missing |

## Next Steps

- Gather activity description, start date, revenue estimate, profit estimate, bank details, and client geography.
- Create a contradictory advice log for classification and invoice wording claims.
- Prepare accountant questions before submitting steuerliche Erfassung.
- Run `check-thresholds.mjs` if Kleinunternehmer treatment is assumed.

## Required Documents

- ELSTER access information.
- Gewerbeanmeldung or classification rationale.
- Revenue and profit forecast basis.
- Draft invoice and any customer contract/email evidence.

## Responsible Authority

- Finanzamt through ELSTER.
- Steuerberater for review items.

## Source Notes

- `elster-fseeun`, `elster-fseeun-help`, `ustg-19`, `bmwk-freiberuf-gewerbe-difference`.
