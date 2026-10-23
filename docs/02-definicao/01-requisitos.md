# 01 · Requisitos

## Requisitos funcionais

| ID | Requisito | Origem | Prioridade |
|---|---|---|---|
| RF-01 | Entrar com e-mail e senha; papéis **Admin** e **CSM** | Reunião 1 | Must |
| RF-02 | Painel executivo: carteira por cor, receita em risco, tendência de 12 semanas e comparação por segmento | Reunião 1 | Must |
| RF-03 | Score de saúde (0 a 100) por conta, com 6 dimensões e cor | Reunião 1 | Must |
| RF-04 | "Por que este score?": contribuição de cada dimensão e o que mudou em 30 dias | Reuniões 1 e 2 | Must |
| RF-05 | Contas em risco ordenadas por urgência, com filtros (cor, segmento, CSM, minhas contas) | Reunião 1 (restrição de 15 contatos) | Must |
| RF-06 | Visão da conta com linha do tempo (chamados, NPS, faturas, ações) | Reunião 2 | Must |
| RF-07 | Playbooks de CS (5 situações) com gatilho, passos, roteiro e modelo de mensagem | Reunião 2 | Must |
| RF-08 | Registrar ação do CS (canal, playbook, resultado, nota) | Reunião 2 | Must |
| RF-09 | Configurar pesos e limites de cor, com efeito imediato em todas as telas | Reunião 1 | Must |
| RF-10 | Simular uma configuração antes de salvar | Validação (reunião 4) | Should |
| RF-11 | Análise de sensibilidade em tela e em documento | Metodologia | Should |
| RF-12 | Exportar carteira, histórico e ações em CSV | Reunião 1 | Must |
| RF-13 | Gerador de dados sintéticos com semente fixa | Restrição do estudo | Must |
| RF-14 | Alerta de queda brusca de score (v1.1) | Retrospectiva | Could (entregue na v1.1) |

## Requisitos não funcionais

| ID | Requisito | Como verifico |
|---|---|---|
| RNF-01 | O painel deve abrir em tempo adequado ao uso diário com 120 contas (meta: abaixo de 2 s no ambiente local) | `npm run bench` e [desempenho](../04-arquitetura/05-desempenho.md) |
| RNF-02 | A cor nunca é a única informação (sempre há rótulo textual); campos com `label`; foco visível | Revisão manual + E2E por rótulos |
| RNF-03 | Telas utilizáveis em 390 px de largura sem rolagem horizontal da página | Teste E2E mobile + print |
| RNF-04 | Senhas com hash (bcrypt), sessão em cookie `httpOnly`, validação de entrada com Zod, nenhum segredo versionado | Testes de integração e E2E; `.gitignore` |
| RNF-05 | O cálculo do score é uma função pura, sem acesso a banco, testável isoladamente | Testes unitários |
| RNF-06 | Resultados reprodutíveis: mesma semente e data de referência geram os mesmos números | Teste do gerador |
| RNF-07 | Interface em português do Brasil; código e nomes técnicos em inglês | Revisão |

## Hipóteses de ganho (não medidas)
Nenhum ganho abaixo foi medido; são apostas a validar com dado real.

- **H-01.** Ordenar por urgência reduz o tempo que a líder gasta para decidir a lista de contatos da semana.
- **H-02.** Ver o "porquê" ao lado do número aumenta a confiança do CSM no painel e reduz discordâncias com a líder.
- **H-03.** Playbooks com roteiro reduzem o tempo de preparação de cada contato.
- **H-04.** Contatar contas amarelas antes da renovação reduz cancelamentos. *(Só testável com histórico real de cancelamentos.)*
