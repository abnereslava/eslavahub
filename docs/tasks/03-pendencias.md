# Tasks — Pendências

Este bloco implementa o acompanhamento do que ainda precisa ser feito em cada projeto.

---

## TASK-021 — Implementar listagem de pendências no projeto

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-012, TASK-015

### Critérios de aceite
- [ ] pendências do projeto são exibidas na ficha correspondente;
- [ ] estado, descrição e área aparecem quando disponíveis;
- [ ] concluídas podem ser diferenciadas visualmente das abertas;
- [ ] projeto sem pendências possui estado vazio apropriado;
- [ ] ordenação inicial é definida e consistente.

---

## TASK-022 — Implementar criação de pendência

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-012, TASK-021

### Critérios de aceite
- [ ] descrição é obrigatória;
- [ ] área, prioridade, prazo e notas são opcionais;
- [ ] pendência é vinculada ao projeto atual;
- [ ] estado inicial é definido de forma consistente;
- [ ] criação atualiza a lista sem exigir fluxo manual adicional.

---

## TASK-023 — Implementar edição de pendência

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-022

### Critérios de aceite
- [ ] campos permitidos podem ser alterados;
- [ ] projeto relacionado não é trocado acidentalmente;
- [ ] descrição continua obrigatória;
- [ ] alterações persistidas atualizam `updated_at`;
- [ ] cancelamento preserva os dados anteriores.

---

## TASK-024 — Implementar fluxo de status e conclusão

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-022

### Critérios de aceite
- [ ] estados `PENDING`, `IN_PROGRESS`, `WAITING`, `COMPLETED` e `DISCARDED` são suportados;
- [ ] ao entrar em `COMPLETED`, `completed_at` é preenchido;
- [ ] ao sair de `COMPLETED`, a política de `completed_at` definida no SDD é aplicada;
- [ ] concluídas e descartadas não entram na contagem padrão de abertas;
- [ ] alteração de estado atualiza indicadores relacionados.

---

## TASK-025 — Implementar prioridade e prazo

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-022

### Critérios de aceite
- [ ] prioridade pode ser informada opcionalmente;
- [ ] prazo pode ser informado opcionalmente;
- [ ] prioridade e prazo aparecem na listagem quando existentes;
- [ ] pendência sem prioridade ou prazo permanece válida;
- [ ] ordenações futuras podem utilizar esses campos sem alterar o modelo.

---

## TASK-026 — Implementar descarte/exclusão controlada de pendência

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-024

### Critérios de aceite
- [ ] usuário consegue marcar uma pendência como descartada;
- [ ] descarte preserva o histórico mínimo da pendência;
- [ ] eventual exclusão definitiva exige ação explícita e diferenciada;
- [ ] pendência descartada não aparece como aberta por padrão.
