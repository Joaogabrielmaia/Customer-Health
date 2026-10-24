# Dados sintéticos

## Contexto
Não tenho acesso a dados reais de clientes, e usar dados de terceiros seria inadequado. Mesmo assim o painel precisa de uma carteira com histórico para ser avaliado.

## Alternativas
1. **Planilha preenchida à mão.** Rápida, mas não reproduzível e sem volume para testar desempenho.
2. **Dataset público de churn.** Seria real, mas de outro domínio (telecom/banco); o score precisa de eventos de uso por módulo, chamados, NPS e faturas.
3. **Gerador determinístico com semente fixa.** Reproduzível, documentado, com volume e com casos de borda de propósito.

## Escolha
Gerador em [`scripts/seed/generate.ts`](../../scripts/seed/generate.ts): função pura `generateDataset(seed, referenceDate)`, PRNG mulberry32 e semente padrão `20261015`.

## Motivo
Reprodutibilidade (mesmo resultado na minha máquina e na sua), testabilidade (os testes usam o mesmo gerador) e controle dos casos de borda (conta nova, NPS ausente, fatura vencida).

## Como os dados são construídos
Cada conta recebe um **arquétipo**, que define o comportamento de uso, chamados, NPS e pagamento:

| Arquétipo | Peso na carteira | Comportamento |
|---|---:|---|
| saudável | 46% | 4–5 módulos, uso diário em dias úteis, NPS ~9, paga em dia |
| em queda | 14% | uso cai de forma progressiva nas últimas semanas, NPS antigo melhor que o atual |
| baixa adoção | 10% | 1–2 módulos, uso esparso |
| muitos chamados | 8% | ~3,4 chamados/mês, categoria repetida, alguns críticos lentos |
| insatisfeito | 7% | NPS ~4, uso reduzido, mais chamados |
| mau pagador | 7% | 80% das faturas com 6–30 dias de atraso |
| conta nova | 3% | menos de 30 dias de casa (testa "dado ausente") |
| churn iminente | 5% | vários sintomas ao mesmo tempo |

Tamanho: 120 contas, 3 CSMs (distribuição em rodízio), planos Básico / Profissional / Frota+, quatro segmentos (Cargas secas, Entregas urbanas, Frigorificados, Fretamento). O MRR de cada conta é `base do plano + R$ 12 × veículos`.

Volume gerado (semente padrão, saída real de `npm run distribution`): **41.578** registros de uso diário por módulo, **504** chamados, **184** respostas de NPS, **805** faturas e **64** ações de CS.

A data de referência (o "hoje" do estudo) é `2026-10-15`, definida por `REFERENCE_DATE`. Ela é fixa para que os prints e números do repositório sejam reproduzíveis.

## Trade-off
Os arquétipos são **minha hipótese** sobre como contas boas e ruins se comportam. Por isso, o fato de o score separar bem esses arquétipos **não valida o modelo**: o dado foi desenhado para ter esses sintomas. A distribuição foi calibrada por mim (ver abaixo) e isso é registrado para não passar por descoberta.

## Calibragem (registro honesto)
Na primeira execução, 109 de 120 contas ficaram verdes e nenhuma vermelha, o que não serviria para demonstrar o painel. Fiz duas mudanças: tornei os arquétipos problemáticos multi-sintoma (adicionei "churn iminente" e aprofundei quedas de uso) e subi os limites padrão de 70/45 para 75/50. Resultado final: **69 verdes, 40 amarelas e 11 vermelhas**. Essa calibragem está no histórico do Git.

Um teste unitário ([`tests/unit/system.test.ts`](../../tests/unit/system.test.ts)) também pegou um bug do gerador: chamados abertos à tarde do dia de referência ficavam no futuro. Corrigi e o teste permanece.

## Quando eu mudaria de ideia
Se a empresa me der uma exportação real e anonimizada, troco o gerador por um importador e recalibro pesos e limites com histórico de cancelamentos.

## Como regenerar
```bash
npm run db:up      # sobe o PostgreSQL
npm run db:migrate # aplica as migrações
npm run db:seed    # limpa e recria os dados (idempotente)
```
Senha de demonstração dos usuários fictícios: ver o [README](../../README.md#rodar-localmente).
