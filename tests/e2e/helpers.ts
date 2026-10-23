import { expect, type Page } from "@playwright/test";

export const DEMO_PASSWORD = "Termometro@2026";
export const ADMIN = "marcela@frotaleve.example";
export const CSM = "rafael@frotaleve.example";

export async function login(page: Page, email = ADMIN, password = DEMO_PASSWORD): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
}

export async function loginOk(page: Page, email = ADMIN): Promise<void> {
  await login(page, email);
  await expect(page.getByRole("heading", { name: "Painel executivo" })).toBeVisible();
}

/** Abre a conta mais urgente da lista de risco e devolve o caminho dela. */
export async function openMostUrgentAccount(page: Page): Promise<string> {
  await page.goto("/risco");
  const first = page.getByTestId("risk-table").locator("tbody tr").first().getByRole("link").first();
  await first.click();
  await expect(page.getByTestId("why-score")).toBeVisible();
  return new URL(page.url()).pathname;
}
