# Glossário

Termos e siglas usados no Termômetro, com uma linha cada e o lugar onde aparecem. Voltar ao [guia da série](INDEX.md).

| Termo | Definição | Onde aparece |
|---|---|---|
| Score de saúde | Número de 0 a 100 por conta: a soma ponderada de seis dimensões (adoção, engajamento, suporte, satisfação, financeiro e contrato). Quanto maior, mais saudável. | [Metodologia](03-metodologia-do-score/README.md) |
| Dimensão | Cada um dos seis grupos de sinais que formam o score, com seu peso. | [Metodologia, seção 2](03-metodologia-do-score/README.md#2-pesos-iniciais-e-por-que-os-escolhi) |
| Heurística | Regra construída por julgamento, sem calibração com cancelamentos reais. É o que o score é neste projeto. | [Metodologia](03-metodologia-do-score/README.md) |
| MRR | Receita mensal recorrente: o valor que a conta paga por mês (base do plano mais R$ 12 por veículo). | [O negócio](01-discovery/02-negocio-frota-leve.md) |
| Churn | Cancelamento do contrato por parte do cliente. | [O negócio](01-discovery/02-negocio-frota-leve.md) |
| CS e CSM | Customer Success é a área que acompanha o cliente depois da venda; CSM é a pessoa que cuida de uma carteira de contas. | [O negócio](01-discovery/02-negocio-frota-leve.md) |
| NPS | Pesquisa em que o cliente dá uma nota de 0 a 10; aqui alimenta a dimensão de satisfação. | [Metodologia, seção 3.4](03-metodologia-do-score/README.md#34-satisfação) |
| Urgência | Ordem de contato: `(100 − score)/100 × MRR × proximidade da renovação`. Não entra no score. | [Regra RN-11](02-definicao/02-regras-de-negocio.md) |
| Playbook | Roteiro de contato para uma situação (por exemplo, queda de uso): gatilho, passos, mensagem pronta e critério de sucesso. | [Regra RN-12](02-definicao/02-regras-de-negocio.md) |
| QBR | Reunião trimestral de acompanhamento com o cliente. Um relatório de QBR por conta está no roadmap. | [Roadmap](06-pos-lancamento/02-roadmap.md) |
| Análise de sensibilidade | Teste que muda pesos e limites do score e mede quanto o resultado se mexe. Mede estabilidade, não acerto. | [Metodologia, seção 9](03-metodologia-do-score/README.md#9-análise-de-sensibilidade) |
| Correlação de Spearman | Medida de 0 a 1 de quanto duas ordenações são parecidas. Perto de 1, a ordem das contas quase não muda. | [Resultados da sensibilidade](03-metodologia-do-score/sensibilidade-resultados.md) |
| Dado sintético | Dado gerado por script, não coletado de cliente. Aqui, vem de um gerador com semente fixa. | [Dados sintéticos](00-sobre-este-caso/dados-sinteticos.md) |
| Arquétipo | Perfil de comportamento (saudável, em queda, mau pagador etc.) usado pelo gerador para criar cada conta. | [Dados sintéticos](00-sobre-este-caso/dados-sinteticos.md) |
| Confiança baixa | Aviso na conta quando menos de 70% do peso do score tem dado. | [Regra RN-08](02-definicao/02-regras-de-negocio.md) |
| RF, RNF, RN, HU | Requisito funcional, requisito não funcional, regra de negócio e história de usuário. | [Requisitos](02-definicao/01-requisitos.md) |
| MoSCoW | Priorização em Must, Should, Could e Won't. | [Histórias e MoSCoW](02-definicao/03-historias-e-moscow.md) |
| ADR | Registro de uma decisão de arquitetura: contexto, alternativas, escolha e trade-off. | [ADRs](04-arquitetura/01-adrs.md) |
| E2E | Teste de ponta a ponta: um navegador automatizado percorre o fluxo real do sistema. | [Qualidade](05-qualidade/01-plano-e-resultados.md) |
| DAX | Linguagem das medidas do Power BI. | [Power BI](../powerbi/README.md) |
| Scrum, sprint e Product Backlog | Método de trabalho em ciclos curtos (sprints), com uma lista priorizada do que construir (Product Backlog). | [Planejamento e Scrum](ciclo-de-vida/02-planejamento-e-scrum.md) |
| Definition of Done | Lista de condições que um item precisa cumprir para ser considerado concluído. | [Planejamento e Scrum](ciclo-de-vida/02-planejamento-e-scrum.md#definition-of-done) |
| RACI | Matriz que indica quem executa (R), responde (A), é consultado (C) e é informado (I) em cada atividade. | [Requisitos e rastreabilidade](ciclo-de-vida/03-requisitos-e-rastreabilidade.md) |
| Rastreabilidade | Ligação entre necessidade, requisito, regra, código, teste e evidência. | [Requisitos e rastreabilidade](ciclo-de-vida/03-requisitos-e-rastreabilidade.md) |
| Esquema estrela | Modelo de dados para BI com tabelas de fatos (medidas) ligadas a dimensões (cadastros). | [Modelo de dados](ciclo-de-vida/05-modelo-de-dados.md) |
| Mermaid | Linguagem de texto para desenhar diagramas que o GitHub renderiza. | [Diagramas](ciclo-de-vida/diagramas/README.md) |
