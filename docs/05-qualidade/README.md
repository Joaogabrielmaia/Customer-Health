# Episódio 5 — Qualidade

Rodei lint, tipos, testes unitários, de integração e E2E, e copiei a saída real para o documento de resultados. Na v1.1.0 são 76 testes unitários, 5 de integração e 14 E2E; a execução também achou um bug do gerador (chamados com data posterior à referência) e problemas de ambiente, todos registrados. A reunião simulada de aceitação aceitou o MVP para o escopo do estudo e deixou três itens para a evolução. Importa porque o documento diz também o que não foi medido: cobertura percentual, acessibilidade automatizada e carga.

| Documento | O que contém | Itens |
|---|---|---|
| [Plano e resultados](01-plano-e-resultados.md) | Estratégia por camada, resultados da v1.1.0 e da v1.0.0, problemas encontrados e limites da cobertura | 5 problemas registrados |
| [Reunião de aceitação](02-reuniao-de-aceitacao.md) | Roteiro, resultado por critério e ressalvas (reunião simulada) | 11 histórias aceitas |
| [Sprint 1](sprint-1-review.md) · [Sprint 2](sprint-2-review.md) · [Sprint 3](sprint-3-review.md) | Entrega e descobertas de cada sprint | 3 revisões |

## Logs da revalidação

Em 2026-10-24 reexecutei os comandos. O código (`src`, `scripts`, `tests`, `prisma`) é idêntico ao da tag `v1.1.0`; a única mudança de código está em `playwright.config.ts`, que passou a ler a porta de `PORT` (padrão 3100). Cada arquivo traz data, commit, versão do Node, comando e saída. Os registros antigos do plano de resultados não foram alterados.

| Comando | Resultado | Commit | Log |
|---|---|---|---|
| `npm run db:up` | saída 0 | `ebbe1dd` | [log](execucao-db-up-ebbe1dd.txt) |
| `npm run db:migrate` | saída 0 | `ebbe1dd` | [log](execucao-db-migrate-ebbe1dd.txt) |
| `npm run db:seed` | saída 0; 120 contas, 41.578 eventos de uso, 504 chamados, 184 NPS, 805 faturas, 64 ações | `ebbe1dd` | [log](execucao-db-seed-ebbe1dd.txt) |
| `npm run lint` | saída 0 | `d45b65c` | [log](execucao-lint-d45b65c.txt) |
| `npm run typecheck` | saída 0 | `d45b65c` | [log](execucao-typecheck-d45b65c.txt) |
| `npm test` | 4 arquivos, 76 testes passando | `d45b65c` | [log](execucao-test-d45b65c.txt) |
| `npm run test:integration` | 1 arquivo, 5 testes passando | `d45b65c` | [log](execucao-test-integration-d45b65c.txt) |
| `npm run test:e2e` (porta 3101) | 14 testes passando em 3,7 min | `4598c4c` | [log](execucao-e2e-4598c4c.txt) |

A primeira tentativa de E2E, no commit `ebbe1dd`, não executou: a porta 3100 estava ocupada por outro servidor local (`EADDRINUSE`) e o Playwright não subiu o servidor do projeto. O [log da falha](execucao-test-e2e-ebbe1dd.txt) foi mantido. A correção foi fazer a configuração do Playwright ler a porta de `PORT`, e a segunda tentativa usou `PORT=3101`.

Não rodei `npm run screenshots` nem `npm run sensitivity`, porque os dois sobrescrevem evidências já versionadas.

[← Episódio 4](../04-arquitetura/README.md) · [Índice](../INDEX.md) · [Episódio 6 →](../06-pos-lancamento/README.md)
