"use client";

import { useActionState, useEffect, useRef } from "react";
import { registerAction, type FormState } from "@/app/actions";

export function ActionForm({ accountId, playbooks }: { accountId: string; playbooks: { slug: string; title: string }[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(registerAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="mt-2 space-y-3" aria-label="Registrar ação">
      <input type="hidden" name="accountId" value={accountId} />
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="channel" className="label">Canal</label>
          <select id="channel" name="channel" className="input" defaultValue="LIGACAO">
            <option value="LIGACAO">Ligação</option><option value="EMAIL">E-mail</option>
            <option value="WHATSAPP">WhatsApp</option><option value="REUNIAO">Reunião</option>
          </select>
        </div>
        <div>
          <label htmlFor="playbook" className="label">Playbook</label>
          <select id="playbook" name="playbook" className="input" defaultValue="">
            <option value="">Nenhum</option>
            {playbooks.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="outcome" className="label">Resultado</label>
          <select id="outcome" name="outcome" className="input" defaultValue="EM_ANDAMENTO">
            <option value="RESOLVIDO">Resolvido</option><option value="EM_ANDAMENTO">Em andamento</option>
            <option value="SEM_RESPOSTA">Sem resposta</option><option value="ESCALADO">Escalado</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="note" className="label">O que foi feito</label>
        <textarea id="note" name="note" rows={3} required minLength={5} maxLength={1000} className="input" placeholder="Ex.: Liguei para o responsável e combinei um treinamento na quinta." />
      </div>
      {state.error && <p role="alert" className="text-sm font-medium text-red-700">{state.error}</p>}
      {state.ok && <p role="status" className="text-sm font-medium text-green-700">{state.ok}</p>}
      <button type="submit" disabled={pending} className="btn">{pending ? "Salvando…" : "Registrar ação"}</button>
    </form>
  );
}
