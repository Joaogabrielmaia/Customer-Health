# Resultados da análise de sensibilidade (gerado)

> Gerado por `npm run sensitivity` em dados **sintéticos** (semente 20261015, referência 2026-10-15, 120 contas).
> Mede a estabilidade do modelo diante de mudanças de pesos e limites. **Não** mede acerto de churn.

| Cenário | Verdes | Amarelas | Vermelhas | Mudam de cor | Spearman | Top 15 mantidas | Δ médio (pts) |
|---|---:|---:|---:|---:|---:|---:|---:|
| Base (configuração atual) | 69 | 40 | 11 | — | 1,000 | 15/15 | 0,0 |
| Adoção +50% do peso | 73 | 34 | 13 | 6 | 0,992 | 14/15 | 1,6 |
| Adoção -50% do peso | 72 | 43 | 5 | 9 | 0,988 | 13/15 | 2,1 |
| Engajamento +50% do peso | 70 | 38 | 12 | 6 | 0,998 | 15/15 | 1,4 |
| Engajamento -50% do peso | 71 | 43 | 6 | 9 | 0,996 | 12/15 | 1,7 |
| Suporte +50% do peso | 70 | 44 | 6 | 6 | 0,996 | 13/15 | 1,2 |
| Suporte -50% do peso | 72 | 36 | 12 | 4 | 0,996 | 15/15 | 1,4 |
| Satisfação +50% do peso | 69 | 41 | 10 | 1 | 0,996 | 14/15 | 0,7 |
| Satisfação -50% do peso | 72 | 38 | 10 | 6 | 0,997 | 14/15 | 0,8 |
| Financeiro +50% do peso | 70 | 44 | 6 | 10 | 0,996 | 14/15 | 1,5 |
| Financeiro -50% do peso | 72 | 36 | 12 | 4 | 0,993 | 13/15 | 1,8 |
| Contrato +50% do peso | 72 | 40 | 8 | 8 | 0,997 | 13/15 | 1,0 |
| Contrato -50% do peso | 69 | 40 | 11 | 0 | 0,994 | 15/15 | 1,2 |
| Pesos iguais | 73 | 42 | 5 | 12 | 0,983 | 12/15 | 3,1 |
| Sem adoção (peso 0) | 77 | 38 | 5 | 14 | 0,936 | 12/15 | 4,9 |
| Sem engajamento (peso 0) | 72 | 43 | 5 | 15 | 0,968 | 10/15 | 3,9 |
| Sem suporte (peso 0) | 70 | 34 | 16 | 16 | 0,985 | 13/15 | 3,0 |
| Sem satisfação (peso 0) | 72 | 37 | 11 | 9 | 0,983 | 13/15 | 1,8 |
| Sem financeiro (peso 0) | 68 | 36 | 16 | 12 | 0,963 | 13/15 | 4,0 |
| Sem contrato (peso 0) | 68 | 39 | 13 | 7 | 0,982 | 14/15 | 2,5 |
| Limites de cor -5 pontos | 82 | 33 | 5 | 19 | 1,000 | 15/15 | 0,0 |
| Limites de cor +5 pontos | 61 | 45 | 14 | 11 | 1,000 | 15/15 | 0,0 |
