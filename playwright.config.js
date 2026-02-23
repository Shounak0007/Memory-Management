import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL: 'http://localhost:5000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*\.spec\.js/,
    },
  ],
});
