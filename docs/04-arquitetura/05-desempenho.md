# 05 · Desempenho do painel

Medido de verdade com `npm run bench` (Node 24, Windows 11, máquina de desenvolvimento, sem banco: mede só o cálculo em memória sobre as 120 contas e 41.578 eventos de uso). Mediana de 10 execuções após aquecimento (5 na sensibilidade).

| Operação | Mediana | Máximo |
|---|---:|---:|
| Score da carteira (120 contas; hoje e 30 dias antes) | 106,1 ms | 167,0 ms |
| Tendência de 12 semanas (120 × 12 cálculos) | 795,5 ms | 874,8 ms |
| Sensibilidade (22 cenários × 120 contas × 2 cálculos) | 2.765,5 ms | 3.074,9 ms |

## Leitura
- O painel executivo faz o score da carteira **e** a tendência de 12 semanas, então o cálculo fica na faixa de ~0,9 s, mais o tempo de carregar dados do banco (cache de 30 s dos dados brutos). O **cálculo** cabe na meta de 2 s (RNF-01) no ambiente local com 120 contas. **Não medi** o tempo total de carregamento da página (banco + renderização no navegador) nem carteiras maiores.
- A tela de sensibilidade é a mais pesada (~2,8 s de cálculo). Aceitável para uma tela de análise que a líder abre raramente, mas não escalaria.

## Por que é lento onde é
Cada cálculo percorre os arrays de uso da conta (filtrando por data). A tendência repete isso 1.440 vezes. A otimização óbvia seria **indexar o uso por dia** (somas acumuladas) ou gravar snapshots (ADR-001/002).

## Quando agir
Acima de ~1.000 contas ou se a tendência passar de 2 s: (1) pré-agregar uso diário por conta e módulo; (2) snapshots semanais por conta; (3) mover a sensibilidade para um cálculo sob demanda com botão.
