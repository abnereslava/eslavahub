# Tasks — Persistência e Modelo de Dados

Estas tasks implementam as entidades e relações definidas no SDD usando Cloud Firestore. O formato persistido está documentado em `docs/FIRESTORE_MODEL.md`.

---

## TASK-007 — Definir banco de dados e estratégia de persistência

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-001

### Decisão

- banco: Cloud Firestore;
- isolamento: dados sob `/users/{uid}/...`;
- autorização: Firestore Security Rules;
- IDs: IDs de documentos gerados pelo Firestore;
- migrations: não há migration SQL; alterações de schema serão tratadas por contratos, defaults e scripts de migração quando necessários;
- acesso a dados: encapsulado em repositórios;
- caminhos privados: centralizados em `public/js/repositories/user-paths.js`;
- CRUD comum: centralizado em `public/js/repositories/firestore-repository.js`;
- regras e índices são versionados em `firestore.rules` e `firestore.indexes.json`.

### Critérios de aceite
- [x] tecnologia de persistência definida;
- [x] estratégia de migrations/schema definida;
- [x] conexão local funcional — **aguarda validação real em ambiente executável**;
- [x] convenção para repositórios/acesso a dados definida;
- [x] decisão registrada no SDD e em `docs/FIRESTORE_MODEL.md`.

### Para concluir

Após login local, executar uma leitura/escrita controlada no caminho do UID autenticado e confirmar que:

1. o próprio usuário possui acesso;
2. acesso fora de `/users/{uid}` é negado pelas Security Rules.

---

## TASK-008 — Implementar modelo `Project`

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-007

### Implementado

`public/js/repositories/project-repository.js` implementa criação, edição, arquivamento, restauração e associação de tecnologias.

### Critérios de aceite
- [x] campos obrigatórios e opcionais do SDD representados;
- [x] ID gerado automaticamente pelo Firestore;
- [x] `created_at`, `updated_at` e `archived_at` disponíveis;
- [x] relacionamentos com categoria e status representados por IDs;
- [x] contrato/modelo aplicável em base Firestore limpa sem migration prévia.

---

## TASK-009 — Implementar modelos `Category` e `ProjectStatus`

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-007

### Implementado

- `category-repository.js` mantém nome, chave normalizada, estado ativo e timestamps;
- nomes ativos duplicados são rejeitados pela camada de repositório;
- `project-status-repository.js` preserva código estável e permite desativação;
- `bootstrap-service.js` carrega os seis estados padrão no primeiro uso autenticado.

### Critérios de aceite
- [x] `Category` possui nome, estado ativo e timestamps;
- [x] categorias ativas não permitem duplicidade de nome conforme regra definida;
- [x] `ProjectStatus` possui nome, código estável, estado ativo e ordem;
- [x] estados iniciais do SDD podem ser carregados automaticamente;
- [x] registros utilizados não dependem de exclusão destrutiva.

---

## TASK-010 — Implementar modelo `Technology` e relação N:N

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-007, TASK-008

### Implementado

Tecnologias existem como documentos independentes. Projetos armazenam `technology_ids`, permitindo que a mesma tecnologia seja reutilizada por vários projetos sem duplicar ou excluir o cadastro.

### Critérios de aceite
- [x] modelo `Technology` criado;
- [x] um projeto aceita múltiplas tecnologias;
- [x] uma tecnologia pode pertencer a múltiplos projetos;
- [x] associação e remoção de associação não exigem excluir a tecnologia;
- [x] tecnologias inativas continuam legíveis em projetos existentes.

---

## TASK-011 — Implementar modelo `Domain`

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-007, TASK-008

### Implementado

`domain-repository.js` normaliza hostnames, vincula domínios a projetos, aceita vencimento opcional e utiliza batch para manter apenas um domínio principal por projeto quando a alteração passa pela camada de aplicação.

### Critérios de aceite
- [x] domínio pertence a um projeto;
- [x] hostname, vencimento opcional, domínio principal e observação disponíveis;
- [x] modelo suporta múltiplos domínios por projeto;
- [x] operação de domínio principal desmarca os demais do projeto;
- [x] timestamps disponíveis.

---

## TASK-012 — Implementar modelo `PendingItem`

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-007, TASK-008

### Implementado

`pending-item-repository.js` implementa criação, edição, conclusão, reabertura e descarte, incluindo atualização automática de `completed_at`.

### Critérios de aceite
- [x] pendência pertence obrigatoriamente a um projeto;
- [x] descrição e status disponíveis;
- [x] área, prioridade, prazo e notas opcionais disponíveis;
- [x] `completed_at` disponível;
- [x] timestamps disponíveis;
- [x] estados definidos no SDD podem ser persistidos.
