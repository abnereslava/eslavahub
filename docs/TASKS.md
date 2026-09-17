# Backlog de Implementação — EslavaHub

**Versão:** 0.4  
**Origem:** `docs/PROPOSTA.md` e `docs/SDD.md`  
**Escopo:** MVP

Este documento transforma a especificação do EslavaHub em um plano de implementação.

## Convenções

### Status

- `TODO` — ainda não iniciada;
- `IN PROGRESS` — implementada parcialmente ou aguardando validação end-to-end;
- `BLOCKED` — depende de decisão ou entrega pendente;
- `DONE` — critérios de aceite atendidos.

### Prioridade

- `P0` — necessária para o funcionamento básico do MVP;
- `P1` — necessária para completar o MVP, mas depende do núcleo funcional;
- `P2` — melhoria importante, não bloqueia a primeira versão utilizável.

Uma task só deve ser marcada como `DONE` quando seus critérios de aceite estiverem atendidos.

---

## Progresso atual

- **DONE:** 12/48
- **IN PROGRESS:** 29/48
- **TODO:** 7/48

O núcleo funcional do MVP já está implementado em código: modelos Firestore, projetos, cadastros auxiliares, pendências, domínios, dashboard, busca, filtros, ordenação e paginação. O GitHub Actions executa testes e lint com sucesso.

O principal ponto de validação pendente é executar a aplicação autenticada contra o projeto Firebase real para confirmar login Google, Security Rules, CRUD no Firestore e comportamento visual no navegador. Por isso, fluxos de UI/persistência permanecem `IN PROGRESS` mesmo quando a implementação está presente no repositório.

---

## Marcos

| Marco | Objetivo | Tasks |
| --- | --- | --- |
| M0 — Fundação | Definir base técnica e persistência | TASK-001 a TASK-012 |
| M1 — Núcleo de projetos | Permitir gerenciar projetos de ponta a ponta | TASK-013 a TASK-020 |
| M2 — Acompanhamento | Pendências e domínios | TASK-021 a TASK-032 |
| M3 — Visão operacional | Dashboard, busca, filtros e cadastros auxiliares | TASK-033 a TASK-041 |
| M4 — Qualidade e entrega | Robustez, testes e disponibilização | TASK-042 a TASK-048 |

---

## Resumo do backlog

### Fundação e arquitetura

- [x] TASK-001 — Definir stack do MVP — **DONE**
- [x] TASK-002 — Definir estratégia de autenticação e acesso — **DONE**
- [ ] TASK-003 — Criar estrutura inicial da aplicação — **IN PROGRESS**
- [x] TASK-004 — Configurar ambientes e variáveis/configuração — **DONE**
- [x] TASK-005 — Definir padrão de arquitetura e organização interna — **DONE**
- [x] TASK-006 — Configurar qualidade básica do código — **DONE**

Detalhes: [`tasks/00-fundacao.md`](tasks/00-fundacao.md)

### Persistência e modelo de dados

- [ ] TASK-007 — Definir banco de dados e estratégia de persistência — **IN PROGRESS**
- [x] TASK-008 — Implementar modelo `Project` — **DONE**
- [x] TASK-009 — Implementar modelos `Category` e `ProjectStatus` — **DONE**
- [x] TASK-010 — Implementar modelo `Technology` e relação N:N — **DONE**
- [x] TASK-011 — Implementar modelo `Domain` — **DONE**
- [x] TASK-012 — Implementar modelo `PendingItem` — **DONE**

Detalhes: [`tasks/01-modelo-de-dados.md`](tasks/01-modelo-de-dados.md)

### Projetos

- [ ] TASK-013 — Implementar listagem de projetos — **IN PROGRESS**
- [ ] TASK-014 — Implementar cadastro de projeto — **IN PROGRESS**
- [ ] TASK-015 — Implementar página de detalhes do projeto — **IN PROGRESS**
- [ ] TASK-016 — Implementar edição de projeto — **IN PROGRESS**
- [ ] TASK-017 — Implementar arquivamento e restauração — **IN PROGRESS**
- [ ] TASK-018 — Implementar tecnologias por projeto — **IN PROGRESS**
- [ ] TASK-019 — Implementar links rápidos de repositório e deploy — **IN PROGRESS**
- [ ] TASK-020 — Implementar validações do módulo de projetos — **IN PROGRESS**

Detalhes: [`tasks/02-projetos.md`](tasks/02-projetos.md)

### Pendências

- [ ] TASK-021 — Implementar listagem de pendências no projeto — **IN PROGRESS**
- [ ] TASK-022 — Implementar criação de pendência — **IN PROGRESS**
- [ ] TASK-023 — Implementar edição de pendência — **IN PROGRESS**
- [ ] TASK-024 — Implementar fluxo de status e conclusão — **IN PROGRESS**
- [ ] TASK-025 — Implementar prioridade e prazo — **IN PROGRESS**
- [ ] TASK-026 — Implementar descarte/exclusão controlada de pendência — **IN PROGRESS**

Detalhes: [`tasks/03-pendencias.md`](tasks/03-pendencias.md)

### Domínios

- [ ] TASK-027 — Implementar cadastro de domínio — **IN PROGRESS**
- [x] TASK-028 — Implementar normalização e validação de hostname — **DONE**
- [ ] TASK-029 — Implementar domínio principal por projeto — **IN PROGRESS**
- [x] TASK-030 — Implementar cálculo de vencimento — **DONE**
- [ ] TASK-031 — Implementar alertas visuais de domínio — **IN PROGRESS**
- [ ] TASK-032 — Implementar visão/listagem de domínios — **IN PROGRESS**

Detalhes: [`tasks/04-dominios.md`](tasks/04-dominios.md)

### Dashboard

- [ ] TASK-033 — Implementar indicadores gerais — **IN PROGRESS**
- [ ] TASK-034 — Implementar bloco de projetos em andamento — **IN PROGRESS**
- [ ] TASK-035 — Implementar bloco de pendências relevantes — **IN PROGRESS**
- [ ] TASK-036 — Implementar bloco de próximos vencimentos — **IN PROGRESS**

Detalhes: [`tasks/05-dashboard.md`](tasks/05-dashboard.md)

### Consulta e cadastros auxiliares

- [ ] TASK-037 — Implementar busca textual de projetos — **IN PROGRESS**
- [ ] TASK-038 — Implementar filtros combináveis — **IN PROGRESS**
- [ ] TASK-039 — Implementar ordenação e paginação/carregamento — **IN PROGRESS**
- [ ] TASK-040 — Implementar gestão de categorias — **IN PROGRESS**
- [ ] TASK-041 — Implementar gestão de tecnologias — **IN PROGRESS**

Detalhes: [`tasks/06-consulta-e-cadastros.md`](tasks/06-consulta-e-cadastros.md)

### Qualidade e entrega

- [ ] TASK-042 — Implementar estados de carregamento, vazio e erro — **TODO**
- [ ] TASK-043 — Revisar responsividade — **TODO**
- [ ] TASK-044 — Revisar acessibilidade básica — **TODO**
- [ ] TASK-045 — Implementar testes das regras de negócio críticas — **TODO**
- [ ] TASK-046 — Implementar testes dos fluxos principais — **TODO**
- [ ] TASK-047 — Preparar dados iniciais e estratégia de migração — **TODO**
- [ ] TASK-048 — Configurar build e deploy do MVP — **TODO**

Detalhes: [`tasks/07-qualidade-e-entrega.md`](tasks/07-qualidade-e-entrega.md)

---

## Próxima sequência

```text
validar TASK-003 + TASK-007 no Firebase real
        ↓
encerrar validações TASK-013 → TASK-041
        ↓
TASK-042 → TASK-047
        ↓
TASK-048 / publicação do MVP
```

Enquanto a validação Firebase não é executada, as tasks de qualidade independentes podem continuar sendo trabalhadas.

---

## Fora do MVP / backlog futuro

- integração automática com a API do GitHub;
- importação automatizada da planilha original;
- notificações por e-mail, push ou calendário;
- renovação automática de domínio;
- consulta automática de registrador/WHOIS;
- gestão completa de clientes/CRM;
- colaboração multiusuário avançada;
- histórico detalhado de alterações;
- tela global avançada de pendências;
- métricas de código, commits, builds e disponibilidade de deploy.
