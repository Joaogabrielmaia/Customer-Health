import { explainChange } from "./engine";
import type { AccountScore } from "./portfolio";
import type { AccountData, Dimension, HealthColor, ScoreConfig } from "./types";

/** RN-17: queda de 15 pontos ou mais em 30 dias dispara o alerta. */
export const SUDDEN_DROP_POINTS = 15;

export interface SuddenDrop {
  id: string;
  /** variação em pontos (negativa) */
  delta: number;
  previousScore: number;
  currentScore: number;
  currentColor: HealthColor;
  /** dimensão que mais contribuiu para a queda */
  mainDimension: Dimension;
  /** quanto essa dimensão tirou do score (negativo) */
  mainDimensionDelta: number;
}

/**
 * Contas cujo score caiu `threshold` pontos ou mais no período, da maior queda para a menor.
 * A variação já vem calculada em `AccountScore.delta`; aqui só filtramos e explicamos.
 */
export function detectSuddenDrops(
  scores: AccountScore[],
  data: AccountData[],
  asOf: Date,
  config: ScoreConfig,
  threshold: number = SUDDEN_DROP_POINTS,
): SuddenDrop[] {
  const byId = new Map(data.map((d) => [d.account.id, d]));
  return scores
    .filter((s) => s.delta <= -threshold)
    .map((s) => {
      const exp = explainChange(byId.get(s.id) as AccountData, asOf, config);
      const worst = [...exp.changes].sort((a, b) => a.contributionDelta - b.contributionDelta)[0];
      return {
        id: s.id,
        delta: s.delta,
        previousScore: s.previousScore,
        currentScore: s.result.score,
        currentColor: s.result.color,
        mainDimension: worst.dimension,
        mainDimensionDelta: worst.contributionDelta,
      };
    })
    .sort((a, b) => a.delta - b.delta);
}
