# User Guide

Berlin-Tax helps you prepare founder bureaucracy work in Berlin and Germany. It does not file for you, and it is not a substitute for a Steuerberater or authority.

Use this guide when your question is practical:

- "What should I do first?"
- "Which workflow in this repo fits my case?"
- "What documents do I need before I ask an accountant?"
- "Which script should I run on my own data?"
- "What does `review` mean, and what do I do next?"

## Before You Start

Berlin-Tax works best when you can gather facts in a structured way. Before using any workflow, collect:

- your activity description in plain English and, if possible, a German working description
- your legal form or planned legal form
- your Berlin address or planned business address
- your start date, first invoice date, and whether you already started work
- your customer geography: Germany only, EU, non-EU, B2B, B2C
- your current records: invoices, receipts, bank exports, tax letters, ELSTER access, authority correspondence
- any confusing or contradictory advice you already received

Start with [templates/operational-intake.md](../templates/operational-intake.md) when your case is messy.

## Fast Path: Berlin Solo Consulting Side Business

If you are trying to understand the repo quickly, start with the golden path:

```bash
npm run beta:golden-path
```

Then read:

- [Gewerbe prep packet](../examples/golden-path/solo-consulting-side-business/gewerbe-prep-packet.md)
- [Finanzamt onboarding packet](../examples/golden-path/solo-consulting-side-business/finanzamt-onboarding-packet.md)
- [accountant handoff packet](../examples/golden-path/solo-consulting-side-business/accountant-handoff-packet.md)

This scenario is intentionally not a clean approval. It shows how a realistic Berlin founder case can still produce useful next steps while keeping classification, Kleinunternehmer posture, e-invoice handling, UStVA period, and employment-side-business evidence under review.

To generate a similar intake structure:

```bash
npm run intake:wizard -- --profile solo-consulting-side-business --print
```

## How To Read Results

Berlin-Tax reports use three statuses:

- `pass`: the structured packet is complete enough for preparation use and no automatic review gate was triggered. This is still not filing approval.
- `review`: the workflow found uncertainty, missing evidence, stale source risk, or a professional-review condition. This is normal.
- `fail`: required fields are missing, the input is invalid, or the workflow is unsafe to continue without fixing the input first.

Practical rule:

- `pass` means "continue preparing."
- `review` means "continue, but do not treat this as settled."
- `fail` means "stop and fix the packet before using it."

## Goal Map

Use this table when you know your goal but not the workflow.

| Your goal | Start here | Deterministic script |
| --- | --- | --- |
| I want to register a Gewerbe in Berlin | `skills/gewerbeanmeldung-berlin` | `node scripts/validate-workflow.mjs operational_intake <input.json>` |
| I need to prepare Finanzamt / ELSTER onboarding | `skills/finanzamt-onboarding` | `node scripts/validate-workflow.mjs operational_intake <input.json>` |
| I need to check if my invoice is missing required fields | `skills/invoice-compliance-validation` | `node scripts/validate-invoice.mjs <invoice.json>` |
| I need to monitor Kleinunternehmer assumptions | `skills/kleinunternehmer-workflows` | `node scripts/check-thresholds.mjs <thresholds.json>` |
| I need candidate UStVA planning dates | `skills/ustva-preparation` | `node scripts/generate-compliance-calendar.mjs <profile.json>` |
| I need to hand a messy case to my accountant | `templates/accountant-handoff.md` | `node scripts/validate-workflow.mjs accountant_handoff <handoff.json>` |
| I received contradictory online advice | `templates/contradictory-advice-log.md` | `node scripts/validate-workflow.mjs contradictory_advice <claims.json>` |

## Goal 1: Start A Gewerbe In Berlin

Use this path if you think you need a trade registration and you want a preparation checklist.

Use:

- `skills/gewerbeanmeldung-berlin`
- `templates/operational-intake.md`

Collect first:

- activity description
- address
- legal form
- immigration or residence facts if relevant
- ALG I or employment constraints if relevant
- regulated-sector signals such as food, alcohol, craft, transport, health, finance, security

Run when you have structured input:

```bash
node scripts/validate-workflow.mjs operational_intake examples/intake/non-eu-gewerbe-intake.json
```

Stop and escalate when:

- you are unsure whether the activity is freiberuflich or gewerblich
- you are non-EU and your self-employment permission is unclear
- the activity is regulated
- you already started operating without registration

## Goal 2: Prepare Finanzamt / ELSTER Onboarding

Use this path when you need to prepare the Fragebogen zur steuerlichen Erfassung and the surrounding inputs.

Use:

- `skills/finanzamt-onboarding`
- `templates/operational-intake.md`
- `templates/accountant-handoff.md`

Collect first:

- ELSTER access status
- start date
- revenue and profit estimate
- customer geography
- Gewerbeanmeldung status or freiberuflich rationale
- VAT and Kleinunternehmer assumptions
- any contradictory advice

Useful follow-up validations:

```bash
node scripts/validate-workflow.mjs operational_intake <input.json>
node scripts/validate-workflow.mjs contradictory_advice <claims.json>
node scripts/validate-workflow.mjs accountant_handoff <handoff.json>
```

Stop and escalate when:

- your activity classification is unresolved
- you have EU or non-EU clients and do not know the VAT posture
- you want invoice wording before tax-number or VAT-ID posture is clear
- you are backfilling a missed registration or correction

## Goal 3: Check An Invoice Before Sending It

Use this path when you already have invoice data and want to catch obvious structural problems.

Use:

- `skills/invoice-compliance-validation`

Collect first:

- supplier and customer details
- invoice number and issue date
- service period
- line items
- totals and VAT breakdown
- tax regime assumption
- relationship type: domestic B2B, domestic B2C, EU, non-EU
- document state: draft, sent, paid, booked, reported, correction, cancellation, credit note

Run:

```bash
node scripts/validate-invoice.mjs <invoice.json>
```

Good starting fixtures:

- `examples/invoices/kleinunternehmer-b2b-review.json`
- `examples/invoices/eu-contractor-review.json`
- `examples/invoices/restaurant-incorrect.json`

Stop and escalate when:

- the invoice is cross-border
- the invoice is domestic B2B and e-invoice questions apply
- you need XRechnung, ZUGFeRD, XML syntax, VAT ID validity, transmission, or tax-treatment validation
- the invoice is already sent, paid, booked, or reported
- the business is restaurant, hospitality, alcohol, or POS/cash-heavy
- the invoice mixes VAT rates, reverse charge, or exemptions

Practical rule:

- this repo validates invoice structure and review gates; it does not certify an invoice as an E-Rechnung

## Goal 4: Monitor Kleinunternehmer Risk

Use this path when you want to check whether your current revenue posture is drifting into a review state.

Use:

- `skills/kleinunternehmer-workflows`

Collect first:

- prior-year revenue
- current-year revenue to date
- forecast revenue
- opt-out history
- whether VAT was ever charged
- customer geography
- invoice that may have crossed the threshold
- invoice numbers issued after the suspected crossing

Run:

```bash
node scripts/check-thresholds.mjs <thresholds.json>
```

Good starting fixtures:

- `examples/thresholds/kleinunternehmer-monitoring.json`
- `examples/thresholds/kleinunternehmer-crossed-midyear.json`

Stop and escalate when:

- revenue is near or over a configured limit
- you think the threshold was crossed mid-year
- you issued invoices after the crossing point
- you charged VAT while still assuming Kleinunternehmer treatment
- you have EU or non-EU customers

Practical rule:

- if crossing is suspected, freeze invoice-template changes until a reviewer looks at the invoice sequence

## Goal 5: Plan UStVA Work

Use this path when you need candidate filing dates or a readiness check for VAT return preparation.

Use:

- `skills/ustva-preparation`

Collect first:

- tax-number and VAT-ID status
- business start date
- current UStVA period if known
- prior-year VAT due if not a new business
- sales and expense ledgers by period
- missed, filed, corrected, or reminded periods
- any Finanzamt or ELSTER correspondence

Run:

```bash
node scripts/generate-compliance-calendar.mjs <profile.json>
```

Good starting fixtures:

- `examples/profiles/ug-founder-berlin.json`
- `examples/profiles/missed-vat-deadlines.json`

Stop and escalate when:

- the period is unconfirmed
- deadlines were missed
- a notice, estimate, reminder, or penalty already exists
- cross-border or reverse-charge transactions are involved

Practical rule:

- generated dates are planning candidates, not confirmed deadlines
- UStVA outputs are readiness packets, not tax returns or ELSTER submissions

## Goal 6: Prepare An Accountant Handoff

Use this path when you need to turn scattered records into a packet a Steuerberater can actually review.

Use:

- `templates/accountant-handoff.md`

Collect first:

- identity and business snapshot
- tax status
- ledger status
- invoice status
- bank-export status
- authority letters
- assumptions
- unresolved questions
- professional-review items

Run:

```bash
node scripts/validate-workflow.mjs accountant_handoff <handoff.json>
```

The handoff should not read like a narrative email. It should show:

- what is known
- what is missing
- what was assumed
- which documents exist
- which decisions are unresolved

If the validator reports items like `pending`, `missing`, `partial`, `not reconciled`, or `not requested`, treat the handoff as a work-in-progress packet, not a finished one.

## Goal 7: Resolve Contradictory Advice

Use this path when the real problem is not lack of information, but too much conflicting information.

Use:

- `templates/contradictory-advice-log.md`

Collect first:

- exact claim
- who said it or where it came from
- when you saw it
- what action it would change
- which official source should settle it
- who owns the review

Run:

```bash
node scripts/validate-workflow.mjs contradictory_advice <claims.json>
```

Practical rule:

- do not resolve bureaucracy questions by majority vote, confidence, or forum tone

## End-User Workflow Pattern

For most users, the correct order is:

1. Fill the intake.
2. Run the workflow-specific validator.
3. Read the `review` items before doing anything external.
4. Prepare a handoff packet if the case touches tax, cross-border, immigration, benefits, payroll, or corrections.
5. Only after that, talk to the Steuerberater or authority with a cleaner packet.

## Example User Journeys

Use these as a fast shortcut:

1. "I am a non-EU founder starting a Gewerbe."
   Use the intake template first, then the Gewerbeanmeldung skill, then Finanzamt onboarding. Expect `review`.
2. "I am a freelancer and not sure if I am Freiberufler or Gewerbe."
   Use Finanzamt onboarding plus the contradictory advice log. Do not ask the repo to decide the classification.
3. "I need to send an invoice today."
   Use invoice validation first. If document state is not `draft`, do not edit blindly.
4. "I think I crossed the Kleinunternehmer threshold."
   Run threshold monitoring and prepare the invoice sequence before changing future invoice wording.
5. "I missed a VAT filing deadline."
   Use the UStVA workflow only to build a damage-control packet. Do not treat the calendar as the main fix.

## Common Mistakes

- Using the repo to answer a legal classification question directly.
- Treating `review` as failure instead of as a deliberate stop sign.
- Running invoice validation without recording document state.
- Feeding revenue estimates into Kleinunternehmer monitoring without reconciling invoices and bank data.
- Turning candidate UStVA dates into reminders before the filing frequency is confirmed.
- Sending an accountant a polished summary with no evidence state.

## Recommended Files To Read

- [README.md](../README.md)
- [NON_ENGINEER_QUICKSTART.md](NON_ENGINEER_QUICKSTART.md)
- [BETA_READINESS.md](BETA_READINESS.md)
- [SOURCE_DASHBOARD.md](SOURCE_DASHBOARD.md)
- [LEGAL_DISCLAIMER.md](../LEGAL_DISCLAIMER.md)
- [templates/operational-intake.md](../templates/operational-intake.md)
- [templates/accountant-handoff.md](../templates/accountant-handoff.md)
- [examples/stress-tests/berlin-founder-scenarios.md](../examples/stress-tests/berlin-founder-scenarios.md)

## Final Boundary

Berlin-Tax is strongest when it helps you ask better questions, collect the right documents, and stop acting on weak assumptions. If your case depends on classification, cross-border VAT, missed deadlines, immigration permission, benefits, payroll, or retroactive corrections, expect review-heavy output and plan for professional involvement.
