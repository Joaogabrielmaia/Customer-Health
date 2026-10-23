/** Gera os CSVs do modelo Power BI em powerbi/data (dados sintéticos, sem banco). */
import { mkdirSync, writeFileSync } from "node:fs";
import { generateDataset } from "./seed/generate";
import { toAccountData } from "./seed/adapt";
import { computeScore, DEFAULT_CONFIG } from "../src/lib/score/engine";
import { scorePortfolio } from "../src/lib/score/portfolio";
import { addDays } from "../src/lib/score/dimensions";
import { toCsv } from "../src/lib/csv";
import { DIMENSIONS } from "../src/lib/score/types";

const ds = generateDataset();
const data = toAccountData(ds);
const out = "powerbi/data";
mkdirSync(out, { recursive: true });
const csm = new Map(ds.users.map((u) => [u.id, u.name]));
const day = (d: Date) => d.toISOString().slice(0, 10);
const write = (name: string, h: string[], rows: (string | number | null)[][]) => writeFileSync(`${out}/${name}`, toCsv(h, rows));

write("dim_conta.csv", ["conta_id", "conta", "segmento", "plano", "veiculos", "cidade", "csm", "mrr", "fim_contrato"],
  ds.accounts.map((a) => [a.id, a.name, a.segment, a.plan, a.vehicles, a.city, csm.get(a.csmId) ?? "", a.mrr, day(a.contractEnd)]));

const weeks = 12;
const hist: (string | number)[][] = [];
for (let w = weeks - 1; w >= 0; w--) {
  const date = addDays(ds.referenceDate, -7 * w);
  for (const d of data) {
    if (d.account.createdAt > date) continue;
    const r = computeScore(d, date, DEFAULT_CONFIG);
    hist.push([day(date), d.account.id, r.score, r.color, ...DIMENSIONS.map((k) => r.dimensions.find((x) => x.dimension === k)?.value ?? "")]);
  }
}
write("fato_score_semanal.csv", ["data", "conta_id", "score", "cor", ...DIMENSIONS.map((k) => `dim_${k}`)], hist);

const now = scorePortfolio(data, ds.referenceDate, DEFAULT_CONFIG);
write("fato_carteira_atual.csv", ["conta_id", "score", "cor", "variacao_30d", "dias_para_renovacao", "urgencia_brl"],
  now.map((s) => [s.id, s.result.score, s.result.color, s.delta, Math.round(s.daysToRenewal), Math.round(s.urgency)]));

write("fato_acoes.csv", ["data", "conta_id", "csm", "canal", "playbook", "resultado"],
  ds.actions.map((a) => [a.createdAt.toISOString(), a.accountId, csm.get(a.userId) ?? "", a.channel, a.playbook, a.outcome]));
console.log("CSVs gerados em", out, { score_semanal: hist.length, contas: ds.accounts.length, acoes: ds.actions.length });
