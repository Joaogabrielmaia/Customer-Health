# 02 · Roadmap

Itens ordenados por valor esperado (hipótese) e esforço. Nada abaixo foi medido.

```mermaid
flowchart LR
    V10[v1.0.0<br/>MVP] --> V11[v1.1.0<br/>Alerta de queda brusca]
    V11 --> V12[v1.2<br/>Histórico de configuração<br/>+ zona cinzenta + selo de renovação]
    V12 --> V13[v1.3<br/>QBR por conta]
    V13 --> V20[v2.0<br/>Calibração com dados reais<br/>+ alertas por e-mail]
```

| Versão | Item | Por quê | Dependência |
|---|---|---|---|
| v1.1 ✅ | Alerta de queda brusca de score | Descobrir quedas cedo (pedido do CSM) | Variação de 30 dias (já existia) |
| v1.2 | Histórico versionado de configurações (RN-14) | Rastrear quem mudou pesos e quando (risco R-05) | Nova tabela e tela |
| v1.2 | "Zona cinzenta" a ±5 pontos de uma fronteira de cor e selo de renovação na lista | A sensibilidade mostrou que a cor é frágil perto da fronteira | Nenhuma |
| v1.3 | Relatório de QBR por conta (PDF/HTML) | Reaproveitar a explicação do score em reunião com o cliente | Estabilidade do modelo |
| v1.3 | Pré-agregação de uso por dia (desempenho) | Tendência e sensibilidade lentas | Migração |
| v2.0 | **Calibração com histórico real de cancelamento** | Única forma de validar o score de fato | Dados reais anonimizados |
| v2.0 | Alertas por e-mail | Pedido do CSM, exige serviço de envio | v1.1 validado |
| Aberto | Auditoria de acessibilidade automatizada (axe) | Lacuna declarada em qualidade | — |
| Aberto | Playbook de inadimplência | Hoje a dimensão financeira não dispara playbook | — |

## Fora do roadmap (decisão)
Modelo preditivo de aprendizado de máquina (antes de ter dados reais seria prematuro), multiempresa e CRM real.
