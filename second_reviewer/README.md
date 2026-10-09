# Independent verification package (second reviewer)

This folder lets a co-author who did not do the original screening check a stratified sample of decisions and codes, blind to the first reviewer's answers. The manuscript currently states that no second human reviewer was involved; once this check is done, report the agreement in Sections 2.3 and 7.4 of the SRL manuscript and in the PRISMA checklist.

Who should do it: a co-author who did not screen or code the records and who did not author any of the included studies P53, P54, P75, m580, m632 or m674.

## Files

| File | What to do |
|---|---|
| `screening_sample_blinded.csv` | 456 records from both screening rounds (S1–S4 and the final search S5): 25% of every decision code, all records with rare codes (Xa, Xm, Xr, Xl, Xpend) and the review team's own studies. Read the title and abstract, and fill in `reviewer2_decision` with one of the codes below. Add `reviewer2_reason` if useful. |
| `coding_sample_blinded.csv` | 70 new studies (stratified by setting, plus the review team's studies and the transfer-table studies). Fill in the `r2_` columns with the codes below. |
| `evidence_matrix_sheet_blinded.csv` | All 59 audited studies. This needs the full texts. Code each item with Y, P (partial), S (synthetic ground truth only; R2 only), N or NA, following `evidence_matrix_rules.json`. At least 20 randomly chosen studies plus P53, P54 and P75 should be coded. |
| `*_KEY_do_not_open_before_coding.csv` | The first reviewer's answers. Do not open them until all coding is finished. |
| `../scripts/agreement.js` | Run `node scripts/agreement.js` from the repository root after coding. It prints percentage agreement and Cohen's kappa (with bootstrap 95% intervals) for every field. |

## Codes

Screening decisions:
- I: include
- Xs: setting out of scope
- Xt: task out of scope
- Xn: no ML or DL component
- Xp: secondary study
- Xa: insufficient information
- Xl: full text not in English
- Xm: regional broadband data only
- Xr: linked to a retracted study
- Xd: second report of another included study
- Xpend: full text needed

Evidence-map codes:
- Sensing: G (geophone or other point sensor), DAS, G+D (both), FO (other fibre-optic sensor).
- Setting: MIN, HF, GT, TUN, SLP, OG, CCS, RES, GEN (not specified).
- Tasks: continuous detection, candidate-window classification, event-type classification, arrival picking, location. Separate several tasks with `;`.
- Model families: CML, CNN, UNET, RNN, TRF, GNN, NO, GEN, AE, SNN, DLU.
- Regimes: TL, SEMI, UNSUP, PHYS.
- Cross-site test and real-time claim: 1 or 0.

## After coding

1. Run `node scripts/agreement.js` (from the repository root) and keep the output.
2. Resolve every disagreement by discussion and record the final decision.
3. If any inclusion or code changes, update the data files and ask for the counts and figures to be recomputed.
4. Add the human second-reviewer results to Sections 2.3 and 7.4 of the main text with the sample sizes, agreement and kappa values. Update the Limitations section and the PRISMA checklist in the same way.


## Full-text sample audit

The 20 full texts read for the sample audit (paper Section 2.1, Supplement S7) were coded by the language model from keyword-located passages. Please re-code at least these studies from their full texts with the rules in `data/sample_audit/codes.json` (key `_rules`) before looking at the codes, and complete the 60 sampled studies that could not be retrieved automatically (listed in `data/sample_audit/audit_sample_summary.json`, key `notRetrieved`), for example through library access. Then rerun `node summarise.js` and `node ../scripts/gen_numbers.js` and rebuild the manuscript.
