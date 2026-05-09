# Non-Engineer Quickstart

This guide is for founders who want a practical path through the repo without reading the implementation.

Berlin-Tax does not file anything for you. It helps you prepare a cleaner packet before you talk to a Steuerberater, Finanzamt, Service Berlin, or another authority.

## Step 1: Install The Basics

You need Node.js 20 or newer.

Check that the project works:

```bash
npm test
```

If this fails, do not use the output for real work yet. Ask a technical contributor to fix the repo state first.

## Step 2: Try The Founder Golden Path

Run:

```bash
npm run beta:golden-path
```

This checks a fictional Berlin solo consulting founder and prints the sample packet paths. Read these three files:

- `examples/golden-path/solo-consulting-side-business/gewerbe-prep-packet.md`
- `examples/golden-path/solo-consulting-side-business/finanzamt-onboarding-packet.md`
- `examples/golden-path/solo-consulting-side-business/accountant-handoff-packet.md`

The sample should return `review`, not a clean approval. That is expected. It shows what is still unresolved before real-world action.

## Step 3: Create Your Own Intake JSON

Interactive mode:

```bash
npm run intake:wizard
```

Deterministic sample mode:

```bash
npm run intake:wizard -- --profile solo-consulting-side-business --print
```

Write the sample to a file:

```bash
npm run intake:wizard -- --profile solo-consulting-side-business --out examples/generated/intake.json
```

Use the generated JSON as a starting point. Replace fictional facts with your own facts before asking a reviewer to rely on it.

## Step 4: Validate The Intake

Run:

```bash
node scripts/validate-workflow.mjs operational_intake examples/generated/intake.json
```

Read the output in this order:

1. `boundary_notice`
2. `assumptions`
3. `user_provided_inputs`
4. `professional_review_items`
5. `verification_before_submission`
6. `next_steps`

Do not skip straight to `status`.

## Step 5: Choose The Goal

Use the user guide when you know what you are trying to do:

- Register a Gewerbe in Berlin.
- Prepare Finanzamt / ELSTER onboarding.
- Check a draft invoice.
- Monitor Kleinunternehmer risk.
- Prepare UStVA readiness dates.
- Build an accountant handoff.
- Resolve contradictory online advice.

Main guide:

```text
docs/USER_GUIDE.md
```

## Step 6: Check Source Freshness

Run:

```bash
npm run sources:dashboard
```

This shows whether the repo's source registry is current, stale, or approaching review. It does not check official pages live.

## What `review` Means

`review` is not a failure. It means the repo found a question that should not be decided by a script or LLM.

Common review reasons:

- Freiberufler vs Gewerbe classification is unresolved.
- Kleinunternehmer posture is only an assumption.
- Invoice is domestic B2B and e-invoice handling needs review.
- UStVA period is not confirmed by ELSTER or Finanzamt correspondence.
- You are non-EU and work permission needs review.
- ALG I, employer approval, payroll, or benefit facts may matter.
- A document is already sent, booked, paid, reported, or needs correction.

## What To Send A Reviewer

Send a structured packet, not a long story:

- intake JSON
- validator output
- accountant handoff JSON or packet
- draft invoice, if relevant
- source dashboard status
- unresolved questions
- evidence state for every document

The goal is to make the reviewer's first response more useful than "please send everything again."

## Stop Before Real-World Action When

- the output has `fail`
- the output has unresolved `professional_review_items`
- source freshness is stale
- an invoice has already been sent or booked
- a deadline was missed
- cross-border VAT appears
- immigration, benefits, payroll, or employment status is involved

Berlin-Tax is most useful before you act. It is weaker after a mistake has already entered an authority, invoice, ledger, or filing system.
