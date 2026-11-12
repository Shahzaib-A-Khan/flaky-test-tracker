const report = require('../data/latest.json');

console.log('stats:', JSON.stringify(report.stats));

function walk(suite) {
  for (const spec of suite.specs || []) {
    for (const t of spec.tests) {
      const attempts = t.results.map((r) => r.status).join(', ');
      console.log(`${spec.title} | ${t.status} | attempts: ${attempts}`);
    }
  }
  for (const child of suite.suites || []) walk(child);
}

report.suites.forEach(walk);