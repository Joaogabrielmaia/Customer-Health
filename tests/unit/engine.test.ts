import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
  colorFor,
  computeScore,
  configSchema,
  explainChange,
  normalizeWeights,
  urgency,
} from "../../src/lib/score/engine";
import { DIMENSIONS, type ScoreConfig } from "../../src/lib/score/types";
import { ALL_MODULES, ASOF, account, daysAgo, daysAhead, invoice, nps, ticket, usageRun } from "./helpers";

const healthy = () =>
  account({
    usage: usageRun({ modules: ALL_MODULES, fromDaysAgo: 80, toDaysAgo: 0, count: 2 }),
    nps: [nps(20, 10)],
    invoices: [invoice(30, 0), invoice(60, 0)],
  });

describe("agregação do score", () => {
  it("conta saudável fica alta e verde", () => {
    const r = computeScore(healthy(), ASOF);
    expect(r.score).toBeGreaterThan(90);
    expect(r.color).toBe("GREEN");
    expect(r.confidence).toBe("ALTA");
  });

  it("contribuições somam o score (até arredondamento)", () => {
    const r = computeScore(healthy(), ASOF);
    const sum = r.dimensions.reduce((s, d) => s + d.contribution, 0);
    expect(Math.abs(sum - r.score)).toBeLessThan(0.4);
  });

  it("score fica sempre entre 0 e 100", () => {
    const bad = account({
      tickets: Array.from({ length: 10 }, (_, i) => ticket(i + 1, { severity: "HIGH", resolvedAt: null, category: "X" })),
      nps: [nps(5, 0)],
      invoices: [invoice(50, null)],
      account: { id: "b", mrr: 1, createdAt: daysAgo(900), contractEnd: daysAgo(10) },
    });
    const r = computeScore(bad, ASOF);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
    expect(r.color).toBe("RED");
  });

  it("pesos iguais a zero em tudo menos uma dimensão: o score é o valor dessa dimensão", () => {
    const cfg: ScoreConfig = { ...DEFAULT_CONFIG, weights: { adoption: 0, engagement: 0, support: 1, satisfaction: 0, financial: 0, contract: 0 } };
    const a = account({ tickets: [ticket(5, { category: "A" })] });
    expect(computeScore(a, ASOF, cfg).score).toBe(90);
  });

  it("soma de pesos zero não quebra (score 0)", () => {
    const cfg: ScoreConfig = { ...DEFAULT_CONFIG, weights: { adoption: 0, engagement: 0, support: 0, satisfaction: 0, financial: 0, contract: 0 } };
    const r = computeScore(healthy(), ASOF, cfg);
    expect(r.score).toBe(0);
    expect(Number.isFinite(r.score)).toBe(true);
  });

  it("é determinístico", () => {
    expect(computeScore(healthy(), ASOF)).toEqual(computeScore(healthy(), ASOF));
  });
});

describe("dados ausentes", () => {
  it("sem NPS e sem faturas: dimensões marcadas ausentes e pesos renormalizados", () => {
    const a = account({ usage: usageRun({ modules: ALL_MODULES, fromDaysAgo: 80, toDaysAgo: 0, count: 2 }) });
    const r = computeScore(a, ASOF);
    const sat = r.dimensions.find((d) => d.dimension === "satisfaction")!;
    const fin = r.dimensions.find((d) => d.dimension === "financial")!;
    expect(sat.missing && fin.missing).toBe(true);
    expect(sat.weightUsed).toBe(0);
    const used = r.dimensions.reduce((s, d) => s + d.weightUsed, 0);
    expect(used).toBeCloseTo(1, 10);
    expect(r.availableShare).toBeCloseTo(0.7, 10);
    // ausência não derruba o score: tudo que existe está perfeito
    expect(r.score).toBeGreaterThan(95);
  });

  it("confiança baixa quando menos de 70% do peso tem dado", () => {
    const newAcc = account({ account: { id: "n", mrr: 300, createdAt: daysAgo(10), contractEnd: daysAhead(355) } });
    const r = computeScore(newAcc, ASOF);
    // adoção (25) e engajamento (20) ausentes, NPS (15) e financeiro (15) ausentes: sobra suporte (15) + contrato (10)
    expect(r.availableShare).toBeCloseTo(0.25, 10);
    expect(r.confidence).toBe("BAIXA");
  });

  it("exatamente 70% de peso disponível ainda é confiança alta", () => {
    const a = account({ usage: usageRun({ modules: ALL_MODULES, fromDaysAgo: 80, toDaysAgo: 0 }) });
    expect(computeScore(a, ASOF).confidence).toBe("ALTA");
  });
});

describe("limites de cor", () => {
  const t = { green: 75, yellow: 50 };
  it("verde a partir de 75, amarelo de 50 a 74,9, vermelho abaixo", () => {
    expect(colorFor(75, t)).toBe("GREEN");
    expect(colorFor(74.9, t)).toBe("YELLOW");
    expect(colorFor(50, t)).toBe("YELLOW");
    expect(colorFor(49.9, t)).toBe("RED");
    expect(colorFor(0, t)).toBe("RED");
    expect(colorFor(100, t)).toBe("GREEN");
  });
  it("limites configuráveis mudam a cor da mesma conta", () => {
    const a = healthy();
    expect(computeScore(a, ASOF, { ...DEFAULT_CONFIG, thresholds: { green: 99, yellow: 98 } }).color).not.toBe("GREEN");
  });
});

describe("validação da configuração (Zod)", () => {
  it("aceita a configuração padrão", () => {
    expect(configSchema.safeParse(DEFAULT_CONFIG).success).toBe(true);
  });
  it("recusa peso negativo, soma zero e limites invertidos", () => {
    expect(configSchema.safeParse({ ...DEFAULT_CONFIG, weights: { ...DEFAULT_CONFIG.weights, support: -1 } }).success).toBe(false);
    expect(configSchema.safeParse({ ...DEFAULT_CONFIG, weights: Object.fromEntries(DIMENSIONS.map((d) => [d, 0])) }).success).toBe(false);
    expect(configSchema.safeParse({ ...DEFAULT_CONFIG, thresholds: { green: 40, yellow: 60 } }).success).toBe(false);
    expect(configSchema.safeParse({ ...DEFAULT_CONFIG, thresholds: { green: 60, yellow: 60 } }).success).toBe(false);
  });
  it("normalizeWeights soma 100", () => {
    const n = normalizeWeights({ adoption: 1, engagement: 1, support: 1, satisfaction: 1, financial: 1, contract: 1 });
    expect(DIMENSIONS.reduce((s, d) => s + n[d], 0)).toBeCloseTo(100, 10);
  });
});

describe("explicação: o que mudou", () => {
  it("queda de uso aparece como dimensão que mais mudou", () => {
    const usage = [
      ...usageRun({ modules: ALL_MODULES, fromDaysAgo: 80, toDaysAgo: 31, count: 3 }),
      ...usageRun({ modules: ["rotas"], fromDaysAgo: 30, toDaysAgo: 0, count: 1, everyNth: 4 }),
    ];
    const exp = explainChange(account({ usage, nps: [nps(20, 9)], invoices: [invoice(30, 0)] }), ASOF);
    expect(exp.delta).toBeLessThan(-20);
    expect(["adoption", "engagement"]).toContain(exp.changes[0].dimension);
    expect(exp.changes[0].contributionDelta).toBeLessThan(0);
  });
  it("a soma das variações de contribuição bate com a variação do score (±1)", () => {
    const usage = usageRun({ modules: ["rotas", "abastecimento"], fromDaysAgo: 70, toDaysAgo: 0 });
    const exp = explainChange(account({ usage, tickets: [ticket(5)] }), ASOF);
    const total = exp.changes.reduce((s, c) => s + c.contributionDelta, 0);
    expect(Math.abs(total - exp.delta)).toBeLessThanOrEqual(1);
  });
  it("conta estável tem variação perto de zero", () => {
    const exp = explainChange(healthy(), ASOF);
    expect(Math.abs(exp.delta)).toBeLessThan(2);
  });
});

describe("urgência", () => {
  it("cresce com risco, valor e proximidade da renovação", () => {
    expect(urgency(40, 1000, 200)).toBeGreaterThan(urgency(60, 1000, 200));
    expect(urgency(40, 2000, 200)).toBeGreaterThan(urgency(40, 1000, 200));
    expect(urgency(40, 1000, 30)).toBeGreaterThan(urgency(40, 1000, 200));
  });
  it("valores exatos: risco 60% × R$1000 × proximidade 1 = 600; renovação hoje dobra", () => {
    expect(urgency(40, 1000, 90)).toBeCloseTo(600, 5);
    expect(urgency(40, 1000, 200)).toBeCloseTo(600, 5);
    expect(urgency(40, 1000, 0)).toBeCloseTo(1200, 5);
    expect(urgency(40, 1000, -5)).toBeCloseTo(1200, 5);
  });
  it("score 100 tem urgência zero", () => {
    expect(urgency(100, 5000, 0)).toBe(0);
  });
});
