import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toCsv } from "@/lib/csv";
import { computeScore } from "@/lib/score/engine";
import { addDays } from "@/lib/score/dimensions";
import { getScoredPortfolio } from "@/lib/scored";
import { DIMENSIONS } from "@/lib/score/types";

export const dynamic = "force-dynamic";

const csvResponse = (name: string, body: string) =>
  new NextResponse(body, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}"` },
  });

export async function GET(req: Request) {
  const tipo = new URL(req.url).searchParams.get("tipo") ?? "carteira";
  const { portfolio, config, asOf, accounts } = await getScoredPortfolio();
  const day = asOf.toISOString().slice(0, 10);

  if (tipo === "carteira") {
    const headers = ["conta_id", "conta", "segmento", "plano", "veiculos", "cidade", "csm", "mrr", "score", "cor", "score_30d_atras", "variacao_30d", ...DIMENSIONS.map((d) => `dim_${d}`), "confianca", "dias_para_renovacao", "urgencia_brl"];
    const rows = accounts.map((a) => [
      a.id, a.meta.name, a.meta.segment, a.meta.plan, a.meta.vehicles, a.meta.city, a.meta.csmName, a.mrr,
      a.result.score, a.result.color, a.previousScore, a.delta,
      ...DIMENSIONS.map((d) => a.result.dimensions.find((x) => x.dimension === d)?.value ?? null),
      a.result.confidence, Math.round(a.daysToRenewal), Math.round(a.urgency),
    ]);
    return csvResponse(`termometro-carteira-${day}.csv`, toCsv(headers, rows));
  }

  if (tipo === "historico") {
    const weeks = 12;
    const headers = ["semana", "conta_id", "score", "cor"];
    const rows: (string | number)[][] = [];
    for (let w = weeks - 1; w >= 0; w--) {
      const date = addDays(asOf, -7 * w);
      for (const d of portfolio.data) {
        if (d.account.createdAt > date) continue;
        const r = computeScore(d, date, config);
        rows.push([date.toISOString().slice(0, 10), d.account.id, r.score, r.color]);
      }
    }
    return csvResponse(`termometro-historico-${day}.csv`, toCsv(headers, rows));
  }

  if (tipo === "acoes") {
    const actions = await prisma.csAction.findMany({ orderBy: { createdAt: "asc" }, include: { user: { select: { name: true } }, account: { select: { name: true } } } });
    const headers = ["acao_id", "data", "conta_id", "conta", "csm", "canal", "playbook", "resultado", "score_no_registro"];
    const rows = actions.map((a) => [a.id, a.createdAt.toISOString(), a.accountId, a.account.name, a.user.name, a.channel, a.playbook, a.outcome, a.scoreAtTime]);
    return csvResponse(`termometro-acoes-${day}.csv`, toCsv(headers, rows));
  }

  return NextResponse.json({ error: "Tipo inválido. Use carteira, historico ou acoes." }, { status: 400 });
}
