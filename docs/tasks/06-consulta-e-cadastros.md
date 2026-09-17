# Tasks — Consulta e Cadastros Auxiliares

Este bloco torna o volume de projetos consultável e mantém os cadastros reutilizáveis do sistema.

---

## TASK-037 — Implementar busca textual de projetos

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-013

### Critérios de aceite
- [ ] busca considera ao menos nome e cliente;
- [ ] observações podem ser incluídas quando a estratégia de persistência permitir;
- [ ] busca vazia retorna a listagem padrão;
- [ ] busca não exige correspondência exata;
- [ ] ausência de resultados possui estado próprio.

---

## TASK-038 — Implementar filtros combináveis

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-013, TASK-018, TASK-024

### Critérios de aceite
- [ ] filtro por categoria;
- [ ] filtro por status;
- [ ] filtro por cliente;
- [ ] filtro por tecnologia;
- [ ] filtro por existência de pendência aberta;
- [ ] filtro ativo/arquivado;
- [ ] múltiplos filtros podem ser combinados;
- [ ] usuário consegue limpar os filtros.

---

## TASK-039 — Implementar ordenação e paginação/carregamento

**Status:** TODO  
**Prioridade:** P2  
**Dependências:** TASK-013

### Critérios de aceite
- [ ] existe estratégia definida para listas crescentes;
- [ ] ordenação por nome e atualização é suportada;
- [ ] paginação ou carregamento progressivo não duplica registros;
- [ ] filtros e busca permanecem consistentes durante a navegação;
- [ ] comportamento é adequado em telas menores.

---

## TASK-040 — Implementar gestão de categorias

**Status:** IN PROGRESS  
**Prioridade:** P1  
**Dependências:** TASK-009

### Implementado

A rota `#/catalogs/categories` permite criar, renomear, desativar e reativar categorias. O repositório mantém unicidade de nomes ativos e projetos antigos continuam exibindo categorias desativadas.

### Critérios de aceite
- [x] usuário pode criar categoria pela UI implementada;
- [x] usuário pode renomear categoria respeitando unicidade;
- [x] categoria pode ser desativada;
- [x] categoria utilizada não é apagada destrutivamente no fluxo normal;
- [x] categoria desativada permanece legível em projetos antigos;
- [x] categoria desativada não aparece como opção para novos projetos;
- [ ] fluxo validado contra Firestore real.

---

## TASK-041 — Implementar gestão de tecnologias

**Status:** IN PROGRESS  
**Prioridade:** P1  
**Dependências:** TASK-010

### Implementado

A rota `#/catalogs/technologies` permite criar, renomear, desativar e reativar tecnologias usando a mesma estrutura de cadastro auxiliar.

### Critérios de aceite
- [x] usuário pode criar tecnologia pela UI implementada;
- [x] usuário pode editar nome conforme regra de unicidade;
- [x] tecnologia pode ser desativada;
- [x] tecnologia utilizada não precisa ser excluída ao ser removida de um projeto;
- [x] tecnologias desativadas permanecem legíveis em projetos existentes;
- [ ] fluxo validado contra Firestore real.
