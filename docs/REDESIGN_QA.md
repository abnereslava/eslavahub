# QA do Redesign — EslavaHub

**Tasks:** TASK-059 e TASK-060  
**Data:** 18/09/2026  
**Estado:** validação técnica concluída; validação visual autenticada ainda pendente

## 1. Responsividade revisada

Breakpoints consolidados no redesign:

- 480 px — celular;
- 768 px — tablet / mudança estrutural;
- 1024 px — tabela de projetos e layouts intermediários;
- acima disso — layout desktop fluido até a largura máxima de conteúdo.

Os cenários-alvo da documentação continuam sendo:

- 360 px;
- 390/430 px;
- 768 px;
- 1024 px;
- 1280 px;
- 1440+ px.

### Comportamentos protegidos

- navegação principal ganha rolagem horizontal quando necessário;
- tabela de Projetos vira estrutura vertical abaixo de 768 px;
- Pendências deixam a grade horizontal e viram linhas em formato de ficha abaixo de 768 px;
- formulários passam de duas colunas para uma;
- filtros avançados passam para uma coluna em celular;
- links Site/GitHub permanecem lado a lado;
- botões de ícone recebem alvo mínimo de toque de 44 px em celular;
- conteúdo principal mantém gutters mínimos em celular.

## 2. Acessibilidade

Implementado:

- foco global com `:focus-visible`;
- skip link “Pular para o conteúdo” no shell autenticado;
- `aria-current="page"` na navegação ativa;
- labels/aria-label existentes preservados;
- suporte a `prefers-reduced-motion: reduce`;
- alvos de toque de 44 px para controles principais em celular;
- status continuam identificados por texto além de cor;
- ícones indisponíveis possuem texto acessível via `aria-label`/title;
- filtros avançados usam `aria-expanded` e `aria-controls`.

## 3. Contraste da paleta principal

Verificação matemática WCAG das combinações mais recorrentes:

| Combinação | Contraste aproximado |
| --- | ---: |
| texto muted `#6b7280` / branco | 4.83:1 |
| texto secundário `#374151` / branco | 10.31:1 |
| warning `#92400e` / surface warning | 6.84:1 |
| info `#1d4ed8` / surface info | 6.16:1 |
| success `#166534` / surface success | 6.81:1 |
| danger `#991b1b` / surface danger | 7.60:1 |

As combinações verificadas superam 4.5:1, referência WCAG AA para texto normal.

## 4. Regressão automatizada adicionada

### `tests/ui-contract.test.js`

Protege:

- rotas principais Dashboard/Projetos/Domínios/Cadastros;
- rotas de criação e edição de projeto;
- skip navigation;
- focus-visible;
- breakpoints principais;
- reduced motion;
- status inline;
- filtros avançados;
- slots de links;
- domínio;
- edição inline de Pendências.

### `tests/repository-links.test.js`

Protege:

- chaves do enriquecimento contra projetos inexistentes;
- URLs GitHub canônicas;
- duplicidade de chaves/URLs;
- sobreposição entre vínculos confirmados e não resolvidos.

## 5. O que a automação NÃO comprova

Sem um navegador autenticado, os testes estáticos/CI não comprovam visualmente:

- composição real em 360, 390/430, 768, 1024, 1280 e 1440+;
- comportamento de teclado após autenticação em todas as telas;
- percepção visual de densidade;
- eventuais quebras causadas por conteúdo real especialmente longo;
- interação real com Firebase nos fluxos CRUD.

Esses pontos permanecem como validação manual final e não serão marcados como concluídos sem evidência.

## 6. Checklist manual final

No usuário principal, verificar:

1. Dashboard em desktop e celular;
2. Projetos com “Mais filtros” fechado/aberto;
3. status alterado inline;
4. Site/GitHub ativos e apagados;
5. abertura de projeto;
6. Pendências: concluir, reabrir, editar texto/status/prioridade/prazo;
7. Domínios;
8. Cadastros;
9. criação/edição/arquivamento de projeto;
10. navegação por Tab;
11. largura de 360–430 px em celular real ou DevTools.

## 7. Critério para fechamento

- TASK-059 pode ser concluída após a revisão visual dos breakpoints e teclado.
- TASK-060 pode ser concluída após os fluxos acima funcionarem no Firebase real e o CI permanecer verde.
