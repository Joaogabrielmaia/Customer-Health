# 01 · Plano de qualidade e resultados reais

Tudo abaixo foi executado na minha máquina (Windows 11, Node 24, PostgreSQL 16 em Docker) e copiado da saída dos comandos. Nada foi estimado.

## Estratégia

| Camada | Ferramenta | O que cobre |
|---|---|---|
| Unitário | Vitest | Cada dimensão (limites exatos, janelas, dado ausente), agregação, cores, urgência, explicação, validação Zod, gerador, sensibilidade, playbooks, CSV |
| Integração | Vitest + PostgreSQL real | Persistência sem perdas (score do banco = score do gerador), papéis, hash de senha, integridade referencial |
| E2E | Playwright (Chromium) | Fluxos completos: acesso, painel → conta → ação, configuração, exportação, sensibilidade, mobile |
| Estático | ESLint (`next/core-web-vitals`) e `tsc --noEmit` | Qualidade e tipos |
| Prints | Playwright (`@screenshots`) | 13 prints numerados em `docs/screenshots/` |

## Resultados da última execução (v1.0.0)

| Comando | Resultado |
|---|---|
| `npm run lint` | sem erros nem avisos |
| `npm run typecheck` | sem erros |
| `npm test` | **3 arquivos, 71 testes passando** (dimensions 34, engine 20, system 17) |
| `npm run test:integration` | **1 arquivo, 5 testes passando** |
| `npm run test:e2e` | **13 testes passando** (~1,5 min, incluindo o `build`) |
| `npm run screenshots` | 3 cenários passando, 13 imagens geradas |

Saída real do E2E:
```
✓  1 acesso › rota protegida redireciona para o login
✓  2 acesso › senha errada mostra erro e não entra
✓  3 acesso › API de exportação exige sessão
✓  4 fluxo principal do CS › painel → conta em risco → entender o porquê → registrar ação
✓  5 fluxo principal do CS › validação: nota curta é recusada
✓  6 fluxo principal do CS › filtro de contas críticas reduz a lista
✓  7 configuração de pesos › simular não grava; salvar aplica na hora e voltar ao padrão restaura
✓  8 configuração de pesos › limites invertidos são recusados
✓  9 configuração de pesos › CSM não consegue salvar
✓ 10 exportação e sensibilidade › CSV da carteira tem 120 contas e cabeçalho esperado
✓ 11 exportação e sensibilidade › tipo de exportação inválido devolve 400
✓ 12 exportação e sensibilidade › tela de sensibilidade lista cenários
✓ 13 mobile › painel não tem rolagem horizontal na página
13 passed (1.5m)
```

## Problemas que os testes e a execução revelaram (e como resolvi)

| # | O que apareceu | Como apareceu | Correção |
|---|---|---|---|
| 1 | Chamados do gerador com data **posterior** à data de referência | Teste unitário "nenhum evento é gerado depois da data de referência" falhou na primeira execução | Descartar chamados abertos depois do instante de referência (12h) |
| 2 | Todos os E2E falhando | Outro servidor já ocupava a porta 3000 e o Playwright reaproveitava esse servidor | Termômetro passou para a porta 3100 |
| 3 | 3 E2E falhando por seletor | `getByRole("alert")` achava também o anunciador de rotas do Next | Seletor específico `p[role=alert]` |
| 4 | Rosca cortada no primeiro print | Animação do gráfico em andamento durante a captura | Animações desligadas nos gráficos |
| 5 | Primeira distribuição: 0 contas vermelhas | `npm run distribution` | Calibragem dos arquétipos e dos limites (registrada) |

## Limites da cobertura
- Não medi **cobertura de linhas** com ferramenta; os números acima são contagem de testes, não percentual de cobertura.
- Os E2E rodam só em Chromium e só com dados sintéticos.
- Não há teste de carga: o desempenho está medido apenas em [desempenho](../04-arquitetura/05-desempenho.md).
- Acessibilidade: usei rótulos, `aria-label` e texto além da cor, mas **não** rodei auditoria automatizada (axe/Lighthouse); isso é lacuna conhecida.

## Como reproduzir
```bash
npm run db:up && npm run db:migrate && npm run db:seed
npm run lint && npm run typecheck && npm test && npm run test:integration
npm run test:e2e        # sobe build + servidor local na porta 3100
npm run screenshots
```
