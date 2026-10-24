# Episódio 4 — Arquitetura

Aqui estão as escolhas que seguraram o projeto: calcular o score em tempo real em vez de em lote, reconstruir o histórico a partir de eventos datados e manter o cálculo como função pura, sem banco. Antes de implementar, desenhei os wireframes e os levei à reunião simulada de validação: 8 pedidos, dos quais 5 aceitos, 1 recusado, 1 adiado e 1 parcial. O recusado foi o "% de chance de cancelar", porque não há histórico para calibrar uma probabilidade; ofereci cor, score, motivo principal e urgência em reais. Importa porque a recusa e a alternativa estão registradas com a condição para mudar.

| Documento | O que contém | Itens |
|---|---|---|
| [ADRs](01-adrs.md) | Contexto, alternativas, escolha e trade-off de cada decisão | 6 ADRs |
| [Modelo ER](02-modelo-er.md) | Tabelas, campos, índices e decisões de modelagem | Modelo de dados completo |
| [Componentes](03-componentes.md) | Diagrama de componentes e a divisão do código | 1 diagrama |
| [Wireframes e validação](04-wireframes-e-validacao.md) | Três wireframes, pedidos da reunião simulada e a recusa justificada | 8 pedidos; 1 recusa |
| [Desempenho](05-desempenho.md) | Tempos medidos com `npm run bench` | 3 operações |

Sobre o desempenho: os tempos foram medidos localmente (Node 24, Windows 11, 120 contas, sem banco) e o documento não registra a data da medição. O cálculo da carteira levou 106,1 ms (mediana), o da tendência de 12 semanas, 795,5 ms, e o da sensibilidade, 2.765,5 ms. O tempo total de carregamento da página não foi medido.

[← Episódio 3](../03-metodologia-do-score/README.md) · [Índice](../INDEX.md) · [Episódio 5 →](../05-qualidade/README.md)
