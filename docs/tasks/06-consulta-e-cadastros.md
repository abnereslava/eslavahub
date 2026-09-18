# Tasks — Consulta e Cadastros Auxiliares

Este bloco torna o volume de projetos consultável e mantém os cadastros reutilizáveis do sistema. Busca, filtros, ordenação e paginação estão implementados na listagem de projetos e aguardam validação com dados reais.

---

## TASK-037 — Implementar busca textual de projetos

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-013

### Implementado

A busca textual da rota `#/projects` procura correspondência parcial, sem exigir texto exato, em nome, cliente e observações rápidas.

### Critérios de aceite
- [x] busca considera nome e cliente;
- [x] observações rápidas são incluídas;
- [x] busca vazia retorna a listagem padrão;
- [x] busca não exige correspondência exata;
- [x] ausência de resultados possui estado próprio com ação para limpar filtros;
- [x] busca validada com dados reais em navegador.

---

## TASK-038 — Implementar filtros combináveis

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-013, TASK-018, TASK-024

### Implementado

Filtros são representados na própria URL, permitindo navegação direta a uma consulta e combinação entre critérios.

### Critérios de aceite
- [x] filtro por categoria;
- [x] filtro por status;
- [x] filtro por cliente;
- [x] filtro por tecnologia;
- [x] filtro por existência de pendência aberta;
- [x] filtro ativo/arquivado;
- [x] múltiplos filtros podem ser combinados;
- [x] usuário consegue limpar os filtros;
- [x] combinação validada com dados reais.

---

## TASK-039 — Implementar ordenação e paginação/carregamento

**Status:** DONE  
**Prioridade:** P2  
**Dependências:** TASK-013

### Estratégia do MVP

A consulta carrega a coleção privada do usuário e aplica busca/filtros no cliente. O resultado é paginado em grupos de 20 itens na interface. Essa estratégia atende o volume inicial esperado; caso o volume cresça significativamente, a consulta deverá migrar para índices/queries Firestore paginadas sem alterar o contrato visual.

### Critérios de aceite
- [x] existe estratégia definida para listas crescentes;
- [x] ordenação por nome e atualização é suportada;
- [x] paginação de 20 itens não duplica registros na lógica implementada;
- [x] filtros e busca permanecem na URL durante a paginação;
- [x] layout da paginação possui adaptação para telas menores;
- [x] paginação/ordenação validadas com base real e navegador.

---

## TASK-040 — Implementar gestão de categorias

**Status:** DONE  
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
- [x] fluxo validado contra Firestore real.

---

## TASK-041 — Implementar gestão de tecnologias

**Status:** DONE  
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
- [x] fluxo validado contra Firestore real.
