# Reuniões e solicitações

[Índice](../README.md) · [Planejamento e Scrum](../02-planejamento-e-scrum.md) · [Requisitos e rastreabilidade](../03-requisitos-e-rastreabilidade.md)

Registros do relacionamento com o cliente ao longo do ciclo de vida. As atas são do cenário do estudo de caso: empresa e pessoas são fictícias, e cada ata abre com a linha de simulação. Os participantes aparecem por papel; os nomes fictícios estão nas atas originais, que não são copiadas aqui.

## Atas

| # | Momento | Participantes (papéis) | Objetivo | Ata |
|---|---|---|---|---|
| 1 | Discovery | Líder de CS e equipe de produto | Entender o que a líder espera do painel e o que decide com ele | [Reunião 1](../../01-discovery/03-reuniao-lider-de-cs.md) |
| 2 | Discovery | CSM e equipe de produto | Entender o dia a dia de quem executa | [Reunião 2](../../01-discovery/04-reuniao-csm.md) |
| 3 | Discovery | Persona de dono de transportadora e equipe de produto | Entender quando um cliente esfria e o que tornaria o contato útil | [Reunião 3 e processo AS-IS](../../01-discovery/05-processo-as-is-e-definicoes.md) |
| 4 | Validação de wireframes | Líder de CS, CSM e equipe de produto | Validar telas antes de implementar | [Validação](../../04-arquitetura/04-wireframes-e-validacao.md) |
| 5 | Aceitação do MVP | Líder de CS, CSM e equipe de produto | Verificar os critérios de aceite | [Aceitação](../../05-qualidade/02-reuniao-de-aceitacao.md) |
| 6 | Retrospectiva da v1.0.0 | Líder de CS, CSM e equipe de produto | Escolher melhorias | [Retrospectiva](../../06-pos-lancamento/01-reuniao-de-retrospectiva.md) |

As cerimônias de Scrum (planning, review e retrospectiva por sprint) estão nas [páginas de sprint](../sprints/README.md).

## Contradições e como foram resolvidas

| Contradição | Resolução | Onde |
|---|---|---|
| A líder quer um número só; o CSM quer contexto | Número em destaque, motivo em uma linha na lista e explicação completa na conta | [Reunião 2](../../01-discovery/04-reuniao-csm.md) |
| A líder pede "chance de cancelar em %"; não há histórico para calibrar | Pedido recusado; oferecidos cor, score, motivo principal e urgência em reais | [Validação](../../04-arquitetura/04-wireframes-e-validacao.md) |
| Volume de contatos: cerca de 15 por semana (reunião 1) e cerca de 12 por dia (reunião 2) | As atas divergem e a divergência está anotada na reunião 2; a documentação segue a reunião 1 | [Reunião 2](../../01-discovery/04-reuniao-csm.md) |

## Solicitações de mudança

Pedidos da reunião de validação de wireframes, com a decisão e o motivo registrados na ata:

| # | Pedido | Decisão | Motivo |
|---|---|---|---|
| 1 | MRR em risco logo no topo, em reais | Aceito | Responde à pergunta da diretoria sem mudar o modelo |
| 2 | Frase com o motivo principal na lista | Aceito | Evita abrir a conta só para saber o motivo |
| 3 | Filtro "só minhas contas" | Aceito | O CSM atende só a própria carteira |
| 4 | Botão para copiar a mensagem do playbook | Aceito | Reduz o atrito de uso |
| 5 | Testar um peso antes de aplicar | Aceito | Reduz o risco R-05 |
| 6 | "Chance de cancelar em %" | Recusado | Sem histórico de cancelamentos, o percentual seria inventado |
| 7 | Alerta por e-mail quando a conta mudar de cor | Adiado | Exigiria serviço de e-mail; entregue como alerta no painel na v1.1.0 |
| 8 | Esconder as dimensões e mostrar só o número | Parcial | O painel executivo mostra só agregados; a conta sempre mostra a explicação |

Decisões posteriores:

| Origem | Solicitação | Decisão |
|---|---|---|
| Aceitação | Histórico de quem mudou os pesos e quando | Roadmap v1.2 (a v1 guarda só a última alteração) |
| Aceitação | Destacar contas com renovação próxima na lista | Selo de renovação no roadmap v1.2 |
| Retrospectiva | Alerta de queda brusca (M1) | Implementado na v1.1.0 |
| Retrospectiva | Histórico de configurações (M2); zona cinzenta e selo (M3) | Roadmap v1.2 |
| Retrospectiva | QBR automatizado; notificação por e-mail | Descartados nesta etapa; QBR no roadmap v1.3 e e-mail na v2.0 |
