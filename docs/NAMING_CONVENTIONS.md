# Naming Conventions

Consistent names make the repository easier to search and review.

## Files And Directories

- Use lowercase kebab-case for skill directories: `gewerbeanmeldung-berlin`.
- Use lowercase kebab-case for examples: `kleinunternehmer-b2b-review.json`.
- Use action-oriented script names:
  - `validate-*.mjs` for structured input validation.
  - `check-*.mjs` for focused deterministic checks.
  - `generate-*.mjs` for candidate output generation.
  - `audit-*.mjs` for repository or source governance checks.
- Keep shared script utilities under `scripts/lib/`.
- Keep public docs in `docs/` unless GitHub expects the file at repo root.

## Package Scripts

Use `domain:action` or `action:domain` consistently within an area:

- `validate:*` for validators.
- `audit:*` for audit scripts.
- `stress:*` for scenario stress fixtures.
- `calendar:*` for calendar generation samples.

Do not remove existing script aliases without a release note.

## Source IDs

Source IDs should be stable, lowercase, and authority-oriented:

- Good: `ustg-19`, `berlin-gewerbeanmeldung`, `bmf-e-rechnung-faq`.
- Avoid: `new-source-1`, `random-blog`, `threshold-page`.

Do not rename a `source_id` only for style. Rename only when the authority or source meaning changed.

## Report Status

Use only:

- `pass`: structurally complete and no unresolved review gates.
- `review`: structurally usable for preparation but has open verification or professional-review items.
- `fail`: missing required fields, unknown source IDs, stale high-risk sources, or invalid structured input.

## Example Data

Public examples must be fictional and redacted. Use names such as `Fictional Solo Operator`, not real-looking full personal data or fake official letters.

