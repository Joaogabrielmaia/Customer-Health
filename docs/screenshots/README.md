# Galeria

Quatorze prints numerados, gerados com Playwright (`npm run screenshots`) sobre os dados sintéticos, na ordem do fluxo de uso. Em todos, a data de referência dos dados é 15/10/2026. Cada legenda tem duas partes: o que se vê · por que importa. Voltar ao [guia da série](../INDEX.md).

## 1. Entrar

### 00 · Login
![Tela de login do Termômetro, com e-mail e senha preenchidos, botão "Entrando…" e aviso de ambiente local de demonstração](00-login.png)

**O que se vê:** campos de e-mail e senha, botão em estado "Entrando…" e o aviso de que usuários e senha de demonstração estão no README e são fictícios. · **Por que importa:** é a porta de entrada dos dois papéis, Admin e CSM ([RF-01](../02-definicao/01-requisitos.md)).

## 2. Ver a carteira e escolher quem contatar

### 01 · Painel executivo
![Painel executivo com aviso de 19 contas em queda brusca, quatro cartões de indicadores, rosca por cor, tendência de 12 semanas, comparação por segmento e as cinco contas mais urgentes](01-painel-executivo.png)

**O que se vê:** faixa de alerta com 19 contas em queda brusca; score médio 77,2; 11 contas críticas de 120 (40 em atenção, 69 saudáveis); receita em risco de R$ 7.234 (9,0% do MRR de R$ 80.656) e R$ 27.856 em atenção; rosca por cor, tendência das últimas 12 semanas, tabela por segmento e a lista "Mais urgentes agora". · **Por que importa:** a validação pediu o MRR em risco no topo, em reais, e o painel executivo mostra só agregados ([validação](../04-arquitetura/04-wireframes-e-validacao.md), reunião simulada).

### 02 · Contas em risco
![Lista de 51 contas amarelas e vermelhas, com filtros de cor, segmento e CSM, e colunas de score, principal motivo, MRR, renovação e barra de urgência](02-contas-em-risco.png)

**O que se vê:** 51 contas com MRR somado de R$ 35.090, filtros de cor, segmento e CSM com a caixa "Só minhas contas" desmarcada, e por linha o score com cor e variação, o principal motivo, o MRR, a renovação e a barra de urgência. A primeira, Cargas Martins, tem urgência 100. · **Por que importa:** a líder de CS (reunião simulada) disse que cada CSM conduz cerca de 15 contatos por semana, o que levou a ordenar por urgência ([reunião](../01-discovery/03-reuniao-lider-de-cs.md)).

### 03 · Visão da conta
![Visão da conta Cargas Martins: score 28 de 100, selo Crítica, queda de 12,7 pontos, urgência de R$ 2.440, histórico das últimas semanas e início da tabela "Por que este score?"](03-visao-da-conta.png)

**O que se vê:** Cargas Martins (plano Frota+, 79 veículos, R$ 1.938/mês), score 28 de 100, selo Crítica, queda de 12,7 pontos em 30 dias, urgência de R$ 2.440, histórico semanal em linha e a tabela de dimensões, cortada no fim da imagem. · **Por que importa:** o número em destaque com o porquê logo abaixo atende o pedido de um número só e o de contexto ([reunião do CSM](../01-discovery/04-reuniao-csm.md), reunião simulada).

## 3. Entender o score e agir

### 04 · Explicação do score
![Tabela "Por que este score?" com as seis dimensões, valor, peso usado, contribuição, mudança em 30 dias e o que o dado mostra, mais os quadros "O que mais puxa o score para baixo" e "O que mudou"](04-explicacao-do-score.png)

**O que se vê:** para cada dimensão, valor de 0 a 100 com barra, peso usado, contribuição em pontos, mudança em 30 dias e uma frase com o dado; abaixo, os quadros "O que mais puxa o score para baixo" (adoção e engajamento) e "O que mudou" (queda de 12,7 pontos, com financeiro −9,0). · **Por que importa:** cada ponto do score é rastreável a uma dimensão ([metodologia](../03-metodologia-do-score/README.md), seção 7).

### 05 · Playbook na conta
![Seção "O que fazer agora" com cinco playbooks: baixa adoção, queda de uso, chamados repetidos, NPS baixo e renovação próxima, cada um com objetivo, quatro passos, modelo de mensagem e botão Copiar mensagem](05-playbook-na-conta.png)

**O que se vê:** cinco playbooks disparados para esta conta, cada um com gatilho, objetivo, quatro passos e o modelo de mensagem já preenchido com o nome da CSM (Camila Ferreira) e da conta, com botão "Copiar mensagem". · **Por que importa:** os gatilhos são regras objetivas ([RN-12](../02-definicao/02-regras-de-negocio.md)); o botão copiar foi pedido na validação (reunião simulada).

### 06 · Biblioteca de playbooks
![Página "Playbooks de CS" com os cinco playbooks e, em cada um, gatilho, objetivo, passos, roteiro de contato, modelo de mensagem, como saber que funcionou e quando escalar](06-playbooks.png)

**O que se vê:** os cinco playbooks completos, com roteiro de contato (abertura, descoberta, fechamento), modelo de mensagem com variáveis como `{{csm}}` e `{{conta}}`, critério de sucesso e condição para escalar. · **Por que importa:** o roteiro nunca pergunta "está tudo bem?", porque a persona do cliente da reunião 3 disse que não atenderia esse contato ([reunião 3](../01-discovery/05-processo-as-is-e-definicoes.md)).

### 07 · Registro de ação
![Formulário "Registrar ação do CS" com canal, playbook, resultado e texto, a mensagem "Ação registrada." e a lista de três ações registradas](07-registro-de-acao.png)

**O que se vê:** campos de canal (Ligação), playbook (Nenhum) e resultado (Em andamento), caixa de texto, a confirmação "Ação registrada." e a lista "Ações registradas (3)", em que a mais recente está datada de 23/10/2026 e mostra "Score na hora do registro: 27,6". A data é a da captura: o app grava a hora real do registro, enquanto a data de referência dos dados é 15/10/2026; as outras duas ações vêm dos dados sintéticos. · **Por que importa:** é o único registro manual do sistema, e cada ação grava o score e a cor do momento ([RN-15](../02-definicao/02-regras-de-negocio.md)).

### 13 · Alertas de queda brusca (v1.1)
![Página "Alertas de queda brusca" com 19 contas, MRR somado de R$ 12.122, e por conta o score antes e agora, a queda, a maior causa e o MRR](13-alertas-queda-brusca.png)

**O que se vê:** 19 contas em queda de 15 pontos ou mais em 30 dias, da maior para a menor (a primeira vai de 88,8 para 46,9); por linha, a cor atual, a dimensão que mais pesou e o MRR. Duas contas ainda aparecem como Saudável (Logística Silva e Logística Nascimento & Rocha). · **Por que importa:** o alerta veio da retrospectiva (reunião simulada) e avisa da velocidade da queda, não da cor ([PR da v1.1](../06-pos-lancamento/03-pr-v1.1-alerta-queda-brusca.md)).

## 4. Ajustar e conferir o modelo

### 08 · Configuração de pesos
![Tela "Configuração do score" com seis controles deslizantes de peso, os limites 75 e 50, os botões Simular, Salvar e aplicar e Voltar ao padrão, e o quadro "Efeito da simulação"](08-configuracao-de-pesos.png)

**O que se vê:** pesos de 23%, 18%, 14%, 27%, 14% e 5% para as seis dimensões, limites de verde a partir de 75 e de amarelo a partir de 50, e o efeito da simulação (68 saudáveis, 42 em atenção, 10 críticas, MRR crítico de R$ 6.972). · **Por que importa:** a simulação sem gravar reduz o risco R-05, mudar a régua sem ver o efeito ([riscos](../02-definicao/05-riscos.md)).

### 09 · Sensibilidade
![Tabela "Análise de sensibilidade" com 22 linhas de cenário e, por linha, verdes, amarelas, vermelhas, contas que mudam de cor, correlação de Spearman, top 15 mantidas e variação média](09-sensibilidade.png)

**O que se vê:** o caso-base mais 21 cenários, cada um com a contagem por cor, contas que mudam de cor, Spearman (de 0,936 a 1,000), quantas das 15 mais urgentes se mantêm e a variação média em pontos; o destaque é "Limites de cor −5 pontos", que muda a cor de 19 contas. · **Por que importa:** a ordem das contas é estável, mas estabilidade não é validade ([metodologia](../03-metodologia-do-score/README.md), seção 9).

### 10 · Exportação CSV
![Terminal escuro com o cabeçalho do CSV da carteira e oito linhas de contas, de acc-001 a acc-008](10-exportacao-csv.png)

**O que se vê:** o título `GET /api/export?tipo=carteira`, o cabeçalho com as colunas (conta, segmento, plano, MRR, score, cor, dimensões) e oito linhas do arquivo gerado. · **Por que importa:** cobre o requisito de exportar carteira, histórico e ações ([RF-12](../02-definicao/01-requisitos.md)).

## 5. No celular (390 px)

### 11 · Painel no celular
![Painel executivo em largura de celular, com os cartões, a rosca, a tendência, o segmento e as contas urgentes empilhados em uma coluna](11-mobile-painel.png)

**O que se vê:** o mesmo painel do print 01 em uma coluna de 390 px, com os cartões em duas por linha. · **Por que importa:** a página não tem rolagem horizontal ([RNF-03](../02-definicao/01-requisitos.md)).

### 12 · Conta no celular
![Visão da conta em largura de celular, em uma coluna muito longa: score, tabela de dimensões, playbooks, registro de ação e linha do tempo](12-mobile-conta.png)

**O que se vê:** a conta inteira em uma imagem de 390 × 7.326 px: cabeçalho e score, "Por que este score?", "O que fazer agora", registro de ação e linha do tempo. O texto fica reduzido na escala de leitura; use o print 03 para ler os valores. · **Por que importa:** o requisito é usar a conta em 390 px sem rolagem horizontal da página ([RNF-03](../02-definicao/01-requisitos.md); [HU-10](../02-definicao/03-historias-e-moscow.md)).

## Telas sem print
- Aviso de confiança baixa na conta (RN-08).
- Erro de validação do registro de ação (nota curta).
- Erro de login (senha errada).
- Filtro "só minhas contas" aplicado (a caixa aparece desmarcada no print 02).
- Prints do relatório do Power BI: o relatório não foi montado ([powerbi](../../powerbi/README.md)).
