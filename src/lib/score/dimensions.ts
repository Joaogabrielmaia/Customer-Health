import type { AccountData, DimensionOutput } from "./types";
import { MODULES } from "./types";

export const DAY_MS = 86_400_000;

export const daysBetween = (from: Date, to: Date): number => (to.getTime() - from.getTime()) / DAY_MS;
export const addDays = (d: Date, n: number): Date => new Date(d.getTime() + n * DAY_MS);
export const clamp = (v: number, min = 0, max = 100): number => Math.min(max, Math.max(min, v));

const dayKey = (d: Date): string => d.toISOString().slice(0, 10);

/** Parâmetros da metodologia (ver docs/03-metodologia-do-score). Mantidos aqui, nomeados, para os testes e a documentação. */
export const PARAMS = {
  windowDays: 30,
  newAccountDays: 30,
  adoptionMinEventsPerModule: 4,
  engagementExpectedActiveDays: 20,
  engagementFrequencyShare: 0.7,
  engagementTrendFloorRatio: 0.5,
  supportWindowDays: 60,
  supportRecentDays: 30,
  supportPenaltyPerRecentTicket: 10,
  supportPenaltyRecentCap: 40,
  supportPenaltyPerRepeatedCategory: 15,
  supportPenaltyRepeatedCap: 30,
  supportPenaltyPerOpenHigh: 20,
  supportPenaltyOpenHighCap: 40,
  supportAgingDays: 7,
  supportPenaltyAging: 10,
  npsWindowDays: 180,
  npsLevelShare: 0.8,
  npsTrendPointsPerDelta: 10,
  financialWindowDays: 90,
  financialLateToleranceDays: 5,
  financialPenaltyLatePaid: 10,
  financialPenaltyOverdueBase: 40,
  financialPenaltyOverduePerDay: 1.5,
  financialPenaltyOverdueExtraCap: 30,
  contractSafeDays: 120,
  contractFloor: 40,
  contractExpired: 20,
} as const;

export function adoption(data: AccountData, asOf: Date): DimensionOutput {
  const { account, usage } = data;
  if (daysBetween(account.createdAt, asOf) < PARAMS.newAccountDays) {
    return { value: null, detail: "Conta em onboarding (menos de 30 dias): adoção ainda não avaliada." };
  }
  const from = addDays(asOf, -PARAMS.windowDays);
  const perModule = new Map<string, number>();
  for (const u of usage) {
    if (u.date > from && u.date <= asOf) perModule.set(u.module, (perModule.get(u.module) ?? 0) + u.count);
  }
  const used = MODULES.filter((m) => (perModule.get(m) ?? 0) >= PARAMS.adoptionMinEventsPerModule);
  const value = (used.length / MODULES.length) * 100;
  return {
    value,
    detail: `${used.length} de ${MODULES.length} módulos em uso nos últimos 30 dias.`,
    meta: { modulesUsed: used.length, modulesTotal: MODULES.length },
  };
}

export function engagement(data: AccountData, asOf: Date): DimensionOutput {
  const { account, usage } = data;
  if (daysBetween(account.createdAt, asOf) < PARAMS.newAccountDays) {
    return { value: null, detail: "Conta em onboarding (menos de 30 dias): engajamento ainda não avaliado." };
  }
  const from = addDays(asOf, -PARAMS.windowDays);
  const prevFrom = addDays(asOf, -2 * PARAMS.windowDays);
  const activeDays = new Set<string>();
  let current = 0;
  let previous = 0;
  for (const u of usage) {
    if (u.date > from && u.date <= asOf) {
      current += u.count;
      activeDays.add(dayKey(u.date));
    } else if (u.date > prevFrom && u.date <= from) {
      previous += u.count;
    }
  }
  const frequency = clamp((activeDays.size / PARAMS.engagementExpectedActiveDays) * 100);
  const ratio = previous > 0 ? Math.min(current / previous, 1) : current > 0 ? 1 : 0;
  const floor = PARAMS.engagementTrendFloorRatio;
  const trend = clamp(((ratio - floor) / (1 - floor)) * 100);
  const share = PARAMS.engagementFrequencyShare;
  const value = share * frequency + (1 - share) * trend;
  const rawRatio = previous > 0 ? current / previous : current > 0 ? 1 : 0;
  return {
    value,
    detail: `${activeDays.size} dias ativos nos últimos 30; volume de uso ${Math.round(rawRatio * 100)}% do período anterior.`,
    meta: { activeDays: activeDays.size, usageRatio: rawRatio, volumeCurrent: current, volumePrevious: previous },
  };
}

export function support(data: AccountData, asOf: Date): DimensionOutput {
  const windowStart = addDays(asOf, -PARAMS.supportWindowDays);
  const recentStart = addDays(asOf, -PARAMS.supportRecentDays);
  const tickets = data.tickets.filter((t) => t.openedAt > windowStart && t.openedAt <= asOf);
  const isOpen = (t: { resolvedAt: Date | null }) => t.resolvedAt === null || t.resolvedAt > asOf;

  const recent = tickets.filter((t) => t.openedAt > recentStart).length;
  const byCategory = new Map<string, number>();
  for (const t of tickets) byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + 1);
  const repeated = [...byCategory.values()].filter((n) => n >= 2).length;
  const openHigh = tickets.filter((t) => t.severity === "HIGH" && isOpen(t)).length;
  const aging = tickets.some((t) => isOpen(t) && daysBetween(t.openedAt, asOf) > PARAMS.supportAgingDays);

  const penalty =
    Math.min(recent * PARAMS.supportPenaltyPerRecentTicket, PARAMS.supportPenaltyRecentCap) +
    Math.min(repeated * PARAMS.supportPenaltyPerRepeatedCategory, PARAMS.supportPenaltyRepeatedCap) +
    Math.min(openHigh * PARAMS.supportPenaltyPerOpenHigh, PARAMS.supportPenaltyOpenHighCap) +
    (aging ? PARAMS.supportPenaltyAging : 0);

  const parts: string[] = [`${recent} chamado(s) nos últimos 30 dias`];
  if (repeated > 0) parts.push(`${repeated} categoria(s) com chamados repetidos`);
  if (openHigh > 0) parts.push(`${openHigh} crítico(s) em aberto`);
  if (aging) parts.push("chamado aberto há mais de 7 dias");
  return {
    value: clamp(100 - penalty),
    detail: parts.join("; ") + ".",
    meta: { recentTickets: recent, repeatedCategories: repeated, openHigh, aging: aging ? 1 : 0 },
  };
}

export function satisfaction(data: AccountData, asOf: Date): DimensionOutput {
  const from = addDays(asOf, -PARAMS.npsWindowDays);
  const responses = data.nps
    .filter((n) => n.date > from && n.date <= asOf)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  if (responses.length === 0) {
    return { value: null, detail: "Sem resposta de NPS nos últimos 180 dias: satisfação fora do cálculo." };
  }
  const latest = responses[0].score;
  const previous = responses[1]?.score;
  const delta = previous === undefined ? 0 : latest - previous;
  const trend = previous === undefined ? 50 : clamp(50 + delta * PARAMS.npsTrendPointsPerDelta);
  const level = latest * 10;
  const value = PARAMS.npsLevelShare * level + (1 - PARAMS.npsLevelShare) * trend;
  const trendText = previous === undefined ? "sem resposta anterior" : `${delta >= 0 ? "+" : ""}${delta} vs. resposta anterior`;
  return {
    value,
    detail: `Última nota de NPS: ${latest} (${trendText}).`,
    meta: { latestNps: latest, npsDelta: delta },
  };
}

export function financial(data: AccountData, asOf: Date): DimensionOutput {
  const from = addDays(asOf, -PARAMS.financialWindowDays);
  const invoices = data.invoices.filter((i) => i.dueDate > from && i.dueDate <= asOf);
  if (invoices.length === 0) {
    return { value: null, detail: "Sem faturas vencidas nos últimos 90 dias: financeiro fora do cálculo." };
  }
  let penalty = 0;
  let latePaid = 0;
  let overdue = 0;
  let maxOverdueDays = 0;
  for (const inv of invoices) {
    const paid = inv.paidAt !== null && inv.paidAt <= asOf;
    if (paid) {
      if (daysBetween(inv.dueDate, inv.paidAt as Date) > PARAMS.financialLateToleranceDays) {
        latePaid += 1;
        penalty += PARAMS.financialPenaltyLatePaid;
      }
    } else {
      const days = daysBetween(inv.dueDate, asOf);
      if (days > 0) {
        overdue += 1;
        maxOverdueDays = Math.max(maxOverdueDays, days);
        penalty +=
          PARAMS.financialPenaltyOverdueBase +
          Math.min(days * PARAMS.financialPenaltyOverduePerDay, PARAMS.financialPenaltyOverdueExtraCap);
      }
    }
  }
  const parts: string[] = [];
  if (overdue > 0) parts.push(`${overdue} fatura(s) em atraso (até ${Math.floor(maxOverdueDays)} dias)`);
  if (latePaid > 0) parts.push(`${latePaid} fatura(s) paga(s) com atraso`);
  if (parts.length === 0) parts.push("Faturas em dia");
  return {
    value: clamp(100 - penalty),
    detail: parts.join("; ") + ".",
    meta: { overdue, latePaid, maxOverdueDays },
  };
}

export function contract(data: AccountData, asOf: Date): DimensionOutput {
  const days = daysBetween(asOf, data.account.contractEnd);
  let value: number;
  let detail: string;
  if (days <= 0) {
    value = PARAMS.contractExpired;
    detail = "Contrato vencido sem renovação registrada.";
  } else if (days >= PARAMS.contractSafeDays) {
    value = 100;
    detail = `Renovação em ${Math.round(days)} dias.`;
  } else {
    value = PARAMS.contractFloor + (days / PARAMS.contractSafeDays) * (100 - PARAMS.contractFloor);
    detail = `Renovação em ${Math.round(days)} dias.`;
  }
  return { value, detail, meta: { daysToRenewal: days } };
}
