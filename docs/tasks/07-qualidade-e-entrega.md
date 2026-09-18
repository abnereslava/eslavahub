# Tasks — Qualidade e Entrega

Este bloco prepara o EslavaHub para uso real. Parte relevante da qualidade estrutural já está implementada e coberta pelo GitHub Actions; revisões visuais e testes end-to-end permanecem dependentes de um navegador conectado ao Firebase real.

---

## TASK-042 — Implementar estados de carregamento, vazio e erro

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** módulos funcionais principais

### Implementado

- estados de carregamento nas principais rotas;
- estados vazios para projetos, pendências, domínios e cadastros;
- mensagens de erro separadas dos estados vazios;
- erros de autenticação possuem mensagem própria;
- formulários mantêm os dados após falha de escrita enquanto permanecem montados;
- dashboard possui ação explícita de tentar novamente.

### Critérios de aceite
- [x] operações assíncronas relevantes possuem feedback de carregamento;
- [x] listas vazias possuem mensagens/contexto apropriados;
- [x] falhas de leitura e escrita possuem tratamento visível;
- [x] mensagens não expõem segredos ou detalhes sensíveis;
- [x] comportamento de retry revisado em navegador com falhas reais/simuladas.

---

## TASK-043 — Revisar responsividade

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-013 a TASK-041

### Implementado

Existem media queries específicas para shell/topbar, projetos e filtros, formulários/detalhes, dashboard, cadastros, pendências, domínios e paginação. A revisão de código de 18/09/2026 reforçou navegação em duas colunas em celulares estreitos, alvos de toque mínimos, quebra de IDs/textos longos e largura adaptativa das ações.

### Critérios de aceite
- [x] dashboard possui adaptação para telas menores no CSS;
- [x] formulários mudam para uma coluna em telas estreitas;
- [x] listas possuem estratégia responsiva/empilhável;
- [x] ações principais possuem layout adaptável;
- [x] navegação possui layout mobile, inclusive para larguras estreitas;
- [x] controles principais possuem alvo de toque mínimo reforçado no CSS;
- [x] IDs e textos longos possuem quebra para reduzir overflow;
- [x] revisão visual real em desktop e celular;
- [x] confirmação de ausência de overflow horizontal indevido.

---

## TASK-044 — Revisar acessibilidade básica

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-013 a TASK-041

### Implementado

- formulários usam `label`/`fieldset`;
- navegação principal usa `nav` com rótulo;
- mensagens de erro relevantes usam `role="alert"`;
- conteúdo dinâmico principal usa `aria-live`;
- ações utilizam elementos nativos de HTML;
- alertas de domínio possuem texto, não apenas cor;
- estados possuem rótulos textuais.

### Critérios de aceite
- [x] campos possuem rótulos identificáveis;
- [x] ações principais usam controles semanticamente adequados;
- [x] alertas de domínio não dependem exclusivamente de cor;
- [x] botões e links possuem nomes compreensíveis;
- [x] estrutura de títulos foi organizada semanticamente na implementação;
- [x] navegação completa por teclado e foco revisados em navegador;
- [x] contraste revisado visualmente nas telas finais.

---

## TASK-045 — Implementar testes das regras de negócio críticas

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-020, TASK-024, TASK-028, TASK-030

### Cobertura automatizada

Os testes em `tests/` cobrem:

- campos obrigatórios de projeto;
- URLs válidas/inválidas;
- normalização e rejeição de hostname inválido;
- limites de classificação de vencimento;
- transição para `COMPLETED` e `completed_at`;
- saída de `COMPLETED` e limpeza de `completed_at`;
- rejeição de status inválido;
- patches de arquivamento/restauração alterando somente `archived_at`.

### Critérios de aceite
- [x] validações de projeto possuem cobertura automatizada adequada;
- [x] transições de conclusão de pendência são testadas;
- [x] normalização de hostname é testada;
- [x] todas as fronteiras de vencimento são testadas;
- [x] arquivamento não destrói relações por meio do patch aplicado;
- [x] suíte pode ser executada por comando documentado;
- [x] suíte passou no GitHub Actions em 17/09/2026.

---

## TASK-046 — Implementar testes dos fluxos principais

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-014 a TASK-041

### Critérios de aceite
- [ ] fluxo criar → visualizar → editar projeto é testado;
- [ ] fluxo criar → concluir pendência é testado;
- [ ] fluxo cadastrar domínio → classificar vencimento é testado;
- [ ] fluxo arquivar → consultar → restaurar projeto é testado;
- [ ] busca/filtros principais possuem verificação;
- [ ] Authentication e Security Rules entram no cenário de integração;
- [ ] falhas encontradas são corrigidas ou registradas.

Esta task depende da execução do app com Firebase real ou de uma suíte com Firebase Emulator configurada para Auth + Firestore.

---

## TASK-047 — Preparar dados iniciais e estratégia de migração

**Status:** DONE  
**Prioridade:** P1  
**Dependências:** TASK-007 a TASK-012

### Implementado

A planilha `Sites e aplicativos criados.xlsx` foi analisada e o plano está em `docs/MIGRATION_PLAN.md`.

Foram confirmados:

- 27 projetos na aba principal;
- 5 categorias legadas;
- 5 status utilizados;
- 3 tecnologias principais;
- duplicidade do ID legado `0024`.

Categorias e tecnologias da fonte foram incluídas no bootstrap inicial do usuário. A migração dos 27 projetos agora está implementada em `public/js/services/legacy-migration-service.js` e é executada de forma idempotente somente para o UID de destino.

### Critérios de aceite
- [x] categorias iniciais definidas;
- [x] status iniciais definidos;
- [x] estratégia para inserir projetos existentes documentada;
- [x] mapeamento entre colunas da planilha e campos do sistema documentado;
- [x] duplicidade de IDs antigos não compromete os IDs internos;
- [x] migração única implementada e protegida contra duplicação.

---

## TASK-048 — Configurar build e deploy do MVP

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-003, TASK-004, TASK-045

### Implementado

- `package.json` possui `npm run build`;
- GitHub Actions valida testes/lint;
- `.github/workflows/pages.yml` publica `public/` no GitHub Pages;
- `.firebaserc` identifica `eslavahub-434e5`;
- regras e índices Firestore estão versionados;
- execução e deploy estão documentados.

### Critérios de aceite
- [x] build/validação possui comando reproduzível;
- [x] workflow de GitHub Pages está configurado no repositório;
- [x] configuração pública necessária está centralizada;
- [x] aplicação publicada em endereço definido;
- [x] persistência de produção validada;
- [x] login Google validado no endereço publicado;
- [x] README/documentação possuem instruções técnicas.

Para concluir é necessário habilitar Pages com origem GitHub Actions nas configurações do repositório, autorizar `abnereslava.github.io` no Firebase Authentication e validar login/persistência no endereço publicado.

---

# Definition of Done do MVP

O MVP pode ser considerado tecnicamente entregue quando:

- as tasks P0 estiverem concluídas;
- as tasks P1 necessárias ao escopo descrito no SDD estiverem concluídas;
- não houver falha conhecida que impeça criar, consultar ou editar projetos;
- pendências e domínios puderem ser gerenciados;
- alertas de vencimento funcionarem de acordo com a regra documentada;
- dashboard apresentar dados coerentes com as listagens;
- testes críticos estiverem passando;
- a aplicação estiver disponível no ambiente de produção definido.
