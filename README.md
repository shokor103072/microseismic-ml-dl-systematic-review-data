# Data and code: machine learning for microseismic monitoring with geophones and DAS

Data, code and coding records for the review

> Rahaman, M. S. A., J. Jaafar, M. S. Shahabudin, R. A. Khan, and I. V. Paputungan. *Will a Machine-Learning Microseismic Detector Work at the Next Site? Evaluation and Transfer Evidence for Geophone and DAS Monitoring.* Submitted to *Seismological Research Letters* (2026).

The review maps 385 studies (2015 to September 2026) that use machine learning to detect, classify, pick or locate microseismic events recorded by geophones or distributed acoustic sensing (DAS), and audits from full text how evaluations were designed in 59 studies and in a stratified random sample of the rest.

## Contents

| Folder | What it holds |
|---|---|
| `data/` | Evidence map (385 studies), screening decisions (1,506 records), OpenAlex search logs, coding dictionary and corrections, corrected master table of the original synthesis with its evidence-matrix codes, the full-text sample audit, figure data and the retraction check. File-by-file description: [`data/FILES.md`](data/FILES.md). |
| `scripts/` | Scripts that regenerate the numbers quoted in the paper and the sample audit from the files in this repository (see below). |
| `second_reviewer/` | Blinded verification sheets with answer keys, and the completed sheets of the reproducibility check by a second language model (ChatGPT). |
| `database_rerun/` | Search strings for re-running the database searches and a script to merge exports. |
| `archive/v1_2026-03/` | Version 1 of this repository (March 2026): the master table of the original 71-study synthesis, unchanged. |

## Reproducing the numbers

Requires Node.js 18 or later; no packages need to be installed. From the repository root:

```
node scripts/gen_numbers.js        # every evidence-map and sample-audit number in the paper -> output/numbers.tex, output/numbers.json
node scripts/draw_sample.js        # redraws the stratified random sample (seed 20260927) -> output/sample.json
node scripts/summarise_sample.js   # sample-audit rates with Wilson 95% intervals -> output/audit_sample_summary.json
node scripts/agreement.js          # agreement and Cohen's kappa for the verification sheets in second_reviewer/
```

The outputs are identical to the files used for the paper (`data/sample_audit/sample.json` and `audit_sample_summary.json`; the numbers in the manuscript).

## Notes

- **Abstracts are not redistributed.** Study metadata include OpenAlex IDs and DOIs, from which abstracts can be retrieved. One count in the paper (DAS studies using Utah FORGE data) used abstracts; the IDs it relies on are listed in `data/analysis_inputs/forge_mentions_new_studies.json`.
- **AI assistance.** A large language model (Claude Opus 5.5, Anthropic) wrote the scripts and proposed screening decisions and codes, which the first author verified; every proposal is archived with its final decision. The codes of the full-text sample audit (`data/sample_audit/codes.json`) were proposed by the model and **have not been verified by a human reviewer**. See the paper's Data and Resources section.
- **Studies by the review team** are flagged in `data/evidence_map_385.csv` (column `authored_by_review_team`).

## How to cite

Cite the paper and this repository. A versioned DOI is provided through Zenodo for each release (see the badge or the release page once available).

## License

[CC BY 4.0](LICENSE). Version 1 was released under the same license.
