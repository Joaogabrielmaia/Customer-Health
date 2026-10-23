# 02 · Reunião de aceitação

> Simulação: o Claude interpretou o cliente nesta conversa.

**Participantes (fictícios):** Marcela Andrade (líder, Admin), Rafael Teixeira (CSM) e eu.
**Formato:** demonstração do fluxo no sistema local com os dados sintéticos, seguida de checagem dos critérios de aceite. Os números citados vêm da [execução real](01-plano-e-resultados.md).

## Roteiro executado
1. Entrar como Rafael → painel → "Ver todas as contas em risco" → abrir a conta mais urgente → ler "Por que este score?" → registrar ação.
2. Entrar como Marcela → configuração → zerar financeiro e contrato, subir suporte → simular → recarregar (simulação some) → salvar → conferir painel → voltar ao padrão.
3. Exportar o CSV da carteira.
4. Abrir a sensibilidade.
5. Repetir o painel em 390 px de largura.

## Resultado por critério

| História | Critério | Resultado |
|---|---|---|
| HU-01 | Login, erro, rota protegida | **Aceito** (3 E2E passando) |
| HU-02 | Painel com KPIs, tendência e segmento | **Aceito** |
| HU-03 | Lista por urgência e filtro | **Aceito** (E2E: lista de críticas menor que a completa) |
| HU-04 | Explicação por dimensão e mudança em 30 dias | **Aceito** |
| HU-05 | Playbook sugerido com mensagem | **Aceito** |
| HU-06 | Registrar ação com validação | **Aceito** |
| HU-07 | Simular, salvar, recusar limites inválidos, CSM sem permissão | **Aceito** |
| HU-08 | Sensibilidade com 22 cenários | **Aceito** |
| HU-09 | CSV com 120 linhas | **Aceito** |
| HU-10 | Mobile sem rolagem horizontal da página | **Aceito** |
| HU-11 | Dados reproduzíveis | **Aceito** |

## Observações e ressalvas dos participantes

- **Marcela:** "A tendência mostra críticas indo de 0 para 11 em 12 semanas, e isso me preocupa. Mas é dado inventado, certo?" **Resposta:** sim; é o padrão que o gerador produz (arquétipos em queda). Não pode ser lido como achado de negócio.
- **Marcela:** "Quero saber quando mudei o peso e quem mudou." **Registro:** a v1 guarda só quem e quando foi a **última** alteração. Histórico versionado entrou no roadmap.
- **Rafael:** "A lista de risco ficou boa, mas as contas com renovação próxima não se destacam na lista, só dentro da conta." **Verificação:** o playbook de renovação aparece na conta quando a renovação está a 90 dias ou menos; na lista o destaque é a coluna "Renovação". **Decisão:** manter, anotar como melhoria possível (selo "renovação" na lista).
- **Rafael:** "Para o celular, a tabela da lista rola de lado." **Resposta:** a tabela tem rolagem horizontal **interna**; a página não rola (testado). Aceito para o MVP.
- **Ressalva de qualidade (minha):** o **cálculo** do painel cabe na meta de 2 s com 120 contas (não medi o tempo total da página), mas a sensibilidade em tela leva cerca de 2,8 s de cálculo; registrado em [desempenho](../04-arquitetura/05-desempenho.md).

## Decisão de aceite
O MVP foi **aceito** para o escopo do estudo, com três itens registrados para a evolução: histórico versionado da configuração, selo de renovação na lista e alerta de queda brusca (este último virou a v1.1).
