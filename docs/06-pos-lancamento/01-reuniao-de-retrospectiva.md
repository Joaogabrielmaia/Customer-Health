# 01 · Reunião de retrospectiva

> Simulação: o Claude interpretou o cliente nesta conversa.

**Participantes (fictícios):** Marcela Andrade, Rafael Teixeira e eu, após a v1.0.0.

## O que foi bem
- **Marcela:** "A explicação por conta acabou com a discussão ‘o número está certo?’. Agora a conversa é sobre o dado."
- **Rafael:** "O motivo principal na lista economiza muito clique, e o texto pronto do playbook me poupa preparo."
- **Eu:** o núcleo puro do score e os testes tornaram seguro mudar regras; o teste do gerador pegou um bug de verdade.

## O que não foi bem
- **Rafael:** "Eu descubro que a conta caiu *depois* de abrir o painel e olhar a lista. Queria que as quedas bruscas aparecessem sozinhas."
- **Marcela:** "Não sei quem mexeu nos pesos nem quando."
- **Eu:** a sensibilidade em tela é lenta (~2,8 s) e a tendência recalcula tudo a cada acesso; escolhi simplicidade (ADR-001) e a conta chegará.
- **Eu:** o painel mostra a cor, mas os testes de sensibilidade mostraram que contas perto da fronteira trocam de cor com pouco; a tela não sinaliza isso.

## Três melhorias escolhidas

| # | Melhoria | Origem | Decisão |
|---|---|---|---|
| M1 | **Alerta de queda brusca de score** (≥ 15 pontos em 30 dias): página de alertas e indicador no painel | Rafael | **Implementada na v1.1** |
| M2 | Histórico versionado de configurações de peso | Marcela | Roadmap (precisa de nova tabela e tela) |
| M3 | Indicar "zona cinzenta" (±5 pontos de uma fronteira de cor) e selo de renovação na lista | Eu + Rafael | Roadmap |

## Por que M1 e não M2 ou M3
M1 responde à dor mais frequente (descobrir a queda tarde), usa dados que já tenho (a variação de 30 dias já é calculada) e cabe em uma sessão com teste e documentação. M2 e M3 pedem decisões de modelo de dados e de interface que merecem discovery próprio.

## Outras ideias descartadas na reunião
- QBR automatizado por conta: bom, mas depende de M1/M2 estarem estáveis; vai para o roadmap.
- Notificação por e-mail: exige serviço externo e política de envio; só depois de validar o alerta dentro do painel.
