# Diagramas

[Índice](../README.md)

Os diagramas do ciclo de vida são escritos em Mermaid dentro das próprias páginas, onde o GitHub os renderiza. Esta pasta guarda a fonte editável (`.mmd`) e uma imagem exportada (`.png`) de cada um, gerados a partir dos blocos Mermaid do [README](../../../README.md) e das páginas do [ciclo de vida](../README.md). As imagens são renderizações dos diagramas, não capturas da interface do produto.

| Imagem | Fonte | O que mostra |
|---|---|---|
| ![Fases do ciclo de vida de Discovery a Evolução, com retorno da evolução aos requisitos](01-readme-1.png) | README | Fases do ciclo de vida e o laço de retrospectiva |
| ![Cadeia da necessidade ao requisito, história, regra, código, teste e evidência](02-readme-2.png) | README | Rastreabilidade em resumo |
| ![Navegador, aplicação Next.js, núcleo puro do score, PostgreSQL, gerador sintético e Power BI](03-readme-3.png) | README | Arquitetura em resumo |
| ![Entidades do banco: usuário, conta, contrato, uso, chamado, NPS, fatura e ação do CS](04-readme-4.png) | README | Modelo ER em resumo |
| ![Pipeline de dimensões, pesos, score, urgência, playbook e ação, com alerta de queda](05-readme-5.png) | README | Fluxo principal |
| ![Processo AS-IS por planilha e memória e processo TO-BE por score e urgência](06-01-visao-e-discovery-1.png) | [01 Visão](../01-visao-e-discovery.md) | Fluxo de negócio antes e depois |
| ![Product Goal, backlog, quatro sprints e duas releases](07-02-planejamento-e-scrum-1.png) | [02 Scrum](../02-planejamento-e-scrum.md) | Fluxo de planejamento |
| ![Necessidade, requisito, história, regra, implementação, teste e evidência](08-03-requisitos-e-rastreabilidade-1.png) | [03 Requisitos](../03-requisitos-e-rastreabilidade.md) | Cadeia de rastreabilidade |
| ![Contexto: CSM e Admin usam o Termômetro, que lê e grava no PostgreSQL e exporta CSV para o Power BI](09-04-arquitetura-e-adrs-1.png) | [04 Arquitetura](../04-arquitetura-e-adrs.md) | Contexto do sistema |
| ![Contêineres: navegador, middleware, páginas, ações, rota de exportação, núcleo do score, acesso a dados e banco](10-04-arquitetura-e-adrs-2.png) | [04 Arquitetura](../04-arquitetura-e-adrs.md) | Contêineres |
| ![Sequência de abrir a lista de risco e registrar uma ação](11-04-arquitetura-e-adrs-3.png) | [04 Arquitetura](../04-arquitetura-e-adrs.md) | Sequência do fluxo principal |
| ![Estados verde, amarela e vermelha e as transições pelos limites do score](12-04-arquitetura-e-adrs-4.png) | [04 Arquitetura](../04-arquitetura-e-adrs.md) | Estados da cor |
| ![Modelo entidade-relacionamento com atributos de cada tabela](13-05-modelo-de-dados-1.png) | [05 Modelo de dados](../05-modelo-de-dados.md) | Modelo ER |
| ![Esquema estrela do Power BI com dimensão de conta, dimensão de data e três fatos](14-05-modelo-de-dados-2.png) | [05 Modelo de dados](../05-modelo-de-dados.md) | Esquema estrela |
| ![Pirâmide de testes: ponta a ponta, integração, unitários e análise estática](15-07-testes-e-qualidade-1.png) | [07 Testes](../07-testes-e-qualidade.md) | Pirâmide de testes |
| ![Implantação planejada: usuários, entrada HTTPS, aplicação, banco gerenciado, logs e importador](16-08-implantacao-e-operacao-1.png) | [08 Implantação](../08-implantacao-e-operacao.md) | Arquitetura de implantação planejada |
| ![Roadmap de v1.0.0 a v2.0](17-09-evolucao-e-roadmap-1.png) | [09 Evolução](../09-evolucao-e-roadmap.md) | Roadmap |
| ![Fluxo do dado ao alerta: dimensões, pesos, score, cor, urgência, playbook e ação](18-10-regras-analiticas-do-score-1.png) | [10 Regras do score](../10-regras-analiticas-do-score.md) | Pipeline analítico |
| ![Calendário do cenário em barras: discovery, definição, quatro sprints e estabilização](19-ciclo-de-vida-1.png) | [Índice](../README.md) | Calendário do cenário (planejamento) |
| ![Marcos observados no Git em 23 e 24 de outubro de 2026](20-ciclo-de-vida-2.png) | [Índice](../README.md) | Histórico Git |

Para regenerar as imagens, renderize os blocos Mermaid das páginas com a ferramenta de sua preferência; as fontes `.mmd` desta pasta são as entradas.
