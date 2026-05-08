---
name: gewerbeanmeldung-berlin
description: Prepare Berlin Gewerbeanmeldung workflows for founders, freelancers, side-business operators, immigrants, and small businesses. Use when a user needs a checklist, assumptions, required documents, responsible authority, risk review, or accountant-ready handoff for registering a trade in Berlin without providing legal classification or filing automation.
---

# Gewerbeanmeldung Berlin

## Purpose

Prepare a Berlin trade-registration workflow that reduces missed documents, authority confusion, and unsafe assumptions. Do not decide whether the user's activity is legally gewerblich or freiberuflich; prepare the registration path and route classification uncertainty to professional review.

## Workflow

1. Collect the user's activity description, legal form, Berlin operating address, start date, representative data, immigration status if relevant, and whether the activity may be regulated.
2. Identify whether the user is preparing an Einzelgewerbe, Personengesellschaft, UG/GmbH, or company in formation.
3. Create a document checklist using the Berlin service source notes.
4. Flag activities that may require permits, sector review, IHK/HWK review, immigration review, or legal review.
5. Produce an output using `templates/output-standard.md`.
6. If the user also needs tax onboarding, hand off to `skills/finanzamt-onboarding`.

## Required Inputs

- Full legal name and contact details.
- Berlin residential or business address.
- Business activity in plain language and German working wording if available.
- Planned start date.
- Legal form and representative structure.
- Existing Handelsregister status if applicable.
- Residence/work authorization status if the user is not clearly unrestricted to work in Germany.
- Whether the business involves food, alcohol, craft trades, transport, security, finance, childcare, health, marketplace activity, or regulated services.

## Outputs

- Gewerbeanmeldung readiness summary.
- Required documents checklist.
- Responsible authority: Berlin Ordnungsamt / Service Berlin.
- Activity wording review notes.
- Registration path assumptions.
- Open verification items.
- Professional review items.
- Next steps and handoff to Finanzamt onboarding.

## Risks

- Gewerbe vs freiberuflich classification may be wrong.
- Regulated activities may require permits before operation.
- Residence or work authorization may limit self-employment.
- Company-in-formation filings may need notary documents and representative attachments.
- Berlin processing procedures and fees can change.

## Escalation Conditions

Require professional or authority review when:

- The user is unsure whether the activity is freiberuflich or gewerblich.
- The business touches regulated sectors or craft activities.
- The user has visa, residence permit, ALG I, or employer-side constraints.
- A UG/GmbH is in formation or Handelsregister data is incomplete.
- The user already started operating without registration.

## Verify Before Submission Controls

- Recheck the current Service Berlin page and fee table before filing or telling a user how to pay.
- Confirm whether the activity is gewerblich, freiberuflich, regulated, or permit-sensitive before presenting a filing path as ready.
- Confirm the user's right to self-employment in Germany if immigration, residence, employer, or ALG I facts are present.
- Keep the output in preparation status until the responsible authority path and required documents are verified for the user's legal form.

## Source Notes

Read `references/source-notes.md` before producing final workflow output. Use `source_id` `berlin-gewerbeanmeldung` for Berlin procedural notes and `gewerbeanmeldung-legal-basis` for the federal notification basis.

Never embed Berlin fee values directly in output unless they were loaded from `config/rules.de.berlin.json` or clearly labeled as source-current candidate values.

## Examples

See `examples/solo-saas-founder-output.md` for a sample preparation package.
