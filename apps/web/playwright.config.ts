import { defineConfig, devices } from '@playwright/test';

// Our users are on entry-level Android phones: every E2E test runs at 360×800.
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:4173', trace: 'on-first-retry' },
  projects: [
    {
      name: 'android-360',
      use: { ...devices['Galaxy S9+'], viewport: { width: 360, height: 800 } },
    },
  ],
  webServer: {
    command: 'vite build && vite preview --port 4173 --strictPort',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
