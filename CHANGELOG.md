# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento semântico.

## [1.1.0] · 2026-10-23
### Adicionado
- Alerta de queda brusca de score: contas que perderam 15 pontos ou mais em 30 dias, com a dimensão que mais pesou (RF-14, HU-12, RN-17).
- Página `/alertas`, banner no painel executivo e item "Alertas" na navegação.
- 5 testes unitários, 1 E2E e 1 print novo (13-alertas-queda-brusca).

### Alterado
- Prints do painel atualizados com o banner.

## [1.0.0] · 2026-10-23 · MVP
### Adicionado
- Modelo de dados (contas, usuários, uso, chamados, NPS, faturas, contratos, ações, configuração) e migração inicial (RF-13).
- Gerador de dados sintéticos com semente fixa (RF-13).
- Motor do score com seis dimensões, dado ausente, cores, urgência e explicação de mudança (RF-03, RF-04).
- Login por e-mail e senha com papéis Admin e CSM (RF-01).
- Painel executivo, contas em risco, visão da conta, playbooks e registro de ações (RF-02, RF-05 a RF-08).
- Configuração de pesos com simulação e efeito imediato (RF-09, RF-10).
- Análise de sensibilidade em tela e em documento (RF-11).
- Exportação CSV de carteira, histórico e ações (RF-12).
- Testes unitários, de integração e E2E; 13 prints (v1.0); complemento para Power BI.
