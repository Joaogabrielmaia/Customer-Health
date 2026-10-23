import { DIMENSION_LABEL, type DimensionResult, type ScoreResult } from "./score/types";
import type { ScoreExplanation } from "./score/engine";
import { signed } from "./format";

/** Pontos que a dimensão "tira" do score (peso usado × distância até 100). */
export const lossPoints = (d: DimensionResult): number => (d.value === null ? 0 : d.weightUsed * (100 - d.value));

export function topDrivers(result: ScoreResult, n = 2): DimensionResult[] {
  return [...result.dimensions]
    .filter((d) => !d.missing)
    .sort((a, b) => lossPoints(b) - lossPoints(a))
    .slice(0, n);
}

export function mainReason(result: ScoreResult): string {
  const [first] = topDrivers(result, 1);
  if (!first || lossPoints(first) < 3) return "Sem ponto de atenção relevante";
  return `${DIMENSION_LABEL[first.dimension]}: ${first.detail}`;
}

export function changeSentences(exp: ScoreExplanation): string[] {
  const out: string[] = [];
  if (Math.abs(exp.delta) < 0.5) out.push("O score ficou estável em relação a 30 dias atrás.");
  else out.push(`O score ${exp.delta < 0 ? "caiu" : "subiu"} ${signed(Math.abs(exp.delta)).replace(/^[+−]/, "")} pontos em relação a 30 dias atrás.`);
  for (const c of exp.changes.filter((x) => Math.abs(x.contributionDelta) >= 0.5).slice(0, 3)) {
    out.push(`${DIMENSION_LABEL[c.dimension]}: ${signed(c.contributionDelta)} ponto(s) no score.`);
  }
  return out;
}
