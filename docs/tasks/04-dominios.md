# Tasks — Domínios

Este bloco implementa o controle de domínios associados aos projetos e seus vencimentos.

---

## TASK-027 — Implementar cadastro de domínio

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-011, TASK-015

### Critérios de aceite
- [ ] domínio pode ser adicionado a um projeto;
- [ ] hostname é obrigatório;
- [ ] data de expiração e observação são opcionais;
- [ ] projeto pode possuir mais de um domínio;
- [ ] domínio cadastrado aparece na ficha do projeto.

---

## TASK-028 — Implementar normalização e validação de hostname

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-027

### Critérios de aceite
- [ ] protocolo é removido quando informado;
- [ ] caminho e fragmentos indevidos não são armazenados como hostname;
- [ ] valor inválido é rejeitado com mensagem compreensível;
- [ ] hostname é armazenado em formato consistente;
- [ ] normalização possui testes automatizados.

---

## TASK-029 — Implementar domínio principal por projeto

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-027

### Critérios de aceite
- [ ] um domínio pode ser marcado como principal;
- [ ] no máximo um domínio fica como principal por projeto;
- [ ] ao trocar o principal, o anterior é desmarcado de forma consistente;
- [ ] domínio principal é identificado visualmente na ficha do projeto.

---

## TASK-030 — Implementar cálculo de vencimento

**Status:** TODO  
**Prioridade:** P0  
**Dependências:** TASK-027

### Objetivo
Aplicar a regra centralizada definida no SDD:

- mais de 30 dias: `NORMAL`;
- 16 a 30 dias: `ATTENTION`;
- 8 a 15 dias: `WARNING`;
- 0 a 7 dias: `URGENT`;
- abaixo de 0 dias: `EXPIRED`.

### Critérios de aceite
- [ ] dias restantes são calculados a partir da data corrente;
- [ ] classificação respeita todos os limites;
- [ ] domínio sem vencimento não recebe classificação temporal enganosa;
- [ ] regra fica centralizada fora dos componentes visuais;
- [ ] limites possuem testes de fronteira.

---

## TASK-031 — Implementar alertas visuais de domínio

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-030

### Critérios de aceite
- [ ] situação do domínio é visível na ficha do projeto;
- [ ] vencidos são claramente diferenciados;
- [ ] próximos do vencimento recebem destaque proporcional à situação;
- [ ] informação não depende apenas de cor;
- [ ] domínio sem vencimento é tratado separadamente.

---

## TASK-032 — Implementar visão/listagem de domínios

**Status:** TODO  
**Prioridade:** P1  
**Dependências:** TASK-030, TASK-031

### Critérios de aceite
- [ ] usuário consegue consultar domínios de todos os projetos;
- [ ] lista exibe projeto, hostname, vencimento e situação;
- [ ] itens podem ser ordenados por vencimento;
- [ ] vencidos e próximos do vencimento podem ser filtrados;
- [ ] cada domínio permite navegar para o projeto associado.
