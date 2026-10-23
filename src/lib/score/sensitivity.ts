import { DIMENSIONS, DIMENSION_LABEL, type AccountData, type Dimension, type ScoreConfig } from "./types";
import { scorePortfolio, countByColor, type AccountScore, type ColorCounts } from "./portfolio";

export interface Scenario {
  id: string;
  label: string;
  config: ScoreConfig;
}

export interface SensitivityRow {
  id: string;
  label: string;
  counts: ColorCounts;
  /** contas que mudam de cor em relação ao cenário base */
  colorChanges: number;
  /** correlação de Spearman entre o ranking do cenário e o do base (1 = mesma ordem) */
  spearman: number;
  /** das 15 contas mais urgentes no base, quantas continuam entre as 15 mais urgentes */
  top15Overlap: number;
  meanAbsDelta: number;
}

const TOP_N = 15;

function ranks(values: number[]): number[] {
  const idx = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const r = new Array<number>(values.length);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1].v === idx[i].v) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) r[idx[k].i] = avg;
    i = j + 1;
  }
  return r;
}

export function spearman(a: number[], b: number[]): number {
  const ra = ranks(a), rb = ranks(b);
  const n = a.length;
  const ma = ra.reduce((s, v) => s + v, 0) / n;
  const mb = rb.reduce((s, v) => s + v, 0) / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    num += (ra[i] - ma) * (rb[i] - mb);
    da += (ra[i] - ma) ** 2;
    db += (rb[i] - mb) ** 2;
  }
  return da === 0 || db === 0 ? 1 : num / Math.sqrt(da * db);
}

const topUrgent = (s: AccountScore[]): Set<string> =>
  new Set([...s].sort((a, b) => b.urgency - a.urgency).slice(0, TOP_N).map((x) => x.id));

export function buildScenarios(base: ScoreConfig): Scenario[] {
  const out: Scenario[] = [{ id: "base", label: "Base (configuração atual)", config: base }];
  for (const d of DIMENSIONS) {
    for (const [sign, factor] of [["+", 1.5], ["-", 0.5]] as const) {
      out.push({
        id: `${d}${sign}50`,
        label: `${DIMENSION_LABEL[d]} ${sign}50% do peso`,
        config: { ...base, weights: { ...base.weights, [d]: base.weights[d] * factor } },
      });
    }
  }
  const equal = Object.fromEntries(DIMENSIONS.map((d) => [d, 100 / DIMENSIONS.length])) as ScoreConfig["weights"];
  out.push({ id: "equal", label: "Pesos iguais", config: { ...base, weights: equal } });
  for (const d of DIMENSIONS) {
    out.push({
      id: `no-${d}`,
      label: `Sem ${DIMENSION_LABEL[d].toLowerCase()} (peso 0)`,
      config: { ...base, weights: { ...base.weights, [d]: 0 } as Record<Dimension, number> },
    });
  }
  for (const delta of [-5, 5]) {
    out.push({
      id: `thr${delta}`,
      label: `Limites de cor ${delta > 0 ? "+" : ""}${delta} pontos`,
      config: { ...base, thresholds: { green: base.thresholds.green + delta, yellow: base.thresholds.yellow + delta } },
    });
  }
  return out;
}

export function runSensitivity(all: AccountData[], asOf: Date, base: ScoreConfig): SensitivityRow[] {
  const scenarios = buildScenarios(base);
  const baseScores = scorePortfolio(all, asOf, base);
  const baseTop = topUrgent(baseScores);
  const baseValues = baseScores.map((s) => s.result.score);
  return scenarios.map((sc) => {
    const scores = sc.id === "base" ? baseScores : scorePortfolio(all, asOf, sc.config);
    const colorChanges = scores.filter((s, i) => s.result.color !== baseScores[i].result.color).length;
    const top = topUrgent(scores);
    const overlap = [...top].filter((id) => baseTop.has(id)).length;
    const meanAbsDelta = scores.reduce((sum, s, i) => sum + Math.abs(s.result.score - baseValues[i]), 0) / scores.length;
    return {
      id: sc.id,
      label: sc.label,
      counts: countByColor(scores),
      colorChanges,
      spearman: spearman(scores.map((s) => s.result.score), baseValues),
      top15Overlap: overlap,
      meanAbsDelta,
    };
  });
}
