# Architecture

Berlin-Tax is a procedural knowledge layer for AI agents and founder operators. The architecture intentionally separates judgment, source metadata, and deterministic checks.

## Core Model

Agents do three things:

- Interpret the user's business context.
- Orchestrate a workflow from the relevant skill.
- Produce a structured preparation package with uncertainty exposed.

Scripts do three things:

- Validate structured inputs.
- Calculate config-backed thresholds, field checks, and deadline scenarios.
- Fail or warn when source metadata is missing, stale, or unsafe.

Humans and professionals do the final legal, tax, company-law, employment, and filing decisions.

## Separation of Concerns

`skills/` contains procedural workflows. Skills should describe how to run a process, what inputs to collect, what output to produce, and when to escalate.

`config/` contains machine-readable rule packs. Thresholds, deadlines, review dates, and official-source identifiers belong here.

`sources/` contains the source registry. It records official URLs, authorities, jurisdictions, review cadence, and usage.

`scripts/` contains deterministic Node.js logic. Scripts must not contain legal thresholds that also exist in `config/`.

`templates/` contains output contracts. These define how agent outputs should separate facts, assumptions, user inputs, uncertainty, verification checkpoints, and professional-review items.

## Trust Boundaries

Berlin-Tax does not submit filings, classify legal status, or decide tax treatment. It prepares the user for those actions.

Risk-heavy workflows must route to review when they involve:

- Gewerbe vs freiberuflich classification.
- Kleinunternehmer eligibility or opt-out decisions.
- VAT registration and filing frequency.
- ALG I and side-business rules.
- Residence permit, visa, or work authorization constraints.
- UG/GmbH formation decisions.
- Retroactive corrections or missed deadlines.

## Source Lifecycle

Every rule pack value has an owner-facing lifecycle:

- `last_verified`: date a contributor checked the cited source.
- `review_by`: date after which the value should be treated as stale.
- `risk_level`: operational impact if the value is wrong.
- `source_id`: link to a registry entry in `sources/source-registry.json`.

The default posture is conservative. A stale source should create a warning or failure, not silent confidence.

High-risk config values must include a `verification_checkpoint`. Scripts should surface those checkpoints in generated reports so a user cannot mistake a candidate result for a submission-ready answer.

## Agent Compatibility

Skills are plain directories with `SKILL.md` and optional references/examples. They are intentionally readable by Codex, Claude Code, Cursor, Windsurf, Aider, and other file-oriented coding agents.

The expected agent pattern is:

1. Read the relevant skill.
2. Load only the referenced material needed for the user's case.
3. Ask for missing user inputs.
4. Run deterministic scripts where structured validation is available.
5. Produce output using the shared templates.
6. Clearly label uncertainty and review items.
