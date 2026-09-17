# Tasks — Persistência e Modelo de Dados

Estas tasks implementam as entidades e relações definidas no SDD usando Cloud Firestore.

---

## TASK-007 — Definir banco de dados e estratégia de persistência

**Status:** IN PROGRESS  
**Prioridade:** P0  
**Dependências:** TASK-001

### Decisão

- banco: Cloud Firestore;
- isolamento: dados sob `/users/{uid}/...`;
- autorização: Firestore Security Rules;
- IDs: IDs de documentos gerados pelo Firestore;
- migrations: não há migration SQL; alterações de schema serão tratadas por contratos, defaults e scripts de migração quando necessários;
- acesso a dados: encapsulado em repositórios;
- caminhos privados: centralizados inicialmente em `public/js/repositories/user-paths.js`;
- regras e índices são versionados em `firestore.rules` e `firestore.indexes.json`.

### Critérios de aceite
- [x] tecnologia de persistência definida;
- [x] estratégia de migrations/schema definida;
- [ ] conexão local funcional — **aguarda validação real em ambiente executável**;
- [x] convenção para repositórios/acesso a dados definida;
- [x] decisão registrada no SDD.

### Para concluir

Após login local, executar uma leitura/escrita controlada no caminho do UID autenticado e confirmar que:

1. o próprio usuário possui acesso;
2. acesso fora de `/users/{uid}` é negado pelas Security Rules.

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
- [ ] contrato/modelo aplicável em base limpa.

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
