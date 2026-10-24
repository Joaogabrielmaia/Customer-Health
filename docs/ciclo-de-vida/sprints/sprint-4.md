# Sprint 4 · Alerta de queda brusca (v1.1.0)

[Sprints](README.md) · [Índice](../README.md) · Anterior: [Sprint 3](sprint-3.md)

**Período no cenário:** 19/10 a 23/10/2026. **Sprint Goal:** avisar quedas bruscas dentro do painel, sem serviço externo.

## Planning

Entrada: a [retrospectiva da v1.0.0](../../06-pos-lancamento/01-reuniao-de-retrospectiva.md), que escolheu três melhorias.

| Melhoria | Decisão | Motivo |
|---|---|---|
| M1 · Alerta de queda brusca (15+ pontos em 30 dias) | Entra na sprint | Responde à dor mais frequente, usa a variação de 30 dias que já existia e cabe em uma sprint |
| M2 · Histórico versionado de configurações | Roadmap | Exige nova tabela e tela |
| M3 · Zona cinzenta e selo de renovação | Roadmap | Pede decisões de modelo e de interface |

Item: RF-14, HU-12, RN-17.

## Critérios de conclusão

[Definition of Done](../02-planejamento-e-scrum.md#definition-of-done), mais: o banner do painel e a página de alertas mostram a mesma contagem.

## Review

Entregue: `detectSuddenDrops` (`src/lib/score/alerts.ts`), página `/alertas`, banner no painel e item de navegação, com 5 testes unitários, 1 E2E e 1 print novo. Na semente padrão, 19 contas disparam o alerta (2 ainda saudáveis), o que descreve o dado sintético e não o desempenho do alerta. Detalhe no [PR da v1.1](../../06-pos-lancamento/03-pr-v1.1-alerta-queda-brusca.md) e no [CHANGELOG](../../../CHANGELOG.md).

## Retrospectiva

Ver [retrospectiva final](../../06-pos-lancamento/04-retrospectiva-final.md): o núcleo puro do score tornou a v1.1 pequena; a pré-agregação de uso, a auditoria de acessibilidade e a medição do tempo total da página ficaram para depois.
