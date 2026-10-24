# Sobre este caso

Este repositório é um estudo de caso completo, do discovery à entrega, sobre como acompanhar a saúde de uma carteira de clientes em um SaaS.

## O que é o Termômetro

Um painel que mostra a saúde de cada cliente de um SaaS (verde, amarelo e vermelho), **explica por que** ela está assim e **indica o que o time de CS deve fazer**. O diferencial é a transparência do modelo: o score é simples, documentado, configurável, testado e acompanhado de análise de sensibilidade.

## O caso: Frota Leve

"Frota Leve" é um SaaS **fictício** de gestão de frotas para pequenas transportadoras: rotas, abastecimento, manutenção, motoristas e relatórios. A carteira tem 120 clientes e o time de CS tem 3 pessoas (uma líder e três CSMs; a líder também administra o sistema).

## Real × simulado

| Item | Situação |
|---|---|
| Empresa, pessoas e clientes | Fictícios, com nomes brasileiros comuns. Não há marcas nem pessoas reais. |
| Dados de uso, chamados, NPS e faturas | Sintéticos, de um gerador com semente fixa: [dados-sinteticos.md](dados-sinteticos.md). |
| Reuniões, entrevistas e validações | Simuladas, com o Claude no papel das pessoas. Cada registro abre com a linha `Reunião simulada; pessoas e empresa fictícias.` |
| Operação | Não existe cliente real, operação real nem ambiente de produção. |
| Score | É uma **heurística**. Teste em dado sintético é rotulado como tal e nunca como acerto de churn. |
| Resultados de testes, tempos e distribuições | Executados e copiados da saída real. Ganhos esperados aparecem como **hipóteses**. |
| Execução | Local (Docker Compose para o banco). As provas são prints e documentos. |
| Segredos | `.env` fica fora do repositório; só `.env.example` é versionado. |

## Como ler

Comece pelo [README](../../README.md) e siga o [guia da série](../INDEX.md), que organiza a leitura em seis episódios e três trilhas (2, 10 e 30 minutos). Termos técnicos e siglas estão no [glossário](../GLOSSARIO.md).
