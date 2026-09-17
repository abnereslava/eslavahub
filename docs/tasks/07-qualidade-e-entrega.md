# Tasks — Qualidade e Entrega

Este bloco prepara o EslavaHub para uma primeira versão utilizável e sustentável.

---

## TASK-042 — Implementar estados de carregamento, vazio e erro

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** módulos funcionais principais

### Critérios de aceite
- [ ] operações assíncronas relevantes possuem feedback de carregamento;
- [ ] listas vazias possuem mensagens/contexto apropriados;
- [ ] falhas de leitura e escrita possuem tratamento visível;
- [ ] mensagens não expõem segredos ou detalhes sensíveis;
- [ ] usuário consegue tentar novamente quando aplicável.

---

## TASK-043 — Revisar responsividade

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-013 a TASK-041

### Critérios de aceite
- [ ] dashboard utilizável em desktop e telas menores;
- [ ] formulários permanecem utilizáveis em telas estreitas;
- [ ] tabelas/listas possuem estratégia responsiva;
- [ ] ações principais não ficam inacessíveis por overflow;
- [ ] navegação permanece funcional em dispositivos móveis.

---

## TASK-044 — Revisar acessibilidade básica

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-013 a TASK-041

### Critérios de aceite
- [ ] campos possuem rótulos identificáveis;
- [ ] navegação principal pode ser utilizada por teclado;
- [ ] foco é perceptível;
- [ ] alertas de domínio não dependem exclusivamente de cor;
- [ ] botões e links possuem nomes compreensíveis;
- [ ] estrutura de títulos é coerente.

---

## TASK-045 — Implementar testes das regras de negócio críticas

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-020, TASK-024, TASK-028, TASK-030

### Critérios de aceite
- [ ] validações de projeto possuem cobertura automatizada adequada;
- [ ] transições de conclusão de pendência são testadas;
- [ ] normalização de hostname é testada;
- [ ] todas as fronteiras de vencimento são testadas;
- [ ] arquivamento não destrói relações;
- [ ] suíte pode ser executada por comando documentado.

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
- [ ] falhas encontradas nos testes são corrigidas ou registradas.

---

## TASK-047 — Preparar dados iniciais e estratégia de migração

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-007 a TASK-012

### Objetivo
Preparar o sistema para receber os dados que hoje estão na planilha sem tornar a importação automática um requisito do MVP.

### Critérios de aceite
- [ ] categorias iniciais definidas;
- [ ] status iniciais definidos;
- [ ] estratégia para inserir os projetos existentes documentada;
- [ ] mapeamento entre colunas da planilha e campos do sistema documentado;
- [ ] duplicidade de IDs antigos não compromete os IDs internos do EslavaHub;
- [ ] decisão entre cadastro manual, script único ou importação posterior registrada.

---

## TASK-048 — Configurar build e deploy do MVP

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-003, TASK-004, TASK-045

### Critérios de aceite
- [ ] build de produção conclui sem erro;
- [ ] ambiente de produção configurado;
- [ ] variáveis necessárias configuradas fora do repositório;
- [ ] aplicação publicada em endereço definido;
- [ ] persistência de produção funcional;
- [ ] mecanismo de acesso definido na TASK-002 aplicado;
- [ ] README contém instruções atualizadas de execução e acesso técnico.

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
