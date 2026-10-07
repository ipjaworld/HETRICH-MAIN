import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'outputs/playwright-report', open: 'never' }]],
  outputDir: 'outputs/test-results',
  use: { baseURL: process.env.TEST_BASE_URL ?? 'http://localhost:3101', trace: 'retain-on-failure' },
  projects: [
    { name: 'chrome', testMatch: 'landing.spec.ts', use: { browserName: 'chromium', channel: 'chrome' } },
    { name: 'webkit', testMatch: 'landing.spec.ts', use: { browserName: 'webkit' } },
    { name: 'iphone-se', testMatch: 'mobile-devices.spec.ts', use: { ...devices['iPhone SE'], browserName: 'webkit' } },
    { name: 'iphone-13', testMatch: 'mobile-devices.spec.ts', use: { ...devices['iPhone 13'], browserName: 'webkit' } },
    { name: 'pixel-7', testMatch: 'mobile-devices.spec.ts', use: { ...devices['Pixel 7'], browserName: 'chromium', channel: 'chrome' } },
  ],
});
