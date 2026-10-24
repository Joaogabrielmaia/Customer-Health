# Como rodar o projeto localmente

Pré-requisitos: Node 20+ e Docker (para o PostgreSQL).

```bash
git clone https://github.com/Joaogabrielmaia/Customer-Health.git
cd Customer-Health
npm install
cp .env.example .env          # defina AUTH_SECRET com um valor aleatório de 32+ caracteres
npm run db:up                 # PostgreSQL na porta 5440 (Docker Compose)
npm run db:migrate            # cria as tabelas
npm run db:seed               # gera os dados sintéticos (semente fixa)
npm run dev                   # abre em http://localhost:3100
```

Usuários fictícios, todos com a senha `Termometro@2026`, válida só para estes dados locais: `marcela@frotaleve.example` (Admin) e `rafael@frotaleve.example`, `camila@frotaleve.example`, `bruno@frotaleve.example` (CSM).

## Outros comandos

| Comando | Para quê |
|---|---|
| `npm run lint` e `npm run typecheck` | Verificação estática |
| `npm test` | Testes unitários |
| `npm run test:integration` | Integração, com o banco no ar e populado |
| `npm run test:e2e` | Testes de ponta a ponta com Playwright; a porta vem da variável `PORT` (padrão 3100) |
| `npm run sensitivity` | Regenera a análise de sensibilidade |
| `npm run bench` | Mede o tempo de cálculo |
| `npm run export:powerbi` | Gera os CSVs do Power BI |
| `npm run db:reset` | Recria banco e dados |

Ao mexer no score, atualize juntos `src/lib/score/dimensions.ts` (`PARAMS`), `docs/02-definicao/02-regras-de-negocio.md`, `docs/03-metodologia-do-score/README.md` e os testes, e rode `npm run sensitivity`.
