# Sprint 2 · Revisão

**Foco:** fluxo do CS. **Requisitos:** RF-01, RF-02, RF-04 a RF-08 (HU-01 a HU-06).

## Entregue
- Login por e-mail e senha, sessão em cookie `httpOnly`, *middleware* de proteção, papéis Admin e CSM.
- Painel executivo (KPIs, rosca por cor, tendência de 12 semanas, comparação por segmento, mais urgentes).
- Contas em risco ordenadas por urgência com filtros.
- Visão da conta: dial do score, "Por que este score?", "O que mudou", playbooks com mensagem pronta e botão copiar, linha do tempo.
- Registro de ação do CS com validação e gravação de score/cor no momento.
- Biblioteca de playbooks (5).

## O que descobri
- O Next.js também usa `role="alert"` (anunciador de rotas); o seletor dos testes E2E precisou ser mais específico.
- A porta 3000 da minha máquina já estava ocupada por outro projeto; o Termômetro passou a usar a **3100**.
- No primeiro print o gráfico de rosca saiu cortado, pois a animação do Recharts ainda estava rodando; desliguei as animações (e isso também deixa a tela mais estável para leitores de tela e testes).

## Números
Testes de integração: 5 passando. Build de produção compilando.

## Decisão para a sprint 3
Entregar pesos configuráveis **com simulação** (pedido da validação) e a sensibilidade em tela e em documento.
