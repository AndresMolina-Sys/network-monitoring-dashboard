import { defineConfig, devices } from '@playwright/test'

// Playwright forces color in workers, so do not pass through a conflicting NO_COLOR setting.
delete process.env.NO_COLOR

const portValue = process.env.PLAYWRIGHT_PORT ?? '5173'
const port = Number(portValue)

if (!/^\d+$/.test(portValue) || !Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PLAYWRIGHT_PORT must be an integer between 1 and 65535')
}

const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/network-monitoring.spec.ts',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: {
        browserName: 'chromium',
        viewport: {
          width: 390,
          height: 844,
        },
      },
    },
  ],

  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
