---
name: finanzamt-onboarding
description: Prepare Finanzamt onboarding and Fragebogen zur steuerlichen Erfassung workflows for Berlin founders, freelancers, Gewerbe operators, and new entities. Use for ELSTER readiness, tax-number preparation, VAT assumptions, accountant handoff, and source-backed checklists without submitting forms or giving tax advice.
---

# Finanzamt Onboarding

## Purpose

Prepare the user to complete steuerliche Erfassung through ELSTER and coordinate with the responsible Finanzamt. The skill organizes inputs and review questions; it does not submit forms or decide tax positions.

## Workflow

1. Start with `templates/operational-intake.md` and preserve any uncertainty in `templates/assumption-log.md`. When structured intake JSON is available, run `node scripts/validate-workflow.mjs operational_intake <input.json>`.
2. Determine legal form, activity type, start date, Berlin address, and whether Gewerbeanmeldung is complete or not required.
3. Collect ELSTER access status and identify whether the user needs individual or organization access.
4. Prepare structured inputs for steuerliche Erfassung: identity, address, bank, activity, start date, revenue/profit estimates, VAT assumptions, employees, and tax adviser contact.
5. Flag VAT, Kleinunternehmer, cross-border, payroll, and classification risks.
6. If the user has conflicting advice, create a `templates/contradictory-advice-log.md` entry and run `node scripts/validate-workflow.mjs contradictory_advice <input.json>` before selecting a tax-registration posture.
7. Produce a handoff package using `templates/accountant-handoff.md`; when structured handoff JSON is available, run `node scripts/validate-workflow.mjs accountant_handoff <input.json>`.
8. Route invoice or threshold checks to the relevant deterministic scripts where structured inputs exist.

## Required Inputs

- Legal form and founder identity.
- Activity description.
- Start date and Berlin address.
- Gewerbeanmeldung status or freiberuflich rationale.
- ELSTER account status.
- Expected revenue and profit.
- Expected domestic, EU, and non-EU customers.
- Kleinunternehmer assumption, if any.
- Payroll or contractor plans.
- Bank account readiness.
- Existing tax numbers, VAT ID, or Wirtschafts-Identifikationsnummer if available.
- Contradictory advice received from forums, advisers, friends, online calculators, or authority calls.

## Outputs

- Finanzamt onboarding checklist.
- ELSTER readiness notes.
- steuerliche Erfassung input pack.
- Accountant questions.
- VAT and Kleinunternehmer review flags.
- Contradictory advice log when user-facing claims conflict.
- Next steps, required documents, responsible authority, assumptions, and source notes.

## Risks

- Revenue estimates influence VAT and advance payment handling.
- Cross-border services may create VAT complexity.
- Payroll creates additional tax and social-security workflows.
- Incorrect activity classification can create downstream corrections.
- Informal advice can be outdated, jurisdiction-specific, or correct for a different fact pattern.
- ELSTER forms and help text can change.

## Escalation Conditions

Require professional review when:

- The user has EU or non-EU business customers.
- The user wants Kleinunternehmer treatment but expects growth near thresholds.
- The user has employees, mini-jobbers, contractors, or managing director salary questions.
- The user is unsure whether the activity is freiberuflich or gewerblich.
- The user has been told both "register a Gewerbe" and "you are Freiberufler" for the same activity.
- The user has contradictory advice about VAT ID, Kleinunternehmer, reverse charge, or invoice wording.
- The user needs retrospective registration or correction.

## Verify Before Submission Controls

- Confirm the correct ELSTER form for the user's legal form before entering data.
- Verify tax number, VAT ID, bank data, activity wording, and revenue/profit estimates against user documents.
- Confirm Kleinunternehmer, VAT ID, cross-border, payroll, and advance-payment assumptions with a Steuerberater when present.
- Resolve any contradictory advice using official sources or professional review before filing the steuerliche Erfassung.
- Keep the output in preparation status until ELSTER and Finanzamt correspondence have been checked.

## Source Notes

Use `berlin-tax-registration`, `elster-fseeun`, and `elster-fseeun-help` for onboarding. For corporations and partnerships, treat Einzelunternehmen references as incomplete and add an open verification item for the correct ELSTER form.

Use `bmwk-freiberuf-gewerbe-difference` and `bmwk-freie-berufe` only as classification context. The output must still route the final classification posture to Finanzamt, Gewerbeamt, or professional review.

## Examples

See `examples/freelancer-elster-prep.md` for a sample onboarding preparation package.
