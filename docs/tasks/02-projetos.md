# Tasks — Módulo de Projetos

Este bloco entrega a entidade central do EslavaHub e seus fluxos principais.

---

## TASK-013 — Implementar listagem de projetos

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-008, TASK-009

### Critérios de aceite
- [ ] projetos ativos são carregados por padrão;
- [ ] cada item apresenta ao menos ID, nome, categoria e status;
- [ ] projetos arquivados não aparecem na visão padrão;
- [ ] estado vazio possui tratamento próprio;
- [ ] cada item permite acessar seus detalhes.

---

## TASK-014 — Implementar cadastro de projeto

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-008, TASK-009, TASK-013

### Critérios de aceite
- [ ] formulário solicita nome, categoria e status como dados obrigatórios;
- [ ] cliente, repositório, deploy e observações permanecem opcionais;
- [ ] ID não é informado pelo usuário;
- [ ] projeto válido é persistido;
- [ ] sucesso e erro recebem feedback visual;
- [ ] usuário consegue acessar o projeto criado.

---

## TASK-015 — Implementar página de detalhes do projeto

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-013

### Critérios de aceite
- [ ] exibe identificação, categoria, status e cliente quando existente;
- [ ] exibe repositório e deploy quando existentes;
- [ ] exibe tecnologias associadas;
- [ ] reserva seções para domínios e pendências;
- [ ] exibe observações quando existentes;
- [ ] campos opcionais ausentes não geram blocos quebrados ou dados artificiais.

---

## TASK-016 — Implementar edição de projeto

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-014, TASK-015

### Critérios de aceite
- [ ] dados atuais são carregados no formulário;
- [ ] campos permitidos podem ser alterados;
- [ ] ID não pode ser editado;
- [ ] validações do cadastro também se aplicam à edição;
- [ ] `updated_at` é atualizado após persistência;
- [ ] cancelamento não altera dados.

---

## TASK-017 — Implementar arquivamento e restauração

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-015, TASK-016

### Critérios de aceite
- [ ] arquivamento exige ação explícita do usuário;
- [ ] `archived_at` é preenchido;
- [ ] dados relacionados permanecem preservados;
- [ ] projeto arquivado pode ser consultado por filtro específico;
- [ ] existe fluxo para restaurar projeto arquivado;
- [ ] restauração limpa/ajusta `archived_at` conforme a implementação escolhida.

---

## TASK-018 — Implementar tecnologias por projeto

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-010, TASK-015, TASK-016

### Critérios de aceite
- [ ] usuário pode associar múltiplas tecnologias;
- [ ] associação existente pode ser removida sem excluir o cadastro da tecnologia;
- [ ] tecnologias associadas aparecem nos detalhes;
- [ ] projeto sem tecnologia continua válido.

---

## TASK-019 — Implementar links rápidos de repositório e deploy

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-015

### Critérios de aceite
- [ ] links só aparecem quando cadastrados;
- [ ] repositório e deploy são visualmente distinguíveis;
- [ ] URLs válidas podem ser abertas a partir da ficha do projeto;
- [ ] ausência de link não gera placeholder enganoso.

---

## TASK-020 — Implementar validações do módulo de projetos

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-014, TASK-016

### Critérios de aceite
- [ ] nome vazio ou apenas com espaços é rejeitado;
- [ ] categoria inválida/inativa não pode ser atribuída a novo projeto;
- [ ] status inválido/inativo não pode ser atribuído a novo projeto;
- [ ] URLs preenchidas são validadas;
- [ ] campos opcionais vazios não bloqueiam salvamento;
- [ ] mensagens de validação identificam o campo com problema.
