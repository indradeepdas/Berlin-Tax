# Security Policy

Berlin-Tax treats two classes of issues as security-sensitive:

1. Conventional software security issues, such as code execution, unsafe file handling, dependency risk, or CI misuse.
2. Safety issues that could cause users to rely on unsafe legal, tax, immigration, employment, benefit, invoice, or filing guidance.

## Supported Versions

Until `1.0.0`, only the current `main` branch and the latest tagged release are supported for security and unsafe-advice corrections.

## What To Report

Report privately when possible if you find:

- A script behavior that could silently emit unsafe `pass` status.
- A source freshness or config issue that could mislead users about tax, invoice, filing, or authority behavior.
- A workflow that presents professional-review matters as resolved.
- A vulnerability in scripts, GitHub workflows, or repository automation.
- Accidental exposure of personal data, tax numbers, addresses, invoices, identity documents, authority letters, or private correspondence.

## Reporting Process

Preferred process:

1. Use GitHub private vulnerability reporting if it is enabled for the repository.
2. If private reporting is unavailable and the issue contains no personal data or exploit detail, open a public issue with the minimum necessary information.
3. If the issue includes personal data, do not paste it into a public issue. Redact the data and describe the affected file or workflow.

## Response Expectations

Maintainers should triage reports by risk:

- Critical: unsafe `pass` status, exposed private data, or executable security issue.
- High: source-backed rule is stale or wrong in a way that could affect filings, invoices, deadlines, or penalties.
- Medium: ambiguous workflow wording could lead to unsafe action.
- Low: documentation or template issue with limited user impact.

For critical or high issues, maintainers should prefer conservative patches: downgrade outputs to `review` or `fail`, add verification checkpoints, and update source metadata before improving usability.

## Out Of Scope

Berlin-Tax does not provide emergency professional advice. If a user has a real tax, legal, immigration, employment, benefit, or filing deadline problem, they should contact the responsible authority or qualified professional.

