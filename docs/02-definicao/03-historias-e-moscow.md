# 03 · Histórias de usuário, critérios de aceite e MoSCoW

Formato dos critérios: **Dado / Quando / Então**.

## HU-01 · Entrar no sistema (RF-01) — Must
Como CSM ou líder, quero entrar com e-mail e senha para ver a carteira.
- Dado um usuário válido, quando informo e-mail e senha corretos, então entro no painel.
- Dado senha errada, quando tento entrar, então vejo "E-mail ou senha incorretos" e continuo no login.
- Dado que não estou autenticado, quando abro qualquer rota interna ou a API de exportação, então sou redirecionado ao login (ou recebo 401 na API).

## HU-02 · Ver a carteira de relance (RF-02) — Must
Como líder, quero ver quantas contas estão em cada cor e quanto de receita está em risco.
- Dado o painel aberto, então vejo score médio, contas críticas, MRR crítico e MRR em atenção.
- Então vejo a tendência de 12 semanas e a comparação por segmento.

## HU-03 · Saber quem contatar primeiro (RF-05) — Must
Como CSM, quero as contas amarelas e vermelhas ordenadas por urgência.
- Dado a lista de risco, então a ordem é decrescente por urgência (RN-11).
- Quando filtro por "somente críticas", então a lista só tem contas vermelhas e é menor que a lista completa.

## HU-04 · Entender por que o score está assim (RF-03, RF-04) — Must
Como CSM, quero ver a contribuição de cada dimensão e o que mudou em 30 dias.
- Dada uma conta, então vejo valor, peso usado, contribuição e mudança de cada dimensão.
- Então vejo "O que mais puxa o score para baixo" e "O que mudou desde o período anterior".
- Dada uma conta com pouco dado, então vejo aviso de confiança baixa.

## HU-05 · Saber o que fazer (RF-07) — Must
Como CSM, quero um roteiro de contato adequado à situação da conta.
- Dada uma conta com NPS ≤ 6, então o playbook "NPS baixo" é sugerido, com mensagem pronta com o nome da conta e o CSM.
- Dada uma conta sem gatilhos, então vejo "Nenhum playbook disparado".

## HU-06 · Registrar o que fiz (RF-08) — Must
Como CSM, quero registrar canal, resultado e nota da ação.
- Quando registro uma ação válida, então ela aparece na lista e na linha do tempo com o resultado.
- Dada uma nota com menos de 5 caracteres, então vejo erro de validação e nada é gravado.
- Então o sistema grava o score e a cor no momento do registro (RN-15).

## HU-07 · Ajustar os pesos (RF-09, RF-10) — Must/Should
Como líder (Admin), quero ajustar pesos e limites e ver o efeito.
- Quando simulo, então vejo a nova contagem por cor sem gravar (recarregar a página mostra os valores antigos).
- Quando salvo, então todas as telas passam a usar a nova configuração na hora.
- Dados limites invertidos, então a configuração é recusada com mensagem.
- Dado um CSM, então o botão de salvar fica desabilitado.

## HU-08 · Ver quão sensível é o modelo (RF-11) — Should
Como líder, quero saber o quanto o resultado muda se os pesos mudarem.
- Então vejo uma tabela com 21 cenários mais o caso-base (22 linhas) com mudança de cor, correlação de ranking e permanência do top 15.

## HU-09 · Exportar dados (RF-12) — Must
Como líder, quero exportar a carteira em CSV para usar em outra ferramenta.
- Então o CSV da carteira tem uma linha por conta (120) e cabeçalho com score, cor e dimensões.
- Dado tipo inválido, então a API responde 400.

## HU-10 · Usar no celular (RNF-03) — Should
- Dado 390 px de largura, então a página não tem rolagem horizontal.

## HU-11 · Gerar dados de estudo (RF-13) — Must
- Dada a mesma semente, então o conjunto de dados é idêntico.

## HU-12 · Ser avisado de queda brusca (RF-14) — Could (v1.1)
- Dada uma conta cujo score caiu 15 pontos ou mais em 30 dias, então ela aparece na página de alertas e como indicador no painel.

## MoSCoW

| Classe | Itens |
|---|---|
| **Must** | HU-01, HU-02, HU-03, HU-04, HU-05, HU-06, HU-07 (pesos), HU-09, HU-11 |
| **Should** | HU-07 (simulação), HU-08, HU-10 |
| **Could** | HU-12 (alerta de queda brusca) |
| **Won't (nesta versão)** | Modelo preditivo de aprendizado de máquina; integração com CRM; multiempresa; alertas por e-mail; "% de chance de cancelar" |
