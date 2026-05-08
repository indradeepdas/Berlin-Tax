# Contributing

Berlin-Tax is a trust-sensitive repository. Contributions should make the system more verifiable, more cautious, or more operationally useful.

Before contributing, read:

- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)
- [docs/MAINTAINER_GUIDE.md](docs/MAINTAINER_GUIDE.md)
- [docs/SOURCE_GOVERNANCE.md](docs/SOURCE_GOVERNANCE.md)
- [docs/NAMING_CONVENTIONS.md](docs/NAMING_CONVENTIONS.md)
- [docs/VERSIONING.md](docs/VERSIONING.md)

## Contribution Types

Good contributions include:

- Source freshness updates.
- Safer workflow wording.
- Deterministic validators for structured checks.
- More realistic redacted examples.
- Missing escalation conditions.
- Better source notes and verification checkpoints.
- Maintainer tooling that keeps the repository easier to audit.

Avoid contributions that add:

- Final legal, tax, employment, immigration, or company-law conclusions.
- Automated filing or submission behavior.
- Hardcoded unstable thresholds in scripts.
- Non-official sources as the basis for deterministic rules.
- Polished happy-path examples that hide missing evidence.
- Fake full addresses, fake authority letters, or fake acceptance outcomes.

## Local Setup

Requires Node.js 20 or newer.

```bash
npm test
npm run stress
```

No install step is currently required because the deterministic scripts use plain Node.js only.

## Pull Request Standards

Before opening a pull request:

- Run `npm test`.
- Run `npm run stress` if you changed workflows, examples, validators, config, or templates.
- Run `git diff --check`.
- Confirm every new source has `source_url`, `last_verified`, `review_by`, and `risk_level`.
- Confirm every high-risk rule has a `verification_checkpoint`.
- Confirm every new skill has purpose, workflow, required inputs, outputs, risks, escalation conditions, verify-before-submission controls, operational reality checks, source notes, and examples.
- Confirm generated outputs separate verified facts, user-provided inputs, assumptions, open verification items, verification checkpoints, and professional-review items.
- Confirm examples are fictional, redacted, and explicit about evidence state.

## Source-Backed Rules

If a value affects tax, registration, invoice checks, deadlines, or workflow branching:

1. Add or update the source in `sources/source-registry.json`.
2. Add or update the rule in `config/`.
3. Add a verification checkpoint.
4. Run `npm run audit:sources`.
5. Document the source impact in the pull request.

See [docs/SOURCE_GOVERNANCE.md](docs/SOURCE_GOVERNANCE.md).

## Deterministic Logic

Use deterministic scripts for:

- calculations
- thresholds
- syntax validation
- field validation
- recurrence logic
- completeness checks
- source freshness checks
- workflow branching into review states

Do not ask an LLM to decide those things when structured input exists.

## Risk Levels

- `low`: operational formatting or checklist issue.
- `medium`: could cause delay, authority back-and-forth, or accountant rework.
- `high`: could affect deadlines, tax position, registration status, or penalties.
- `professional_review_required`: the workflow must route the matter to a qualified professional or official authority.

## Naming

Follow [docs/NAMING_CONVENTIONS.md](docs/NAMING_CONVENTIONS.md). Do not rename source IDs, scripts, or config keys only for style after they are published.

## Versioning

Use [docs/VERSIONING.md](docs/VERSIONING.md) for release impact. Until `1.0.0`, maintainers may still refine structure, but report-shape changes and script argument changes should be treated carefully.

## Maintainer Review Posture

When reviewing a change, ask:

- Would this make a stressed founder more likely to act without review?
- Does the script prove the claim, or only format it?
- Is the official source current and jurisdictionally correct?
- Does the output make uncertainty visible?
- Would a Steuerberater or compliance reviewer understand what is verified and what is assumed?
