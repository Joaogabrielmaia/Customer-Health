import { computeScore, explainChange, urgency, DEFAULT_CONFIG } from "./engine";
import { addDays, daysBetween } from "./dimensions";
import type { AccountData, HealthColor, ScoreConfig, ScoreResult } from "./types";

export interface AccountScore {
  id: string;
  mrr: number;
  result: ScoreResult;
  previousScore: number;
  delta: number;
  daysToRenewal: number;
  urgency: number;
}

export function scoreAccount(data: AccountData, asOf: Date, config: ScoreConfig = DEFAULT_CONFIG, periodDays = 30): AccountScore {
  const { current, previous, delta } = explainChange(data, asOf, config, periodDays);
  const daysToRenewal = daysBetween(asOf, data.account.contractEnd);
  return {
    id: data.account.id,
    mrr: data.account.mrr,
    result: current,
    previousScore: previous.score,
    delta,
    daysToRenewal,
    urgency: urgency(current.score, data.account.mrr, daysToRenewal),
  };
}

export function scorePortfolio(all: AccountData[], asOf: Date, config: ScoreConfig = DEFAULT_CONFIG): AccountScore[] {
  return all.map((d) => scoreAccount(d, asOf, config));
}

export interface ColorCounts { GREEN: number; YELLOW: number; RED: number }

export function countByColor(scores: { result: { color: HealthColor } }[]): ColorCounts {
  const c: ColorCounts = { GREEN: 0, YELLOW: 0, RED: 0 };
  for (const s of scores) c[s.result.color] += 1;
  return c;
}

export interface TrendPoint {
  date: string;
  avgScore: number;
  green: number;
  yellow: number;
  red: number;
  mrrAtRisk: number;
}

/** Série semanal reconstruída a partir dos eventos datados (ver ADR-002: sem tabela de snapshots). */
export function weeklyTrend(all: AccountData[], asOf: Date, config: ScoreConfig = DEFAULT_CONFIG, weeks = 12): TrendPoint[] {
  const points: TrendPoint[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const date = addDays(asOf, -7 * w);
    let sum = 0, green = 0, yellow = 0, red = 0, mrrAtRisk = 0, n = 0;
    for (const d of all) {
      if (d.account.createdAt > date) continue;
      const r = computeScore(d, date, config);
      sum += r.score;
      n += 1;
      if (r.color === "GREEN") green += 1;
      else if (r.color === "YELLOW") yellow += 1;
      else red += 1;
      if (r.color === "RED") mrrAtRisk += d.account.mrr;
    }
    points.push({ date: date.toISOString().slice(0, 10), avgScore: n ? Math.round((sum / n) * 10) / 10 : 0, green, yellow, red, mrrAtRisk });
  }
  return points;
}
