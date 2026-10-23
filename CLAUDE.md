# CLAUDE.md

Instruções para o Claude Code neste repositório (Termômetro, estudo de caso de Customer Success).

## Regras de integridade (não negociáveis)
- Tudo é **fictício**: pessoas, empresas e dados. Nada de marcas ou pessoas reais.
- Dados de uso, chamados, NPS e faturas são **sintéticos** (`scripts/seed`, semente fixa).
- Reuniões e entrevistas são **simuladas** e começam com: `> Simulação: o Claude interpretou o cliente nesta conversa.`
- Nunca afirmar que existe cliente real, operação real ou produção.
- O score é uma **heurística**. Nunca chamar de previsão comprovada. Teste em dado sintético é sempre rotulado como tal.
- Nunca inventar resultados de testes, medições ou bugs: rodar e registrar a saída real.
- **Sem deploy**: nenhum conteúdo de hospedagem, tutorial de publicação ou link de demonstração.
- Nenhum segredo no repositório (`.env` é ignorado; só `.env.example`).

## Estilo
- Documentação em português do Brasil, primeira pessoa (o autor explicando o que fez e por quê).
- Decisões: contexto, alternativas, escolha, motivo, trade-off, quando mudaria de ideia.
- Diagramas em Mermaid. Commits em Conventional Commits, citando IDs (`feat(RF-03): ...`).
- Código tipado; nomes em inglês no código, textos de interface em português.

## Comandos
```bash
npm run db:up && npm run db:migrate && npm run db:seed   # banco + dados
npm run dev            # http://localhost:3100
npm run lint && npm run typecheck && npm test
npm run test:integration   # exige banco no ar e populado
npm run test:e2e           # Playwright (build + start na 3100)
npm run screenshots        # regenera docs/screenshots
npm run sensitivity        # regenera docs/03-.../sensibilidade-resultados.md
npm run export:powerbi     # regenera powerbi/data
```

## Arquitetura em uma linha
`src/lib/score` é um núcleo **puro** (sem Prisma/Next); `src/lib/data.ts` lê do banco; as telas ficam em `src/app`. Ver `docs/04-arquitetura`.

## Ao mexer no score
Atualize juntos: `src/lib/score/dimensions.ts` (`PARAMS`), `docs/02-definicao/02-regras-de-negocio.md`, `docs/03-metodologia-do-score/README.md`, os testes e rode `npm run sensitivity`.
