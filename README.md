# Flaky Test Tracker

![Flaky Test Tracker](https://github.com/Shahzaib-A-Khan/flaky-test-tracker/actions/workflows/flaky-tracker.yml/badge.svg)

Reads the results of many test runs and reports which tests are stable, flaky or broken. A CI workflow runs a sample suite 20 times, builds the report, shows it on the run summary page and checks that the tracker classified the sample tests correctly.

## How it classifies tests
- Stable: the first attempt passed in every run
- Broken: the first attempt failed in every run
- Flaky: the first attempt passed in some runs and failed in others
- Duration spikes: the slowest run took more than 5 times the median

Retries can hide flakiness, because a test that fails and then passes shows as green. The tracker counts first attempts and reports how often a retry rescued a test.

## The sample suite
sample-tests/behaviours.spec.ts has four tests with known behavior: one stable, one flaky (fails about 30% of the time), one broken and one occasionally slow. The workflow checks that the tracker finds exactly those verdicts, so a change that breaks the analyzer turns the pipeline red.

## Results
In a CI run of 20 executions, the flaky test failed its first attempt 30% of the time and passed on retry 4 times. In a local run of 20 executions the same test failed 50% of the time. Twenty runs is a small sample, so rates are rough estimates even though the verdicts were right.

## Run it
npm ci
mkdir data\runs
(run the sample suite several times and copy data/latest.json to data/runs/run-N.json)
node scripts/analyze.js
node scripts/verify.js

The report is written to reports/flaky-report.md and reports/flaky-report.json.

## Limits
- The sample suite is synthetic
- Verdicts are based on first-attempt results
- A test that fails 30% of the time passes 20 runs in a row about 0.08% of the time, so 20 runs catches it reliably, but rate estimates stay noisy

## Project structure
- sample-tests/: the sample suite with known behavior
- scripts/analyze.js: classifies the tests and writes the reports
- scripts/verify.js: checks the tracker against the known answers
- .github/workflows/flaky-tracker.yml: CI workflow