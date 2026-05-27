# Berlin-Tax

Operational intelligence for surviving German bureaucracy.

Berlin-Tax is an early open-source preparation toolkit for Berlin founder operations: intake, source tracking, deterministic checks, review gates, and accountant-handoff drafts for German administrative workflows.

This is an exploratory open-source experiment around AI-assisted contextual reconstruction for founder-facing tax/compliance workflows in Germany.

The project is not intended to replace professional tax advice. The core idea is to explore whether fragmented operational and regulatory context can be transformed into structured intake, explicit assumptions, reviewable reasoning layers, and cleaner handoff workflows.

It is built for agents and human operators helping founders, freelancers, immigrants, side-business operators, UG/GmbH founders, restaurant operators, cross-border contractors, and first-time German business operators. It is not a tax filing product.

Keywords: Berlin, Germany, bureaucracy, founder compliance, Gewerbeanmeldung, Finanzamt, ELSTER, UStVA, invoices, Kleinunternehmer, Steuerberater handoff, AI agent skills.

Recent repository changes are summarized in [CHANGELOG.md](CHANGELOG.md).

## Status

Project stage: `0.2.x`, preparation-only public beta.

Public label: `Berlin-Tax v0.2 - public beta for workflow preparation and expert review`.

Use this repo when you need to structure a case, find missing inputs, run deterministic checks, and prepare a review packet. Do not use it to decide legal classification, VAT treatment, immigration permission, benefit eligibility, payroll, or company-law obligations.

Many outputs intentionally return `review`. That means the workflow found a decision, document gap, stale source, or professional-review condition that should not be resolved by an LLM.

## What It Does

- Collects operational intake for German/Berlin founder workflows.
- Runs plain Node.js validators for field checks, thresholds, source freshness, workflow routing, and candidate calendars.
- Keeps source metadata separate from workflow prose.
- Produces structured outputs with facts, user inputs, assumptions, verification checkpoints, and professional-review items separated.
- Helps agents such as Codex, Claude Code, Cursor, Windsurf, and Aider use the same procedural layer.

## What It Does Not Do

- It does not submit to ELSTER or Service Berlin.
- It does not generate tax returns.
- It does not certify invoices as compliant.
- It does not decide Freiberufler vs Gewerbe, Kleinunternehmer eligibility, VAT treatment, ALG I handling, residence permission, or UG/GmbH obligations.
- It is not a substitute for a Steuerberater, lawyer, Finanzamt, Arbeitsagentur, LEA, notary, IHK/HWK, or other authority.

## Quickstart

Requires Node.js 20 or newer.

For a non-engineer path, start with [docs/NON_ENGINEER_QUICKSTART.md](docs/NON_ENGINEER_QUICKSTART.md).

```bash
npm test
```

Run the founder public beta path:

```bash
npm run beta:golden-path
```

Generate intake JSON:

```bash
npm run intake:wizard
npm run intake:wizard -- --profile solo-consulting-side-business --print
```

Check source freshness metadata:

```bash
npm run sources:dashboard
```

Run the public beta release gate:

```bash
npm run beta:check
```

Run the main sample checks:

```bash
npm run validate:workflows
npm run validate:invoice:sample
npm run check:thresholds
npm run calendar:sample
npm run stress
```

The invoice sample intentionally returns `review` because domestic B2B Kleinunternehmer invoicing has e-invoice and status questions:

```bash
node scripts/validate-invoice.mjs examples/invoices/kleinunternehmer-b2b-review.json
```

## User Guide

End users should start with [docs/USER_GUIDE.md](docs/USER_GUIDE.md). It explains:

- which workflow to use for a specific Berlin tax or bureaucracy goal
- which inputs to collect first
- which scripts to run
- how to interpret `pass`, `review`, and `fail`
- when to stop and escalate to a Steuerberater or authority

Beta status and release gates are tracked in [docs/BETA_READINESS.md](docs/BETA_READINESS.md).

## Current Workflows

| Workflow | Path | Deterministic support |
| --- | --- | --- |
| Berlin Gewerbeanmeldung preparation | `skills/gewerbeanmeldung-berlin` | intake validator and review routing |
| Finanzamt onboarding | `skills/finanzamt-onboarding` | intake, handoff, contradiction validators |
| UStVA preparation | `skills/ustva-preparation` | candidate calendar generation |
| Invoice field validation | `skills/invoice-compliance-validation` | invoice validator |
| Kleinunternehmer monitoring | `skills/kleinunternehmer-workflows` | threshold monitor |

## Repository Layout

```text
.
|-- .github/               GitHub issue forms and pull request template
|-- config/                Machine-readable rule packs and output contracts
|-- docs/                  Maintainer guidance, source process, versioning
|-- examples/              Fictional fixtures, stress cases, sample outputs
|-- scripts/               Plain Node.js validators and audits
|-- scripts/lib/           Shared script utilities
|-- skills/                Agent-readable procedural skills
|-- sources/               Official-source registry and review metadata
|-- templates/             Shared workflow output templates
|-- ARCHITECTURE.md        System model and diagrams
|-- CONTRIBUTING.md        Contributor rules and PR expectations
|-- SECURITY.md            Security and unsafe-advice reporting policy
```

## Architecture

Berlin-Tax separates orchestration from validation:

- LLMs interpret context and assemble outputs.
- Scripts validate structured facts and emit review gates.
- Config stores thresholds, fields, and routing rules.
- Source registry records official-source provenance.
- Humans and qualified professionals make case-specific legal, tax, employment, immigration, filing, and company-law decisions.

See [ARCHITECTURE.md](ARCHITECTURE.md) for diagrams and maintainer rules.

## Source Discipline

Every unstable rule must include:

- `source_id`
- `source_url`
- `last_verified`
- `review_by`
- `risk_level`
- `verification_checkpoint` for high-risk or professional-review rules

Run:

```bash
npm run audit:sources
npm run sources:dashboard
npm run audit:self
```

Source and stale-rule updates are documented in [docs/SOURCE_GOVERNANCE.md](docs/SOURCE_GOVERNANCE.md).

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Experienced contributors should also read:

- [docs/MAINTAINER_GUIDE.md](docs/MAINTAINER_GUIDE.md)
- [docs/NAMING_CONVENTIONS.md](docs/NAMING_CONVENTIONS.md)
- [docs/VERSIONING.md](docs/VERSIONING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)
- [BRUTAL_HONESTY_REVIEW.md](BRUTAL_HONESTY_REVIEW.md)

Good first contribution types:

- Source freshness updates.
- Better examples with realistic evidence state.
- Validator gaps where deterministic logic should replace agent reasoning.
- Workflow wording that reduces overclaiming or ambiguity.

## Maintainer Checks

Before merging, maintainers should run:

```bash
npm run maintain:check
npm run sources:dashboard:write
npm run beta:check
git diff --check
```

Pull requests must not add hardcoded legal thresholds to scripts, case-specific legal/tax determinations to prose, or clean happy-path examples that hide missing evidence.

## What Is Still Weak

- No attachment manifest validator yet.
- No ledger reconciliation engine yet.
- No XRechnung/ZUGFeRD parser yet.
- No VAT ID validity checker yet.
- No live official-source freshness checker yet.
- UStVA scripts generate candidate dates, not filing figures.
- Public examples are fictional fixtures, not model answers for real users.
- The repo cannot resolve conflicting adviser, authority, or forum advice by itself.

## Public Beta Scope

Berlin-Tax is now positioned for public beta within a narrow scope:

- workflow preparation
- deterministic completeness and threshold checks
- source freshness tracking
- accountant-ready packet preparation

The public beta does not mean Berlin-Tax is ready to file, certify, or decide tax and legal questions. It means the repository surface, release gate, examples, and deterministic checks are strong enough for public scrutiny within the stated preparation-only boundary.

## Legal Notice

Berlin-Tax is operational infrastructure, not legal, tax, accounting, immigration, employment, or company-law advice. Read [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md) before using it for real-world workflows.
