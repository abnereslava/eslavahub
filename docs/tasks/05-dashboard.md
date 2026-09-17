# Tasks — Dashboard

O dashboard deve oferecer uma visão operacional rápida sem duplicar toda a complexidade das telas de consulta.

---

## TASK-033 — Implementar indicadores gerais

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-013, TASK-024, TASK-030

### Critérios de aceite
- [ ] exibe total de projetos ativos;
- [ ] exibe quantidade de projetos em desenvolvimento;
- [ ] exibe projetos com pendências abertas;
- [ ] exibe quantidade total de pendências abertas;
- [ ] exibe domínios que exigem atenção;
- [ ] exibe domínios vencidos;
- [ ] indicadores usam as mesmas regras das listagens do sistema.

---

## TASK-034 — Implementar bloco de projetos em andamento

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-013, TASK-033

### Critérios de aceite
- [ ] projetos em desenvolvimento são destacados no dashboard;
- [ ] cada item permite navegar para os detalhes;
- [ ] quantidade exibida é limitada de forma previsível;
- [ ] existe acesso para visualizar a lista completa correspondente;
- [ ] ausência de projetos em andamento possui estado vazio apropriado.

---

## TASK-035 — Implementar bloco de pendências relevantes

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-024, TASK-025, TASK-033

### Critérios de aceite
- [ ] mostra apenas pendências consideradas abertas;
- [ ] prioridade e prazo são considerados quando existentes;
- [ ] pendência identifica claramente seu projeto;
- [ ] item permite navegar para o projeto relacionado;
- [ ] regra de seleção/ordenação é consistente e documentada.

---

## TASK-036 — Implementar bloco de próximos vencimentos

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-030, TASK-031, TASK-033

### Critérios de aceite
- [ ] exibe domínios com vencimentos mais próximos;
- [ ] vencidos continuam visíveis como situação prioritária;
- [ ] mostra hostname, projeto e data de vencimento;
- [ ] item permite navegar para o projeto relacionado;
- [ ] domínios sem data de vencimento não são tratados como próximos de vencer.
