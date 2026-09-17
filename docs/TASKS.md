# Backlog de Implementação — EslavaHub

**Versão:** 0.1  
**Origem:** `docs/PROPOSTA.md` e `docs/SDD.md`  
**Escopo:** MVP

Este documento transforma a especificação funcional e técnica do EslavaHub em um plano de implementação. As tasks descrevem **o que precisa ser entregue**; decisões de tecnologia permanecem abertas até a conclusão das tasks de fundação.

## Convenções

### Status

- `TODO` — ainda não iniciada;
- `IN PROGRESS` — em execução;
- `BLOCKED` — depende de decisão ou entrega pendente;
- `DONE` — critérios de aceite atendidos.

### Prioridade

- `P0` — necessária para o funcionamento básico do MVP;
- `P1` — necessária para completar o MVP, mas depende do núcleo funcional;
- `P2` — melhoria importante, não bloqueia a primeira versão utilizável.

### Regra de conclusão

Uma task só deve ser marcada como `DONE` quando seus critérios de aceite estiverem atendidos. Implementação parcial não equivale a conclusão.

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

- [ ] TASK-001 — Definir stack do MVP
- [ ] TASK-002 — Definir estratégia de autenticação e acesso
- [ ] TASK-003 — Criar estrutura inicial da aplicação
- [ ] TASK-004 — Configurar ambientes e variáveis
- [ ] TASK-005 — Definir padrão de arquitetura e organização interna
- [ ] TASK-006 — Configurar qualidade básica do código

Detalhes: [`tasks/00-fundacao.md`](tasks/00-fundacao.md)

### Persistência e modelo de dados

- [ ] TASK-007 — Definir banco de dados e estratégia de persistência
- [ ] TASK-008 — Implementar modelo `Project`
- [ ] TASK-009 — Implementar modelos `Category` e `ProjectStatus`
- [ ] TASK-010 — Implementar modelo `Technology` e relação N:N
- [ ] TASK-011 — Implementar modelo `Domain`
- [ ] TASK-012 — Implementar modelo `PendingItem`

Detalhes: [`tasks/01-modelo-de-dados.md`](tasks/01-modelo-de-dados.md)

### Projetos

- [ ] TASK-013 — Implementar listagem de projetos
- [ ] TASK-014 — Implementar cadastro de projeto
- [ ] TASK-015 — Implementar página de detalhes do projeto
- [ ] TASK-016 — Implementar edição de projeto
- [ ] TASK-017 — Implementar arquivamento e restauração
- [ ] TASK-018 — Implementar tecnologias por projeto
- [ ] TASK-019 — Implementar links rápidos de repositório e deploy
- [ ] TASK-020 — Implementar validações do módulo de projetos

Detalhes: [`tasks/02-projetos.md`](tasks/02-projetos.md)

### Pendências

- [ ] TASK-021 — Implementar listagem de pendências no projeto
- [ ] TASK-022 — Implementar criação de pendência
- [ ] TASK-023 — Implementar edição de pendência
- [ ] TASK-024 — Implementar fluxo de status e conclusão
- [ ] TASK-025 — Implementar prioridade e prazo
- [ ] TASK-026 — Implementar descarte/exclusão controlada de pendência

Detalhes: [`tasks/03-pendencias.md`](tasks/03-pendencias.md)

### Domínios

- [ ] TASK-027 — Implementar cadastro de domínio
- [ ] TASK-028 — Implementar normalização e validação de hostname
- [ ] TASK-029 — Implementar domínio principal por projeto
- [ ] TASK-030 — Implementar cálculo de vencimento
- [ ] TASK-031 — Implementar alertas visuais de domínio
- [ ] TASK-032 — Implementar visão/listagem de domínios

Detalhes: [`tasks/04-dominios.md`](tasks/04-dominios.md)

### Dashboard

- [ ] TASK-033 — Implementar indicadores gerais
- [ ] TASK-034 — Implementar bloco de projetos em andamento
- [ ] TASK-035 — Implementar bloco de pendências relevantes
- [ ] TASK-036 — Implementar bloco de próximos vencimentos

Detalhes: [`tasks/05-dashboard.md`](tasks/05-dashboard.md)

### Consulta e cadastros auxiliares

- [ ] TASK-037 — Implementar busca textual de projetos
- [ ] TASK-038 — Implementar filtros combináveis
- [ ] TASK-039 — Implementar ordenação e paginação/carregamento
- [ ] TASK-040 — Implementar gestão de categorias
- [ ] TASK-041 — Implementar gestão de tecnologias

Detalhes: [`tasks/06-consulta-e-cadastros.md`](tasks/06-consulta-e-cadastros.md)

### Qualidade e entrega

- [ ] TASK-042 — Implementar estados de carregamento, vazio e erro
- [ ] TASK-043 — Revisar responsividade
- [ ] TASK-044 — Revisar acessibilidade básica
- [ ] TASK-045 — Implementar testes das regras de negócio críticas
- [ ] TASK-046 — Implementar testes dos fluxos principais
- [ ] TASK-047 — Preparar dados iniciais e estratégia de migração
- [ ] TASK-048 — Configurar build e deploy do MVP

Detalhes: [`tasks/07-qualidade-e-entrega.md`](tasks/07-qualidade-e-entrega.md)

---

## Ordem recomendada

```text
TASK-001 → TASK-006
        ↓
TASK-007 → TASK-012
        ↓
TASK-013 → TASK-020
        ↓
TASK-021 → TASK-032
        ↓
TASK-033 → TASK-041
        ↓
TASK-042 → TASK-048
```

Tasks independentes dentro de um mesmo bloco podem ser executadas em paralelo quando suas dependências permitirem.

---

## Fora do MVP / backlog futuro

Os itens abaixo não fazem parte das 48 tasks do MVP:

- integração automática com a API do GitHub;
- importação automatizada da planilha original;
- notificações por e-mail, push ou calendário;
- renovação automática de domínio;
- consulta automática de registrador/WHOIS;
- gestão completa de clientes/CRM;
- colaboração multiusuário avançada;
- histórico/auditoria detalhada de todas as alterações;
- tela global avançada de pendências;
- métricas de código, commits, builds e disponibilidade de deploy.

Esses itens podem virar novos épicos após a primeira versão utilizável.
