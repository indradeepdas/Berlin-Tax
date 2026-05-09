# Accountant Handoff Packet

## Boundary Notice

Preparation-only packet. Not legal, tax, accounting, immigration, employment, benefit, or company-law advice. Not submission-ready. This packet is designed to reduce accountant back-and-forth by separating facts, assumptions, missing evidence, and review questions.

## Assumptions

- Founder is a Berlin solo consulting founder in a public fictional fixture.
- Founder has not sent invoices yet.
- No ALG I, no cross-border clients, no payroll, and no regulated-sector facts are assumed.
- Kleinunternehmer treatment and activity classification are not settled.
- UStVA period is unknown until Finanzamt/ELSTER correspondence is reviewed.

## User-Provided Inputs

- Activity: product strategy consulting and workshop facilitation.
- Legal form: Einzelunternehmen candidate.
- ELSTER status: private access available.
- Tax number: pending.
- VAT ID: not requested.
- Sales ledger: not started.
- Expense ledger: not started.
- Bank exports: not yet applicable.
- Invoice records: one draft invoice.
- Authority letters: missing.

## Verified Source References

- `berlin-gewerbeanmeldung`
- `berlin-tax-registration`
- `elster-fseeun`
- `ustg-18`
- `ustg-19`
- `bmf-e-rechnung-faq`
- `bmwk-freiberuf-gewerbe-difference`

These are registry references, not live certification. Check `docs/SOURCE_DASHBOARD.md` before release or real-world use.

## Deterministic Checks

Run the full golden-path check:

```bash
npm run beta:golden-path
```

Run the accountant handoff validator directly:

```bash
node scripts/validate-workflow.mjs accountant_handoff examples/golden-path/solo-consulting-side-business/accountant-handoff.json
```

Expected status: `review`. That is the correct result because classification, tax posture, invoice format, UStVA period, and evidence state are still unresolved.

## Accountant Questions

- Should this activity be treated as freiberuflich, gewerblich, or mixed?
- If gewerblich, should the founder complete Gewerbeanmeldung before the first invoice?
- Is Kleinunternehmer treatment appropriate based on the founder's facts and forecast?
- What exact invoice wording and format should be used for the first domestic B2B invoice?
- Should the founder request or avoid a VAT ID at this stage?
- What UStVA period appears after onboarding, and should reminders be monthly, quarterly, or disabled until confirmed?
- What bookkeeping minimum is acceptable before the first invoice and before the first filing period?

## Attachment Checklist

- Identity document.
- Address evidence.
- Draft activity description in English and German.
- Qualification or portfolio evidence relevant to classification.
- Draft invoice.
- Revenue forecast basis.
- Expense receipts or planned cost list.
- ELSTER screenshots or messages, if available.
- Service Berlin or Finanzamt correspondence, if available.
- Employer side-business approval or contract excerpt, if applicable.

## Review Gates

- Classification and registration route.
- Kleinunternehmer posture.
- Domestic B2B e-invoice handling.
- UStVA period.
- Tax number status before invoice issuance.
- Employer side-business permission evidence.

## Next Steps

1. Send the handoff packet and attachments to the reviewer.
2. Ask the reviewer to answer the classification route first because it controls the Gewerbe and Finanzamt path.
3. Do not issue the draft invoice until tax-number status, invoice wording, and e-invoice handling are reviewed.
4. After Finanzamt/ELSTER messages arrive, update the handoff JSON and rerun `npm run beta:golden-path`.
