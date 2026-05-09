# Source Governance

Berlin-Tax is official-source-first. A source-backed rule is only useful if contributors can see where it came from, when it was checked, and when it becomes stale.

## Source Registry

All official sources live in `sources/source-registry.json`.

Each source entry must include:

- `id`
- `title`
- `authority`
- `jurisdiction`
- `source_url`
- `last_verified`
- `review_by`
- `risk_level`
- `used_for`

## Rule Metadata

Config values that affect registration, invoice checks, thresholds, deadlines, or review routing must include:

- `source_id`
- `last_verified`
- `review_by`
- `risk_level`
- `verification_checkpoint`

## Source Update Process

1. Open a source update issue using the GitHub source update form.
2. Identify the `source_id`, official URL, affected workflow, and observed change.
3. Update `sources/source-registry.json`.
4. Update any affected rule in `config/`.
5. Update skill source notes only if workflow wording or escalation behavior changed.
6. Run:

```bash
npm run audit:sources
npm run sources:dashboard
npm test
```

7. In the pull request, state whether the change is:
   - source metadata only
   - source URL/title update
   - rule value update
   - workflow behavior update
   - safety wording update

## Stale-Rule Review Process

A rule is stale when `review_by` is before the review date used by `scripts/audit-sources.mjs`.

When a stale rule is found:

1. Treat affected outputs as blocked or review-gated.
2. Check the official source manually.
3. If the source is unchanged, update `last_verified` and `review_by`.
4. If the source changed, update the affected config value and any validator expectations.
5. If the source moved, update the registry URL and preserve the same `source_id` unless the authority changed.
6. If the source disappeared, do not silently replace it with an unofficial source. Open an issue and mark affected rules review-gated.

Regenerate the public dashboard after source metadata changes:

```bash
node scripts/generate-source-dashboard.mjs --out docs/SOURCE_DASHBOARD.md
```

The dashboard is a maintainer visibility tool. It does not fetch live official pages and must not be described as live legal freshness certification.

## Review Windows

Use shorter windows for higher operational risk:

- `professional_review_required`: 90 days or less.
- `high`: 90 days or less.
- `medium`: 180 days or less.
- `low`: 365 days or less.

When in doubt, use the shorter window.

## Non-Official Sources

Non-official sources may be used for context in examples or discussion, but they must not drive deterministic legal, tax, deadline, or registration behavior.
