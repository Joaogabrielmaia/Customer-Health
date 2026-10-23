import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  workers: 1, // os testes compartilham o mesmo banco local
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3100", locale: "pt-BR", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } }],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3100/login",
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
