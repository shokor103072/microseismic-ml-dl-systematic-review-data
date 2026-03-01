# Data dictionary (Supplementary Table S1)

This repository provides the complete coded master table used in the systematic review.

## Files
- `data/master_table_S1A_publication_dataset.csv` — Publication & dataset descriptors.
- `data/master_table_S1B_preprocess_model_eval.csv` — Preprocessing, model, and evaluation descriptors.
- `data/Supplementary_Table_S1_MasterTable.xlsx` — Same content as CSVs, in two sheets.

## Conventions
- **Paper ID** is the join key across S1A and S1B and the identifier referenced in manuscript tables/figures.
- **NR** means *Not Reported* in the original paper; values were not inferred.
- Some quantities (e.g., training size) are reported in different units across studies; see manuscript for guidance.

## Column definitions
- **Paper ID**: Unique integer identifier used throughout the manuscript to reference each included study.
- **Year**: Publication year.
- **Title**: Paper title (as indexed).
- **Category**: High-level thematic category used for organizing the corpus.
- **Application**: Primary application/problem setting (e.g., induced seismicity monitoring, hydraulic fracturing).
- **Type of Paper**: Publication type (journal, conference, review, etc.).
- **DOI**: Digital Object Identifier; 'Not reported' if missing.
- **Country**: Country/region of authors/affiliations as coded.
- **University/Institute**: Main reported affiliation(s) as coded.
- **Purpose / Objective**: Short description of the study goal.
- **Data Type**: Synthetic / Field / Hybrid.
- **Training Data Size**: Training size as reported (units vary by study; see notes).
- **Input Shape**: 1D / 2D / 3D representation as used by the model/pipeline.
- **Number of Classes / Labels**: Number of output classes/labels.
- **Event Types**: Event types considered (microseismic, noise, blasts, etc.).
- **Label Source**: Manual / Auto / None / Mixed (as reported).
- **Attribute/Feature Selection**: Feature engineering/selection notes (if applicable).
- **Train/Val/Test Split Protocol**: Split strategy (e.g., random, time-based, cross-well, cross-site).
- **Class Balance**: Whether class balancing is reported/used (Yes/No/NR).
- **Windowing**: Segmentation/windowing approach (Yes/No/notes).
- **Normalization/Scaling**: Normalization/scaling procedures.
- **Denoising Ops**: Denoising/preprocessing operations (filters, wavelets, whitening, etc.).
- **Feature Type**: Hand-crafted / learned / hybrid features.
- **Feature Parameters**: Key parameters for features (e.g., STFT window, wavelet type).
- **Task Framing**: How the task is framed (classification, detection, picking, anomaly).
- **Architecture Details**: Model architecture summary.
- **Class-Imbalance Handling**: Methods for handling imbalance (weights, sampling, focal loss, etc.).
- **Post-processing**: Post-processing steps (thresholding, morphological ops, smoothing, etc.).
- **Key Hyperparameters**: Key hyperparameters reported.
- **Augmentations**: Data augmentation strategies.
- **Performance Metrics**: Metrics reported (F1, precision, recall, AUC, etc.).
- **Performance Metrics Results**: Key reported values for metrics.
- **Latency / Detection Delay**: Latency/delay notes (if reported).
- **Latency / Detection Delay Results**: Quantitative latency/delay values (if reported).
- **Robustness / Domain Shift**: Evidence of generalization tests (noise, site shift, modality shift).
- **Mode**: Offline / online / real-time as described.
- **Hardware & Compute Cost**: Hardware details and compute/runtime notes.
