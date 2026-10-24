# Episódio 5 — Qualidade

Rodei lint, tipos, testes unitários, de integração e E2E, e copiei a saída real para o documento de resultados. Na v1.1.0 são 76 testes unitários, 5 de integração e 14 E2E; a execução também achou um bug do gerador (chamados com data posterior à referência) e problemas de ambiente, todos registrados. A reunião simulada de aceitação aceitou o MVP para o escopo do estudo e deixou três itens para a evolução. Importa porque o documento diz também o que não foi medido: cobertura percentual, acessibilidade automatizada e carga.

| Documento | O que contém | Itens |
|---|---|---|
| [Plano e resultados](01-plano-e-resultados.md) | Estratégia por camada, resultados da v1.1.0 e da v1.0.0, problemas encontrados e limites da cobertura | 5 problemas registrados |
| [Reunião de aceitação](02-reuniao-de-aceitacao.md) | Roteiro, resultado por critério e ressalvas (reunião simulada) | 11 histórias aceitas |
| [Sprint 1](sprint-1-review.md) · [Sprint 2](sprint-2-review.md) · [Sprint 3](sprint-3-review.md) | Entrega e descobertas de cada sprint | 3 revisões |

## Logs da revalidação

Em 2026-10-24 reexecutei os comandos sobre o commit `ebbe1dd`, cujo código (`src`, `scripts`, `tests`, `prisma`) é idêntico ao da tag `v1.1.0`. Cada arquivo traz data, commit, versão do Node, comando e saída. Os registros antigos do plano de resultados não foram alterados.

| Comando | Resultado | Log |
|---|---|---|
| `npm run db:up` | saída 0 | [log](execucao-db-up-ebbe1dd.txt) |
| `npm run db:migrate` | saída 0 | [log](execucao-db-migrate-ebbe1dd.txt) |
| `npm run db:seed` | saída 0; 120 contas, 41.578 eventos de uso, 504 chamados, 184 NPS, 805 faturas, 64 ações | [log](execucao-db-seed-ebbe1dd.txt) |
| `npm run lint` | saída 0 | [log](execucao-lint-ebbe1dd.txt) |
| `npm run typecheck` | saída 0 | [log](execucao-typecheck-ebbe1dd.txt) |
| `npm test` | 4 arquivos, 76 testes passando | [log](execucao-test-ebbe1dd.txt) |
| `npm run test:integration` | 1 arquivo, 5 testes passando | [log](execucao-test-integration-ebbe1dd.txt) |
| `npm run test:e2e` | **não executou**: a porta 3100 estava ocupada por outro servidor local (`EADDRINUSE`) e o Playwright não subiu o servidor do projeto | [log](execucao-test-e2e-ebbe1dd.txt) |

Os 14 testes E2E da v1.1.0 seguem como registro em texto no [plano de resultados](01-plano-e-resultados.md), sem log arquivado. Não rodei `npm run screenshots` nem `npm run sensitivity`, porque os dois sobrescrevem evidências já versionadas.

[← Episódio 4](../04-arquitetura/README.md) · [Índice](../INDEX.md) · [Episódio 6 →](../06-pos-lancamento/README.md)
