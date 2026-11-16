import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  timeout: 30000,
  expect: { timeout: 7000 },
  use: {
    baseURL: "http://127.0.0.1:4173/Pravi-Website/",
    browserName: "chromium",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173/Pravi-Website/",
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});
