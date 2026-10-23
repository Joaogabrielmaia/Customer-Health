import { loadConfig, loadPortfolio, type AccountMeta, type Portfolio } from "./data";
import { getReferenceDate } from "./reference";
import { scorePortfolio, type AccountScore } from "./score/portfolio";
import type { ScoreConfig } from "./score/types";

export interface ScoredAccount extends AccountScore {
  meta: AccountMeta;
}

export interface ScoredPortfolio {
  portfolio: Portfolio;
  config: ScoreConfig;
  asOf: Date;
  accounts: ScoredAccount[];
}

/** Ponto único de leitura para as telas: dados + configuração atual + score de todas as contas. */
export async function getScoredPortfolio(): Promise<ScoredPortfolio> {
  const [portfolio, config] = await Promise.all([loadPortfolio(), loadConfig()]);
  const asOf = getReferenceDate();
  const scores = scorePortfolio(portfolio.data, asOf, config);
  const accounts = scores.map((s, i) => ({ ...s, meta: portfolio.metas[i] }));
  return { portfolio, config, asOf, accounts };
}

/** Ordena por urgência (risco × valor × proximidade da renovação) e normaliza para um índice 0–100. */
export function withUrgencyIndex<T extends { urgency: number }>(rows: T[]): (T & { urgencyIndex: number })[] {
  const sorted = [...rows].sort((a, b) => b.urgency - a.urgency);
  const max = sorted[0]?.urgency || 1;
  return sorted.map((r) => ({ ...r, urgencyIndex: Math.round((r.urgency / max) * 100) }));
}
