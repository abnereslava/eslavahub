# Tasks — Domínios

Este bloco implementa o controle de domínios associados aos projetos e seus vencimentos. As regras puras de normalização e vencimento já estão testadas; os fluxos com Firestore aguardam validação end-to-end.

---

## TASK-027 — Implementar cadastro de domínio

**Status:** IN PROGRESS  
**Prioridade:** P0  
**Dependências:** TASK-011, TASK-015

### Implementado

A ficha do projeto permite cadastrar múltiplos domínios com hostname obrigatório, vencimento opcional, observação e marcação de domínio principal.

### Critérios de aceite
- [x] domínio pode ser adicionado a um projeto pela UI implementada;
- [x] hostname é obrigatório;
- [x] data de expiração e observação são opcionais;
- [x] projeto pode possuir mais de um domínio;
- [x] domínio cadastrado aparece na ficha do projeto;
- [ ] cadastro validado contra Firestore real.

---

## TASK-028 — Implementar normalização e validação de hostname

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-027

### Implementado

A regra está centralizada em `public/js/domain/validation.js` e é utilizada pelo repositório de domínios.

### Critérios de aceite
- [x] protocolo é removido quando informado;
- [x] caminho, query e fragmento não são armazenados como hostname;
- [x] valor inválido é rejeitado com mensagem compreensível;
- [x] hostname é normalizado para formato consistente;
- [x] normalização possui testes automatizados;
- [x] testes passaram no GitHub Actions.

---

## TASK-029 — Implementar domínio principal por projeto

**Status:** IN PROGRESS  
**Prioridade:** P1  
**Dependências:** TASK-027

### Implementado

`DomainRepository.setPrimary()` utiliza batch do Firestore para marcar o domínio escolhido como principal e desmarcar os demais domínios do mesmo projeto. A ficha identifica visualmente o principal e permite trocar a seleção.

### Critérios de aceite
- [x] um domínio pode ser marcado como principal;
- [x] operação da camada de aplicação mantém no máximo um principal por projeto;
- [x] ao trocar o principal, o anterior é desmarcado no mesmo batch;
- [x] domínio principal é identificado visualmente;
- [ ] comportamento validado contra Firestore real.

---

## TASK-030 — Implementar cálculo de vencimento

**Status:** DONE  
**Prioridade:** P0  
**Dependências:** TASK-027

### Regra

- mais de 30 dias: `NORMAL`;
- 16 a 30 dias: `ATTENTION`;
- 8 a 15 dias: `WARNING`;
- 0 a 7 dias: `URGENT`;
- abaixo de 0 dias: `EXPIRED`.

A implementação está em `public/js/domain/domain-expiration.js`.

### Critérios de aceite
- [x] dias restantes são calculados a partir da data corrente;
- [x] classificação respeita todos os limites;
- [x] domínio sem vencimento não recebe classificação temporal enganosa;
- [x] regra fica centralizada fora dos componentes visuais;
- [x] limites possuem testes de fronteira;
- [x] testes passaram no GitHub Actions.

---

## TASK-031 — Implementar alertas visuais de domínio

**Status:** IN PROGRESS  
**Prioridade:** P1  
**Dependências:** TASK-030

### Implementado

A ficha e a listagem global apresentam rótulo textual (`Normal`, `Atenção`, `Alerta`, `Urgente` ou `Vencido`), dias restantes e destaque visual. Domínios sem data exibem `Sem vencimento`.

### Critérios de aceite
- [x] situação do domínio é visível na ficha do projeto;
- [x] vencidos são diferenciados;
- [x] próximos do vencimento recebem destaque proporcional;
- [x] informação não depende apenas de cor;
- [x] domínio sem vencimento é tratado separadamente;
- [ ] apresentação validada em navegador.

---

## TASK-032 — Implementar visão/listagem de domínios

**Status:** IN PROGRESS  
**Prioridade:** P1  
**Dependências:** TASK-030, TASK-031

### Implementado

A rota `#/domains` agrega domínios de todos os projetos, ordena por proximidade do vencimento e oferece filtros `Todos`, `Próximos` e `Vencidos`.

### Critérios de aceite
- [x] usuário consegue consultar domínios de todos os projetos na implementação;
- [x] lista exibe projeto, hostname, vencimento e situação;
- [x] itens são ordenados por vencimento;
- [x] vencidos e próximos do vencimento podem ser filtrados;
- [x] cada domínio permite navegar para o projeto associado;
- [ ] visão validada contra dados reais no Firestore e em navegador.
