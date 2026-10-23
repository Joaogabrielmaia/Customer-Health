import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/ActionForm";
import { CopyButton } from "@/components/CopyButton";
import { ScoreSparkline } from "@/components/Charts";
import { Bar, ColorBadge, Delta, ScoreDial, COLOR_HEX } from "@/components/ui";
import { prisma } from "@/lib/db";
import { changeSentences, topDrivers } from "@/lib/explain";
import { brl, dateBR, dateTimeBR, num1, signed } from "@/lib/format";
import { fillTemplate, recommendPlaybooks } from "@/lib/playbooks";
import { addDays } from "@/lib/score/dimensions";
import { computeScore, explainChange } from "@/lib/score/engine";
import { DIMENSION_LABEL } from "@/lib/score/types";
import { getScoredPortfolio } from "@/lib/scored";

export const dynamic = "force-dynamic";

const OUTCOME: Record<string, string> = { RESOLVIDO: "Resolvido", EM_ANDAMENTO: "Em andamento", SEM_RESPOSTA: "Sem resposta", ESCALADO: "Escalado" };
const CHANNEL: Record<string, string> = { LIGACAO: "Ligação", EMAIL: "E-mail", WHATSAPP: "WhatsApp", REUNIAO: "Reunião" };

interface TimelineItem { at: Date; kind: string; text: string; tone: "neutral" | "bad" | "good" }

export default async function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { portfolio, config, asOf, accounts } = await getScoredPortfolio();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx < 0) notFound();
  const scored = accounts[idx];
  const data = portfolio.data[idx];
  const meta = scored.meta;
  const explanation = explainChange(data, asOf, config);
  const result = explanation.current;
  const drivers = topDrivers(result, 2);
  const playbooks = recommendPlaybooks(result, scored.daysToRenewal);

  const [tickets, nps, invoices, actions] = await Promise.all([
    prisma.ticket.findMany({ where: { accountId: id, openedAt: { lte: asOf } }, orderBy: { openedAt: "desc" }, take: 12 }),
    prisma.npsResponse.findMany({ where: { accountId: id, date: { lte: asOf } }, orderBy: { date: "desc" }, take: 4 }),
    prisma.invoice.findMany({ where: { accountId: id, dueDate: { lte: asOf } }, orderBy: { dueDate: "desc" }, take: 6 }),
    prisma.csAction.findMany({ where: { accountId: id }, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true } } } }),
  ]);

  const timeline: TimelineItem[] = [
    ...tickets.map((t): TimelineItem => ({ at: t.openedAt, kind: "Chamado", tone: t.severity === "HIGH" ? "bad" : "neutral", text: `${t.title} (${t.category}, ${t.severity === "HIGH" ? "crítico" : t.severity === "MEDIUM" ? "médio" : "baixo"})${t.resolvedAt && t.resolvedAt <= asOf ? " · resolvido" : " · em aberto"}` })),
    ...nps.map((n): TimelineItem => ({ at: n.date, kind: "NPS", tone: n.score <= 6 ? "bad" : n.score >= 9 ? "good" : "neutral", text: `Nota ${n.score}` })),
    ...invoices.map((i): TimelineItem => {
      const paid = i.paidAt && i.paidAt <= asOf;
      const late = paid ? (i.paidAt!.getTime() - i.dueDate.getTime()) / 86_400_000 > 5 : true;
      return { at: i.dueDate, kind: "Fatura", tone: late ? "bad" : "good", text: `${brl(i.amount)} · ${paid ? (late ? "paga com atraso" : "paga em dia") : "em atraso"}` };
    }),
    ...actions.map((a): TimelineItem => ({ at: a.createdAt, kind: "Ação do CS", tone: "neutral", text: `${CHANNEL[a.channel]} por ${a.user.name}: ${a.note} (${OUTCOME[a.outcome]})` })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 24);

  const sparkline = Array.from({ length: 12 }, (_, i) => {
    const date = addDays(asOf, -7 * (11 - i));
    return { date: date.toISOString().slice(0, 10), score: data.account.createdAt > date ? 0 : computeScore(data, date, config).score };
  }).filter((p) => p.score > 0);

  const vars = { conta: meta.name, csm: meta.csmName, dias: scored.daysToRenewal };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/risco" className="text-sm text-slate-600 underline-offset-2 hover:underline">← Contas em risco</Link>
        <h1 className="mt-1 text-2xl font-bold">{meta.name}</h1>
        <p className="text-sm text-slate-600">{meta.segment} · {meta.city} · plano {meta.plan.replace("_", " ").toLowerCase()} · {meta.vehicles} veículos · {brl(meta.mrr)}/mês · CSM {meta.csmName}</p>
        <p className="text-sm text-slate-600">Contrato até {dateBR(meta.contractEnd)} ({scored.daysToRenewal <= 0 ? "vencido" : `${Math.round(scored.daysToRenewal)} dias`})</p>
      </div>

      <section className="card" aria-labelledby="h-score">
        <h2 id="h-score" className="sr-only">Score de saúde</h2>
        <div className="flex flex-wrap items-center gap-6">
          <ScoreDial score={result.score} color={result.color} />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3"><ColorBadge color={result.color} /><Delta value={explanation.delta} /><span className="text-sm text-slate-600">vs. 30 dias atrás ({num1(explanation.previous.score)})</span></div>
            {result.confidence === "BAIXA" && (
              <p role="note" className="rounded-lg bg-amber-50 p-2 text-sm text-amber-900">
                Confiança baixa: só {Math.round(result.availableShare * 100)}% do peso do score tem dado disponível. Trate o número com cautela.
              </p>
            )}
            <p className="text-sm text-slate-700">
              Urgência: <strong>{brl(scored.urgency)}</strong> ponderados (risco {(100 - result.score).toFixed(0)}% × MRR {brl(meta.mrr)} × proximidade da renovação).
            </p>
          </div>
          <div className="w-full sm:w-64"><p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Score nas últimas semanas</p><ScoreSparkline data={sparkline} /></div>
        </div>
      </section>

      <section className="card" aria-labelledby="h-why" data-testid="why-score">
        <h2 id="h-why" className="text-lg font-semibold">Por que este score?</h2>
        <p className="mb-3 text-sm text-slate-600">Cada dimensão vai de 0 a 100; a contribuição é quanto ela soma ao score final (valor × peso usado).</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead><tr><th className="th">Dimensão</th><th className="th">Valor</th><th className="th">Peso usado</th><th className="th">Contribuição</th><th className="th">Mudança em 30 dias</th><th className="th">O que o dado mostra</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {result.dimensions.map((d) => {
                const ch = explanation.changes.find((c) => c.dimension === d.dimension)!;
                return (
                  <tr key={d.dimension}>
                    <td className="td font-medium">{DIMENSION_LABEL[d.dimension]}</td>
                    <td className="td w-36">{d.value === null ? <span className="text-slate-500">sem dado</span> : (<><div className="text-sm font-semibold">{num1(d.value)}</div><Bar value={d.value} color={d.value >= config.thresholds.green ? COLOR_HEX.GREEN : d.value >= config.thresholds.yellow ? COLOR_HEX.YELLOW : COLOR_HEX.RED} /></>)}</td>
                    <td className="td">{Math.round(d.weightUsed * 100)}%</td>
                    <td className="td font-semibold">{num1(d.contribution)}</td>
                    <td className="td"><Delta value={ch.contributionDelta} /></td>
                    <td className="td text-slate-700">{d.detail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-3">
            <h3 className="text-sm font-semibold">O que mais puxa o score para baixo</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
              {drivers.map((d) => <li key={d.dimension}>{DIMENSION_LABEL[d.dimension]}: {d.detail}</li>)}
            </ul>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <h3 className="text-sm font-semibold">O que mudou desde o período anterior</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
              {changeSentences(explanation).map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="h-pb" data-testid="playbooks">
        <h2 id="h-pb" className="text-lg font-semibold">O que fazer agora</h2>
        {playbooks.length === 0 ? (
          <p className="text-sm text-slate-700">Nenhum playbook disparado. Mantenha o acompanhamento de rotina.</p>
        ) : (
          <div className="mt-2 space-y-4">
            {playbooks.map((p) => {
              const message = fillTemplate(p.messageTemplate, vars);
              return (
                <article key={p.slug} className="rounded-lg border border-slate-200 p-3">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-slate-600">{p.trigger}</p>
                  <p className="mt-1 text-sm"><strong>Objetivo:</strong> {p.goal}</p>
                  <ol className="mt-1 list-decimal pl-5 text-sm text-slate-700">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                  <div className="mt-2 rounded-lg bg-slate-50 p-2 text-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Modelo de mensagem</p><p>{message}</p><div className="mt-1"><CopyButton text={message} /></div></div>
                  <Link href={`/playbooks#${p.slug}`} className="mt-2 inline-block text-sm underline-offset-2 hover:underline">Ver roteiro de contato completo</Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card" aria-labelledby="h-act">
          <h2 id="h-act" className="text-lg font-semibold">Registrar ação do CS</h2>
          <ActionForm accountId={id} playbooks={playbooks.map((p) => ({ slug: p.slug, title: p.title }))} />
          <h3 className="mt-5 text-sm font-semibold">Ações registradas ({actions.length})</h3>
          <ul className="mt-2 space-y-2" data-testid="actions-list">
            {actions.map((a) => (
              <li key={a.id} className="rounded-lg border border-slate-200 p-2 text-sm">
                <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-600"><span>{dateTimeBR(a.createdAt)} · {CHANNEL[a.channel]} · {a.user.name}</span><span className="font-semibold">{OUTCOME[a.outcome]}</span></div>
                <p>{a.note}</p>
                {a.scoreAtTime !== null && <p className="text-xs text-slate-500">Score na hora do registro: {num1(a.scoreAtTime)}</p>}
              </li>
            ))}
            {actions.length === 0 && <li className="text-sm text-slate-600">Nenhuma ação registrada ainda.</li>}
          </ul>
        </section>

        <section className="card" aria-labelledby="h-tl">
          <h2 id="h-tl" className="text-lg font-semibold">Linha do tempo</h2>
          <ol className="mt-2 space-y-2 border-l-2 border-slate-200 pl-4">
            {timeline.map((t, i) => (
              <li key={i} className="relative text-sm">
                <span className="absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.tone === "bad" ? COLOR_HEX.RED : t.tone === "good" ? COLOR_HEX.GREEN : "#64748b" }} aria-hidden />
                <span className="text-xs text-slate-500">{dateBR(t.at)} · {t.kind}</span>
                <p className="text-slate-800">{t.text}</p>
              </li>
            ))}
            <li className="relative text-sm"><span className="absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-400" aria-hidden /><span className="text-xs text-slate-500">{dateBR(meta.contractEnd)} · Contrato</span><p>Fim do contrato vigente</p></li>
          </ol>
          <p className="mt-2 text-xs text-slate-500">Variação total do score no mês: {signed(explanation.delta)} ponto(s).</p>
        </section>
      </div>
    </div>
  );
}
