"use client";

import { useState, useTransition } from "react";
import { previewConfig, saveConfig, type PreviewResult } from "@/app/actions";
import { brl } from "@/lib/format";
import { DIMENSIONS, DIMENSION_LABEL, type ScoreConfig } from "@/lib/score/types";

interface Props {
  initial: ScoreConfig;
  defaults: ScoreConfig;
  canSave: boolean;
  current: { counts: { GREEN: number; YELLOW: number; RED: number }; mrrAtRisk: number };
}

export function ConfigForm({ initial, defaults, canSave, current }: Props) {
  const [config, setConfig] = useState<ScoreConfig>(initial);
  const [result, setResult] = useState<(PreviewResult & { saved?: boolean }) | null>(null);
  const [pending, start] = useTransition();
  const total = DIMENSIONS.reduce((s, d) => s + config.weights[d], 0);

  const setWeight = (d: (typeof DIMENSIONS)[number], v: number) => setConfig((c) => ({ ...c, weights: { ...c.weights, [d]: v } }));
  const shown = result?.counts ? { counts: result.counts, mrrAtRisk: result.mrrAtRisk ?? 0 } : current;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <form className="card space-y-4 lg:col-span-2" onSubmit={(e) => e.preventDefault()} aria-label="Pesos e limites">
        <fieldset className="space-y-3">
          <legend className="font-semibold">Pesos das dimensões</legend>
          {DIMENSIONS.map((d) => (
            <div key={d} className="grid grid-cols-[110px_1fr_56px] items-center gap-3">
              <label htmlFor={`w-${d}`} className="text-sm font-medium">{DIMENSION_LABEL[d]}</label>
              <input id={`w-${d}`} type="range" min={0} max={50} step={1} value={config.weights[d]} onChange={(e) => setWeight(d, Number(e.target.value))} />
              <span className="text-right text-sm tabular-nums" data-testid={`share-${d}`}>{total > 0 ? Math.round((config.weights[d] / total) * 100) : 0}%</span>
            </div>
          ))}
        </fieldset>
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="font-semibold">Limites das faixas</legend>
          <div>
            <label htmlFor="t-green" className="label">Verde a partir de</label>
            <input id="t-green" type="number" min={2} max={99} className="input" value={config.thresholds.green} onChange={(e) => setConfig((c) => ({ ...c, thresholds: { ...c.thresholds, green: Number(e.target.value) } }))} />
          </div>
          <div>
            <label htmlFor="t-yellow" className="label">Amarelo a partir de</label>
            <input id="t-yellow" type="number" min={1} max={98} className="input" value={config.thresholds.yellow} onChange={(e) => setConfig((c) => ({ ...c, thresholds: { ...c.thresholds, yellow: Number(e.target.value) } }))} />
          </div>
        </fieldset>
        {result?.error && <p role="alert" className="text-sm font-medium text-red-700">{result.error}</p>}
        {result?.saved && <p role="status" className="text-sm font-medium text-green-700">Configuração salva e aplicada em todas as telas.</p>}
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" disabled={pending} onClick={() => start(async () => setResult(await previewConfig(config)))}>Simular</button>
          <button type="button" className="btn" disabled={pending || !canSave} onClick={() => start(async () => setResult(await saveConfig(config)))}>Salvar e aplicar</button>
          <button type="button" className="btn-ghost" onClick={() => { setConfig(defaults); setResult(null); }}>Voltar ao padrão</button>
        </div>
      </form>
      <aside className="card" aria-live="polite" data-testid="config-effect">
        <h2 className="font-semibold">{result?.counts ? (result.saved ? "Efeito aplicado" : "Efeito da simulação") : "Situação atual"}</h2>
        <dl className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between"><dt>Saudáveis</dt><dd data-testid="count-green" className="font-semibold text-green-700">{shown.counts.GREEN}</dd></div>
          <div className="flex justify-between"><dt>Atenção</dt><dd data-testid="count-yellow" className="font-semibold text-amber-700">{shown.counts.YELLOW}</dd></div>
          <div className="flex justify-between"><dt>Críticas</dt><dd data-testid="count-red" className="font-semibold text-red-700">{shown.counts.RED}</dd></div>
          <div className="flex justify-between border-t border-slate-200 pt-1"><dt>MRR crítico</dt><dd className="font-semibold">{brl(shown.mrrAtRisk)}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-slate-600">Mudar pesos não altera os dados, só a leitura deles. Documente a mudança e o motivo antes de aplicar.</p>
      </aside>
    </div>
  );
}
