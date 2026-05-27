# Beta Readiness

Berlin-Tax is in public beta for workflow preparation and expert review.

Current label:

```text
Berlin-Tax v0.2 - public beta for workflow preparation and expert review
```

The repository is useful for structured preparation, deterministic checks, source review, and accountant-ready packets. Public beta here means the repository can be opened to public users and contributors with a defensible, machine-checkable quality gate. It does not mean the project files or decides tax, legal, employment, immigration, or filing outcomes.

## What Works Today

- Operational intake validation for Berlin founder workflows.
- Gewerbeanmeldung and Finanzamt onboarding preparation.
- Invoice field completeness checks with e-invoice review gates.
- Kleinunternehmer monitoring from config-backed values.
- UStVA readiness calendar candidates.
- Accountant handoff validation.
- Source registry audits and a freshness dashboard.
- A complete golden path for a Berlin solo consulting side business.

## What Does Not Work Yet

- No ELSTER submission.
- No Service Berlin submission.
- No tax return generation.
- No XRechnung or ZUGFeRD XML validation.
- No VAT ID validity check.
- No live official-source fetching.
- No final Freiberufler vs Gewerbe decision.
- No final Kleinunternehmer eligibility decision.
- No final VAT treatment decision.
- No employment, immigration, benefit, payroll, notary, or company-law decision.

## Public Beta Scope

Public beta covers:

- repository quality
- deterministic workflow checks
- source freshness visibility
- documentation fidelity
- golden-path packet quality

Public beta does not claim:

- live legal or tax correctness certification
- filing readiness
- e-invoice format certification
- binding case resolution
- zero-review workflows

## Beta-Safe Use

Every deterministic output should be treated as preparation material until:

- assumptions are reviewed
- user-provided inputs are reconciled to evidence
- source references are checked against current official pages
- professional-review items are resolved
- authority-specific correspondence is considered

The correct beta behavior is often `review`. That status should still produce useful next steps, document lists, and reviewer questions.

## Golden Path

The public beta currently has one polished founder journey:

```bash
npm run beta:golden-path
```

Scenario:

```text
Berlin solo founder starting a consulting side business
```

Packets:

- `examples/golden-path/solo-consulting-side-business/gewerbe-prep-packet.md`
- `examples/golden-path/solo-consulting-side-business/finanzamt-onboarding-packet.md`
- `examples/golden-path/solo-consulting-side-business/accountant-handoff-packet.md`

The sample intentionally keeps classification, Kleinunternehmer posture, e-invoice handling, UStVA period, and employer side-business evidence under review.

## Source Freshness

Run:

```bash
npm run sources:dashboard
```

The dashboard reads `sources/source-registry.json`. It does not fetch live pages. For beta release decisions, stale high-risk sources are blockers and soon-to-review sources require maintainer attention.

## E-Invoice Gap

The invoice validator is not beta-grade for full German e-invoice compliance. It can flag domestic B2B review conditions and missing fields, but it does not parse or validate XRechnung, ZUGFeRD, XML syntax, transmission readiness, or tax treatment.

Official context:

- BMF e-invoice FAQ: https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html

The BMF FAQ page, shown as updated in March 2026, describes the domestic business-to-business e-invoice regime, transition rules, and the distinction between structured e-invoices and unstructured documents such as simple PDFs. Berlin-Tax must keep this as a review gate until dedicated e-invoice validation exists.

## UStVA Gap

The UStVA workflow is a readiness workflow. It does not calculate filing figures, submit forms, or confirm the user's filing period.

Official context:

- ELSTER Umsatzsteuer-Voranmeldung page: https://www.elster.de/eportal/formulare-leistungen/alleformulare/ustvaeru

The ELSTER page exposes the UStVA form flow for entrepreneurs and shows that the period selection happens inside the form flow. Berlin-Tax should keep generated dates as candidate planning dates until ELSTER/Finanzamt correspondence is checked.

## Public Beta Release Gate

Run:

```bash
npm run sources:dashboard:write
npm run beta:check
```

`npm run beta:check` is the machine-checkable release gate. It verifies:

- core deterministic test suite
- stress scenarios
- golden-path execution
- source dashboard freshness
- public README and beta docs
- golden-path packet structure
- human-readable CLI failure modes

## Public Beta Entry Checklist

- Golden path runs without `fail`.
- Non-engineer quickstart can be followed without reading source code.
- Source dashboard has no stale high-risk or professional-review sources.
- README clearly says what the repo does not do.
- Invoice docs visibly explain XRechnung/ZUGFeRD and VAT ID gaps.
- UStVA docs visibly explain readiness-only behavior.
- Every generated output starts with the preparation-only boundary.
- `npm run beta:check` passes.

## What Still Requires Human Judgment

- invoice tax treatment
- Freiberufler vs Gewerbe classification
- Kleinunternehmer eligibility and opt-out interpretation
- immigration and employment constraints
- missed-filing recovery
- authority-specific instructions and correspondence

## Beta Posture

Call it public beta only in this sense:

- public, open-source, and ready for public scrutiny
- preparation-only and review-gated by design
- useful to founders and reviewers without pretending to decide the hard parts
