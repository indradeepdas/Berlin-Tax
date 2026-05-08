# Contributing

Berlin-Tax is a trust-sensitive repository. Contributions should make the system more verifiable, more cautious, or more operationally useful.

## Contribution Rules

- Prefer official sources: laws, official portals, authority pages, BMF, ELSTER, Berlin service pages, Bundesagentur fuer Arbeit, IHK/HWK only when relevant and clearly labeled.
- Do not add legal thresholds or deadlines directly to scripts or prose-only workflows. Put them in `config/` with source metadata.
- Do not present legal, tax, employment, immigration, or company-law judgments as final conclusions.
- Expose assumptions and uncertainty in every workflow.
- Keep skills composable and focused. A skill should solve one operational workflow well.
- Use plain Node.js for deterministic scripts. Avoid dependencies unless the maintainer group explicitly accepts the tradeoff.

## Pull Request Checklist

Before opening a PR:

- Run `npm test`.
- Confirm every new source has `source_url`, `last_verified`, `review_by`, and `risk_level`.
- Confirm every new skill has purpose, workflow, required inputs, outputs, risks, escalation conditions, source notes, and examples.
- Confirm outputs separate verified facts, user-provided inputs, assumptions, open verification items, and professional-review items.
- Run the self-audit and resolve unsafe claim patterns before merging.

## Risk Levels

- `low`: operational formatting or checklist issue.
- `medium`: could cause delay, authority back-and-forth, or accountant rework.
- `high`: could affect deadlines, tax position, registration status, or penalties.
- `professional_review_required`: the workflow must route the matter to a qualified professional or official authority.

## Source Review

Set `review_by` based on risk:

- High-risk tax and deadline values: 90 days or less.
- Medium-risk authority workflow pages: 180 days or less.
- Stable explanatory references: 365 days or less.

When in doubt, shorten the review window.
