# First GitHub Issues

Use these as launch issues after publishing the repository.

## 1. Add ALG I plus side-business preparation skill

Build a skill for people receiving Arbeitslosengeld I who want to start or continue a side business. The skill must route hour limits, income reporting, and eligibility questions to official-source review and professional/authority confirmation.

Risk: `professional_review_required`

## 2. Add UG/GmbH setup preparation skill

Create a workflow for founder handoff to notary, tax adviser, and bank. Include Stammkapital readiness, shareholder data, managing director data, company object drafting support, and post-formation tax onboarding.

Risk: `high`

## 3. Expand accountant handoff generator

Turn the shared accountant handoff template into a deterministic generator that accepts structured inputs and emits a review package with attachments checklist, assumptions, and unresolved questions.

Risk: `medium`

## 4. Add German language mirror for v1 skills

Create German versions of the v1 skill instructions while preserving the English source-of-truth structure. Avoid divergence by linking every German skill to the English canonical source.

Risk: `medium`

## 5. Improve source freshness automation

Add a CI job that runs `npm test` and opens a warning issue when `review_by` is approaching within 14 days.

Risk: `medium`

## 6. Scope XRechnung/ZUGFeRD e-invoice validation

Design the next invoice-validation layer for structured e-invoice artifacts. The first milestone should detect whether an invoice input is a draft PDF/spreadsheet, XRechnung XML, ZUGFeRD/hybrid document, or unknown format, then route unsupported formats to review.

The issue must stay preparation-only. It must not decide VAT treatment, customer status, place of supply, or whether a specific invoice can legally be issued.

Official source anchor: https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html

Risk: `high`
