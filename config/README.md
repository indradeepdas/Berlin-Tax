# Configuration Strategy

Config files hold rules that should be reviewable without reading script internals.

## Files

- `rules.de.berlin.json`: source-backed statutory, invoice, calendar, and Berlin workflow candidates.
- `workflow-rules.json`: required fields and review-routing gates for operational workflow packets.
- `output-standard.json`: shared report contract and allowed status/finding values.

## Rules

- Legal thresholds and deadline candidates belong in config, not in scripts.
- Every source-backed value needs `source_id`, `last_verified`, `review_by`, `risk_level`, and a `verification_checkpoint` when high risk.
- Workflow routing rules should collect evidence and route review. They should not decide the underlying legal, tax, employment, immigration, or company-law issue.
- If a rule changes script behavior, update examples and run `npm test`.

## Review

Run:

```bash
npm run audit:sources
npm test
```

See `docs/SOURCE_GOVERNANCE.md` for source and stale-rule process.
