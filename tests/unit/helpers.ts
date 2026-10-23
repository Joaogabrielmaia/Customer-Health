import { DAY_MS } from "../../src/lib/score/dimensions";
import type { AccountData, InvoiceInput, NpsInput, TicketInput, UsageInput } from "../../src/lib/score/types";
import { MODULES } from "../../src/lib/score/types";

export const ASOF = new Date("2026-10-15T12:00:00Z");
export const daysAgo = (n: number): Date => new Date(ASOF.getTime() - n * DAY_MS);
export const daysAhead = (n: number): Date => new Date(ASOF.getTime() + n * DAY_MS);

export function account(overrides: Partial<AccountData> = {}): AccountData {
  return {
    account: { id: "t-1", mrr: 1000, createdAt: daysAgo(400), contractEnd: daysAhead(300) },
    usage: [],
    tickets: [],
    nps: [],
    invoices: [],
    ...overrides,
  };
}

/** Uso diário em `days` dias consecutivos, a partir de `startAgo` dias atrás, nos módulos dados. */
export function usageRun(opts: { modules: readonly string[]; fromDaysAgo: number; toDaysAgo: number; count?: number; everyNth?: number }): UsageInput[] {
  const out: UsageInput[] = [];
  for (let d = opts.fromDaysAgo; d >= opts.toDaysAgo; d--) {
    if (opts.everyNth && d % opts.everyNth !== 0) continue;
    for (const m of opts.modules) out.push({ date: daysAgo(d), module: m, count: opts.count ?? 1 });
  }
  return out;
}

export const ALL_MODULES = [...MODULES];

export const ticket = (openedDaysAgo: number, o: Partial<TicketInput> = {}): TicketInput => ({
  openedAt: daysAgo(openedDaysAgo),
  resolvedAt: daysAgo(openedDaysAgo - 1),
  category: "Relatórios",
  severity: "LOW",
  ...o,
});

export const nps = (daysAgoN: number, score: number): NpsInput => ({ date: daysAgo(daysAgoN), score });

export const invoice = (dueDaysAgo: number, paidAfterDays: number | null, amount = 1000): InvoiceInput => ({
  dueDate: daysAgo(dueDaysAgo),
  paidAt: paidAfterDays === null ? null : daysAgo(dueDaysAgo - paidAfterDays),
  amount,
});
