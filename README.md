# Microseismic ML/DL Systematic Review — Master Table (Supplementary Table S1)

This repository hosts the **versioned master-table dataset** used in our PRISMA-guided systematic review of **ML/DL pipelines for microseismic event detection and closely related detection tasks** across **DAS and geophone** modalities.

## Contents
- `data/master_table_S1A_publication_dataset.csv` — Table S1A (Publication & Dataset)
- `data/master_table_S1B_preprocess_model_eval.csv` — Table S1B (Preprocessing/Model/Evaluation)
- `data/Supplementary_Table_S1_MasterTable.xlsx` — Excel version with two sheets
- `data/paper_id_crosswalk.csv` — Crosswalk between consecutive included-study numbering (1–71) and stable manuscript Paper IDs
- `docs/data_dictionary.md` — Definitions and coding conventions

## How to cite
If you use this dataset, cite the associated paper and this repository release (recommended: archive the release on Zenodo to obtain a DOI).

## Notes
- **Corpus B contains 71 PRISMA-included studies.**
- **Paper ID** is the stable join key referenced in the manuscript.
- Paper IDs are **intentionally non-consecutive** because they were inherited from a broader review registry that was used during screening/coding. Gaps in the sequence correspond to records that were excluded before the final PRISMA-included set or removed during registry stabilization.
- To make included-study accounting explicit, both S1A and S1B now include an **Included Study No.** column (1–71), and the repository also provides `paper_id_crosswalk.csv`.
- **NR** indicates *Not Reported* in the original source; values were not inferred.

## License
Recommended: **CC BY 4.0** for the tabular data.
