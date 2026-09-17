import { defineConfig, devices } from '@playwright/test'

const apiUrl = 'http://127.0.0.1:5075'
const frontendUrl = 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/full-stack.spec.ts',
  timeout: 30_000,
  fullyParallel: false,
  reporter: 'list',

  use: {
    baseURL: frontendUrl,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'full-stack-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      name: 'api',
      command:
        'dotnet run --project backend/NetworkMonitoring.Api/NetworkMonitoring.Api.csproj --configuration Release --no-launch-profile --urls http://127.0.0.1:5075',
      url: `${apiUrl}/health`,
      timeout: 120_000,
      reuseExistingServer: false,
      env: {
        ASPNETCORE_ENVIRONMENT: 'Development',
      },
    },
    {
      name: 'frontend',
      command: 'npm run dev -- --host 127.0.0.1 --port 4173',
      url: frontendUrl,
      timeout: 120_000,
      reuseExistingServer: false,
      env: {
        VITE_API_BASE_URL: `${apiUrl}/api`,
      },
    },
  ],
})
