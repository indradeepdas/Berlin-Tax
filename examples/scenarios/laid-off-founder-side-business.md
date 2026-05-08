# Scenario: Laid-Off Founder Starting a Side Business

This scenario is intentionally not automated in v0.1 because ALG I, availability, weekly hours, and side-income treatment require current Bundesagentur fuer Arbeit review.

## Safe v0.1 Handling

- Use `gewerbeanmeldung-berlin` only for trade-registration preparation.
- Add a professional-review item before the user starts work or invoices.
- Add source `ba-alg1-nebenjob` to the assumption log.
- Do not calculate benefit reductions in v0.1.

## Required Questions

- Is the user currently receiving ALG I?
- Has the side activity been reported to Agentur fuer Arbeit?
- How many hours per calendar week are planned?
- Is there any employment, visa, or severance constraint?
- Will revenue start before or after registration?

## Required Output Stance

The output must say: "This workflow prepares questions and documents for the Agentur fuer Arbeit and adviser. It does not decide benefit eligibility."

