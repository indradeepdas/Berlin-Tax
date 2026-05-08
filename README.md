# Berlin-Tax

Operational intelligence for surviving German bureaucracy.

Berlin-Tax is an open-source skill library for agents and founder operators navigating German and Berlin administrative workflows. It focuses on preparation, validation, checklists, source tracking, and accountant-ready handoff packages.

It is built for Berlin founders, freelancers, immigrants, side-business operators, UG/GmbH founders, solo entrepreneurs, restaurant operators, cross-border contractors, and first-time German business operators who need a reliable procedural map rather than another vague explanation of "German paperwork."

## What This Is

Berlin-Tax is:

- Workflow orchestration for German/Berlin bureaucracy.
- Compliance preparation for founder operations.
- Deterministic validation for invoices, thresholds, deadlines, and handoff completeness.
- Checklist generation with assumptions and uncertainty visible.
- A procedural knowledge layer for Codex, Claude Code, Cursor, Windsurf, Aider, and similar agentic coding tools.
- An accountant-ready output system, not an accountant replacement.

Berlin-Tax is not:

- An automated tax filing system.
- A legal opinion engine.
- A replacement for a Steuerberater, lawyer, Finanzamt, Arbeitsagentur, or official authority.
- A promise that a filing, classification, invoice, or registration is correct.

## Design Contract

The repository follows four operating rules:

1. LLMs interpret, ask for missing context, and orchestrate workflows.
2. Plain Node.js scripts validate, calculate, and flag deterministic issues.
3. Official sources come first, with source metadata tracked separately from workflows.
4. Legal caution beats automation. If a step is uncertain, the output must say so.

Every workflow output must separate:

- Verified facts.
- User-provided inputs.
- Assumptions.
- Open verification items.
- Items requiring professional review.

## First Release Skills

The v1 skill set focuses on founder onboarding and early operating compliance:

- `skills/gewerbeanmeldung-berlin`: Berlin business registration preparation.
- `skills/finanzamt-onboarding`: steuerliche Erfassung and Finanzamt onboarding preparation.
- `skills/ustva-preparation`: Umsatzsteuer-Voranmeldung preparation without submission automation.
- `skills/invoice-compliance-validation`: invoice field validation and review flags.
- `skills/kleinunternehmer-workflows`: Kleinunternehmerregelung monitoring and document preparation.

Future roadmap items include ALG I side-business preparation, UG/GmbH setup guidance, annual compliance calendar expansion, restaurant operator workflows, and cross-border contractor packs.

## Quickstart

Run the deterministic checks:

```bash
npm test
```

Validate an invoice input:

```bash
node scripts/validate-invoice.mjs examples/invoices/kleinunternehmer-valid.json
```

Check Kleinunternehmer monitoring inputs:

```bash
node scripts/check-thresholds.mjs examples/thresholds/kleinunternehmer-monitoring.json
```

Generate a sample compliance calendar:

```bash
node scripts/generate-compliance-calendar.mjs examples/profiles/ug-founder-berlin.json
```

## Repository Map

- `skills/`: installable agent skills with purpose, workflow, inputs, outputs, risks, escalation conditions, source notes, and examples.
- `config/`: source-backed rule packs. Legal thresholds and deadlines belong here, not inside scripts or prose.
- `scripts/`: plain Node.js validators and generators.
- `sources/`: official-source registry and review metadata.
- `templates/`: shared output formats for assumption logs, accountant handoff, and professional review.
- `examples/`: sample inputs and outputs for realistic founder scenarios.

## Source Discipline

Every unstable rule must include:

- `source_id`
- `source_url`
- `last_verified`
- `review_by`
- `risk_level`

If a value affects tax, registration, invoice compliance, or deadline behavior, it must be config-driven. Pull requests that add hardcoded thresholds to scripts should be rejected.

Run:

```bash
node scripts/audit-sources.mjs
node scripts/self-audit.mjs
```

## Output Standard

Generated outputs must include:

- Next steps.
- Required documents.
- Responsible authority.
- Assumptions.
- Open verification items.
- Source notes.
- Professional review triggers.

Never present an uncertain legal, tax, employment, residency, or company-law classification as a conclusion. Present it as a preparation position and route it to review.

## Legal Notice

Berlin-Tax is operational infrastructure, not legal or tax advice. It may help organize information for professional review, but users remain responsible for verifying requirements with official authorities and qualified professionals.

Read `LEGAL_DISCLAIMER.md` before using this repository for real-world workflows.

