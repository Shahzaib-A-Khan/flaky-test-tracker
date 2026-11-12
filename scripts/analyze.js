const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const runsDir = path.join(root, 'data', 'runs');

if (!fs.existsSync(runsDir)) {
  console.error('data/runs not found. Collect some runs first.');
  process.exit(1);
}

const files = fs.readdirSync(runsDir).filter((f) => f.endsWith('.json')).sort();
if (files.length < 5) {
  console.error(`Only ${files.length} run files found. Collect at least 5 runs, ideally 20.`);
  process.exit(1);
}

const stats = new Map();

function collect(suite) {
  for (const spec of suite.specs || []) {
    for (const t of spec.tests) {
      const key = `${spec.file} > ${spec.title}`;
      const s = stats.get(key) || { runs: 0, firstFailed: 0, passedOnRetry: 0, skipped: 0, durations: [] };
      const first = t.results[0];
      if (first.status === 'skipped') {
        s.skipped++;
      } else {
        s.runs++;
        if (first.status !== 'passed') s.firstFailed++;
        if (t.status === 'flaky') s.passedOnRetry++;
        s.durations.push(first.duration);
      }
      stats.set(key, s);
    }
  }
  for (const child of suite.suites || []) collect(child);
}

for (const f of files) {
  const report = JSON.parse(fs.readFileSync(path.join(runsDir, f), 'utf8'));
  report.suites.forEach(collect);
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const rows = [];
for (const [test, s] of stats) {
  if (s.runs === 0) {
    rows.push({ test, runs: 0, 'fail %': 0, 'passed on retry': 0, 'median ms': 0, 'max ms': 0, verdict: 'skipped', spikes: 'no' });
    continue;
  }
  const failRate = s.firstFailed / s.runs;
  const med = median(s.durations);
  const max = Math.max(...s.durations);
  let verdict = 'stable';
  if (failRate === 1) verdict = 'broken';
  else if (failRate > 0) verdict = 'flaky';
  const spikes = max > 5 * Math.max(med, 20);
  rows.push({
    test,
    runs: s.runs,
    'fail %': Math.round(failRate * 100),
    'passed on retry': s.passedOnRetry,
    'median ms': Math.round(med),
    'max ms': Math.round(max),
    verdict,
    spikes: spikes ? 'yes' : 'no',
  });
}

const header =
  '| Test | Runs | First-attempt fail % | Passed on retry | Median ms | Max ms | Verdict | Duration spikes |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- |';
const lines = rows.map(
  (r) => `| ${r.test} | ${r.runs} | ${r['fail %']} | ${r['passed on retry']} | ${r['median ms']} | ${r['max ms']} | ${r.verdict} | ${r.spikes} |`
);

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'reports', 'flaky-report.md'),
  `# Flaky test report\n\nRuns analyzed: ${files.length}\n\n${header}\n${lines.join('\n')}\n`
);
fs.writeFileSync(path.join(root, 'reports', 'flaky-report.json'), JSON.stringify(rows, null, 2));
console.log(`Runs analyzed: ${files.length}`);
console.table(rows);

if (process.argv.includes('--strict') && rows.some((r) => r.verdict === 'flaky')) {
  process.exitCode = 1;
}