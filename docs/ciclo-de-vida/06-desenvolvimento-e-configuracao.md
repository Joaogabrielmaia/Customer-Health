# 06 · Desenvolvimento e gerência de configuração

[Índice](README.md) · Anterior: [Modelo de dados](05-modelo-de-dados.md) · Próximo: [Testes e qualidade](07-testes-e-qualidade.md)

Esta página descreve o que existe no repositório. Onde um recurso não existe (integração contínua, por exemplo), isso está dito.

## Organização do código

| Área | Conteúdo | Regra de dependência |
|---|---|---|
| `src/lib/score` | Motor do score: dimensões, agregação, urgência, explicação, carteira, sensibilidade, alertas | Puro e tipado; não importa Prisma nem Next |
| `src/lib` | Acesso a dados (`data.ts`), leitura única para as telas (`scored.ts`), autenticação, CSV, playbooks | Usa o núcleo; é a única camada que fala com o Prisma |
| `src/app` | Páginas, Server Actions e rota de exportação | Usa `src/lib`; não calcula score |
| `src/components` | Componentes de interface | Sem regra de negócio |
| `scripts` | Gerador de dados, sensibilidade, benchmark, exportação para Power BI | Reutilizam o núcleo |
| `prisma` | Schema e migração | — |
| `tests` | Unitários, integração e ponta a ponta | — |

A separação em um núcleo puro é a decisão estrutural que mais pesa: o mesmo cálculo serve ao servidor, aos scripts e ao export de BI, e a v1.1.0 entrou pequena porque a variação de 30 dias já existia.

## Branches e pull requests

| Branch | Uso | Integração |
|---|---|---|
| `main` | Linha principal | Recebe merges |
| `feature/alerta-queda-brusca` | Entrega do RF-14 (v1.1.0) | Merge direto na `main` (commit `ede71b7`), sem pull request |
| `docs/apresentacao` | Reorganização da documentação em série | PR #1, mesclado |
| `docs/readme-venda` | Reescrita do README | PR #2, mesclado |
| `docs/ciclo-de-vida` | Este relatório | PR aberto para revisão |

Os merges de PR foram feitos pela mesma pessoa que abriu o PR; não há revisão independente registrada e não há regra de proteção de branch comprovada no repositório.

## Convenção de commits e versionamento

- **Commits:** Conventional Commits com o ID do requisito no escopo, por exemplo `feat(RF-03): motor do score com seis dimensões...` e `feat(RF-14): alerta de queda brusca...`. Isso liga o histórico à [rastreabilidade](../02-definicao/06-rastreabilidade.md).
- **Versões:** versionamento semântico. `v1.0.0` (12 commits no histórico até a tag) e `v1.1.0` (16). O [CHANGELOG](../../CHANGELOG.md) segue o formato Keep a Changelog, com uma seção "Não lançado" para a correção da porta do Playwright.
- **Releases no GitHub:** existem para `v1.0.0` e `v1.1.0`, com as notas do CHANGELOG.
- **Compatibilidade:** a v1.1.0 só acrescentou (página de alertas, banner e função de detecção). O schema não mudou: continua a única migração `init`.

## Revisão e critérios de merge

Os critérios usados são a [Definition of Done](02-planejamento-e-scrum.md#definition-of-done): testes passando, `lint` e `typecheck` sem erro, documentação afetada atualizada e commit citando o requisito. Não há automação que os imponha.

## Integração e entrega contínuas

**Não existem workflows de CI/CD**: o diretório `.github/workflows` não existe e a API do GitHub mostra 0 execuções de Actions no repositório. A verificação é local, pelos comandos do [CONTRIBUTING.md](../../CONTRIBUTING.md), e os resultados estão em [qualidade](../05-qualidade/README.md). Também não há deploy de aplicação.

## Ambientes, configuração e segredos

| Item | Situação |
|---|---|
| Ambiente | Local: Docker Compose para o PostgreSQL (porta 5440) e Next.js na porta 3100 (ou na definida por `PORT` nos testes E2E) |
| Configuração | `.env.example` versionado, `.env` ignorado pelo Git; variáveis `DATABASE_URL`, `AUTH_SECRET`, `REFERENCE_DATE` |
| Segredos | Nenhum segredo real versionado. O `.env.example` traz a credencial local de desenvolvimento do banco e um valor de exemplo para `AUTH_SECRET`. Varredura do histórico em 2026-10-24: nenhuma chave de API, chave privada ou URL de banco fora de localhost |
| Senha de demonstração | Vale só para os dados sintéticos locais, documentada no CONTRIBUTING.md |

## Dependências

Dependências de execução: Next.js 15, React 19, Prisma 6, `jose` (JWT), `bcryptjs`, Zod, Recharts. De desenvolvimento: TypeScript, ESLint, Vitest, Playwright, Tailwind. Versões travadas em `package-lock.json`. Não há automação de atualização nem varredura de vulnerabilidades de dependências.

## Histórico de mudanças relevantes

| Marco | Mudança |
|---|---|
| Estrutura e documentos de definição | Discovery, regras, histórias, backlog, riscos e ADRs antes do código |
| Dados e motor | Modelo de dados, gerador com semente fixa e motor do score (71 testes unitários) |
| Fluxo do CS | Login, painel, lista de risco, conta, playbooks e ação |
| Controle e prova | Pesos com simulação, sensibilidade, CSV, Power BI, integração e E2E |
| v1.1.0 | Alerta de queda brusca, página `/alertas`, banner, 5 testes unitários e 1 E2E |
| Pós-release | Correção da porta fixa do Playwright (`PORT`, padrão 3100) e reorganização da documentação |

## Dívida técnica

| Item | Impacto | Estratégia |
|---|---|---|
| Sem CI | Regressões só aparecem se alguém rodar os testes | Criar workflow com lint, tipos, testes e E2E sobre PostgreSQL de serviço |
| Cálculo da tendência e da sensibilidade recalcula tudo a cada acesso | Sensibilidade ≈ 2,8 s com 120 contas | Pré-agregação diária de uso e, depois, snapshots (ADR-001 e ADR-002) |
| Sem histórico de configurações | Não se sabe quem mudou os pesos e quando | Tabela versionada (roadmap v1.2) |
| Acessibilidade sem auditoria automatizada | Lacuna conhecida | Rodar axe ou Lighthouse e registrar |
| Tempo total de carregamento não medido | Só o cálculo foi medido | Medir no navegador |
| Playbook de inadimplência inexistente | A dimensão financeira não dispara roteiro | Item aberto do roadmap |

## Estratégia de refatoração

O núcleo puro é refatorado sob a proteção dos testes unitários (cada dimensão, limites exatos, dado ausente). Qualquer mudança no score atualiza juntos o código (`PARAMS`), as [regras de negócio](../02-definicao/02-regras-de-negocio.md), a [metodologia](../03-metodologia-do-score/README.md) e os testes, e regenera a sensibilidade.
