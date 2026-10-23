import type { AccountData } from "../../src/lib/score/types";
import type { Dataset } from "./generate";

/** Converte o dataset sintético (em memória) para o formato que o motor do score consome. */
export function toAccountData(ds: Dataset): AccountData[] {
  const by = <T extends { accountId: string }>(rows: T[]): Map<string, T[]> => {
    const m = new Map<string, T[]>();
    for (const r of rows) {
      const list = m.get(r.accountId);
      if (list) list.push(r);
      else m.set(r.accountId, [r]);
    }
    return m;
  };
  const usage = by(ds.usage), tickets = by(ds.tickets), nps = by(ds.nps), invoices = by(ds.invoices);
  return ds.accounts.map((a) => ({
    account: { id: a.id, mrr: a.mrr, createdAt: a.createdAt, contractEnd: a.contractEnd },
    usage: (usage.get(a.id) ?? []).map((u) => ({ date: u.date, module: u.module, count: u.count })),
    tickets: (tickets.get(a.id) ?? []).map((t) => ({ openedAt: t.openedAt, resolvedAt: t.resolvedAt, category: t.category, severity: t.severity })),
    nps: (nps.get(a.id) ?? []).map((n) => ({ date: n.date, score: n.score })),
    invoices: (invoices.get(a.id) ?? []).map((i) => ({ dueDate: i.dueDate, paidAt: i.paidAt, amount: i.amount })),
  }));
}
