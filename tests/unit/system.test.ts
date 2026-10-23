import { describe, expect, it } from "vitest";
import { generateDataset, createRng } from "../../scripts/seed/generate";
import { toAccountData } from "../../scripts/seed/adapt";
import { runSensitivity, spearman } from "../../src/lib/score/sensitivity";
import { countByColor, scorePortfolio, weeklyTrend } from "../../src/lib/score/portfolio";
import { DEFAULT_CONFIG, computeScore } from "../../src/lib/score/engine";
import { fillTemplate, recommendPlaybooks, PLAYBOOKS } from "../../src/lib/playbooks";
import { toCsv } from "../../src/lib/csv";
import { ALL_MODULES, ASOF, account, nps, ticket, usageRun, daysAhead } from "./helpers";

describe("gerador sintético", () => {
  const a = generateDataset(123);
  const b = generateDataset(123);
  const c = generateDataset(456);

  it("mesma semente, mesmos dados", () => {
    expect(a.accounts.map((x) => x.name)).toEqual(b.accounts.map((x) => x.name));
    expect(a.usage.length).toBe(b.usage.length);
    expect(a.usage.slice(0, 50)).toEqual(b.usage.slice(0, 50));
  });
  it("semente diferente, dados diferentes", () => {
    expect(a.accounts.map((x) => x.name)).not.toEqual(c.accounts.map((x) => x.name));
  });
  it("gera 120 contas com nomes únicos e CSMs distribuídos", () => {
    expect(a.accounts).toHaveLength(120);
    expect(new Set(a.accounts.map((x) => x.name)).size).toBe(120);
    expect(new Set(a.accounts.map((x) => x.csmId)).size).toBe(3);
  });
  it("PRNG respeita limites", () => {
    const r = createRng(1);
    for (let i = 0; i < 1000; i++) {
      const v = r.int(3, 7);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(7);
    }
  });
  it("nenhum evento é gerado depois da data de referência", () => {
    expect(a.usage.every((u) => u.date <= a.referenceDate)).toBe(true);
    expect(a.tickets.every((t) => t.openedAt <= a.referenceDate)).toBe(true);
    expect(a.nps.every((n) => n.date <= a.referenceDate)).toBe(true);
  });
  it("dados sintéticos resultam nas três cores (rotulado: isto NÃO mede churn)", () => {
    const ds = generateDataset();
    const counts = countByColor(scorePortfolio(toAccountData(ds), ds.referenceDate, DEFAULT_CONFIG));
    expect(counts.GREEN).toBeGreaterThan(0);
    expect(counts.YELLOW).toBeGreaterThan(0);
    expect(counts.RED).toBeGreaterThan(0);
    expect(counts.GREEN + counts.YELLOW + counts.RED).toBe(120);
  });
});

describe("sensibilidade", () => {
  const ds = generateDataset();
  const data = toAccountData(ds);
  const rows = runSensitivity(data, ds.referenceDate, DEFAULT_CONFIG);

  it("o cenário base não muda nada e tem correlação 1", () => {
    expect(rows[0].colorChanges).toBe(0);
    expect(rows[0].spearman).toBeCloseTo(1, 10);
    expect(rows[0].top15Overlap).toBe(15);
  });
  it("todo cenário mantém 120 contas", () => {
    for (const r of rows) expect(r.counts.GREEN + r.counts.YELLOW + r.counts.RED).toBe(120);
  });
  it("Spearman: ordem idêntica = 1, invertida = -1, empates tratados", () => {
    expect(spearman([1, 2, 3, 4], [10, 20, 30, 40])).toBeCloseTo(1, 10);
    expect(spearman([1, 2, 3, 4], [4, 3, 2, 1])).toBeCloseTo(-1, 10);
    expect(spearman([1, 1, 1], [1, 2, 3])).toBe(1);
  });
});

describe("tendência semanal", () => {
  it("devolve 12 pontos e contagens que somam as contas existentes", () => {
    const ds = generateDataset();
    const trend = weeklyTrend(toAccountData(ds), ds.referenceDate, DEFAULT_CONFIG, 12);
    expect(trend).toHaveLength(12);
    const last = trend[11];
    expect(last.green + last.yellow + last.red).toBe(120);
  });
});

describe("playbooks", () => {
  it("há cinco, com roteiro e mensagem", () => {
    expect(PLAYBOOKS).toHaveLength(5);
    for (const p of PLAYBOOKS) {
      expect(p.steps.length).toBeGreaterThan(2);
      expect(p.script.length).toBeGreaterThan(1);
      expect(p.messageTemplate).toContain("{{conta}}");
    }
  });
  it("preenche variáveis do modelo", () => {
    const msg = fillTemplate("Oi {{conta}}, {{csm}}, {{dias}}", { conta: "A", csm: "B", dias: 12.4 });
    expect(msg).toBe("Oi A, B, 12");
  });
  it("conta saudável e longe da renovação não dispara nada", () => {
    const a = account({ usage: usageRun({ modules: ALL_MODULES, fromDaysAgo: 80, toDaysAgo: 0, count: 2 }), nps: [nps(10, 10)] });
    expect(recommendPlaybooks(computeScore(a, ASOF), 300)).toHaveLength(0);
  });
  it("renovação em 60 dias dispara o playbook de renovação", () => {
    const a = account({ account: { id: "r", mrr: 1, createdAt: new Date("2020-01-01"), contractEnd: daysAhead(60) } });
    const slugs = recommendPlaybooks(computeScore(a, ASOF), 60).map((p) => p.slug);
    expect(slugs).toContain("renovacao-proxima");
  });
  it("NPS 4, chamados repetidos e uso em 1 módulo disparam três playbooks", () => {
    const a = account({
      usage: usageRun({ modules: ["rotas"], fromDaysAgo: 60, toDaysAgo: 0 }),
      nps: [nps(10, 4)],
      tickets: [ticket(40, { category: "GPS" }), ticket(10, { category: "GPS" })],
    });
    const slugs = recommendPlaybooks(computeScore(a, ASOF), 300).map((p) => p.slug);
    expect(slugs).toEqual(expect.arrayContaining(["baixa-adocao", "chamados-repetidos", "nps-baixo"]));
  });
  it("queda de uso dispara o playbook de queda", () => {
    const usage = [
      ...usageRun({ modules: ALL_MODULES, fromDaysAgo: 59, toDaysAgo: 30, count: 4 }),
      ...usageRun({ modules: ALL_MODULES, fromDaysAgo: 29, toDaysAgo: 0, count: 1, everyNth: 3 }),
    ];
    const slugs = recommendPlaybooks(computeScore(account({ usage }), ASOF), 300).map((p) => p.slug);
    expect(slugs).toContain("queda-de-uso");
  });
});

describe("CSV", () => {
  it("escapa vírgula, aspas e quebra de linha e começa com BOM", () => {
    const csv = toCsv(["a", "b"], [["x,y", 'diz "oi"'], ["linha\nquebrada", null]]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toContain('"x,y","diz ""oi"""');
    expect(csv).toContain('"linha\nquebrada",');
  });
});
