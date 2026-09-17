# Modelo de Persistência — Cloud Firestore

**Versão:** 0.1  
**Escopo:** MVP do EslavaHub

Este documento registra como o modelo conceitual do SDD é persistido no Cloud Firestore.

## Estrutura por usuário

Todos os dados privados ficam abaixo do UID do Firebase Authentication:

```text
users/{uid}/projects/{projectId}
users/{uid}/categories/{categoryId}
users/{uid}/statuses/{statusId}
users/{uid}/technologies/{technologyId}
users/{uid}/domains/{domainId}
users/{uid}/pendingItems/{pendingItemId}
```

As Firestore Security Rules restringem o acesso ao UID autenticado via Google.

## Convenções gerais

- IDs são IDs de documentos Firestore;
- IDs de projetos, categorias, tecnologias, domínios e pendências são gerados pelo Firestore;
- status padrão utilizam IDs determinísticos derivados do código estável;
- entidades principais possuem `created_at` e `updated_at` com timestamp do servidor;
- referências entre entidades são armazenadas como IDs, evitando dependência de caminhos globais;
- o MVP usa exclusão lógica/desativação quando o SDD exige preservação de histórico.

## `projects`

```text
name: string
category_id: string
status_id: string
repository_url: string | null
deploy_url: string | null
client_name: string | null
quick_notes: string | null
technology_ids: string[]
archived_at: timestamp | null
created_at: timestamp
updated_at: timestamp
```

A relação N:N com tecnologias é representada por `technology_ids` no projeto e documentos independentes em `technologies`.

## `categories`

```text
name: string
normalized_name: string
active: boolean
created_at: timestamp
updated_at: timestamp
```

`normalized_name` é utilizado pela camada de aplicação para impedir nomes ativos duplicados.

## `statuses`

```text
name: string
code: string
active: boolean
sort_order: number
created_at: timestamp
updated_at: timestamp
```

Status iniciais:

- `IDEALIZED`;
- `IN_DEVELOPMENT`;
- `FUNCTIONAL`;
- `FINISHED`;
- `PAUSED`;
- `ABANDONED`.

Os status são inicializados automaticamente no primeiro bootstrap autenticado do usuário.

## `technologies`

```text
name: string
normalized_name: string
active: boolean
created_at: timestamp
updated_at: timestamp
```

A tecnologia não é removida ao deixar de ser associada a um projeto.

## `domains`

```text
project_id: string
hostname: string
expiration_date: date/timestamp | null
is_primary: boolean
notes: string | null
created_at: timestamp
updated_at: timestamp
```

A camada de repositório normaliza `hostname` e, ao definir um domínio como principal, remove a marcação de principal dos demais domínios do mesmo projeto em um batch.

## `pendingItems`

```text
project_id: string
description: string
status: PENDING | IN_PROGRESS | WAITING | COMPLETED | DISCARDED
area: string | null
priority: LOW | MEDIUM | HIGH | null
due_date: date/timestamp | null
notes: string | null
completed_at: timestamp | null
created_at: timestamp
updated_at: timestamp
```

Ao concluir uma pendência, `completed_at` recebe timestamp do servidor. Ao reabrir ou descartar, `completed_at` volta a `null`.

## Repositórios de dados

A UI não acessa o Firestore diretamente. O acesso é centralizado em:

```text
public/js/repositories/firestore-repository.js
public/js/repositories/project-repository.js
public/js/repositories/category-repository.js
public/js/repositories/project-status-repository.js
public/js/repositories/technology-repository.js
public/js/repositories/domain-repository.js
public/js/repositories/pending-item-repository.js
```

Essa separação preserva o contrato do SDD e permite substituir a persistência no futuro sem espalhar chamadas ao SDK pelos componentes visuais.

## Migrações

O Firestore é schema-less e não utiliza migrations SQL. Mudanças estruturais futuras devem ser tratadas por:

1. versionamento explícito da modelagem nesta documentação;
2. defaults compatíveis para campos novos;
3. scripts de migração de documentos quando uma transformação de dados existentes for necessária;
4. testes antes de aplicar transformações em produção.
