import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results',
  // The Nuxt development server keeps i18n state across requests. Running this
  // shared-server suite serially prevents locale races and avoids exhausting
  // WebKit resources when all projects launch at once.
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3010',
    trace: 'on-first-retry',
  },
  ...(process.env.BASE_URL
    ? {}
    : {
        webServer: {
          command: 'bun run dev --host 127.0.0.1 --port 3010',
          url: 'http://127.0.0.1:3010',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
  projects: [
    { name: 'desktop-light', use: { ...devices['Desktop Chrome'], colorScheme: 'light' } },
    { name: 'desktop-dark', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
    { name: 'mobile', use: { ...devices['iPhone 13'], colorScheme: 'light' } },
  ],
})
