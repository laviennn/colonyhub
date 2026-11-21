import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { defineConfig } from '@playwright/test';

const e2eDbPath = path.join(os.tmpdir(), 'colonyhub-e2e-local-data.json');
if (fs.existsSync(e2eDbPath)) {
  fs.unlinkSync(e2eDbPath);
}

const sharedEnv: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  ),
  COLONYHUB_LOCAL_DB_PATH: e2eDbPath,
  PUBLIC_WEB_URL: 'http://127.0.0.1:3100',
  INQUIRY_RATE_LIMIT: '5',
};

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:3100',
    channel: 'chrome',
    headless: true,
  },
  webServer: [
    {
      command: 'pnpm exec next start --hostname 127.0.0.1 --port 3100',
      url: 'http://127.0.0.1:3100/',
      reuseExistingServer: false,
      timeout: 60_000,
      stdout: 'pipe',
      stderr: 'pipe',
      env: sharedEnv,
    },
    {
      command: 'pnpm --filter @colonyhub/command-center exec next start --hostname 127.0.0.1 --port 3101',
      url: 'http://127.0.0.1:3101/login',
      reuseExistingServer: false,
      timeout: 60_000,
      stdout: 'pipe',
      stderr: 'pipe',
      env: sharedEnv,
    },
  ],
});
