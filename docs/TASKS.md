# Backlog de Implementação — EslavaHub

**Versão:** 0.8  
**Origem:** `docs/PROPOSTA.md` e `docs/SDD.md`  
**Escopo:** MVP

Este documento transforma a especificação do EslavaHub em um plano de implementação.

## Convenções

- `TODO` — ainda não iniciada;
- `IN PROGRESS` — implementada parcialmente ou aguardando validação end-to-end;
- `BLOCKED` — depende de decisão ou entrega pendente;
- `DONE` — critérios de aceite atendidos.

Prioridades: `P0` essencial, `P1` necessária ao MVP e `P2` melhoria importante.

---

## Progresso atual

- **DONE:** 60/61
- **IN PROGRESS:** 0/61
- **TODO:** 1/61

O núcleo funcional do MVP já está implementado em código: modelos Firestore, projetos, cadastros auxiliares, pendências, domínios, dashboard, busca, filtros, ordenação e paginação. Testes unitários e lint passam no GitHub Actions.

A aplicação foi validada manualmente em navegador com Firebase real. A única task restante é a suíte end-to-end automatizada dos fluxos principais (`TASK-046`).

---

## Marcos

| Marco | Objetivo | Tasks |
| --- | --- | --- |
| M0 — Fundação | Definir base técnica e persistência | TASK-001 a TASK-012 |
| M1 — Núcleo de projetos | Gerenciar projetos de ponta a ponta | TASK-013 a TASK-020 |
| M2 — Acompanhamento | Pendências e domínios | TASK-021 a TASK-032 |
| M3 — Visão operacional | Dashboard, consulta e cadastros | TASK-033 a TASK-041 |
| M4 — Qualidade e entrega | Robustez, testes e disponibilização | TASK-042 a TASK-048 |
| M5 — Redesign visual | Reestruturar aparência sem alterar o comportamento consolidado | TASK-049 a TASK-060 |
| M6 — Enriquecimento de dados | Completar metadados dos projetos a partir do GitHub | TASK-061 |

---

## Resumo do backlog

### Fundação e arquitetura

- [x] TASK-001 — Definir stack do MVP — **DONE**
- [x] TASK-002 — Definir estratégia de autenticação e acesso — **DONE**
- [x] TASK-003 — Criar estrutura inicial da aplicação — **DONE**
- [x] TASK-004 — Configurar ambientes e variáveis/configuração — **DONE**
- [x] TASK-005 — Definir padrão de arquitetura e organização interna — **DONE**
- [x] TASK-006 — Configurar qualidade básica do código — **DONE**

Detalhes: [`tasks/00-fundacao.md`](tasks/00-fundacao.md)

### Persistência e modelo de dados

- [x] TASK-007 — Definir banco de dados e estratégia de persistência — **DONE**
- [x] TASK-008 — Implementar modelo `Project` — **DONE**
- [x] TASK-009 — Implementar modelos `Category` e `ProjectStatus` — **DONE**
- [x] TASK-010 — Implementar modelo `Technology` e relação N:N — **DONE**
- [x] TASK-011 — Implementar modelo `Domain` — **DONE**
- [x] TASK-012 — Implementar modelo `PendingItem` — **DONE**

Detalhes: [`tasks/01-modelo-de-dados.md`](tasks/01-modelo-de-dados.md)

### Projetos

- [x] TASK-013 — Listagem de projetos — **DONE**
- [x] TASK-014 — Cadastro de projeto — **DONE**
- [x] TASK-015 — Página de detalhes — **DONE**
- [x] TASK-016 — Edição — **DONE**
- [x] TASK-017 — Arquivamento/restauração — **DONE**
- [x] TASK-018 — Tecnologias por projeto — **DONE**
- [x] TASK-019 — Links rápidos — **DONE**
- [x] TASK-020 — Validações — **DONE**

Detalhes: [`tasks/02-projetos.md`](tasks/02-projetos.md)

### Pendências

- [x] TASK-021 — Listagem — **DONE**
- [x] TASK-022 — Criação — **DONE**
- [x] TASK-023 — Edição — **DONE**
- [x] TASK-024 — Fluxo de status/conclusão — **DONE**
- [x] TASK-025 — Prioridade e prazo — **DONE**
- [x] TASK-026 — Descarte controlado — **DONE**

Detalhes: [`tasks/03-pendencias.md`](tasks/03-pendencias.md)

### Domínios

- [x] TASK-027 — Cadastro de domínio — **DONE**
- [x] TASK-028 — Normalização/validação de hostname — **DONE**
- [x] TASK-029 — Domínio principal — **DONE**
- [x] TASK-030 — Cálculo de vencimento — **DONE**
- [x] TASK-031 — Alertas visuais — **DONE**
- [x] TASK-032 — Visão global — **DONE**

Detalhes: [`tasks/04-dominios.md`](tasks/04-dominios.md)

### Dashboard

- [x] TASK-033 — Indicadores gerais — **DONE**
- [x] TASK-034 — Projetos em andamento — **DONE**
- [x] TASK-035 — Pendências relevantes — **DONE**
- [x] TASK-036 — Próximos vencimentos — **DONE**

Detalhes: [`tasks/05-dashboard.md`](tasks/05-dashboard.md)

### Consulta e cadastros auxiliares

- [x] TASK-037 — Busca textual — **DONE**
- [x] TASK-038 — Filtros combináveis — **DONE**
- [x] TASK-039 — Ordenação/paginação — **DONE**
- [x] TASK-040 — Gestão de categorias — **DONE**
- [x] TASK-041 — Gestão de tecnologias — **DONE**

Detalhes: [`tasks/06-consulta-e-cadastros.md`](tasks/06-consulta-e-cadastros.md)

### Qualidade e entrega

- [x] TASK-042 — Estados de loading/vazio/erro — **DONE**
- [x] TASK-043 — Responsividade — **DONE**
- [x] TASK-044 — Acessibilidade básica — **DONE**
- [x] TASK-045 — Testes das regras críticas — **DONE**
- [ ] TASK-046 — Testes dos fluxos principais — **TODO**
- [x] TASK-047 — Dados iniciais e estratégia de migração — **DONE**
- [x] TASK-048 — Build e deploy — **DONE**

Detalhes: [`tasks/07-qualidade-e-entrega.md`](tasks/07-qualidade-e-entrega.md)

### Redesign visual

- [x] TASK-049 — Auditoria visual do sistema — **DONE**
- [x] TASK-050 — Criar design tokens do EslavaHub — **DONE**
- [x] TASK-051 — Padronizar tipografia e hierarquia — **DONE**
- [x] TASK-052 — Padronizar spacing, radius, bordas e elevação — **DONE**
- [x] TASK-053 — Unificar componentes de interação — **DONE**
- [x] TASK-054 — Redesenhar shell e navegação — **DONE**
- [x] TASK-055 — Redesenhar visualmente Dashboard — **DONE**
- [x] TASK-056 — Refinar tabela e toolbar de Projetos — **DONE**
- [x] TASK-057 — Refinar Detalhe do Projeto — **DONE**
- [x] TASK-058 — Harmonizar Pendências, Domínios e Cadastros — **DONE**
- [x] TASK-059 — Revisão responsiva e acessibilidade visual — **DONE**
- [x] TASK-060 — QA visual e regressão funcional do redesign — **DONE**

Plano: [`UX_REDESIGN_PLAN.md`](UX_REDESIGN_PLAN.md)  
Detalhes: [`tasks/08-redesign-visual.md`](tasks/08-redesign-visual.md)

### Enriquecimento de dados

- [x] TASK-061 — Localizar repositórios no GitHub e vincular aos projetos — **DONE**

Detalhes: [`tasks/09-repository-links.md`](tasks/09-repository-links.md)

---

## Próximo passo

A única pendência do backlog atual é a `TASK-046`: implementar uma suíte end-to-end automatizada para os fluxos principais.

## Migração

A estratégia para os 27 registros da planilha legada está em [`MIGRATION_PLAN.md`](MIGRATION_PLAN.md). IDs antigos não serão usados como IDs internos, inclusive porque existe duplicidade do ID legado `0024`.

---

## Fora do MVP / backlog futuro

- integração automática com a API do GitHub;
- importador permanente da planilha;
- notificações por e-mail, push ou calendário;
- renovação automática de domínio;
- consulta automática de registrador/WHOIS;
- gestão completa de clientes/CRM;
- colaboração multiusuário avançada;
- histórico detalhado de alterações;
- métricas de código, commits, builds e uptime.
