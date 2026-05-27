# Source Freshness Dashboard

This dashboard is generated from `sources/source-registry.json`. It does not fetch live official pages and does not certify that legal or tax content is current.

Generated as of: `2026-05-27`

## Status Summary

- `current`: 17
- `review_due_soon`: 0
- `stale`: 0
- `missing_metadata`: 0

## Sources

| source_id | authority | risk | last_verified | review_by | days_until_review | status | used_for | url |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| berlin-gewerbeanmeldung | Land Berlin | high | 2026-05-08 | 2026-08-06 | 72 | current | gewerbeanmeldung workflow; Berlin fee candidates; required documents | https://service.berlin.de/dienstleistung/121921/ |
| gewerbeanmeldung-legal-basis | Bundesministerium der Justiz | medium | 2026-05-08 | 2026-11-04 | 162 | current | trade notification legal basis | https://www.gesetze-im-internet.de/gewo/__14.html |
| elster-fseeun | ELSTER | high | 2026-05-08 | 2026-08-06 | 72 | current | Finanzamt onboarding; steuerliche Erfassung preparation | https://www.elster.de/eportal/formulare-leistungen/alleformulare/fseeun?locale=en_US |
| elster-fseeun-help | ELSTER | high | 2026-05-08 | 2026-08-06 | 72 | current | Finanzamt onboarding instructions; source notes | https://www.faq.elster.de/eportal/helpGlobal?themaGlobal=help_fseeun_202401 |
| ustg-14 | Bundesministerium der Justiz | high | 2026-05-08 | 2026-08-06 | 72 | current | invoice required fields; e-invoice awareness | https://www.gesetze-im-internet.de/ustg_1980/__14.html |
| ustdv-33 | Bundesministerium der Justiz | high | 2026-05-08 | 2026-08-06 | 72 | current | small invoice validation | https://www.gesetze-im-internet.de/ustdv_1980/__33.html |
| ustdv-34a | Bundesministerium der Justiz | high | 2026-05-08 | 2026-08-06 | 72 | current | Kleinunternehmer invoice validation; Kleinunternehmer invoice wording warnings | https://www.gesetze-im-internet.de/ustdv_1980/__34a.html |
| ustg-18 | Bundesministerium der Justiz | high | 2026-05-08 | 2026-08-06 | 72 | current | UStVA due date candidates; filing frequency candidates | https://www.gesetze-im-internet.de/ustg_1980/__18.html |
| ustg-19 | Bundesministerium der Justiz | high | 2026-05-08 | 2026-08-06 | 72 | current | Kleinunternehmer threshold monitoring; invoice warnings | https://www.gesetze-im-internet.de/ustg_1980/__19.html |
| bmf-e-rechnung-faq | Bundesministerium der Finanzen | high | 2026-05-08 | 2026-08-06 | 72 | current | e-invoice caution notes; invoice validator review flags | https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html |
| ba-alg1-nebenjob | Bundesagentur fuer Arbeit | professional_review_required | 2026-05-08 | 2026-08-06 | 72 | current | roadmap context only; future ALG I side-business skill | https://www.arbeitsagentur.de/arbeitslos-arbeit-finden/arbeitslosengeld/das-muessen-sie-beachten/nebenjob-und-arbeitslosengeld |
| berlin-tax-registration | Land Berlin | high | 2026-05-08 | 2026-08-06 | 72 | current | Finanzamt onboarding; ELSTER registration path; founder tax registration | https://service.berlin.de/dienstleistung/325409/ |
| berlin-lea-self-employed | Land Berlin | professional_review_required | 2026-05-08 | 2026-08-06 | 72 | current | non-EU founder self-employment review; immigration escalation | https://service.berlin.de/dienstleistung/305249/de/ |
| berlin-lea-freelance | Land Berlin | professional_review_required | 2026-05-08 | 2026-08-06 | 72 | current | non-EU freelance review; immigration escalation | https://service.berlin.de/dienstleistung/328332 |
| bmwk-freiberuf-gewerbe-difference | Bundesministerium fuer Wirtschaft und Klimaschutz Existenzgruendungsportal | high | 2026-05-08 | 2026-08-06 | 72 | current | Freiberufler vs Gewerbe preparation; classification review routing | https://www.existenzgruendungsportal.de/Redaktion/DE/So-gehts/Unternehmensanmeldung/wer-muss-was-der-feine-unterschied |
| bmwk-freie-berufe | Bundesministerium fuer Wirtschaft und Klimaschutz Existenzgruendungsportal | high | 2026-05-08 | 2026-08-06 | 72 | current | freelance classification context; qualification evidence checklist | https://www.existenzgruendungsportal.de/SharedDocs/Expertenforum_Unterseiten/Freie-Berufe/inhalt |
| berlin-gaststaette-permit | Land Berlin | professional_review_required | 2026-05-08 | 2026-08-06 | 72 | current | restaurant operator escalation; hospitality permit review | https://service.berlin.de/dienstleistung/327483/ |

## Maintainer Use

- Treat `stale` as a release blocker for high-risk or professional-review sources.
- Treat `review_due_soon` as a beta-readiness warning and schedule source review before release notes are finalized.
- Update `last_verified` only after checking the cited official page and recording any rule or workflow changes.
- Keep live source checking out of this dashboard until network behavior, authority-page redirects, and failure handling are explicitly designed.
