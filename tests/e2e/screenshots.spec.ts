import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import { ADMIN, loginOk, openMostUrgentAccount, login } from "./helpers";

const OUT = path.resolve(__dirname, "../../docs/screenshots");
const shot = (page: Page, name: string, fullPage = true) => page.screenshot({ path: path.join(OUT, name), fullPage });

test.describe("@screenshots prints para a documentação", () => {
  test("telas principais (desktop)", async ({ page }) => {
    await login(page, ADMIN, "senha-errada");
    await shot(page, "00-login.png", false);

    await loginOk(page, ADMIN);
    await page.waitForLoadState("networkidle");
    await page.mouse.move(0, 0);
    await shot(page, "01-painel-executivo.png");

    await page.goto("/risco");
    await expect(page.getByTestId("risk-table")).toBeVisible();
    await shot(page, "02-contas-em-risco.png");

    await openMostUrgentAccount(page);
    await page.waitForLoadState("networkidle");
    await page.mouse.move(0, 0);
    await page.screenshot({ path: path.join(OUT, "03-visao-da-conta.png"), fullPage: false });
    await page.getByTestId("why-score").screenshot({ path: path.join(OUT, "04-explicacao-do-score.png") });
    await page.getByTestId("playbooks").screenshot({ path: path.join(OUT, "05-playbook-na-conta.png") });

    await page.getByLabel("Canal").selectOption("REUNIAO");
    await page.getByLabel("Resultado").selectOption("EM_ANDAMENTO");
    await page.getByLabel("O que foi feito").fill("Reunião de alinhamento com o responsável pela frota; combinamos um treinamento na próxima semana.");
    await page.getByRole("button", { name: "Registrar ação" }).click();
    await expect(page.getByRole("status")).toContainText("Ação registrada");
    await page.getByRole("heading", { name: "Registrar ação do CS" }).scrollIntoViewIfNeeded();
    await page.locator("section", { has: page.getByRole("heading", { name: "Registrar ação do CS" }) }).screenshot({ path: path.join(OUT, "07-registro-de-acao.png") });

    await page.goto("/playbooks");
    await shot(page, "06-playbooks.png");

    await page.goto("/configuracao");
    await page.getByLabel("Satisfação").fill("30");
    await page.getByLabel("Contrato").fill("5");
    await page.getByRole("button", { name: "Simular" }).click();
    await expect(page.getByText("Efeito da simulação")).toBeVisible();
    await shot(page, "08-configuracao-de-pesos.png");

    await page.goto("/sensibilidade");
    await expect(page.getByTestId("sensitivity-table")).toBeVisible();
    await shot(page, "09-sensibilidade.png");
  });

  test("exportação: primeiras linhas do CSV real", async ({ page }) => {
    await loginOk(page, ADMIN);
    const res = await page.request.get("/api/export?tipo=carteira");
    const lines = (await res.text()).replace("﻿", "").split(/\r?\n/).slice(0, 9);
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    await page.setViewportSize({ width: 1280, height: 420 });
    await page.setContent(`<body style="margin:0;background:#0f172a;color:#e2e8f0;font:13px/1.5 ui-monospace,Consolas,monospace;padding:20px">
      <p style="font:600 14px system-ui;margin:0 0 10px">GET /api/export?tipo=carteira — primeiras 9 linhas do arquivo gerado (dados sintéticos)</p>
      <pre style="margin:0;white-space:pre;overflow:hidden">${esc(lines.join("\n"))}</pre></body>`);
    await page.screenshot({ path: path.join(OUT, "10-exportacao-csv.png") });
  });

  test("versão mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginOk(page, ADMIN);
    await page.waitForLoadState("networkidle");
    await page.mouse.move(0, 0);
    await shot(page, "11-mobile-painel.png");
    await openMostUrgentAccount(page);
    await page.waitForLoadState("networkidle");
    await page.mouse.move(0, 0);
    await shot(page, "12-mobile-conta.png");
  });
});
