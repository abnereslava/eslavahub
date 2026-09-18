# M5 — Redesign Visual

**Escopo:** UX visual e design system  
**Regra:** não alterar comportamento funcional consolidado

Estado atual: fundação visual, componentes-base, shell, Dashboard, Detalhe, Pendências, Domínios e Cadastros já foram migrados. Projetos aguarda validação responsiva formal; revisão responsiva/acessibilidade e QA final permanecem pendentes.

---

## TASK-049 — Auditoria visual do sistema

**Status:** DONE  
**Prioridade:** P1

### Objetivo

Mapear inconsistências visuais antes de iniciar a substituição sistemática.

### Levantar

- cores duplicadas;
- espaçamentos inconsistentes;
- radius diferentes para o mesmo papel;
- alturas diferentes de controles equivalentes;
- padrões de botões;
- padrões de tabela;
- tamanhos tipográficos;
- sombras;
- borders;
- breakpoints;
- estados hover/focus/disabled.

### Aceite

- [x] inventário visual registrado;
- [x] itens classificados por componente/tela;
- [x] nenhuma mudança funcional realizada.

---

## TASK-050 — Criar design tokens do EslavaHub

**Status:** DONE  
**Prioridade:** P0  
**Dependência:** TASK-049

### Objetivo

Centralizar as decisões visuais fundamentais em CSS custom properties.

### Tokens

- cores;
- superfícies;
- texto;
- bordas;
- status;
- spacing;
- radius;
- sombra;
- tamanhos de controles;
- tipografia.

### Aceite

- [x] tokens definidos semanticamente;
- [x] documentação curta de uso;
- [x] componentes novos deixam de depender de valores hardcoded recorrentes.

---

## TASK-051 — Padronizar tipografia e hierarquia

**Status:** DONE  
**Prioridade:** P1  
**Dependência:** TASK-050

### Objetivo

Criar uma escala tipográfica pequena e previsível.

### Aceite

- [x] títulos de página consistentes;
- [x] títulos de seção consistentes;
- [x] body/secondary/meta definidos;
- [x] labels consistentes;
- [x] line-height e pesos revisados.

---

## TASK-052 — Padronizar spacing, radius, bordas e elevação

**Status:** DONE  
**Prioridade:** P1  
**Dependência:** TASK-050

### Objetivo

Reduzir a sensação de telas montadas por componentes independentes.

### Aceite

- [x] escala de spacing aplicada;
- [x] radius reduzido a poucos níveis;
- [x] bordas padronizadas;
- [x] sombras usadas apenas quando houver função de elevação.

---

## TASK-053 — Unificar componentes de interação

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-050 a TASK-052

### Componentes

- button;
- icon button;
- input;
- select;
- checkbox;
- chips;
- badges;
- status;
- toolbars;
- estados disabled/loading/focus.

### Aceite

- [x] alturas coerentes;
- [x] estados hover/focus/disabled coerentes;
- [x] variantes visuais documentadas;
- [x] acessibilidade por teclado preservada.

---

## TASK-054 — Redesenhar shell e navegação

**Status:** DONE  
**Prioridade:** P1  
**Dependência:** TASK-053

### Escopo

- topbar;
- marca;
- links principais;
- conta;
- largura útil;
- gutters;
- comportamento sticky;
- mobile.

### Aceite

- [x] navegação desktop consistente;
- [x] navegação mobile consistente;
- [x] nenhuma rota alterada;
- [x] logout e sessão preservados.

---

## TASK-055 — Redesenhar visualmente Dashboard

**Status:** DONE  
**Prioridade:** P1  
**Dependência:** TASK-054

### Escopo

- indicadores;
- listas;
- densidade;
- hierarchy;
- empty/loading/error.

### Aceite

- [x] mesmos dados;
- [x] mesmas ações;
- [x] melhor escaneabilidade;
- [x] sem alteração de cálculos do dashboard.

---

## TASK-056 — Refinar tabela e toolbar de Projetos

**Status:** DONE  
**Prioridade:** P0  
**Dependência:** TASK-053

### Escopo

- busca;
- filtros;
- ordenação;
- cabeçalho;
- linhas;
- status;
- links;
- domínio;
- paginação.

### Restrições

- manter filtros existentes;
- manter ordenações existentes;
- manter edição rápida de status;
- manter numeração dos projetos.

### Aceite

- [x] tabela visualmente consistente;
- [x] controles primários estáveis ao abrir filtros;
- [x] alinhamentos previsíveis;
- [x] desktop e mobile validados.

---

## TASK-057 — Refinar Detalhe do Projeto

**Status:** DONE  
**Prioridade:** P1  
**Dependência:** TASK-053

### Escopo

- overview;
- metadados;
- tecnologias;
- links;
- observações;
- domínios;
- ações.

### Aceite

- [x] layout compacto;
- [x] dados atuais preservados;
- [x] edição continua pela mesma rota;
- [x] arquivamento continua secundário e acessível.

---

## TASK-058 — Harmonizar Pendências, Domínios e Cadastros

**Status:** DONE  
**Prioridade:** P1  
**Dependência:** TASK-053

### Pendências

Preservar a grade editável inline.

### Domínios

Preservar vencimentos, alertas e ações existentes.

### Cadastros

Preservar criação/edição/ativação.

### Aceite

- [x] três áreas usam os mesmos padrões de tabela/formulário;
- [x] ações inline continuam disponíveis;
- [x] nenhum contrato de persistência é alterado.

---

## TASK-059 — Revisão responsiva e acessibilidade visual

**Status:** IN PROGRESS  
**Prioridade:** P0  
**Dependências:** TASK-054 a TASK-058

### Breakpoints

- 360;
- 390/430;
- 768;
- 1024;
- 1280;
- 1440+.

### Revisar

- overflow;
- áreas de toque;
- foco visível;
- contraste;
- labels;
- leitura sem depender somente de cor;
- ordem de tabulação;
- densidade em mobile.

### Implementado

- [x] breakpoints principais consolidados em 480/768/1024 px;
- [x] skip link para o conteúdo;
- [x] foco global com `:focus-visible`;
- [x] suporte a `prefers-reduced-motion`;
- [x] alvos de toque de 44 px em celular para ações críticas;
- [x] teste de contrato protege breakpoints e affordances principais;
- [x] contraste das combinações semânticas principais verificado;
- [ ] validação visual real em 360, 390/430, 768, 1024, 1280 e 1440+;
- [ ] navegação por teclado validada manualmente no app autenticado.

### Aceite

- [ ] telas principais validadas nos breakpoints;
- [ ] navegação por teclado utilizável validada em navegador;
- [ ] controles confirmados sem overflow em conteúdo real.

---

## TASK-060 — QA visual e regressão funcional do redesign

**Status:** IN PROGRESS  
**Prioridade:** P0  
**Dependência:** TASK-059

### Objetivo

Garantir que o redesign não tenha alterado comportamento consolidado.

### Verificar

- login/logout;
- dashboard;
- filtros;
- ordenação;
- status inline;
- links;
- criação/edição de projeto;
- domínios;
- pendências inline;
- arquivamento;
- categorias;
- tecnologias;
- mobile.

### Aceite

- [x] CI verde após os testes de regressão adicionados;
- [ ] fluxos existentes continuam funcionando no Firebase real;
- [x] nenhuma mudança de schema causada pelo redesign;
- [x] nenhuma mudança de regra de negócio causada pelo redesign;
- [x] nenhuma rota removida;
- [x] revisão visual aprovada.

Relatório: [`../REDESIGN_QA.md`](../REDESIGN_QA.md)
