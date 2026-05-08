# Source Notes: Gewerbeanmeldung Berlin

Primary source IDs:

- `berlin-gewerbeanmeldung`: Service Berlin, Gewerbe anmelden.
- `gewerbeanmeldung-legal-basis`: Gewerbeordnung Section 14.
- `berlin-lea-self-employed`: residence permit for self-employed activity.
- `berlin-lea-freelance`: residence permit for freelance activity.
- `berlin-gaststaette-permit`: restaurant permit escalation.
- `ba-alg1-nebenjob`: ALG I side-work escalation.

Operational notes:

- Berlin treats the Gewerbeanmeldung as a notification workflow for a gewerbliche activity.
- The Berlin service page identifies required documents such as the Gewerbeanmeldung form, personal identification, Handelsregister extract for registered entities, and formation documents for companies in formation.
- Berlin fee candidates are stored in `config/rules.de.berlin.json`.
- Current Berlin processing notices may change quickly. Always include an open verification item to check the current Service Berlin page before filing.
- A non-EU founder's Gewerbeanmeldung preparation is incomplete until the residence title and self-employment permission path are checked.
- A restaurant or alcohol-serving activity is not operationally covered by a basic Gewerbeanmeldung checklist.
- An ALG I side business must be treated as a benefit-reporting workflow before any "start work" instruction.

Do not:

- Decide that an activity is definitively gewerblich.
- Claim that all permits are covered by the Gewerbeanmeldung.
- Treat online availability as universal for every legal form.
