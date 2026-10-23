# 03 · Reunião 1 — Líder de CS

> Simulação: o Claude interpretou o cliente nesta conversa.

**Participantes (fictícios):** Marcela Andrade (líder de CS) e eu, João Gabriel.
**Objetivo:** entender o que ela espera do painel e o que ela decide com ele.

## Conversa (resumo)

**Marcela:** O que eu preciso é de **um número só** por cliente. Se eu abro o painel e vejo 83, 41, 67, eu decido em cinco segundos. Não quero ler texto.

**João:** Um número único é viável. Posso perguntar como você usaria o 41?

**Marcela:** Eu ligo para o responsável da conta e cobro do CSM. Preciso saber quem priorizar.

**João:** E se o CSM disser "esse 41 está errado, o cliente está bem"? Como você decidiria quem está certo?

**Marcela:** ...boa pergunta. Acho que eu confiaria no CSM. Então o número precisa ser "confiável".

**João:** Confiável para você significa explicável?

**Marcela:** Quero que o painel seja *confiável*, mas não quero "mais uma tela". Quero algo que aponte as contas que vão cancelar.

**João:** "Que vão cancelar" é uma previsão. Eu não consigo prometer isso com os dados que temos; consigo dizer quem está com sinais parecidos aos de quem cancelou antes.

**Marcela:** Então mostra a **chance de cancelar** em porcentagem, que o diretor entende.

## Pedidos e como refinei

| Pedido dela | Vago porque... | Refinamento |
|---|---|---|
| "Um número único" | Não diz como seria usado | Score 0–100 por conta + cor, **mais** a explicação em uma linha |
| "Confiável" | Sem critério | Todo score abre em "Por que este score?" com contribuição por dimensão |
| "Aponte quem vai cancelar" | É uma previsão | Ordenar por **urgência** = risco × valor × proximidade da renovação (ver [definição](05-processo-as-is-e-definicoes.md)) |
| "Chance de cancelar em %" | Seria falsa precisão | **Não atendido**: ver decisão |

## Restrição que mudou o escopo
**Marcela:** O time é de três pessoas. Cada CSM consegue conduzir uns **quinze contatos por semana**, não mais que isso. E eu não tenho integração com CRM: os dados saem do banco do produto e do financeiro por exportação.

**Efeito no escopo:** (1) a lista precisa ser **priorizada**, não apenas filtrada: surge a regra de urgência e a visão "mais urgentes agora"; (2) **integração com CRM sai do escopo**; os dados do estudo vêm do banco do próprio produto.

## Decisões da reunião
- Haverá um número único **e** a explicação (conciliando o pedido da Marcela com o do CSM; ver reunião 2).
- Não mostraremos "% de chance de cancelar": sem histórico de cancelamento real, seria um número inventado com ar de precisão.
- Painel executivo com carteira por cor, receita em risco e tendência.
