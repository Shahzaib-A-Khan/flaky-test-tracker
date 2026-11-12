import { test, expect } from '@playwright/test';

test('stable: always passes', async () => {
  expect(1 + 1).toBe(2);
});

test('flaky: fails about 30% of the time', async () => {
  expect(Math.random()).toBeGreaterThan(0.3);
});

test('broken: always fails', async () => {
  expect(1 + 1).toBe(3);
});

test('sometimes slow: takes longer about 20% of the time', async () => {
  const delay = Math.random() < 0.2 ? 1500 : 50;
  await new Promise((resolve) => setTimeout(resolve, delay));
  expect(delay).toBeGreaterThan(0);
});