# Repository Safety Audit

Audit date: 2026-05-08

Review lenses: Steuerberater-style tax caution, compliance operations, legal risk review, and open-source maintainability.

## Findings Addressed

| ID | Severity | Issue | Risk | Corrected Wording Or Behavior | Architectural Safeguard |
| --- | --- | --- | --- | --- | --- |
| A-001 | High | UStVA calendar treated new businesses as a deterministic monthly case. | A founder could add operational reminders based on an incomplete period assumption. | "No UStVA period was selected because the profile describes a new business without a confirmed UStVA period." | `generate-compliance-calendar.mjs` now emits scenario dates and a review item unless the period is confirmed. |
| A-002 | High | Invoice validation did not model Kleinunternehmer-specific invoice fields separately from regular invoices. | False positives and misleading confidence for Kleinunternehmer invoices. | "The validator selected the Kleinunternehmer field checklist. This is a validation path, not a legal conclusion." | Added `ustdv-34a` source and a dedicated `kleinunternehmer_required_fields` rule set. |
| A-003 | High | Small-invoice relief could be selected by amount alone. | Cross-border, reverse-charge, or special VAT cases could receive relaxed field checks. | "Invoice amount is within the small-invoice range, but relationship or special VAT indicators require review before using relaxed fields." | Validator now requires domestic relationship and no special VAT flag before using small-invoice fields. |
| A-004 | High | Config values had source metadata but no explicit pre-use verification checkpoints. | Contributors and agents could treat fresh-looking source metadata as enough for external use. | "No generated output is submission-ready until its verification checkpoints are complete." | High-risk rules now require `verification_checkpoint`; `audit-sources.mjs` enforces this. |
| A-005 | Medium | Generated reports lacked a dedicated verification checkpoint section. | Users could miss the distinction between open questions and blocking pre-submission checks. | Added `verification_checkpoints` to the report contract. | `createReport` now includes checkpoints and scripts populate them from config. |
| A-006 | Medium | README described deterministic deadline validation too broadly. | The project could appear to certify deadline correctness. | "Candidate deadline generation" replaces broad deadline validation wording. | README, architecture, and disclaimer now label validation reports as preparation-only. |
| A-007 | Medium | Source-audit checks allowed high-risk rule entries without operational control text. | Future rule additions could be technically sourced but unsafe to use. | High-risk rules must describe the verification action required before external use. | Source audit fails on missing `verification_checkpoint` for high-risk entries. |
| A-008 | Medium | Self-audit only checked hardcoded statutory amounts in scripts. | Markdown skills could accidentally embed unstable legal values. | "Possible hardcoded legal threshold or statutory amount. Load from config or source registry instead." | Self-audit now scans docs and skills, excluding config, source registry, examples, and package metadata. |
| A-009 | Medium | Templates lacked a durable preparation-only notice. | Output copied into real workflows could lose the trust boundary. | "This output is preparation support." | Output, accountant handoff, and review templates now include boundary and verification language. |
| A-010 | Low | Skill examples did not consistently include verification checkpoints. | Examples could teach agents to omit blocking pre-submission checks. | Added verification checkpoint sections to every sample skill output. | Skill validator now requires `Verify Before Submission Controls` in every skill. |

## Remaining Known Limits

- The repository still does not verify live source content automatically. `last_verified` is contributor-maintained.
- Deadline dates are not adjusted for public holidays, weekends, extensions, or individual authority messages.
- VAT treatment, classification, ALG I, immigration, payroll, and company-law questions remain review-gated by design.
- Invoice validation checks fields and obvious contradictions; it does not validate XML, XRechnung, ZUGFeRD, VAT IDs, or tax treatment.

