import { ConfigForm } from "@/components/ConfigForm";
import { requireSession } from "@/lib/auth";
import { scorePortfolio, countByColor } from "@/lib/score/portfolio";
import { getScoredPortfolio } from "@/lib/scored";
import { DEFAULT_CONFIG } from "@/lib/score/engine";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const session = await requireSession();
  const { config, portfolio, asOf } = await getScoredPortfolio();
  const scores = scorePortfolio(portfolio.data, asOf, config);
  const counts = countByColor(scores);
  const mrrAtRisk = scores.filter((s) => s.result.color === "RED").reduce((s, a) => s + a.mrr, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Configuração do score</h1>
        <p className="text-sm text-slate-600">
          Pesos das seis dimensões e limites das faixas. Os pesos são normalizados (só a proporção importa). “Simular” mostra o efeito sem salvar; “Salvar e aplicar” vale para todas as telas na hora.
        </p>
      </div>
      {session.role !== "ADMIN" && (
        <p role="note" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Somente administradores podem salvar. Você pode simular livremente.</p>
      )}
      <ConfigForm initial={config} defaults={DEFAULT_CONFIG} canSave={session.role === "ADMIN"} current={{ counts, mrrAtRisk }} />
    </div>
  );
}
