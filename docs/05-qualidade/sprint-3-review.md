# Sprint 3 · Revisão

**Foco:** controle, prova e documentação. **Requisitos:** RF-09 a RF-12, RNF-03.

## Entregue
- Configuração de pesos e limites com **simulação** e **efeito imediato** ao salvar (somente Admin salva).
- Análise de sensibilidade em tela (21 cenários mais o caso-base) e em documento gerado por script.
- Exportação CSV (carteira, histórico semanal, ações).
- Testes E2E (13, v1.0) e geração de 13 prints (v1.0, `00` a `12`), incluindo mobile.
- Export para Power BI e guia (`powerbi/`).
- Documentação do projeto.

## O que descobri
- A sensibilidade em tela leva ~2,8 s de cálculo; aceitável para uma tela de análise, mas é o primeiro lugar que quebraria com mais contas ([desempenho](../04-arquitetura/05-desempenho.md)).
- O resultado mais útil da análise não era o esperado: a **ordem** das contas é muito estável a mudanças de peso (Spearman ≥ 0,936), mas a **cor** é sensível aos limites (19 contas mudam com −5 pontos). Isso mudou minha recomendação de uso: priorizar pela ordem de urgência e tratar contas a ±5 pontos de uma fronteira como zona cinzenta.

## Resultado
Todos os testes passaram na execução final (ver [resultados](01-plano-e-resultados.md)).
