/** Gera docs/03-metodologia-do-score/sensibilidade-resultados.md com números reais sobre os dados sintéticos. */
import { writeFileSync } from "node:fs";
import { generateDataset } from "./seed/generate";
import { toAccountData } from "./seed/adapt";
import { runSensitivity } from "../src/lib/score/sensitivity";
import { DEFAULT_CONFIG } from "../src/lib/score/engine";

const ds = generateDataset();
const rows = runSensitivity(toAccountData(ds), ds.referenceDate, DEFAULT_CONFIG);
const f = (n: number, d = 3) => n.toFixed(d).replace(".", ",");
const lines = [
  "# Resultados da análise de sensibilidade (gerado)",
  "",
  `> Gerado por \`npm run sensitivity\` em dados **sintéticos** (semente ${ds.seed}, referência ${ds.referenceDate.toISOString().slice(0, 10)}, ${ds.accounts.length} contas).`,
  "> Mede a estabilidade do modelo diante de mudanças de pesos e limites. **Não** mede acerto de churn.",
  "",
  "| Cenário | Verdes | Amarelas | Vermelhas | Mudam de cor | Spearman | Top 15 mantidas | Δ médio (pts) |",
  "|---|---:|---:|---:|---:|---:|---:|---:|",
  ...rows.map((r) => `| ${r.label} | ${r.counts.GREEN} | ${r.counts.YELLOW} | ${r.counts.RED} | ${r.id === "base" ? "—" : r.colorChanges} | ${f(r.spearman)} | ${r.top15Overlap}/15 | ${f(r.meanAbsDelta, 1)} |`),
  "",
];
writeFileSync("docs/03-metodologia-do-score/sensibilidade-resultados.md", lines.join("\n"));
console.log(lines.join("\n"));
