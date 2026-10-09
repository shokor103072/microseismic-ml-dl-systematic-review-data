# Re-running the database searches with the relaxed vocabulary

**Why this matters.** The original December 2025 search required a sensing-modality term (DAS, fibre, geophone). That block missed most mining studies, which do not name the sensor in the title or abstract. The OpenAlex update filled the gap, but reviewers may ask for the same broader vocabulary in the subscription databases up to a common final date.

**Who runs it.** These databases need your institution's access, so you have to run the searches yourself. Export the results and run `merge_exports.js`. It lists every record that is not already among the 794 screened OpenAlex records or the 71 original Corpus B records, so only those need screening.

## Date and filters

Publication years 2015 to the search date. English language. Article, conference paper or preprint. Record the date you run each search.

## Scopus (Advanced search)

```
TITLE-ABS-KEY ( ( microseismic* OR "micro-seismic*" OR microearthquake* OR "micro-earthquake*" OR "induced seismic*" OR "mining-induced seismic*" OR rockburst* OR "rock burst*" OR "hydraulic fractur*" ) AND ( detect* OR classif* OR recogni* OR identif* OR discriminat* OR pick* OR "arrival time*" OR "first arrival*" OR "first break*" OR locat* OR localiz* OR localis* OR catalog* ) AND ( "machine learning" OR "deep learning" OR "neural network*" OR cnn OR convolutional OR transformer* OR "u-net" OR unet OR "support vector" OR svm OR "random forest" OR boosting OR xgboost OR lightgbm OR "logistic regression" OR clustering OR autoencoder* OR "neural operator*" OR "physics-informed" OR "transfer learning" OR "self-supervised" OR "semi-supervised" OR "active learning" ) ) AND PUBYEAR > 2014 AND ( LIMIT-TO ( LANGUAGE , "English" ) )
```

Export: CSV with all citation information, abstract and DOI.

## Web of Science Core Collection (Advanced search)

```
TS=( (microseismic* OR "micro-seismic*" OR microearthquake* OR "micro-earthquake*" OR "induced seismic*" OR "mining-induced seismic*" OR rockburst* OR "rock burst*" OR "hydraulic fractur*") AND (detect* OR classif* OR recogni* OR identif* OR discriminat* OR pick* OR "arrival time*" OR "first arrival*" OR "first break*" OR locat* OR localiz* OR localis* OR catalog*) AND ("machine learning" OR "deep learning" OR "neural network*" OR CNN OR convolutional OR transformer* OR "U-Net" OR UNet OR "support vector" OR SVM OR "random forest" OR boosting OR XGBoost OR LightGBM OR "logistic regression" OR clustering OR autoencoder* OR "neural operator*" OR "physics-informed" OR "transfer learning" OR "self-supervised" OR "semi-supervised" OR "active learning") )
```

Timespan 2015 to the search date. Export: Excel or tab-delimited, full record. Save it as CSV before merging.

## IEEE Xplore (Command search)

```
(("All Metadata":microseismic OR "All Metadata":"micro-seismic" OR "All Metadata":"induced seismicity" OR "All Metadata":rockburst OR "All Metadata":"hydraulic fracturing") AND ("All Metadata":"machine learning" OR "All Metadata":"deep learning" OR "All Metadata":"neural network" OR "All Metadata":convolutional OR "All Metadata":transformer OR "All Metadata":"support vector" OR "All Metadata":"random forest"))
```

Filter to 2015 onwards. Export: CSV.

## OnePetro (SPE, URTeC and SEG content)

```
(microseismic OR "induced seismicity") AND ("machine learning" OR "deep learning" OR "neural network")
```

Export the result list with DOIs, or save the citations as RIS.

## GeoRef (if available through EBSCO or ProQuest)

Use the Web of Science string with the platform's field codes for title, abstract and subject terms. Export as RIS or CSV.

## Reporting

Add each database, date, string and record count to Supplementary Material S3 and to the PRISMA diagram. Screen the new candidates with the same eligibility criteria and decision codes. Any newly included studies must be coded for the evidence map, and the counts recomputed.
