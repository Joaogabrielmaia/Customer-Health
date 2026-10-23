# Sprint 1 · Revisão

**Foco:** fundação e motor do score. **Requisitos:** RF-13, RF-03, RN-01 a RN-10.

## Entregue
- Estrutura do repositório, Docker Compose (PostgreSQL 16), schema Prisma e migração `init`.
- Gerador de dados sintéticos determinístico (`scripts/seed/generate.ts`) e *seed* idempotente.
- Motor do score como funções puras: seis dimensões, agregação com renormalização por dado ausente, cor por limites, urgência, explicação de mudança.
- Testes unitários do motor e do gerador.

## O que descobri (de verdade)
- A primeira execução do gerador deu **109 verdes, 11 amarelas e 0 vermelhas**. Inútil para demonstrar o painel. Calibrei os arquétipos (acrescentei o de churn iminente e multi-sintoma) e subi os limites padrão para 75/50. Registro em [dados-sintéticos.md](../00-sobre-este-caso/dados-sinteticos.md).
- Um teste unitário apontou um **bug no gerador**: chamados abertos à tarde do dia de referência ficavam no futuro (a referência é 12h). Corrigido.
- Erro de tipo no Prisma ao gravar `Thresholds` como JSON: trocado `interface` por `type`.

## Números
Ao fim da sprint: 71 testes unitários passando.

## Decisão para a sprint 2
Manter o cálculo em tempo real (ADR-001) e priorizar o fluxo de ponta a ponta antes de qualquer refinamento de modelo.
