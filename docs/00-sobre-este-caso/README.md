# Sobre este caso

Sou o João Gabriel Maia da Costa, graduando em Engenharia de Software (PUC Minas). Este repositório é um estudo de caso completo: do discovery à entrega, com o objetivo de mostrar como eu penso um produto de Customer Success.

## O que é o Termômetro

Um painel que mostra a saúde de cada cliente de um SaaS (verde, amarelo e vermelho), **explica por que** ela está assim e **indica o que o time de CS deve fazer**. O diferencial é a transparência do modelo: o score é simples, documentado, configurável, testado e acompanhado de análise de sensibilidade.

## O caso: Frota Leve

"Frota Leve" é um SaaS **fictício** de gestão de frotas para pequenas transportadoras: rotas, abastecimento, manutenção, motoristas e relatórios. A carteira tem 120 clientes e o time de CS tem 3 pessoas (uma líder e três CSMs; a líder também administra o sistema).

## Regras de integridade que sigo neste repositório

| Regra | Como aparece aqui |
|---|---|
| Tudo é fictício | Pessoas, empresas e dados foram criados para o estudo, com nomes brasileiros comuns. Não há marcas nem pessoas reais. |
| Dados sintéticos | Uso, chamados, NPS e faturas vêm de um gerador com semente fixa: [dados-sinteticos.md](dados-sinteticos.md). |
| Reuniões simuladas | Toda reunião, entrevista ou validação foi **simulada**, com o Claude no papel do cliente e das demais pessoas. Cada registro começa com a nota: *Simulação: o Claude interpretou o cliente nesta conversa.* |
| Sem cliente real | Não existe cliente real, operação real nem ambiente de produção. |
| Score não é previsão | O score é uma **heurística**. Qualquer teste em dado sintético é rotulado como tal e nunca como acerto de churn. |
| Nada inventado | Resultados de testes, tempos e distribuições citados nos documentos foram executados e copiados da saída real. Ganhos esperados aparecem como **hipóteses**. |
| Sem hospedagem | Tudo roda local (Docker Compose para o banco). As provas são prints e documentos. |
| Sem segredos | `.env` fica fora do repositório; só `.env.example` é versionado. |

> Se eu tiver anotações de uma conversa real (com autorização de quem participou), elas substituem a simulação correspondente e o README é ajustado.

## Como ler

Comece pelo [README](../../README.md) e siga o roteiro de leitura de 7 passos. O [índice completo](../INDEX.md) lista todos os documentos.
