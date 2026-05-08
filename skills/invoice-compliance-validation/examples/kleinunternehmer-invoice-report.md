# Sample Output: Kleinunternehmer Invoice Report

Fixture status: fictional public example, intentionally `review`.

## Verified Facts

- The invoice was checked by `scripts/validate-invoice.mjs`.
- Required field candidates came from config-backed invoice rules.

## User-Provided Inputs

- Invoice number: BT-2026-001.
- Tax regime assumption: Kleinunternehmer.
- Relationship: domestic B2B.
- Document state: draft, not sent.
- Customer address: present in draft, not independently checked.

## Assumptions

- User-provided customer and supplier addresses are accurate.
- The invoice note is intended to explain non-charging of VAT.
- The draft has not been paid, booked, reported, corrected, or replaced.

## Open Verification Items

- Confirm current e-invoice obligations and any UStDV 34a relief for this domestic B2B Kleinunternehmer invoice.
- Confirm tax regime with accountant before using the invoice template repeatedly.
- Confirm whether the customer requires a structured e-invoice format.
- Confirm that no older invoice number was skipped or already sent for the same service.

## Verification Checkpoints

- Confirm the supplier tax number, VAT ID, or Kleinunternehmer identifier is valid for invoice use.
- Verify the invoice note satisfies the current Kleinunternehmer invoice source.
- Keep the report as a field check, not a compliance certificate.

## Professional Review Items

- Domestic B2B e-invoice handling and UStDV 34a Kleinunternehmer invoice requirements.

## Next Steps

- Keep the validation report with the invoice.
- Review e-invoice format requirements before issuing to German business customers.
- If the invoice was already sent, stop and create a correction packet instead of editing the PDF.

## Required Documents

- Invoice draft.
- Service evidence.

## Responsible Authority

- User billing process.
- Steuerberater for review items.

## Source Notes

- `ustg-14`, `ustdv-33`, `ustdv-34a`, `ustg-19`, `bmf-e-rechnung-faq`.
