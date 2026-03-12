import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests/features',
  fullyParallel: true,
  retries: 1,
  workers: 6,
  timeout: 45_000,
  expect: {
    timeout: 20_000
  },
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: false }]
  ],
  use: {
    baseURL: 'https://serverest.dev',
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  }
});
