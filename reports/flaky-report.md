# Flaky test report

Runs analyzed: 20

| Test | Runs | First-attempt fail % | Passed on retry | Median ms | Max ms | Verdict | Duration spikes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| behaviours.spec.ts > stable: always passes | 20 | 0 | 0 | 6 | 7 | stable | no |
| behaviours.spec.ts > flaky: fails about 30% of the time | 20 | 50 | 9 | 1 | 2 | flaky | no |
| behaviours.spec.ts > broken: always fails | 20 | 100 | 0 | 2 | 9 | broken | no |
| behaviours.spec.ts > sometimes slow: takes longer about 20% of the time | 20 | 0 | 0 | 71 | 1518 | stable | yes |
