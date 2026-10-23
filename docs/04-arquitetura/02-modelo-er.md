# 02 · Modelo de dados (ER)

Fonte da verdade: [`prisma/schema.prisma`](../../prisma/schema.prisma) e a migração em `prisma/migrations`.

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : "é CSM de"
    USER ||--o{ CS_ACTION : registra
    ACCOUNT ||--o{ CONTRACT : possui
    ACCOUNT ||--o{ USAGE_EVENT : gera
    ACCOUNT ||--o{ TICKET : abre
    ACCOUNT ||--o{ NPS_RESPONSE : responde
    ACCOUNT ||--o{ INVOICE : recebe
    ACCOUNT ||--o{ CS_ACTION : "recebe ação"

    USER {
        string id PK
        string name
        string email UK
        string passwordHash
        enum role "ADMIN | CSM"
    }
    ACCOUNT {
        string id PK
        string name
        string segment
        enum plan "BASICO | PROFISSIONAL | FROTA_PLUS"
        int vehicles
        int mrr
        string city
        datetime createdAt
        string csmId FK
    }
    CONTRACT {
        string id PK
        string accountId FK
        datetime startDate
        datetime endDate
        int mrr
    }
    USAGE_EVENT {
        int id PK
        string accountId FK
        datetime date
        string module "rotas, abastecimento, manutencao, motoristas, relatorios"
        int count
    }
    TICKET {
        int id PK
        string accountId FK
        datetime openedAt
        datetime resolvedAt "nulo = aberto"
        string category
        enum severity "LOW | MEDIUM | HIGH"
        string title
    }
    NPS_RESPONSE {
        int id PK
        string accountId FK
        datetime date
        int score "0 a 10"
    }
    INVOICE {
        int id PK
        string accountId FK
        datetime dueDate
        datetime paidAt "nulo = não paga"
        int amount
    }
    CS_ACTION {
        int id PK
        string accountId FK
        string userId FK
        datetime createdAt
        enum channel "LIGACAO | EMAIL | WHATSAPP | REUNIAO"
        string playbook
        string note
        enum outcome "RESOLVIDO | EM_ANDAMENTO | SEM_RESPOSTA | ESCALADO"
        float scoreAtTime
        string colorAtTime
    }
    SCORE_CONFIG_ROW {
        string id PK "default"
        json weights
        json thresholds
        datetime updatedAt
        string updatedBy
    }
```

`SCORE_CONFIG_ROW` não tem relação com as demais: é uma configuração global de linha única (ADR-003).

## Índices
Todas as tabelas de eventos têm índice composto por conta e data (`accountId, date`/`openedAt`/`dueDate`), que é o padrão de acesso do cálculo. Há índices em `Account.csmId` e `Account.segment` para os filtros.

## Decisões de modelagem relevantes
- `mrr` é inteiro em reais (sem centavos), suficiente para o estudo; em produção usaria centavos em inteiro.
- `Ticket.resolvedAt` e `Invoice.paidAt` nulos significam "em aberto"; o cálculo compara com a data `asOf` para reconstruir o estado no passado.
- Exclusão de uma conta remove seus eventos em cascata (`onDelete: Cascade`); testado na integração.
