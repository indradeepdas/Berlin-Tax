# Source Notes: Kleinunternehmer Workflows

Primary source IDs:

- `ustg-19`: threshold and Kleinunternehmer rule context.
- `ustg-14`: invoice context.
- `ustdv-33`: small-invoice context.
- `ustdv-34a`: Kleinunternehmer invoice field context.
- `bmf-e-rechnung-faq`: e-invoice caution.

Operational notes:

- The skill must distinguish revenue from profit.
- Threshold values must be loaded from config.
- The output should say "Kleinunternehmer assumption" unless a professional has confirmed the position.
- Always ask whether VAT was charged, because that changes risk.
- Always ask for the invoice sequence around a suspected threshold crossing. The operational question is not only the amount; it is what was issued before and after the crossing event.
