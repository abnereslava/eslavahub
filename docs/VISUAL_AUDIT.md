# Auditoria Visual — EslavaHub

**Task:** TASK-049  
**Data:** 18/09/2026  
**Escopo:** apresentação/CSS/markup visual; sem alteração de regras funcionais

---

## 1. Resumo executivo

A aplicação já possui uma base visual funcional, porém o CSS evoluiu de forma incremental e hoje apresenta sinais claros de dívida visual:

- valores de cor repetidos em vários arquivos;
- múltiplas escalas de spacing e radius;
- alturas diferentes para controles equivalentes;
- breakpoints muito fragmentados;
- regras antigas convivendo com overrides mais novos;
- estilos globais que interferem em componentes específicos;
- componentes semelhantes implementados separadamente;
- semântica visual de estados distribuída entre arquivos.

O redesign deve começar pela fundação e não por uma nova camada de overrides.

## 2. Arquivos auditados

CSS:
- public/css/styles.css
- public/css/dashboard.css
- public/css/projects.css
- public/css/catalogs.css
- public/css/pending-items.css
- public/css/domains.css

UI:
- public/js/ui/dashboard-ui.js
- public/js/ui/projects-ui.js
- public/js/ui/project-detail-ui.js
- public/js/ui/pending-items-ui.js
- public/js/ui/domains-ui.js
- public/js/ui/catalogs-ui.js

Entrada:
- public/index.html

## 3. Problemas encontrados

### 3.1 Cores hardcoded e duplicadas

As mesmas famílias neutras aparecem repetidas em vários arquivos: #111827, #1f2937, #374151, #4b5563, #6b7280, #9ca3af, #d1d5db, #e5e7eb, #f3f4f6 e #f9fafb.

As cores semânticas de sucesso, atenção, informação e perigo também são duplicadas.

**Risco:** qualquer mudança de tom exige editar vários arquivos e pode gerar divergência entre componentes.

**Ação:** centralizar em design tokens semânticos.

### 3.2 Status visuais definidos diretamente por componente

Projetos, pendências e domínios possuem sistemas próprios de cor: status-tone-*, pending-tone-* e domain-*.

**Risco:** conceitos equivalentes podem acabar usando cores diferentes sem intenção.

**Ação:** criar tokens semânticos para neutral, info, warning, success e danger, mantendo tokens específicos de status de projeto quando necessário.

### 3.3 Escala de radius inconsistente

Foram encontrados valores como 6, 7, 8, 9, 10, 12, 14, 16 e 999 px.

**Ação:** reduzir para poucos níveis: pequeno, médio, grande e pill.

### 3.4 Escala de spacing inconsistente

Há muitos valores próximos de padding/gap entre 3 e 64 px, sem uma escala explícita.

**Ação:** adotar uma escala curta e previsível, mantendo exceções somente quando justificadas pelo layout.

### 3.5 Alturas de controles divergentes

Foram encontradas alturas mínimas de 30, 32, 34, 36, 38, 40, 42 e 44 px.

**Ação:** definir control compact, control default e touch target mobile.

### 3.6 Tipografia sem escala formal

Há muitos tamanhos em rem muito próximos entre si, de 0.62rem a 0.90rem, além de tamanhos maiores específicos.

**Ação:** reduzir para papéis semânticos: caption, label, body-sm, body, heading-sm, heading e display/metric.

### 3.7 Breakpoints fragmentados

Foram encontrados breakpoints em 900, 820, 760, 720, 700, 600, 520, 480 e 420 px.

**Risco:** manutenção responsiva imprevisível.

**Direção:** padronizar principalmente 480, 768, 1024 e 1280 px, preservando exceções apenas quando um componente realmente precisar. A validação continuará incluindo 360, 390/430 e 1440+.

### 3.8 CSS acumulado por override

projects.css contém várias gerações do mesmo componente: status definidos mais de uma vez, layout de links redefinido, regras antigas de filtros avançados ainda presentes e fundos de status duplicados.

Isso já provocou regressões reais, como o conflito de uma regra global de span com os slots de links.

**Ação:** durante TASK-050 a TASK-053 consolidar a regra definitiva e remover blocos legados substituídos.

### 3.9 Componentes equivalentes implementados separadamente

Inputs, selects, botões, icon buttons, panels e headings de seção possuem pequenas variações próprias em diferentes módulos.

**Ação:** criar primitives visuais reutilizáveis, mesmo permanecendo em CSS vanilla.

### 3.10 Elevação excessiva para ferramenta operacional

Cards, panels e métricas usam sombras diferentes. A maior parte das telas é orientada a dados e não precisa de múltiplos níveis de elevação.

**Ação:** priorizar borda, superfície e spacing; reservar sombra para elementos realmente elevados.

### 3.11 Tabelas com padrões distintos

Projetos e Pendências usam estrutura tabular, enquanto Domínios e Cadastros ainda usam rows/cards próprios.

**Ação:** criar uma linguagem comum para header, row, cell, row actions, hover, disabled e responsive card conversion.

### 3.12 Estados de foco não uniformes

Alguns controles usam outline, outros box-shadow, outros border-color.

**Ação:** definir um único focus ring acessível.

## 4. Pontos positivos a preservar

- layout responsivo já existe;
- ações primárias e secundárias são distinguíveis;
- status possuem texto além da cor;
- filtros usam progressive disclosure;
- pendências possuem edição inline;
- projetos possuem tabela operacional;
- ícones têm labels acessíveis;
- áreas destrutivas ficam secundárias;
- loading/error/empty states já existem em vários módulos.

O redesign deve consolidar esses comportamentos, não substituí-los.

## 5. Prioridade de correção

### P0 — Fundação

1. design tokens;
2. tipografia;
3. spacing;
4. radius;
5. borders;
6. focus;
7. control heights.

### P1 — Componentes

1. buttons;
2. fields;
3. panels;
4. toolbar;
5. table primitives;
6. badges/status;
7. icon buttons.

### P2 — Aplicação por tela

1. shell;
2. projetos;
3. detalhe;
4. pendências;
5. domínios;
6. dashboard;
7. cadastros;
8. login.

## 6. Guard rail de implementação

Nenhuma correção identificada nesta auditoria exige alteração em Firestore, repositories, services, regras de negócio, autenticação, rotas ou migração.

Se surgir necessidade desse tipo, deve ser aberta task separada.

## 7. Resultado

A auditoria confirma que a prioridade correta é criar um design system leve em CSS antes de redesenhar telas isoladas.

**Próxima task:** TASK-050 — Criar design tokens do EslavaHub.
