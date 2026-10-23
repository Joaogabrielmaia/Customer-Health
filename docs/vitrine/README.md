# Vitrine

Material para currículo, LinkedIn e entrevista. Todos os números são da execução real; não existe cliente real neste projeto (estudo com dados sintéticos).

## 3 bullets para o currículo
- Projetei e implementei o **Termômetro**, painel de saúde de clientes para um SaaS fictício (Next.js, TypeScript, Prisma, PostgreSQL), com score 0–100 em 6 dimensões, explicação por conta, playbooks de CS e priorização por urgência (risco × valor × renovação).
- Documentei a metodologia do score com **análise de sensibilidade** sobre 22 cenários em 120 contas sintéticas e testei o modelo com **71 testes unitários, 5 de integração e 13 E2E (Playwright)**, assumindo e registrando as limitações de uma heurística.
- Conduzi o ciclo completo de um estudo de caso de Customer Success: discovery com reuniões simuladas, requisitos rastreáveis, ADRs, sprints, retrospectiva e evolução v1.1 (alerta de queda brusca), além de modelo e medidas DAX para Power BI.

## Post de LinkedIn

> Construí um painel de saúde de clientes do zero, como estudo de caso, e o que mais me ensinou não foi o código.
>
> O "Termômetro" mostra a saúde de 120 clientes de um SaaS fictício de gestão de frotas (verde, amarelo, vermelho), explica por quê e sugere o que o time de CS deve fazer.
>
> Três coisas que aprendi:
>
> 1. A líder queria um número só; o CSM queria contexto. A solução não foi escolher um lado: número em destaque, motivo em uma linha, explicação completa na conta.
> 2. Recusei um pedido: mostrar "78% de chance de cancelar". Sem histórico real de cancelamentos, seria um número inventado com cara de ciência. O score é uma heurística e deixo isso escrito.
> 3. Testei a sensibilidade do modelo: a ordem das contas é estável a mudanças de peso, mas a cor muda bastante perto das fronteiras (deslocar o limite em 5 pontos muda a cor de 19 contas de 120). Conclusão prática: priorizar pela ordem de urgência.
>
> Tudo é sintético e simulado (e está dito no README). Código, decisões, testes e prints no repositório: https://github.com/Joaogabrielmaia/Customer-Health
>
> #CustomerSuccess #CS #SaaS #Produto #Engenharia

## Resposta de 30 segundos
"Criei o Termômetro, um painel que dá a cada cliente de um SaaS um score de saúde de 0 a 100, explica por que ele está assim e sugere a próxima ação do time de CS. O diferencial é a transparência: o modelo é simples, documentado, testado e vem com análise de sensibilidade. É um estudo de caso com dados sintéticos e eu deixo claro que o score é uma heurística, não uma previsão."

## Resposta de 2 minutos
"Parti de um problema que eu conheço do atendimento: o time só descobre que o cliente esfriou na hora do cancelamento. Escolhi, numa matriz de decisão, construir um painel de saúde, porque era a ideia que atacava a falta de visibilidade para toda a carteira.

Fiz o discovery com três reuniões simuladas, em que o Claude interpretou a líder de CS, um CSM e um dono de transportadora, e isso gerou conflitos reais de requisito: a líder queria um número só e o CSM queria contexto. Resolvi com número em destaque e a explicação logo abaixo. Uma restrição do time, de uns 15 contatos por semana por pessoa, me levou a criar a urgência: risco vezes valor vezes proximidade da renovação.

O score tem seis dimensões (adoção, engajamento, suporte, satisfação, financeiro e contrato), com pesos configuráveis e regra para dado ausente. Fiz uma análise de sensibilidade: a ordem das contas é estável, mas a cor é sensível aos limites, então recomendo priorizar pela urgência.

Implementei em Next.js, TypeScript, Prisma e PostgreSQL, com 71 testes unitários, 5 de integração e 13 E2E, e entreguei uma v1.1 com alerta de queda brusca. Recusei mostrar 'chance de cancelar em %' porque não tenho histórico real para isso. Os dados são sintéticos e eu digo isso no README; o próximo passo real seria calibrar o score com dados de cancelamento de verdade."
