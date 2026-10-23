import { describe, expect, it } from "vitest";
import { detectSuddenDrops, SUDDEN_DROP_POINTS } from "../../src/lib/score/alerts";
import { DEFAULT_CONFIG } from "../../src/lib/score/engine";
import { scorePortfolio, type AccountScore } from "../../src/lib/score/portfolio";
import { generateDataset } from "../../scripts/seed/generate";
import { toAccountData } from "../../scripts/seed/adapt";
import { ALL_MODULES, ASOF, account, usageRun } from "./helpers";

const fakeScore = (id: string, delta: number): AccountScore => ({
  id, mrr: 1000, delta, previousScore: 80, daysToRenewal: 200, urgency: 0,
  result: { score: 80 + delta, color: "YELLOW", dimensions: [], availableShare: 1, confidence: "ALTA" },
});

describe("alerta de queda brusca (RN-17)", () => {
  const data = [account(), { ...account(), account: { ...account().account, id: "t-2" } }];

  it("o limite é 15 pontos: -15 dispara, -14,9 não dispara", () => {
    expect(SUDDEN_DROP_POINTS).toBe(15);
    const r = detectSuddenDrops([fakeScore("t-1", -15), fakeScore("t-2", -14.9)], data, ASOF, DEFAULT_CONFIG);
    expect(r.map((x) => x.id)).toEqual(["t-1"]);
  });
  it("melhora de score nunca dispara e a lista vem da maior queda para a menor", () => {
    const r = detectSuddenDrops([fakeScore("t-1", -20), fakeScore("t-2", +30)], data, ASOF, DEFAULT_CONFIG);
    expect(r).toHaveLength(1);
    const two = detectSuddenDrops([fakeScore("t-1", -16), fakeScore("t-2", -40)], data, ASOF, DEFAULT_CONFIG);
    expect(two.map((x) => x.id)).toEqual(["t-2", "t-1"]);
  });
  it("limite configurável", () => {
    expect(detectSuddenDrops([fakeScore("t-1", -8)], data, ASOF, DEFAULT_CONFIG, 5)).toHaveLength(1);
  });
  it("identifica a dimensão que mais derrubou o score (queda de uso)", () => {
    const usage = [
      ...usageRun({ modules: ALL_MODULES, fromDaysAgo: 80, toDaysAgo: 31, count: 3 }),
      ...usageRun({ modules: ["rotas"], fromDaysAgo: 30, toDaysAgo: 0, count: 1, everyNth: 5 }),
    ];
    const d = account({ usage });
    const [s] = scorePortfolio([d], ASOF, DEFAULT_CONFIG);
    const drops = detectSuddenDrops([s], [d], ASOF, DEFAULT_CONFIG);
    expect(drops).toHaveLength(1);
    expect(["adoption", "engagement"]).toContain(drops[0].mainDimension);
    expect(drops[0].mainDimensionDelta).toBeLessThan(0);
    expect(drops[0].delta).toBeLessThanOrEqual(-15);
  });
  it("no conjunto sintético, só entram contas com queda de 15+ pontos", () => {
    const ds = generateDataset();
    const data2 = toAccountData(ds);
    const scores = scorePortfolio(data2, ds.referenceDate, DEFAULT_CONFIG);
    const drops = detectSuddenDrops(scores, data2, ds.referenceDate, DEFAULT_CONFIG);
    expect(drops.every((x) => x.delta <= -15)).toBe(true);
    expect(drops.length).toBe(scores.filter((s) => s.delta <= -15).length);
  });
});
