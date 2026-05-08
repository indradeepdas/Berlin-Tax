# Source Notes: Invoice Compliance Validation

Primary source IDs:

- `ustg-14`: regular invoice requirements and e-invoice legal context.
- `ustdv-33`: small-invoice requirements.
- `ustg-19`: Kleinunternehmer warning context.
- `bmf-e-rechnung-faq`: e-invoice operational caution.

Operational notes:

- The validator checks field presence and obvious contradictions.
- It does not validate XML, XRechnung, ZUGFeRD, VAT ID validity, VAT rate correctness, or tax treatment.
- Domestic B2B invoices should be routed to e-invoice review.

