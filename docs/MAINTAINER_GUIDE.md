# Maintainer Guide

This guide defines the review posture for Berlin-Tax maintainers. The project is useful only if contributors can trust its boundaries.

## Maintainer Priorities

1. Prevent unsafe certainty.
2. Keep unstable rules source-backed and config-driven.
3. Prefer deterministic validation over agent reasoning when data is structured.
4. Preserve realistic evidence state in examples.
5. Keep the repository simple enough for external contributors to audit.

## Review Checklist

Before merging a pull request, verify:

- `npm test` passes.
- `npm run stress` passes when workflows, examples, or validators changed.
- `git diff --check` is clean.
- New source-backed values live in `config/`, not only in prose or scripts.
- New or changed sources are in `sources/source-registry.json`.
- High-risk rules include `verification_checkpoint`.
- Skills still include the required sections enforced by `scripts/validate-skill.mjs`.
- Examples are fictional, redacted, and explicit about missing evidence.
- No generated output is described as legally or tax compliant.

## Change Review By Area

| Area | Required reviewer mindset |
| --- | --- |
| `skills/` | Does the workflow route uncertainty to review and avoid final conclusions? |
| `config/` | Is each value source-backed, review-dated, and surfaced safely by scripts? |
| `scripts/` | Is the logic deterministic, small, and config-driven? |
| `sources/` | Is the source official, current, and matched to the right jurisdiction? |
| `examples/` | Does the fixture show realistic evidence gaps rather than a polished fantasy case? |
| `templates/` | Does the output structure make assumptions and review gates unavoidable? |
| `.github/` | Does the template collect enough information to triage without asking obvious follow-ups? |

## Merge Bar

A pull request should not merge if it:

- Adds legal, tax, employment, immigration, or company-law advice as a final conclusion.
- Hardcodes unstable legal thresholds in scripts.
- Adds a workflow with no source notes or review gates.
- Adds a happy-path example with no evidence state.
- Makes an LLM responsible for a deterministic calculation, syntax check, recurrence, or field completeness check.

## Release Checklist

Before tagging a release:

1. Run `npm test`.
2. Run `npm run stress`.
3. Run `npm run audit:sources`.
4. Review stale sources and update `review_by` only after checking the cited source.
5. Update `ROADMAP.md` if scope changed.
6. Update `docs/VERSIONING.md` if release policy changed.
7. Confirm `SECURITY.md` still describes supported versions.

