# Perguntas de entrevista (3 por fase)

Respostas em primeira pessoa, curtas, prontas para falar. Os números citados vêm da execução real do projeto.

## Fase 0 · Preparação
1. **Por que um repositório sem deploy?** Porque o objetivo é mostrar o raciocínio, não operar um serviço. Tudo roda local com Docker Compose e as provas são prints e documentos; assim quem abre o GitHub entende sem precisar de login.
2. **Como você garantiu que o estudo é honesto?** Escrevi regras de integridade no início: dados sintéticos com semente fixa, reuniões marcadas como simulação, nada de resultado inventado. Cada número do README vem de um comando que rodei.
3. **Por que a estrutura de pastas por fase?** Para o leitor seguir a ordem do trabalho (discovery → definição → metodologia → arquitetura → qualidade → evolução) e porque cada pasta responde a uma pergunta diferente.

## Fase 1 · Descoberta
1. **Como você escolheu o painel entre cinco ideias?** Matriz com critérios ponderados; a causa raiz era falta de visibilidade e o painel era a única ideia que a atacava para toda a carteira (85 pontos contra 76 do segundo, alertas). As outras viraram componentes ou roadmap.
2. **Como lidou com a líder querendo um número e o CSM querendo contexto?** Número em destaque e explicação em uma linha na lista, completa na conta. Ninguém ficou sem o que pediu, mas ninguém levou tudo.
3. **O que uma restrição mudou no escopo?** O time consegue ~15 contatos por semana por pessoa; por isso criei a urgência (risco × valor × proximidade da renovação) em vez de só filtrar.

## Fase 2 · Definição
1. **Como você escreve critérios de aceite?** Dado/Quando/Então e sempre testável; cada um virou teste automatizado ou verificação manual registrada.
2. **O que é rastreabilidade para você?** Seguir um requisito até a regra, o código, o teste e o print. Mantenho a tabela em `docs/02-definicao/06-rastreabilidade.md`.
3. **Como você tratou ganhos esperados?** Como hipóteses numeradas (H-01 a H-04) e nunca como resultado. Nenhum deles foi medido.

## Fase 3 · Metodologia do score
1. **Como você escolheu os pesos?** Por raciocínio sobre o problema (adoção 25, engajamento 20, suporte, satisfação e financeiro 15 cada, contrato 10) e deixei explícito que são opiniões; a análise de sensibilidade mostra quanto importa errar.
2. **O que a sensibilidade mostrou?** A ordem das contas é estável (Spearman entre 0,936 e 0,998), mas a cor é sensível aos limites: deslocar 5 pontos muda 19 ou 11 das 120 contas. Por isso recomendo priorizar pela urgência e tratar a fronteira como zona cinzenta.
3. **O score prevê churn?** Não, e escrevo isso em todo lugar. É uma heurística; os dados são sintéticos e desenhados por arquétipos, então "acertar" não vale como validação. Calibrar exige histórico real.

## Fase 4 · Arquitetura
1. **Por que calcular em tempo real?** Para a mudança de pesos valer na hora e poder reconstruir qualquer data. O custo foi medido: ~106 ms para a carteira e ~800 ms para a tendência de 12 semanas; troco por snapshots quando crescer.
2. **Por que não guardar histórico de score?** Um snapshot guardaria o score na régua da época; ao mudar os pesos, a tendência ficaria inconsistente. Reconstruo com uma régua só.
3. **Qual pedido você recusou?** "Chance de cancelar em %". Sem histórico de cancelamentos seria um número inventado com ar de ciência; ofereci cor, motivo e MRR em risco.

## Fase 5 · Implementação
1. **Como organizou o código?** Núcleo puro do score sem Prisma nem Next, o que permite testar com dados feitos à mão e reutilizar o mesmo código no servidor, nos scripts e na exportação.
2. **Como garantiu efeito imediato dos pesos?** Server action grava a configuração validada por Zod e revalida o layout; o cálculo é sempre feito sobre a configuração atual, sem cache de score.
3. **O que foi mais difícil?** Calibrar o gerador para ter uma carteira com as três cores sem fingir que isso valida o modelo.

## Fase 6 · Qualidade
1. **Quais testes você tem?** 76 unitários, 5 de integração com PostgreSQL real, 14 E2E com Playwright, lint e typecheck, todos executados e registrados.
2. **Um bug que os testes acharam?** Chamados do gerador com data no futuro; o teste que verifica "nenhum evento depois da data de referência" falhou na primeira rodada.
3. **O que não está coberto?** Não medi cobertura percentual, não rodei auditoria de acessibilidade e não fiz teste de carga. Está declarado na documentação.

## Fase 7 · Evolução
1. **Como escolheu a v1.1?** Pela dor mais frequente (descobrir a queda tarde), por usar dado que já existia (variação de 30 dias) e por caber em uma entrega com teste.
2. **Como foi o fluxo de Git?** Branch de feature, PR descrito em arquivo, changelog e tag `v1.1.0`.
3. **O que ficou para depois?** Histórico versionado de configurações, zona cinzenta na cor, QBR por conta e, o mais importante, calibração com dados reais.

## Fase 8 · Power BI
1. **Por que um complemento em Power BI?** Meu histórico inclui Power BI e muita gente de CS vive nele; entreguei CSVs, modelo em estrela e medidas DAX.
2. **Você montou o relatório?** Ainda não: o `.pbix` não está no repositório e a pasta de prints do Power BI está vazia. O guia deixa o passo a passo e os valores de conferência.
3. **Como conferir se o relatório está certo?** Os totais precisam bater com o sistema: 11 críticas, 40 em atenção, 69 saudáveis, score médio 77,2.

## Fase 9 · Vitrine
1. **O que o projeto mostra sobre você?** Que eu conecto dado, processo e decisão: escuto o time, transformo em regra testável e explico os limites.
2. **Qual é sua maior limitação neste projeto?** Não tenho dado real de churn; tudo é simulado e sintético, e deixo isso claro.
3. **O que faria com dados reais?** Marcaria quem cancelou e renovou, calcularia o score 90 dias antes, compararia as distribuições e recalibraria pesos e limites, repetindo a sensibilidade.

## Fase 10 · README
1. **Como organizou o README?** Prints no topo, resumo em 5 linhas, mapa do repositório, roteiro de leitura em 7 passos e limitações honestas.
2. **Por que o README declara as limitações?** Porque quem avalia confia mais em quem mostra o que o trabalho não prova.
3. **Quem é o público do README?** Uma pessoa de CS ou de produto que abre o GitHub por 5 minutos e precisa entender o que foi feito e por quê.
