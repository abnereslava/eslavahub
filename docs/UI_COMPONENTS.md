# Componentes Visuais — EslavaHub

**Task:** TASK-053

Este documento registra os primitives visuais compartilhados do EslavaHub. A implementação continua em CSS vanilla e não altera contratos de domínio ou persistência.

## Botões

Variantes atuais:
- `.button-primary` — ação principal;
- `.button-secondary` — ação neutra/secundária;
- `.button-danger` — ação destrutiva;
- `.button-small` — versão compacta.

Regras:
- altura padrão vem de `--control-default`;
- versão compacta usa `--control-compact`;
- foco usa o focus ring global;
- disabled nunca deve depender só de opacity para comunicar indisponibilidade.

## Campos

Inputs, selects e textareas usam:
- mesma família tipográfica;
- mesma altura base;
- `--color-border-strong` em repouso;
- `--color-focus` no foco;
- `--radius-md`.

Campos inline de planilha podem usar a versão compacta, mas mantêm o mesmo foco e tipografia.

## Icon buttons

Project links e ações de Pendências compartilham:
- alinhamento central;
- dimensões previsíveis;
- foco visível;
- estado disabled;
- transições curtas.

## Chips e badges

`tag`, `status-badge` e `filter-chip` usam:
- raio pill;
- texto curto;
- line-height compacto;
- cor semântica quando houver significado;
- nunca dependem exclusivamente de cor.

## Status

Status de projeto:
- Idealizado — neutro/cinza;
- Desenvolvendo — warning/amarelo;
- Funcional — info/azul;
- Finalizado — success/verde;
- Abandonado — danger/vermelho.

Status de pendência reutilizam as mesmas famílias semânticas sempre que o significado for equivalente.

## Toolbars

Toolbars devem:
- manter ações primárias estáveis;
- evitar deslocamento de controles ao expandir conteúdo secundário;
- usar progressive disclosure para filtros avançados;
- manter spacing baseado na escala oficial.

## Estados

Todo componente interativo deve contemplar, quando aplicável:
- default;
- hover;
- focus-visible;
- disabled;
- loading/progress;
- error.

## Regra de evolução

Novo componente visual deve primeiro tentar compor esses primitives e tokens. Criar uma nova variação só quando houver papel visual distinto.
