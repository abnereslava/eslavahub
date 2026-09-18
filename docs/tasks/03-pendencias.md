# Tasks — Pendências

Este bloco implementa o acompanhamento do que ainda precisa ser feito em cada projeto. Os fluxos estão implementados em código e aguardam validação end-to-end com Firestore real.

---

## TASK-021 — Implementar listagem de pendências no projeto

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-012, TASK-015

### Implementado

Pendências são carregadas dentro da ficha do projeto, com status, descrição, área, prioridade e prazo. Itens abertos aparecem antes dos concluídos/descartados.

### Critérios de aceite
- [x] pendências do projeto são exibidas na ficha correspondente;
- [x] estado, descrição e área aparecem quando disponíveis;
- [x] concluídas/descartadas são diferenciadas visualmente;
- [x] projeto sem pendências possui estado vazio;
- [x] ordenação inicial prioriza abertas, prioridade e prazo;
- [x] listagem validada contra Firestore real.

---

## TASK-022 — Implementar criação de pendência

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-012, TASK-021

### Critérios de aceite
- [x] descrição é obrigatória;
- [x] área, prioridade, prazo e notas são opcionais;
- [x] criação vincula a pendência ao projeto atual;
- [x] estado inicial padrão é `PENDING`;
- [x] após criação a lista é recarregada automaticamente;
- [x] criação validada em Firestore real.

---

## TASK-023 — Implementar edição de pendência

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-022

### Critérios de aceite
- [x] campos permitidos podem ser alterados;
- [x] projeto relacionado não aparece como campo editável;
- [x] descrição continua obrigatória;
- [x] alterações persistidas atualizam `updated_at` pela camada comum;
- [x] cancelamento volta à listagem sem persistir o formulário;
- [x] edição validada em Firestore real.

---

## TASK-024 — Implementar fluxo de status e conclusão

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-022

### Critérios de aceite
- [x] estados `PENDING`, `IN_PROGRESS`, `WAITING`, `COMPLETED` e `DISCARDED` são suportados;
- [x] ao entrar em `COMPLETED`, `completed_at` recebe timestamp do servidor;
- [x] ao sair de `COMPLETED`, `completed_at` é limpo;
- [x] concluídas e descartadas não entram na contagem padrão de abertas;
- [x] alteração de estado atualiza a contagem exibida na própria seção;
- [x] transições validadas em Firestore real.

---

## TASK-025 — Implementar prioridade e prazo

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-022

### Critérios de aceite
- [x] prioridade pode ser informada opcionalmente;
- [x] prazo pode ser informado opcionalmente;
- [x] prioridade e prazo aparecem na listagem quando existentes;
- [x] pendência sem prioridade ou prazo permanece válida;
- [x] ordenação existente já pode utilizar esses campos;
- [x] persistência validada em Firestore real.

---

## TASK-026 — Implementar descarte/exclusão controlada de pendência

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-024

### Implementado

O MVP utiliza descarte lógico (`DISCARDED`) com confirmação explícita. Exclusão definitiva não foi exposta na interface.

### Critérios de aceite
- [x] usuário consegue marcar uma pendência como descartada;
- [x] descarte preserva o documento e seu histórico mínimo;
- [x] não existe exclusão definitiva silenciosa na UI;
- [x] pendência descartada não entra na contagem de abertas;
- [x] descarte validado em Firestore real.
