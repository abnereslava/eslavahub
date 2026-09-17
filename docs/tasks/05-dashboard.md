# Tasks — Dashboard

O dashboard oferece uma visão operacional rápida sem duplicar toda a complexidade das telas de consulta. A implementação está disponível em `dashboard-service.js` e `dashboard-ui.js` e aguarda validação com dados reais no Firestore.

---

## TASK-033 — Implementar indicadores gerais

**Status:** IN PROGRESS  
**Prioridade:** P1  
**Dependências:** TASK-013, TASK-024, TASK-030

### Implementado

A rota `#/dashboard` é a página inicial autenticada e agrega projetos, pendências e domínios utilizando as mesmas constantes/regras dos módulos correspondentes.

### Critérios de aceite
- [x] exibe total de projetos ativos;
- [x] exibe quantidade de projetos em desenvolvimento;
- [x] exibe projetos com pendências abertas;
- [x] exibe quantidade total de pendências abertas;
- [x] exibe domínios que exigem atenção;
- [x] exibe domínios vencidos;
- [x] indicadores reutilizam as mesmas regras das listagens;
- [ ] indicadores validados contra dados reais no Firestore.

---

## TASK-034 — Implementar bloco de projetos em andamento

**Status:** IN PROGRESS  
**Prioridade:** P1  
**Dependências:** TASK-013, TASK-033

### Critérios de aceite
- [x] projetos em desenvolvimento são destacados no dashboard;
- [x] cada item permite navegar para os detalhes;
- [x] quantidade exibida é limitada a 5 itens;
- [x] existe acesso para visualizar a lista completa já filtrada;
- [x] ausência de projetos em andamento possui estado vazio;
- [ ] bloco validado com dados reais em navegador.

---

## TASK-035 — Implementar bloco de pendências relevantes

**Status:** IN PROGRESS  
**Prioridade:** P1  
**Dependências:** TASK-024, TASK-025, TASK-033

### Regra de seleção

Somente pendências abertas entram no bloco. A ordenação prioriza `HIGH`, depois `MEDIUM`, depois `LOW` e sem prioridade; dentro da mesma prioridade, prazos mais próximos vêm primeiro. São exibidos até 6 itens.

### Critérios de aceite
- [x] mostra apenas pendências consideradas abertas;
- [x] prioridade e prazo são considerados quando existentes;
- [x] pendência identifica claramente seu projeto;
- [x] item permite navegar para o projeto relacionado;
- [x] regra de seleção/ordenação está centralizada e documentada;
- [ ] resultado validado com dados reais.

---

## TASK-036 — Implementar bloco de próximos vencimentos

**Status:** IN PROGRESS  
**Prioridade:** P1  
**Dependências:** TASK-030, TASK-031, TASK-033

### Critérios de aceite
- [x] exibe domínios com vencimentos mais próximos;
- [x] vencidos aparecem antes dos vencimentos futuros;
- [x] mostra hostname, projeto e data de vencimento;
- [x] item permite navegar para o projeto relacionado;
- [x] domínios sem data de vencimento não são tratados como próximos de vencer;
- [ ] bloco validado com dados reais em navegador.
