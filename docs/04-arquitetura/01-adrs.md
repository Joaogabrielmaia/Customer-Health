# 01 · Decisões de arquitetura (ADRs)

Formato: contexto, alternativas, escolha, motivo, trade-off e quando eu mudaria de ideia.

---

## ADR-001 · Cálculo em tempo real vs. em lote

**Contexto.** O score precisa refletir mudanças de configuração na hora (RF-09) e permitir "o que mudou em 30 dias" (RF-04), com 120 contas hoje.

**Alternativas.**
1. *Em lote*: job noturno grava o score de cada conta numa tabela.
2. *Em tempo real*: calcular a cada requisição a partir dos eventos.
3. *Híbrido*: calcular em tempo real e guardar em cache.

**Escolha.** Tempo real, com **cache de 30 s apenas dos dados brutos** (que só mudam quando o seed roda). Configuração e ações do CS sempre são lidas na hora.

**Motivo.** Com lote, trocar um peso exigiria recalcular tudo e o efeito não seria imediato; também teria de guardar uma versão por configuração. Em tempo real, a função pura recalcula qualquer data e qualquer configuração.

**Trade-off.** Custo cresce com a carteira. Medido na minha máquina (ver [desempenho](05-desempenho.md)): score da carteira ≈ 106 ms; a tendência de 12 semanas ≈ 800 ms; sensibilidade ≈ 2,8 s.

**Quando eu mudaria.** Acima de alguns milhares de contas, ou se a tendência passar de 2 s: gravar snapshots semanais por conta e calcular só o "agora" em tempo real.

---

## ADR-002 · Histórico de score

**Contexto.** Preciso de tendência (RF-02) e de comparação com 30 dias atrás (RF-04).

**Alternativas.** (1) Tabela `ScoreSnapshot` gravada periodicamente. (2) Reconstruir o histórico avaliando a função em datas passadas, já que todo evento tem data.

**Escolha.** Reconstruir (2). Não há tabela de snapshots.

**Motivo.** Um snapshot guardaria o score com a configuração **da época**; ao mudar os pesos, a tendência ficaria inconsistente (parte do histórico em uma régua, parte em outra). Reconstruir mantém **uma régua só**.

**Trade-off.** (a) Mais CPU por consulta. (b) Não registra "o que o painel mostrava naquele dia" (ex.: o que o CSM viu antes de agir). (c) Se um dado histórico for corrigido, a série muda.

**Quando eu mudaria.** Quando precisar de auditoria ("por que contatamos esta conta?"): aí gravo o snapshot **junto com a ação**, o que já faço parcialmente (RN-15 grava score e cor no registro).

---

## ADR-003 · Configuração de pesos

**Contexto.** A líder quer ajustar a régua sem pedir a um desenvolvedor.

**Alternativas.** (1) Constantes no código. (2) Variáveis de ambiente. (3) Linha única no banco, editável na tela, validada.

**Escolha.** (3): tabela `ScoreConfigRow` (linha `default`), pesos e limites em JSON validado por Zod (`configSchema`), só Admin salva, qualquer um simula.

**Motivo.** Efeito imediato (RF-09) sem *deploy*; a validação impede configurações inválidas (peso negativo, soma zero, limites invertidos).

**Trade-off.** Mudança de configuração altera **toda** a leitura e não deixa trilha na v1 (só `updatedAt` e `updatedBy` da última). É o risco R-05.

**Quando eu mudaria.** Ao ter mais de um administrador, crio histórico versionado de configurações e mostro a versão em uso no painel.

---

## ADR-004 · Modelo de dados

**Contexto.** Preciso de contas, usuários, uso, chamados, NPS, faturas, contratos e ações.

**Alternativas.** (1) Um evento por clique (`UsageEvent` granular). (2) Uso agregado por conta × dia × módulo. (3) Documentos JSON.

**Escolha.** PostgreSQL com Prisma; **uso agregado por dia e módulo** (`UsageEvent{accountId,date,module,count}`); contrato em tabela própria (renovações futuras viram novas linhas); ação do CS grava `scoreAtTime` e `colorAtTime`.

**Motivo.** O score só precisa de dias ativos e volume por módulo; granularidade por clique multiplicaria linhas sem mudar nenhuma fórmula. Contrato em tabela própria evita sobrescrever datas na renovação.

**Trade-off.** Não dá para responder perguntas por usuário ou por veículo. Agregar perde detalhes que um *drill-down* futuro pediria.

**Quando eu mudaria.** Se uma nova dimensão exigir granularidade (por exemplo, "veículos ativos"), incluo um campo ou uma tabela de eventos detalhados.

Modelo completo: [02-modelo-er.md](02-modelo-er.md).

---

## ADR-005 · Dados sintéticos com semente fixa

**Contexto.** Não há dados reais.

**Alternativas e escolha.** Ver [dados-sinteticos.md](../00-sobre-este-caso/dados-sinteticos.md). Escolhi gerador determinístico por arquétipos.

**Motivo.** Reprodutibilidade, testes e casos de borda deliberados.

**Trade-off.** Circularidade: o modelo "acerta" os arquétipos que eu desenhei. Por isso nenhum resultado em dado sintético é apresentado como acerto de churn.

**Quando eu mudaria.** Quando houver um *export* real anonimizado.

---

## ADR-006 · Autenticação simples por sessão assinada

**Contexto.** E-mail e senha, papéis Admin/CSM, sem multiempresa.

**Alternativas.** (1) Biblioteca completa de auth (NextAuth, etc.). (2) JWT assinado em cookie `httpOnly` com `jose` + `bcryptjs`.

**Escolha.** (2), com *middleware* que bloqueia rotas e API sem sessão válida.

**Motivo.** Menos dependências e superfície, suficiente para dois papéis num ambiente local.

**Trade-off.** Sem recuperação de senha, sem MFA, sem bloqueio por tentativas, sem revogação de sessão no servidor.

**Quando eu mudaria.** Qualquer uso fora de ambiente local: troco por um provedor de identidade e adiciono limite de tentativas.
