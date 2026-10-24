# Sprint 1 · Fundação e motor do score

[Sprints](README.md) · [Índice](../README.md) · Próxima: [Sprint 2](sprint-2.md)

**Período no cenário:** 21/09 a 25/09/2026. **Sprint Goal:** ter um motor do score testado e um banco populado com dados reproduzíveis.

## Planning

| Item | Requisito | Regras | Por que entra agora |
|---|---|---|---|
| Gerador de dados sintéticos com semente fixa | RF-13 | RN-16 | Sem dados não há como testar nem demonstrar |
| Modelo de dados e migração inicial | RF-13 | — | Base do restante ([ADR-004](../../04-arquitetura/01-adrs.md)) |
| Motor do score: seis dimensões, dado ausente, cor, urgência, explicação | RF-03, RF-04 | RN-01 a RN-10, RN-13 | É o núcleo e precisa ser função pura (RNF-05) |
| Testes unitários do motor e do gerador | RF-03, RF-13 | — | Protegem as fórmulas antes da interface |

## Critérios de conclusão

Os da [Definition of Done](../02-planejamento-e-scrum.md#definition-of-done), mais: distribuição de cores utilizável para demonstrar o painel.

## Review

Entregue: estrutura do repositório, Docker Compose, schema Prisma e migração `init`, gerador determinístico e seed idempotente, motor do score e testes. Ao fim, 71 testes unitários passavam. Detalhe em [revisão da Sprint 1](../../05-qualidade/sprint-1-review.md).

## Retrospectiva

- A primeira geração deu 109 verdes, 11 amarelas e 0 vermelhas, inútil para demonstrar o painel. Os arquétipos foram calibrados e os limites padrão subiram para 75 e 50. O ajuste está registrado como calibragem, não como validação.
- Um teste unitário apontou um defeito do gerador (chamados abertos à tarde do dia de referência ficavam no futuro). Corrigido, e o teste permanece.
- Melhoria de processo: registrar toda calibragem de dados no momento em que ela ocorre.
