# Configuration Strategy

Config files hold rules that should be reviewable without reading script internals.

## Files

- `rules.de.berlin.json`: source-backed statutory, invoice, calendar, and Berlin workflow candidates.
- `workflow-rules.json`: required fields and review-routing gates for operational workflow packets.
- `output-standard.json`: shared beta-safe report contract and allowed status/finding values.

## Rules

- Legal thresholds and deadline candidates belong in config, not in scripts.
- Every source-backed value needs `source_id`, `last_verified`, `review_by`, `risk_level`, and a `verification_checkpoint` when high risk.
- Workflow routing rules should collect evidence and route review. They should not decide the underlying legal, tax, employment, immigration, or company-law issue.
- Output-standard changes are public-interface changes. If a field is added, removed, renamed, or reordered in a way that downstream agents depend on, update docs and treat compatibility carefully.
- If a rule changes script behavior, update examples and run `npm test`.

## Current Report Contract

The shared output contract now expects reports to surface trust boundaries first:

- `boundary_notice`
- `assumptions`
- `user_provided_inputs`
- `verified_facts`
- `verified_source_references`
- `professional_review_required`
- `verification_before_submission`
- `open_verification_items`
- `verification_checkpoints`

This is meant to reduce the chance that an operator skips directly to `status` and treats a report as filing-ready.

## Review

Run:

```bash
npm run audit:sources
npm run sources:dashboard
npm test
```

See `docs/SOURCE_GOVERNANCE.md` for source and stale-rule process.
