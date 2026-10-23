import { prisma } from "./db";
import { DEFAULT_CONFIG, configSchema } from "./score/engine";
import type { AccountData, ScoreConfig, TicketSeverity } from "./score/types";

export interface AccountMeta {
  id: string;
  name: string;
  segment: string;
  plan: string;
  vehicles: number;
  city: string;
  mrr: number;
  csmId: string;
  csmName: string;
  contractEnd: Date;
}

export interface Portfolio {
  metas: AccountMeta[];
  data: AccountData[];
}

const TTL_MS = 30_000;
const g = globalThis as unknown as { __portfolio?: { at: number; value: Portfolio } };

/**
 * Carrega os dados brutos de todas as contas. Eles só mudam quando o seed roda, então ficam em cache
 * por 30 s; configuração e ações do CS são sempre lidas na hora (ver ADR-001).
 */
export async function loadPortfolio(): Promise<Portfolio> {
  const cached = g.__portfolio;
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;

  const accounts = await prisma.account.findMany({
    orderBy: { id: "asc" },
    include: {
      csm: { select: { id: true, name: true } },
      contracts: { orderBy: { endDate: "desc" }, take: 1 },
      usage: { select: { date: true, module: true, count: true } },
      tickets: { select: { openedAt: true, resolvedAt: true, category: true, severity: true } },
      nps: { select: { date: true, score: true } },
      invoices: { select: { dueDate: true, paidAt: true, amount: true } },
    },
  });

  const value: Portfolio = { metas: [], data: [] };
  for (const a of accounts) {
    const contractEnd = a.contracts[0]?.endDate ?? a.createdAt;
    value.metas.push({
      id: a.id, name: a.name, segment: a.segment, plan: a.plan, vehicles: a.vehicles, city: a.city,
      mrr: a.mrr, csmId: a.csm.id, csmName: a.csm.name, contractEnd,
    });
    value.data.push({
      account: { id: a.id, mrr: a.mrr, createdAt: a.createdAt, contractEnd },
      usage: a.usage,
      tickets: a.tickets.map((t) => ({ ...t, severity: t.severity as TicketSeverity })),
      nps: a.nps,
      invoices: a.invoices,
    });
  }
  g.__portfolio = { at: Date.now(), value };
  return value;
}

export async function loadConfig(): Promise<ScoreConfig> {
  const row = await prisma.scoreConfigRow.findUnique({ where: { id: "default" } });
  if (!row) return DEFAULT_CONFIG;
  const parsed = configSchema.safeParse({ weights: row.weights, thresholds: row.thresholds });
  return parsed.success ? parsed.data : DEFAULT_CONFIG;
}
