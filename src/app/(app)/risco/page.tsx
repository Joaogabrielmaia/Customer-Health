import Link from "next/link";
import { Bar, ColorBadge, Delta } from "@/components/ui";
import { brl, num1 } from "@/lib/format";
import { mainReason } from "@/lib/explain";
import { getScoredPortfolio, withUrgencyIndex } from "@/lib/scored";
import { getSession } from "@/lib/auth";
import type { HealthColor } from "@/lib/score/types";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ cor?: string; segmento?: string; csm?: string; minhas?: string }>;
}

export default async function RiskPage({ searchParams }: Props) {
  const sp = await searchParams;
  const session = await getSession();
  const { accounts } = await getScoredPortfolio();

  const colorFilter = sp.cor === "RED" || sp.cor === "YELLOW" ? (sp.cor as HealthColor) : undefined;
  const base = accounts.filter((a) => a.result.color !== "GREEN");
  const filtered = base.filter(
    (a) =>
      (!colorFilter || a.result.color === colorFilter) &&
      (!sp.segmento || a.meta.segment === sp.segmento) &&
      (!sp.csm || a.meta.csmId === sp.csm) &&
      (sp.minhas !== "1" || a.meta.csmId === session?.userId),
  );
  const rows = withUrgencyIndex(filtered);
  const segments = [...new Set(accounts.map((a) => a.meta.segment))].sort();
  const csms = [...new Map(accounts.map((a) => [a.meta.csmId, a.meta.csmName])).entries()];
  const mrr = rows.reduce((s, r) => s + r.mrr, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Contas em risco</h1>
        <p className="text-sm text-slate-600">
          Ordenadas por urgência = risco × valor (MRR) × proximidade da renovação. Mostra contas amarelas e vermelhas.
        </p>
      </div>

      <form method="get" className="card grid gap-3 sm:grid-cols-5" aria-label="Filtros">
        <div>
          <label htmlFor="cor" className="label">Cor</label>
          <select id="cor" name="cor" defaultValue={sp.cor ?? ""} className="input">
            <option value="">Amarelas e vermelhas</option>
            <option value="RED">Somente críticas</option>
            <option value="YELLOW">Somente atenção</option>
          </select>
        </div>
        <div>
          <label htmlFor="segmento" className="label">Segmento</label>
          <select id="segmento" name="segmento" defaultValue={sp.segmento ?? ""} className="input">
            <option value="">Todos</option>
            {segments.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="csm" className="label">CSM</label>
          <select id="csm" name="csm" defaultValue={sp.csm ?? ""} className="input">
            <option value="">Todos</option>
            {csms.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" name="minhas" value="1" defaultChecked={sp.minhas === "1"} /> Só minhas contas
        </label>
        <div className="flex items-end gap-2">
          <button className="btn">Filtrar</button>
          <Link href="/risco" className="btn-ghost">Limpar</Link>
        </div>
      </form>

      <p className="text-sm text-slate-700" data-testid="risk-summary">{rows.length} conta(s) · MRR somado {brl(mrr)}</p>

      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[820px] text-left" data-testid="risk-table">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="th">#</th><th className="th">Conta</th><th className="th">Score</th><th className="th">Principal motivo</th>
              <th className="th">MRR</th><th className="th">Renovação</th><th className="th">Urgência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((a, i) => (
              <tr key={a.id}>
                <td className="td text-slate-500">{i + 1}</td>
                <td className="td">
                  <Link href={`/contas/${a.id}`} className="font-medium underline-offset-2 hover:underline">{a.meta.name}</Link>
                  <div className="text-xs text-slate-600">{a.meta.segment} · {a.meta.csmName}</div>
                </td>
                <td className="td">
                  <div className="font-semibold">{num1(a.result.score)}</div>
                  <ColorBadge color={a.result.color} /> <Delta value={a.delta} />
                </td>
                <td className="td max-w-xs text-slate-700">{mainReason(a.result)}</td>
                <td className="td whitespace-nowrap">{brl(a.mrr)}</td>
                <td className="td whitespace-nowrap">{a.daysToRenewal <= 0 ? "Vencido" : `${Math.round(a.daysToRenewal)} dias`}</td>
                <td className="td w-32"><div className="mb-1 text-xs font-semibold">{a.urgencyIndex}</div><Bar value={a.urgencyIndex} color="#b91c1c" /></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="td text-center text-slate-600">Nenhuma conta com esses filtros.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
