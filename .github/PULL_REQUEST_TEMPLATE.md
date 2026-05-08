# Pull Request

## Summary

-

## Change Type

- [ ] Documentation only
- [ ] Skill workflow
- [ ] Deterministic script
- [ ] Config or source registry
- [ ] Example or stress fixture
- [ ] GitHub/maintainer infrastructure
- [ ] Safety wording or trust boundary

## Risk Review

- [ ] No final legal, tax, immigration, employment, benefit, filing, or company-law conclusion was added.
- [ ] No unstable legal threshold or deadline was hardcoded in scripts or prose.
- [ ] New or changed rule values are source-backed and config-driven.
- [ ] New examples are fictional, redacted, and explicit about evidence state.
- [ ] Any uncertain workflow routes to `review` or `fail`, not silent `pass`.

## Source Review

- [ ] No source changes.
- [ ] Source changes are included in `sources/source-registry.json`.
- [ ] Affected config entries include `source_id`, `last_verified`, `review_by`, `risk_level`, and `verification_checkpoint`.
- [ ] `npm run audit:sources` passes.

## Validation

- [ ] `npm test`
- [ ] `npm run stress` when applicable
- [ ] `git diff --check`

## Notes For Maintainers

-

