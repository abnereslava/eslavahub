# Tasks — Módulo de Projetos

Este bloco entrega a entidade central do EslavaHub e seus fluxos principais. O fluxo foi implementado em código e aguarda validação end-to-end com Firebase Authentication/Firestore reais antes de ser marcado como concluído.

---

## TASK-013 — Implementar listagem de projetos

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-008, TASK-009

### Implementado

- rota `#/projects`;
- listagem enriquecida com categoria e status;
- arquivados ocultos por padrão;
- estado vazio;
- acesso aos detalhes por item.

### Critérios de aceite
- [x] projetos ativos são carregados por padrão na implementação;
- [x] cada item apresenta ID, nome, categoria e status;
- [x] projetos arquivados não aparecem na visão padrão;
- [x] estado vazio possui tratamento próprio;
- [x] cada item permite acessar seus detalhes;
- [x] fluxo validado contra dados reais no Firestore.

---

## TASK-014 — Implementar cadastro de projeto

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-008, TASK-009, TASK-013

### Implementado

A rota `#/projects/new` possui formulário com campos obrigatórios e opcionais, tecnologias múltiplas, feedback de validação/erro e redirecionamento ao projeto criado.

### Critérios de aceite
- [x] formulário solicita nome, categoria e status como dados obrigatórios;
- [x] cliente, repositório, deploy e observações permanecem opcionais;
- [x] ID não é informado pelo usuário;
- [x] código persiste projeto válido pelo repositório Firestore;
- [x] sucesso e erro possuem fluxo visual;
- [x] após criação, a rota muda para o projeto criado;
- [x] criação validada em Firestore real.

---

## TASK-015 — Implementar página de detalhes do projeto

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-013

### Critérios de aceite
- [x] exibe identificação, categoria, status e cliente quando existente;
- [x] exibe repositório e deploy quando existentes;
- [x] exibe tecnologias associadas;
- [x] reserva seções para domínios e pendências;
- [x] exibe observações quando existentes;
- [x] campos opcionais ausentes não geram dados artificiais;
- [x] detalhe validado em execução real.

---

## TASK-016 — Implementar edição de projeto

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-014, TASK-015

### Implementado

A rota `#/projects/{id}/edit` reutiliza o formulário do cadastro e carrega os dados existentes.

### Critérios de aceite
- [x] dados atuais são carregados no formulário;
- [x] campos permitidos podem ser alterados;
- [x] ID não pode ser editado;
- [x] validações do cadastro também se aplicam à edição;
- [x] `updated_at` é atualizado pela camada Firestore;
- [x] cancelamento não persiste alterações;
- [x] edição validada em Firestore real.

---

## TASK-017 — Implementar arquivamento e restauração

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-015, TASK-016

### Implementado

- confirmação explícita antes de arquivar;
- `archived_at` com timestamp do servidor;
- rota `#/projects?archived=1`;
- restauração limpa `archived_at`;
- dados relacionados não são excluídos.

### Critérios de aceite
- [x] arquivamento exige ação explícita do usuário;
- [x] `archived_at` é preenchido;
- [x] dados relacionados permanecem preservados pelo fluxo;
- [x] projeto arquivado pode ser consultado em visão própria;
- [x] existe fluxo para restaurar projeto arquivado;
- [x] restauração limpa `archived_at`;
- [x] arquivamento/restauração validados em Firestore real.

---

## TASK-018 — Implementar tecnologias por projeto

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-010, TASK-015, TASK-016

### Critérios de aceite
- [x] formulário permite associar múltiplas tecnologias;
- [x] associação pode ser removida sem excluir a tecnologia;
- [x] tecnologias associadas aparecem nos detalhes;
- [x] projeto sem tecnologia continua válido;
- [x] associação validada em Firestore real.

---

## TASK-019 — Implementar links rápidos de repositório e deploy

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-015

### Critérios de aceite
- [x] links só aparecem quando cadastrados;
- [x] repositório e deploy possuem ações distintas;
- [x] URLs válidas podem ser abertas em nova aba;
- [x] ausência de link não gera placeholder enganoso;
- [x] comportamento validado em navegador.

---

## TASK-020 — Implementar validações do módulo de projetos

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-014, TASK-016

### Implementado

Validações estão em `domain/validation.js` e `services/project-service.js`. Testes unitários cobrem nome/campos obrigatórios, URLs e opcionais; o serviço impede categoria, status ou tecnologia inativos/inexistentes.

### Critérios de aceite
- [x] nome vazio ou apenas com espaços é rejeitado;
- [x] categoria inválida/inativa não pode ser atribuída pelo serviço;
- [x] status inválido/inativo não pode ser atribuído pelo serviço;
- [x] URLs preenchidas são validadas;
- [x] campos opcionais vazios não bloqueiam salvamento;
- [x] mensagens identificam o problema;
- [x] validações de relacionamento confirmadas contra Firestore real.
