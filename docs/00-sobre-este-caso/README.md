# Episódio 0 — Sobre este caso

A Frota Leve é uma empresa fictícia de gestão de frotas, com 120 clientes e um time de CS de 3 pessoas que decide "quem contatar" de memória. Este episódio fixa o cenário e separa o que é real do que é simulado: pessoas, empresa e dados são inventados, as reuniões são simuladas e os números de uso, chamados, NPS e faturas saem de um gerador com semente fixa. Importa porque tudo o que vem depois (o score, a sensibilidade, os testes) vale para esse dado, e não para clientes reais.

| Documento | O que contém | Itens |
|---|---|---|
| [Sobre este caso](#sobre-este-caso) | O que é o Termômetro, o cenário da Frota Leve e a tabela "Real × simulado" | 8 linhas na tabela |
| [Dados sintéticos](dados-sinteticos.md) | Como o gerador cria as contas, a calibragem e o volume gerado | 8 arquétipos; 41.578 registros de uso, 504 chamados, 184 NPS, 805 faturas, 64 ações |

[← README](../../README.md) · [Índice](../INDEX.md) · [Episódio 1 →](../01-discovery/README.md)

---

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

## Como o discovery foi feito

O discovery tem seis registros simulados: três reuniões de discovery (líder de CS, CSM e uma persona de dono de transportadora), a validação de wireframes, a reunião de aceitação e a retrospectiva. Em cada um há pedidos vagos, que refinei em requisitos, e contradições: a líder quer um número só e o CSM quer contexto. A restrição que mais mudou o escopo foi a de 15 contatos por semana por CSM, que trouxe a urgência e tirou a integração com CRM. Tudo está em [Discovery](../01-discovery/README.md); os registros posteriores estão nos episódios 4, 5 e 6.

## Como ler

Comece pelo [README](../../README.md) e siga o [guia da série](../INDEX.md), que organiza a leitura em seis episódios e três trilhas (2, 10 e 30 minutos). Termos técnicos e siglas estão no [glossário](../GLOSSARIO.md).
