#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { resolveRepoPath } from "./lib/config.mjs";

const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function hasFlag(name) {
  return args.includes(name);
}

const profile = argValue("--profile");
const outPath = argValue("--out");
const shouldPrint = hasFlag("--print") || !outPath;

function soloConsultingSideBusinessProfile() {
  return {
    person: {
      name: "Fictional Berlin solo consulting founder",
      residence_status: "unrestricted work permission assumed for public fixture",
      non_eu_citizen: false,
      alg1_status: "none",
      employment_status: "employed with planned side business",
      employer_permission_status: "unknown"
    },
    business: {
      activity_description: "Product strategy consulting and workshop facilitation for Berlin business clients",
      activity_description_de: "Produktstrategie-Beratung und Workshop-Moderation fuer Berliner Geschaeftskunden",
      start_date: "2026-06-01",
      first_invoice_date: "2026-06-30",
      customer_locations: ["DE"],
      b2b_b2c_mix: "mostly domestic B2B",
      sector: "consulting",
      regulated_sector: false,
      planned_legal_form: "Einzelunternehmen candidate",
      classification_assumption: "Freiberufler vs Gewerbe unresolved"
    },
    operations: {
      elster_status: "private access available",
      tax_number_status: "pending",
      invoice_tool: "spreadsheet draft",
      bookkeeping_status: "not_started",
      accountant_status: "not engaged"
    },
    tax_assumptions: {
      kleinunternehmer_assumption: "planned but not confirmed",
      vat_id_status: "not requested",
      cross_border_sales_planned: false
    },
    evidence: {
      identity_status: "available",
      business_address_evidence: "available",
      employer_permission_evidence: "missing",
      authority_letters: "none",
      invoice_exports: "draft only",
      bank_exports: "not yet applicable"
    },
    messy_reality: {
      already_started_work: false,
      already_sent_invoices: false,
      already_contacted_authority: false
    },
    advice: {
      contradictory_claims_present: false
    }
  };
}

function parseBoolean(value, defaultValue = false) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return defaultValue;
  return ["y", "yes", "true", "1"].includes(normalized);
}

function parseList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function askWithDefault(rl, question, defaultValue) {
  const answer = await rl.question(`${question}${defaultValue ? ` [${defaultValue}]` : ""}: `);
  return answer.trim() || defaultValue;
}

async function interactiveProfile() {
  const rl = readline.createInterface({ input, output });
  try {
    const name = await askWithDefault(rl, "Founder or case name", "Berlin founder case");
    const residenceStatus = await askWithDefault(rl, "Residence/work permission status", "unrestricted work permission assumed");
    const nonEuCitizen = parseBoolean(await askWithDefault(rl, "Non-EU citizen? yes/no", "no"));
    const alg1Status = await askWithDefault(rl, "ALG I status", "none");
    const employmentStatus = await askWithDefault(rl, "Employment status", "employed with planned side business");
    const employerPermissionStatus = await askWithDefault(rl, "Employer permission or contract review status", "unknown");
    const activity = await askWithDefault(rl, "Business activity in English", "Product strategy consulting");
    const activityDe = await askWithDefault(rl, "Working German activity description", "Produktstrategie-Beratung");
    const startDate = await askWithDefault(rl, "Planned business start date YYYY-MM-DD", "2026-06-01");
    const firstInvoiceDate = await askWithDefault(rl, "Expected first invoice date YYYY-MM-DD", "2026-06-30");
    const customerLocations = parseList(await askWithDefault(rl, "Customer locations, comma-separated", "DE"));
    const b2bB2cMix = await askWithDefault(rl, "Customer mix", "mostly domestic B2B");
    const sector = await askWithDefault(rl, "Sector", "consulting");
    const regulatedSector = parseBoolean(await askWithDefault(rl, "Regulated or permit-sensitive sector? yes/no", "no"));
    const plannedLegalForm = await askWithDefault(rl, "Planned legal form", "Einzelunternehmen candidate");
    const classificationAssumption = await askWithDefault(rl, "Freiberufler/Gewerbe assumption", "unresolved");
    const elsterStatus = await askWithDefault(rl, "ELSTER status", "not_started");
    const taxNumberStatus = await askWithDefault(rl, "Tax number status", "pending");
    const invoiceTool = await askWithDefault(rl, "Invoice tool", "spreadsheet draft");
    const bookkeepingStatus = await askWithDefault(rl, "Bookkeeping status", "not_started");
    const accountantStatus = await askWithDefault(rl, "Accountant status", "not engaged");
    const kleinunternehmerAssumption = await askWithDefault(rl, "Kleinunternehmer assumption", "planned but not confirmed");
    const vatIdStatus = await askWithDefault(rl, "VAT ID status", "not requested");
    const crossBorderSalesPlanned = parseBoolean(await askWithDefault(rl, "EU/non-EU sales planned? yes/no", "no"));
    const contradictoryClaimsPresent = parseBoolean(await askWithDefault(rl, "Contradictory advice present? yes/no", "no"));

    return {
      person: {
        name,
        residence_status: residenceStatus,
        non_eu_citizen: nonEuCitizen,
        alg1_status: alg1Status,
        employment_status: employmentStatus,
        employer_permission_status: employerPermissionStatus
      },
      business: {
        activity_description: activity,
        activity_description_de: activityDe,
        start_date: startDate,
        first_invoice_date: firstInvoiceDate,
        customer_locations: customerLocations,
        b2b_b2c_mix: b2bB2cMix,
        sector,
        regulated_sector: regulatedSector,
        planned_legal_form: plannedLegalForm,
        classification_assumption: classificationAssumption
      },
      operations: {
        elster_status: elsterStatus,
        tax_number_status: taxNumberStatus,
        invoice_tool: invoiceTool,
        bookkeeping_status: bookkeepingStatus,
        accountant_status: accountantStatus
      },
      tax_assumptions: {
        kleinunternehmer_assumption: kleinunternehmerAssumption,
        vat_id_status: vatIdStatus,
        cross_border_sales_planned: crossBorderSalesPlanned
      },
      evidence: {
        identity_status: "unknown",
        business_address_evidence: "unknown",
        employer_permission_evidence: employerPermissionStatus,
        authority_letters: "unknown",
        invoice_exports: "unknown",
        bank_exports: "unknown"
      },
      messy_reality: {
        already_started_work: false,
        already_sent_invoices: false,
        already_contacted_authority: false
      },
      advice: {
        contradictory_claims_present: contradictoryClaimsPresent
      }
    };
  } finally {
    rl.close();
  }
}

async function buildIntake() {
  if (profile === "solo-consulting-side-business") return soloConsultingSideBusinessProfile();
  if (profile) {
    process.stderr.write(`Unknown profile "${profile}". Supported profile: solo-consulting-side-business\n`);
    process.exit(2);
  }
  return interactiveProfile();
}

const intake = await buildIntake();
const json = `${JSON.stringify(intake, null, 2)}\n`;

if (outPath) {
  const absolute = path.isAbsolute(outPath) ? outPath : resolveRepoPath(outPath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, json);
  process.stderr.write(`Wrote intake JSON to ${absolute}\n`);
}

if (shouldPrint) {
  process.stdout.write(json);
}
