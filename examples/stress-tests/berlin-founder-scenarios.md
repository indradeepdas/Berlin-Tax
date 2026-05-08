# Berlin Founder Stress Test Scenarios

Stress test date: 2026-05-08

This pack records realistic workflow execution notes. It is intentionally operational: the goal is to expose what a founder would misunderstand, forget, or do in the wrong order.

## 1. Non-EU Immigrant Founder Starting A Gewerbe

Workflows executed: `gewerbeanmeldung-berlin`, `finanzamt-onboarding`.

Missing steps found:

- Residence title and self-employment permission were not prominent enough in the Gewerbeanmeldung path.
- The repo did not force an intake question for whether the founder has ALG I, employer, or immigration constraints.

Confusion points:

- "I can register a Gewerbe" is not the same as "I am allowed to work self-employed under my residence title."
- Service Berlin document requirements mention residence title, but a founder may treat it as just an ID attachment.

Hidden assumptions:

- The founder has the right to start immediately.
- The planned activity matches the permitted activity.

Terminology issues:

- "Selbstaendig", "freiberuflich", and "gewerblich" are easily collapsed into "self-employed" in English.

Repository changes made:

- Gewerbeanmeldung now starts with operational intake and routes non-EU cases to `berlin-lea-self-employed` or `berlin-lea-freelance`.
- Verify-before-submission controls now block filing readiness until immigration permission is checked.

## 2. Tech Freelancer Unsure About Freiberufler Vs Gewerbe

Workflows executed: `finanzamt-onboarding`, `gewerbeanmeldung-berlin`.

Missing steps found:

- The repo needed a contradiction log for cases where online sources say software developers are Freiberufler while other sources say Gewerbe.
- It needed a clearer qualification/evidence packet rather than a binary classifier.

Confusion points:

- "Informatiker" examples do not settle a specific software consulting fact pattern.
- Mixed product, SaaS, implementation, teaching, and consulting work can change the posture.

Hidden assumptions:

- The founder's activity is one coherent service.
- The Finanzamt and Gewerbeamt will agree with the user's preferred label.

Terminology issues:

- "Freelancer" in English is not the same as "Freiberufler" in German tax classification.

Repository changes made:

- Finanzamt onboarding now uses official BMWK classification context only as context and routes final classification to authority/professional review.
- Added `templates/contradictory-advice-log.md`.

## 3. Laid-Off Employee Receiving ALG I While Starting A Side Business

Workflows executed: `gewerbeanmeldung-berlin`, roadmap scenario review.

Missing steps found:

- The existing roadmap note was too passive for a real founder who may start work before reporting it.
- Gewerbeanmeldung needed to ask about ALG I before saying "start" or "file".

Confusion points:

- "Side business" can sound harmless while it may affect availability, reporting, and benefit calculation.
- Founders confuse revenue, profit, hours worked, and income considered by Agentur fuer Arbeit.

Hidden assumptions:

- The activity can be started before benefit reporting.
- Registration date, work date, and invoice date are interchangeable.

Terminology issues:

- "Nebenjob", "Nebentaetigkeit", and "selbststaendige Nebentaetigkeit" need to be preserved.

Repository changes made:

- Operational intake now has ALG I stop conditions.
- Gewerbeanmeldung now routes ALG I side-business facts to Agentur fuer Arbeit review before work starts.

## 4. Restaurant Owner Issuing Incorrect Invoices

Workflows executed:

```bash
node scripts/validate-invoice.mjs examples/invoices/restaurant-incorrect.json
```

Missing steps found:

- Field validation alone did not capture restaurant-specific operational risk.
- The repo needed to distinguish draft invoice correction from paid/booked/POS documents.

Confusion points:

- The owner may think the fix is "edit the invoice PDF" rather than create a correction packet.
- VAT split, POS records, Z-reports, tips, vouchers, food, drinks, and payment records may all matter.

Hidden assumptions:

- The invoice is a simple draft.
- VAT breakdown can be reconstructed from memory.

Terminology issues:

- "Receipt", "invoice", "Bewirtungsbeleg", "Kassenbon", and "Rechnung" can refer to different evidence.

Repository changes made:

- Invoice validation now detects restaurant/POS sectors and sent/paid/booked/reported document states.
- Added restaurant permit source and correction-packet language.

## 5. Freelancer Crossing Kleinunternehmer Threshold Mid-Year

Workflows executed:

```bash
node scripts/check-thresholds.mjs examples/thresholds/kleinunternehmer-crossed-midyear.json
```

Missing steps found:

- The previous workflow identified threshold risk but did not ask which invoice crossed it.
- It did not force a freeze on invoice templates before future invoices.

Confusion points:

- Founders think the question is only "what is my total revenue?" The operational question is also invoice sequence.
- Founders may continue issuing old invoices while waiting for advice.

Hidden assumptions:

- Revenue numbers are complete and reconciled.
- No invoices after the crossing event need correction.

Terminology issues:

- "Revenue", "turnover", "Umsatz", and "Gewinn" must not be mixed.

Repository changes made:

- Kleinunternehmer workflow now asks for the crossing invoice and later invoices.
- Threshold script now flags reported crossing events and instructs a freeze-and-review step.

## 6. UG Founder With No Accounting Knowledge

Workflows executed:

```bash
node scripts/generate-compliance-calendar.mjs examples/profiles/ug-founder-berlin.json
```

Missing steps found:

- The repo assumed the user understands ledgers, VAT, tax number, VAT ID, and UStVA period.
- The handoff needed a first-week operating checklist.

Confusion points:

- Founders confuse Handelsregister, Gewerbeanmeldung, Finanzamt tax number, VAT ID, and bank account readiness.
- "Monthly if confirmed" scenario dates can still be mistaken as active deadlines.

Hidden assumptions:

- The UG already has clean records and knows who is responsible for bookkeeping.

Terminology issues:

- "Steuernummer" and "USt-IdNr." need to be kept separate.

Repository changes made:

- UStVA workflow now keeps new-business periods unselected until confirmed.
- Accountant handoff and operational intake now focus on records, letters, and authority correspondence.

## 7. Cross-Border Contractor Invoicing EU Clients

Workflows executed:

```bash
node scripts/validate-invoice.mjs examples/invoices/eu-contractor-review.json
```

Missing steps found:

- The repo needed stronger language that EU B2B is review-gated even when fields are present.
- VAT ID and place-of-supply review need to appear before invoice issuance.

Confusion points:

- "Reverse charge" is often copied from online templates without checking facts.
- The customer VAT ID on an invoice is not automatically validated by field presence.

Hidden assumptions:

- The client is a taxable person.
- The service is in the expected place-of-supply category.

Terminology issues:

- "EU client" is too broad; the workflow needs country, B2B/B2C, VAT ID, service type, and platform involvement.

Repository changes made:

- Invoice validator keeps non-domestic relationships in professional review.
- Invoice skill now treats reverse-charge and marketplace cases as review-gated.

## 8. Founder Missing VAT Filing Deadlines

Workflows executed:

```bash
node scripts/generate-compliance-calendar.mjs examples/profiles/missed-vat-deadlines.json
```

Missing steps found:

- Calendar generation alone is wrong for missed deadlines.
- The repo needed a damage-control packet: notices, payment state, ledgers, and correction status.

Confusion points:

- Founders may ask "what is the deadline?" when the real issue is "what has the Finanzamt already done?"

Hidden assumptions:

- Filing late is the only required action.
- No estimate, penalty, payment, or correction is already in flight.

Terminology issues:

- "Deadline", "reminder", "estimate", "late filing", "correction", and "payment" need separate tracking.

Repository changes made:

- UStVA workflow and calendar script now emit `missed_ustva_damage_control` events.

## 9. Solo Founder Preparing Accountant Handoff

Workflows executed: `finanzamt-onboarding`, `kleinunternehmer-workflows`, `invoice-compliance-validation`.

Missing steps found:

- Handoff examples needed more source-document reconciliation, not just questions.
- The repository needed an intake template that prevents missing identity, authority, records, and sector constraints.

Confusion points:

- Founders think accountant handoff is a narrative email. It needs attachments, assumptions, and unresolved decisions.

Hidden assumptions:

- User-provided figures are reconciled.
- Source documents exist and match the summary.

Terminology issues:

- "Accountant" may mean Steuerberater, bookkeeper, payroll office, or internal admin.

Repository changes made:

- Added operational intake and stronger handoff verification checkpoints.

## 10. Founder Receiving Contradictory Advice Online

Workflows executed: all skills as routing context.

Missing steps found:

- The repo needed a first-class way to preserve conflicting claims instead of letting an agent choose the most plausible one.

Confusion points:

- Old forum posts may be correct for an old law, a different city, a different legal form, or a different tax status.

Hidden assumptions:

- Confident wording online equals authority.
- Majority opinion resolves legal classification.

Terminology issues:

- "Can", "must", "usually", "accepted", and "my accountant said" need evidence labels.

Repository changes made:

- Added `templates/contradictory-advice-log.md`.
- Finanzamt onboarding now requires contradiction logging before selecting a posture that would change a filing or invoice.
