#!/usr/bin/env node
import { createReport, loadRules, printReport, readCliJsonFileOrExit, setStatus } from "./lib/config.mjs";

const inputPath = process.argv[2];
if (!inputPath) {
  process.stderr.write("Usage: node scripts/generate-compliance-calendar.mjs <profile.json>\n");
  process.exit(2);
}

const profile = readCliJsonFileOrExit(inputPath, "profile");
const rules = loadRules();
const start = profile.calendar_start || new Date().toISOString().slice(0, 10);
const months = Number(profile.months || 12);
const previousVat = Number(profile.previous_year_vat_due_eur || 0);
const dueDay = rules.ustva.due_day_after_period_end.value;
const monthlyThreshold = rules.ustva.monthly_previous_year_tax_threshold_eur.value;
const isNewBusiness = Boolean(profile.new_business);
const confirmedPeriod = ["monthly", "quarterly"].includes(profile.confirmed_ustva_period)
  ? profile.confirmed_ustva_period
  : null;
const period = confirmedPeriod || (!isNewBusiness ? (previousVat > monthlyThreshold ? "monthly" : "quarterly") : null);
const periodsToGenerate = period ? [period] : ["monthly", "quarterly"];

const report = createReport({
  title: "Compliance calendar candidate",
  source_ids: ["ustg-18", "berlin-gewerbeanmeldung"],
  user_input: profile
});

function addMonths(date, count) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + count, 1));
}

function deadlineForPeriodEnd(year, monthIndex) {
  return new Date(Date.UTC(year, monthIndex + 1, dueDay));
}

const startDate = new Date(`${start}T00:00:00Z`);
const events = [];

if (!period) {
  events.push({
    type: "ustva_period_verification_required",
    reason: "new_business_without_confirmed_period",
    source_id: "ustg-18",
    caution: "No UStVA period selected. Confirm expected VAT and Finanzamt/ELSTER period before treating any generated date as a reminder."
  });
}

if (Array.isArray(profile.missed_ustva_periods) && profile.missed_ustva_periods.length > 0) {
  events.unshift({
    type: "missed_ustva_damage_control",
    periods: profile.missed_ustva_periods,
    source_id: "ustg-18",
    caution: "Missed periods require adviser review, ledger reconciliation, notices review, and payment-status review before filing or correction."
  });
}

for (const generatedPeriod of periodsToGenerate) {
  for (let offset = 0; offset < months; offset += generatedPeriod === "monthly" ? 1 : 3) {
    const periodStart = addMonths(startDate, offset);
    const periodEndMonth = generatedPeriod === "monthly" ? periodStart.getUTCMonth() : periodStart.getUTCMonth() + 2;
    const periodEnd = new Date(Date.UTC(periodStart.getUTCFullYear(), periodEndMonth + 1, 0));
    events.push({
      type: "ustva_candidate_deadline",
      period: generatedPeriod,
      scenario: period ? "selected_candidate" : `${generatedPeriod}_if_confirmed`,
      period_start: periodStart.toISOString().slice(0, 10),
      period_end: periodEnd.toISOString().slice(0, 10),
      candidate_due_date: deadlineForPeriodEnd(periodEnd.getUTCFullYear(), periodEnd.getUTCMonth()).toISOString().slice(0, 10),
      source_id: "ustg-18",
      caution: "Candidate only. Not adjusted for weekends, holidays, Dauerfristverlaengerung, exemptions, or Finanzamt-specific handling."
    });
  }
}

if (profile.gewerbeanmeldung_status !== "completed") {
  events.unshift({
    type: "gewerbeanmeldung_preparation",
    status: profile.gewerbeanmeldung_status || "unknown",
    responsible_authority: "Berlin Ordnungsamt / Service Berlin",
    source_id: "berlin-gewerbeanmeldung",
    caution: "Confirm whether the activity is gewerblich, freiberuflich, regulated, or permit-sensitive before filing."
  });
}

report.verified_facts.push({
  fact: period
    ? `UStVA period candidate selected as ${period} from config-backed rules and user profile.`
    : "No UStVA period was selected because the profile describes a new business without a confirmed UStVA period.",
  source_id: "ustg-18"
});
report.verification_checkpoints.push(rules.ustva.due_day_after_period_end.verification_checkpoint);
report.verification_checkpoints.push(rules.ustva.monthly_previous_year_tax_threshold_eur.verification_checkpoint);
report.verification_checkpoints.push(rules.ustva.new_business_period_policy.verification_checkpoint);
report.verification_checkpoints.push(rules.ustva.calendar_adjustment_policy.verification_checkpoint);
report.assumptions.push("Deadline dates are candidate calendar dates and not adjusted for weekends, holidays, Dauerfristverlaengerung, or individual Finanzamt decisions.");
report.assumptions.push("The profile does not encode special VAT schemes, cross-border obligations, payroll, or trade-specific permits.");
report.open_verification_items.push("Confirm actual UStVA filing frequency, expected VAT basis for new businesses, and any exemptions in ELSTER/Finanzamt correspondence.");
if (!period) {
  report.professional_review_items.push({
    item: "New-business UStVA period is not selected by this script. Confirm expected VAT and Finanzamt/ELSTER period before adding reminders to an operational calendar.",
    source_id: "ustg-18"
  });
}
if (Array.isArray(profile.missed_ustva_periods) && profile.missed_ustva_periods.length > 0) {
  report.professional_review_items.push({
    item: "Missed UStVA periods reported. Prepare a damage-control packet and review with Steuerberater before filing, correcting, or paying.",
    source_id: "ustg-18"
  });
  report.verification_checkpoints.push("For missed periods, collect Finanzamt notices, ELSTER status, ledgers, payment records, and bank cash position before taking action.");
  report.next_steps.push("Build a missed-period damage-control packet before filing, correcting, paying, or adding future reminders.");
}
report.next_steps.push("Review candidate deadlines with the Steuerberater.");
report.next_steps.push("Add confirmed deadlines to the user's operational calendar.");
report.required_documents.push("Finanzamt letters and ELSTER messages.");
report.required_documents.push("Prior-year VAT due calculation if not a new business.");
report.responsible_authority.push("Finanzamt");
report.responsible_authority.push("Steuerberater");
report.events = events;

printReport(setStatus(report));
