# 04 · Minha retrospectiva final

Escrevo em primeira pessoa, olhando o projeto inteiro depois da v1.1.0.

## O que eu faria igual
- **Núcleo puro do score.** Poder testar o cálculo com dados montados à mão (e reutilizar a mesma função no servidor, nos scripts e no Power BI) foi a melhor decisão técnica. Ela me deixou criar a v1.1 em pouco código, porque a variação de 30 dias já existia.
- **Documentar limites junto com o número.** Escrever "o que o score não captura" e rotular tudo que é sintético me deu um argumento melhor do que qualquer métrica bonita.
- **Recusar a porcentagem de churn.** Foi o ponto da reunião de validação que mais me orgulha: aprendi que dizer não com alternativa é parte do trabalho de CS e de produto.

## O que eu faria diferente
- **Calibrar o gerador antes de escrever as regras de cor.** Comecei com 109 verdes e 0 vermelhos e tive de ajustar arquétipos e limites. Isso está registrado, mas custou retrabalho e me expôs ao risco de "ajustar o dado até o painel ficar bonito". A defesa foi anotar tudo e nunca chamar isso de validação.
- **Medir o tempo de carregamento da página inteira**, não só o cálculo. Medi o cálculo (≈ 106 ms para a carteira; ≈ 800 ms para a tendência) mas não o tempo total no navegador.
- **Rodar auditoria de acessibilidade** (axe) em vez de confiar só em rótulos e texto além da cor.
- **Começar a tendência com pré-agregação de uso**, em vez de recalcular tudo a cada acesso. Escolhi simplicidade (ADR-001) e sei que ela custa em escala.

## O que aprendi
1. **Estabilidade não é validade.** A sensibilidade mostrou que a ordem das contas é robusta (Spearman ≥ 0,936), mas isso só diz que o modelo é consistente, não que acerta.
2. **A cor é mais frágil que a ordem.** Deslocar 5 pontos nos limites muda 19 (ou 11) contas de cor. Isso mudou a minha recomendação de uso: priorizar pela urgência.
3. **Teste simples acha bug real.** Uma checagem de "nenhum evento no futuro" pegou um erro do gerador que eu não teria visto olhando as telas.
4. **O ambiente também testa.** Uma porta ocupada e um seletor ambíguo derrubaram testes por motivos que nada tinham a ver com o produto; registrei esses episódios em vez de escondê-los.

## O que ficou em aberto
- Calibração com **dados reais**: o único passo que transforma o score de heurística em algo defensável.
- Histórico versionado de configurações, zona cinzenta na cor, QBR por conta, alertas por e-mail ([roadmap](02-roadmap.md)).
- O relatório do Power BI: entreguei CSVs, modelo e DAX, mas **eu ainda preciso montar o relatório e tirar os prints**.
- A seção do README sobre a minha experiência real com clientes e suporte, que é minha e não pode ser escrita por mim em nome de ninguém.

## Como eu apresentaria isto numa entrevista
Em dois minutos: o problema (descobrir tarde que o cliente esfriou), a decisão (painel explicável), um conflito (número × contexto) e como o resolvi, uma recusa justificada e um resultado honesto da análise de sensibilidade. E, de propósito, a limitação: dados sintéticos e heurística.
