import { expect, test } from "@playwright/test";
import { ADMIN, CSM, login, loginOk, openMostUrgentAccount } from "./helpers";

test.describe("acesso", () => {
  test("rota protegida redireciona para o login", async ({ page }) => {
    await page.goto("/risco");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("senha errada mostra erro e não entra", async ({ page }) => {
    await login(page, ADMIN, "senha-errada");
    await expect(page.locator("p[role=alert]")).toContainText("E-mail ou senha incorretos");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("API de exportação exige sessão", async ({ request }) => {
    const res = await request.get("/api/export?tipo=carteira");
    expect(res.status()).toBe(401);
  });
});

test.describe("fluxo principal do CS", () => {
  test("painel → conta em risco → entender o porquê → registrar ação", async ({ page }) => {
    await loginOk(page, CSM);
    await expect(page.getByText("Receita em risco (críticas)")).toBeVisible();

    await page.getByRole("link", { name: "Ver todas as contas em risco" }).click();
    await expect(page.getByTestId("risk-table")).toBeVisible();

    await openMostUrgentAccount(page);
    await expect(page.getByRole("heading", { name: "Por que este score?" })).toBeVisible();
    await expect(page.getByText("O que mudou desde o período anterior")).toBeVisible();
    await expect(page.getByTestId("playbooks")).toBeVisible();

    const note = `Ligação de teste E2E ${Date.now()}`;
    await page.getByLabel("Resultado").selectOption("ESCALADO");
    await page.getByLabel("O que foi feito").fill(note);
    await page.getByRole("button", { name: "Registrar ação" }).click();
    await expect(page.getByRole("status")).toContainText("Ação registrada");
    await expect(page.getByTestId("actions-list")).toContainText(note);
    await expect(page.getByTestId("actions-list")).toContainText("Escalado");
  });

  test("validação: nota curta é recusada", async ({ page }) => {
    await loginOk(page);
    await openMostUrgentAccount(page);
    await page.getByLabel("O que foi feito").evaluate((el: HTMLTextAreaElement) => el.removeAttribute("minlength"));
    await page.getByLabel("O que foi feito").fill("ok");
    await page.getByRole("button", { name: "Registrar ação" }).click();
    await expect(page.locator("p[role=alert]")).toContainText("pelo menos 5 caracteres");
  });

  test("filtro de contas críticas reduz a lista", async ({ page }) => {
    await loginOk(page);
    await page.goto("/risco");
    const all = await page.getByTestId("risk-table").locator("tbody tr").count();
    await page.goto("/risco?cor=RED");
    const red = await page.getByTestId("risk-table").locator("tbody tr").count();
    expect(red).toBeGreaterThan(0);
    expect(red).toBeLessThan(all);
  });
});

test.describe("alertas de queda brusca (v1.1)", () => {
  test("banner do painel e página de alertas mostram a mesma contagem", async ({ page }) => {
    await loginOk(page);
    const banner = await page.getByTestId("drops-banner").innerText();
    const n = Number(banner.match(/^(\d+)/)![1]);
    await page.getByTestId("drops-banner").click();
    await expect(page.getByRole("heading", { name: "Alertas de queda brusca" })).toBeVisible();
    await expect(page.getByTestId("alerts-summary")).toContainText(`${n} conta(s)`);
    if (n > 0) await expect(page.getByTestId("alerts-table").locator("tbody tr")).toHaveCount(n);
  });
});

test.describe("configuração de pesos", () => {
  test("simular não grava; salvar aplica na hora e voltar ao padrão restaura", async ({ page }) => {
    await loginOk(page, ADMIN);
    await page.goto("/configuracao");
    const redBefore = Number(await page.getByTestId("count-red").innerText());

    // zera o peso do contrato e do financeiro e dobra suporte: muda a leitura da carteira
    await page.getByLabel("Financeiro").fill("0");
    await page.getByLabel("Contrato").fill("0");
    await page.getByLabel("Suporte").fill("50");
    await page.getByRole("button", { name: "Simular" }).click();
    await expect(page.getByText("Efeito da simulação")).toBeVisible();

    // recarregar a página mostra que a simulação não foi salva
    await page.reload();
    expect(Number(await page.getByTestId("count-red").innerText())).toBe(redBefore);

    await page.getByLabel("Suporte").fill("50");
    await page.getByLabel("Financeiro").fill("0");
    await page.getByRole("button", { name: "Salvar e aplicar" }).click();
    await expect(page.getByRole("status")).toContainText("salva e aplicada");

    const redAfter = Number(await page.getByTestId("count-red").innerText());
    await page.goto("/");
    await expect(page.getByText(`${redAfter} de 120`)).toBeVisible();

    // restaura o padrão
    await page.goto("/configuracao");
    await page.getByRole("button", { name: "Voltar ao padrão" }).click();
    await page.getByRole("button", { name: "Salvar e aplicar" }).click();
    await expect(page.getByRole("status")).toContainText("salva e aplicada");
    await page.goto("/");
    await expect(page.getByText(`${redBefore} de 120`)).toBeVisible();
  });

  test("limites invertidos são recusados", async ({ page }) => {
    await loginOk(page, ADMIN);
    await page.goto("/configuracao");
    await page.getByLabel("Verde a partir de").fill("40");
    await page.getByLabel("Amarelo a partir de").fill("60");
    await page.getByRole("button", { name: "Simular" }).click();
    await expect(page.locator("p[role=alert]")).toContainText("limite do amarelo");
  });

  test("CSM não consegue salvar", async ({ page }) => {
    await loginOk(page, CSM);
    await page.goto("/configuracao");
    await expect(page.getByRole("button", { name: "Salvar e aplicar" })).toBeDisabled();
  });
});

test.describe("exportação e sensibilidade", () => {
  test("CSV da carteira tem 120 contas e cabeçalho esperado", async ({ page }) => {
    await loginOk(page);
    const res = await page.request.get("/api/export?tipo=carteira");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/csv");
    const lines = (await res.text()).trim().split(/\r?\n/);
    expect(lines).toHaveLength(121);
    expect(lines[0]).toContain("conta_id,conta,segmento");
    expect(lines[0]).toContain("urgencia_brl");
  });

  test("tipo de exportação inválido devolve 400", async ({ page }) => {
    await loginOk(page);
    const res = await page.request.get("/api/export?tipo=xyz");
    expect(res.status()).toBe(400);
  });

  test("tela de sensibilidade lista cenários", async ({ page }) => {
    await loginOk(page);
    await page.goto("/sensibilidade");
    await expect(page.getByTestId("sensitivity-table").locator("tbody tr")).toHaveCount(22);
    await expect(page.getByTestId("sensitivity-takeaway")).toContainText("Maior efeito");
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("painel não tem rolagem horizontal na página", async ({ page }) => {
    await loginOk(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
