# Design Tokens — EslavaHub

**Task:** TASK-050

Os tokens vivem em `public/css/styles.css`, no seletor `:root`, e são a fonte única para decisões visuais recorrentes.

## Grupos

### Tipografia

- `--font-sans`
- `--font-size-caption`
- `--font-size-label`
- `--font-size-body-sm`
- `--font-size-body`
- `--font-size-heading-sm`
- `--font-size-heading`
- `--font-size-metric`
- `--line-height-tight`
- `--line-height-body`

### Superfícies e texto

- `--color-canvas`
- `--color-surface`
- `--color-surface-subtle`
- `--color-surface-muted`
- `--color-text-strong`
- `--color-text`
- `--color-text-secondary`
- `--color-text-muted`

### Bordas e foco

- `--color-border`
- `--color-border-subtle`
- `--color-border-strong`
- `--color-focus`

### Semântica

- primary
- info
- success
- warning
- danger

Cada família semântica possui cor principal e, quando necessário, surface/border.

### Status de projeto

Existem tokens específicos de superfície para Idealizado, Desenvolvendo, Funcional, Finalizado e Abandonado. O texto continua obrigatório: cor nunca é o único indicador de status.

### Spacing

Escala principal: 4, 8, 12, 16, 20, 24, 32, 40, 48 e 64 px.

Novos componentes devem preferir essa escala antes de introduzir valores intermediários.

### Shape

- `--radius-sm`: elementos pequenos;
- `--radius-md`: controles e componentes compactos;
- `--radius-lg`: superfícies principais;
- `--radius-xl`: cards especiais;
- `--radius-pill`: badges/status.

### Controles

- `--control-compact`
- `--control-default`
- `--control-touch`

### Elevação

- `--shadow-sm`
- `--shadow-md`

Sombras são secundárias; borda e diferença de superfície devem resolver a maior parte da hierarquia.

## Regras de uso

1. não criar um novo tom neutro se um token existente representar o mesmo papel;
2. não usar cor semântica apenas por estética;
3. preferir tokens de papel (`text-muted`, `border`) a nomes puramente numéricos;
4. novos componentes devem usar os tokens desde a primeira implementação;
5. exceções de spacing/radius precisam existir por necessidade de layout, não por ajuste visual arbitrário;
6. breakpoints continuam sendo consolidados nas tasks seguintes.
