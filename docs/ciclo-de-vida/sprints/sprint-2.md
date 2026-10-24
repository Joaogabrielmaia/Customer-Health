# Sprint 2 · Fluxo do CS

[Sprints](README.md) · [Índice](../README.md) · Anterior: [Sprint 1](sprint-1.md) · Próxima: [Sprint 3](sprint-3.md)

**Período no cenário:** 28/09 a 02/10/2026. **Sprint Goal:** percorrer o caminho painel → conta em risco → porquê → ação.

## Planning

| Item | Requisito | Histórias |
|---|---|---|
| Login com papéis Admin e CSM | RF-01 | HU-01 |
| Painel executivo | RF-02 | HU-02 |
| Contas em risco por urgência, com filtros | RF-05 | HU-03 |
| Visão da conta com "Por que este score?" e linha do tempo | RF-04, RF-06 | HU-04 |
| Playbooks (5) com mensagem pronta | RF-07 | HU-05 |
| Registro de ação do CS | RF-08 | HU-06 |

Critério de seleção: tudo o que o CSM precisa para sair da lista e chegar à ação, sem configuração.

## Critérios de conclusão

[Definition of Done](../02-planejamento-e-scrum.md#definition-of-done), mais: o fluxo completo funciona com os dados sintéticos e a nota curta é recusada na validação.

## Review

Entregue: login por e-mail e senha com cookie `httpOnly` e proteção por middleware, painel, lista de risco, visão da conta, biblioteca de playbooks e registro de ação. Testes de integração: 5 passando; build de produção compilando. Detalhe em [revisão da Sprint 2](../../05-qualidade/sprint-2-review.md).

## Retrospectiva

- O Next.js também usa `role="alert"` (anunciador de rotas), então o seletor dos testes E2E precisou ser específico.
- A porta 3000 estava ocupada por outro projeto; o Termômetro passou para a 3100.
- O primeiro print saiu com a rosca cortada por causa da animação; as animações dos gráficos foram desligadas.
- Melhoria de processo: tratar ambiente (porta, seletor) como fonte de falha de teste e registrar.
