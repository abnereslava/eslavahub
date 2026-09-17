# Tasks — Persistência e Modelo de Dados

Estas tasks implementam as entidades e relações definidas no SDD.

---

## TASK-007 — Definir banco de dados e estratégia de persistência

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-001

### Critérios de aceite
- [ ] tecnologia de persistência definida;
- [ ] estratégia de migrations/schema definida;
- [ ] conexão local funcional;
- [ ] convenção para repositórios/acesso a dados definida;
- [ ] decisão registrada no SDD.

---

## TASK-008 — Implementar modelo `Project`

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-007

### Critérios de aceite
- [ ] campos obrigatórios e opcionais do SDD representados;
- [ ] ID gerado automaticamente e não reutilizado;
- [ ] `created_at`, `updated_at` e `archived_at` disponíveis;
- [ ] relacionamentos com categoria e status preparados;
- [ ] schema/migration aplicável em ambiente limpo.

---

## TASK-009 — Implementar modelos `Category` e `ProjectStatus`

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-007

### Critérios de aceite
- [ ] `Category` possui nome, estado ativo e timestamps;
- [ ] categorias ativas não permitem duplicidade de nome conforme regra definida;
- [ ] `ProjectStatus` possui nome, código estável, estado ativo e ordem;
- [ ] estados iniciais do SDD podem ser carregados;
- [ ] registros utilizados não dependem de exclusão destrutiva.

---

## TASK-010 — Implementar modelo `Technology` e relação N:N

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-007, TASK-008

### Critérios de aceite
- [ ] modelo `Technology` criado;
- [ ] um projeto aceita múltiplas tecnologias;
- [ ] uma tecnologia pode pertencer a múltiplos projetos;
- [ ] associação e remoção de associação não exigem excluir a tecnologia;
- [ ] tecnologias inativas continuam legíveis em projetos existentes.

---

## TASK-011 — Implementar modelo `Domain`

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-007, TASK-008

### Critérios de aceite
- [ ] domínio pertence a um projeto;
- [ ] hostname, vencimento opcional, domínio principal e observação disponíveis;
- [ ] modelo suporta múltiplos domínios por projeto;
- [ ] regra estrutural permite no máximo um principal por projeto;
- [ ] timestamps disponíveis.

---

## TASK-012 — Implementar modelo `PendingItem`

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-007, TASK-008

### Critérios de aceite
- [ ] pendência pertence obrigatoriamente a um projeto;
- [ ] descrição e status disponíveis;
- [ ] área, prioridade, prazo e notas opcionais disponíveis;
- [ ] `completed_at` disponível;
- [ ] timestamps disponíveis;
- [ ] estados definidos no SDD podem ser persistidos.
