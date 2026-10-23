# 05 · Riscos

| ID | Risco | Prob. | Impacto | Mitigação no produto | Sinal de alerta |
|---|---|---|---|---|---|
| R-01 | **Falso alarme**: conta amarela/vermelha que está bem, e o CSM perde tempo | Alta | Médio | Explicação por conta; o CSM registra resultado; revisar pesos com o feedback | CSM registra "sem problema" em muitas contas vermelhas |
| R-02 | **Falso negativo**: conta que vai cancelar aparece verde (o score não captura tudo) | Média | Alto | Limitações documentadas; playbook de renovação independe da cor; NPS qualitativo fica de fora | Cancelamento de conta verde |
| R-03 | **Excesso de confiança no número** (tratar heurística como previsão) | Alta | Alto | Rótulos "heurística" no rodapé e na documentação; não exibir % de chance de cancelar; aviso de confiança baixa | Líder cita o score como "probabilidade" |
| R-04 | **Circularidade dos dados sintéticos** (o modelo "acerta" porque os dados foram desenhados para isso) | Alta | Médio | Documentar; nunca chamar de acerto; sensibilidade mede estabilidade, não precisão | Alguém citar a análise como validação |
| R-05 | **Pesos mal configurados** mudam a leitura sem registro | Média | Médio | Só Admin salva; simulação antes; na v1 o histórico de mudanças de configuração não é guardado (roadmap) | Mudanças de cor sem explicação |
| R-06 | **CSM abandona o painel** se exigir digitação | Média | Alto | Único registro manual é a ação do CS; dados vêm do produto | Queda no número de ações registradas |
| R-07 | **Desempenho** cai com carteira maior (cálculo em tempo real) | Média | Médio | Medido em [desempenho](../04-arquitetura/05-desempenho.md); ADR-001 define quando migrar para lote | Painel acima de 2 s |
| R-08 | **Dado ausente vira nota baixa injusta** | Média | Médio | Regra RN-08: dimensão ausente sai do cálculo; confiança baixa sinalizada | Contas novas sempre vermelhas |
| R-09 | **Contas pequenas dominam a lista** ou, ao contrário, só as grandes aparecem | Média | Médio | Urgência combina risco × valor; filtros por segmento e CSM | Lista dominada por um único perfil |

## Como acompanhar
Os riscos R-01, R-02 e R-04 só podem ser avaliados com dados reais de cancelamento. Eles viram critérios de revisão do modelo no [roadmap](../06-pos-lancamento/02-roadmap.md).
