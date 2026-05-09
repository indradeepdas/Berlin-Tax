# Berlin-Tax Output Standard

Use this structure for every generated workflow output.

## Boundary Notice

This output is preparation support. It is not legal, tax, accounting, immigration, employment, or company-law advice and is not ready for submission until the verification checkpoints and professional-review items are resolved.

## Assumptions

Assumptions made to continue the workflow. Each assumption should be easy for the user or adviser to confirm or reject.

## User-Provided Inputs

Inputs supplied by the user. Do not treat these as independently verified.

## Verified Facts

Facts supported by official sources or deterministic script checks.

## Verified Source References

Registry-backed source references used by the report. These are traceability anchors, not proof that the source was fetched live at output time.

## Professional Review Required

Use this section to state the standing rule: anything listed in `professional_review_items` requires a qualified reviewer or responsible authority before external use.

## Professional Review Items

Issues that require a Steuerberater, lawyer, notary, Arbeitsagentur, Finanzamt, immigration adviser, IHK/HWK, or another qualified authority.

## Verification Before Submission

Release-blocking or submission-blocking controls that apply even when a report has no immediate errors. Use this section to force source recheck, evidence reconciliation, and unresolved-review resolution.

## Open Verification Items

Questions that must be checked against an official authority, source, professional adviser, or the user's documents.

## Evidence State

Status of the source documents behind the output: available, partial, missing, pending, not reconciled, or unknown. Use this section whenever the workflow depends on user records, authority letters, invoices, ledgers, bank exports, residence documents, or adviser comments.

## Verification Checkpoints

Blocking checks that must be completed before a form, invoice, calendar, or handoff package is used externally. If any checkpoint is incomplete, mark the output as preparation-only.

## Next Steps

Concrete procedural steps, in order.

## Required Documents

Documents, numbers, evidence, or registrations needed to proceed.

## Responsible Authority

The office, portal, adviser, or institution responsible for the next action.

## Source Notes

Official sources used, with source IDs and review dates.

## Status Interpretation

- `pass`: structured preparation can continue, but the output is still not submission approval
- `review`: uncertainty, review gating, stale-source risk, or unresolved evidence remains
- `fail`: the packet is incomplete or unsafe to use until the input is fixed
