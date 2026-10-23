# 04 · Wireframes e reunião de validação

## Wireframes (antes de implementar)

### Painel executivo
```
+--------------------------------------------------------------+
| Termômetro                           Usuário · Papel   [Sair] |
| Painel | Contas em risco | Playbooks | Sensibilidade | Config |
+--------------------------------------------------------------+
| Painel executivo               [Exportar carteira] [Histórico]|
| [Score médio] [Críticas] [Receita em risco] [Receita atenção] |
| +-------------+ +------------------------------------------+ |
| | Rosca por   | | Tendência 12 semanas (linhas por cor)    | |
| | cor         | |                                          | |
| +-------------+ +------------------------------------------+ |
| +----------------------------------+ +---------------------+ |
| | Comparação por segmento (barras) | | Mais urgentes agora | |
| | + tabela                         | | 1. Conta  [cor] ... | |
| +----------------------------------+ +---------------------+ |
+--------------------------------------------------------------+
```

### Contas em risco
```
[Cor v] [Segmento v] [CSM v] [ ] Só minhas   [Filtrar] [Limpar]
N conta(s) · MRR somado R$ ...
# | Conta (segmento · CSM) | Score+cor+Δ | Principal motivo | MRR | Renovação | Urgência
```

### Visão da conta
```
< Contas em risco
Nome da conta            segmento · cidade · plano · MRR · CSM
[Dial 0-100] [cor] [Δ 30d] [aviso de confiança]   [Sparkline 12 sem]
Por que este score?
  Dimensão | Valor+barra | Peso usado | Contribuição | Mudança 30d | O que o dado mostra
  [O que puxa para baixo]  [O que mudou desde o período anterior]
O que fazer agora  -> playbooks disparados + modelo de mensagem [Copiar]
[Registrar ação do CS]                      [Linha do tempo]
```

## Reunião simulada de validação

> Simulação: o Claude interpretou o cliente nesta conversa.

**Participantes (fictícios):** Marcela Andrade (líder, Admin), Rafael Teixeira (CSM) e eu. Mostrei os wireframes acima e o modelo de dados.

### Mudanças pedidas e decisões

| # | Pedido | Quem | Decisão | Justificativa |
|---|---|---|---|---|
| 1 | "Quero ver o MRR em risco logo no topo, em reais" | Marcela | **Aceito**: dois indicadores, MRR das contas críticas e das amarelas | Responde a pergunta do diretor sem mudar o modelo |
| 2 | "Na lista, mostre uma frase com o motivo principal" | Rafael | **Aceito**: coluna "Principal motivo" (dimensão que mais tira pontos) | Evita abrir a conta só para saber o motivo |
| 3 | "Filtro de 'só minhas contas'" | Rafael | **Aceito** | CSM só atende a própria carteira |
| 4 | "Botão para copiar a mensagem do playbook" | Rafael | **Aceito** | Reduz o atrito de uso |
| 5 | "Deixa eu testar um peso antes de aplicar" | Marcela | **Aceito**: botão Simular, sem gravar | Reduz o risco R-05 (mudar régua sem ver o efeito) |
| 6 | "Mostre a **chance de cancelar em %**" | Marcela | **Recusado** | Veja abaixo |
| 7 | "Alerta por e-mail quando a conta cair de cor" | Rafael | **Adiado** (roadmap; entregue na v1.1 como alerta dentro do painel) | Fora do escopo do MVP; exigiria serviço de e-mail |
| 8 | "Esconder as dimensões e mostrar só o número para o diretor" | Marcela | **Parcial**: o painel executivo mostra só números agregados; a conta sempre mostra a explicação | O número sem explicação é o que o Rafael pediu para evitar |

### Recusa justificada: "chance de cancelar em %"
**Pedido.** Exibir "78% de chance de cancelar" por conta, porque "o diretor entende porcentagem".

**Por que recusei.** (1) Não existe histórico de cancelamentos para calibrar uma probabilidade; qualquer percentual seria **inventado** e passaria a falsa precisão. (2) O score é uma heurística de sinais, não um modelo estatístico. (3) Um número "científico" tende a ser usado como verdade e a decisão deixa de ser discutida (risco R-03).

**Alternativa oferecida.** Mostrar a **cor, o score, o motivo principal e a urgência em reais**. Para o diretor, o MRR em risco comunica o tamanho do problema sem prometer probabilidade.

**Quando eu mudaria de ideia.** Com 12 meses de histórico real de cancelamentos e uma calibração validada (separação entre contas que cancelaram e que renovaram), uma probabilidade passa a ter base.

### Ajustes derivados da reunião
Incluí o motivo principal na lista, o filtro "só minhas contas", o botão copiar, a simulação de pesos e o MRR em atenção no painel.
