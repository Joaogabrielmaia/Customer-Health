# Ciclo de vida do Termômetro

Relatório do ciclo de vida do projeto, da descoberta do problema à evolução da versão 1.1.0. Cada página liga problema, requisito, decisão, implementação, teste e resultado, e remete aos documentos de origem em vez de copiá-los. Voltar ao [README](../../README.md) · [guia da série](../INDEX.md) · [glossário](../GLOSSARIO.md).

## Como ler as evidências

| Tipo | O que é | Exemplos |
|---|---|---|
| Observado | Confirmado no repositório ou em execução registrada, com commit e data | Código, testes, logs em `docs/05-qualidade/`, tags `v1.0.0` e `v1.1.0` |
| Planejamento do cenário | Calendário, sprints, cerimônias e atas elaborados para compor o estudo de caso | [Sprints](sprints/), [reuniões](reunioes/README.md) |
| Ilustrativo | Número ou análise apresentado só para exemplificar | Nenhum número de desempenho do negócio; os dados de uso são sintéticos |

A nota de contexto sobre a natureza do material está no [fim do README](../../README.md#nota-de-contexto-acadêmico).

## Documentos

| # | Documento | O que responde |
|---|---|---|
| 01 | [Visão e discovery](01-visao-e-discovery.md) | Qual é o problema, para quem e como o sucesso será julgado |
| 02 | [Planejamento e Scrum](02-planejamento-e-scrum.md) | Como o trabalho foi dividido em releases e sprints |
| 03 | [Requisitos e rastreabilidade](03-requisitos-e-rastreabilidade.md) | Como a necessidade virou requisito, regra, código e teste |
| 04 | [Arquitetura e ADRs](04-arquitetura-e-adrs.md) | Como o sistema é organizado e por que |
| 05 | [Modelo de dados](05-modelo-de-dados.md) | Entidades, dicionário, esquema estrela e o valor 1.355 |
| 06 | [Desenvolvimento e configuração](06-desenvolvimento-e-configuracao.md) | Branches, commits, versões e o que existe de automação |
| 07 | [Testes e qualidade](07-testes-e-qualidade.md) | O que foi testado, executado e o que não foi medido |
| 08 | [Implantação e operação](08-implantacao-e-operacao.md) | O que existe e o que seria preciso para operar |
| 09 | [Evolução e roadmap](09-evolucao-e-roadmap.md) | De v1.0.0 para v1.1.0 e o que vem depois |
| 10 | [Regras analíticas do score](10-regras-analiticas-do-score.md) | Como o score e a urgência são calculados |
| — | [Reuniões e solicitações](reunioes/README.md) · [Sprints](sprints/README.md) · [Diagramas](diagramas/README.md) | Registros de apoio |

## Linha do tempo

Calendário do cenário, em planejamento. As datas de sprint não correspondem às datas dos commits.

```mermaid
gantt
    title Calendário do cenário (planejamento do estudo de caso)
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    inclusiveEndDates
    todayMarker off
    section Preparação
    Discovery e brainstorm           :a1, 2026-09-07, 2026-09-11
    Definição e arquitetura          :a2, 2026-09-14, 2026-09-18
    section Release 1 (v1.0.0)
    Sprint 1 · motor do score        :s1, 2026-09-21, 2026-09-25
    Sprint 2 · fluxo do CS           :s2, 2026-09-28, 2026-10-02
    Sprint 3 · controle e prova      :s3, 2026-10-05, 2026-10-09
    Estabilização e aceitação        :r1, 2026-10-12, 2026-10-16
    section Release 2 (v1.1.0)
    Retrospectiva e refinamento      :b1, 2026-10-19, 2026-10-19
    Sprint 4 · alerta de queda       :s4, 2026-10-19, 2026-10-23
```

Marcos observados no Git:

```mermaid
timeline
    title Histórico Git (datas dos commits e tags)
    2026-10-23 : estrutura do projeto e documentos de definição
               : modelo de dados e gerador (RF-13)
               : motor do score (RF-03)
               : fluxo do CS, pesos, sensibilidade e exportação
               : testes de integração e E2E
               : tag v1.0.0
               : alerta de queda brusca (RF-14) e tag v1.1.0
    2026-10-24 : revalidação local com logs
               : reorganização da documentação em série
```

O histórico mostra a execução técnica concentrada em 2026-10-23; o calendário acima organiza o cenário e não pretende reconstruir essa cronologia.
