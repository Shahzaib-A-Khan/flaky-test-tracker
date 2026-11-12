import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './sample-tests',
  retries: 1,
  reporter: [['list'], ['json', { outputFile: 'data/latest.json' }]],
});