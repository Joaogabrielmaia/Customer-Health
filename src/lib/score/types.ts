export const DIMENSIONS = [
  "adoption",
  "engagement",
  "support",
  "satisfaction",
  "financial",
  "contract",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];
export type Weights = Record<Dimension, number>;

export const DIMENSION_LABEL: Record<Dimension, string> = {
  adoption: "Adoção",
  engagement: "Engajamento",
  support: "Suporte",
  satisfaction: "Satisfação",
  financial: "Financeiro",
  contract: "Contrato",
};

export const MODULES = ["rotas", "abastecimento", "manutencao", "motoristas", "relatorios"] as const;
export type UsageModule = (typeof MODULES)[number];

export type Thresholds = {
  /** score >= green => verde */
  green: number;
  /** score >= yellow (e < green) => amarelo; abaixo => vermelho */
  yellow: number;
};

export interface ScoreConfig {
  weights: Weights;
  thresholds: Thresholds;
}

export type HealthColor = "GREEN" | "YELLOW" | "RED";

export const COLOR_LABEL: Record<HealthColor, string> = {
  GREEN: "Saudável",
  YELLOW: "Atenção",
  RED: "Crítica",
};

export interface AccountInfo {
  id: string;
  mrr: number;
  createdAt: Date;
  contractEnd: Date;
}

export interface UsageInput {
  date: Date;
  module: string;
  count: number;
}

export type TicketSeverity = "LOW" | "MEDIUM" | "HIGH";

export interface TicketInput {
  openedAt: Date;
  resolvedAt: Date | null;
  category: string;
  severity: TicketSeverity;
}

export interface NpsInput {
  date: Date;
  score: number;
}

export interface InvoiceInput {
  dueDate: Date;
  paidAt: Date | null;
  amount: number;
}

export interface AccountData {
  account: AccountInfo;
  usage: UsageInput[];
  tickets: TicketInput[];
  nps: NpsInput[];
  invoices: InvoiceInput[];
}

export interface DimensionResult {
  dimension: Dimension;
  /** 0..100, ou null quando não há dado suficiente (dimensão excluída do cálculo). */
  value: number | null;
  missing: boolean;
  /** peso configurado, normalizado entre 0 e 1 (sobre todas as dimensões) */
  weight: number;
  /** peso efetivamente usado após renormalizar sem as dimensões ausentes */
  weightUsed: number;
  /** pontos que esta dimensão adiciona ao score final */
  contribution: number;
  detail: string;
  meta: Record<string, number>;
}

export type Confidence = "ALTA" | "BAIXA";

export interface ScoreResult {
  score: number;
  color: HealthColor;
  dimensions: DimensionResult[];
  /** fatia do peso total que tinha dado disponível (0..1) */
  availableShare: number;
  confidence: Confidence;
}

export interface DimensionOutput {
  value: number | null;
  detail: string;
  meta?: Record<string, number>;
}
