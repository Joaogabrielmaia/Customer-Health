# Sprint 3 · Controle, prova e documentação

[Sprints](README.md) · [Índice](../README.md) · Anterior: [Sprint 2](sprint-2.md) · Próxima: [Sprint 4](sprint-4.md)

**Período no cenário:** 05/10 a 09/10/2026. **Sprint Goal:** dar controle (pesos) e prova (sensibilidade, testes ponta a ponta) ao MVP.

## Planning

| Item | Requisito | Histórias |
|---|---|---|
| Configuração de pesos e limites, com simulação | RF-09, RF-10 | HU-07 |
| Análise de sensibilidade em tela e em documento | RF-11 | HU-08 |
| Exportação CSV | RF-12 | HU-09 |
| Layout em 390 px | RNF-03 | HU-10 |
| Testes E2E, prints e dados para Power BI | — | — |

## Critérios de conclusão

[Definition of Done](../02-planejamento-e-scrum.md#definition-of-done), mais: simular não grava, só Admin salva, limites inválidos são recusados e a página não rola na horizontal em 390 px.

## Review

Entregue: pesos com simulação e efeito imediato, sensibilidade em tela, CSV (carteira, histórico semanal, ações), E2E (13 na v1.0.0), 13 prints, export para Power BI e documentação. A [reunião de aceitação](../../05-qualidade/02-reuniao-de-aceitacao.md) aceitou as histórias HU-01 a HU-11. Detalhe em [revisão da Sprint 3](../../05-qualidade/sprint-3-review.md).

## Retrospectiva

- A sensibilidade em tela leva cerca de 2,8 s de cálculo: aceitável para uma tela de análise, mas é o primeiro ponto que quebraria com mais contas.
- O resultado mais útil não era o esperado: a ordem das contas é estável (Spearman a partir de 0,936), mas a cor depende dos limites (19 contas mudam com −5 pontos). A recomendação passou a ser priorizar pela urgência.
- Melhoria de processo: rodar o seed antes de cada rodada de E2E e de prints, porque os testes gravam ações e alteram a configuração.
