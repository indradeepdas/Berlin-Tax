---
name: finanzamt-onboarding
description: Prepare Finanzamt onboarding and Fragebogen zur steuerlichen Erfassung workflows for Berlin founders, freelancers, Gewerbe operators, and new entities. Use for ELSTER readiness, tax-number preparation, VAT assumptions, accountant handoff, and source-backed checklists without submitting forms or giving tax advice.
---

# Finanzamt Onboarding

## Purpose

Prepare the user to complete steuerliche Erfassung through ELSTER and coordinate with the responsible Finanzamt. The skill organizes inputs and review questions; it does not submit forms or decide tax positions.

## Workflow

1. Determine legal form, activity type, start date, Berlin address, and whether Gewerbeanmeldung is complete or not required.
2. Collect ELSTER access status and identify whether the user needs individual or organization access.
3. Prepare structured inputs for steuerliche Erfassung: identity, address, bank, activity, start date, revenue/profit estimates, VAT assumptions, employees, and tax adviser contact.
4. Flag VAT, Kleinunternehmer, cross-border, payroll, and classification risks.
5. Produce a handoff package using `templates/accountant-handoff.md`.
6. Route invoice or threshold checks to the relevant deterministic scripts where structured inputs exist.

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

## Outputs

- Finanzamt onboarding checklist.
- ELSTER readiness notes.
- steuerliche Erfassung input pack.
- Accountant questions.
- VAT and Kleinunternehmer review flags.
- Next steps, required documents, responsible authority, assumptions, and source notes.

## Risks

- Revenue estimates influence VAT and advance payment handling.
- Cross-border services may create VAT complexity.
- Payroll creates additional tax and social-security workflows.
- Incorrect activity classification can create downstream corrections.
- ELSTER forms and help text can change.

## Escalation Conditions

Require professional review when:

- The user has EU or non-EU business customers.
- The user wants Kleinunternehmer treatment but expects growth near thresholds.
- The user has employees, mini-jobbers, contractors, or managing director salary questions.
- The user is unsure whether the activity is freiberuflich or gewerblich.
- The user needs retrospective registration or correction.

## Source Notes

Use `elster-fseeun` and `elster-fseeun-help` for Einzelunternehmen onboarding. For corporations and partnerships, treat Einzelunternehmen references as incomplete and add an open verification item for the correct ELSTER form.

## Examples

See `examples/freelancer-elster-prep.md` for a sample onboarding preparation package.

