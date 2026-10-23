# 01 · Brainstorm e decisão

## Contexto
A Frota Leve perde clientes pequenos sem aviso: o cliente para de usar, e o CS só descobre no cancelamento ou na renovação. Preciso escolher **uma** ideia para construir em 3 sprints.

## Alternativas

| # | Ideia | O que resolve | Risco principal |
|---|---|---|---|
| A | **Painel de saúde de clientes** | Dá visibilidade e prioridade ao time de CS | Número sem contexto vira "caixa-preta" |
| B | Onboarding guiado | Reduz abandono nos primeiros 30 dias | Só ataca contas novas |
| C | Pesquisa de NPS recorrente | Mede satisfação | Taxa de resposta baixa e dado trimestral (lento) |
| D | Alertas de uso (e-mail/push) | Aviso rápido de queda | Ruído: muitos alertas sem prioridade |
| E | QBR automatizado | Material de reunião por conta | Só ajuda quem já está sendo acompanhado |

## Matriz de decisão
Notas de 1 a 5 (5 = melhor). Os pesos saem do problema: visibilidade pesa mais porque é a causa raiz. A matriz é uma ferramenta de raciocínio, não uma medição.

| Critério | Peso | A Painel | B Onboarding | C NPS | D Alertas | E QBR |
|---|---:|---:|---:|---:|---:|---:|
| Ataca a causa raiz (falta de visibilidade) | 5 | 5 | 2 | 2 | 4 | 2 |
| Cobre toda a carteira, não só contas novas | 4 | 5 | 2 | 4 | 5 | 3 |
| Cabe em 3 sprints com 1 pessoa | 3 | 4 | 3 | 4 | 3 | 3 |
| Dá a próxima ação ao CSM | 4 | 4 | 3 | 2 | 3 | 3 |
| Usa dados que a empresa já tem | 3 | 4 | 3 | 2 | 5 | 4 |
| **Total ponderado** | | **85** | 48 | 52 | 76 | 55 |

Conta do painel: 5×5 + 5×4 + 4×3 + 4×4 + 4×3 = 25 + 20 + 12 + 16 + 12 = 85.

## Escolha
**A (painel de saúde)**, incorporando de D e E o que couber como evolução: o alerta de queda brusca virou a v1.1 e o relatório de QBR por conta ficou no roadmap. O NPS (C) entra como **uma das dimensões** do score.

## Motivo
O painel é a única ideia que ataca a causa (falta de visibilidade) para toda a carteira. As outras quatro funcionam melhor como componentes dele. O alerta (D) ficou em segundo lugar, mas sem priorização gera ruído.

## Trade-off
Um painel sozinho não reduz cancelamento: ele só ajuda **se** o CSM agir. Por isso o escopo inclui playbooks e registro de ações, não só o número. Ganho esperado (hipótese, não medido): o time passa a contatar primeiro as contas com mais risco e valor.

## Quando eu mudaria de ideia
Se a análise mostrasse que a maior parte dos cancelamentos ocorre nos primeiros 30 dias, eu começaria pelo onboarding guiado (B).
