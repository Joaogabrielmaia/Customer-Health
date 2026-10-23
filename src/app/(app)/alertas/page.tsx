import Link from "next/link";
import { ColorBadge, Delta } from "@/components/ui";
import { brl, num1 } from "@/lib/format";
import { detectSuddenDrops, SUDDEN_DROP_POINTS } from "@/lib/score/alerts";
import { DIMENSION_LABEL } from "@/lib/score/types";
import { getScoredPortfolio } from "@/lib/scored";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const { portfolio, config, asOf, accounts } = await getScoredPortfolio();
  const drops = detectSuddenDrops(accounts, portfolio.data, asOf, config);
  const byId = new Map(accounts.map((a) => [a.id, a]));
  const mrr = drops.reduce((s, d) => s + (byId.get(d.id)?.mrr ?? 0), 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Alertas de queda brusca</h1>
        <p className="text-sm text-slate-600">
          Contas cujo score caiu {SUDDEN_DROP_POINTS} pontos ou mais nos últimos 30 dias, da maior queda para a menor. A queda é calculada com a configuração atual de pesos
          e pode vir de uma conta que ainda está verde: é um aviso de tendência, não de cor.
        </p>
      </div>
      <p className="text-sm text-slate-700" data-testid="alerts-summary">{drops.length} conta(s) em queda brusca · MRR somado {brl(mrr)}</p>
      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[760px] text-left" data-testid="alerts-table">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr><th className="th">Conta</th><th className="th">Antes → agora</th><th className="th">Queda</th><th className="th">Maior causa</th><th className="th">MRR</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {drops.map((d) => {
              const a = byId.get(d.id)!;
              return (
                <tr key={d.id}>
                  <td className="td"><Link href={`/contas/${d.id}`} className="font-medium underline-offset-2 hover:underline">{a.meta.name}</Link><div className="text-xs text-slate-600">{a.meta.segment} · {a.meta.csmName}</div></td>
                  <td className="td whitespace-nowrap">{num1(d.previousScore)} → <strong>{num1(d.currentScore)}</strong> <ColorBadge color={d.currentColor} /></td>
                  <td className="td"><Delta value={d.delta} /></td>
                  <td className="td">{DIMENSION_LABEL[d.mainDimension]} ({num1(d.mainDimensionDelta)} pts)</td>
                  <td className="td whitespace-nowrap">{brl(a.mrr)}</td>
                </tr>
              );
            })}
            {drops.length === 0 && <tr><td colSpan={5} className="td text-center text-slate-600">Nenhuma conta caiu {SUDDEN_DROP_POINTS} pontos ou mais no período.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
