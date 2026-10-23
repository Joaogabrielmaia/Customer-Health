import Link from "next/link";
import { PortfolioDonut, SegmentChart, TrendChart } from "@/components/Charts";
import { ColorBadge, Delta, Kpi } from "@/components/ui";
import { brl, dateBR, num1 } from "@/lib/format";
import { mainReason } from "@/lib/explain";
import { weeklyTrend, countByColor } from "@/lib/score/portfolio";
import { detectSuddenDrops, SUDDEN_DROP_POINTS } from "@/lib/score/alerts";
import { getScoredPortfolio, withUrgencyIndex } from "@/lib/scored";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { portfolio, config, asOf, accounts } = await getScoredPortfolio();
  const counts = countByColor(accounts);
  const total = accounts.length;
  const mrrTotal = accounts.reduce((s, a) => s + a.mrr, 0);
  const mrrRed = accounts.filter((a) => a.result.color === "RED").reduce((s, a) => s + a.mrr, 0);
  const mrrYellow = accounts.filter((a) => a.result.color === "YELLOW").reduce((s, a) => s + a.mrr, 0);
  const avg = accounts.reduce((s, a) => s + a.result.score, 0) / total;
  const trend = weeklyTrend(portfolio.data, asOf, config, 12);
  const first = trend[0];
  const last = trend[trend.length - 1];

  const segments = [...new Set(accounts.map((a) => a.meta.segment))].sort();
  const segmentData = segments.map((segment) => {
    const rows = accounts.filter((a) => a.meta.segment === segment);
    const c = countByColor(rows);
    return { segment, green: c.GREEN, yellow: c.YELLOW, red: c.RED, avg: rows.reduce((s, r) => s + r.result.score, 0) / rows.length, mrrRed: rows.filter((r) => r.result.color === "RED").reduce((s, r) => s + r.mrr, 0) };
  });
  const drops = detectSuddenDrops(accounts, portfolio.data, asOf, config);
  const top = withUrgencyIndex(accounts.filter((a) => a.result.color !== "GREEN")).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Painel executivo</h1>
          <p className="text-sm text-slate-600">Carteira de {total} contas em {dateBR(asOf)} (data de referência dos dados sintéticos).</p>
        </div>
        <div className="flex gap-2">
          <a className="btn-ghost" href="/api/export?tipo=carteira" download>Exportar carteira (CSV)</a>
          <a className="btn-ghost" href="/api/export?tipo=historico" download>Histórico semanal (CSV)</a>
        </div>
      </div>

      <Link href="/alertas" data-testid="drops-banner" className="block rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900 hover:bg-red-100">
        <strong>{drops.length}</strong> conta(s) com queda brusca de score (≥ {SUDDEN_DROP_POINTS} pontos em 30 dias). Ver alertas →
      </Link>

      <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Score médio" value={num1(avg)} hint={`Há 11 semanas: ${num1(first.avgScore)}`} />
        <Kpi label="Contas críticas" value={`${counts.RED} de ${total}`} tone="red" hint={`${counts.YELLOW} em atenção · ${counts.GREEN} saudáveis`} />
        <Kpi label="Receita em risco (críticas)" value={brl(mrrRed)} tone="red" hint={`${((mrrRed / mrrTotal) * 100).toFixed(1).replace(".", ",")}% do MRR de ${brl(mrrTotal)}`} />
        <Kpi label="Receita em atenção" value={brl(mrrYellow)} tone="amber" hint="MRR das contas amarelas" />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card" aria-labelledby="h-cart">
          <h2 id="h-cart" className="font-semibold">Carteira por cor</h2>
          <PortfolioDonut green={counts.GREEN} yellow={counts.YELLOW} red={counts.RED} />
        </section>
        <section className="card lg:col-span-2" aria-labelledby="h-trend">
          <h2 id="h-trend" className="font-semibold">Tendência: contas por cor nas últimas 12 semanas</h2>
          <p className="text-xs text-slate-600">Reconstruída a partir dos eventos datados, com a configuração atual de pesos. Críticas: {first.red} → {last.red}.</p>
          <TrendChart data={trend} />
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card lg:col-span-2" aria-labelledby="h-seg">
          <h2 id="h-seg" className="font-semibold">Comparação por segmento</h2>
          <SegmentChart data={segmentData} />
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr><th className="th">Segmento</th><th className="th">Contas</th><th className="th">Score médio</th><th className="th">MRR crítico</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {segmentData.map((s) => (
                  <tr key={s.segment}><td className="td font-medium">{s.segment}</td><td className="td">{s.green + s.yellow + s.red}</td><td className="td">{num1(s.avg)}</td><td className="td">{brl(s.mrrRed)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card" aria-labelledby="h-top">
          <h2 id="h-top" className="font-semibold">Mais urgentes agora</h2>
          <p className="mb-2 text-xs text-slate-600">Risco × valor × proximidade da renovação.</p>
          <ol className="space-y-3">
            {top.map((a) => (
              <li key={a.id} className="border-b border-slate-100 pb-2 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/contas/${a.id}`} className="font-medium text-slate-900 underline-offset-2 hover:underline">{a.meta.name}</Link>
                  <ColorBadge color={a.result.color} />
                </div>
                <p className="text-xs text-slate-600">Score {num1(a.result.score)} <Delta value={a.delta} /> · {brl(a.mrr)}/mês</p>
                <p className="text-xs text-slate-700">{mainReason(a.result)}</p>
              </li>
            ))}
          </ol>
          <Link href="/risco" className="btn mt-3 w-full">Ver todas as contas em risco</Link>
        </section>
      </div>
    </div>
  );
}
