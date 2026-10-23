# 06 · Rastreabilidade

Do pedido ao teste e à tela. Os testes citados existem e rodam (ver [resultados](../05-qualidade/01-plano-e-resultados.md)).

| Requisito | História | Regras | Onde está o código | Teste automatizado | Print |
|---|---|---|---|---|---|
| RF-01 | HU-01 | RN-14 | `src/app/actions.ts`, `src/middleware.ts`, `src/lib/auth.ts` | E2E "acesso" (3 testes); integração "papéis" | [00](../screenshots/00-login.png) |
| RF-02 | HU-02 | RN-10 | `src/app/(app)/page.tsx`, `src/lib/score/portfolio.ts` | unit "tendência semanal"; E2E "fluxo principal" | [01](../screenshots/01-painel-executivo.png) |
| RF-03 | HU-04 | RN-01 a RN-10 | `src/lib/score/dimensions.ts`, `engine.ts` | `dimensions.test.ts` (34), `engine.test.ts` (20) | [04](../screenshots/04-explicacao-do-score.png) |
| RF-04 | HU-04 | RN-13 | `explainChange` em `engine.ts`, `src/lib/explain.ts` | unit "explicação: o que mudou" | [04](../screenshots/04-explicacao-do-score.png) |
| RF-05 | HU-03 | RN-11 | `src/app/(app)/risco/page.tsx`, `urgency` | unit "urgência"; E2E "filtro de contas críticas" | [02](../screenshots/02-contas-em-risco.png) |
| RF-06 | HU-04 | — | `src/app/(app)/contas/[id]/page.tsx` | E2E "fluxo principal" | [03](../screenshots/03-visao-da-conta.png) |
| RF-07 | HU-05 | RN-12 | `src/lib/playbooks.ts`, `playbooks/page.tsx` | unit "playbooks" (6 testes) | [05](../screenshots/05-playbook-na-conta.png), [06](../screenshots/06-playbooks.png) |
| RF-08 | HU-06 | RN-15 | `registerAction` em `actions.ts`, `ActionForm.tsx` | E2E "registrar ação", "nota curta"; integração "ação do CS" | [07](../screenshots/07-registro-de-acao.png) |
| RF-09 | HU-07 | RN-14 | `saveConfig`, `ConfigForm.tsx`, `configSchema` | unit "validação"; E2E "configuração de pesos" (3) | [08](../screenshots/08-configuracao-de-pesos.png) |
| RF-10 | HU-07 | RN-14 | `previewConfig` | E2E "simular não grava" | [08](../screenshots/08-configuracao-de-pesos.png) |
| RF-11 | HU-08 | — | `src/lib/score/sensitivity.ts`, `sensibilidade/page.tsx`, `scripts/sensitivity.ts` | unit "sensibilidade"; E2E "tela de sensibilidade" | [09](../screenshots/09-sensibilidade.png) |
| RF-12 | HU-09 | — | `src/app/api/export/route.ts`, `src/lib/csv.ts` | unit "CSV"; E2E exportação (3) | [10](../screenshots/10-exportacao-csv.png) |
| RF-13 | HU-11 | RN-16 | `scripts/seed/*` | unit "gerador sintético" (6); integração (persistência) | — |
| RNF-03 | HU-10 | — | layout responsivo (Tailwind) | E2E "mobile" | [11](../screenshots/11-mobile-painel.png), [12](../screenshots/12-mobile-conta.png) |
