# Changelog

## 2026-05-09

### Added

- Founder CLI intake wizard with interactive mode and deterministic profile mode.
- Founder golden path runner for the Berlin solo consulting side-business scenario.
- Golden-path fixtures and three human-readable packets:
  - Gewerbe prep packet
  - Finanzamt onboarding packet
  - accountant handoff packet
- Source freshness dashboard generator and published dashboard document.
- Beta-readiness documentation and non-engineer quickstart.

### Changed

- Deterministic report contract now surfaces trust boundaries first:
  - `boundary_notice`
  - `assumptions`
  - `user_provided_inputs`
  - `verified_facts`
  - `verified_source_references`
  - `professional_review_required`
  - `verification_before_submission`
- Invoice validation now adds explicit domestic B2B e-invoice awareness limits and unstructured-format review warnings.
- Workflow routing now includes a deterministic classification review gate for unresolved Freiberufler vs Gewerbe posture.
- Source audit now emits the shared structured report shape instead of plain pass/fail text only.

### Documentation

- README and user guide updated for the founder CLI beta path.
- Source-governance and maintainer docs updated for the dashboard and beta checks.
- Shared output-standard and configuration docs updated for the new report shape.
- Skill docs updated where workflow behavior changed.

### Verification

- `npm test`
- `npm run validate`
- `npm run stress`
- `npm run intake:wizard -- --profile solo-consulting-side-business --print`
- `npm run sources:dashboard`
- `npm run beta:golden-path`
