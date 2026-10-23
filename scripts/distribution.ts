import { generateDataset } from "./seed/generate";
import { toAccountData } from "./seed/adapt";
import { scorePortfolio, countByColor } from "../src/lib/score/portfolio";
import { DEFAULT_CONFIG } from "../src/lib/score/engine";

const ds = generateDataset();
const scores = scorePortfolio(toAccountData(ds), ds.referenceDate, DEFAULT_CONFIG);
console.log("Linhas:", { usage: ds.usage.length, tickets: ds.tickets.length, nps: ds.nps.length, invoices: ds.invoices.length, actions: ds.actions.length });
console.log("Cores:", countByColor(scores));
const arche: Record<string, number[]> = {};
ds.accounts.forEach((a, i) => (arche[a.archetype] ??= []).push(scores[i].result.score));
for (const [k, v] of Object.entries(arche)) {
  console.log(k.padEnd(13), String(v.length).padStart(3), "média", (v.reduce((s, x) => s + x, 0) / v.length).toFixed(1));
}
const avg = scores.reduce((s, x) => s + x.result.score, 0) / scores.length;
console.log("Score médio:", avg.toFixed(1));
