# 02 · Regras de negócio

As constantes citadas estão nomeadas em [`src/lib/score/dimensions.ts`](../../src/lib/score/dimensions.ts) (`PARAMS`). A explicação do porquê de cada escolha está em [03-metodologia-do-score](../03-metodologia-do-score/README.md).

| ID | Regra |
|---|---|
| RN-01 | Cada dimensão vai de 0 a 100 (maior = mais saudável). O score é a soma ponderada das dimensões disponíveis, limitada a 0–100 e arredondada a 1 casa. |
| RN-02 | **Adoção** = módulos em uso ÷ 5 × 100. Um módulo está "em uso" com pelo menos 4 eventos nos últimos 30 dias. |
| RN-03 | **Engajamento** = 70% frequência + 30% tendência. Frequência = dias ativos nos últimos 30 ÷ 20, limitado a 100. Tendência compara o volume dos últimos 30 dias com os 30 anteriores: razão ≥ 1 vale 100; razão ≤ 0,5 vale 0; linear entre as duas. |
| RN-04 | **Suporte** = 100 menos penalidades, sobre chamados dos últimos 60 dias: −10 por chamado aberto nos últimos 30 dias (máx. −40); −15 por categoria com 2 ou mais chamados (máx. −30); −20 por chamado crítico em aberto (máx. −40); −10 se algum chamado está aberto há mais de 7 dias. |
| RN-05 | **Satisfação** = 80% nível + 20% tendência, usando a resposta de NPS mais recente nos últimos 180 dias. Nível = nota × 10. Tendência = 50 + 10 × (variação vs. resposta anterior), entre 0 e 100; sem resposta anterior, vale 50 (neutra). |
| RN-06 | **Financeiro** = 100 menos penalidades, sobre faturas vencidas nos últimos 90 dias: −10 por fatura paga com mais de 5 dias de atraso; fatura vencida e não paga: −40 mais 1,5 por dia de atraso (acréscimo máx. −30). |
| RN-07 | **Contrato**: 100 com 120 dias ou mais para a renovação; cai linearmente até 40 no dia do vencimento; contrato vencido sem renovação vale 20. |
| RN-08 | **Dado ausente**: dimensão sem dado fica fora do cálculo e os pesos das demais são **renormalizados**. Se menos de 70% do peso total tem dado, a confiança é **BAIXA** e a tela avisa. |
| RN-09 | Conta com menos de 30 dias de casa (onboarding): adoção e engajamento ficam ausentes. Sem NPS em 180 dias: satisfação ausente. Sem fatura vencida em 90 dias: financeiro ausente. |
| RN-10 | Cor: verde com score ≥ limite verde (padrão 75); amarelo com score ≥ limite amarelo (padrão 50); vermelho abaixo. |
| RN-11 | Urgência = `(100 − score)/100 × MRR × proximidade`; proximidade = 1 + clamp((90 − dias para renovar)/90, 0, 1), de 1 a 2. |
| RN-12 | **Playbooks recomendados**: adoção < 50 → baixa adoção; razão de uso < 0,7 → queda de uso; categoria repetida, chamado crítico aberto ou 3+ chamados em 30 dias → chamados repetidos; NPS ≤ 6 ou queda ≥ 3 pontos → NPS baixo; renovação em até 90 dias → renovação próxima. |
| RN-13 | **O que mudou**: o score atual é comparado ao de 30 dias antes, com a **mesma configuração**; a variação é decomposta em pontos por dimensão. |
| RN-14 | **Configuração**: pesos entre 0 e 100, soma maior que zero, normalizados na leitura; limite do amarelo menor que o do verde; **só Admin salva**; qualquer usuário pode simular. |
| RN-15 | Ao registrar uma ação, o sistema grava também o score e a cor da conta naquele momento. |
| RN-16 | O "hoje" do estudo é a data de referência `REFERENCE_DATE` (padrão 2026-10-15). Eventos posteriores a ela não entram no cálculo. |
| RN-17 | O alerta de queda brusca (v1.1) dispara quando o score cai 15 pontos ou mais em 30 dias. |
