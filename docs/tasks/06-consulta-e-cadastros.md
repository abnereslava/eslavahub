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

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-009

### Critérios de aceite
- [ ] usuário pode criar categoria;
- [ ] usuário pode renomear categoria respeitando unicidade;
- [ ] categoria pode ser desativada;
- [ ] categoria utilizada não é apagada destrutivamente no fluxo normal;
- [ ] categoria desativada permanece legível em projetos antigos;
- [ ] categoria desativada não aparece como opção padrão para novos projetos.

---

## TASK-041 — Implementar gestão de tecnologias

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-010

### Critérios de aceite
- [ ] usuário pode criar tecnologia;
- [ ] usuário pode editar nome conforme regras de unicidade definidas;
- [ ] tecnologia pode ser desativada;
- [ ] tecnologia utilizada não precisa ser excluída ao ser removida de um projeto;
- [ ] tecnologias desativadas permanecem legíveis em projetos existentes.
