# Termômetro

**Score de saúde de clientes de 0 a 100 em seis dimensões, com explicação por conta, urgência por risco × MRR × renovação, playbooks e alertas de queda.**

## O problema

Cenário fictício: a Frota Leve vende um sistema de gestão de frotas para pequenas transportadoras e tem 120 clientes. Três pessoas de CS (Customer Success, a área que acompanha o cliente depois da venda) decidem de memória quem contatar. A conta que para de usar sem reclamar só aparece na renovação ([o negócio](docs/01-discovery/02-negocio-frota-leve.md)).

<table>
<tr>
<td width="50%"><img src="docs/screenshots/01-painel-executivo.png" alt="Painel executivo com 11 contas críticas de 120, receita em risco de R$ 7.234, rosca por cor, tendência de 12 semanas e contas mais urgentes"><br><sub>Painel executivo</sub></td>
<td width="50%"><img src="docs/screenshots/04-explicacao-do-score.png" alt="Tabela com as seis dimensões do score: valor, peso, contribuição, mudança em 30 dias e o que o dado mostra"><br><sub>Por que este score?</sub></td>
</tr>
<tr>
<td width="50%"><img src="docs/screenshots/09-sensibilidade.png" alt="Tabela de sensibilidade com 22 linhas de cenário, contas que mudam de cor e correlação de Spearman"><br><sub>Sensibilidade</sub></td>
<td width="50%"><img src="docs/screenshots/13-alertas-queda-brusca.png" alt="Lista de 19 contas com queda de 15 pontos ou mais em 30 dias, com a maior causa de cada uma"><br><sub>Alertas de queda brusca</sub></td>
</tr>
</table>

![Gravação do fluxo: painel executivo, contas em risco, conta Cargas Martins com "Por que este score?", playbooks e registro de ação](docs/screenshots/demo-conta-em-risco.gif)

A gravação mostra o fluxo real no app (23 s, sem narração). Os 14 prints estão na [galeria](docs/screenshots/README.md); a leitura em série está no [guia](docs/INDEX.md), com trilhas de 2, 10 e 30 minutos, e os termos no [glossário](docs/GLOSSARIO.md).

## Ficha técnica

| Campo | Situação |
|---|---|
| Natureza | Estudo de caso fictício: empresa, pessoas e dados inventados; dados sintéticos e reuniões simuladas |
| Stack | Next.js e TypeScript (aplicação web), Prisma e PostgreSQL (banco), Vitest e Playwright (testes) |
| Testes | 76 unitários e 5 de integração em 2026-10-24 (commit `d45b65c`); 14 de ponta a ponta (E2E) em 2026-10-24 (commit `4598c4c`) |

## O que construí

- Defini um score de 0 a 100 em seis dimensões (adoção, engajamento, suporte, satisfação, financeiro e contrato), com a contribuição e a causa de cada dimensão por conta ([metodologia](docs/03-metodologia-do-score/README.md); [print](docs/screenshots/04-explicacao-do-score.png)).
- Medi a estabilidade do score em 21 cenários mais o caso-base: nos 19 cenários de peso, a correlação de Spearman (medida de quanto duas ordenações se parecem) fica entre 0,936 e 0,998 ([sensibilidade](docs/03-metodologia-do-score/sensibilidade-resultados.md)).
- Combinei risco, MRR (receita mensal recorrente) e proximidade da renovação em uma ordem de contato, porque cada CSM conduz cerca de 15 contatos por semana ([RN-11](docs/02-definicao/02-regras-de-negocio.md)).
- Escrevi 5 playbooks (roteiros de contato) com gatilho objetivo e mensagem já preenchida, e fiz o registro de ação gravar o score e a cor do momento ([RN-12 e RN-15](docs/02-definicao/02-regras-de-negocio.md); [print](docs/screenshots/05-playbook-na-conta.png)).
- Implementei o alerta de queda de 15 pontos ou mais em 30 dias, entregue na v1.1.0 ([PR](docs/06-pos-lancamento/03-pr-v1.1-alerta-queda-brusca.md)).
- Exportei os dados para Power BI: 4 CSVs em esquema em estrela e medidas DAX; o relatório não está montado ([powerbi](powerbi/README.md)).

## Competência → prova

| O que o projeto exercita | Onde está a prova |
|---|---|
| Definir uma métrica e explicar cada ponto dela | [Metodologia](docs/03-metodologia-do-score/README.md) · [print da explicação](docs/screenshots/04-explicacao-do-score.png) |
| Testar a robustez da métrica | [Sensibilidade, 22 linhas](docs/03-metodologia-do-score/sensibilidade-resultados.md) · [print](docs/screenshots/09-sensibilidade.png) |
| Recusar um pedido e oferecer alternativa | [Recusa do "% de chance de cancelar"](docs/04-arquitetura/04-wireframes-e-validacao.md), pedido da líder de CS (persona do cliente) na reunião simulada de validação |
| Transformar score em ação | [Regras de negócio](docs/02-definicao/02-regras-de-negocio.md) · [print do playbook na conta](docs/screenshots/05-playbook-na-conta.png) |
| Modelar dados para BI | [Power BI](powerbi/README.md): esquema em estrela, 4 CSVs e medidas DAX |
| Declarar o que a métrica não captura | [O que o score não captura](docs/03-metodologia-do-score/README.md#8-o-que-o-score-não-captura) |
| Gerar dados sintéticos reproduzíveis | [Dados sintéticos](docs/00-sobre-este-caso/dados-sinteticos.md) |

## Decisão difícil

| Item | Registro |
|---|---|
| Contexto | A líder de CS (persona do cliente, reunião simulada) pediu "78% de chance de cancelar" por conta, porque "o diretor entende porcentagem". |
| Alternativas | Mostrar o percentual; ou mostrar cor, score, motivo principal e urgência em reais. |
| Escolha | Recusei o percentual: sem histórico de cancelamentos ele seria inventado, o score é uma heurística e um número "científico" vira verdade (risco R-03). Ofereci cor, score, motivo principal e urgência em reais. |
| Custo aceito | A líder fica sem um número fácil de apresentar. |
| Quando mudaria | Com 12 meses de histórico real de cancelamentos e uma calibração validada. |

Registro completo: [wireframes e validação](docs/04-arquitetura/04-wireframes-e-validacao.md). Outras decisões: [ADR-001 e ADR-002](docs/04-arquitetura/01-adrs.md) (cálculo em tempo real e histórico reconstruído).

## Evidências

- **Testes:** 76 unitários e 5 de integração em 2026-10-24 (commit `d45b65c`); 14 E2E em 2026-10-24 (commit `4598c4c`). Saídas em [docs/05-qualidade](docs/05-qualidade/README.md).
- **Sensibilidade:** 22 linhas (21 cenários e o caso-base), semente 20261015, em [sensibilidade-resultados.md](docs/03-metodologia-do-score/sensibilidade-resultados.md) (commit `dba5229`, 2026-10-23).
- **Alertas:** 19 contas em queda brusca na semente padrão, 2 delas ainda saudáveis, na v1.1.0 (commit `ede71b7`, 2026-10-23); descreve o dado sintético, não o alerta com cancelamento real ([PR](docs/06-pos-lancamento/03-pr-v1.1-alerta-queda-brusca.md)).
- **Decisões:** 6 ADRs em [01-adrs.md](docs/04-arquitetura/01-adrs.md).
- **Prints e gravação:** 14 prints e o [GIF de 23,4 s e 4,9 MB](docs/screenshots/demo-conta-em-risco.gif), capturados do app com os dados sintéticos ([galeria](docs/screenshots/README.md)).

## Limites

- O score é uma heurística sem validação contra cancelamento real, e os dados são sintéticos, gerados por arquétipos que desenhei; "o score separa bem os arquétipos" não é validação.
- O relatório do Power BI não foi montado; só os CSVs e as medidas DAX estão no repositório.
- Não medi cobertura de testes, acessibilidade nem carga; o desempenho foi medido só com 120 contas e a segurança é de demonstração, sem recuperação de senha, MFA ou limite de tentativas.
- A reunião 2 cita cerca de 12 contatos por dia e a reunião 1, cerca de 15 por semana por CSM; este README segue a [reunião 1](docs/01-discovery/03-reuniao-lider-de-cs.md).
- O print 07 mostra uma ação com data de captura de 23/10/2026, enquanto a data de referência dos dados é 15/10/2026; a [legenda](docs/screenshots/README.md) explica.

## Evolução prevista

- Histórico versionado de configurações, zona cinzenta na cor e selo de renovação (v1.2).
- Relatório de QBR por conta (v1.3).
- Calibração com dados reais de cancelamento e alertas por e-mail (v2.0).

Detalhes no [roadmap](docs/06-pos-lancamento/02-roadmap.md).

## Licença

[MIT](LICENSE). O código roda localmente; instruções em [CONTRIBUTING.md](CONTRIBUTING.md).
