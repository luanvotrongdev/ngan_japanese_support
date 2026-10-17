import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:4173' },
  webServer: {
    command: 'bun run db:migrate && bun run dev -- --host 127.0.0.1 --port 4173',
    env: { DATABASE_URL: 'data/e2e.db' },
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false
  }
});
