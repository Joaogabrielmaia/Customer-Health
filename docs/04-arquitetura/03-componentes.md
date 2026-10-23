# 03 · Diagrama de componentes

```mermaid
flowchart TB
    subgraph Navegador
        UI[Telas Next.js<br/>Painel, Risco, Conta, Playbooks,<br/>Sensibilidade, Configuração]
        CC[Componentes cliente<br/>Charts, ActionForm, ConfigForm]
    end

    subgraph "Servidor Next.js (App Router)"
        MW[middleware.ts<br/>valida sessão JWT]
        SA[Server Actions<br/>login, registerAction,<br/>previewConfig, saveConfig]
        API[/api/export<br/>CSV/]
        SC[lib/scored.ts<br/>dados + config + score]
        DATA[lib/data.ts<br/>carrega do Prisma<br/>cache 30 s só dos dados brutos]
        subgraph "Núcleo puro (sem I/O)"
            ENG[score/engine.ts<br/>computeScore, explainChange, urgency]
            DIM[score/dimensions.ts<br/>6 dimensões + PARAMS]
            PORT[score/portfolio.ts<br/>carteira e tendência]
            SENS[score/sensitivity.ts]
            PB[lib/playbooks.ts]
        end
    end

    DB[(PostgreSQL 16<br/>Docker Compose)]

    UI --> MW --> SC
    CC --> SA
    UI --> API
    SA --> DATA
    API --> SC
    SC --> DATA --> DB
    SA --> DB
    SC --> ENG --> DIM
    SC --> PORT --> ENG
    SC --> SENS --> PORT
    UI --> PB

    subgraph "Fora do servidor"
        GEN[scripts/seed/generate.ts<br/>gerador com semente]
        CLI[scripts: sensitivity, bench,<br/>export-powerbi, distribution]
    end
    GEN --> DB
    GEN --> CLI
    CLI --> ENG
```

## Por que esta divisão
- O **núcleo puro** (`src/lib/score`) não importa Prisma nem Next. Isso permite testar o cálculo com dados montados à mão (`tests/unit`) e reutilizar exatamente a mesma função no servidor, nos scripts de análise e na exportação para o Power BI.
- `lib/data.ts` é a única porta de entrada de dados do banco para o cálculo; o teste de integração verifica que o score vindo do banco é idêntico ao do gerador em memória.
- **Server Actions** concentram escrita (ação do CS, configuração) com validação Zod; leitura fica em componentes de servidor.
