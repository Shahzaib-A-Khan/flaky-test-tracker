const rows = require('../reports/flaky-report.json');

const expected = {
  'stable: always passes': 'stable',
  'flaky: fails about 30% of the time': 'flaky',
  'broken: always fails': 'broken',
  'sometimes slow: takes longer about 20% of the time': 'stable',
};

let failed = false;
for (const [title, verdict] of Object.entries(expected)) {
  const row = rows.find((r) => r.test.endsWith(`> ${title}`));
  const actual = row ? row.verdict : 'missing';
  const ok = actual === verdict;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${title}: expected ${verdict}, got ${actual}`);
  if (!ok) failed = true;
}
process.exit(failed ? 1 : 0);