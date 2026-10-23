import { PLAYBOOKS } from "@/lib/playbooks";

export default function PlaybooksPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Playbooks de CS</h1>
        <p className="text-sm text-slate-600">
          Cinco situações com gatilho objetivo, passos, roteiro de contato e modelo de mensagem. Na página de cada conta, aparecem só os playbooks disparados pelos dados dela.
        </p>
      </div>
      <nav aria-label="Atalhos" className="flex flex-wrap gap-2">
        {PLAYBOOKS.map((p) => <a key={p.slug} href={`#${p.slug}`} className="btn-ghost !py-1">{p.title}</a>)}
      </nav>
      {PLAYBOOKS.map((p) => (
        <article key={p.slug} id={p.slug} className="card scroll-mt-4 space-y-3">
          <h2 className="text-xl font-semibold">{p.title}</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="label">Gatilho</dt><dd>{p.trigger}</dd></div>
            <div><dt className="label">Objetivo</dt><dd>{p.goal}</dd></div>
          </dl>
          <div>
            <h3 className="label">Passos</h3>
            <ol className="list-decimal pl-5 text-sm text-slate-800">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          </div>
          <div>
            <h3 className="label">Roteiro de contato</h3>
            <ul className="list-disc pl-5 text-sm text-slate-800">{p.script.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-sm">
            <h3 className="label">Modelo de mensagem</h3>
            <p>{p.messageTemplate}</p>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="label">Como saber que funcionou</dt><dd>{p.successCriteria}</dd></div>
            <div><dt className="label">Quando escalar</dt><dd>{p.escalateWhen}</dd></div>
          </dl>
        </article>
      ))}
    </div>
  );
}
