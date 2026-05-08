# Deterministic Validation Review

Review date: 2026-05-08

Purpose: identify where Berlin-Tax should prefer deterministic validation over LLM reasoning, then document the architecture changes made in this pass.

## Reliability Boundary

LLMs may summarize, ask follow-up questions, sequence tasks, and prepare human-readable handoffs. They must not invent thresholds, infer legal status, decide tax treatment, silently select filing periods, or treat a formatted document as compliant.

Deterministic scripts should handle:

- Required-field checks.
- Config-backed thresholds.
- Syntax and data-shape validation.
- Candidate recurrence generation.
- Workflow branching into professional-review states.
- Completeness checks for accountant handoff packets.
- Source freshness and source ID checks.

Professional reviewers should decide:

- Freiberufler vs Gewerbe classification.
- Kleinunternehmer eligibility or option exercises.
- VAT place-of-supply, reverse-charge, OSS, and VAT ID treatment.
- ALG I eligibility, availability, side-business impact, or reporting sufficiency.
- Residence-title permission for self-employment.
- Restaurant permit sufficiency, cash-register compliance, or correction strategy.
- UG/GmbH company-law and accounting setup adequacy.

## Workflow Inventory

| Workflow | Deterministic opportunity | Implemented in this pass | Remaining gap |
| --- | --- | --- | --- |
| Operational intake | Required fields, immigration branch, ALG I branch, regulated-sector branch, restaurant/POS branch, contradictory-advice branch | `config/workflow-rules.json`, `scripts/validate-workflow.mjs operational_intake` | Add JSON Schema if external clients start posting intake packets |
| Gewerbeanmeldung Berlin | Document readiness, German activity description presence, authority path, regulated-sector escalation | Intake branch rules added and skill now calls workflow validation when JSON is available | Do not automate classification; future script can validate permit evidence presence only |
| Finanzamt onboarding | ELSTER status, tax number status, source-document presence, open questions, contradictory advice | Handoff and contradictory-advice validators added; skill points agents to them | Future dedicated questionnaire schema for ELSTER field-level completeness |
| UStVA preparation | Candidate recurrence dates, confirmed vs unconfirmed period state, missed-period branch, deadline packet completeness | Existing calendar generator remains deterministic; workflow docs now require validator use for handoff packets | Ledger VAT arithmetic validation should be added before any UStVA numbers are summarized |
| Invoice compliance | Required fields, invoice syntax, small-invoice path, Kleinunternehmer path, domestic B2B review, issued-document state, restaurant/POS state | Existing invoice validator is the deterministic control; skill now reinforces script-first use | Future structured checks for invoice number sequence and ZUGFeRD/XRechnung syntax |
| Kleinunternehmer workflows | Prior/current revenue fields, config-backed threshold checks, crossing-event detection, revenue-vs-profit warnings, invoice freeze routing | Existing threshold script handles this deterministically; workflow docs now reinforce handoff validation | Future ledger import validator for revenue reconciliation |
| ALG I side-business preparation | Status flags, work-start date, notification evidence, availability-review escalation | Intake rule routes ALG I context to review | No benefit calculation should be added without a maintained official rule pack and reviewer design |
| UG/GmbH setup guidance | Entity setup checklist, accountant handoff completeness, open questions, source notes | Accountant handoff validator added | Future company setup skill should validate document presence only, not company-law sufficiency |
| Cross-border contractor invoicing | Customer country, customer type, VAT ID evidence, goods/services flag, reverse-charge/OSS review branch | Invoice validator routes non-domestic relationships to professional review | Future VAT ID syntax and evidence capture can be deterministic; treatment must remain review-gated |
| Restaurant operator workflows | Sector flag, POS/cash-register evidence, issued/paid/booked/reported state, correction packet routing | Invoice validator already routes restaurant/POS cases | Future receipt/POS export schema can validate completeness |
| Annual compliance calendar | Candidate recurrence, missing period state, source freshness, authority correspondence checkpoints | Existing calendar generator is deterministic | Weekend/holiday adjustment should be config/library-backed, not LLM-generated |
| Accountant handoff | Required sections, open questions, professional review items, source notes | Added deterministic handoff validation; unresolved items now force `review` status | Future attachment manifest validation |
| Contradictory online advice | Claim fields, source type, action impact, official source to check, blocking statuses | Added contradictory-advice validator | Future source registry audit for example-level official source IDs |
| Source governance | Stale source checks, official host checks, rule source IDs, workflow-rule source IDs | `audit-sources.mjs` now checks workflow-rule source IDs too | Future CI should run this on pull requests |
| Skill governance | Required sections, risks, source notes, verify-before-submission controls | Existing `validate-skill.mjs`; skills now reference deterministic validators | Future tests can assert every skill maps to at least one validator or explicit no-validator rationale |

## Architecture Change

Berlin-Tax now has two deterministic layers.

Domain validators are specific calculators/checkers:

- `scripts/validate-invoice.mjs`
- `scripts/check-thresholds.mjs`
- `scripts/generate-compliance-calendar.mjs`
- `scripts/audit-sources.mjs`
- `scripts/self-audit.mjs`
- `scripts/validate-skill.mjs`

Workflow validators are orchestration gates:

- `scripts/validate-workflow.mjs operational_intake`
- `scripts/validate-workflow.mjs accountant_handoff`
- `scripts/validate-workflow.mjs contradictory_advice`

Config stays separate from script behavior:

- `config/rules.de.berlin.json` holds source-backed statutory or procedural candidates.
- `config/workflow-rules.json` holds routing and completeness gates.
- `sources/source-registry.json` holds source provenance and review dates.

## Structured Output Contract

Workflow validation outputs follow the same operational report shape as existing scripts:

- `status`
- `verified_facts`
- `user_provided_inputs`
- `assumptions`
- `open_verification_items`
- `verification_checkpoints`
- `professional_review_items`
- `findings`
- `next_steps`
- `required_documents`
- `responsible_authority`
- `source_notes`

The important behavior is conservative:

- Missing required fields produce `fail`.
- Review branches, open questions, or professional-review items produce `review`.
- A packet only produces `pass` when it is structurally complete and contains no unresolved review gate.

## Added Controls

- Added `config/workflow-rules.json` for config-driven intake, handoff, and contradictory-advice validation.
- Added `scripts/validate-workflow.mjs` for deterministic workflow completeness and branch routing.
- Added workflow validation scripts in `package.json`.
- Added example JSON packets for operational intake, accountant handoff, and contradictory advice.
- Updated each production skill to call deterministic validators before final workflow output when structured input exists.
- Extended source audit coverage to workflow-rule source IDs.
- Changed accountant handoff validation so open questions and professional-review items force `review` status.

## Design Decision

The repo should not add a generic rules engine yet. The current approach is deliberately small: plain Node.js, dotted-path field checks, simple equality/list branch rules, and shared report generation. That is enough to reduce hallucination surfaces without hiding legal-risk decisions inside opaque automation.
