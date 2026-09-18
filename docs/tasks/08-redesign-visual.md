# M5 — Redesign Visual

**Escopo:** UX visual e design system  
**Regra:** não alterar comportamento funcional consolidado

Todas as tasks deste marco começam como `TODO`.

---

## TASK-049 — Auditoria visual do sistema

**Status:** TODO  
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

- [ ] inventário visual registrado;
- [ ] itens classificados por componente/tela;
- [ ] nenhuma mudança funcional realizada.

---

## TASK-050 — Criar design tokens do EslavaHub

**Status:** TODO  
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

- [ ] tokens definidos semanticamente;
- [ ] documentação curta de uso;
- [ ] componentes novos deixam de depender de valores hardcoded recorrentes.

---

## TASK-051 — Padronizar tipografia e hierarquia

**Status:** TODO  
**Prioridade:** P1  
**Dependência:** TASK-050

### Objetivo

Criar uma escala tipográfica pequena e previsível.

### Aceite

- [ ] títulos de página consistentes;
- [ ] títulos de seção consistentes;
- [ ] body/secondary/meta definidos;
- [ ] labels consistentes;
- [ ] line-height e pesos revisados.

---

## TASK-052 — Padronizar spacing, radius, bordas e elevação

**Status:** TODO  
**Prioridade:** P1  
**Dependência:** TASK-050

### Objetivo

Reduzir a sensação de telas montadas por componentes independentes.

### Aceite

- [ ] escala de spacing aplicada;
- [ ] radius reduzido a poucos níveis;
- [ ] bordas padronizadas;
- [ ] sombras usadas apenas quando houver função de elevação.

---

## TASK-053 — Unificar componentes de interação

**Status:** TODO  
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

- [ ] alturas coerentes;
- [ ] estados hover/focus/disabled coerentes;
- [ ] variantes visuais documentadas;
- [ ] acessibilidade por teclado preservada.

---

## TASK-054 — Redesenhar shell e navegação

**Status:** TODO  
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

- [ ] navegação desktop consistente;
- [ ] navegação mobile consistente;
- [ ] nenhuma rota alterada;
- [ ] logout e sessão preservados.

---

## TASK-055 — Redesenhar visualmente Dashboard

**Status:** TODO  
**Prioridade:** P1  
**Dependência:** TASK-054

### Escopo

- indicadores;
- listas;
- densidade;
- hierarchy;
- empty/loading/error.

### Aceite

- [ ] mesmos dados;
- [ ] mesmas ações;
- [ ] melhor escaneabilidade;
- [ ] sem alteração de cálculos do dashboard.

---

## TASK-056 — Refinar tabela e toolbar de Projetos

**Status:** TODO  
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

- [ ] tabela visualmente consistente;
- [ ] controles primários estáveis ao abrir filtros;
- [ ] alinhamentos previsíveis;
- [ ] desktop e mobile validados.

---

## TASK-057 — Refinar Detalhe do Projeto

**Status:** TODO  
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

- [ ] layout compacto;
- [ ] dados atuais preservados;
- [ ] edição continua pela mesma rota;
- [ ] arquivamento continua secundário e acessível.

---

## TASK-058 — Harmonizar Pendências, Domínios e Cadastros

**Status:** TODO  
**Prioridade:** P1  
**Dependência:** TASK-053

### Pendências

Preservar a grade editável inline.

### Domínios

Preservar vencimentos, alertas e ações existentes.

### Cadastros

Preservar criação/edição/ativação.

### Aceite

- [ ] três áreas usam os mesmos padrões de tabela/formulário;
- [ ] ações inline continuam disponíveis;
- [ ] nenhum contrato de persistência é alterado.

---

## TASK-059 — Revisão responsiva e acessibilidade visual

**Status:** TODO  
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

### Aceite

- [ ] telas principais validadas nos breakpoints;
- [ ] navegação por teclado utilizável;
- [ ] controles não ficam inacessíveis por overflow.

---

## TASK-060 — QA visual e regressão funcional do redesign

**Status:** TODO  
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

- [ ] CI verde;
- [ ] fluxos existentes continuam funcionando;
- [ ] nenhuma mudança de schema;
- [ ] nenhuma mudança de regra de negócio;
- [ ] nenhuma rota removida;
- [ ] revisão visual aprovada.
