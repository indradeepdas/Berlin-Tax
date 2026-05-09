# Gewerbe Prep Packet

## Boundary Notice

Preparation-only packet. Not legal, tax, accounting, immigration, employment, benefit, or company-law advice. Not submission-ready. This packet helps a founder and reviewer decide whether a Berlin Gewerbeanmeldung path is plausible and what evidence is still missing.

## Assumptions

- Fictional founder is in Berlin and has unrestricted work permission in this public fixture.
- Founder is employed and planning a side consulting business.
- No ALG I, no payroll, no regulated sector, and no cross-border customers are assumed.
- Activity is consulting, but Freiberufler vs Gewerbe classification is unresolved.
- First invoice is planned after setup work, not already sent.

## User-Provided Inputs

- Activity: product strategy consulting and workshop facilitation.
- Working German description: Produktstrategie-Beratung und Workshop-Moderation fuer Berliner Geschaeftskunden.
- Planned legal form: Einzelunternehmen candidate.
- Customer mix: mostly domestic B2B.
- ELSTER: private access available.
- Tax number: pending.
- Bookkeeping: not started.
- Employer permission evidence: missing.

## Verified Source References

- `berlin-gewerbeanmeldung`: Service Berlin Gewerbeanmeldung workflow and document/fee context.
- `gewerbeanmeldung-legal-basis`: trade notification legal basis.
- `bmwk-freiberuf-gewerbe-difference`: classification context for Freiberufler vs Gewerbe.
- `berlin-tax-registration`: Berlin tax registration path after business setup.

Verify current source pages before using this packet externally. Source freshness is tracked in `docs/SOURCE_DASHBOARD.md`.

## Responsible Authority

- Berlin Ordnungsamt / Service Berlin for Gewerbeanmeldung if the activity is gewerblich.
- Finanzamt for tax registration and tax-number handling.
- Qualified reviewer for classification and side-business employment constraints.

## Required Documents

- Identity document.
- Berlin business or residential address evidence.
- Plain-language activity description and German working description.
- Start date and first-invoice plan.
- Employment contract or employer side-business policy, if applicable.
- Evidence of qualifications if the founder wants to argue Freiberufler treatment.
- Draft invoice and planned invoice wording.
- Any correspondence from Service Berlin, Finanzamt, ELSTER, or a reviewer.

## Workflow

1. Validate the structured intake:

   ```bash
   node scripts/validate-workflow.mjs operational_intake examples/golden-path/solo-consulting-side-business/intake.json
   ```

2. Review the classification gate. Do not treat Gewerbeanmeldung as decided while Freiberufler vs Gewerbe is unresolved.
3. If a Gewerbe route is confirmed, prepare the Service Berlin application data from the intake.
4. If a Freiberufler route is plausible, prepare the Finanzamt onboarding packet instead of filing a Gewerbeanmeldung blindly.
5. Before the first invoice, resolve tax-number status, Kleinunternehmer posture, invoice format, and e-invoice handling.

## Review Gates

- Freiberufler vs Gewerbe classification.
- Employer contract or side-business notification constraints.
- Whether any part of the activity is regulated or permit-sensitive.
- Whether the founder already started operating before registration.
- Whether the planned first invoice can be sent in the intended format.

## Next Steps

- Rewrite the activity description into a precise German version that avoids marketing language.
- Collect qualification evidence if Freiberufler treatment may be argued.
- Ask the reviewer one focused question: "For this exact activity and evidence, should the founder register a Gewerbe, register directly with Finanzamt as freiberuflich, or split the activity?"
- Keep the output as a preparation packet until the reviewer resolves the classification gate.
