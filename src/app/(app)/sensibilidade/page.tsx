import { runSensitivity } from "@/lib/score/sensitivity";
import { getScoredPortfolio } from "@/lib/scored";

export const dynamic = "force-dynamic";

export default async function SensitivityPage() {
  const { portfolio, config, asOf } = await getScoredPortfolio();
  const rows = runSensitivity(portfolio.data, asOf, config);
  const base = rows[0];
  const total = base.counts.GREEN + base.counts.YELLOW + base.counts.RED;
  const worst = [...rows].slice(1).sort((a, b) => b.colorChanges - a.colorChanges)[0];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Análise de sensibilidade</h1>
        <p className="text-sm text-slate-600">
          Quanto o resultado muda quando os pesos ou os limites de cor mudam? Cada linha recalcula as {total} contas com a variação indicada e compara com a configuração atual.
          Os dados são sintéticos: isto mede a estabilidade do modelo, não acerto de churn.
        </p>
      </div>
      <p className="rounded-lg bg-slate-100 p-3 text-sm" data-testid="sensitivity-takeaway">
        Maior efeito neste cenário: <strong>{worst.label}</strong> muda a cor de <strong>{worst.colorChanges}</strong> conta(s) de {total}; a ordem das contas
        continua {worst.spearman >= 0.95 ? "praticamente a mesma" : "parcialmente diferente"} (correlação de Spearman {worst.spearman.toFixed(3).replace(".", ",")}).
      </p>
      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[760px] text-left" data-testid="sensitivity-table">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="th">Cenário</th><th className="th">Verdes</th><th className="th">Amarelas</th><th className="th">Vermelhas</th>
              <th className="th">Mudam de cor</th><th className="th">Spearman</th><th className="th">Top 15 mantidas</th><th className="th">Δ médio (pts)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className={r.id === "base" ? "bg-slate-50 font-semibold" : ""}>
                <td className="td">{r.label}</td>
                <td className="td">{r.counts.GREEN}</td><td className="td">{r.counts.YELLOW}</td><td className="td">{r.counts.RED}</td>
                <td className="td">{r.id === "base" ? "—" : r.colorChanges}</td>
                <td className="td">{r.spearman.toFixed(3).replace(".", ",")}</td>
                <td className="td">{r.top15Overlap}/15</td>
                <td className="td">{r.meanAbsDelta.toFixed(1).replace(".", ",")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-600">
        Spearman = correlação entre o ranking de scores do cenário e o da configuração atual (1 = mesma ordem). “Top 15 mantidas” = das 15 contas mais urgentes hoje, quantas seguem entre as 15 mais urgentes no cenário.
        Metodologia completa em docs/03-metodologia-do-score.
      </p>
    </div>
  );
}
