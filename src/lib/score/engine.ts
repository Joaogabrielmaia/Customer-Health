import { z } from "zod";
import * as dim from "./dimensions";
import { addDays, clamp } from "./dimensions";
import {
  DIMENSIONS,
  type AccountData,
  type Dimension,
  type DimensionOutput,
  type DimensionResult,
  type HealthColor,
  type ScoreConfig,
  type ScoreResult,
  type Thresholds,
  type Weights,
} from "./types";

export const DEFAULT_CONFIG: ScoreConfig = {
  weights: { adoption: 25, engagement: 20, support: 15, satisfaction: 15, financial: 15, contract: 10 },
  thresholds: { green: 75, yellow: 50 },
};

/** Abaixo desta fatia de peso disponível a confiança do score é marcada como baixa. */
export const LOW_CONFIDENCE_SHARE = 0.7;

const weightField = z.number().min(0, "Peso não pode ser negativo").max(100, "Peso máximo é 100");

export const configSchema = z
  .object({
    weights: z.object({
      adoption: weightField,
      engagement: weightField,
      support: weightField,
      satisfaction: weightField,
      financial: weightField,
      contract: weightField,
    }),
    thresholds: z.object({
      green: z.number().int().min(2).max(99),
      yellow: z.number().int().min(1).max(98),
    }),
  })
  .refine((c) => Object.values(c.weights).reduce((a, b) => a + b, 0) > 0, {
    message: "A soma dos pesos precisa ser maior que zero",
    path: ["weights"],
  })
  .refine((c) => c.thresholds.yellow < c.thresholds.green, {
    message: "O limite do amarelo precisa ser menor que o do verde",
    path: ["thresholds"],
  });

const dimensionFns: Record<Dimension, (d: AccountData, asOf: Date) => DimensionOutput> = {
  adoption: dim.adoption,
  engagement: dim.engagement,
  support: dim.support,
  satisfaction: dim.satisfaction,
  financial: dim.financial,
  contract: dim.contract,
};

export function colorFor(score: number, t: Thresholds): HealthColor {
  if (score >= t.green) return "GREEN";
  if (score >= t.yellow) return "YELLOW";
  return "RED";
}

const round1 = (v: number): number => Math.round(v * 10) / 10;

/**
 * Calcula o score de uma conta na data `asOf`.
 * Dimensões sem dado ficam fora e os pesos das demais são renormalizados (ver docs, "dados ausentes").
 */
export function computeScore(data: AccountData, asOf: Date, config: ScoreConfig = DEFAULT_CONFIG): ScoreResult {
  const totalWeight = DIMENSIONS.reduce((s, d) => s + config.weights[d], 0);
  const outputs = DIMENSIONS.map((d) => ({ d, out: dimensionFns[d](data, asOf) }));
  const availableWeight = outputs.reduce((s, { d, out }) => (out.value === null ? s : s + config.weights[d]), 0);

  const dimensions: DimensionResult[] = outputs.map(({ d, out }) => {
    const weight = totalWeight > 0 ? config.weights[d] / totalWeight : 0;
    const missing = out.value === null;
    const weightUsed = !missing && availableWeight > 0 ? config.weights[d] / availableWeight : 0;
    return {
      dimension: d,
      value: out.value === null ? null : round1(out.value),
      missing,
      weight,
      weightUsed,
      contribution: missing ? 0 : (out.value as number) * weightUsed,
      detail: out.detail,
      meta: out.meta ?? {},
    };
  });

  const raw = dimensions.reduce((s, r) => s + r.contribution, 0);
  const score = round1(clamp(raw));
  const availableShare = totalWeight > 0 ? availableWeight / totalWeight : 0;
  return {
    score,
    color: colorFor(score, config.thresholds),
    dimensions: dimensions.map((r) => ({ ...r, contribution: round1(r.contribution) })),
    availableShare,
    confidence: availableShare < LOW_CONFIDENCE_SHARE ? "BAIXA" : "ALTA",
  };
}

export interface DimensionChange {
  dimension: Dimension;
  current: number | null;
  previous: number | null;
  /** variação em pontos de score causada por esta dimensão */
  contributionDelta: number;
}

export interface ScoreExplanation {
  current: ScoreResult;
  previous: ScoreResult;
  delta: number;
  changes: DimensionChange[];
}

/** "O que mudou desde o período anterior": compara o score hoje com o de `periodDays` atrás. */
export function explainChange(
  data: AccountData,
  asOf: Date,
  config: ScoreConfig = DEFAULT_CONFIG,
  periodDays = 30,
): ScoreExplanation {
  const current = computeScore(data, asOf, config);
  const previous = computeScore(data, addDays(asOf, -periodDays), config);
  const changes = DIMENSIONS.map((d) => {
    const c = current.dimensions.find((x) => x.dimension === d) as DimensionResult;
    const p = previous.dimensions.find((x) => x.dimension === d) as DimensionResult;
    return {
      dimension: d,
      current: c.value,
      previous: p.value,
      contributionDelta: round1(c.contribution - p.contribution),
    };
  }).sort((a, b) => Math.abs(b.contributionDelta) - Math.abs(a.contributionDelta));
  return { current, previous, delta: round1(current.score - previous.score), changes };
}

export const URGENCY_PROXIMITY_DAYS = 90;

/** Urgência = risco × valor × proximidade da renovação (em R$ ponderados). */
export function urgency(score: number, mrr: number, daysToRenewal: number): number {
  const risk = (100 - score) / 100;
  const proximity = 1 + clamp((URGENCY_PROXIMITY_DAYS - daysToRenewal) / URGENCY_PROXIMITY_DAYS, 0, 1);
  return risk * mrr * proximity;
}

export function normalizeWeights(w: Weights): Weights {
  const total = DIMENSIONS.reduce((s, d) => s + w[d], 0);
  return Object.fromEntries(DIMENSIONS.map((d) => [d, total > 0 ? (w[d] / total) * 100 : 0])) as Weights;
}
