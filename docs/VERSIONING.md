# Versioning

Berlin-Tax uses semantic versioning for repository releases, with additional caution for source-backed rule updates.

Current project stage: `0.1.x`.

## Version Format

Use `MAJOR.MINOR.PATCH`.

- `PATCH`: wording improvements, examples, source metadata refreshes with no behavior change, validator bug fixes that make outputs more conservative.
- `MINOR`: new skills, new validators, new config rule groups, new templates, or changed report fields that remain backward compatible.
- `MAJOR`: breaking changes to report shape, skill layout, CLI arguments, config schema, source registry schema, or safety boundary.

## Rule Pack Dates

Config files may carry date-based versions such as `2026.05.08`. These identify the review state of the rule pack, not the npm/package release.

Use date-based config versions when:

- source values were reviewed
- source IDs were added
- review windows changed
- workflow routing rules changed

## Release Notes

Release notes should include:

- Changed skills.
- Changed scripts.
- Changed config rule groups.
- Source IDs added or updated.
- Any stale-rule review completed.
- Any new professional-review gates.
- Known limitations.

## Supported Versions

Until `1.0.0`, only the current `main` branch and the latest tagged release are supported for security and unsafe-advice corrections.

## Compatibility Rule

If an external agent or script could parse a report field, treat field removal or rename as a breaking change. Adding a new field is minor unless it changes status behavior from `pass` to `review` or `fail` for existing valid fixtures.

