import { describe, expect, it } from "vitest";
import { adoption, contract, engagement, financial, satisfaction, support } from "../../src/lib/score/dimensions";
import { ALL_MODULES, ASOF, account, daysAgo, daysAhead, invoice, nps, ticket, usageRun } from "./helpers";

describe("adoção", () => {
  it("100 quando os 5 módulos têm pelo menos 4 eventos em 30 dias", () => {
    const a = account({ usage: usageRun({ modules: ALL_MODULES, fromDaysAgo: 10, toDaysAgo: 5 }) });
    expect(adoption(a, ASOF).value).toBe(100);
  });
  it("proporcional aos módulos em uso (2 de 5 = 40)", () => {
    const a = account({ usage: usageRun({ modules: ["rotas", "abastecimento"], fromDaysAgo: 10, toDaysAgo: 5 }) });
    expect(adoption(a, ASOF).value).toBe(40);
  });
  it("módulo com menos de 4 eventos não conta (limite exato: 3 não conta, 4 conta)", () => {
    const three = account({ usage: usageRun({ modules: ["rotas"], fromDaysAgo: 3, toDaysAgo: 1 }) });
    const four = account({ usage: usageRun({ modules: ["rotas"], fromDaysAgo: 4, toDaysAgo: 1 }) });
    expect(adoption(three, ASOF).value).toBe(0);
    expect(adoption(four, ASOF).value).toBe(20);
  });
  it("ignora uso fora da janela de 30 dias", () => {
    const a = account({ usage: usageRun({ modules: ALL_MODULES, fromDaysAgo: 60, toDaysAgo: 40 }) });
    expect(adoption(a, ASOF).value).toBe(0);
  });
  it("ignora eventos futuros (depois de asOf)", () => {
    const a = account({ usage: [{ date: daysAhead(2), module: "rotas", count: 50 }] });
    expect(adoption(a, ASOF).value).toBe(0);
  });
  it("conta nova (menos de 30 dias) fica sem dado", () => {
    const a = account({ account: { id: "n", mrr: 500, createdAt: daysAgo(10), contractEnd: daysAhead(355) } });
    expect(adoption(a, ASOF).value).toBeNull();
  });
});

describe("engajamento", () => {
  it("uso diário estável chega perto de 100", () => {
    const a = account({ usage: usageRun({ modules: ["rotas"], fromDaysAgo: 60, toDaysAgo: 0 }) });
    expect(engagement(a, ASOF).value).toBeCloseTo(100, 5);
  });
  it("sem uso nenhum é 0", () => {
    expect(engagement(account(), ASOF).value).toBe(0);
  });
  it("queda para metade do volume zera a parte de tendência (30%)", () => {
    const usage = [
      ...usageRun({ modules: ["rotas"], fromDaysAgo: 59, toDaysAgo: 30, count: 2 }),
      ...usageRun({ modules: ["rotas"], fromDaysAgo: 29, toDaysAgo: 0, count: 1 }),
    ];
    const e = engagement(account({ usage }), ASOF);
    // frequência 30 dias ativos => 100; tendência: ratio 0.5 => 0; valor = 0,7*100 + 0,3*0
    expect(e.value).toBeCloseTo(70, 0);
    expect(e.meta?.usageRatio).toBeCloseTo(0.5, 1);
  });
  it("uso crescente não passa de 100", () => {
    const usage = [
      ...usageRun({ modules: ["rotas"], fromDaysAgo: 59, toDaysAgo: 30, count: 1 }),
      ...usageRun({ modules: ["rotas"], fromDaysAgo: 29, toDaysAgo: 0, count: 5 }),
    ];
    expect(engagement(account({ usage }), ASOF).value).toBeLessThanOrEqual(100);
  });
  it("10 dias ativos sem histórico anterior: frequência 50 e tendência neutra (100)", () => {
    const a = account({ usage: usageRun({ modules: ["rotas"], fromDaysAgo: 10, toDaysAgo: 1 }) });
    expect(engagement(a, ASOF).value).toBeCloseTo(0.7 * 50 + 0.3 * 100, 5);
  });
  it("conta nova fica sem dado", () => {
    const a = account({ account: { id: "n", mrr: 500, createdAt: daysAgo(29), contractEnd: daysAhead(300) } });
    expect(engagement(a, ASOF).value).toBeNull();
  });
});

describe("suporte", () => {
  it("sem chamados: 100", () => {
    expect(support(account(), ASOF).value).toBe(100);
  });
  it("cada chamado recente tira 10 pontos (cap 40)", () => {
    const one = account({ tickets: [ticket(5, { category: "A" })] });
    const many = account({ tickets: ["A", "B", "C", "D", "E", "F"].map((c, i) => ticket(i + 1, { category: c })) });
    expect(support(one, ASOF).value).toBe(90);
    expect(support(many, ASOF).value).toBe(60); // 6 chamados: penalidade limitada em 40
  });
  it("categoria repetida em 60 dias soma 15", () => {
    const a = account({ tickets: [ticket(40, { category: "GPS" }), ticket(20, { category: "GPS" })] });
    // 1 chamado nos últimos 30 dias (-10) + 1 categoria repetida (-15)
    expect(support(a, ASOF).value).toBe(75);
    expect(support(a, ASOF).meta?.repeatedCategories).toBe(1);
  });
  it("chamado crítico em aberto soma 20 e envelhecido (>7 dias) soma 10", () => {
    const a = account({ tickets: [ticket(10, { severity: "HIGH", resolvedAt: null })] });
    expect(support(a, ASOF).value).toBe(100 - 10 - 20 - 10);
  });
  it("chamado resolvido depois de asOf conta como aberto na data", () => {
    const a = account({ tickets: [ticket(3, { severity: "HIGH", resolvedAt: daysAhead(2) })] });
    expect(support(a, ASOF).meta?.openHigh).toBe(1);
  });
  it("chamados com mais de 60 dias ou futuros não entram", () => {
    const a = account({ tickets: [ticket(90), ticket(-3)] });
    expect(support(a, ASOF).value).toBe(100);
  });
  it("nunca fica abaixo de 0", () => {
    const tickets = Array.from({ length: 20 }, (_, i) => ticket(i + 1, { category: i % 2 ? "A" : "B", severity: "HIGH", resolvedAt: null }));
    expect(support(account({ tickets }), ASOF).value).toBeGreaterThanOrEqual(0);
  });
});

describe("satisfação", () => {
  it("sem NPS em 180 dias: sem dado", () => {
    expect(satisfaction(account({ nps: [nps(200, 9)] }), ASOF).value).toBeNull();
    expect(satisfaction(account(), ASOF).value).toBeNull();
  });
  it("uma resposta 9: 0,8*90 + 0,2*50 (tendência neutra) = 82", () => {
    expect(satisfaction(account({ nps: [nps(20, 9)] }), ASOF).value).toBeCloseTo(82, 5);
  });
  it("queda de 8 para 5 reduz via tendência", () => {
    const v = satisfaction(account({ nps: [nps(100, 8), nps(20, 5)] }), ASOF).value as number;
    expect(v).toBeCloseTo(0.8 * 50 + 0.2 * 20, 5);
  });
  it("usa a resposta mais recente, não a mais alta", () => {
    const v = satisfaction(account({ nps: [nps(10, 2), nps(50, 10)] }), ASOF);
    expect(v.meta?.latestNps).toBe(2);
  });
  it("tendência limitada entre 0 e 100", () => {
    const v = satisfaction(account({ nps: [nps(10, 10), nps(50, 0)] }), ASOF).value as number;
    expect(v).toBeCloseTo(0.8 * 100 + 0.2 * 100, 5);
  });
});

describe("financeiro", () => {
  it("sem faturas em 90 dias: sem dado", () => {
    expect(financial(account(), ASOF).value).toBeNull();
  });
  it("faturas pagas em dia: 100", () => {
    expect(financial(account({ invoices: [invoice(60, 0), invoice(30, 1)] }), ASOF).value).toBe(100);
  });
  it("paga com atraso (> 5 dias) tira 10; até 5 dias é tolerado", () => {
    expect(financial(account({ invoices: [invoice(30, 5)] }), ASOF).value).toBe(100);
    expect(financial(account({ invoices: [invoice(30, 6)] }), ASOF).value).toBe(90);
  });
  it("fatura em aberto vencida: 40 + 1,5/dia (cap 30)", () => {
    expect(financial(account({ invoices: [invoice(10, null)] }), ASOF).value).toBeCloseTo(100 - 40 - 15, 5);
    expect(financial(account({ invoices: [invoice(40, null)] }), ASOF).value).toBeCloseTo(100 - 70, 5);
  });
  it("fatura paga depois de asOf conta como em aberto", () => {
    const inv = { dueDate: daysAgo(10), paidAt: daysAhead(3), amount: 1000 };
    expect(financial(account({ invoices: [inv] }), ASOF).meta?.overdue).toBe(1);
  });
  it("fatura que ainda não venceu não penaliza", () => {
    expect(financial(account({ invoices: [invoice(30, 0), { dueDate: daysAhead(5), paidAt: null, amount: 1 }] }), ASOF).value).toBe(100);
  });
  it("não fica abaixo de 0", () => {
    const invs = [invoice(80, null), invoice(50, null), invoice(20, null)];
    expect(financial(account({ invoices: invs }), ASOF).value).toBe(0);
  });
});

describe("contrato", () => {
  it("100 com 120 dias ou mais para renovar", () => {
    expect(contract(account({ account: { id: "x", mrr: 1, createdAt: daysAgo(400), contractEnd: daysAhead(120) } }), ASOF).value).toBe(100);
    expect(contract(account({ account: { id: "x", mrr: 1, createdAt: daysAgo(400), contractEnd: daysAhead(300) } }), ASOF).value).toBe(100);
  });
  it("cai linearmente de 100 a 40 entre 120 e 0 dias", () => {
    const at = (d: number) => contract(account({ account: { id: "x", mrr: 1, createdAt: daysAgo(400), contractEnd: daysAhead(d) } }), ASOF).value as number;
    expect(at(60)).toBeCloseTo(70, 5);
    expect(at(30)).toBeCloseTo(55, 5);
  });
  it("vencido sem renovação: 20", () => {
    expect(contract(account({ account: { id: "x", mrr: 1, createdAt: daysAgo(400), contractEnd: daysAgo(3) } }), ASOF).value).toBe(20);
  });
});
