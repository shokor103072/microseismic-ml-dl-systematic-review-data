# Files in `data/`

Systematic review and evidence map of machine learning for microseismic event detection, classification, picking and location with geophones and distributed acoustic sensing (DAS). Submitted to *Seismological Research Letters*.

Version 2 (October 2026). Version 1 of this repository contained the master table of the original synthesis (71 studies). Version 2 adds:
- the update searches, including the final sensitivity search S5 (27 September 2026);
- the evidence map (385 studies);
- a full-text audit of a stratified random sample of the evidence map;
- the evidence matrix of the audited core (59 studies);
- the abstract-versus-full-text validation;
- the corrections described in the paper.

## Files

| File | Content | Paper section (SRL manuscript; Suppl. = supplemental material) |
|---|---|---|
| `evidence_map_385.csv` | The 385 studies with their codes and a flag for studies by members of the review team. Codes: sensing modality, setting, tasks (continuous detection, candidate-window classification, event-type classification, picking, location), model families, learning regimes, cross-site test mentioned in the abstract, real-time claim, coding source and manual corrections. | 2, 4; Suppl. S6 |
| `detection_subtasks_manual.json` | Manual sub-task decisions for all 248 detection and classification studies, with the rule. | 2.2, 4 |
| `screening_decisions_1506.csv` | Every record screened on title and abstract in the OpenAlex searches (m0–m793 from S1–S4, m794–m1505 from S5), with search strategies, decision code, decision and duplicate links. | 2.1; Suppl. S4, S8.1 |
| `openalex_search_log.json`, `openalex_search_log_S5.json` | Exact OpenAlex query strings, date windows, run dates (UTC) and record counts for strategies S1 to S4 and for S5. | 2.1; Suppl. S3 |
| `openalex_S5_search_and_prescreen.js` | Code of the S5 search, de-duplication against S1–S4 and pre-screen. | Suppl. S3 |
| `automatic_prescreen_rules.js` | The automatic pre-screening rules applied before manual screening. | Suppl. S3, S8.1 |
| `coding_dictionary.js` | The keyword dictionary used to propose evidence-map codes from titles and abstracts. | 2.2; Suppl. S4 |
| `manual_corrections_corpusB.json`, `manual_corrections_new_studies.json` | Manual corrections to the dictionary codes. | Suppl. S4 |
| `evidence_matrix_59.csv`, `evidence_matrix_rules.json` | Evidence-matrix codes (I1, I2, R1, R2, E1, E2, O1, O2, O3, O4) for the 59 audited studies, and the coding rules. | 2.2, 5 (Table 1); Suppl. S1.4 |
| `abstract_vs_fulltext_59.json` | Abstract-level codes compared with full-text codes for the audited studies with an abstract. | 6; Suppl. S4.3 |
| `audit_metric_reporting_59.json` | Audited studies that report task-appropriate metrics. | 5; Suppl. S1.5 |
| `master_table_S1A_publication_dataset_2026.csv`, `master_table_S1B_preprocess_model_eval_2026.csv` | Full-text master table of the original 71 studies. The `Status_2026` column marks the 12 removed entries (3 retracted, 2 second records, 2 reviews, 5 outside the eligibility criteria), and `Eligibility_flag_2026` marks studies to check. | 2.1, 5; Suppl. S1 |
| `data_dictionary.md`, `paper_id_crosswalk.csv` | Column definitions and the Paper-ID crosswalk of the master table (from version 1). | Suppl. S1 |
| `retraction_check_2026-09-27.json` | Result of checking 479 DOIs against Crossref retraction, withdrawal, correction and expression-of-concern metadata, including Retraction Watch records. | Suppl. S8.1 |
| `figure_data/` | Data tables used to draw Figures 3 to 6. | 4, 5 (Figs. 3–6) |
| `sample_audit/` | Full-text sample audit: sampling frame (`sampling_frame_327.json`), seed and drawn sample (`sample.json`, with the retrieval log; script `scripts/draw_sample.js`), coding rules and codes (`codes.json`), and summary with Wilson intervals (script `scripts/summarise_sample.js`, `audit_sample_summary.json`), including the list of sampled studies not yet retrieved. | 2.1, 5; Suppl. S7 |
| `audit_latency_scope_59.json` | What the timing reported by each audited study measures, and whether the hardware is stated. | 5 (Fig. 5c) |
| `analysis_inputs/` | Inputs of the scripts: the evidence-map codes (`evidence_map.json`), screening decision codes, metadata of the new studies without abstracts, and the list of new studies whose title or abstract mentions Utah FORGE. | all | all |

## Notes

- Evidence-map codes for the 326 new studies were assigned from titles and abstracts (52 from titles only) and checked manually. Codes for the 59 audited studies were derived from the full-text master table with the same dictionary.
- Detection sub-tasks were assigned by reading every relevant title and abstract.
- Screening decisions, codes and the sample-audit codes were proposed with the help of a large language model (Claude Opus 5.5, Anthropic) as a decision-support tool (paper, section on the AI-assisted workflow and reproducibility check); every proposal is listed with its final decision. The sample-audit codes (`sample_audit/codes.json`) have not been verified by a human reviewer. A blinded sample for independent verification is provided with the submission.
- Licence: CC BY 4.0 (see `LICENSE` in the repository root).
