/** Mede o tempo real de cálculo do painel (em memória, sem banco) na máquina local. */
import { generateDataset } from "./seed/generate";
import { toAccountData } from "./seed/adapt";
import { scorePortfolio, weeklyTrend } from "../src/lib/score/portfolio";
import { runSensitivity } from "../src/lib/score/sensitivity";
import { DEFAULT_CONFIG } from "../src/lib/score/engine";

const ds = generateDataset();
const data = toAccountData(ds);
const time = (label: string, fn: () => void, runs = 10) => {
  fn(); // aquecimento
  const t: number[] = [];
  for (let i = 0; i < runs; i++) { const s = performance.now(); fn(); t.push(performance.now() - s); }
  t.sort((a, b) => a - b);
  console.log(`${label}: mediana ${t[Math.floor(runs / 2)].toFixed(1)} ms, máx ${t[runs - 1].toFixed(1)} ms (n=${runs})`);
};
console.log(`Contas: ${data.length}, eventos de uso: ${ds.usage.length}`);
time("Score da carteira (120 contas, hoje + 30d atrás)", () => scorePortfolio(data, ds.referenceDate, DEFAULT_CONFIG));
time("Tendência de 12 semanas", () => weeklyTrend(data, ds.referenceDate, DEFAULT_CONFIG, 12));
time("Sensibilidade (22 cenários)", () => runSensitivity(data, ds.referenceDate, DEFAULT_CONFIG), 5);
